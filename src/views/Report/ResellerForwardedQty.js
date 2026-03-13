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
//   CBadge,
//   CPopover,
//   CListGroup,
//   CListGroupItem
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut, cilInfo } from '@coreui/icons';
// import { CFormLabel } from '@coreui/react-pro';
// import axiosInstance from 'src/axiosInstance';
// import Pagination from 'src/utils/Pagination';
// import { showError, showSuccess } from 'src/utils/sweetAlerts';
// import ResellerQtySearch from './ResellerQtySearch';

// const ResellerStock = () => {
//   const [data, setData] = useState([]);
//   const [flattenedData, setFlattenedData] = useState([]);
//   const [resellers, setResellers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [activeSearch, setActiveSearch] = useState({ 
//     reseller: '', 
//     product: '', 
//     center: '',
//     startDate: '',
//     endDate: '',
//     status: 'Completed'
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [centers, setCenters] = useState([]);
//   const [stats, setStats] = useState({
//     totalResellers: 0,
//     totalForwardedQty: 0
//   });

//   const itemsPerPage = 50;

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const params = new URLSearchParams();
      
//       if (searchParams.reseller) {
//         params.append('resellerId', searchParams.reseller);
//       }
//       if (searchParams.center) {
//         params.append('center', searchParams.center);
//       }
//       if (searchParams.product) {
//         params.append('product', searchParams.product);
//       }
//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate);
//       }
//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate);
//       }
//       if (searchParams.status) {
//         params.append('status', searchParams.status);
//       }
      
//       params.append('page', page);
      
//       const url = params.toString() 
//         ? `/resellerStock/reseller-forwarded-qty?${params.toString()}` 
//         : '/resellerStock/reseller-forwarded-qty';
      
//       console.log('Fetching from URL:', url);
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         let apiData = [];
        
//         if (Array.isArray(response.data.data)) {
//           apiData = response.data.data;
//         } else if (response.data.data && typeof response.data.data === 'object') {
         
//           apiData = [response.data.data];
//         }
        
//         setData(apiData);
        
      
//         const flattened = [];
//         apiData.forEach(reseller => {
//           if (reseller.products && reseller.products.length > 0) {
//             reseller.products.forEach(product => {
             
//               const centersList = Object.values(product.centers || {})
//                 .map(center => `${center.centerName} (${center.forwardedQty})`)
//                 .join(', ');
              
//               const centersCount = Object.keys(product.centers || {}).length;
              
//               flattened.push({
//                 _id: `${reseller.resellerId}_${product.productId}`,
//                 resellerId: reseller.resellerId,
//                 resellerName: reseller.resellerName,
//                 resellerEmail: reseller.resellerEmail,
//                 resellerMobile: reseller.resellerMobile,
//                 productId: product.productId,
//                 productName: product.productName,
//                 productCode: product.productCode,
//                 availableQuantity: product.totalForwardedQty,
//                 displayQuantity: product.totalForwardedQty,
//                 orderCount: product.orderCount,
//                 centers: product.centers || {},
//                 centersCount: centersCount,
//                 centersList: centersList
//               });
//             });
//           }
//         });
        
//         setFlattenedData(flattened);
//         setTotalPages(Math.ceil(flattened.length / itemsPerPage));
//         setCurrentPage(1);
//         setStats(response.data.stats || {});
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

//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers');
//       if (response.data.success) {
//         setResellers(response.data.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching resellers:', error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const response = await axiosInstance.get('/products/all');
//       if (response.data.success) {
//         setProducts(response.data.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchResellers();
//     fetchProducts();
//   }, []);

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });

//     const sortedData = [...filteredData].sort((a, b) => {
//       let aValue = a[key] || 0;
//       let bValue = b[key] || 0;
      
//       if (typeof aValue === 'string') aValue = aValue.toLowerCase();
//       if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
//       if (aValue < bValue) {
//         return direction === 'ascending' ? -1 : 1;
//       }
//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });

