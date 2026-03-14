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
  CModalBody
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { showError } from 'src/utils/sweetAlerts';
import { formatDate } from 'src/utils/FormatDateTime';
import ProductSerialSearch from './ProductSerialSearch';

const ProductSerialTrack = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({  
    product: '', 
    status: '', 
    keyword: '' 
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
      
      params.append('page', page);
      const url = `/reports/serialreport?${params.toString()}`;
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
    setActiveSearch({ product: '', status: '', keyword: '' });
    setSearchTerm('');
    fetchData({}, 1);
  };

  const isSearchActive = () => {
    return activeSearch.product || activeSearch.status || activeSearch.keyword;
  };

  const filteredData = data.filter(item => {
    if (isSearchActive()) {
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

  const handleSerialClick = (serial) => {
    const history = data.filter((item) => item.Serial === serial);
    setSelectedSerial(serial);
    setSerialHistory(history);
    setSerialModalVisible(true);
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
      
      // Use activeSearch filters instead of fetching all data
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
     params.append('export','true'); 
      const apiUrl = `/reports/serialreport?${params.toString()}`;
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
        'Serial',
        'Purchase Center',
        'Center',
        'Product',
        'Product Code',
        'Product Price',
        'Status',
        'Current Location',
        'Action Date',
        'Vendor',
        'Invoice No',
        'Purchase Date'
      ];
  
      const csvData = exportData.map(item => [
        item.Serial || '',
        item.PurchaseCenter?.name || 'N/A',
        item.Center?.name || '',
        item.Product?.name || '',
        item.ProductCode || '',
        item.ProductPrice || '',
        item.Status || '',
        item.CurrentLocation?.name || '',
        formatDate(item.ActionDate),
        item.PurchaseInfo?.vendor?.name || '',
        item.PurchaseInfo?.invoiceNo || '',
        item.PurchaseInfo?.purchaseDate ? formatDate(item.PurchaseInfo.purchaseDate) : ''
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
      link.setAttribute('download', `product_serial_report_${new Date().toISOString().split('T')[0]}.csv`);
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
      <div className='title'>Product Serial Report</div>
    
      <ProductSerialSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
      />
      
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
              onClick={generateDetailExport}
              disabled={loading}
            >
              <i className="fa fa-fw fa-file-excel"></i>
              {loading ? 'Exporting...' : 'Export'}
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
              <strong>Total Records: {filteredData.length}</strong>
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
                  <CTableHeaderCell scope="col" onClick={() => handleSort('Serial')} className="sortable-header">
                    Serial {getSortIcon('Serial')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('PurchaseCenter.name')} className="sortable-header">
                    Purchase Branch {getSortIcon('PurchaseCenter.name')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('Center.name')} className="sortable-header">
                    Branch {getSortIcon('Center.name')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('Product.name')} className="sortable-header">
                    Product {getSortIcon('Product.name')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('ActionDate')} className="sortable-header">
                    Action At {getSortIcon('ActionDate')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.map((item) => (
                      <CTableRow key={item._id}
                        className={item.Status === 'consumed' ? 'use-product-row' : 
                        item.Status === 'damaged' ? 'damage-product-row' : ''}
                      >
                        <CTableDataCell>
                          <button 
                            className="btn btn-link p-0 text-decoration-none"
                            style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                            onClick={() => handleSerialClick(item.Serial)}
                          >
                            {item.Serial || ''}
                          </button>
                        </CTableDataCell>
                        <CTableDataCell>{item.PurchaseCenter?.name || ''}</CTableDataCell>
                        <CTableDataCell>{item.Center?.name || ''}</CTableDataCell>
                        <CTableDataCell>{item.Product?.name || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{formatDate(item.ActionDate || 0)}</CTableDataCell>
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
          <br />
          <span className='use_product'></span>&nbsp;Use Product
          <span className='damage_product'></span>&nbsp;Damage Product
        </CCardBody>
      </CCard>

      <CModal visible={serialModalVisible} onClose={() => setSerialModalVisible(false)} size="xl">
        <CModalHeader>
          <CModalTitle>Serial No.{selectedSerial} Track</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CTable striped bordered hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Transaction</CTableHeaderCell>
                <CTableHeaderCell>Type</CTableHeaderCell>
                <CTableHeaderCell>Use In</CTableHeaderCell>
                <CTableHeaderCell>Product</CTableHeaderCell>
                <CTableHeaderCell>Center From</CTableHeaderCell>
                <CTableHeaderCell>Center To</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {serialHistory.map((row, idx) => (
                <CTableRow key={idx}>
                  <CTableDataCell>{formatDate(row.ActionDate)}</CTableDataCell>
                  <CTableDataCell>{row.Status === 'consumed' ? 'user usage ':'indent'}</CTableDataCell>
                  <CTableDataCell>{row.ConsumptionDetails ? 'Used' : 'Transfer'}</CTableDataCell>
                  <CTableDataCell>{row.ConsumptionDetails?.usageType || '-'}</CTableDataCell>
                  <CTableDataCell>{row.Product?.name || '-'}</CTableDataCell>
                  <CTableDataCell>{row.PurchaseCenter?.name || '-'}</CTableDataCell>
                  <CTableDataCell>{row.Center?.name || '-'}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CModalBody>
      </CModal>
    </div>
  );
};

export default ProductSerialTrack;
