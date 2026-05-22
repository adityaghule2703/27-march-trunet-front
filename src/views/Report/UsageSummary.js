// import '../../css/table.css';
// import '../../css/form.css';
// import React, { useState, useEffect } from 'react';
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CButton,
//   CSpinner,
//   CFormLabel,
//   CFormInput
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
// import axiosInstance from 'src/axiosInstance';
// import Pagination from 'src/utils/Pagination';
// import { showError } from 'src/utils/sweetAlerts';
// import { formatDisplayDate } from 'src/utils/FormatDateTime';
// import SearchIndentSummary from './SearchIndentSummary';
// import { useNavigate } from 'react-router-dom';

// const UsageSummary = () => {
//   const [data, setData] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [activeSearch, setActiveSearch] = useState({ 
//     center: '', 
//     product: '', 
//     startDate: '', 
//     endDate: '',
//     usageType: ''
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const navigate = useNavigate();


//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const params = new URLSearchParams();
//       if (searchParams.center) {
//         params.append('center', searchParams.center);
//       }
//       if (searchParams.product) {
//         params.append('product', searchParams.product);
//       }
//       if (searchParams.usageType) {
//         params.append('usageType', searchParams.usageType);
//       }
//       if (searchParams.startDate && searchParams.endDate) {
//         const convertDateFormat = (dateStr) => {
//           const [day, month, year] = dateStr.split('-');
//           return `${year}-${month}-${day}`;
//         };
        
//         params.append('startDate', convertDateFormat(searchParams.startDate));
//         params.append('endDate', convertDateFormat(searchParams.endDate));
//       }
//       params.append('page', page);
      
//       const url = params.toString()
//         ? `/reports/usages/summary?${params.toString()}`
//         : '/reports/usages/summary';

//       console.log('Fetching Usage URL:', url);
//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         setData(response.data.data || []);
//         setSummary(response.data.summary || null);
//         setCurrentPage(response.data.pagination.currentPage);
//         setTotalPages(response.data.pagination.totalPages);
//       } else {
//         const errorMessage = response.data.message || 'API returned unsuccessful response';
//       setError(errorMessage);
//       console.error('Backend error:', response.data);
//       }
//     } catch (err) {
//       if (err.response) {
//         const errorMessage = err.response.data?.message || 
//                             err.response.data?.error || 
//                             `Error ${err.response.status}: ${err.response.statusText}`;
//         setError(errorMessage);
//         console.error('Error response:', err.response.data);
//       } else if (err.request) {
//         setError('No response received from server. Please check your network connection.');
//         console.error('Error request:', err.request);
//       } else {
//         setError(err.message || 'An error occurred while fetching data');
//         console.error('Error message:', err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get('/centers');
//       if (response.data.success) {
//         setCenters(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products');
//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//     fetchProducts();
//   }, []);

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     fetchData(activeSearch, page);
//   };

//   const calculateTotals = () => {
//     const totals = { TotalQuantity: 0 };
//     data.forEach(item => {
//       totals.TotalQuantity += parseFloat(item.TotalQuantity || 0);
//     });
//     return totals;
//   };

//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });

//     const sortedData = [...data].sort((a, b) => {
//       const aValue = key.split('.').reduce((o, k) => (o ? o[k] : ''), a);
//       const bValue = key.split('.').reduce((o, k) => (o ? o[k] : ''), b);
//       if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
//       if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
//       return 0;
//     });

//     setData(sortedData);
//   };

//   const getSortIcon = (key) =>
//     sortConfig.key === key ? (
//       sortConfig.direction === 'ascending'
//         ? <CIcon icon={cilArrowTop} className="ms-1" />
//         : <CIcon icon={cilArrowBottom} className="ms-1" />
//     ) : null;

//   const handleSearch = (searchData) => {
//     const mergedSearchData = {
//       ...activeSearch,
//       ...searchData
//     };
//     setActiveSearch(mergedSearchData);
//     fetchData(mergedSearchData, 1);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch({ 
//       center: '', 
//       product: '', 
//       startDate: '', 
//       endDate: '',
//       usageType: ''
//     });
//     setSearchTerm('');
//     fetchData({}, 1);
//   };

