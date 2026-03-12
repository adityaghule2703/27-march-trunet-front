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
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilPlus, cilZoomOut } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import SearchStockPurchase from './SearchStockPurchase';
import Pagination from 'src/utils/Pagination';
import { showError } from 'src/utils/sweetAlerts';
import { formatDateTime } from 'src/utils/FormatDateTime';
import usePermission from 'src/utils/usePermission';

const StockPurchase = () => {
  const [customers, setCustomers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ 
    keyword: '', 
    outlet: '', 
    startDate: '', 
    endDate: '' 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dropdownRefs = useRef({});
  const navigate = useNavigate();

  const { hasPermission } = usePermission(); 

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchParams.keyword) {
        params.append('search', searchParams.keyword);
      }
      if (searchParams.outlet) {
        params.append('outlet', searchParams.outlet);
      }
      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate);
      }
      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate);
      }
      
      params.append('page', page);
      const url = params.toString() ? `/stockpurchase?${params.toString()}` : '/stockpurchase';
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setCustomers(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await axiosInstance.get('/centers/?centerType=Outlet');
      if (response.data.success) {
        setCenters(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCenters();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, page);
  };
  
  const calculateTotals = () => {
    const totals = {
      amount: 0,
      productAmount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 0
    };

    filteredCustomers.forEach(customer => {
      totals.amount += parseFloat(customer.transportAmount || 0);
      totals.productAmount += parseFloat(customer.productAmount || 0);
      totals.cgst += parseFloat(customer.cgst || 0);
      totals.sgst += parseFloat(customer.sgst || 0);
      totals.igst += parseFloat(customer.igst || 0);
      totals.total += parseFloat(customer.totalAmount || 0);
    });

    return totals;
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedCustomers = [...customers].sort((a, b) => {
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

    setCustomers(sortedCustomers);
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
      keyword: '', 
      outlet: '', 
      startDate: '', 
      endDate: '' 
    });
    setSearchTerm('');
    fetchData({}, 1);
  };

  const filteredCustomers = customers.filter(customer => {
    if (activeSearch.keyword || activeSearch.outlet || activeSearch.startDate || activeSearch.endDate) {
      return true;
    }
    return Object.values(customer).some(value => {
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(nestedValue => 
          nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
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
          {error}
      </div>
    );
  }

  const totals = calculateTotals();
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };
  const generateDetailExport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (activeSearch.keyword) {
        params.append('search', activeSearch.keyword);
      }
      if (activeSearch.outlet) {
        params.append('outlet', activeSearch.outlet);
      }
      if (activeSearch.startDate) {
        params.append('startDate', activeSearch.startDate);
      }
      if (activeSearch.endDate) {
        params.append('endDate', activeSearch.endDate);
      }
      const exportUrl = params.toString() 
        ? `/stockpurchase?${params.toString()}` 
        : '/stockpurchase';
      
      const response = await axiosInstance.get(exportUrl);
      
      if (!response.data.success || !response.data.data || response.data.data.length === 0) {
        showError('No data available for export');
        return;
      }

      const allData = response.data.data;
      
      const headers = [
        'Invoice No',
        'Vendor',
        'Transport Amount',
        'Created At',
        'Center Title',
        'Product Title',
        'Purchase Date',
        'Note',
        'Quantity',
        'Price',
        'Total Amount',
        'Type',
        'Status'
      ];

      const csvData = allData.flatMap(purchase => {
        if (purchase.products && purchase.products.length > 0) {
          return purchase.products.map(product => [
            purchase.invoiceNo,
            purchase.vendor?.businessName || 'N/A',
            purchase.transportAmount || 0,
            formatDateTime(purchase.createdAt),
            purchase.outlet?.centerName || 'N/A',
            product.product?.productTitle || 'N/A',
            formatDate(purchase.date),
            purchase.remark || '',
            product.purchasedQuantity || 0,
            product.price || 0,
            purchase.totalAmount || 0,
            purchase.type || 'N/A',
            purchase.status || 'N/A'
          ]);
        } else {
          return [[
            purchase.invoiceNo,
            purchase.vendor?.businessName || 'N/A',
            purchase.transportAmount || 0,
            formatDateTime(purchase.createdAt),
            purchase.outlet?.centerName || 'N/A',
            'No Product',
            formatDate(purchase.date),
            purchase.remark || '',
            0,
            0,
            purchase.totalAmount || 0,
            purchase.type || 'N/A',
            purchase.status || 'N/A'
          ]];
        }
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
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);

      let filename = `stock_purchase_${new Date().toISOString().split('T')[0]}`;
      if (activeSearch.keyword) filename += `_search_${activeSearch.keyword}`;
      if (activeSearch.outlet) {
        const outletName = centers.find(c => c._id === activeSearch.outlet)?.centerName || 'outlet';
        filename += `_${outletName}`;
      }
      if (activeSearch.startDate || activeSearch.endDate) {
        filename += `_date_${activeSearch.startDate || 'start'}_to_${activeSearch.endDate || 'end'}`;
      }
      filename += '.csv';
      
      link.setAttribute('download', filename);
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

  const handleClick = (itemId) => {
    navigate(`/edit-stockPurchase/${itemId}`);
  };

  const hasActiveFilters = activeSearch.keyword || activeSearch.outlet || activeSearch.startDate || activeSearch.endDate;

  return (
    <div>
      <div className='title'>Stock Purchase</div>
    
      <SearchStockPurchase
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
      />
      
      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            {hasPermission('Purchase', 'add_purchase_stock') && (
              <Link to='/add-stockPurchase'>
                <CButton size="sm" className="action-btn me-1">
                  <CIcon icon={cilPlus} className='icon'/> Add
                </CButton>
              </Link>
            )}
            <CButton 
              size="sm" 
              className="action-btn me-1"
              onClick={() => setSearchModalVisible(true)}
            >
              <CIcon icon={cilSearch} className='icon' /> Search
            </CButton>
            {hasActiveFilters && (
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
              Detail Export
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
                  <CTableHeaderCell scope="col" onClick={() => handleSort('outlet')} className="sortable-header">
                    Branch {getSortIcon('outlet')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                    Date {getSortIcon('date')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('invoiceNo')} className="sortable-header">
                    Invoice {getSortIcon('invoiceNo')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
                    Vendor {getSortIcon('vendor.businessName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('center.area.areaName')} className="sortable-header">
                    Trns. Amt. {getSortIcon('center.area.areaName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('transportAmount')} className="sortable-header">
                    Amount {getSortIcon('transportAmount')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('cgst')} className="sortable-header">
                    CGST {getSortIcon('cgst')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('sgst')} className="sortable-header">
                    SGST {getSortIcon('sgst')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('igst')} className="sortable-header">
                    IGST {getSortIcon('igst')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('totalAmount')} className="sortable-header">
                    Total {getSortIcon('totalAmount')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
                    Remark {getSortIcon('remark')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredCustomers.length > 0 ? (
                  <>
                    {filteredCustomers.map((customer) => (
                      <CTableRow key={customer._id}>
                        <CTableDataCell>
                          {customer.outlet?.centerName || ''}
                        </CTableDataCell>
                        <CTableDataCell>{formatDate(customer.date)}</CTableDataCell>
                        <CTableDataCell>
                          <button 
                            className="btn btn-link p-0 text-decoration-none"
                            onClick={() => handleClick(customer._id)}
                            style={{border: 'none', background: 'none', cursor: 'pointer', color:'#337ab7'}}
                          >
                            {customer.invoiceNo}
                          </button>
                        </CTableDataCell>
                        <CTableDataCell>{customer.vendor?.businessName || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{customer.transportAmount || 0}</CTableDataCell>
                        <CTableDataCell>{customer.productAmount}</CTableDataCell>
                        <CTableDataCell>{customer.cgst}</CTableDataCell>
                        <CTableDataCell>{customer.sgst}</CTableDataCell>
                        <CTableDataCell>{customer.igst}</CTableDataCell>
                        <CTableDataCell>{customer.totalAmount}</CTableDataCell>
                        <CTableDataCell>{customer.remark}</CTableDataCell>
                      </CTableRow>
                    ))}
                    <CTableRow className='total-row '>
                      <CTableDataCell colSpan="3">Total</CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell>{totals.amount.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.productAmount.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.cgst.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.sgst.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.igst.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.total.toFixed(2)}</CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                    </CTableRow>
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="11" className="text-center">
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

export default StockPurchase;