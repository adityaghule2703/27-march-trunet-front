// // import '../../css/table.css';
// // import '../../css/form.css';
// // import React, { useState, useEffect } from 'react';
// // import {
// //   CTable,
// //   CTableHead,
// //   CTableRow,
// //   CTableHeaderCell,
// //   CTableBody,
// //   CTableDataCell,
// //   CCard,
// //   CCardBody,
// //   CCardHeader,
// //   CButton,
// //   CFormInput,
// //   CSpinner
// // } from '@coreui/react';
// // import CIcon from '@coreui/icons-react';
// // import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
// // import { CFormLabel } from '@coreui/react-pro';
// // import axiosInstance from 'src/axiosInstance';
// // import Pagination from 'src/utils/Pagination';
// // import { showError } from 'src/utils/sweetAlerts';
// // import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
// // import PurchaseSearch from './CommonSearch';

// // const PurchaseDetail = () => {
// //   const [data, setData] = useState([]);
// //   const [centers, setCenters] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [searchModalVisible, setSearchModalVisible] = useState(false);
// //   const [activeSearch, setActiveSearch] = useState({ keyword: '', outlet: '' });
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [products, setProducts] = useState([]);

// //   const fetchData = async (searchParams = {}, page = 1) => {
// //   try {
// //     setLoading(true);
// //     setError(null);
// //     const params = new URLSearchParams();
    
// //     if (searchParams.center) {
// //       params.append('center', searchParams.center);
// //     }
// //     if (searchParams.product) {
// //       params.append('product', searchParams.product);
// //     }
    
// //     if (searchParams.date && searchParams.date.includes(' to ')) {
// //       const [startDateStr, endDateStr] = searchParams.date.split(' to ');
      
// //       const convertDateFormat = (dateStr) => {
// //         const [day, month, year] = dateStr.split('-');
// //         return `${year}-${month}-${day}`;
// //       };
      
// //       params.append('startDate', convertDateFormat(startDateStr));
// //       params.append('endDate', convertDateFormat(endDateStr));
// //     }
// //     params.append('page', page);
// //     const url = params.toString() ? `/reports/purchased?${params.toString()}` : '/reports/purchased';
// //     const response = await axiosInstance.get(url);
    
// //     if (response.data.success) {
// //       setData(response.data.data);
// //       setCurrentPage(response.data.pagination.currentPage);
// //       setTotalPages(response.data.pagination.totalPages);
// //     } else {
// //       const errorMessage = response.data.message || 'API returned unsuccessful response';
// //       setError(errorMessage);
// //       console.error('Backend error:', response.data);
// //     }
// //   } catch (err) {
// //     if (err.response) {
// //       const errorMessage = err.response.data?.message || 
// //                           err.response.data?.error || 
// //                           `Error ${err.response.status}: ${err.response.statusText}`;
// //       setError(errorMessage);
// //       console.error('Error response:', err.response.data);
// //     } else if (err.request) {
// //       setError('No response received from server. Please check your network connection.');
// //       console.error('Error request:', err.request);
// //     } else {
// //       setError(err.message || 'An error occurred while fetching data');
// //       console.error('Error message:', err.message);
// //     }
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// //   const fetchCenters = async () => {
// //     try {
// //       const response = await axiosInstance.get('/centers');
// //       if (response.data.success) {
// //         setCenters(response.data.data);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //     }
// //   };
// //   const fetchProducts = async () => {
// //     try {
// //       const response = await axiosInstance.get('/products/all');
// //       if (response.data.success) {
// //         setProducts(response.data.data);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //     }
// //   };
// //   useEffect(() => {
// //     fetchData();
// //     fetchCenters();
// //     fetchProducts();
// //   }, []);

// //   const handlePageChange = (page) => {
// //     if (page < 1 || page > totalPages) return;
// //     fetchData(activeSearch, page);
// //   };

// //   const getFlattenedData = () => {
// //     const flattened = [];
// //     data.forEach(purchase => {
// //       if (purchase.products && purchase.products.length > 0) {
// //         purchase.products.forEach(product => {
// //           flattened.push({
// //             ...purchase,
// //             productDetail: product,
// //             uniqueKey: `${purchase._id}_${product._id}`
// //           });
// //         });
// //       } else {
// //         flattened.push({
// //           ...purchase,
// //           productDetail: null,
// //           uniqueKey: `${purchase._id}_no_product`
// //         });
// //       }
// //     });
// //     return flattened;
// //   };

