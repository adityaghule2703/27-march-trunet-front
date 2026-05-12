// import '../../css/table.css';
// import '../../css/form.css';
// import React, { useState, useRef, useEffect } from 'react';
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
// import SearchCenterStock from './SearchCenterStock';

// const AvailableStock = () => {
//   const [data, setData] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [activeSearch, setActiveSearch] = useState({  product: '', center: '' });
//   const [dropdownOpen, setDropdownOpen] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const dropdownRefs = useRef({});

//  const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const params = new URLSearchParams();
      
//       if (searchParams.product) {
//         params.append('product', searchParams.product);
//       }
//       if (searchParams.center) {
//         params.append('center', searchParams.center);
//       }
//       params.append('page', page);
      
//       const url = params.toString() ? `/availableStock/availableStock?${params.toString()}` : '/availableStock/availableStock';
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         setData(response.data.data.stock);
//         setCurrentPage(response.data.data.pagination.currentPage);
//         setTotalPages(response.data.data.pagination.totalPages);
//       } else {
//         const errorMessage = response.data.message || 'API returned unsuccessful response';
//         setError(errorMessage);
//         console.error('Backend error:', response.data);
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

//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData);
//     fetchData(searchData, 1);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch({product: '', center: '' });
//     setSearchTerm('');
//     fetchData({},1);
//   };

//   const filteredData = data.filter(data => {
//     if (activeSearch.product || activeSearch.center) {
//       return true;
//     }
//     return Object.values(data).some(value => {
//       if (typeof value === 'object' && value !== null) {
//         return Object.values(value).some(nestedValue => 
//           nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
//       return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
//     });
//   });

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const newDropdownState = {};
//       let shouldUpdate = false;
      
//       Object.keys(dropdownRefs.current).forEach(key => {
//         if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
//           newDropdownState[key] = false;
//           shouldUpdate = true;
//         }
//       });
      
//       if (shouldUpdate) {
//         setDropdownOpen(prev => ({ ...prev, ...newDropdownState }));
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

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
//       {error}
//       </div>
//     );
//   }

//   const generateDetailExport = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
      
//       if (activeSearch.product) {
//         params.append('product', activeSearch.product);
//       }
//       if (activeSearch.center) {
//         params.append('center', activeSearch.center);
//       }
//       params.append('export','true');
//       const apiUrl = params.toString() 
//         ? `/availableStock/availableStock?${params.toString()}` 
//         : '/availableStock/availableStock';
      
//       const response = await axiosInstance.get(apiUrl);
      
//       if (!response.data.success) {
//         throw new Error('API returned unsuccessful response');
//       }
  
//       const exportData = response.data.data.stock;
      
//       if (!exportData || exportData.length === 0) {
//         showError('No data available for export');
//         return;
//       }
  
//       const headers = [
//         'Center',
//         'Products',
//         'Category',
//         'Stock',
//         'Damage',
//       ];
  
//       const csvData = exportData.flatMap(purchase => {
//         if (purchase.products && purchase.products.length > 0) {
//           return purchase.products.map(product => [
//             purchase.centerName,
//             purchase.productName || 'N/A',
//             purchase.productCategory?.name || "",
//             purchase.availableQuantity || 0,
//             purchase.damagedQuantity || 0,
//           ]);
//         } else {
//           return [[
//             purchase.centerName,
//             purchase.productName || 'N/A',
//             purchase.productCategory?.name || "",
//             purchase.availableQuantity || 0,
//             purchase.damagedQuantity || 0,
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
//       link.setAttribute('download', `available_stock_${new Date().toISOString().split('T')[0]}.csv`);
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
//       <div className='title'>Available Stock</div>
    
//       <SearchCenterStock
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//        products={products}
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
//             {(activeSearch.product || activeSearch.center) && (
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
//               <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={generateDetailExport}
//             >
//               <i className="fa fa-fw fa-file-excel"></i>
//                Export
//             </CButton>
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//             >
//               <i className="fa fa-fw fa-print"></i>
//             Print
//             </CButton>
//           </div>
          
