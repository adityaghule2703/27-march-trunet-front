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
// import { formatDate} from 'src/utils/FormatDateTime';
// import CommonSearch from './CommonSearch';
// import { useLocation } from 'react-router-dom';

// const TransferDetail = () => {
//   const [data, setData] = useState([]);
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
//     endDate: ''
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const location = useLocation();

//   const getUrlParams = () => {
//     const searchParams = new URLSearchParams(location.search);
//     return {
//       product: searchParams.get('product'),
//       center: searchParams.get('center'),
//       productName: searchParams.get('productName'),
//       centerName: searchParams.get('centerName'),
//       month: searchParams.get('month'),
//       transferType: searchParams.get('transferType')
//     };
//   };
//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setLoading(true);
//         const urlParams = getUrlParams();
        
//         console.log('Transfer Detail URL Parameters:', urlParams);

//         await Promise.all([fetchCenters(), fetchProducts()]);
        
//         let searchParams = {};

//         if (urlParams.product && urlParams.center) {
//           searchParams = {
//             product: urlParams.product,
//             center: urlParams.center,
//             startDate: '',
//             endDate: ''
//           };
//           if (urlParams.month) {
//             const [year, month] = urlParams.month.split('-');
//             const monthStart = `${year}-${month.padStart(2, '0')}-01`;
//             const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
//             const monthEnd = `${year}-${month.padStart(2, '0')}-${lastDay}`;
            
//             searchParams.date = `01-${month.padStart(2, '0')}-${year} to ${lastDay}-${month.padStart(2, '0')}-${year}`;
//           }
          
//           console.log('Using filtered search from URL:', searchParams);
//           setActiveSearch(searchParams);
          
//           if (urlParams.productName && urlParams.centerName) {
//             const transferTypeText = urlParams.transferType === 'receive' ? 'Received' : 'Given';
//             document.title = `Transfer Details (${transferTypeText}) - ${decodeURIComponent(urlParams.productName)} at ${decodeURIComponent(urlParams.centerName)}`;
//           }
//         } else {
//           console.log('No URL parameters, fetching all data');
//           searchParams = {};
//         }
//         await fetchData(searchParams, 1);
        
//       } catch (error) {
//         console.error('Error initializing data:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeData();
//   }, [location.search]);

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const params = new URLSearchParams();

//       const urlParams = getUrlParams();
      
//       const centerId = urlParams.center || searchParams.center;
//       const productId = urlParams.product || searchParams.product;
//       const transferType = urlParams.transferType;
  
//       if (centerId) {
//         if (transferType === 'receive') {
//           params.append('toCenter', centerId);
//         } else if (transferType === 'given') {
//           params.append('fromCenter', centerId);
//         } else {
//           params.append('center', centerId);
//         }
//       }
      
//       if (productId) {
//         params.append('product', productId);
//       }
      
//       if (searchParams.date && searchParams.date.includes(' to ')) {
//         const [startDateStr, endDateStr] = searchParams.date.split(' to ');
//         const convertDateFormat = (dateStr) => {
//           const [day, month, year] = dateStr.split('-');
//           return `${year}-${month}-${day}`;
//         };
        
//         params.append('startDate', convertDateFormat(startDateStr));
//         params.append('endDate', convertDateFormat(endDateStr));
//       }
      
//       if (urlParams.month) {
//         const [year, month] = urlParams.month.split('-');
//         const monthStart = `${year}-${month.padStart(2, '0')}-01`;
//         const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
//         const monthEnd = `${year}-${month.padStart(2, '0')}-${lastDay}`;
        
//         params.append('startDate', monthStart);
//         params.append('endDate', monthEnd);
//       }
      
//       params.append('page', page);
//       const url = params.toString() ? `/reports/transfers?${params.toString()}` : '/reports/transfers';
//       console.log('Fetching URL:', url);
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         setData(response.data.data);
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
//     data.forEach(transfer => {
//       if (transfer.products && transfer.products.length > 0) {
//         transfer.products.forEach(product => {
//           flattened.push({
//             ...transfer,
//             productDetail: product,
//             uniqueKey: `${transfer._id}_${product._id}`
//           });
//         });
//       } else {
//         flattened.push({
//           ...transfer,
//           productDetail: null,
//           uniqueKey: `${transfer._id}_no_product`
//         });
//       }
//     });
//     return flattened;
//   };