// //   const calculateTotals = () => {
// //     const totals = {
// //       totalQty: 0,
// //       totalAmount: 0
// //     };

// //     getFlattenedData().forEach(item => {
// //       if (item.productDetail) {
// //         totals.totalQty += parseFloat(item.productDetail.purchasedQuantity || 0);
// //         totals.totalAmount += parseFloat(item.productDetail.price * item.productDetail.purchasedQuantity || 0);
// //       }
// //     });

// //     return totals;
// //   };

// //   const handleSort = (key) => {
// //     let direction = 'ascending';
// //     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
// //       direction = 'descending';
// //     }
// //     setSortConfig({ key, direction });

// //     const sortedData = [...data].sort((a, b) => {
// //       let aValue = a;
// //       let bValue = b;
      
// //       if (key.includes('.')) {
// //         const keys = key.split('.');
// //         aValue = keys.reduce((obj, k) => obj && obj[k], a);
// //         bValue = keys.reduce((obj, k) => obj && obj[k], b);
// //       } else {
// //         aValue = a[key];
// //         bValue = b[key];
// //       }
      
// //       if (aValue < bValue) {
// //         return direction === 'ascending' ? -1 : 1;
// //       }
// //       if (aValue > bValue) {
// //         return direction === 'ascending' ? 1 : -1;
// //       }
// //       return 0;
// //     });

// //     setData(sortedData);
// //   };

// //   const getSortIcon = (key) => {
// //     if (sortConfig.key !== key) {
// //       return null;
// //     }
// //     return sortConfig.direction === 'ascending'
// //       ? <CIcon icon={cilArrowTop} className="ms-1" />
// //       : <CIcon icon={cilArrowBottom} className="ms-1" />;
// //   };

// //   const handleSearch = (searchData) => {
// //     setActiveSearch(searchData);
// //     fetchData(searchData, 1);
// //   };

// //   const handleResetSearch = () => {
// //     setActiveSearch({ center: '', product: '', startDate:'', endDate:'' });
// //     setSearchTerm('');
// //     fetchData({}, 1);
// //   };

// //   const filteredFlattenedData = getFlattenedData().filter(item => {
// //     if (activeSearch.product || activeSearch.center || activeSearch.startDate || activeSearch.endDate) {
// //       return true;
// //     }
// //     return Object.values(item).some(value => {
// //       if (typeof value === 'object' && value !== null) {
// //         return Object.values(value).some(nestedValue => 
// //           nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
// //         );
// //       }
// //       return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
// //     });
// //   });

// //   if (loading) {
// //     return (
// //       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
// //         <CSpinner color="primary" />
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="alert alert-danger" role="alert">
// //         Error loading data: {error}
// //       </div>
// //     );
// //   }

// //   const totals = calculateTotals();

// //   const generateDetailExport = async () => {
// //     try {
// //       setLoading(true);
      
// //       // Use activeSearch filters instead of fetching all data
// //       const params = new URLSearchParams();
      
// //       if (activeSearch.center) {
// //         params.append('center', activeSearch.center);
// //       }
// //       if (activeSearch.product) {
// //         params.append('product', activeSearch.product);
// //       }
      
// //       if (activeSearch.date && activeSearch.date.includes(' to ')) {
// //         const [startDateStr, endDateStr] = activeSearch.date.split(' to ');
        
// //         const convertDateFormat = (dateStr) => {
// //           const [day, month, year] = dateStr.split('-');
// //           return `${year}-${month}-${day}`;
// //         };
        
// //         params.append('startDate', convertDateFormat(startDateStr));
// //         params.append('endDate', convertDateFormat(endDateStr));
// //       }
// //       params.append('export','true');
// //       const apiUrl = params.toString() 
// //         ? `/reports/purchased?${params.toString()}` 
// //         : '/reports/purchased';
      
// //       const response = await axiosInstance.get(apiUrl);
      
// //       if (!response.data.success) {
// //         throw new Error('API returned unsuccessful response');
// //       }
  
// //       const exportData = response.data.data;
      
// //       if (!exportData || exportData.length === 0) {
// //         showError('No data available for export');
// //         return;
// //       }
  
// //       const headers = [
// //         'Invoice No',
// //         'Vendor',
// //         'Transport Amount',
// //         'Created At',
// //         'Center Title',
// //         'Product Title',
// //         'Purchase Date',
// //         'Note',
// //         'Quantity',
// //         'Price',
// //         'Total Amount',
// //         'Type',
// //         'Status'
// //       ];
  