//           <div>
//           <Pagination
//                  currentPage={currentPage}
//                  totalPages={totalPages}
//                  onPageChange={handlePageChange}
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
//           <CTable striped bordered hover className='responsive-table'>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('outlet')} className="sortable-header">
//                  Branch {getSortIcon('outlet')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
//                 Product {getSortIcon('date')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('invoiceNo')} className="sortable-header">
//                   Category {getSortIcon('invoiceNo')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
//                   Stock {getSortIcon('vendor.businessName')}
//                 </CTableHeaderCell>
//                 <CTableHeaderCell scope="col" onClick={() => handleSort('damagedQuantity')} className="sortable-header">
//                  Damage {getSortIcon('damagedQuantity')}
//                 </CTableHeaderCell>
//              </CTableRow>
//             </CTableHead>
//             <CTableBody>
//               {filteredData.length > 0 ? (
//                 <>
//                   {filteredData.map((data) => (
//                     <CTableRow key={data._id}>
//                       <CTableDataCell>
//                           {data.centerName || ''}
//                       </CTableDataCell>
//                       <CTableDataCell>{data.productName}</CTableDataCell>
//                       <CTableDataCell>{data.productCategory.name || ''}</CTableDataCell>
//                       <CTableDataCell>{data.availableQuantity || 0}</CTableDataCell>
//                       <CTableDataCell>{data.damagedQuantity || 0}</CTableDataCell>
//                     </CTableRow>
//                   ))}
//                 </>
//               ) : (
//                 <CTableRow>
//                   <CTableDataCell colSpan="11" className="text-center">
//                     No data found
//                   </CTableDataCell>
//                 </CTableRow>
//               )}
//             </CTableBody>
//           </CTable>
//           </div>
//         </CCardBody>
//       </CCard>
//     </div>
//   );
// };

// export default AvailableStock;







// import '../../css/table.css';
// import '../../css/form.css';
// import React, { useState, useRef, useEffect } from 'react';
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
//   CSpinner,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormLabel
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut } from '@coreui/icons';
// import { CFormLabel as CFormLabelPro } from '@coreui/react-pro';
// import axiosInstance from 'src/axiosInstance';
// import Pagination from 'src/utils/Pagination';
// import { showError, showSuccess } from 'src/utils/sweetAlerts';
// import SearchCenterStock from './SearchCenterStock';

// const AvailableStock = () => {
//   const [data, setData] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [resellers, setResellers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [exportModalVisible, setExportModalVisible] = useState(false);
//   const [exportStartDate, setExportStartDate] = useState('');
//   const [exportEndDate, setExportEndDate] = useState('');
//   const [activeSearch, setActiveSearch] = useState({ 
//     product: '', 
//     center: '', 
//     resellerId: '',
//     startDate: '',
//     endDate: ''
//   });
//   const [dropdownOpen, setDropdownOpen] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const dropdownRefs = useRef({});

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const params = new URLSearchParams();
      
//       if (searchParams.product) {
//         params.append('product', searchParams.product);
//       }
//       if (searchParams.center) {
//         params.append('center', searchParams.center);
//       }
//       if (searchParams.resellerId) {
//         params.append('resellerId', searchParams.resellerId);
//       }
//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate);
//       }
//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate);
//       }
//       params.append('page', page);
      
//       const url = params.toString() ? `/availableStock/availableStock?${params.toString()}` : '/availableStock/availableStock';
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         setData(response.data.data.stock);
//         setCurrentPage(response.data.data.pagination.currentPage);
//         setTotalPages(response.data.data.pagination.totalPages);
//       } else {
//         const errorMessage = response.data.message || 'API returned unsuccessful response';
//         setError(errorMessage);
//         console.error('Backend error:', response.data);
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
//       const response = await axiosInstance.get('/products/all');
//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers');
//       if (response.data.success) {
//         setResellers(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching resellers:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//     fetchProducts();
//     fetchResellers();
//   }, []);

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     fetchData(activeSearch, page);
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

//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData);
//     fetchData(searchData, 1);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch({ 
//       product: '', 
//       center: '', 
//       resellerId: '', 
//       startDate: '', 
//       endDate: '' 
//     });
//     setSearchTerm('');
//     fetchData({}, 1);
//   };

