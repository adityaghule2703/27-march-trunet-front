import '../../css/table.css';
import '../../css/form.css';
import React, { useState, useEffect } from 'react';
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
  CSpinner,
  CFormLabel,
  CFormInput
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { showError } from 'src/utils/sweetAlerts';
import { formatDisplayDate } from 'src/utils/FormatDateTime';
import SearchIndentSummary from './SearchIndentSummary';
import { useNavigate } from 'react-router-dom';

const UsageSummary = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ 
    center: '', 
    product: '', 
    startDate: '', 
    endDate: '',
    usageType: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();


  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchParams.center) {
        params.append('center', searchParams.center);
      }
      if (searchParams.product) {
        params.append('product', searchParams.product);
      }
      if (searchParams.usageType) {
        params.append('usageType', searchParams.usageType);
      }
      if (searchParams.startDate && searchParams.endDate) {
        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month}-${day}`;
        };
        
        params.append('startDate', convertDateFormat(searchParams.startDate));
        params.append('endDate', convertDateFormat(searchParams.endDate));
      }
      params.append('page', page);
      
      const url = params.toString()
        ? `/reports/usages/summary?${params.toString()}`
        : '/reports/usages/summary';

      console.log('Fetching Usage URL:', url);
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        setData(response.data.data || []);
        setSummary(response.data.summary || null);
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
      console.error('Error fetching centers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products');
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
    fetchData(activeSearch, page);
  };

  const calculateTotals = () => {
    const totals = { TotalQuantity: 0 };
    data.forEach(item => {
      totals.TotalQuantity += parseFloat(item.TotalQuantity || 0);
    });
    return totals;
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      const aValue = key.split('.').reduce((o, k) => (o ? o[k] : ''), a);
      const bValue = key.split('.').reduce((o, k) => (o ? o[k] : ''), b);
      if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  const getSortIcon = (key) =>
    sortConfig.key === key ? (
      sortConfig.direction === 'ascending'
        ? <CIcon icon={cilArrowTop} className="ms-1" />
        : <CIcon icon={cilArrowBottom} className="ms-1" />
    ) : null;

  const handleSearch = (searchData) => {
    const mergedSearchData = {
      ...activeSearch,
      ...searchData
    };
    setActiveSearch(mergedSearchData);
    fetchData(mergedSearchData, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ 
      center: '', 
      product: '', 
      startDate: '', 
      endDate: '',
      usageType: ''
    });
    setSearchTerm('');
    fetchData({}, 1);
  };

  const isSearchActive = () => {
    return activeSearch.center || 
           activeSearch.product || 
           activeSearch.startDate || 
           activeSearch.endDate ||
           activeSearch.usageType 
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

  const totals = calculateTotals();
  
  const generateDetailExport = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      
      if (activeSearch.center) {
        params.append('center', activeSearch.center);
      }
      if (activeSearch.product) {
        params.append('product', activeSearch.product);
      }
      if (activeSearch.usageType) {
        params.append('usageType', activeSearch.usageType);
      }
      if (activeSearch.startDate && activeSearch.endDate) {
        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month}-${day}`;
        };
        
        params.append('startDate', convertDateFormat(activeSearch.startDate));
        params.append('endDate', convertDateFormat(activeSearch.endDate));
      }
       params.append('export','true');
      const apiUrl = params.toString()
        ? `/reports/usages/summary?${params.toString()}`
        : '/reports/usages/summary';
      
      const response = await axiosInstance.get(apiUrl);
      
      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }
  
      const exportData = response.data.data || [];
      
      if (!exportData || exportData.length === 0) {
        showError('No data available for export');
        return;
      }
  
      const headers = [
        'Center',
        'Product',
        'Total Quantity'
      ];
  
      const csvData = exportData.map(item => [
        item.Center || '',
        item.Product || '',
        item.TotalQuantity || 0
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
      link.setAttribute('download', `usage_summary_report_${new Date().toISOString().split('T')[0]}.csv`);
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const formattedMonth = summary?.period
    ? new Date(`${summary.period.split('/')[1]}-${summary.period.split('/')[0]}-01`).toLocaleString('default', { month: 'long', year: 'numeric' })
    : 'N/A';


    // const handleProductQuantityClick = (item) => {
    //   if (item && item.ProductId && item.CenterId) {
    //     navigate('/usage-detail', { 
    //       state: { 
    //         productId: item.ProductId,
    //         productName: item.Product,
    //         centerId: item.CenterId,
    //         centerName: item.Center,
    //         fromSummary: true
    //       }
    //     });
    //   }
    // };

const handleProductQuantityClick = (item) => {
  if (item && item.ProductId && item.CenterId) {
    navigate(`/usage-detail?product=${item.ProductId}&center=${item.CenterId}`);
  }
};
  return (
    <div>
      <div className='title'>Usage Summary Report</div>
      <SearchIndentSummary
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
                <CIcon icon={cilZoomOut} className='icon' /> Reset Search
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
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </CCardHeader>

        <CCardBody>
          <div className='summary-report'>
            <h4 className='summary-title'>Showing Result</h4>
            <ul className='summary-list'>
              {activeSearch.startDate && activeSearch.endDate ? (
                <li><strong>{formatDisplayDate(activeSearch.startDate, activeSearch.endDate)}</strong></li>
              ) : (
                <li><strong>Month:</strong> {formattedMonth}</li>
              )}
              
            </ul>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <div></div>
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
                  <CTableHeaderCell onClick={() => handleSort('Center')} className="sortable-header">
                    Branch {getSortIcon('Center')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('Product')} className="sortable-header">
                    Product {getSortIcon('Product')}
                  </CTableHeaderCell>
          
                  <CTableHeaderCell onClick={() => handleSort('TotalQuantity')} className="sortable-header">
                    Total Qty {getSortIcon('TotalQuantity')}
                  </CTableHeaderCell>
            
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.map((item, idx) => (
                      <CTableRow key={idx}>
                        <CTableDataCell>{item.Center || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{item.Product || 'N/A'}</CTableDataCell>
                        {/* <CTableDataCell>{item.TotalQuantity || 0}</CTableDataCell> */}
                        <CTableDataCell>
                        <button 
                            className="btn btn-link p-0 text-decoration-none"
                            style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                            onClick={() => handleProductQuantityClick(item)}
                          >
                            {item.TotalQuantity || 0}
                          </button>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                    <CTableRow className='total-row'>
                      <CTableDataCell colSpan="2">Total</CTableDataCell>
                      <CTableDataCell>{totals.TotalQuantity.toFixed(2)}</CTableDataCell>

                    </CTableRow>
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="6" className="text-center">No data found</CTableDataCell>
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

export default UsageSummary;