// //       const csvData = exportData.flatMap(purchase => {
// //         if (purchase.products && purchase.products.length > 0) {
// //           return purchase.products.map(product => [
// //             purchase.invoiceNo,
// //             purchase.vendor?.businessName || 'N/A',
// //             purchase.transportAmount || 0,
// //             formatDateTime(purchase.createdAt),
// //             purchase.outlet?.centerName || 'N/A',
// //             product.product?.productTitle || 'N/A',
// //             formatDate(purchase.date),
// //             purchase.remark || '',
// //             product.purchasedQuantity || 0,
// //             product.price || 0,
// //             purchase.totalAmount || 0,
// //             purchase.type || 'N/A',
// //             purchase.status || 'N/A'
// //           ]);
// //         } else {
// //           return [[
// //             purchase.invoiceNo,
// //             purchase.vendor?.businessName || 'N/A',
// //             purchase.transportAmount || 0,
// //             formatDateTime(purchase.createdAt),
// //             purchase.outlet?.centerName || 'N/A',
// //             'No Product',
// //             formatDate(purchase.date),
// //             purchase.remark || '',
// //             0,
// //             0,
// //             purchase.totalAmount || 0,
// //             purchase.type || 'N/A',
// //             purchase.status || 'N/A'
// //           ]];
// //         }
// //       });
  
// //       const csvContent = [
// //         headers.join(','),
// //         ...csvData.map(row => 
// //           row.map(field => {
// //             const stringField = String(field || '');
// //             return `"${stringField.replace(/"/g, '""')}"`;
// //           }).join(',')
// //         )
// //       ].join('\n');
  
// //       const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
// //       const link = document.createElement('a');
// //       const downloadUrl = URL.createObjectURL(blob);
      
// //       link.setAttribute('href', downloadUrl);
// //       link.setAttribute('download', `stock_purchase_${new Date().toISOString().split('T')[0]}.csv`);
// //       link.style.visibility = 'hidden';
      
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);
// //       URL.revokeObjectURL(downloadUrl);
    
// //     } catch (error) {
// //       console.error('Error generating export:', error);
// //       showError('Error generating export file');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div>
// //       <div className='title'>Purchase Detail Report</div>
// //       <PurchaseSearch
// //         visible={searchModalVisible}
// //         onClose={() => setSearchModalVisible(false)}
// //         onSearch={handleSearch}
// //         centers={centers}
// //         products={products}
// //       />
// //       <CCard className='table-container mt-4'>
// //         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
// //           <div>
// //             <CButton 
// //               size="sm" 
// //               className="action-btn me-1"
// //               onClick={() => setSearchModalVisible(true)}
// //             >
// //               <CIcon icon={cilSearch} className='icon' /> Search
// //             </CButton>
// //             {(activeSearch.center || activeSearch.product || activeSearch.startDate || activeSearch.endDate) && (
// //               <CButton 
// //                 size="sm" 
// //                 color="secondary" 
// //                 className="action-btn me-1"
// //                 onClick={handleResetSearch}
// //               >
// //                <CIcon icon={cilZoomOut} className='icon' />
// //                 Reset Search
// //               </CButton>
// //             )}
// //             <CButton 
// //               size="sm" 
// //               className="action-btn me-1"
// //               onClick={generateDetailExport}
// //             >
// //               <i className="fa fa-fw fa-file-excel"></i>
// //                Export
// //             </CButton>
// //           </div>
          
// //           <div>
// //             <Pagination
// //               currentPage={currentPage}
// //               totalPages={totalPages}
// //               onPageChange={handlePageChange}
// //             />
// //           </div>
// //         </CCardHeader>
        
// //         <CCardBody>
// //           <div className="d-flex justify-content-between mb-3">
// //             <div>
// //             </div>
// //             <div className='d-flex'>
// //               <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
// //               <CFormInput
// //                 type="text"
// //                 style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
// //                 className="d-inline-block square-search"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //               />
// //             </div>
// //           </div>
          