//   const openExportModal = () => {
//     // Pre-fill with existing date filters from active search
//     setExportStartDate(activeSearch.startDate || '');
//     setExportEndDate(activeSearch.endDate || '');
//     setExportModalVisible(true);
//   };

//   const generateDetailExport = async () => {
//     try {
//       setLoading(true);
      
//       // Validate dates
//       if (exportStartDate && exportEndDate && exportStartDate > exportEndDate) {
//         showError('Start date cannot be greater than end date');
//         setLoading(false);
//         return;
//       }
      
//       const params = new URLSearchParams();
      
//       // Add all active search filters to export
//       if (activeSearch.product) {
//         params.append('product', activeSearch.product);
//       }
//       if (activeSearch.center) {
//         params.append('center', activeSearch.center);
//       }
//       if (activeSearch.resellerId) {
//         params.append('resellerId', activeSearch.resellerId);
//       }
      
//       // Use export modal date range (overrides active search dates)
//       if (exportStartDate) {
//         params.append('startDate', exportStartDate);
//       }
//       if (exportEndDate) {
//         params.append('endDate', exportEndDate);
//       }
      
//       params.append('export', 'true');
      
//       const apiUrl = `/availableStock/availableStock?${params.toString()}`;
      
//       const response = await axiosInstance.get(apiUrl);
      
//       if (!response.data.success) {
//         throw new Error('API returned unsuccessful response');
//       }
  
//       const exportData = response.data.data.stock;
      
//       if (!exportData || exportData.length === 0) {
//         showError('No data available for export');
//         return;
//       }
  
//       const headers = [
//         'Center',
//         'Products',
//         'Category',
//         'Stock',
//         'Damage',
//       ];
  
//       const csvData = exportData.map(item => [
//         item.centerName || '',
//         item.productName || 'N/A',
//         item.productCategory?.name || "",
//         item.availableQuantity || 0,
//         item.damagedQuantity || 0,
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
  
//       // Create filename with date range if applied
//       let filename = `available_stock_${new Date().toISOString().split('T')[0]}`;
//       if (exportStartDate && exportEndDate) {
//         filename += `_${exportStartDate}_to_${exportEndDate}`;
//       } else if (exportStartDate) {
//         filename += `_from_${exportStartDate}`;
//       } else if (exportEndDate) {
//         filename += `_until_${exportEndDate}`;
//       }
//       filename += '.csv';
  
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
//       // Reset export date fields
//       setExportStartDate('');
//       setExportEndDate('');
    
//     } catch (error) {
//       console.error('Error generating export:', error);
//       showError('Error generating export file');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredData = data.filter(data => {
//     if (activeSearch.product || activeSearch.center || activeSearch.resellerId || activeSearch.startDate || activeSearch.endDate) {
//       return true;
//     }
//     return Object.values(data).some(value => {
//       if (typeof value === 'object' && value !== null) {
//         return Object.values(value).some(nestedValue => 
//           nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
//       return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
//     });
//   });

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       const newDropdownState = {};
//       let shouldUpdate = false;
      
//       Object.keys(dropdownRefs.current).forEach(key => {
//         if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
//           newDropdownState[key] = false;
//           shouldUpdate = true;
//         }
//       });
      
//       if (shouldUpdate) {
//         setDropdownOpen(prev => ({ ...prev, ...newDropdownState }));
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

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
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className='title'>Available Stock</div>
    
//       <SearchCenterStock
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//         resellers={resellers}
//       />