//   const calculateTotals = () => {
//     const totals = {
//       totalRequestedQty: 0,
//       totalApprovedQty: 0,
//       totalReceivedQty: 0
//     };

//     getFlattenedData().forEach(item => {
//       if (item.productDetail) {
//         totals.totalRequestedQty += parseFloat(item.productDetail.quantity || 0);
//         totals.totalApprovedQty += parseFloat(item.productDetail.approvedQuantity || 0);
//         totals.totalReceivedQty += parseFloat(item.productDetail.receivedQuantity || 0);
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
//       endDate: ''
//     });
//     setSearchTerm('');
//     fetchData({}, 1);
//   };

//   const isSearchActive = () => {
//     return activeSearch.center || 
//            activeSearch.product || 
//            activeSearch.startDate || 
//            activeSearch.endDate
//   };

//   const filteredFlattenedData = getFlattenedData().filter(item => {
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
      
//       const apiUrl = params.toString() 
//         ? `/reports/transfers?${params.toString()}` 
//         : '/reports/transfers';
      
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
//         'Invoice No.',
//         'Date',
//         'Center',
//         'Parent Center',
//         'Product',
//         'Quantity',
//         'Center Stock',
//         'Parent Stock',
//         'Product Remark',
//         'Approved Quantity',
//         'Approved Remark',
//         'Received Qty.',
//         'Received Remark'
//       ];
  
//       const csvData = exportData.flatMap(transfer => {
//         if (transfer.products && transfer.products.length > 0) {
//           return transfer.products.map(product => [
//             transfer.transferNumber || 'N/A',
//             formatDate(transfer.date),
//             transfer.fromCenter?.centerName || 'N/A',
//             transfer.toCenter?.centerName || 'N/A',
//             product.product?.productTitle || 'N/A',
//             product.quantity || 0,
//             product.fromCenterStock?.availableQuantity || 0,
//             product.toCenterStock?.availableQuantity || 0,
//             product.productRemark || '',
//             product.approvedQuantity || 0,
//             product.approvedRemark || '',
//             product.receivedQuantity || 0,
//             product.receivedRemark || '',
//           ]);
//         } else {
//           return [[
//             transfer.transferNumber || 'N/A',
//             formatDate(transfer.date),
//             transfer.fromCenter?.centerName || 'N/A',
//             transfer.toCenter?.centerName || 'N/A',
//             'No Product',
//             0,
//             0,
//             0,
//             '',
//             0,
//             '',
//             0,
//             '',
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
//       link.setAttribute('download', `transfer_detail_report_${new Date().toISOString().split('T')[0]}.csv`);
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
//       <div className='title'>Transfer Detail Report</div>
//       <CommonSearch
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
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('transferNumber')} className="sortable-header">
//                   Indent No {getSortIcon('transferNumber')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
//                     Date {getSortIcon('date')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('fromCenter.centerName')} className="sortable-header">
//                    Branch {getSortIcon('fromCenter.centerName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('toCenter.centerName')} className="sortable-header">
//                     Parent Branch {getSortIcon('toCenter.centerName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.product.productTitle')} className="sortable-header">
//                     Product {getSortIcon('productDetail.product.productTitle')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.quantity')} className="sortable-header">
//                     Requested Qty {getSortIcon('productDetail.quantity')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.toCenterStock.availableQuantity')} className="sortable-header">
//                    Center Stock {getSortIcon('productDetail.toCenterStock.availableQuantity')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.fromCenterStock.availableQuantity')} className="sortable-header">
//                     Parent Stock {getSortIcon('productDetail.fromCenterStock.availableQuantity')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.approvedQuantity')} className="sortable-header">
//                     Approved Qty {getSortIcon('productDetail.approvedQuantity')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.receivedQuantity')} className="sortable-header">
//                     Received Qty {getSortIcon('productDetail.receivedQuantity')}
//                   </CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredFlattenedData.length > 0 ? (
//                   <>
//                     {filteredFlattenedData.map((item) => (
//                       <CTableRow key={item.uniqueKey}>
//                         <CTableDataCell>{item.transferNumber || ''}</CTableDataCell>
//                         <CTableDataCell>{formatDate(item.date || '')}</CTableDataCell>
//                         <CTableDataCell>{item.toCenter?.centerName || ''}</CTableDataCell>
//                         <CTableDataCell>{item.fromCenter?.centerName || ''}</CTableDataCell>
//                         <CTableDataCell>
//                           {item.productDetail?.product?.productTitle || 'No Product'}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.productDetail?.quantity || 0}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.productDetail?.toCenterStock?.availableQuantity || 0}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.productDetail?.fromCenterStock?.availableQuantity || 0}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.productDetail?.approvedQuantity || 0}
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {item.productDetail?.receivedQuantity || 0}
//                         </CTableDataCell>
//                       </CTableRow>
//                     ))}
//                     <CTableRow className='total-row'>
//                       <CTableDataCell colSpan="5">Total</CTableDataCell>
//                       <CTableDataCell>{totals.totalRequestedQty}</CTableDataCell>
//                       <CTableDataCell></CTableDataCell>
//                       <CTableDataCell></CTableDataCell>
//                       <CTableDataCell>{totals.totalApprovedQty}</CTableDataCell>
//                       <CTableDataCell>{totals.totalReceivedQty}</CTableDataCell>
//                     </CTableRow>
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