// //           <div className="responsive-table-wrapper">
// //             <CTable striped bordered hover className='responsive-table'>
// //               <CTableHead>
// //                 <CTableRow>
// //                   <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
// //                     Date {getSortIcon('date')}
// //                   </CTableHeaderCell>
// //                   <CTableHeaderCell scope="col" onClick={() => handleSort('outlet')} className="sortable-header">
// //                     Branch {getSortIcon('outlet')}
// //                   </CTableHeaderCell>
// //                   <CTableHeaderCell scope="col" onClick={() => handleSort('invoiceNo')} className="sortable-header">
// //                     Invoice No. {getSortIcon('invoiceNo')}
// //                   </CTableHeaderCell>
// //                   <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
// //                     Vendor {getSortIcon('vendor.businessName')}
// //                   </CTableHeaderCell>
// //                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.product.productTitle')} className="sortable-header">
// //                     Product {getSortIcon('productDetail.product.productTitle')}
// //                   </CTableHeaderCell>
// //                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.purchasedQuantity')} className="sortable-header">
// //                     Qty {getSortIcon('productDetail.purchasedQuantity')}
// //                   </CTableHeaderCell>
// //                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.price')} className="sortable-header">
// //                     Price {getSortIcon('productDetail.price')}
// //                   </CTableHeaderCell>
// //                   <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
// //                     Remark {getSortIcon('remark')}
// //                   </CTableHeaderCell>
// //                 </CTableRow>
// //               </CTableHead>
// //               <CTableBody>
// //                 {filteredFlattenedData.length > 0 ? (
// //                   <>
// //                     {filteredFlattenedData.map((item) => (
// //                       <CTableRow key={item.uniqueKey}>
// //                         <CTableDataCell>
// //                           {formatDate(item.date || '')}
// //                         </CTableDataCell>
// //                         <CTableDataCell>{item.outlet?.centerName || ''}</CTableDataCell>
// //                         <CTableDataCell>{item.invoiceNo}</CTableDataCell>
// //                         <CTableDataCell>{item.vendor?.businessName || ''}</CTableDataCell>
// //                         <CTableDataCell>
// //                           {item.productDetail?.product?.productTitle || 'No Product'}
// //                         </CTableDataCell>
// //                         <CTableDataCell>
// //                           {item.productDetail?.purchasedQuantity || 0}
// //                         </CTableDataCell>
// //                         <CTableDataCell>
// //                           {item.productDetail?.price || 0}
// //                         </CTableDataCell>
// //                         <CTableDataCell>{item.remark || ''}</CTableDataCell>
// //                       </CTableRow>
// //                     ))}
// //                     <CTableRow className='total-row'>
// //                       <CTableDataCell colSpan="5">Total</CTableDataCell>
// //                       <CTableDataCell>{totals.totalQty.toFixed(2)}</CTableDataCell>
// //                       <CTableDataCell>{totals.totalAmount.toFixed(2)}</CTableDataCell>
// //                       <CTableDataCell></CTableDataCell>
// //                     </CTableRow>
// //                   </>
// //                 ) : (
// //                   <CTableRow>
// //                     <CTableDataCell colSpan="8" className="text-center">
// //                       No data found
// //                     </CTableDataCell>
// //                   </CTableRow>
// //                 )}
// //               </CTableBody>
// //             </CTable>
// //           </div>
// //         </CCardBody>
// //       </CCard>
// //     </div>
// //   );
// // };

// // export default PurchaseDetail;






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
//   CFormInput,
//   CSpinner
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
// import { CFormLabel } from '@coreui/react-pro';
// import axiosInstance from 'src/axiosInstance';
// import Pagination from 'src/utils/Pagination';
// import { showError } from 'src/utils/sweetAlerts';
// import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
// import PurchaseSearch from './CommonSearch';

// const PurchaseDetail = () => {
//   const [data, setData] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [activeSearch, setActiveSearch] = useState({ keyword: '', outlet: '' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [products, setProducts] = useState([]);

//  const fetchData = async (searchParams = {}, page = 1) => {
//   try {
//     setLoading(true);
//     setError(null);
//     const params = new URLSearchParams();
    
//     if (searchParams.center) {
//       params.append('center', searchParams.center);
//     }
//     if (searchParams.product) {
//       params.append('product', searchParams.product);
//     }
    
//     // Handle dates from the new CommonSearch component
//     if (searchParams.startDate && searchParams.endDate) {
//       // Dates are already in YYYY-MM-DD format from the HTML5 date input
//       params.append('startDate', searchParams.startDate);
//       params.append('endDate', searchParams.endDate);
//     } else if (searchParams.date && searchParams.date.includes(' to ')) {
//       // Fallback for old date format (DD-MM-YYYY to YYYY-MM-DD)
//       const [startDateStr, endDateStr] = searchParams.date.split(' to ');
      