//   const isSearchActive = () => {
//     return activeSearch.center || 
//            activeSearch.product || 
//            activeSearch.startDate || 
//            activeSearch.endDate ||
//            activeSearch.usageType 
//   };

//   const filteredData = data.filter(item => {
//     if (isSearchActive()) {
//       return true;
//     }
//     return Object.values(item).some(value => {
//       if (typeof value === 'object' && value !== null) {
//         return Object.values(value).some(nestedValue => 
//           nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
//       return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
//     });
//   });

//   const totals = calculateTotals();
  
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true);
      
//       const params = new URLSearchParams();
      
//       if (activeSearch.center) {
//         params.append('center', activeSearch.center);
//       }
//       if (activeSearch.product) {
//         params.append('product', activeSearch.product);
//       }
//       if (activeSearch.usageType) {
//         params.append('usageType', activeSearch.usageType);
//       }
//       if (activeSearch.startDate && activeSearch.endDate) {
//         const convertDateFormat = (dateStr) => {
//           const [day, month, year] = dateStr.split('-');
//           return `${year}-${month}-${day}`;
//         };
        
//         params.append('startDate', convertDateFormat(activeSearch.startDate));
//         params.append('endDate', convertDateFormat(activeSearch.endDate));
//       }
//        params.append('export','true');
//       const apiUrl = params.toString()
//         ? `/reports/usages/summary?${params.toString()}`
//         : '/reports/usages/summary';
      
//       const response = await axiosInstance.get(apiUrl);
      
//       if (!response.data.success) {
//         throw new Error('API returned unsuccessful response');
//       }
  
//       const exportData = response.data.data || [];
      
//       if (!exportData || exportData.length === 0) {
//         showError('No data available for export');
//         return;
//       }
  
//       const headers = [
//         'Center',
//         'Product',
//         'Total Quantity'
//       ];
  
//       const csvData = exportData.map(item => [
//         item.Center || '',
//         item.Product || '',
//         item.TotalQuantity || 0
//       ]);
  
//       const csvContent = [
//         headers.join(','),
//         ...csvData.map(row => 
//           row.map(field => {
//             const stringField = String(field || '');
//             return `"${stringField.replace(/"/g, '""')}"`;
//           }).join(',')
//         )
//       ].join('\n');
  
//       const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const downloadUrl = URL.createObjectURL(blob);
      
//       link.setAttribute('href', downloadUrl);
//       link.setAttribute('download', `usage_summary_report_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
      
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(downloadUrl);
    
//     } catch (error) {
//       console.error('Error generating export:', error);
//       showError('Error generating export file');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="alert alert-danger">{error}</div>;
//   }

//   const formattedMonth = summary?.period
//     ? new Date(`${summary.period.split('/')[1]}-${summary.period.split('/')[0]}-01`).toLocaleString('default', { month: 'long', year: 'numeric' })
//     : 'N/A';


//     // const handleProductQuantityClick = (item) => {
//     //   if (item && item.ProductId && item.CenterId) {
//     //     navigate('/usage-detail', { 
//     //       state: { 
//     //         productId: item.ProductId,
//     //         productName: item.Product,
//     //         centerId: item.CenterId,
//     //         centerName: item.Center,
//     //         fromSummary: true
//     //       }
//     //     });
//     //   }
//     // };

// const handleProductQuantityClick = (item) => {
//   if (item && item.ProductId && item.CenterId) {
//     navigate(`/usage-detail?product=${item.ProductId}&center=${item.CenterId}`);
//   }
// };
//   return (
//     <div>
//       <div className='title'>Usage Summary Report</div>
//       <SearchIndentSummary
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//       />

//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             <CButton 
//               size="sm" 
//               className="action-btn me-1" 
//               onClick={() => setSearchModalVisible(true)}
//             >
//               <CIcon icon={cilSearch} className='icon' /> Search
//             </CButton>
//             {isSearchActive() && (
//               <CButton 
//                 size="sm" 
//                 color="secondary" 
//                 className="action-btn me-1" 
//                 onClick={handleResetSearch}
//               >
//                 <CIcon icon={cilZoomOut} className='icon' /> Reset Search
//               </CButton>
//             )}
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={generateDetailExport}
//             >
//               <i className="fa fa-fw fa-file-excel"></i>
//               Export
//             </CButton>
//           </div>
//           <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
//         </CCardHeader>

