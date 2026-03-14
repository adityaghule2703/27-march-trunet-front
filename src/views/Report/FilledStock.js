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
  CModalFooter
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut, cilList, cilInfo } from '@coreui/icons';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { showError } from 'src/utils/sweetAlerts';
import SearchCenterStock from './SearchCenterStock';
import { formatDate } from 'src/utils/FormatDateTime';

const FilledStock = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({  product: '', center: '' });
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedItemSerials, setSelectedItemSerials] = useState([]);
  const [selectedItemInfo, setSelectedItemInfo] = useState(null);

  const dropdownRefs = useRef({});

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      
      if (searchParams.product) {
        params.append('product', searchParams.product);
      }
      if (searchParams.center) {
        params.append('center', searchParams.center);
      }
      params.append('page', page);
      const url = params.toString() ? `/reports/filledstock-report?${params.toString()}` : '/reports/filledstock-report';
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
  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchProducts();
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
    setActiveSearch({product: '', center: '' });
    setSearchTerm('');
    fetchData({},1);
  };

  // Group data by item (instead of flattening)
  const groupedData = data.map(item => ({
    ...item,
    uniqueKey: item._id
  }));

  const filteredData = groupedData.filter(item => {
    if (activeSearch.product || activeSearch.center) {
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

  const showSerialNumbers = (item) => {
    setSelectedItemInfo({
      productName: item.ProductName,
      customerName: item.CustomerName,
      centerName: item.CenterName,
      date: formatDate(item.CreatedAt)
    });
    setSelectedItemSerials(item.SerialNumbers || []);
    setSerialModalVisible(true);
  };

  const renderQtyWithSerialInfo = (item) => {
    const hasSerialNumbers = item.TrackSerialNumber === 'Yes' && item.SerialNumbers && item.SerialNumbers.length > 0;
    
    return (
      <div className="d-flex align-items-center">
        <span className="me-2">{item.Quantity}</span>
        {hasSerialNumbers && (
          <CButton 
            size="sm" 
            // color="info" 
            variant="ghost" 
            className="p-0"
            onClick={(e) => {
              e.stopPropagation();
              showSerialNumbers(item);
            }}
            style={{
              fontSize: '18px',
              cursor: 'pointer',
              color: '#337ab7'
            }}
            title="View Serial Numbers"
          >
            {/* <CIcon icon={cilInfo} /> */}
            ☰
          </CButton>
        )}
      </div>
    );
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

  const generateDetailExport = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      
      if (activeSearch.product) {
        params.append('product', activeSearch.product);
      }
      if (activeSearch.center) {
        params.append('center', activeSearch.center);
      }
       params.append('export','true');
      const apiUrl = params.toString() 
        ? `/reports/filledstock-report?${params.toString()}` 
        : '/reports/filledstock-report';
      
      const response = await axiosInstance.get(apiUrl);
      
      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }
  
      const exportData = response.data.data;
      
      if (!exportData || exportData.length === 0) {
        showError('No data available for export');
        return;
      }

      // For export, we need to flatten the data to show all serial numbers
      const flattenedExportData = exportData.flatMap(item => {
        if (item.SerialNumbers && item.SerialNumbers.length > 0) {
          return item.SerialNumbers.map(serial => ({
            ...item,
            serialNumber: serial.serialNumber,
            serialStatus: serial.status
          }));
        } else {
          return [{
            ...item,
            serialNumber: 'N/A',
            serialStatus: 'N/A'
          }];
        }
      });
  
      const headers = [
        'Date',
        'Center Name',
        'Customer Name',
        'Product Name',
        'Quantity',
        'Serial Number',
        'Shifting Date'
      ];
  
      const csvData = flattenedExportData.map(item => [
        formatDate(item.CreatedAt),
        item.CenterName || '',
        item.CustomerName || '',
        item.ProductName || '',
        item.Quantity || '',
        item.serialNumber || '',
        formatDate(item.ShiftingDate),
      ]);
  
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
      link.setAttribute('download', `filled_stock_${new Date().toISOString().split('T')[0]}.csv`);
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

  return (
    <div>
      <div className='title'>Field Stock</div>
    
      <SearchCenterStock
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
       products={products}
      />

      <CModal 
        visible={serialModalVisible} 
        onClose={() => setSerialModalVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
          Serial Numbers: {selectedItemInfo?.productName || 'Product'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedItemSerials.length > 0 ? (
            <CTable striped bordered hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Serial Number</CTableHeaderCell>
                  <CTableHeaderCell>Assigned Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {selectedItemSerials.map((serial, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{serial.serialNumber}</CTableDataCell>
                    <CTableDataCell>{formatDate(serial.assignedDate)}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <p>No serial numbers available</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setSerialModalVisible(false)}>
            Close
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
            {(activeSearch.product || activeSearch.center) && (
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
            </div>
            <div className='d-flex'>
              <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
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
               <CTableHeaderCell scope="col" onClick={() => handleSort('CreatedAt')} className="sortable-header">
                 Date {getSortIcon('CreatedAt')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('CenterName')} className="sortable-header">
                 Branch {getSortIcon('CenterName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('CustomerName')} className="sortable-header">
                  Customer {getSortIcon('CustomerName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('ProductName')} className="sortable-header">
                Product {getSortIcon('ProductName')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('Quantity')} className="sortable-header">
                  Qty {getSortIcon('Quantity')}
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" onClick={() => handleSort('ShiftingDate')} className="sortable-header">
                  Shifting Date {getSortIcon('ShiftingDate')}
                </CTableHeaderCell>
             </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredData.length > 0 ? (
                <>
                  {filteredData.map((item) => (
                    <CTableRow key={item.uniqueKey}>
                      <CTableDataCell>{formatDate(item.CreatedAt)}</CTableDataCell>
                      <CTableDataCell>
                          {item.CenterName || ''}
                      </CTableDataCell>
                      <CTableDataCell>{item.CustomerName}</CTableDataCell>
                      <CTableDataCell>
                         {item.ProductName}
                      </CTableDataCell>
                      <CTableDataCell>
                        {renderQtyWithSerialInfo(item)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {formatDate(item.ShiftingDate)}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </>
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="6" className="text-center">
                    No data found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default FilledStock;