//       const convertDateFormat = (dateStr) => {
//         const [day, month, year] = dateStr.split('-');
//         return `${year}-${month}-${day}`;
//       };
      
//       params.append('startDate', convertDateFormat(startDateStr));
//       params.append('endDate', convertDateFormat(endDateStr));
//     }
    
//     params.append('page', page);
//     const url = params.toString() ? `/reports/purchased?${params.toString()}` : '/reports/purchased';
//     const response = await axiosInstance.get(url);
    
//     if (response.data.success) {
//       setData(response.data.data);
//       setCurrentPage(response.data.pagination.currentPage);
//       setTotalPages(response.data.pagination.totalPages);
//     } else {
//       const errorMessage = response.data.message || 'API returned unsuccessful response';
//       setError(errorMessage);
//       console.error('Backend error:', response.data);
//     }
//   } catch (err) {
//     if (err.response) {
//       const errorMessage = err.response.data?.message || 
//                           err.response.data?.error || 
//                           `Error ${err.response.status}: ${err.response.statusText}`;
//       setError(errorMessage);
//       console.error('Error response:', err.response.data);
//     } else if (err.request) {
//       setError('No response received from server. Please check your network connection.');
//       console.error('Error request:', err.request);
//     } else {
//       setError(err.message || 'An error occurred while fetching data');
//       console.error('Error message:', err.message);
//     }
//   } finally {
//     setLoading(false);
//   }
// };

//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get('/centers');
//       if (response.data.success) {
//         setCenters(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all');
//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
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

//   const getFlattenedData = () => {
//     const flattened = [];
//     data.forEach(purchase => {
//       if (purchase.products && purchase.products.length > 0) {
//         purchase.products.forEach(product => {
//           flattened.push({
//             ...purchase,
//             productDetail: product,
//             uniqueKey: `${purchase._id}_${product._id}`
//           });
//         });
//       } else {
//         flattened.push({
//           ...purchase,
//           productDetail: null,
//           uniqueKey: `${purchase._id}_no_product`
//         });
//       }
//     });
//     return flattened;
//   };

//   const calculateTotals = () => {
//     const totals = {
//       totalQty: 0,
//       totalAmount: 0
//     };

//     getFlattenedData().forEach(item => {
//       if (item.productDetail) {
//         totals.totalQty += parseFloat(item.productDetail.purchasedQuantity || 0);
//         totals.totalAmount += parseFloat(item.productDetail.price * item.productDetail.purchasedQuantity || 0);
//       }
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
//       let aValue = a;
//       let bValue = b;
      
//       if (key.includes('.')) {
//         const keys = key.split('.');
//         aValue = keys.reduce((obj, k) => obj && obj[k], a);
//         bValue = keys.reduce((obj, k) => obj && obj[k], b);
//       } else {
//         aValue = a[key];
//         bValue = b[key];
//       }
      
//       if (aValue < bValue) {
//         return direction === 'ascending' ? -1 : 1;
//       }
//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });

//     setData(sortedData);
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return null;
//     }
//     return sortConfig.direction === 'ascending'
//       ? <CIcon icon={cilArrowTop} className="ms-1" />
//       : <CIcon icon={cilArrowBottom} className="ms-1" />;
//   };

//  const handleSearch = (searchData) => {
//   // Ensure dates are properly formatted
//   const formattedSearchData = {
//     center: searchData.center,
//     product: searchData.product,
//     startDate: searchData.startDate,
//     endDate: searchData.endDate,
//     date: searchData.startDate && searchData.endDate 
//       ? `${searchData.startDate} to ${searchData.endDate}`
//       : ''
//   };
//   setActiveSearch(formattedSearchData);
//   fetchData(formattedSearchData, 1);
// };

// const handleResetSearch = () => {
//   setActiveSearch({ center: '', product: '', startDate: '', endDate: '', date: '' });
//   setSearchTerm('');
//   fetchData({}, 1);
// };

//   const filteredFlattenedData = getFlattenedData().filter(item => {
//     if (activeSearch.product || activeSearch.center || activeSearch.startDate || activeSearch.endDate) {
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

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
//         <CSpinner color="primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         Error loading data: {error}
//       </div>
//     );
//   }

//   const totals = calculateTotals();

