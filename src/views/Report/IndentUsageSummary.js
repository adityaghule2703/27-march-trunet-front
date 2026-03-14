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
import IndentUsageSummarySearch from './IndentUsageSummarySearch';
import { useNavigate } from 'react-router-dom';

const IndentUsageSummary = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState(null);
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
    month: '',
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
        params.append('centerId', searchParams.center);
      }
      if (searchParams.product) {
        params.append('productId', searchParams.product);
      }
      if (searchParams.month) {
        const [year, month] = searchParams.month.split('-');
        params.append('month', month);
        params.append('year', year);
      }
      
      params.append('page', page);
      
      const url = params.toString()
        ? `/reports/indent-usage-summary?${params.toString()}`
        : '/reports/indent-usage-summary';

      console.log('Fetching Usage Summary URL:', url);
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        setData(response.data.data || []);
        setSummary(response.data.summary || null);
        setFilters(response.data.filters || null);
        setCurrentPage(response.data.pagination?.currentPage || 1);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        const errorMessage = response.data.message || 'API returned unsuccessful response';
      setError(errorMessage);
      console.error('Backend error:', response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
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
    fetchData(activeSearch, page);
  };

  const calculateTotals = () => {
    const totals = {
      opening: 0,
      purchase: 0,
      distributed: 0,
      transferReceive: 0,
      // replaceReturn: 0,
      return:0,
      usage: 0,
      transferGiven: 0,
      nc: 0,
      convert: 0,
      shifting: 0,
      buildingUsage: 0,
      buildingDamage: 0,
      other: 0,
      return: 0,
      repair: 0,
      damage: 0,
      replaceDamage: 0,
      stolenCenter: 0,
      stolenField: 0,
      closing: 0
    };

    data.forEach(item => {
      totals.opening += parseFloat(item.opening || 0);
      totals.purchase += parseFloat(item.purchase || 0);
      totals.distributed += parseFloat(item.distributed || 0);
      totals.transferReceive += parseFloat(item.transferReceive || 0);
      // totals.replaceReturn += parseFloat(item.replaceReturn || 0);
      totals.return += parseFloat(item.return || 0);
      totals.usage += parseFloat(item.usage || 0);
      totals.transferGiven += parseFloat(item.transferGiven || 0);
      totals.nc += parseFloat(item.nc || 0);
      totals.convert += parseFloat(item.convert || 0);
      totals.shifting += parseFloat(item.shifting || 0);
      totals.buildingUsage += parseFloat(item.buildingUsage || 0);
      totals.buildingDamage += parseFloat(item.buildingDamage || 0);
      totals.other += parseFloat(item.other || 0);
      totals.return += parseFloat(item.return || 0);
      totals.repair += parseFloat(item.repair || 0);
      totals.damage += parseFloat(item.damage || 0);
      totals.replaceDamage += parseFloat(item.replaceDamage || 0);
      totals.stolenCenter += parseFloat(item.stolenCenter || 0);
      totals.stolenField += parseFloat(item.stolenField || 0);
      totals.closing += parseFloat(item.closing || 0);
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
      const aValue = a[key] || '';
      const bValue = b[key] || '';
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
      month: '',
    });
    setSearchTerm('');
    fetchData({}, 1);
  };

  const isSearchActive = () => {
    return activeSearch.center || 
           activeSearch.product || 
           activeSearch.month;
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
        params.append('centerId', activeSearch.center);
      }
      if (activeSearch.product) {
        params.append('productId', activeSearch.product);
      }
      if (activeSearch.startDate && activeSearch.endDate) {
        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month}-${day}`;
        };
      }
      if (activeSearch.month) {
        const [year, month] = activeSearch.month.split('-');
        params.append('month', month);
        params.append('year', year);
      }
       params.append('export','true');
      const apiUrl = params.toString()
        ? `/reports/indent-usage-summary?${params.toString()}`
        : '/reports/indent-usage-summary';
      
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
        'Center Name',
        'Center Code',
        'Product Name',
        'Opening',
        'Purchase',
        'Distributed',
        'Transfer Receive',
        'Replace Return',
        'Usage',
        'Transfer Given',
        'NC',
        'Convert',
        'Shifting',
        'Building new usage',
        'Building Damage',
        'Other',
        'Return',
        'Repair',
        'Damage',
        'Replace Damage',
        'Stolen Center',
        'Stolen Field',
        'Closing'
      ];
  
      const csvData = exportData.map(item => [
        item.center?.name || '',
        item.center?.code || '',
        item.productName || '',
        item.opening || 0,
        item.purchase || 0,
        item.distributed || 0,
        item.transferReceive || 0,
        // item.replaceReturn || 0,
        item.return || 0,
        item.usage || 0,
        item.transferGiven || 0,
        item.nc || 0,
        item.convert || 0,
        item.shifting || 0,
        item.buildingUsage || 0,
        item.buildingDamage || 0,
        item.other || 0,
        item.return || 0,
        item.repair || 0,
        item.damage || 0,
        item.replaceDamage || 0,
        item.stolenCenter || 0,
        item.stolenField || 0,
        item.closing || 0
      ]);
  
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(field => {

if(field ===0){
return '"0"';
} 
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

  const getFormattedDateRange = () => {
    if (activeSearch.month) {
      const [year, month] = activeSearch.month.split('-');
      const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' });
      return `${monthName}-${year}`;
    }
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();
    return `${currentMonth}-${currentYear}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  // const handleUsageClick = (item) => {
  //   if (item.usage > 0) {
  //     const params = new URLSearchParams({
  //       product: item.productId || '',
  //       center: item.center?.id || '',
  //       productName: encodeURIComponent(item.productName || ''),
  //       centerName: encodeURIComponent(item.center?.name || ''),
  //       month: activeSearch.month || ''
  //     });
  //     navigate(`/usage-detail?${params.toString()}`);
  //   }
  // };


  const handleUsageClick = (item) => {
    if (item.usage > 0) {
      navigate('/usage-detail', {
        state: {
          productId: item.productId || '',
          centerId: item.center?.id || '',
          productName: item.productName || '',
          centerName: item.center?.name || '',
          month: activeSearch.month || ''
        }
      });
    }
  };
  const handleTransferReceiveClick = (item) => {
    if (item.transferReceive > 0) {
      const centerId = item.center?.id || '';
      const productId = item.productId || '';
      
      if (!centerId || !productId) {
        console.error('Missing center or product ID:', { centerId, productId });
        return;
      }
      
      const params = new URLSearchParams({
        product: productId,
        center: centerId,
        transferType: 'receive'
      });
      navigate(`/transfer-detail?${params.toString()}`);
    }
  };

  const handleTransferGivenClick = (item) => {
    if (item.transferGiven > 0) {
      const centerId = item.center?.id || '';
      const productId = item.productId || '';
      
      if (!centerId || !productId) {
        console.error('Missing center or product ID:', { centerId, productId });
        return;
      }
      
      const params = new URLSearchParams({
        product: productId,
        center: centerId,
        transferType: 'given'
      });
      navigate(`/transfer-detail?${params.toString()}`);
    }
  };