//       {/* Export Modal */}
//       <CModal visible={exportModalVisible} onClose={() => setExportModalVisible(false)} size="md">
//         <CModalHeader>
//           <CModalTitle>Export Stock Data</CModalTitle>
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
//           {(activeSearch.product || activeSearch.center || activeSearch.resellerId) && (
//             <div className="mt-3 p-2 bg-light rounded">
//               <strong>Current Filters:</strong>
//               <ul className="mb-0 mt-1">
//                 {activeSearch.resellerId && (
//                   <li><small>Reseller: {resellers.find(r => r._id === activeSearch.resellerId)?.businessName}</small></li>
//                 )}
//                 {activeSearch.center && (
//                   <li><small>Center: {centers.find(c => c._id === activeSearch.center)?.centerName}</small></li>
//                 )}
//                 {activeSearch.product && (
//                   <li><small>Product: {products.find(p => p._id === activeSearch.product)?.productTitle}</small></li>
//                 )}
//               </ul>
//             </div>
//           )}
//         </CModalBody>
        
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setExportModalVisible(false)}>
//             Cancel
//           </CButton>
//           <CButton color="primary" onClick={generateDetailExport}>
//             <i className="fa fa-fw fa-file-excel me-1"></i>
//             Export
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
//             {(activeSearch.product || activeSearch.center || activeSearch.resellerId || activeSearch.startDate || activeSearch.endDate) && (
//               <CButton 
//                 size="sm" 
//                 color="secondary" 
//                 className="action-btn me-1"
//                 onClick={handleResetSearch}
//               >
//                 <CIcon icon={cilZoomOut} className='icon' />
//                 Reset Search
//               </CButton>
//             )}
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={openExportModal}
//             >
//               <i className="fa fa-fw fa-file-excel"></i>
//               Export
//             </CButton>
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//             >
//               <i className="fa fa-fw fa-print"></i>
//               Print
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
//               {(activeSearch.resellerId || activeSearch.startDate || activeSearch.endDate) && (
//                 <div className="text-muted small">
//                   {activeSearch.resellerId && `Reseller: ${resellers.find(r => r._id === activeSearch.resellerId)?.businessName || activeSearch.resellerId} | `}
//                   {activeSearch.startDate && `From: ${activeSearch.startDate} | `}
//                   {activeSearch.endDate && `To: ${activeSearch.endDate}`}
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
          
//           <div className="responsive-table-wrapper">
//             <CTable striped bordered hover className='responsive-table'>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('outlet')} className="sortable-header">
//                     Branch {getSortIcon('outlet')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
//                     Product {getSortIcon('date')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('invoiceNo')} className="sortable-header">
//                     Category {getSortIcon('invoiceNo')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
//                     Stock {getSortIcon('vendor.businessName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('damagedQuantity')} className="sortable-header">
//                     Damage {getSortIcon('damagedQuantity')}
//                   </CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData.length > 0 ? (
//                   <>
//                     {filteredData.map((data) => (
//                       <CTableRow key={data._id}>
//                         <CTableDataCell>
//                           {data.centerName || ''}
//                         </CTableDataCell>
//                         <CTableDataCell>{data.productName}</CTableDataCell>
//                         <CTableDataCell>{data.productCategory?.name || ''}</CTableDataCell>
//                         <CTableDataCell>{data.availableQuantity || 0}</CTableDataCell>
//                         <CTableDataCell>{data.damagedQuantity || 0}</CTableDataCell>
//                       </CTableRow>
//                     ))}
//                   </>
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan="11" className="text-center">
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

// export default AvailableStock;








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
import SearchCenterStock from './SearchCenterStock';