//   const generateDetailExport = async () => {
//     try {
//       setLoading(true);
      
//       // Use activeSearch filters instead of fetching all data
//       const params = new URLSearchParams();
      
//       if (activeSearch.center) {
//         params.append('center', activeSearch.center);
//       }
//       if (activeSearch.product) {
//         params.append('product', activeSearch.product);
//       }
      
//       if (activeSearch.date && activeSearch.date.includes(' to ')) {
//         const [startDateStr, endDateStr] = activeSearch.date.split(' to ');
        
//         const convertDateFormat = (dateStr) => {
//           const [day, month, year] = dateStr.split('-');
//           return `${year}-${month}-${day}`;
//         };
        
//         params.append('startDate', convertDateFormat(startDateStr));
//         params.append('endDate', convertDateFormat(endDateStr));
//       }
//       params.append('export','true');
//       const apiUrl = params.toString() 
//         ? `/reports/purchased?${params.toString()}` 
//         : '/reports/purchased';
      
//       const response = await axiosInstance.get(apiUrl);
      
//       if (!response.data.success) {
//         throw new Error('API returned unsuccessful response');
//       }
  
//       const exportData = response.data.data;
      
//       if (!exportData || exportData.length === 0) {
//         showError('No data available for export');
//         return;
//       }
  
//       const headers = [
//         'Invoice No',
//         'Vendor',
//         'Transport Amount',
//         'Created At',
//         'Center Title',
//         'Product Title',
//         'Purchase Date',
//         'Note',
//         'Quantity',
//         'Price',
//         'Total Amount',
//         'Type',
//         'Status'
//       ];
  
//       const csvData = exportData.flatMap(purchase => {
//         if (purchase.products && purchase.products.length > 0) {
//           return purchase.products.map(product => [
//             purchase.invoiceNo,
//             purchase.vendor?.businessName || 'N/A',
//             purchase.transportAmount || 0,
//             formatDateTime(purchase.createdAt),
//             purchase.outlet?.centerName || 'N/A',
//             product.product?.productTitle || 'N/A',
//             formatDate(purchase.date),
//             purchase.remark || '',
//             product.purchasedQuantity || 0,
//             product.price || 0,
//             purchase.totalAmount || 0,
//             purchase.type || 'N/A',
//             purchase.status || 'N/A'
//           ]);
//         } else {
//           return [[
//             purchase.invoiceNo,
//             purchase.vendor?.businessName || 'N/A',
//             purchase.transportAmount || 0,
//             formatDateTime(purchase.createdAt),
//             purchase.outlet?.centerName || 'N/A',
//             'No Product',
//             formatDate(purchase.date),
//             purchase.remark || '',
//             0,
//             0,
//             purchase.totalAmount || 0,
//             purchase.type || 'N/A',
//             purchase.status || 'N/A'
//           ]];
//         }
//       });
  
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
//       link.setAttribute('download', `stock_purchase_${new Date().toISOString().split('T')[0]}.csv`);
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

//   return (
//     <div>
//       <div className='title'>Purchase Detail Report</div>
//       <PurchaseSearch
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
//             {(activeSearch.center || activeSearch.product || activeSearch.startDate || activeSearch.endDate) && (
//               <CButton 
//                 size="sm" 
//                 color="secondary" 
//                 className="action-btn me-1"
//                 onClick={handleResetSearch}
//               >
//                <CIcon icon={cilZoomOut} className='icon' />
//                 Reset Search
//               </CButton>
//             )}
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={generateDetailExport}
//             >
//               <i className="fa fa-fw fa-file-excel"></i>
//                Export
//             </CButton>
//           </div>
          