const handleFieldClick = (item, field, type) => {
  const value = item[field] || 0;
  if (value > 0) {
    const centerId = item.center?.id || '';
    const productId = item.productId || '';
    
    if (!centerId || !productId) {
      console.error('Missing center or product ID:', { centerId, productId });
      return;
    }
    
    const params = new URLSearchParams({
      product: productId,
      center: centerId,
      usageType: type,
      productName: encodeURIComponent(item.productName || ''),
      centerName: encodeURIComponent(item.center?.name || ''),
      month: activeSearch.month || ''
    });
    navigate(`/transaction-report?${params.toString()}`);
  }
};

const handleNcClick = (item) => handleFieldClick(item, 'nc', 'Customer');
const handleConvertClick = (item) => handleFieldClick(item, 'convert', 'Customer');
const handleShiftingClick = (item) => handleFieldClick(item, 'shifting', 'Customer');
const handleBuildingUsageClick = (item) => handleFieldClick(item, 'buildingUsage', 'Building');
const handleBuildingDamageClick = (item) => handleFieldClick(item, 'buildingDamage', 'building');
const handleOtherClick = (item) => handleFieldClick(item, 'other', 'other');
const handleDamageClick = (item) => handleFieldClick(item, 'damage', 'Damage');
const handleRepairClick = (item) => handleFieldClick(item, 'repair', 'Customer');
const handleStolenCenterClick = (item) => handleFieldClick(item, 'stolenCenter', 'Stolen from Center');
const handleStolenFieldClick = (item) => handleFieldClick(item, 'stolenField', 'Stolen from Field');
const handleReturnClick = (item) => handleFieldClick(item, 'return', 'Customer');
const handleReplaceDamageClick = (item) => handleFieldClick(item, 'replaceDamage', 'damage');

