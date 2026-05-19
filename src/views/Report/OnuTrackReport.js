import '../../css/table.css';
import '../../css/form.css';
import '../../css/profile.css'
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
  CModalHeader,
  CModalTitle,
  CModal,
  CModalBody,
  CModalFooter,
  CFormLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
import { CFormLabel as CFormLabelPro } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { showError, showSuccess } from 'src/utils/sweetAlerts';
import { formatDate } from 'src/utils/FormatDateTime';
import ONUSearch from './ONUSearch';

const OnuTrackReport = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [activeSearch, setActiveSearch] = useState({ 
    product: '', 
    status: '', 
    keyword: '', 
    reseller: ''
  });
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dropdownRefs = useRef({});
  
  const [selectedSerial, setSelectedSerial] = useState(null);
  const [serialHistory, setSerialHistory] = useState([]);
  const [serialModalVisible, setSerialModalVisible] = useState(false);

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      
      if (searchParams.product) {
        params.append('product', searchParams.product);
      }
      if (searchParams.status) {
        params.append('status', searchParams.status);
      }
      if (searchParams.keyword) {
        params.append('search', searchParams.keyword);
      }
      if (searchParams.reseller) {
        params.append('reseller', searchParams.reseller);
      }
      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate);
      }
      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate);
      }
      
      params.append('page', page);
      const url = `/reports/onu-report?${params.toString()}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setData(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
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
      console.error('Error fetching data:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get('/resellers');
      if (response.data.success) {
        setResellers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchProducts();
    fetchResellers();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, page);
  };

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
    fetchData(searchData, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ 
      product: '', 
      status: '', 
      keyword: '', 
      reseller: ''
    });
    setSearchTerm('');
    fetchData({}, 1);
  };

  const isSearchActive = () => {
    return activeSearch.product || 
           activeSearch.status || 
           activeSearch.keyword || 
           activeSearch.reseller ||
           activeSearch.startDate ||
           activeSearch.endDate;
  };

  const openExportModal = () => {
    setExportStartDate(activeSearch.startDate || '');
    setExportEndDate(activeSearch.endDate || '');
    setExportModalVisible(true);
  };

  const filteredData = data.filter(record => {
    if (isSearchActive()) {
      return true;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return Object.values(record).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue && nestedValue.toString().toLowerCase().includes(searchLower)
        );
      }
      return value && value.toString().toLowerCase().includes(searchLower);
    });
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      const newDropdownState = {};
      let shouldUpdate = false;
      
      Object.keys(dropdownRefs.current).forEach(key => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          newDropdownState[key] = false;
          shouldUpdate = true;
        }
      });
      
      if (shouldUpdate) {
        setDropdownOpen(prev => ({ ...prev, ...newDropdownState }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSerialClick = (serial, productId) => {
    const history = data.flatMap(record => 
      record.items
        .filter(item => item.serialNumbers && item.serialNumbers.some(sn => sn.serialNumber === serial))
        .map(item => ({
          date: record.date,
          transaction: 'Customer Usage',
          type: record.connectionType,
          useIn: record.usageType,
          product: item.product?.productTitle,
          centerFrom: record.center?.centerName,
          customer: record.customer?.name
        }))
    );
    setSelectedSerial(serial);
    setSerialHistory(history);
    setSerialModalVisible(true);
  };

  const generateDetailExport = async () => {
    try {
      setExportLoading(true);
      
      // Validate dates
      if (exportStartDate && exportEndDate && exportStartDate > exportEndDate) {
        showError('Start date cannot be greater than end date');
        setExportLoading(false);
        return;
      }
      
      const params = new URLSearchParams();
      
      if (activeSearch.product) {
        params.append('product', activeSearch.product);
      }
      if (activeSearch.status) {
        params.append('status', activeSearch.status);
      }
      if (activeSearch.keyword) {
        params.append('search', activeSearch.keyword);
      }
      if (activeSearch.reseller) {
        params.append('reseller', activeSearch.reseller);
      }
      
      // Use export modal date range (overrides active search dates)
      if (exportStartDate) {
        params.append('startDate', exportStartDate);
      }
      if (exportEndDate) {
        params.append('endDate', exportEndDate);
      }
      
      const apiUrl = `/reports/onu-report?${params.toString()}`;
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
        'Activation Date',
        'Customer',
        'Serial Number',
        'Connection Type',
        'Reseller Name',
        'Area',
        'Center',
        'ONU Amount',
      ];
  
      const csvData = exportData.flatMap(record => 
        record.items.flatMap(item => 
          (item.serialNumbers || []).map(serial => [
            formatDate(record.date),
            record.customer?.username || '',
            serial.serialNumber || serial,
            record.connectionType || '',
            record.center?.reseller?.businessName || '',
            record.center?.area?.areaName || '',
            record.center?.centerName || '',
            record.onuCharges || 0,
          ])
        )
      );
  
      // Create filename with date range if applied
      let filename = `ONU_Track_Report`;
      if (exportStartDate && exportEndDate) {
        filename += `_${exportStartDate}_to_${exportEndDate}`;
      } else if (exportStartDate) {
        filename += `_from_${exportStartDate}`;
      } else if (exportEndDate) {
        filename += `_until_${exportEndDate}`;
      } else {
        filename += `_${new Date().toISOString().split('T')[0]}`;
      }
      filename += '.csv';
  
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(field => {
            const stringField = String(field !== undefined && field !== null ? field : '');
            return `"${stringField.replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');
  
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const downloadUrl = URL.createObjectURL(blob);
      
      link.setAttribute('href', downloadUrl);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
      showSuccess('Export completed successfully!');
      setExportModalVisible(false);
      setExportStartDate('');
      setExportEndDate('');
    
    } catch (error) {
      console.error('Error generating export:', error);
      showError('Error generating export file');
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
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

  return (
    <div>
      <div className='title'>ONU Track Report</div>
    
      <ONUSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
        resellers={resellers}
      />

      {/* Export Modal */}
      <CModal visible={exportModalVisible} onClose={() => setExportModalVisible(false)} size="md">
        <CModalHeader>
          <CModalTitle>Export ONU Track Report</CModalTitle>
        </CModalHeader>
        
        <CModalBody>
          <div className="form-group mb-3">
            <CFormLabel htmlFor="exportStartDate">Start Date (Optional)</CFormLabel>
            <CFormInput
              type="date"
              id="exportStartDate"
              value={exportStartDate}
              onChange={(e) => setExportStartDate(e.target.value)}
              placeholder="Select start date"
            />
            <small className="text-muted">Leave empty to include all records from beginning</small>
          </div>
          
          <div className="form-group mb-3">
            <CFormLabel htmlFor="exportEndDate">End Date (Optional)</CFormLabel>
            <CFormInput
              type="date"
              id="exportEndDate"
              value={exportEndDate}
              onChange={(e) => setExportEndDate(e.target.value)}
              placeholder="Select end date"
            />
            <small className="text-muted">Leave empty to include all records until today</small>
          </div>

          {/* Show current filters summary */}
          {(activeSearch.product || activeSearch.status || activeSearch.reseller) && (
            <div className="mt-3 p-2 bg-light rounded">
              <strong>Current Filters:</strong>
              <ul className="mb-0 mt-1">
                {activeSearch.product && (
                  <li><small>Product: {products.find(p => p._id === activeSearch.product)?.productTitle}</small></li>
                )}
                {activeSearch.status && (
                  <li><small>Status: {activeSearch.status}</small></li>
                )}
                {activeSearch.reseller && (
                  <li><small>Reseller: {resellers.find(r => r._id === activeSearch.reseller)?.businessName}</small></li>
                )}
                {activeSearch.keyword && (
                  <li><small>Keyword: {activeSearch.keyword}</small></li>
                )}
              </ul>
            </div>
          )}
        </CModalBody>
        
        <CModalFooter>
          <CButton color="secondary" onClick={() => setExportModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={generateDetailExport} disabled={exportLoading}>
            {exportLoading ? (
              <>
                <CSpinner size="sm" className="me-1" />
                Exporting...
              </>
            ) : (
              <>
                <i className="fa fa-fw fa-file-excel me-1"></i>
                Export
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setSearchModalVisible(true)}
            >
              <CIcon icon={cilSearch} className='icon' /> Search
            </CButton>
            {isSearchActive() && (
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
              onClick={openExportModal}
              disabled={exportLoading || data.length === 0}
            >
              <i className="fa fa-fw fa-file-excel"></i>
              Export
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
          <div className="d-flex justify-content-between mb-3">
            <div>
              {(exportStartDate || exportEndDate) && (
                <div className="text-muted small">
                  {exportStartDate && `Export From: ${exportStartDate} `}
                  {exportEndDate && `To: ${exportEndDate}`}
                </div>
              )}
              <strong>Total Records: {filteredData.length}</strong>
            </div>
            <div className='d-flex'>
              <CFormLabelPro className='mt-1 m-1'>Search:</CFormLabelPro>
              <CFormInput
                type="text"
                style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                className="d-inline-block square-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                    Activation Date {getSortIcon('date')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('customer.username')} className="sortable-header">
                    Customer {getSortIcon('customer.username')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('items.product.productTitle')} className="sortable-header">
                    Product {getSortIcon('items.product.productTitle')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="sortable-header">
                    Serial Number
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="sortable-header">
                    Status
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('connectionType')} className="sortable-header">
                    Connection Type {getSortIcon('connectionType')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('center.reseller.businessName')} className="sortable-header">
                    Reseller Name {getSortIcon('center.reseller.businessName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('center.area.areaName')} className="sortable-header">
                    Area {getSortIcon('center.area.areaName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('onuCharges')} className="sortable-header">
                    ONU Amount {getSortIcon('onuCharges')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.flatMap(record =>
                      record.items.flatMap(item =>
                        (item.serialNumbers || []).map((serial, index) => (
                          <CTableRow key={`${record._id}-${item._id}-${serial.serialNumber || serial}-${index}`} 
                            className={serial.status === 'consumed' ? 'use-product-row' : 
                            serial.status === 'damaged' ? 'damage-product-row' : ''}
                          >
                            <CTableDataCell>
                              {formatDate(record.date)}
                            </CTableDataCell>
                            <CTableDataCell>
                              {record.customer?.username || ''}
                            </CTableDataCell>
                            <CTableDataCell>
                              {item.product?.productTitle || ''}
                            </CTableDataCell>
                            <CTableDataCell>
                              <button 
                                className="btn btn-link p-0 text-decoration-none"
                                style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                                onClick={() => handleSerialClick(serial.serialNumber || serial, item.product?.productId)}
                              >
                                {serial.serialNumber || serial}
                              </button>
                            </CTableDataCell>
                            <CTableDataCell>{serial.status || 'unknown'}</CTableDataCell>
                            <CTableDataCell>{record.connectionType || ''}</CTableDataCell>
                            <CTableDataCell>{record.center?.reseller?.businessName || ''}</CTableDataCell>
                            <CTableDataCell>{record.center?.area?.areaName || ''}</CTableDataCell>
                            <CTableDataCell>{record.onuCharges || 0}</CTableDataCell>
                          </CTableRow>
                        ))
                      )
                    )}
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="9" className="text-center">
                      No data found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
          <br />
          <span className='use_product'></span>&nbsp;Use Product
          <span className='damage_product'></span>&nbsp;Damage Product
        </CCardBody>
      </CCard>

      <CModal visible={serialModalVisible} onClose={() => setSerialModalVisible(false)} size="xl">
        <CModalHeader>
          <CModalTitle>Serial No. {selectedSerial} Track History</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Transaction</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Use In</CTableHeaderCell>
                  <CTableHeaderCell>Product</CTableHeaderCell>
                  <CTableHeaderCell>Branch</CTableHeaderCell>
                  <CTableHeaderCell>Customer</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {serialHistory.length > 0 ? (
                  serialHistory.map((row, idx) => (
                    <CTableRow key={idx}>
                      <CTableDataCell>{formatDate(row.date)}</CTableDataCell>
                      <CTableDataCell>{row.transaction}</CTableDataCell>
                      <CTableDataCell>{row.type}</CTableDataCell>
                      <CTableDataCell>{row.useIn}</CTableDataCell>
                      <CTableDataCell>{row.product}</CTableDataCell>
                      <CTableDataCell>{row.centerFrom}</CTableDataCell>
                      <CTableDataCell>{row.customer}</CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center">
                      No history found for this serial number
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
};

export default OnuTrackReport;