//           <div>
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <div className="d-flex justify-content-between mb-3">
//             <div>
//             </div>
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
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
//                     Date {getSortIcon('date')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('outlet')} className="sortable-header">
//                     Branch {getSortIcon('outlet')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('invoiceNo')} className="sortable-header">
//                     Invoice No. {getSortIcon('invoiceNo')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
//                     Vendor {getSortIcon('vendor.businessName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.product.productTitle')} className="sortable-header">
//                     Product {getSortIcon('productDetail.product.productTitle')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.purchasedQuantity')} className="sortable-header">
//                     Qty {getSortIcon('productDetail.purchasedQuantity')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.price')} className="sortable-header">
//                     Price {getSortIcon('productDetail.price')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
//                     Remark {getSortIcon('remark')}
//                   </CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredFlattenedData.length > 0 ? (
//                   <>
//                     {filteredFlattenedData.map((item) => (
//                       <CTableRow key={item.uniqueKey}>
//                         <CTableDataCell>
//                           {formatDate(item.date || '')}
//                         </CTableDataCell>
//                         <CTableDataCell>{item.outlet?.centerName || ''}</CTableDataCell>
//                         <CTableDataCell>{item.invoiceNo}</CTableDataCell>
//                         <CTableDataCell>{item.vendor?.businessName || ''}</CTableDataCell>
//                         <CTableDataCell>
//                           {item.productDetail?.product?.productTitle || 'No Product'}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.productDetail?.purchasedQuantity || 0}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.productDetail?.price || 0}
//                         </CTableDataCell>
//                         <CTableDataCell>{item.remark || ''}</CTableDataCell>
//                       </CTableRow>
//                     ))}
//                     <CTableRow className='total-row'>
//                       <CTableDataCell colSpan="5">Total</CTableDataCell>
//                       <CTableDataCell>{totals.totalQty.toFixed(2)}</CTableDataCell>
//                       <CTableDataCell>{totals.totalAmount.toFixed(2)}</CTableDataCell>
//                       <CTableDataCell></CTableDataCell>
//                     </CTableRow>
//                   </>
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan="8" className="text-center">
//                       No data found
//                     </CTableDataCell>
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

// export default PurchaseDetail;







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
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
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
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
import PurchaseSearch from './CommonSearch';