//         <CCardBody>
//           <div className='summary-report'>
//             <h4 className='summary-title'>Showing Result</h4>
//             <ul className='summary-list'>
//               {activeSearch.startDate && activeSearch.endDate ? (
//                 <li><strong>{formatDisplayDate(activeSearch.startDate, activeSearch.endDate)}</strong></li>
//               ) : (
//                 <li><strong>Month:</strong> {formattedMonth}</li>
//               )}
              
//             </ul>
//           </div>
//           <div className="d-flex justify-content-between mb-3">
//             <div></div>
//             <div className='d-flex'>
//               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell onClick={() => handleSort('Center')} className="sortable-header">
//                     Branch {getSortIcon('Center')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell onClick={() => handleSort('Product')} className="sortable-header">
//                     Product {getSortIcon('Product')}
//                   </CTableHeaderCell>
          
//                   <CTableHeaderCell onClick={() => handleSort('TotalQuantity')} className="sortable-header">
//                     Total Qty {getSortIcon('TotalQuantity')}
//                   </CTableHeaderCell>
            
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData.length > 0 ? (
//                   <>
//                     {filteredData.map((item, idx) => (
//                       <CTableRow key={idx}>
//                         <CTableDataCell>{item.Center || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>{item.Product || 'N/A'}</CTableDataCell>
//                         {/* <CTableDataCell>{item.TotalQuantity || 0}</CTableDataCell> */}
//                         <CTableDataCell>
//                         <button 
//                             className="btn btn-link p-0 text-decoration-none"
//                             style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
//                             onClick={() => handleProductQuantityClick(item)}
//                           >
//                             {item.TotalQuantity || 0}
//                           </button>
//                         </CTableDataCell>
//                       </CTableRow>
//                     ))}
//                     <CTableRow className='total-row'>
//                       <CTableDataCell colSpan="2">Total</CTableDataCell>
//                       <CTableDataCell>{totals.TotalQuantity.toFixed(2)}</CTableDataCell>

//                     </CTableRow>
//                   </>
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan="6" className="text-center">No data found</CTableDataCell>
//                   </CTableRow>
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default UsageSummary;



// import '../../css/table.css';
// import '../../css/form.css';
// import React, { useState, useEffect } from 'react';
// import {
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CButton,
//   CSpinner,
//   CFormLabel,
//   CFormInput,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
// import { CFormLabel as CFormLabelPro } from '@coreui/react-pro';
// import axiosInstance from 'src/axiosInstance';
// import Pagination from 'src/utils/Pagination';
// import { showError, showSuccess } from 'src/utils/sweetAlerts';
// import { formatDisplayDate } from 'src/utils/FormatDateTime';
// import SearchIndentSummary from './SearchIndentSummary';
// import { useNavigate } from 'react-router-dom';

// const UsageSummary = () => {
//   const [data, setData] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [exportLoading, setExportLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [exportModalVisible, setExportModalVisible] = useState(false);
//   const [exportStartDate, setExportStartDate] = useState('');
//   const [exportEndDate, setExportEndDate] = useState('');
//   const [activeSearch, setActiveSearch] = useState({ 
//     center: '', 
//     product: '', 
//     startDate: '', 
//     endDate: '',
//     usageType: ''
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const navigate = useNavigate();


//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const params = new URLSearchParams();
//       if (searchParams.center) {
//         params.append('center', searchParams.center);
//       }
//       if (searchParams.product) {
//         params.append('product', searchParams.product);
//       }
//       if (searchParams.usageType) {
//         params.append('usageType', searchParams.usageType);
//       }
//       if (searchParams.startDate && searchParams.endDate) {
//         const convertDateFormat = (dateStr) => {
//           const [day, month, year] = dateStr.split('-');
//           return `${year}-${month}-${day}`;
//         };
        
//         params.append('startDate', convertDateFormat(searchParams.startDate));
//         params.append('endDate', convertDateFormat(searchParams.endDate));
//       }
//       params.append('page', page);
      
//       const url = params.toString()
//         ? `/reports/usages/summary?${params.toString()}`
//         : '/reports/usages/summary';

//       console.log('Fetching Usage URL:', url);
//       const response = await axiosInstance.get(url);

//       if (response.data.success) {
//         setData(response.data.data || []);
//         setSummary(response.data.summary || null);
//         setCurrentPage(response.data.pagination.currentPage);
//         setTotalPages(response.data.pagination.totalPages);
//       } else {
//         const errorMessage = response.data.message || 'API returned unsuccessful response';
//       setError(errorMessage);
//       console.error('Backend error:', response.data);
//       }
//     } catch (err) {
//       if (err.response) {
//         const errorMessage = err.response.data?.message || 
//                             err.response.data?.error || 
//                             `Error ${err.response.status}: ${err.response.statusText}`;
//         setError(errorMessage);
//         console.error('Error response:', err.response.data);
//       } else if (err.request) {
//         setError('No response received from server. Please check your network connection.');
//         console.error('Error request:', err.request);
//       } else {
//         setError(err.message || 'An error occurred while fetching data');
//         console.error('Error message:', err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get('/centers');
//       if (response.data.success) {
//         setCenters(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching centers:', error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products');
//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//     fetchProducts();
//   }, []);

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     fetchData(activeSearch, page);
//   };

//   const calculateTotals = () => {
//     const totals = { TotalQuantity: 0 };
//     data.forEach(item => {
//       totals.TotalQuantity += parseFloat(item.TotalQuantity || 0);
//     });
//     return totals;
//   };

//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });

//     const sortedData = [...data].sort((a, b) => {
//       const aValue = key.split('.').reduce((o, k) => (o ? o[k] : ''), a);
//       const bValue = key.split('.').reduce((o, k) => (o ? o[k] : ''), b);
//       if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
//       if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
//       return 0;
//     });

//     setData(sortedData);
//   };

//   const getSortIcon = (key) =>
//     sortConfig.key === key ? (
//       sortConfig.direction === 'ascending'
//         ? <CIcon icon={cilArrowTop} className="ms-1" />
//         : <CIcon icon={cilArrowBottom} className="ms-1" />
//     ) : null;

//   const handleSearch = (searchData) => {
//     const mergedSearchData = {
//       ...activeSearch,
//       ...searchData
//     };
//     setActiveSearch(mergedSearchData);
//     fetchData(mergedSearchData, 1);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch({ 
//       center: '', 
//       product: '', 
//       startDate: '', 
//       endDate: '',
//       usageType: ''
//     });
//     setSearchTerm('');
//     fetchData({}, 1);
//   };

//   const isSearchActive = () => {
//     return activeSearch.center || 
//            activeSearch.product || 
//            activeSearch.startDate || 
//            activeSearch.endDate ||
//            activeSearch.usageType 
//   };

//   const openExportModal = () => {
//     setExportStartDate(activeSearch.startDate || '');
//     setExportEndDate(activeSearch.endDate || '');
//     setExportModalVisible(true);
//   };

//   const generateDetailExport = async () => {
//     try {
//       setExportLoading(true);
      
//       // Validate dates
//       if (exportStartDate && exportEndDate && exportStartDate > exportEndDate) {
//         showError('Start date cannot be greater than end date');
//         setExportLoading(false);
//         return;
//       }
      
//       const params = new URLSearchParams();
      
//       if (activeSearch.center) {
//         params.append('center', activeSearch.center);
//       }
//       if (activeSearch.product) {
//         params.append('product', activeSearch.product);
//       }
//       if (activeSearch.usageType) {
//         params.append('usageType', activeSearch.usageType);
//       }
      
//       // Use export modal date range (overrides active search dates)
//       if (exportStartDate) {
//         // Convert date format if needed (assuming DD-MM-YYYY format from active search)
//         const convertDateFormat = (dateStr) => {
//           // Check if date is in DD-MM-YYYY format
//           if (dateStr.includes('-')) {
//             const parts = dateStr.split('-');
//             if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
//               const [day, month, year] = parts;
//               return `${year}-${month}-${day}`;
//             }
//           }
//           return dateStr;
//         };
        
//         params.append('startDate', convertDateFormat(exportStartDate));
//       }
//       if (exportEndDate) {
//         // Convert date format if needed
//         const convertDateFormat = (dateStr) => {
//           if (dateStr.includes('-')) {
//             const parts = dateStr.split('-');
//             if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
//               const [day, month, year] = parts;
//               return `${year}-${month}-${day}`;
//             }
//           }
//           return dateStr;
//         };
        
//         params.append('endDate', convertDateFormat(exportEndDate));
//       }
      
//       params.append('export', 'true');
//       const apiUrl = params.toString()
//         ? `/reports/usages/summary?${params.toString()}`
//         : '/reports/usages/summary';
      
//       const response = await axiosInstance.get(apiUrl);
      
//       if (!response.data.success) {
//         throw new Error('API returned unsuccessful response');
//       }
  
//       const exportData = response.data.data || [];
      
//       if (!exportData || exportData.length === 0) {
//         showError('No data available for export');
//         return;
//       }
  
//       const headers = [
//         'Center',
//         'Product',
//         'Total Quantity'
//       ];
  
//       const csvData = exportData.map(item => [
//         item.Center || '',
//         item.Product || '',
//         item.TotalQuantity || 0
//       ]);
  
//       // Create filename with date range if applied
//       let filename = `usage_summary_report`;
//       if (exportStartDate && exportEndDate) {
//         filename += `_${exportStartDate}_to_${exportEndDate}`;
//       } else if (exportStartDate) {
//         filename += `_from_${exportStartDate}`;
//       } else if (exportEndDate) {
//         filename += `_until_${exportEndDate}`;
//       } else {
//         filename += `_${new Date().toISOString().split('T')[0]}`;
//       }
//       filename += '.csv';
  
//       const csvContent = [
//         headers.join(','),
//         ...csvData.map(row => 
//           row.map(field => {
//             const stringField = String(field || '');
//             return `"${stringField.replace(/"/g, '""')}"`;
//           }).join(',')
//         )
//       ].join('\n');
  
//       const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const downloadUrl = URL.createObjectURL(blob);
      
//       link.setAttribute('href', downloadUrl);
//       link.setAttribute('download', filename);
//       link.style.visibility = 'hidden';
      
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(downloadUrl);
      
//       showSuccess('Export completed successfully!');
//       setExportModalVisible(false);
//       setExportStartDate('');
//       setExportEndDate('');
    
//     } catch (error) {
//       console.error('Error generating export:', error);
//       showError('Error generating export file');
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   const filteredData = data.filter(item => {
//     if (isSearchActive()) {
//       return true;
//     }
//     return Object.values(item).some(value => {
//       if (typeof value === 'object' && value !== null) {
//         return Object.values(value).some(nestedValue => 
//           nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
//       return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
//     });
//   });

//   const totals = calculateTotals();

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="alert alert-danger">{error}</div>;
//   }

//   const formattedMonth = summary?.period
//     ? new Date(`${summary.period.split('/')[1]}-${summary.period.split('/')[0]}-01`).toLocaleString('default', { month: 'long', year: 'numeric' })
//     : 'N/A';

//   const handleProductQuantityClick = (item) => {
//     if (item && item.ProductId && item.CenterId) {
//       navigate(`/usage-detail?product=${item.ProductId}&center=${item.CenterId}`);
//     }
//   };
  
//   return (
//     <div>
//       <div className='title'>Usage Summary Report</div>
//       <SearchIndentSummary
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//       />

//       {/* Export Modal */}
//       <CModal visible={exportModalVisible} onClose={() => setExportModalVisible(false)} size="md">
//         <CModalHeader>
//           <CModalTitle>Export Usage Summary Report</CModalTitle>
//         </CModalHeader>
        
//         <CModalBody>
//           <div className="form-group mb-3">
//             <CFormLabel htmlFor="exportStartDate">Start Date (Optional)</CFormLabel>
//             <CFormInput
//               type="date"
//               id="exportStartDate"
//               value={exportStartDate}
//               onChange={(e) => setExportStartDate(e.target.value)}
//               placeholder="Select start date"
//             />
//             <small className="text-muted">Leave empty to include all records from beginning</small>
//           </div>
          
//           <div className="form-group mb-3">
//             <CFormLabel htmlFor="exportEndDate">End Date (Optional)</CFormLabel>
//             <CFormInput
//               type="date"
//               id="exportEndDate"
//               value={exportEndDate}
//               onChange={(e) => setExportEndDate(e.target.value)}
//               placeholder="Select end date"
//             />
//             <small className="text-muted">Leave empty to include all records until today</small>
//           </div>

//           {/* Show current filters summary */}
//           {(activeSearch.center || activeSearch.product || activeSearch.usageType) && (
//             <div className="mt-3 p-2 bg-light rounded">
//               <strong>Current Filters:</strong>
//               <ul className="mb-0 mt-1">
//                 {activeSearch.center && (
//                   <li><small>Center: {centers.find(c => c._id === activeSearch.center)?.centerName}</small></li>
//                 )}
//                 {activeSearch.product && (
//                   <li><small>Product: {products.find(p => p._id === activeSearch.product)?.productTitle}</small></li>
//                 )}
//                 {activeSearch.usageType && (
//                   <li><small>Usage Type: {activeSearch.usageType}</small></li>
//                 )}
//               </ul>
//             </div>
//           )}
//         </CModalBody>
        
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setExportModalVisible(false)}>
//             Cancel
//           </CButton>
//           <CButton color="primary" onClick={generateDetailExport} disabled={exportLoading}>
//             {exportLoading ? (
//               <>
//                 <CSpinner size="sm" className="me-1" />
//                 Exporting...
//               </>
//             ) : (
//               <>
//                 <i className="fa fa-fw fa-file-excel me-1"></i>
//                 Export
//               </>
//             )}
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             <CButton 
//               size="sm" 
//               className="action-btn me-1" 
//               onClick={() => setSearchModalVisible(true)}
//             >
//               <CIcon icon={cilSearch} className='icon' /> Search
//             </CButton>
//             {isSearchActive() && (
//               <CButton 
//                 size="sm" 
//                 color="secondary" 
//                 className="action-btn me-1" 
//                 onClick={handleResetSearch}
//               >
//                 <CIcon icon={cilZoomOut} className='icon' /> Reset Search
//               </CButton>
//             )}
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={openExportModal}
//               disabled={exportLoading || data.length === 0}
//             >
//               <i className="fa fa-fw fa-file-excel"></i>
//               Export
//             </CButton>
//           </div>
//           <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
//         </CCardHeader>

//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3">
//             <div>
//               {(exportStartDate || exportEndDate) && (
//                 <div className="text-muted small">
//                   {exportStartDate && `Export From: ${exportStartDate} `}
//                   {exportEndDate && `To: ${exportEndDate}`}
//                 </div>
//               )}
//             </div>
//             <div className='d-flex'>
//               <CFormLabelPro className='mt-1 m-1'>Search:</CFormLabelPro>
//               <CFormInput
//                 type="text"
//                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                 className="d-inline-block square-search"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className='summary-report'>
//             <h4 className='summary-title'>Showing Result</h4>
//             <ul className='summary-list'>
//               {activeSearch.startDate && activeSearch.endDate ? (
//                 <li><strong>{formatDisplayDate(activeSearch.startDate, activeSearch.endDate)}</strong></li>
//               ) : (
//                 <li><strong>Month:</strong> {formattedMonth}</li>
//               )}
//             </ul>
//           </div>

//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell onClick={() => handleSort('Center')} className="sortable-header">
//                     Branch {getSortIcon('Center')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell onClick={() => handleSort('Product')} className="sortable-header">
//                     Product {getSortIcon('Product')}
//                   </CTableHeaderCell>
          
//                   <CTableHeaderCell onClick={() => handleSort('TotalQuantity')} className="sortable-header">
//                     Total Qty {getSortIcon('TotalQuantity')}
//                   </CTableHeaderCell>
            
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData.length > 0 ? (
//                   <>
//                     {filteredData.map((item, idx) => (
//                       <CTableRow key={idx}>
//                         <CTableDataCell>{item.Center || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>{item.Product || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>
//                         <button 
//                             className="btn btn-link p-0 text-decoration-none"
//                             style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
//                             onClick={() => handleProductQuantityClick(item)}
//                           >
//                             {item.TotalQuantity || 0}
//                           </button>
//                         </CTableDataCell>
//                       </CTableRow>
//                     ))}
//                     <CTableRow className='total-row'>
//                       <CTableDataCell colSpan="2">Total</CTableDataCell>
//                       <CTableDataCell>{totals.TotalQuantity.toFixed(2)}</CTableDataCell>

//                     </CTableRow>
//                   </>
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan="6" className="text-center">No data found</CTableDataCell>
//                   </CTableRow>
//                 )}
//               </CTableBody>
//             </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default UsageSummary;



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
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
import { CFormLabel as CFormLabelPro } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { showError, showSuccess } from 'src/utils/sweetAlerts';
import { formatDisplayDate } from 'src/utils/FormatDateTime';
import SearchIndentSummary from './SearchIndentSummary';
import { useNavigate } from 'react-router-dom';

const UsageSummary = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
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
    center: '', 
    product: '', 
    startDate: '', 
    endDate: '',
    usageType: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Function to aggregate data by Center and Product
  const aggregateData = (detailedData) => {
    const summaryMap = new Map();
    
    detailedData.forEach(item => {
      const key = `${item.Center}|${item.Product}`;
      
      if (summaryMap.has(key)) {
        const existing = summaryMap.get(key);
        existing.TotalQuantity += (item.Qty || 0);  // Using Qty field
      } else {
        summaryMap.set(key, {
          Center: item.Center,
          CenterId: item.CenterId || `center_${item.Center?.replace(/\s/g, '_') || ''}`,
          Product: item.Product,
          ProductId: item.ProductId || `product_${item.Product?.replace(/\s/g, '_') || ''}`,
          TotalQuantity: item.Qty || 0  // Using Qty field
        });
      }
    });
    
    return Array.from(summaryMap.values());
  };

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
        // Aggregate the detailed data using Qty field
        const aggregatedData = aggregateData(response.data.data || []);
        setData(aggregatedData);
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
           activeSearch.usageType;
  };

  const openExportModal = () => {
    setExportStartDate(activeSearch.startDate || '');
    setExportEndDate(activeSearch.endDate || '');
    setExportModalVisible(true);
  };

  const generateDetailExport = async () => {
    try {
      setExportLoading(true);
      
      if (exportStartDate && exportEndDate && exportStartDate > exportEndDate) {
        showError('Start date cannot be greater than end date');
        setExportLoading(false);
        return;
      }
      
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
      
      if (exportStartDate) {
        const convertDateFormat = (dateStr) => {
          if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
              const [day, month, year] = parts;
              return `${year}-${month}-${day}`;
            }
          }
          return dateStr;
        };
        
        params.append('startDate', convertDateFormat(exportStartDate));
      }
      if (exportEndDate) {
        const convertDateFormat = (dateStr) => {
          if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
              const [day, month, year] = parts;
              return `${year}-${month}-${day}`;
            }
          }
          return dateStr;
        };
        
        params.append('endDate', convertDateFormat(exportEndDate));
      }
      
      params.append('export', 'true');
      const apiUrl = params.toString()
        ? `/reports/usages/summary?${params.toString()}`
        : '/reports/usages/summary';
      
      const response = await axiosInstance.get(apiUrl);
      
      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }
  
      // Aggregate the data for export using Qty field
      const exportData = aggregateData(response.data.data || []);
      
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
  
      let filename = `usage_summary_report`;
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
            const stringField = String(field || '');
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

      <CModal visible={exportModalVisible} onClose={() => setExportModalVisible(false)} size="md">
        <CModalHeader>
          <CModalTitle>Export Usage Summary Report</CModalTitle>
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

          {(activeSearch.center || activeSearch.product || activeSearch.usageType) && (
            <div className="mt-3 p-2 bg-light rounded">
              <strong>Current Filters:</strong>
              <ul className="mb-0 mt-1">
                {activeSearch.center && (
                  <li><small>Center: {centers.find(c => c._id === activeSearch.center)?.centerName}</small></li>
                )}
                {activeSearch.product && (
                  <li><small>Product: {products.find(p => p._id === activeSearch.product)?.productTitle}</small></li>
                )}
                {activeSearch.usageType && (
                  <li><small>Usage Type: {activeSearch.usageType}</small></li>
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
                <CIcon icon={cilZoomOut} className='icon' /> Reset Search
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
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
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
                        <CTableDataCell>
                          <button 
                            className="btn btn-link p-0 text-decoration-none"
                            style={{border: 'none', background: 'none', cursor: 'pointer', color: '#337ab7'}}
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
                    <CTableDataCell colSpan="3" className="text-center">No data found</CTableDataCell>
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