//     setFlattenedData(sortedData);
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
//       reseller: '', 
//       product: '', 
//       center: '', 
//       startDate: '', 
//       endDate: '',
//       status: 'Completed'
//     });
//     setSearchTerm('');
//     fetchData({}, 1);
//   };

//   const filteredData = flattenedData.filter(item => {
//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       return (
//         (item.resellerName && item.resellerName.toLowerCase().includes(searchLower)) ||
//         (item.productName && item.productName.toLowerCase().includes(searchLower)) ||
//         (item.productCode && item.productCode.toLowerCase().includes(searchLower))
//       );
//     }
//     return true;
//   });

//   const getCurrentPageData = () => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return filteredData.slice(startIndex, endIndex);
//   };

//   const generateExport = async () => {
//     try {
//       setLoading(true);
      
//       const params = new URLSearchParams();
//       if (activeSearch.reseller) {
//         params.append('resellerId', activeSearch.reseller);
//       }
//       if (activeSearch.center) {
//         params.append('center', activeSearch.center);
//       }
//       if (activeSearch.product) {
//         params.append('product', activeSearch.product);
//       }
//       if (activeSearch.startDate) {
//         params.append('startDate', activeSearch.startDate);
//       }
//       if (activeSearch.endDate) {
//         params.append('endDate', activeSearch.endDate);
//       }
//       if (activeSearch.status) {
//         params.append('status', activeSearch.status);
//       }
//       params.append('export','true');
//       const apiUrl = params.toString() 
//         ? `/resellerStock/reseller-forwarded-qty?${params.toString()}` 
//         : '/resellerStock/reseller-forwarded-qty';
      
//       const response = await axiosInstance.get(apiUrl);
      
//       if (!response.data.success) {
//         throw new Error('API returned unsuccessful response');
//       }
  
//       let exportData = [];
      
//       if (Array.isArray(response.data.data)) {
//         exportData = response.data.data;
//       } else if (response.data.data && typeof response.data.data === 'object') {
//         exportData = [response.data.data];
//       }
      
//       const flattenedExport = [];
      
//       exportData.forEach(reseller => {
//         if (reseller.products && reseller.products.length > 0) {
//           reseller.products.forEach(product => {
//             const centersFormatted = Object.values(product.centers || {})
//               .map(center => `${center.centerName} (${center.forwardedQty})`)
//               .join('; ');
            
//             flattenedExport.push({
//               resellerName: reseller.resellerName,
//               resellerEmail: reseller.resellerEmail,
//               productName: product.productName,
//               productCode: product.productCode,
//               quantity: product.totalForwardedQty,
//               orderCount: product.orderCount,
//               centers: centersFormatted,
//               centersCount: Object.keys(product.centers || {}).length
//             });
//           });
//         }
//       });
      
//       if (flattenedExport.length === 0) {
//         showError('No data available for export');
//         return;
//       }
      
//       const headers = [
//         'Reseller Name',
//         'Product Name',
//         'Forwarded Quantity',
//         'Order Count',
//         'Centers Count',
//         'Centers (with quantity)'
//       ];
  
//       const csvData = flattenedExport.map(item => [
//         item.resellerName || '',
//         item.productName || '',
//         item.quantity || 0,
//         item.orderCount || 0,
//         item.centersCount || 0,
//         item.centers || ''
//       ]);
      
//       const csvContent = [
//         headers.join(','),
//         ...csvData.map(row => 
//           row.map(field => `"${String(field || '').replace(/"/g, '""')}"`).join(',')
//         )
//       ].join('\n');
  
//       const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const downloadUrl = URL.createObjectURL(blob);
      
//       const filterText = [];
//       if (activeSearch.reseller) {
//         const reseller = resellers.find(r => r._id === activeSearch.reseller);
//         if (reseller) filterText.push(reseller.businessName);
//       }
      
//       const filename = `reseller_forwarded_qty_${filterText.length > 0 ? filterText.join('_') + '_' : ''}${new Date().toISOString().split('T')[0]}.csv`;
      
//       link.setAttribute('href', downloadUrl);
//       link.setAttribute('download', filename);
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


