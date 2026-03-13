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
  CFormInput,
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { showError } from 'src/utils/sweetAlerts';
import { formatDate } from 'src/utils/FormatDateTime';
import CommonSearch from './CommonSearch';

const UsageReplace = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ keyword: '', center: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
      if (searchParams.startDate) {
        const [day, month, year] = searchParams.startDate.split('-');
        params.append('startDate', `${year}-${month}-${day}`);
      }
      
      if (searchParams.endDate) {
        const [day, month, year] = searchParams.endDate.split('-');
        params.append('endDate', `${year}-${month}-${day}`);
      }
      
      params.append('page', page);
      
      const url = `/reports/replace-report?${params.toString()}`;
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

      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';
      
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
      
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
    setActiveSearch({ product: '', center: '',startDate: '', endDate: '' });
    setSearchTerm('');
    fetchData({}, 1);
  };
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.usageType && item.usageType.toLowerCase().includes(searchLower)) ||
      (item.product?.productTitle && item.product.productTitle.toLowerCase().includes(searchLower)) ||
      (item.center?.centerName && item.center.centerName.toLowerCase().includes(searchLower)) ||
      (item.customerName && item.customerName.toLowerCase().includes(searchLower)) ||
      (item.buildingName && item.buildingName.toLowerCase().includes(searchLower)) ||
      (item.statusReason && item.statusReason.toLowerCase().includes(searchLower)) ||
      (item.oldSerialNumber && item.oldSerialNumber.toLowerCase().includes(searchLower)) ||
      (item.newSerialNumber && item.newSerialNumber.toLowerCase().includes(searchLower)) ||
      (item.replaceProductName && item.replaceProductName.toLowerCase().includes(searchLower))
    );
  });

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
        Error loading data: {error}
      </div>
    );
  }

  const fetchAllDataForExport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (activeSearch.center) {
        params.append('center', activeSearch.center);
      }
      
      if (activeSearch.product) {
        params.append('product', activeSearch.product);
      }
      
      if (activeSearch.startDate) {
        const [day, month, year] = activeSearch.startDate.split('-');
        params.append('startDate', `${year}-${month}-${day}`);
      }
      
      if (activeSearch.endDate) {
        const [day, month, year] = activeSearch.endDate.split('-');
        params.append('endDate', `${year}-${month}-${day}`);
      }
      const url = `/reports/replace-report?${params.toString()}`;
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      console.error('Error fetching data for export:', err);
      showError('Error fetching data for export');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const generateDetailExport = async () => {
    try {
      setLoading(true);
      
      const allData = await fetchAllDataForExport();
      
      if (!allData || allData.length === 0) {
        showError('No data available for export');
        return;
      }
  
      const headers = [
        'Date',
        'Type',
        'Center',
        'Product',
        'Product Type',
        'Replace For (Old Serial)',
        'Replace Product Name',
        'Quantity',
        'Damage Quantity',
        'User/Building',
        'Mobile',
        'Status',
        'New Serial Number',
        'Reason'
      ];
  
      const csvData = allData.map(item => [
        formatDate(item.date || ''),
        item.usageType || '',
        item.center?.centerName || '',
        item.product?.productTitle || '',
        item.productType || '',
        item.replaceFor || '',
        item.replaceProductName || '',
        item.qty || 0,
        item.damageQty || 0,
        item.buildingName || item.customerName || '',
        item.mobile || '',
        item.connectionType || '',
        item.newSerialNumber || '',
        item.reason || ''
      ]);
  
      const csvContent = [
        headers.join(','),
        ...csvData.map(row =>
          row
            .map(field => {
              const stringField = String(field ?? '');
              return `"${stringField.replace(/"/g, '""')}"`;
            })
            .join(',')
        )
      ].join('\n');
  
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Usage_Replace_Report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating export:', error);
      showError('Error generating export file');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const totals = {
      totalQty: 0,
      totalDamageQty: 0
    };
  
    filteredData.forEach(item => {
      totals.totalQty += parseFloat(item.qty || 0);
      totals.totalDamageQty += parseFloat(item.damageQty || 0);
    });
  
    return totals;
  };

  const totals = calculateTotals();

  return (
    <div>
      <div className='title'>Usage Replace Report</div>
      <CommonSearch
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
            {(activeSearch.product || activeSearch.center || activeSearch.startDate ||     activeSearch.endDate) && (
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
                  <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                    Date {getSortIcon('date')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('usageType')} className="sortable-header">
                   Type {getSortIcon('usageType')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
                    Branch {getSortIcon('center.centerName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('product.productTitle')} className="sortable-header">
                    Product {getSortIcon('product.productTitle')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('replaceProductName')} className="sortable-header">
                    Product Type {getSortIcon('replaceProductName')}
                  </CTableHeaderCell>
                
                  <CTableHeaderCell scope="col" onClick={() => handleSort('qty')} className="sortable-header">
                    Qty {getSortIcon('qty')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('damageQty')} className="sortable-header">
                    Damage Qty {getSortIcon('damageQty')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('buildingName')} className="sortable-header">
                    User/Building{getSortIcon('buildingName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('mobile')} className="sortable-header">
                    Mobile {getSortIcon('mobile')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('connectionType')} className="sortable-header">
                    Status {getSortIcon('connectionType')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('reason')} className="sortable-header">
                  Reason {getSortIcon('reason')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.map((item) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>
                          {formatDate(item.date)}
                        </CTableDataCell>
                        <CTableDataCell>{item.usageType}</CTableDataCell>
                        <CTableDataCell>{item.center?.centerName}</CTableDataCell>
                        <CTableDataCell>{item.product?.productTitle}</CTableDataCell>
                        <CTableDataCell> Replace for {item.replaceProductName}</CTableDataCell>
                        <CTableDataCell>{item.qty}</CTableDataCell>
                        <CTableDataCell>{item.damageQty}</CTableDataCell>
                        <CTableDataCell>
                        <button 
                        className="btn btn-link p-0 text-decoration-none"
                        style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                      >
                        {item.buildingName || ''}{item.customerName || ''}
                        </button>
                        </CTableDataCell>
                        <CTableDataCell>{item.mobile || ''}</CTableDataCell>
                        <CTableDataCell>{item.connectionType}</CTableDataCell>
                        <CTableDataCell>{item.reason}</CTableDataCell>
                      </CTableRow>
                    ))}
                    <CTableRow className='total-row'>
                      <CTableDataCell colSpan="5" className="text-start"><strong>Total Count</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.totalQty}</strong></CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell colSpan="5"></CTableDataCell>
                    </CTableRow>
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="14" className="text-center">
                      No replacement records found
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

export default UsageReplace;