// export default TransferDetail;







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
import { formatDate} from 'src/utils/FormatDateTime';
import CommonSearch from './CommonSearch';
import { useLocation } from 'react-router-dom';

const TransferDetail = () => {
  const [data, setData] = useState([]);
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
    endDate: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();

  // Helper function to convert DD-MM-YYYY to YYYY-MM-DD for API
  const convertToYYYYMMDD = (dateStr) => {
    if (!dateStr) return '';
    // If already in YYYY-MM-DD format, return as is
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateStr;
    }
    // Convert from DD-MM-YYYY to YYYY-MM-DD
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const getUrlParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      product: searchParams.get('product'),
      center: searchParams.get('center'),
      productName: searchParams.get('productName'),
      centerName: searchParams.get('centerName'),
      month: searchParams.get('month'),
      transferType: searchParams.get('transferType')
    };
  };
  
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const urlParams = getUrlParams();
        
        console.log('Transfer Detail URL Parameters:', urlParams);

        await Promise.all([fetchCenters(), fetchProducts()]);
        
        let searchParams = {};

        if (urlParams.product && urlParams.center) {
          searchParams = {
            product: urlParams.product,
            center: urlParams.center,
            startDate: '',
            endDate: ''
          };
          if (urlParams.month) {
            const [year, month] = urlParams.month.split('-');
            const monthStart = `${year}-${month.padStart(2, '0')}-01`;
            const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
            const monthEnd = `${year}-${month.padStart(2, '0')}-${lastDay}`;
            
            // For URL params, we need YYYY-MM-DD format for the API
            searchParams.startDate = monthStart;
            searchParams.endDate = monthEnd;
          }
          
          console.log('Using filtered search from URL:', searchParams);
          setActiveSearch(searchParams);
          
          if (urlParams.productName && urlParams.centerName) {
            const transferTypeText = urlParams.transferType === 'receive' ? 'Received' : 'Given';
            document.title = `Transfer Details (${transferTypeText}) - ${decodeURIComponent(urlParams.productName)} at ${decodeURIComponent(urlParams.centerName)}`;
          }
        } else {
          console.log('No URL parameters, fetching all data');
          searchParams = {};
        }
        await fetchData(searchParams, 1);
        
      } catch (error) {
        console.error('Error initializing data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [location.search]);

 const fetchData = async (searchParams = {}, page = 1) => {
  try {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();

    const urlParams = getUrlParams();
    
    const centerId = urlParams.center || searchParams.center;
    const productId = urlParams.product || searchParams.product;
    const transferType = urlParams.transferType;

    if (centerId) {
      if (transferType === 'receive') {
        params.append('toCenter', centerId);
      } else if (transferType === 'given') {
        params.append('fromCenter', centerId);
      } else {
        params.append('center', centerId);
      }
    }
    
    if (productId) {
      params.append('product', productId);
    }
    
    // Handle dates - convert from DD-MM-YYYY to YYYY-MM-DD for API
    if (searchParams.startDate && searchParams.endDate) {
      const convertedStartDate = convertToYYYYMMDD(searchParams.startDate);
      const convertedEndDate = convertToYYYYMMDD(searchParams.endDate);
      
      params.append('startDate', convertedStartDate);
      params.append('endDate', convertedEndDate);
      
      console.log('Original dates (DD-MM-YYYY):', searchParams.startDate, searchParams.endDate);
      console.log('Converted dates (YYYY-MM-DD):', convertedStartDate, convertedEndDate);
    }
    
    // REMOVED the old date format code that was causing duplicates
    // The old code that checked for searchParams.date has been removed
    
    if (urlParams.month) {
      const [year, month] = urlParams.month.split('-');
      const monthStart = `${year}-${month.padStart(2, '0')}-01`;
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
      const monthEnd = `${year}-${month.padStart(2, '0')}-${lastDay}`;
      
      params.append('startDate', monthStart);
      params.append('endDate', monthEnd);
    }
    
    params.append('page', page);
    const url = params.toString() ? `/reports/transfers?${params.toString()}` : '/reports/transfers';
    console.log('Fetching URL:', url);
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
    data.forEach(transfer => {
      if (transfer.products && transfer.products.length > 0) {
        transfer.products.forEach(product => {
          flattened.push({
            ...transfer,
            productDetail: product,
            uniqueKey: `${transfer._id}_${product._id}`
          });
        });
      } else {
        flattened.push({
          ...transfer,
          productDetail: null,
          uniqueKey: `${transfer._id}_no_product`
        });
      }
    });
    return flattened;
  };

  const calculateTotals = () => {
    const totals = {
      totalRequestedQty: 0,
      totalApprovedQty: 0,
      totalReceivedQty: 0
    };

    getFlattenedData().forEach(item => {
      if (item.productDetail) {
        totals.totalRequestedQty += parseFloat(item.productDetail.quantity || 0);
        totals.totalApprovedQty += parseFloat(item.productDetail.approvedQuantity || 0);
        totals.totalReceivedQty += parseFloat(item.productDetail.receivedQuantity || 0);
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
      endDate: ''
    });
    setSearchTerm('');
    fetchData({}, 1);
  };

  const isSearchActive = () => {
    return activeSearch.center || 
           activeSearch.product || 
           activeSearch.startDate || 
           activeSearch.endDate;
  };

  const filteredFlattenedData = getFlattenedData().filter(item => {
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
      
      // Convert dates from DD-MM-YYYY to YYYY-MM-DD for API
      if (activeSearch.startDate && activeSearch.endDate) {
        const convertedStartDate = convertToYYYYMMDD(activeSearch.startDate);
        const convertedEndDate = convertToYYYYMMDD(activeSearch.endDate);
        
        params.append('startDate', convertedStartDate);
        params.append('endDate', convertedEndDate);
      }
      
      // Handle old date format for backward compatibility
      if (activeSearch.date && activeSearch.date.includes(' to ')) {
        const [startDateStr, endDateStr] = activeSearch.date.split(' to ');
        const convertDateFormat = (dateStr) => {
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month}-${day}`;
        };
        
        params.append('startDate', convertDateFormat(startDateStr));
        params.append('endDate', convertDateFormat(endDateStr));
      }
      
      params.append('export', 'true');
      const apiUrl = params.toString() 
        ? `/reports/transfers?${params.toString()}` 
        : '/reports/transfers';
      
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
        'Invoice No.',
        'Date',
        'Center',
        'Parent Center',
        'Product',
        'Quantity',
        'Center Stock',
        'Parent Stock',
        'Product Remark',
        'Approved Quantity',
        'Approved Remark',
        'Received Qty.',
        'Received Remark'
      ];
  
      const csvData = exportData.flatMap(transfer => {
        if (transfer.products && transfer.products.length > 0) {
          return transfer.products.map(product => [
            transfer.transferNumber || 'N/A',
            formatDate(transfer.date),
            transfer.fromCenter?.centerName || 'N/A',
            transfer.toCenter?.centerName || 'N/A',
            product.product?.productTitle || 'N/A',
            product.quantity || 0,
            product.fromCenterStock?.availableQuantity || 0,
            product.toCenterStock?.availableQuantity || 0,
            product.productRemark || '',
            product.approvedQuantity || 0,
            product.approvedRemark || '',
            product.receivedQuantity || 0,
            product.receivedRemark || '',
          ]);
        } else {
          return [[
            transfer.transferNumber || 'N/A',
            formatDate(transfer.date),
            transfer.fromCenter?.centerName || 'N/A',
            transfer.toCenter?.centerName || 'N/A',
            'No Product',
            0,
            0,
            0,
            '',
            0,
            '',
            0,
            '',
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
      const downloadUrl = URL.createObjectURL(blob);
      
      link.setAttribute('href', downloadUrl);
      link.setAttribute('download', `transfer_detail_report_${new Date().toISOString().split('T')[0]}.csv`);
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
      <div className='title'>Transfer Detail Report</div>
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
                  <CTableHeaderCell scope="col" onClick={() => handleSort('transferNumber')} className="sortable-header">
                  Indent No {getSortIcon('transferNumber')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                    Date {getSortIcon('date')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('fromCenter.centerName')} className="sortable-header">
                   Branch {getSortIcon('fromCenter.centerName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('toCenter.centerName')} className="sortable-header">
                    Parent Branch {getSortIcon('toCenter.centerName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.product.productTitle')} className="sortable-header">
                    Product {getSortIcon('productDetail.product.productTitle')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.quantity')} className="sortable-header">
                    Requested Qty {getSortIcon('productDetail.quantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.toCenterStock.availableQuantity')} className="sortable-header">
                   Center Stock {getSortIcon('productDetail.toCenterStock.availableQuantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.fromCenterStock.availableQuantity')} className="sortable-header">
                    Parent Stock {getSortIcon('productDetail.fromCenterStock.availableQuantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.approvedQuantity')} className="sortable-header">
                    Approved Qty {getSortIcon('productDetail.approvedQuantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('productDetail.receivedQuantity')} className="sortable-header">
                    Received Qty {getSortIcon('productDetail.receivedQuantity')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredFlattenedData.length > 0 ? (
                  <>
                    {filteredFlattenedData.map((item) => (
                      <CTableRow key={item.uniqueKey}>
                        <CTableDataCell>{item.transferNumber || ''}</CTableDataCell>
                        <CTableDataCell>{formatDate(item.date || '')}</CTableDataCell>
                        <CTableDataCell>{item.toCenter?.centerName || ''}</CTableDataCell>
                        <CTableDataCell>{item.fromCenter?.centerName || ''}</CTableDataCell>
                        <CTableDataCell>
                          {item.productDetail?.product?.productTitle || 'No Product'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.productDetail?.quantity || 0}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.productDetail?.toCenterStock?.availableQuantity || 0}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.productDetail?.fromCenterStock?.availableQuantity || 0}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.productDetail?.approvedQuantity || 0}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.productDetail?.receivedQuantity || 0}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                    <CTableRow className='total-row'>
                      <CTableDataCell colSpan="5">Total</CTableDataCell>
                      <CTableDataCell>{totals.totalRequestedQty}</CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell>{totals.totalApprovedQty}</CTableDataCell>
                      <CTableDataCell>{totals.totalReceivedQty}</CTableDataCell>
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

export default TransferDetail;