//   const renderCenterPopover = (centers) => {
//     if (!centers || Object.keys(centers).length === 0) {
//       return <span>No centers</span>;
//     }
    
//     return (
//       <CPopover
//         content={
//           <CListGroup flush>
//             {Object.values(centers).map((center, idx) => (
//               <CListGroupItem key={idx} className="d-flex justify-content-between">
//                 <span>{center.centerName} ({center.centerCode})</span>
//                 <CBadge color="info" className="ms-2">{center.forwardedQty}</CBadge>
//               </CListGroupItem>
//             ))}
//           </CListGroup>
//         }
//         placement="top"
//       >
//         <CButton color="link" className="p-0">
//           <CIcon icon={cilInfo} className="text-info" />
//           <span className="ms-1">{Object.keys(centers).length} centers</span>
//         </CButton>
//       </CPopover>
//     );
//   };

//   if (loading && flattenedData.length === 0) {
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

//   const currentData = getCurrentPageData();

//   return (
//     <div>
//       <div className='title'>Reseller Forwarded Quantity Report</div>
//       <ResellerQtySearch
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         resellers={resellers}
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
//             {(activeSearch.reseller || activeSearch.startDate) && (
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
//               onClick={generateExport}
//               disabled={flattenedData.length === 0}
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
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('resellerName')} className="sortable-header">
//                     Reseller {getSortIcon('resellerName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productName')} className="sortable-header">
//                     Product {getSortIcon('productName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productCode')} className="sortable-header">
//                     Product Code {getSortIcon('productCode')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('availableQuantity')} className="sortable-header">
//                     Forwarded Quantity {getSortIcon('availableQuantity')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('orderCount')} className="sortable-header">
//                     Orders {getSortIcon('orderCount')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('centersCount')} className="sortable-header">
//                     Centers {getSortIcon('centersCount')}
//                   </CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {currentData.length > 0 ? (
//                   currentData.map((item) => (
//                     <CTableRow key={item._id}>
//                       <CTableDataCell>
//                         {item.resellerName || ''}
//                       </CTableDataCell>
//                       <CTableDataCell>
//                         {item.productName || ''}
//                       </CTableDataCell>
//                       <CTableDataCell>{item.productCode || ''}</CTableDataCell>
//                       <CTableDataCell>
//                        {item.displayQuantity || 0}
//                       </CTableDataCell>
//                       <CTableDataCell>{item.orderCount || 0}</CTableDataCell>
//                       <CTableDataCell>
//                         {renderCenterPopover(item.centers)}
//                       </CTableDataCell>
//                     </CTableRow>
//                   ))
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan="6" className="text-center">
//                       {loading ? (
//                         <CSpinner size="sm" />
//                       ) : (
//                         'No data found. Try adjusting your search filters.'
//                       )}
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

// export default ResellerStock;





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
  CPopover,
  CListGroup,
  CListGroupItem
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut, cilInfo } from '@coreui/icons';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { showError, showSuccess } from 'src/utils/sweetAlerts';
import ResellerQtySearch from './ResellerQtySearch';