const AvailableStock = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [activeSearch, setActiveSearch] = useState({ 
    product: '', 
    center: '', 
    resellerId: '',
    startDate: '',
    endDate: ''
  });
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
      if (searchParams.resellerId) {
        params.append('resellerId', searchParams.resellerId);
      }
      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate);
      }
      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate);
      }
      params.append('page', page);
      
      const url = params.toString() ? `/availableStock/availableStock?${params.toString()}` : '/availableStock/availableStock';
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setData(response.data.data.stock);
        setCurrentPage(response.data.data.pagination.currentPage);
        setTotalPages(response.data.data.pagination.totalPages);
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

  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get('/resellers');
      if (response.data.success) {
        setResellers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching resellers:', error);
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
      center: '', 
      resellerId: '', 
      startDate: '', 
      endDate: '' 
    });
    setSearchTerm('');
    fetchData({}, 1);
  };

  const openExportModal = () => {
    // Pre-fill with existing date filters from active search
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
    
    // ONLY use startDate and endDate for export
    if (exportStartDate) {
      params.append('startDate', exportStartDate);
    }
    if (exportEndDate) {
      params.append('endDate', exportEndDate);
    }
    
    // Add export flag
    params.append('export', 'true');
    
    const apiUrl = `/availableStock/availableStock?${params.toString()}`;
    console.log('Export API URL:', apiUrl);
    
    // Important: Set responseType to 'blob' to handle the Excel file
    const response = await axiosInstance.get(apiUrl, {
      responseType: 'blob'
    });
    
    // Check if response is a blob (file)
    if (response.data instanceof Blob) {
      // Create filename with date range
      let filename = `available_stock_export`;
      if (exportStartDate && exportEndDate) {
        filename += `_${exportStartDate}_to_${exportEndDate}`;
      } else if (exportStartDate) {
        filename += `_from_${exportStartDate}`;
      } else if (exportEndDate) {
        filename += `_until_${exportEndDate}`;
      } else {
        filename += `_${new Date().toISOString().split('T')[0]}`;
      }
      
      // Check content type to determine file extension
      const contentType = response.headers['content-type'];
      if (contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        filename += '.xlsx';
      } else if (contentType === 'application/vnd.ms-excel') {
        filename += '.xls';
      } else {
        filename += '.xlsx'; // Default to xlsx
      }
      
      // Create download link
      const blob = new Blob([response.data], { type: contentType });
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
      // Reset export date fields
      setExportStartDate('');
      setExportEndDate('');
    } else {
      throw new Error('Unexpected response format from server');
    }
  
  } catch (error) {
    console.error('Error generating export:', error);
    
    // Try to parse error message from blob response if available
    let errorMessage = 'Error generating export file';
    if (error.response && error.response.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const parsed = JSON.parse(text);
        errorMessage = parsed.message || parsed.error || errorMessage;
      } catch (e) {
        errorMessage = error.response.statusText || errorMessage;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    showError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const filteredData = data.filter(data => {
    if (activeSearch.product || activeSearch.center || activeSearch.resellerId || activeSearch.startDate || activeSearch.endDate) {
      return true;
    }
    return Object.values(data).some(value => {
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
      <div className='title'>Available Stock</div>
    
      <SearchCenterStock
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
    <CModalTitle>Export Stock Data</CModalTitle>
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

    {/* Optional: Show info message that other filters won't apply */}
    <div className="mt-3 p-2 bg-info bg-opacity-10 rounded">
      <small className="text-info">
        <i className="fa fa-info-circle"></i> Note: Export will include all centers, products, and resellers within the selected date range.
      </small>
    </div>
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
            {(activeSearch.product || activeSearch.center || activeSearch.resellerId || activeSearch.startDate || activeSearch.endDate) && (
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
            >
              <i className="fa fa-fw fa-file-excel"></i>
              Export
            </CButton>
            <CButton 
              size="sm" 
              className="action-btn me-1"
            >
              <i className="fa fa-fw fa-print"></i>
              Print
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
              {(activeSearch.resellerId || activeSearch.startDate || activeSearch.endDate) && (
                <div className="text-muted small">
                  {activeSearch.resellerId && `Reseller: ${resellers.find(r => r._id === activeSearch.resellerId)?.businessName || activeSearch.resellerId} | `}
                  {activeSearch.startDate && `From: ${activeSearch.startDate} | `}
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
                  <CTableHeaderCell scope="col" onClick={() => handleSort('outlet')} className="sortable-header">
                    Branch {getSortIcon('outlet')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                    Product {getSortIcon('date')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('invoiceNo')} className="sortable-header">
                    Category {getSortIcon('invoiceNo')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
                    Stock {getSortIcon('vendor.businessName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('damagedQuantity')} className="sortable-header">
                    Damage {getSortIcon('damagedQuantity')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.map((data) => (
                      <CTableRow key={data._id}>
                        <CTableDataCell>
                          {data.centerName || ''}
                        </CTableDataCell>
                        <CTableDataCell>{data.productName}</CTableDataCell>
                        <CTableDataCell>{data.productCategory?.name || ''}</CTableDataCell>
                        <CTableDataCell>{data.availableQuantity || 0}</CTableDataCell>
                        <CTableDataCell>{data.damagedQuantity || 0}</CTableDataCell>
                      </CTableRow>
                    ))}
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

export default AvailableStock;