const PurchaseDetail = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [activeSearch, setActiveSearch] = useState({ keyword: '', outlet: '', startDate: '', endDate: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);

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
      
      // Handle dates from the new CommonSearch component
      if (searchParams.startDate && searchParams.endDate) {
        // Dates are already in YYYY-MM-DD format from the HTML5 date input
        params.append('startDate', searchParams.startDate);
        params.append('endDate', searchParams.endDate);
      } else if (searchParams.date && searchParams.date.includes(' to ')) {
        // Fallback for old date format (DD-MM-YYYY to YYYY-MM-DD)
        const [startDateStr, endDateStr] = searchParams.date.split(' to ');
        
        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month}-${day}`;
        };
        
        params.append('startDate', convertDateFormat(startDateStr));
        params.append('endDate', convertDateFormat(endDateStr));
      }
      
      params.append('page', page);
      const url = params.toString() ? `/reports/purchased?${params.toString()}` : '/reports/purchased';
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

  const getFlattenedData = () => {
    const flattened = [];
    data.forEach(purchase => {
      if (purchase.products && purchase.products.length > 0) {
        purchase.products.forEach(product => {
          flattened.push({
            ...purchase,
            productDetail: product,
            uniqueKey: `${purchase._id}_${product._id}`
          });
        });
      } else {
        flattened.push({
          ...purchase,
          productDetail: null,
          uniqueKey: `${purchase._id}_no_product`
        });
      }
    });
    return flattened;
  };

  const calculateTotals = () => {
    const totals = {
      totalQty: 0,
      totalAmount: 0
    };

    getFlattenedData().forEach(item => {
      if (item.productDetail) {
        totals.totalQty += parseFloat(item.productDetail.purchasedQuantity || 0);
        totals.totalAmount += parseFloat(item.productDetail.price * item.productDetail.purchasedQuantity || 0);
      }
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
    // Ensure dates are properly formatted
    const formattedSearchData = {
      center: searchData.center,
      product: searchData.product,
      startDate: searchData.startDate,
      endDate: searchData.endDate,
      date: searchData.startDate && searchData.endDate 
        ? `${searchData.startDate} to ${searchData.endDate}`
        : ''
    };
    setActiveSearch(formattedSearchData);
    fetchData(formattedSearchData, 1);
  };

  const handleResetSearch = () => {
    setActiveSearch({ center: '', product: '', startDate: '', endDate: '', date: '' });
    setSearchTerm('');
    fetchData({}, 1);
  };

  const openExportModal = () => {
    setExportStartDate(activeSearch.startDate || '');
    setExportEndDate(activeSearch.endDate || '');
    setExportModalVisible(true);
  };

  const generateDetailExport = async () => {
    try {
      setLoading(true);
      
      // Validate dates
      if (exportStartDate && exportEndDate && exportStartDate > exportEndDate) {
        showError('Start date cannot be greater than end date');
        setLoading(false);
        return;
      }
      
      const params = new URLSearchParams();
      
      // Add all active search filters to export
      if (activeSearch.center) {
        params.append('center', activeSearch.center);
      }
      if (activeSearch.product) {
        params.append('product', activeSearch.product);
      }
      
      // Use export modal date range (overrides active search dates)
      if (exportStartDate) {
        params.append('startDate', exportStartDate);
      }
      if (exportEndDate) {
        params.append('endDate', exportEndDate);
      }
      
      params.append('export', 'true');
      
      const apiUrl = params.toString() 
        ? `/reports/purchased?${params.toString()}` 
        : '/reports/purchased';
      
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
  
      const csvData = exportData.flatMap(purchase => {
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
  
      // Create filename with date range if applied
      let filename = `purchase_detail_export`;
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
      setLoading(false);
    }
  };

  const filteredFlattenedData = getFlattenedData().filter(item => {
    if (activeSearch.product || activeSearch.center || activeSearch.startDate || activeSearch.endDate) {
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

  const totals = calculateTotals();

  return (
    <div>
      <div className='title'>Purchase Detail Report</div>
      <PurchaseSearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
      />

      {/* Export Modal */}
      <CModal visible={exportModalVisible} onClose={() => setExportModalVisible(false)} size="md">
        <CModalHeader>
          <CModalTitle>Export Purchase Detail Report</CModalTitle>
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
          {(activeSearch.center || activeSearch.product) && (
            <div className="mt-3 p-2 bg-light rounded">
              <strong>Current Filters:</strong>
              <ul className="mb-0 mt-1">
                {activeSearch.center && (
                  <li><small>Center: {centers.find(c => c._id === activeSearch.center)?.centerName}</small></li>
                )}
                {activeSearch.product && (
                  <li><small>Product: {products.find(p => p._id === activeSearch.product)?.productTitle}</small></li>
                )}
              </ul>
            </div>
          )}
        </CModalBody>
        
        <CModalFooter>
          <CButton color="secondary" onClick={() => setExportModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={generateDetailExport}>
            <i className="fa fa-fw fa-file-excel me-1"></i>
            Export
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
            {(activeSearch.center || activeSearch.product || activeSearch.startDate || activeSearch.endDate) && (
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
              disabled={data.length === 0}
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
              {(activeSearch.startDate || activeSearch.endDate) && (
                <div className="text-muted small">
                  {activeSearch.startDate && `From: ${activeSearch.startDate} `}
                  {activeSearch.endDate && `To: ${activeSearch.endDate}`}
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
          
          <div className="responsive-table-wrapper">
            <CTable striped bordered hover className='responsive-table'>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                    Date {getSortIcon('date')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('outlet')} className="sortable-header">
                    Branch {getSortIcon('outlet')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('invoiceNo')} className="sortable-header">
                    Invoice No. {getSortIcon('invoiceNo')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
                    Vendor {getSortIcon('vendor.businessName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.product.productTitle')} className="sortable-header">
                    Product {getSortIcon('productDetail.product.productTitle')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.purchasedQuantity')} className="sortable-header">
                    Qty {getSortIcon('productDetail.purchasedQuantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.price')} className="sortable-header">
                    Price {getSortIcon('productDetail.price')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
                    Remark {getSortIcon('remark')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredFlattenedData.length > 0 ? (
                  <>
                    {filteredFlattenedData.map((item) => (
                      <CTableRow key={item.uniqueKey}>
                        <CTableDataCell>
                          {formatDate(item.date || '')}
                        </CTableDataCell>
                        <CTableDataCell>{item.outlet?.centerName || ''}</CTableDataCell>
                        <CTableDataCell>{item.invoiceNo}</CTableDataCell>
                        <CTableDataCell>{item.vendor?.businessName || ''}</CTableDataCell>
                        <CTableDataCell>
                          {item.productDetail?.product?.productTitle || 'No Product'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.productDetail?.purchasedQuantity || 0}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.productDetail?.price || 0}
                        </CTableDataCell>
                        <CTableDataCell>{item.remark || ''}</CTableDataCell>
                      </CTableRow>
                    ))}
                    <CTableRow className='total-row'>
                      <CTableDataCell colSpan="5">Total</CTableDataCell>
                      <CTableDataCell>{totals.totalQty.toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{totals.totalAmount.toFixed(2)}</CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                    </CTableRow>
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
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

export default PurchaseDetail;