const ResellerStock = () => {
  const [data, setData] = useState([]);
  const [flattenedData, setFlattenedData] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeSearch, setActiveSearch] = useState({ 
    reseller: '', 
    product: '', 
    center: '',
    startDate: '',
    endDate: '',
    status: 'Completed'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [centers, setCenters] = useState([]);
  const [stats, setStats] = useState({
    totalResellers: 0,
    totalForwardedQty: 0
  });

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      if (searchParams.reseller) {
        params.append('resellerId', searchParams.reseller);
      }
      if (searchParams.center) {
        params.append('center', searchParams.center);
      }
      if (searchParams.product) {
        params.append('product', searchParams.product);
      }
      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate);
      }
      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate);
      }
      if (searchParams.status) {
        params.append('status', searchParams.status);
      }
      
      params.append('page', page);
      
      const url = params.toString() 
        ? `/resellerStock/reseller-forwarded-qty?${params.toString()}` 
        : '/resellerStock/reseller-forwarded-qty';
      
      console.log('Fetching from URL:', url);
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        let apiData = [];
        
        if (Array.isArray(response.data.data)) {
          apiData = response.data.data;
        } else if (response.data.data && typeof response.data.data === 'object') {
          apiData = [response.data.data];
        }
        
        setData(apiData);
        
        // Flatten the data for display
        const flattened = [];
        apiData.forEach(reseller => {
          if (reseller.products && reseller.products.length > 0) {
            reseller.products.forEach(product => {
              const centersList = Object.values(product.centers || {})
                .map(center => `${center.centerName} (${center.forwardedQty})`)
                .join(', ');
              
              const centersCount = Object.keys(product.centers || {}).length;
              
              flattened.push({
                _id: `${reseller.resellerId}_${product.productId}`,
                resellerId: reseller.resellerId,
                resellerName: reseller.resellerName,
                resellerEmail: reseller.resellerEmail,
                resellerMobile: reseller.resellerMobile,
                productId: product.productId,
                productName: product.productName,
                productCode: product.productCode,
                availableQuantity: product.totalForwardedQty,
                displayQuantity: product.totalForwardedQty,
                orderCount: product.orderCount,
                centers: product.centers || {},
                centersCount: centersCount,
                centersList: centersList
              });
            });
          }
        });
        
        setFlattenedData(flattened);
        
        // Set pagination from API response
        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.currentPage);
          setTotalPages(response.data.pagination.totalPages);
        }
        
        setStats(response.data.stats || {});
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

  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get('/resellers');
      if (response.data.success) {
        setResellers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching resellers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all');
      if (response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchResellers();
    fetchProducts();
  }, []);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, page); // Fetch new page data from backend
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    // Sort the current page data only
    const sortedData = [...flattenedData].sort((a, b) => {
      let aValue = a[key] || 0;
      let bValue = b[key] || 0;
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFlattenedData(sortedData);
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
    fetchData(searchData, 1); // Start from page 1 when searching
  };

  const handleResetSearch = () => {
    setActiveSearch({ 
      reseller: '', 
      product: '', 
      center: '', 
      startDate: '', 
      endDate: '',
      status: 'Completed'
    });
    setSearchTerm('');
    fetchData({}, 1); // Reset to page 1 with no filters
  };

  // Client-side filtering for the current page data only
  const filteredData = flattenedData.filter(item => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (item.resellerName && item.resellerName.toLowerCase().includes(searchLower)) ||
        (item.productName && item.productName.toLowerCase().includes(searchLower)) ||
        (item.productCode && item.productCode.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  const generateExport = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (activeSearch.reseller) {
        params.append('resellerId', activeSearch.reseller);
      }
      if (activeSearch.center) {
        params.append('center', activeSearch.center);
      }
      if (activeSearch.product) {
        params.append('product', activeSearch.product);
      }
      if (activeSearch.startDate) {
        params.append('startDate', activeSearch.startDate);
      }
      if (activeSearch.endDate) {
        params.append('endDate', activeSearch.endDate);
      }
      if (activeSearch.status) {
        params.append('status', activeSearch.status);
      }
      params.append('export','true');
      const apiUrl = params.toString() 
        ? `/resellerStock/reseller-forwarded-qty?${params.toString()}` 
        : '/resellerStock/reseller-forwarded-qty';
      
      const response = await axiosInstance.get(apiUrl);
      
      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }
  
      let exportData = [];
      
      if (Array.isArray(response.data.data)) {
        exportData = response.data.data;
      } else if (response.data.data && typeof response.data.data === 'object') {
        exportData = [response.data.data];
      }
      
      const flattenedExport = [];
      
      exportData.forEach(reseller => {
        if (reseller.products && reseller.products.length > 0) {
          reseller.products.forEach(product => {
            const centersFormatted = Object.values(product.centers || {})
              .map(center => `${center.centerName} (${center.forwardedQty})`)
              .join('; ');
            
            flattenedExport.push({
              resellerName: reseller.resellerName,
              resellerEmail: reseller.resellerEmail,
              productName: product.productName,
              productCode: product.productCode,
              quantity: product.totalForwardedQty,
              orderCount: product.orderCount,
              centers: centersFormatted,
              centersCount: Object.keys(product.centers || {}).length
            });
          });
        }
      });
      
      if (flattenedExport.length === 0) {
        showError('No data available for export');
        return;
      }
      
      const headers = [
        'Reseller Name',
        'Product Name',
        'Forwarded Quantity',
        'Order Count',
        'Centers Count',
        'Centers (with quantity)'
      ];
  
      const csvData = flattenedExport.map(item => [
        item.resellerName || '',
        item.productName || '',
        item.quantity || 0,
        item.orderCount || 0,
        item.centersCount || 0,
        item.centers || ''
      ]);
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(field => `"${String(field || '').replace(/"/g, '""')}"`).join(',')
        )
      ].join('\n');
  
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const downloadUrl = URL.createObjectURL(blob);
      
      const filterText = [];
      if (activeSearch.reseller) {
        const reseller = resellers.find(r => r._id === activeSearch.reseller);
        if (reseller) filterText.push(reseller.businessName);
      }
      
      const filename = `reseller_forwarded_qty_${filterText.length > 0 ? filterText.join('_') + '_' : ''}${new Date().toISOString().split('T')[0]}.csv`;
      
      link.setAttribute('href', downloadUrl);
      link.setAttribute('download', filename);
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

  const renderCenterPopover = (centers) => {
    if (!centers || Object.keys(centers).length === 0) {
      return <span>No centers</span>;
    }
    
    return (
      <CPopover
        content={
          <CListGroup flush>
            {Object.values(centers).map((center, idx) => (
              <CListGroupItem key={idx} className="d-flex justify-content-between">
                <span>{center.centerName} ({center.centerCode})</span>
                <CBadge color="info" className="ms-2">{center.forwardedQty}</CBadge>
              </CListGroupItem>
            ))}
          </CListGroup>
        }
        placement="top"
      >
        <CButton color="link" className="p-0">
          <CIcon icon={cilInfo} className="text-info" />
          <span className="ms-1">{Object.keys(centers).length} centers</span>
        </CButton>
      </CPopover>
    );
  };

  if (loading && flattenedData.length === 0) {
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
      <div className='title'>Reseller Forwarded Quantity Report</div>
      <ResellerQtySearch
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        resellers={resellers}
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
            {(activeSearch.reseller || activeSearch.startDate) && (
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
              onClick={generateExport}
              disabled={flattenedData.length === 0}
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
                  <CTableHeaderCell scope="col" onClick={() => handleSort('resellerName')} className="sortable-header">
                    Reseller {getSortIcon('resellerName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productName')} className="sortable-header">
                    Product {getSortIcon('productName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productCode')} className="sortable-header">
                    Product Code {getSortIcon('productCode')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('availableQuantity')} className="sortable-header">
                    Forwarded Quantity {getSortIcon('availableQuantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('orderCount')} className="sortable-header">
                    Orders {getSortIcon('orderCount')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('centersCount')} className="sortable-header">
                    Centers {getSortIcon('centersCount')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <CTableRow key={item._id}>
                      <CTableDataCell>
                        {item.resellerName || ''}
                      </CTableDataCell>
                      <CTableDataCell>
                        {item.productName || ''}
                      </CTableDataCell>
                      <CTableDataCell>{item.productCode || ''}</CTableDataCell>
                      <CTableDataCell>
                       {item.displayQuantity || 0}
                      </CTableDataCell>
                      <CTableDataCell>{item.orderCount || 0}</CTableDataCell>
                      <CTableDataCell>
                        {renderCenterPopover(item.centers)}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="6" className="text-center">
                      {loading ? (
                        <CSpinner size="sm" />
                      ) : (
                        'No data found. Try adjusting your search filters.'
                      )}
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

export default ResellerStock;