const handlePurchaseClick = (item) => {
  if (item.purchase > 0) {
    const centerId = item.center?.id || '';
    const productId = item.productId || '';
    
    if (!centerId || !productId) {
      console.error('Missing center or product ID:', { centerId, productId });
      return;
    }
    
    const params = new URLSearchParams({
      product: productId,
      center: centerId,
      productName: encodeURIComponent(item.productName || ''),
      centerName: encodeURIComponent(item.center?.name || ''),
      month: activeSearch.month || '',
      transactionType: 'purchase'
    });
    
    navigate(`/indent-detail?${params.toString()}`);
  }
};

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div className='title'>Indent / Usage Summary Report </div>
      <IndentUsageSummarySearch
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
              disabled={loading}
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
              <li><strong>Date:</strong>{getFormattedDateRange()}</li>
              {filters?.center && (
                <li><strong>Branch:</strong> {filters.center.name}</li>
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
                  <CTableHeaderCell onClick={() => handleSort('center.name')} className="sortable-header">
                    Branch {getSortIcon('center.name')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('productName')} className="sortable-header">
                    Product {getSortIcon('productName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('opening')} className="sortable-header">
                    Opening {getSortIcon('opening')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('purchase')} className="sortable-header">
                    Purchase {getSortIcon('purchase')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('distributed')} className="sortable-header">
                    Distributed {getSortIcon('distributed')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('transferReceive')} className="sortable-header">
                    Transfer Received {getSortIcon('transferReceive')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('replaceReturn')} className="sortable-header">
                    Replace Return {getSortIcon('replaceReturn')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('usage')} className="sortable-header">
                    Usage {getSortIcon('usage')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('transferGiven')} className="sortable-header">
                    Transfer Given {getSortIcon('transferGiven')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('nc')} className="sortable-header">
                    NC {getSortIcon('nc')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('convert')} className="sortable-header">
                    Convert {getSortIcon('convert')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('shifting')} className="sortable-header">
                    Shifting {getSortIcon('shifting')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('buildingUsage')} className="sortable-header">
                    Building new usage {getSortIcon('buildingUsage')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('buildingDamage')} className="sortable-header">
                    Building Damage {getSortIcon('buildingDamage')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('other')} className="sortable-header">
                    Other {getSortIcon('other')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('return')} className="sortable-header">
                    Return {getSortIcon('return')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('repair')} className="sortable-header">
                    Repair {getSortIcon('repair')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('damage')} className="sortable-header">
                    Damage {getSortIcon('damage')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('replaceDamage')} className="sortable-header">
                    Replace Damage {getSortIcon('replaceDamage')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('stolenCenter')} className="sortable-header">
                    Stolen Center {getSortIcon('stolenCenter')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('stolenField')} className="sortable-header">
                    Stolen Field {getSortIcon('stolenField')}
                  </CTableHeaderCell>
                  <CTableHeaderCell onClick={() => handleSort('closing')} className="sortable-header">
                    Closing {getSortIcon('closing')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.map((item, idx) => (
                      <CTableRow key={idx}>
                        <CTableDataCell>{item.center?.name || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{item.productName || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{item.opening || 0}</CTableDataCell>
                        <CTableDataCell>
                       {/*   {item.purchase || 0}   */}
                       <button 
        className="btn btn-link p-0 text-decoration-none"
        onClick={() => handlePurchaseClick(item)}
        style={{
          border: 'none', 
          background: 'none', 
          cursor: item.purchase > 0 ? 'pointer' : 'default',
          color: item.purchase > 0 ? '#337ab7' : 'inherit'
        }}
        disabled={item.purchase === 0}
      >
        {item.purchase || 0}
      </button>
                        </CTableDataCell>
                        <CTableDataCell>{item.distributed || 0}</CTableDataCell>
                        <CTableDataCell>
              
                          <button 
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => handleTransferReceiveClick(item)}
                    style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                  >
                     {item.transferReceive || 0}

                  </button>
              </CTableDataCell>
                        {/* <CTableDataCell>{item.replaceReturn || 0}</CTableDataCell> */}
                        <CTableDataCell>{item.return || 0}</CTableDataCell>
                        <CTableDataCell>
                    <button 
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => handleUsageClick(item)}
                    style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                  >
                     {item.usage || 0}

                  </button>
              </CTableDataCell>
                        <CTableDataCell>
                          
                        <button 
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => handleTransferGivenClick(item)}
                    style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                  >
                    {item.transferGiven || 0}

                  </button>
                  </CTableDataCell>
                        <CTableDataCell>
                        <button 
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => handleNcClick(item)}
              style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
            >
              {item.nc || 0}
            </button>
            </CTableDataCell>
            <CTableDataCell>
            <button 
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => handleConvertClick(item)}
              style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
            >
              {item.convert || 0}
            </button>
          </CTableDataCell>
          <CTableDataCell>
            <button 
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => handleShiftingClick(item)}
              style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
            >
              {item.shifting || 0}
            </button>
          </CTableDataCell>
          <CTableDataCell>
            <button 
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => handleBuildingUsageClick(item)}
              style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
            >
              {item.buildingUsage || 0}
            </button>
          </CTableDataCell>
                        <CTableDataCell>{item.buildingDamage || 0}</CTableDataCell>
                        <CTableDataCell>
            <button 
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => handleOtherClick(item)}
              style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
            >
              {item.other || 0}
            </button>
          </CTableDataCell>
          
                        <CTableDataCell>{item.return || 0}</CTableDataCell>
                        <CTableDataCell>{item.repair || 0}</CTableDataCell>
                        <CTableDataCell>
            <button 
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => handleDamageClick(item)}
              style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
            >
              {item.damage || 0}
            </button>
          </CTableDataCell>
                        <CTableDataCell>{item.replaceDamage || 0}</CTableDataCell>
                        <CTableDataCell> 
                          <button 
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => handleStolenCenterClick(item)}
              style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
            >
              {item.stolenCenter || 0}
            </button>
            </CTableDataCell>
                        <CTableDataCell>
                        <button 
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => handleStolenFieldClick(item)}
              style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
            >
              {item.stolenField || 0}
            </button>
                        </CTableDataCell>
                        <CTableDataCell>{item.closing || 0}</CTableDataCell>
                      </CTableRow>
                    ))}
                    <CTableRow className='total-row'>
                      <CTableDataCell colSpan="2"><strong>Total</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.opening}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.purchase}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.distributed}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.transferReceive}</strong></CTableDataCell>
                      {/* <CTableDataCell><strong>{totals.replaceReturn}</strong></CTableDataCell> */}
                      <CTableDataCell><strong>{totals.repair}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.usage}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.transferGiven}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.nc}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.convert}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.shifting}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.buildingUsage}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.buildingDamage}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.other}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.return}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.repair}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.damage}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.replaceDamage}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.stolenCenter}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.stolenField}</strong></CTableDataCell>
                      <CTableDataCell><strong>{totals.closing}</strong></CTableDataCell>
                    </CTableRow>
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="23" className="text-center">No data found</CTableDataCell>
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
export default IndentUsageSummary;

