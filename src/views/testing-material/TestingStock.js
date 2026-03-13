import '../../css/table.css';
import '../../css/form.css';
import React, { useState, useRef, useEffect } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CSpinner,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilArrowTop, 
  cilArrowBottom, 
  cilSearch, 
  cilZoomOut, 
  cilInfo, 
  cilSettings,
  cilPencil,
  cilTrash
} from '@coreui/icons';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { 
  showError, 
  showSuccess, 
  confirmAction,
  showToast,
  confirmDelete 
} from 'src/utils/sweetAlerts';
import SearchCenterStock from '../Report/SearchCenterStock';
import { useNavigate } from 'react-router-dom';
import usePermission from 'src/utils/usePermission';

const TestingStock = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ 
    fromCenter: '', 
    toCenter: '', 
    product: '', 
    status: '' 
  });
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('open');
  const [expandedRows, setExpandedRows] = useState({});

  const dropdownRefs = useRef({});
  const navigate = useNavigate();
  
  const { hasPermission, hasAnyPermission } = usePermission();

  const statusFilters = {
    open: ['pending_testing', 'under_testing'],
    closed: ['completed', 'cancelled']
  };

  const fetchData = async (searchParams = {}, tab = activeTab, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (!searchParams.status) {
        const statuses = statusFilters[tab];
        statuses.forEach(status => {
          params.append('status', status);
        });
      } else {
        params.append('status', searchParams.status);
      }
      
      if (searchParams.fromCenter) {
        params.append('fromCenter', searchParams.fromCenter);
      }
      if (searchParams.toCenter) {
        params.append('toCenter', searchParams.toCenter);
      }
      if (searchParams.product) {
        params.append('product', searchParams.product);
      }
      params.append('page', page);
      const url = params.toString() ? `/testing-material?${params.toString()}` : '/testing-material';
      
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setData(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
        setExpandedRows({});
      } else {
        const errorMessage = response.data.message || 'API returned unsuccessful response';
        setError(errorMessage);
        console.error('Backend error:', response.data);
      }
    } catch (err) {
      if (err.response) {
        const errorMessage = err.response.data?.message || 
                            err.response.data?.error || 
                            `Error ${err.response.status}: ${err.response.statusText}`;
        setError(errorMessage);
        console.error('Error response:', err.response.data);
      } else if (err.request) {
        setError('No response received from server. Please check your network connection.');
        console.error('Error request:', err.request);
      } else {
        setError(err.message || 'An error occurred while fetching data');
        console.error('Error message:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers');
      if (response.data.success) {
        setCenters(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching centers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchProducts();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, activeTab, page);
  };

  useEffect(() => {
    fetchData(activeSearch, activeTab);
  }, [activeTab]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      let aValue = a;
      let bValue = b;
      
      if (key.includes('.')) {
        const keys = key.split('.');
        aValue = keys.reduce((obj, k) => obj && obj[k], a);
        bValue = keys.reduce((obj, k) => obj && obj[k], b);
      } else {
        aValue = a[key];
        bValue = b[key];
      }
      
      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending'
      ? <CIcon icon={cilArrowTop} className="ms-1" />
      : <CIcon icon={cilArrowBottom} className="ms-1" />;
  };

  const handleSearch = (searchData) => {
    setActiveSearch(searchData);
    fetchData(searchData, activeTab, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ 
      fromCenter: '', 
      toCenter: '', 
      product: '', 
      status: '' 
    });
    setSearchTerm('');
    fetchData({}, activeTab, 1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveSearch({ 
      fromCenter: '', 
      toCenter: '', 
      product: '', 
      status: '' 
    });
    setSearchTerm('');
  };

  const toggleRowExpand = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending_testing': { color: 'warning', label: 'Pending Testing' },
      'under_testing': { color: 'info', label: 'Under Testing' },
      'completed': { color: 'success', label: 'Completed' },
      'cancelled': { color: 'danger', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { color: 'secondary', label: status };
    return <CBadge color={config.color}>{config.label}</CBadge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClick = (itemId) => {
    navigate(`/testing-profile/${itemId}`);
  };

  const handleAcceptRequest = async (requestId, request) => {
    const result = await confirmAction(
      'Accept Testing Request',
      `Are you sure you want to accept this testing request?<br><br>
       <strong>Request:</strong> ${request.requestNumber || 'N/A'}<br>
       <strong>From:</strong> ${request.fromCenter?.centerName || 'N/A'}<br>
       <strong>To:</strong> ${request.toCenter?.centerName || 'N/A'}<br>
       <strong>Products:</strong> ${request.products?.length || 0}`,
      'question',
      'Yes, Accept'
    );
    
    if (result.isConfirmed) {
      try {
        setLoading(true);
        await axiosInstance.put(`/testing-material/${requestId}/accept`, {});
        showToast('Testing request accepted successfully!', 'success');
        fetchData(activeSearch, activeTab, currentPage);
      } catch (error) {
        console.error('Error accepting request:', error);
        showError(error.response?.data?.message || 'Failed to accept request');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCompleteTesting = async (requestId, request) => {
    const result = await confirmAction(
      'Complete Testing',
      `Are you sure you want to mark this testing as completed?<br><br>
       <strong>Request:</strong> ${request.requestNumber || 'N/A'}<br>
       <strong>From:</strong> ${request.fromCenter?.centerName || 'N/A'}<br>
       <strong>To:</strong> ${request.toCenter?.centerName || 'N/A'}<br>
       <strong>Status:</strong> ${request.status}`,
      'question',
      'Yes, Complete'
    );
    
    if (result.isConfirmed) {
      try {
        setLoading(true);
        // Update with your complete endpoint
        await axiosInstance.put(`/testing-material/${requestId}/complete`, {});
        showToast('Testing marked as completed successfully!', 'success');
        fetchData(activeSearch, activeTab, currentPage);
      } catch (error) {
        console.error('Error completing testing:', error);
        showError(error.response?.data?.message || 'Failed to complete testing');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(prev => {
      const isCurrentlyOpen = !!prev[id];
      const newState = {};
      if (!isCurrentlyOpen) {
        newState[id] = true;
      }
      return newState;
    });
  };

  const filteredData = data.filter(item => {
    if (activeSearch.fromCenter || activeSearch.toCenter || activeSearch.product || activeSearch.status) {
      return true;
    }
    
    return Object.values(item).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const generateDetailExport = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      
      if (activeSearch.fromCenter) {
        params.append('fromCenter', activeSearch.fromCenter);
      }
      if (activeSearch.toCenter) {
        params.append('toCenter', activeSearch.toCenter);
      }
      if (activeSearch.product) {
        params.append('product', activeSearch.product);
      }
      if (activeSearch.status) {
        params.append('status', activeSearch.status);
      } else {
        const statuses = statusFilters[activeTab];
        statuses.forEach(status => {
          params.append('status', status);
        });
      }
      
      const apiUrl = params.toString() 
        ? `/testing-material?${params.toString()}` 
        : '/testing-material';
      
      const response = await axiosInstance.get(apiUrl);
      
      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }
  
      const exportData = response.data.data;
      
      if (!exportData || exportData.length === 0) {
        showError('No data available for export');
        return;
      }
  
      const headers = [
        'Request Date',
        'Request Number',
        'From Center',
        'To Center',
        'Status',
        'Requested By',
        'Requested At',
        'Product Title',
        'Quantity',
        'Serial Numbers',
        'Test Result',
        'Remark'
      ];
  
      const csvData = exportData.flatMap(request => {
        if (!request.products || request.products.length === 0) {
          return [[
            formatDate(request.requestedAt),
            request.requestNumber,
            request.fromCenter?.centerName || 'N/A',
            request.toCenter?.centerName || 'N/A',
            request.status,
            request.requestedBy?.fullName || 'N/A',
            formatDateTime(request.requestedAt),
            'No Product',
            0,
            '',
            '',
            request.remark || ''
          ]];
        }
  
        return request.products.map(product => [
          formatDate(request.requestedAt),
          request.requestNumber,
          request.fromCenter?.centerName || 'N/A',
          request.toCenter?.centerName || 'N/A',
          request.status,
          request.requestedBy?.fullName || 'N/A',
          formatDateTime(request.requestedAt),
          product.product?.productTitle || '',
          product.quantity || 0,
          product.serialNumbers?.map(s => s.serialNumber).join(', ') || '',
          product.testResult || 'pending',
          product.remark || ''
        ]);
      });
  
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(field => {
            const stringField = String(field || '');
            return `"${stringField.replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');
  
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const downloadUrl = URL.createObjectURL(blob);
      
      link.setAttribute('href', downloadUrl);
      link.setAttribute('download', `testing_material_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    
    } catch (error) {
      console.error('Error generating export:', error);
      showError('Error generating export file');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = () => {
    navigate('/transfer-to-testing');
  };

  const handleTest = () => {
    navigate('/test-material');
  };

  if (loading && data.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  const renderTable = () => (
    <div className="responsive-table-wrapper">
      <CTable striped bordered hover className='responsive-table'>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col" onClick={() => handleSort('requestedAt')} className="sortable-header">
              Date {getSortIcon('requestedAt')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('requestNumber')} className="sortable-header">
              Request Number {getSortIcon('requestNumber')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('fromCenter.centerName')} className="sortable-header">
              From Center {getSortIcon('fromCenter.centerName')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('toCenter.centerName')} className="sortable-header">
              To Center {getSortIcon('toCenter.centerName')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('requestedBy.fullName')} className="sortable-header">
              Requested By {getSortIcon('requestedBy.fullName')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('status')} className="sortable-header">
              Status {getSortIcon('status')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
              Remarks
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
              Action
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredData.length > 0 ? (
            filteredData.flatMap((item) => [
              <CTableRow key={item._id}>
                <CTableDataCell>{formatDate(item.requestedAt)}</CTableDataCell>
                <CTableDataCell>
                  <button 
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => handleClick(item._id)}
                    style={{border: 'none', background: 'none', cursor: 'pointer', color: '#337ab7'}}
                  >
                    {item.requestNumber}
                  </button>
                </CTableDataCell>
                <CTableDataCell>
                  <div>{item.fromCenter?.centerName || ''}</div>
                </CTableDataCell>
                <CTableDataCell>
                  <div>{item.toCenter?.centerName || ''}</div>
                </CTableDataCell>
                <CTableDataCell>
                  {item.requestedBy?.fullName || 'N/A'} 
                  {item.requestedAt && ` At ${new Date(item.requestedAt).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: 'numeric',
                    hour12: true 
                  })}`}
                </CTableDataCell>
                <CTableDataCell>
                  {item.status && getStatusBadge(item.status)}
                </CTableDataCell>
                <CTableDataCell>{item.remark || ''}</CTableDataCell>
                <CTableDataCell>
                  {item.status === 'completed' || item.status === 'cancelled' ? null : (
                    <div
                      className="dropdown-container"
                      ref={el => dropdownRefs.current[item._id] = el}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CButton
                        size="sm"
                        className='option-button btn-sm'
                        onClick={() => toggleDropdown(item._id)}
                      >
                        <CIcon icon={cilSettings} />
                        Options
                      </CButton>
                      {dropdownOpen[item._id] && (
                        <div className="dropdown-menu show">
                          {item.status === 'pending_testing' && hasPermission('Testing Material', 'accept_testing_request') && (
                            <button
                              className="dropdown-item"
                              onClick={() => handleAcceptRequest(item._id, item)}
                            >
                              <CIcon icon={cilPencil} className="me-2" /> Accept
                            </button>
                          )}

                          {item.status === 'under_testing' && hasPermission('Testing Material', 'complete_testing') && (
                            <button
                              className="dropdown-item"
                              onClick={() => handleCompleteTesting(item._id, item)}
                            >
                              <CIcon icon={cilPencil} className="me-2" /> Complete
                            </button>
                          )}

                          {/* Add delete permission check when available */}
                          {/* {hasAnyPermission('Testing Material', ['delete_testing_request']) && (
                            <button className="dropdown-item" onClick={() => handleDeleteData(item._id)}>
                              <CIcon icon={cilTrash} className="me-2" /> Delete
                            </button>
                          )} */}
                        </div>
                      )}
                    </div>
                  )}
                </CTableDataCell>
              </CTableRow>,
              
              // Expanded row for product details
              expandedRows[item._id] && item.products?.map((product, index) => (
                <CTableRow key={`${item._id}-${index}`} className="table-light">
                  <CTableDataCell colSpan="2"></CTableDataCell>
                  <CTableDataCell colSpan="6">
                    <div className="ms-4">
                      <strong>Product {index + 1}:</strong> {product.product?.productTitle || 'N/A'}
                      <span className="ms-3">
                        <strong>Quantity:</strong> {product.quantity || 0}
                      </span>
                      <span className="ms-3">
                        <strong>Test Result:</strong> 
                        <span className={`ms-2 badge ${
                          product.testResult === 'passed' ? 'bg-success' :
                          product.testResult === 'failed' ? 'bg-danger' :
                          product.testResult === 'under_testing' ? 'bg-info' :
                          'bg-secondary'
                        }`}>
                          {product.testResult || 'pending'}
                        </span>
                      </span>
                      {product.serialNumbers?.length > 0 && (
                        <div className="mt-1">
                          <small>
                            <strong>Serials:</strong> {product.serialNumbers.length}
                            {product.serialNumbers.slice(0, 3).map(s => (
                              <span key={s._id} className="badge bg-light text-dark ms-1">
                                {s.serialNumber}
                              </span>
                            ))}
                            {product.serialNumbers.length > 3 && (
                              <span className="badge bg-secondary ms-1">
                                +{product.serialNumbers.length - 3} more
                              </span>
                            )}
                          </small>
                        </div>
                      )}
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))
            ])
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="8" className="text-center">
                No {activeTab} testing requests found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );

  return (
    <div>
      <div className='title'>Testing Material Requests</div>
      
      <SearchCenterStock
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
        statusOptions={[
          { value: 'pending_testing', label: 'Pending Testing' },
          { value: 'under_testing', label: 'Under Testing' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' }
        ]}
        customFields={[
          { name: 'fromCenter', label: 'From Center', type: 'select' },
          { name: 'toCenter', label: 'To Center', type: 'select' }
        ]}
      />
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {hasPermission('Testing Material', 'create_testing_request') && (
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={handleTransfer}
              >
                <i className="fa fa-fw fa-exchange"></i> New Transfer
              </CButton>
            )}
            {/* {hasPermission('Testing Material', 'create_testing_request') && ( */}
              <CButton 
                size="sm" 
                className="action-btn me-1"
                onClick={handleTest}
              >
                <i className="fa fa-fw fa-exchange"></i> Test Items
              </CButton>
            {/* )} */}
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setSearchModalVisible(true)}
            >
              <CIcon icon={cilSearch} className='icon' /> Search
            </CButton>
            {(activeSearch.fromCenter || activeSearch.toCenter || activeSearch.product || activeSearch.status) && (
              <CButton 
                size="sm" 
                color="secondary" 
                className="action-btn me-1"
                onClick={handleResetSearch}
              >
                <CIcon icon={cilZoomOut} className='icon' />
                Reset Search
              </CButton>
            )}
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={generateDetailExport}
              disabled={data.length === 0}
            >
              <i className="fa fa-fw fa-file-excel"></i> Detail Export
            </CButton>
          </div>
          
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CCardHeader>
        
        <CCardBody>
          <CNav variant="tabs" className="mb-3 border-bottom">
            <CNavItem>
              <CNavLink
                active={activeTab === 'open'}
                onClick={() => handleTabChange('open')}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 'open' ? '4px solid #2759a2' : '3px solid transparent',
                  color: 'black',
                  borderBottom: 'none'
                }}
              >
                Open
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'closed'}
                onClick={() => handleTabChange('closed')}
                style={{ 
                  cursor: 'pointer',
                  borderTop: activeTab === 'closed' ? '4px solid #2759a2' : '3px solid transparent',
                  borderBottom: 'none',
                  color: 'black'
                }}
              >
                Closed
              </CNavLink>
            </CNavItem>
          </CNav>

          <div className="d-flex justify-content-between mb-3">
            <div>
              <strong>Total:</strong> {data.length} | 
              <strong className="ms-3">Filtered:</strong> {filteredData.length}
            </div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
              <CFormInput
                type="text"
                style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!!(activeSearch.fromCenter || activeSearch.toCenter || activeSearch.product || activeSearch.status)}
                placeholder={activeSearch.fromCenter || activeSearch.toCenter || activeSearch.product || activeSearch.status ? "Disabled during advanced search" : "Search..."}
              />
            </div>
          </div>

          <CTabContent>
            <CTabPane visible={activeTab === 'open'}>
              {renderTable()}
            </CTabPane>
            <CTabPane visible={activeTab === 'closed'}>
              {renderTable()}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default TestingStock;