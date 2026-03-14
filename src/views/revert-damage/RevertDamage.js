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
//   CSpinner,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CAlert,
//   CBadge,
//   CTooltip
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut, cilReload, cilWarning, cilCheck } from '@coreui/icons';
// import { CFormLabel } from '@coreui/react-pro';
// import axiosInstance from 'src/axiosInstance';
// import Pagination from 'src/utils/Pagination';
// import { useLocation } from 'react-router-dom';
// import SearchCenterStock from '../Report/SearchCenterStock';

// const RevertDamage = () => {
//   const [data, setData] = useState([]);
//   const [flattenedData, setFlattenedData] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [activeSearch, setActiveSearch] = useState({ 
//     product: '', 
//     center: '', 
//     usageType: 'Damage', 
//     status: 'completed', 
//     createdBy: '', 
//     startDate: '', 
//     endDate: '' 
//   });
  
//   const [serialModalVisible, setSerialModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [selectedSerials, setSelectedSerials] = useState([]);

//   const [revertModalVisible, setRevertModalVisible] = useState(false);
//   const [itemToRevert, setItemToRevert] = useState(null);
//   const [revertLoading, setRevertLoading] = useState(false);
//   const [revertSuccess, setRevertSuccess] = useState(null);
//   const [revertError, setRevertError] = useState(null);
//   const [revertRemark, setRevertRemark] = useState('');
  
//   const [eligibilityCheck, setEligibilityCheck] = useState(null);
//   const [checkingEligibility, setCheckingEligibility] = useState(false);
  
//   const location = useLocation();

//   const getUrlParams = () => {
//     const searchParams = new URLSearchParams(location.search);
//     return {
//       product: searchParams.get('product'),
//       center: searchParams.get('center'),
//       usageType: searchParams.get('usageType'),
//       productName: searchParams.get('productName'),
//       centerName: searchParams.get('centerName'),
//       month: searchParams.get('month')
//     };
//   };

//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         setLoading(true);
//         const urlParams = getUrlParams();
        
//         console.log('Revert Damage URL Parameters:', urlParams);

//         await Promise.all([fetchCenters(), fetchProducts()]);
        
//         let searchParams = {
//           usageType: 'Damage',
//           status: 'completed'
//         };

//         if (urlParams.product || urlParams.center || urlParams.usageType) {
//           searchParams = {
//             ...searchParams,
//             product: urlParams.product || '',
//             center: urlParams.center || '',
//             usageType: urlParams.usageType || 'Damage',
//             status: 'completed',
//             startDate: '',
//             endDate: '',
//             createdBy: ''
//           };
          
//           console.log('Using filtered search from URL:', searchParams);
//           setActiveSearch(searchParams);

//           if (urlParams.productName && urlParams.centerName && urlParams.usageType) {
//             document.title = `Revert Damage - ${decodeURIComponent(urlParams.productName)} at ${decodeURIComponent(urlParams.centerName)}`;
//           }
//         } else {
//           console.log('No URL parameters, fetching all completed damage data');
//           searchParams = { usageType: 'Damage', status: 'completed' };
//           setActiveSearch(searchParams);
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

//   useEffect(() => {
//     if (data && data.length > 0) {
//       const flattened = [];
//       data.forEach(transaction => {
//         if (transaction.items && transaction.items.length > 0) {
//           transaction.items.forEach(item => {
//             flattened.push({
//               _id: `${transaction._id}_${item._id}`,
//               transactionId: transaction._id,
//               itemId: item._id,
//               date: transaction.date,
//               usageType: transaction.usageType,
//               center: transaction.center?.centerName || '',
//               centerId: transaction.center?._id || '',
//               toCenter: transaction.toCenter?.centerName || '',
//               product: item.product?.productTitle || '',
//               productId: item.product?.productId || '',
//               productCode: item.product?.productCode || '',
//               qty: item.quantity || 0,
//               trackSerialNumber: item.product?.trackSerialNumber || 'No',
//               serialNumbers: item.serialNumbers || [],
//               serialNumberCount: item.serialNumbers?.length || 0,
//               status: transaction.status,
//               createdBy: transaction.createdBy?.email || '',
//               createdAt: transaction.createdAt,
//               remark: transaction.remark,
//               damageReason: transaction.damageReason,
//               approvedBy: transaction.approvedBy?.name || transaction.approvedBy?.email || '',
//               approvalDate: transaction.approvalDate,
//               canRevert: true // Default to true, will be checked when needed
//             });
//           });
//         }
//       });
//       setFlattenedData(flattened);
//     } else {
//       setFlattenedData([]);
//     }
//   }, [data]);

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const params = new URLSearchParams();
      
//       const urlParams = getUrlParams();
      
//       const productId = urlParams.product || searchParams.product;
//       const centerId = urlParams.center || searchParams.center;
//       const usageType = urlParams.usageType || searchParams.usageType || 'Damage';
      
//       if (productId) {
//         params.append('product', productId);
//       }
//       if (centerId) {
//         params.append('center', centerId);
//       }
//       if (usageType) {
//         params.append('usageType', usageType);
//       }

//       params.append('status', 'completed');
      
//       if (searchParams.createdBy) {
//         params.append('createdBy', searchParams.createdBy);
//       }
//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate);
//       }
//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate);
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
      
//       let url = '/stockusage?usageType=Damage&status=completed';
//       if (params.toString()) {
//         url = `/stockusage?${params.toString()}`;
//       }
      
//       console.log('Fetching Completed Damage Data URL:', url);
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         setData(response.data.data);
//         setCurrentPage(response.data.pagination?.currentPage || 1);
//         setTotalPages(response.data.pagination?.totalPages || 1);
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

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     fetchData(activeSearch, page);
//   };
  
//   const calculateTotals = () => {
//     const totals = {
//       total: 0
//     };

//     filteredData.forEach(item => {
//       totals.total += parseFloat(item.qty || 0);
//     });

//     return totals;
//   };

//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });

//     const sortedData = [...flattenedData].sort((a, b) => {
//       let aValue = a[key];
//       let bValue = b[key];
      
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
//     fetchData({ ...searchData, usageType: 'Damage', status: 'completed' }, 1);
//   };

//   const handleResetSearch = () => {
//     const resetSearch = { 
//       product: '', 
//       center: '', 
//       usageType: 'Damage',
//       status: 'completed'
//     };
//     setActiveSearch(resetSearch);
//     setSearchTerm('');
//     fetchData({ usageType: 'Damage', status: 'completed' }, 1);
//   };

//   const isSearchActive = () => {
//     return Object.values(activeSearch).some(value => value !== '' && value !== 'Damage' && value !== 'completed');
//   };
  
//   const filteredData = flattenedData.filter(item => {
//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       return (
//         (item.date && new Date(item.date).toLocaleDateString().toLowerCase().includes(searchLower)) ||
//         (item.usageType && item.usageType.toLowerCase().includes(searchLower)) ||
//         (item.center && item.center.toLowerCase().includes(searchLower)) ||
//         (item.product && item.product.toLowerCase().includes(searchLower)) ||
//         (item.damageReason && item.damageReason.toLowerCase().includes(searchLower)) ||
//         (item.qty && item.qty.toString().includes(searchLower))
//       );
//     }
//     return true;
//   });

//   const handleShowSerialNumbers = (item) => {
//     if (item.trackSerialNumber === "Yes" && item.serialNumbers && item.serialNumbers.length > 0) {
//       setSelectedItem(item);
//       setSelectedSerials(item.serialNumbers);
//       setSerialModalVisible(true);
//     }
//   };

//   const checkRevertEligibility = async (item) => {
//     try {
//       setCheckingEligibility(true);
//       setEligibilityCheck(null);
      
//       const response = await axiosInstance.get(`/stockusage/${item.transactionId}/check-revert`);
      
//       if (response.data.success) {
//         setEligibilityCheck(response.data);
        
//         // If eligible, show the revert modal
//         if (response.data.eligible) {
//           setItemToRevert(item);
//           setRevertModalVisible(true);
//           setRevertSuccess(null);
//           setRevertError(null);
//           setRevertRemark('');
//         } else {
//           setRevertError(response.data.message || 'This item cannot be reverted');
//           setRevertModalVisible(true);
//         }
//       } else {
//         setRevertError(response.data.message || 'Failed to check eligibility');
//         setRevertModalVisible(true);
//       }
//     } catch (err) {
//       console.error('Error checking eligibility:', err);
//       setRevertError(err.response?.data?.message || err.message || 'Failed to check revert eligibility');
//       setRevertModalVisible(true);
//     } finally {
//       setCheckingEligibility(false);
//     }
//   };

//   const handleRevertClick = (item) => {
//     checkRevertEligibility(item);
//   };

//   const confirmRevert = async () => {
//     if (!itemToRevert) return;
    
//     try {
//       setRevertLoading(true);
//       setRevertError(null);
//       const response = await axiosInstance.put(`/stockusage/${itemToRevert.transactionId}/revert-damage`, {
//         revertRemark: revertRemark || `Reverted by ${JSON.parse(localStorage.getItem('user'))?.name || 'user'}`
//       });
      
//       if (response.data.success) {
//         setRevertSuccess('Item successfully reverted from damage stock');
//         setTimeout(() => {
//           setRevertModalVisible(false);
//           fetchData(activeSearch, currentPage);
//         }, 1500);
//       } else {
//         setRevertError(response.data.message || 'Failed to revert item');
//       }
//     } catch (err) {
//       console.error('Error reverting damage:', err);
//       setRevertError(err.response?.data?.message || err.message || 'An error occurred while reverting');
//     } finally {
//       setRevertLoading(false);
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
//     return (
//       <div className="alert alert-danger" role="alert">
//         {error}
//       </div>
//     );
//   }

//   const totals = calculateTotals();

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   return (
//     <div>
//       <div className='title'>Revert Damage Products</div>
    
//       <SearchCenterStock
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//         products={products}
//         initialUsageType="Damage"
//         showStatusFilter={false}
//       />

//       <CModal 
//         visible={serialModalVisible} 
//         onClose={() => setSerialModalVisible(false)}
//         size="lg"
//       >
//         <CModalHeader>
//           <CModalTitle>
//             Serial Numbers - {selectedItem?.product}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {selectedItem && (
//             <>
//               <CTable bordered striped responsive>
//                 <CTableHead>
//                   <CTableRow>
//                     <CTableHeaderCell width="15%">SR No.</CTableHeaderCell>
//                     <CTableHeaderCell width="85%">Serial Number</CTableHeaderCell>
//                   </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                   {selectedSerials.length > 0 ? (
//                     selectedSerials.map((serial, index) => (
//                       <CTableRow key={index}>
//                         <CTableDataCell>
//                           <strong>{index + 1}</strong>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <div className="p-2 border rounded bg-light">
//                             <strong>{serial}</strong>
//                           </div>
//                         </CTableDataCell>
//                       </CTableRow>
//                     ))
//                   ) : (
//                     <CTableRow>
//                       <CTableDataCell colSpan="2" className="text-center text-muted">
//                         No serial numbers available
//                       </CTableDataCell>
//                     </CTableRow>
//                   )}
//                 </CTableBody>
//               </CTable>
//             </>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setSerialModalVisible(false)}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <CModal 
//         visible={revertModalVisible} 
//         onClose={() => setRevertModalVisible(false)}
//         size="lg"
//       >
//         <CModalHeader>
//           <CModalTitle>
//             {revertSuccess ? 'Revert Successful' : 
//              revertError && !eligibilityCheck?.eligible ? 'Cannot Revert' : 'Confirm Revert'}
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {checkingEligibility ? (
//             <div className="text-center p-4">
//               <CSpinner color="primary" />
//               <p className="mt-3">Checking revert eligibility...</p>
//             </div>
//           ) : revertSuccess ? (
//             <CAlert color="success" className="mb-0">
//               <CIcon icon={cilCheck} className="me-2" />
//               {revertSuccess}
//             </CAlert>
//           ) : (
//             <>
//               {revertError && (
//                 <CAlert color="danger" className="mb-3">
//                   <CIcon icon={cilWarning} className="me-2" />
//                   {revertError}
//                 </CAlert>
//               )}
              
//               {eligibilityCheck && !eligibilityCheck.eligible && eligibilityCheck.details && (
//                 <div className="mb-3">
//                   <h6>Revert Eligibility Details:</h6>
//                   <CTable bordered size="sm">
//                     <CTableHead>
//                       <CTableRow>
//                         <CTableHeaderCell>Product</CTableHeaderCell>
//                         <CTableHeaderCell>Status</CTableHeaderCell>
//                         <CTableHeaderCell>Message</CTableHeaderCell>
//                       </CTableRow>
//                     </CTableHead>
//                     <CTableBody>
//                       {eligibilityCheck.details.items?.map((detail, idx) => (
//                         <CTableRow key={idx}>
//                           <CTableDataCell>{detail.product}</CTableDataCell>
//                           <CTableDataCell>
//                             <CBadge color={detail.status === 'pending_damage' ? 'warning' : 'danger'}>
//                               {detail.status}
//                             </CBadge>
//                           </CTableDataCell>
//                           <CTableDataCell>{detail.message}</CTableDataCell>
//                         </CTableRow>
//                       ))}
//                     </CTableBody>
//                   </CTable>
//                 </div>
//               )}
              
//               {eligibilityCheck?.eligible && itemToRevert && (
//                 <>
//                   <p>Are you sure you want to revert this damage item?</p>
//                   <div className="border p-3 rounded mb-3">
//                     <CTable bordered size="sm">
//                       <CTableBody>
//                         <CTableRow>
//                           <CTableHeaderCell width="30%">Product</CTableHeaderCell>
//                           <CTableDataCell><strong>{itemToRevert.product}</strong></CTableDataCell>
//                         </CTableRow>
//                         <CTableRow>
//                           <CTableHeaderCell>Quantity</CTableHeaderCell>
//                           <CTableDataCell>
//                             <span className="fw-bold">{itemToRevert.qty}</span>
//                             {itemToRevert.trackSerialNumber === "Yes" && itemToRevert.serialNumberCount > 0 && (
//                               <CBadge color="info" className="ms-2">
//                                 {itemToRevert.serialNumberCount} serials
//                               </CBadge>
//                             )}
//                           </CTableDataCell>
//                         </CTableRow>
//                         <CTableRow>
//                           <CTableHeaderCell>Branch</CTableHeaderCell>
//                           <CTableDataCell>{itemToRevert.center}</CTableDataCell>
//                         </CTableRow>
//                         <CTableRow>
//                           <CTableHeaderCell>Date</CTableHeaderCell>
//                           <CTableDataCell>{formatDate(itemToRevert.date)}</CTableDataCell>
//                         </CTableRow>
//                         {itemToRevert.damageReason && (
//                           <CTableRow>
//                             <CTableHeaderCell>Damage Reason</CTableHeaderCell>
//                             <CTableDataCell>{itemToRevert.damageReason}</CTableDataCell>
//                           </CTableRow>
//                         )}
//                       </CTableBody>
//                     </CTable>
//                   </div>
                  
//                   <div className="mb-3">
//                     <CFormLabel htmlFor="revertRemark">Revert Remark (Optional)</CFormLabel>
//                     <CFormInput
//                       id="revertRemark"
//                       type="text"
//                       value={revertRemark}
//                       onChange={(e) => setRevertRemark(e.target.value)}
//                       placeholder="Enter reason for reverting this damage"
//                     />
//                   </div>
                  
//                   <p className="text-warning mt-3">
//                     <CIcon icon={cilWarning} className="me-2" />
//                     <strong>Note:</strong> This will move the item back to available stock and remove it from faulty stock.
//                   </p>
//                 </>
//               )}
//             </>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton 
//             color="secondary" 
//             onClick={() => setRevertModalVisible(false)}
//             disabled={revertLoading || checkingEligibility}
//           >
//             {revertSuccess ? 'Close' : 'Cancel'}
//           </CButton>
//           {!revertSuccess && eligibilityCheck?.eligible && (
//             <CButton 
//               className='reset-button'
//               onClick={confirmRevert}
//               disabled={revertLoading || checkingEligibility}
//             >
//               {revertLoading ? <CSpinner size="sm" /> : 'Confirm Revert'}
//             </CButton>
//           )}
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
//                 <CIcon icon={cilZoomOut} className='icon' />
//                 Reset Search
//               </CButton>
//             )}
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
//             <div className="text-muted">
//               Showing {filteredData.length} items
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
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('center')} className="sortable-header">
//                     Branch {getSortIcon('center')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('product')} className="sortable-header">
//                     Product {getSortIcon('product')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('damageReason')} className="sortable-header">
//                     Damage Reason {getSortIcon('damageReason')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('qty')} className="sortable-header">
//                     Qty {getSortIcon('qty')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col">
//                     Action
//                   </CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredData.length > 0 ? (
//                   <>
//                     {filteredData.map((item) => (
//                       <CTableRow key={item._id}>
//                         <CTableDataCell>{formatDate(item.date)}</CTableDataCell>
//                         <CTableDataCell>{item.center}</CTableDataCell>
//                         <CTableDataCell>
//                           {item.product}
//                         </CTableDataCell>
//                         <CTableDataCell>{item.damageReason || 'N/A'}</CTableDataCell>
//                         <CTableDataCell>
//                           <div className="d-flex align-items-center justify-content-between">
//                             <span className="fw-bold">{item.qty}</span>
//                             {item.trackSerialNumber === "Yes" && item.serialNumberCount > 0 && (
//                               <CTooltip content={`Click to view ${item.serialNumberCount} serial number(s)`}>
//                                 <span
//                                   onClick={() => handleShowSerialNumbers(item)}
//                                   style={{
//                                     fontSize: '18px',
//                                     cursor: 'pointer',
//                                     color: '#337ab7',
//                                     marginLeft: '8px'
//                                   }}
//                                 >
//                                   ☰
//                                 </span>
//                               </CTooltip>
//                             )}
//                           </div>
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           <CButton
//                             size="sm"
//                             className="action-btn"
//                             onClick={() => handleRevertClick(item)}
//                             disabled={revertLoading}
//                           >
//                             <CIcon icon={cilReload} className='icon' /> Revert
//                           </CButton>
//                         </CTableDataCell>
//                       </CTableRow>
//                     ))}
//                     <CTableRow className='total-row'>
//                       <CTableDataCell colSpan="4" className="text-end fw-bold">
//                         Total Quantity:
//                       </CTableDataCell>
//                       <CTableDataCell colSpan="3">
//                         <div className="d-flex align-items-center">
//                           <span className="fw-bold">{totals.total.toFixed(2)}</span>
//                         </div>
//                       </CTableDataCell>
//                     </CTableRow>
//                   </>
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan="7" className="text-center">
//                       No completed damage records found
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

// export default RevertDamage;





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
  CAlert,
  CBadge,
  CTooltip
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut, cilReload, cilWarning, cilCheck, cilBan } from '@coreui/icons';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { useLocation } from 'react-router-dom';
import SearchCenterStock from '../Report/SearchCenterStock';

const RevertDamage = () => {
  const [data, setData] = useState([]);
  const [flattenedData, setFlattenedData] = useState([]);
  const [centers, setCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeSearch, setActiveSearch] = useState({ 
    product: '', 
    center: '', 
    usageType: 'Damage', 
    status: 'completed', 
    createdBy: '', 
    startDate: '', 
    endDate: '' 
  });
  
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSerials, setSelectedSerials] = useState([]);

  const [revertModalVisible, setRevertModalVisible] = useState(false);
  const [itemToRevert, setItemToRevert] = useState(null);
  const [revertLoading, setRevertLoading] = useState(false);
  const [revertSuccess, setRevertSuccess] = useState(null);
  const [revertError, setRevertError] = useState(null);
  const [revertRemark, setRevertRemark] = useState('');
  
  const [eligibilityCheck, setEligibilityCheck] = useState(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  
  // New state to store eligibility status for each item
  const [itemEligibility, setItemEligibility] = useState({});
  const [checkingEligibilityFor, setCheckingEligibilityFor] = useState(null);
  
  const location = useLocation();

  const getUrlParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      product: searchParams.get('product'),
      center: searchParams.get('center'),
      usageType: searchParams.get('usageType'),
      productName: searchParams.get('productName'),
      centerName: searchParams.get('centerName'),
      month: searchParams.get('month')
    };
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const urlParams = getUrlParams();
        
        console.log('Revert Damage URL Parameters:', urlParams);

        await Promise.all([fetchCenters(), fetchProducts()]);
        
        let searchParams = {
          usageType: 'Damage',
          status: 'completed'
        };

        if (urlParams.product || urlParams.center || urlParams.usageType) {
          searchParams = {
            ...searchParams,
            product: urlParams.product || '',
            center: urlParams.center || '',
            usageType: urlParams.usageType || 'Damage',
            status: 'completed',
            startDate: '',
            endDate: '',
            createdBy: ''
          };
          
          console.log('Using filtered search from URL:', searchParams);
          setActiveSearch(searchParams);

          if (urlParams.productName && urlParams.centerName && urlParams.usageType) {
            document.title = `Revert Damage - ${decodeURIComponent(urlParams.productName)} at ${decodeURIComponent(urlParams.centerName)}`;
          }
        } else {
          console.log('No URL parameters, fetching all completed damage data');
          searchParams = { usageType: 'Damage', status: 'completed' };
          setActiveSearch(searchParams);
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

  useEffect(() => {
    if (data && data.length > 0) {
      const flattened = [];
      data.forEach(transaction => {
        if (transaction.items && transaction.items.length > 0) {
          transaction.items.forEach(item => {
            flattened.push({
              _id: `${transaction._id}_${item._id}`,
              transactionId: transaction._id,
              itemId: item._id,
              date: transaction.date,
              usageType: transaction.usageType,
              center: transaction.center?.centerName || '',
              centerId: transaction.center?._id || '',
              toCenter: transaction.toCenter?.centerName || '',
              product: item.product?.productTitle || '',
              productId: item.product?.productId || '',
              productCode: item.product?.productCode || '',
              qty: item.quantity || 0,
              trackSerialNumber: item.product?.trackSerialNumber || 'No',
              serialNumbers: item.serialNumbers || [],
              serialNumberCount: item.serialNumbers?.length || 0,
              status: transaction.status,
              createdBy: transaction.createdBy?.email || '',
              createdAt: transaction.createdAt,
              remark: transaction.remark,
              damageReason: transaction.damageReason,
              approvedBy: transaction.approvedBy?.name || transaction.approvedBy?.email || '',
              approvalDate: transaction.approvalDate,
              canRevert: true // Default to true, will be updated by eligibility checks
            });
          });
        }
      });
      setFlattenedData(flattened);
      
      // After flattening data, check eligibility for each item
      checkAllItemsEligibility(flattened);
    } else {
      setFlattenedData([]);
    }
  }, [data]);

  // Function to check eligibility for all items
  const checkAllItemsEligibility = async (items) => {
    const eligibilityMap = {};
    
    // Process in batches to avoid too many concurrent requests
    const batchSize = 5;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await Promise.all(batch.map(async (item) => {
        try {
          const response = await axiosInstance.get(`/stockusage/${item.transactionId}/check-revert`);
          if (response.data.success) {
            eligibilityMap[item._id] = {
              eligible: response.data.eligible,
              allItemsPendingDamage: response.data.allItemsPendingDamage,
              details: response.data.details
            };
          }
        } catch (err) {
          console.error(`Error checking eligibility for item ${item._id}:`, err);
          eligibilityMap[item._id] = {
            eligible: false,
            error: true
          };
        }
      }));
    }
    
    setItemEligibility(eligibilityMap);
  };

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      
      const urlParams = getUrlParams();
      
      const productId = urlParams.product || searchParams.product;
      const centerId = urlParams.center || searchParams.center;
      const usageType = urlParams.usageType || searchParams.usageType || 'Damage';
      
      if (productId) {
        params.append('product', productId);
      }
      if (centerId) {
        params.append('center', centerId);
      }
      if (usageType) {
        params.append('usageType', usageType);
      }

      params.append('status', 'completed');
      
      if (searchParams.createdBy) {
        params.append('createdBy', searchParams.createdBy);
      }
      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate);
      }
      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate);
      }
      
      if (urlParams.month) {
        const [year, month] = urlParams.month.split('-');
        const monthStart = `${year}-${month.padStart(2, '0')}-01`;
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
        const monthEnd = `${year}-${month.padStart(2, '0')}-${lastDay}`;
        
        params.append('startDate', monthStart);
        params.append('endDate', monthEnd);
      }
      
      params.append('page', page);
      
      let url = '/stockusage?usageType=Damage&status=completed';
      if (params.toString()) {
        url = `/stockusage?${params.toString()}`;
      }
      
      console.log('Fetching Completed Damage Data URL:', url);
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setData(response.data.data);
        setCurrentPage(response.data.pagination?.currentPage || 1);
        setTotalPages(response.data.pagination?.totalPages || 1);
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

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, page);
  };
  
  const calculateTotals = () => {
    const totals = {
      total: 0
    };

    filteredData.forEach(item => {
      totals.total += parseFloat(item.qty || 0);
    });

    return totals;
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedData = [...flattenedData].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];
      
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
    fetchData({ ...searchData, usageType: 'Damage', status: 'completed' }, 1);
  };

  const handleResetSearch = () => {
    const resetSearch = { 
      product: '', 
      center: '', 
      usageType: 'Damage',
      status: 'completed'
    };
    setActiveSearch(resetSearch);
    setSearchTerm('');
    fetchData({ usageType: 'Damage', status: 'completed' }, 1);
  };

  const isSearchActive = () => {
    return Object.values(activeSearch).some(value => value !== '' && value !== 'Damage' && value !== 'completed');
  };
  
  const filteredData = flattenedData.filter(item => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (item.date && new Date(item.date).toLocaleDateString().toLowerCase().includes(searchLower)) ||
        (item.usageType && item.usageType.toLowerCase().includes(searchLower)) ||
        (item.center && item.center.toLowerCase().includes(searchLower)) ||
        (item.product && item.product.toLowerCase().includes(searchLower)) ||
        (item.damageReason && item.damageReason.toLowerCase().includes(searchLower)) ||
        (item.qty && item.qty.toString().includes(searchLower))
      );
    }
    return true;
  });

  const handleShowSerialNumbers = (item) => {
    if (item.trackSerialNumber === "Yes" && item.serialNumbers && item.serialNumbers.length > 0) {
      setSelectedItem(item);
      setSelectedSerials(item.serialNumbers);
      setSerialModalVisible(true);
    }
  };

  const checkRevertEligibility = async (item) => {
    try {
      setCheckingEligibility(true);
      setCheckingEligibilityFor(item._id);
      setEligibilityCheck(null);
      
      const response = await axiosInstance.get(`/stockusage/${item.transactionId}/check-revert`);
      
      if (response.data.success) {
        setEligibilityCheck(response.data);
        
        // Update item eligibility map
        setItemEligibility(prev => ({
          ...prev,
          [item._id]: {
            eligible: response.data.eligible,
            allItemsPendingDamage: response.data.allItemsPendingDamage,
            details: response.data.details
          }
        }));
        
        // If eligible, show the revert modal
        if (response.data.eligible) {
          setItemToRevert(item);
          setRevertModalVisible(true);
          setRevertSuccess(null);
          setRevertError(null);
          setRevertRemark('');
        } else {
          setRevertError(response.data.message || 'This item cannot be reverted');
          setRevertModalVisible(true);
        }
      } else {
        setRevertError(response.data.message || 'Failed to check eligibility');
        setRevertModalVisible(true);
      }
    } catch (err) {
      console.error('Error checking eligibility:', err);
      setRevertError(err.response?.data?.message || err.message || 'Failed to check revert eligibility');
      setRevertModalVisible(true);
    } finally {
      setCheckingEligibility(false);
      setCheckingEligibilityFor(null);
    }
  };

  const handleRevertClick = (item) => {
    checkRevertEligibility(item);
  };

  const confirmRevert = async () => {
    if (!itemToRevert) return;
    
    try {
      setRevertLoading(true);
      setRevertError(null);
      const response = await axiosInstance.put(`/stockusage/${itemToRevert.transactionId}/revert-damage`, {
        revertRemark: revertRemark || `Reverted by ${JSON.parse(localStorage.getItem('user'))?.name || 'user'}`
      });
      
      if (response.data.success) {
        setRevertSuccess('Item successfully reverted from damage stock');
        
        // Update eligibility for this item after successful revert
        setItemEligibility(prev => ({
          ...prev,
          [itemToRevert._id]: {
            eligible: false,
            reverted: true
          }
        }));
        
        setTimeout(() => {
          setRevertModalVisible(false);
          fetchData(activeSearch, currentPage);
        }, 1500);
      } else {
        setRevertError(response.data.message || 'Failed to revert item');
      }
    } catch (err) {
      console.error('Error reverting damage:', err);
      setRevertError(err.response?.data?.message || err.message || 'An error occurred while reverting');
    } finally {
      setRevertLoading(false);
    }
  };

  // Helper function to check if item can be reverted
  const canItemBeReverted = (item) => {
    const eligibility = itemEligibility[item._id];
    return eligibility?.eligible === true;
  };

  // Helper function to get revert button tooltip message
  const getRevertButtonTooltip = (item) => {
    const eligibility = itemEligibility[item._id];
    if (!eligibility) return 'Checking eligibility...';
    if (eligibility.eligible) return 'Click to revert this item';
    if (eligibility.error) return 'Error checking eligibility';
    return 'This item cannot be reverted (already processed)';
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

  const totals = calculateTotals();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div>
      <div className='title'>Revert Damage Products</div>
    
      <SearchCenterStock
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        centers={centers}
        products={products}
        initialUsageType="Damage"
        showStatusFilter={false}
      />

      <CModal 
        visible={serialModalVisible} 
        onClose={() => setSerialModalVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            Serial Numbers - {selectedItem?.product}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedItem && (
            <>
              <CTable bordered striped responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell width="15%">SR No.</CTableHeaderCell>
                    <CTableHeaderCell width="85%">Serial Number</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {selectedSerials.length > 0 ? (
                    selectedSerials.map((serial, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>
                          <strong>{index + 1}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="p-2 border rounded bg-light">
                            <strong>{serial}</strong>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="2" className="text-center text-muted">
                        No serial numbers available
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setSerialModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal 
        visible={revertModalVisible} 
        onClose={() => setRevertModalVisible(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>
            {revertSuccess ? 'Revert Successful' : 
             revertError && !eligibilityCheck?.eligible ? 'Cannot Revert' : 'Confirm Revert'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {checkingEligibility ? (
            <div className="text-center p-4">
              <CSpinner color="primary" />
              <p className="mt-3">Checking revert eligibility...</p>
            </div>
          ) : revertSuccess ? (
            <CAlert color="success" className="mb-0">
              <CIcon icon={cilCheck} className="me-2" />
              {revertSuccess}
            </CAlert>
          ) : (
            <>
              {revertError && (
                <CAlert color="danger" className="mb-3">
                  <CIcon icon={cilWarning} className="me-2" />
                  {revertError}
                </CAlert>
              )}
              
              {eligibilityCheck && !eligibilityCheck.eligible && eligibilityCheck.details && (
                <div className="mb-3">
                  <h6>Revert Eligibility Details:</h6>
                  <CTable bordered size="sm">
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Product</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Message</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {eligibilityCheck.details.items?.map((detail, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{detail.product}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={detail.status === 'pending_damage' ? 'warning' : 'danger'}>
                              {detail.status}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>{detail.message}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              )}
              
              {eligibilityCheck?.eligible && itemToRevert && (
                <>
                  <p>Are you sure you want to revert this damage item?</p>
                  <div className="border p-3 rounded mb-3">
                    <CTable bordered size="sm">
                      <CTableBody>
                        <CTableRow>
                          <CTableHeaderCell width="30%">Product</CTableHeaderCell>
                          <CTableDataCell><strong>{itemToRevert.product}</strong></CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell>Quantity</CTableHeaderCell>
                          <CTableDataCell>
                            <span className="fw-bold">{itemToRevert.qty}</span>
                            {itemToRevert.trackSerialNumber === "Yes" && itemToRevert.serialNumberCount > 0 && (
                              <CBadge color="info" className="ms-2">
                                {itemToRevert.serialNumberCount} serials
                              </CBadge>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell>Branch</CTableHeaderCell>
                          <CTableDataCell>{itemToRevert.center}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableHeaderCell>Date</CTableHeaderCell>
                          <CTableDataCell>{formatDate(itemToRevert.date)}</CTableDataCell>
                        </CTableRow>
                        {itemToRevert.damageReason && (
                          <CTableRow>
                            <CTableHeaderCell>Damage Reason</CTableHeaderCell>
                            <CTableDataCell>{itemToRevert.damageReason}</CTableDataCell>
                          </CTableRow>
                        )}
                      </CTableBody>
                    </CTable>
                  </div>
                  
                  <div className="mb-3">
                    <CFormLabel htmlFor="revertRemark">Revert Remark (Optional)</CFormLabel>
                    <CFormInput
                      id="revertRemark"
                      type="text"
                      value={revertRemark}
                      onChange={(e) => setRevertRemark(e.target.value)}
                      placeholder="Enter reason for reverting this damage"
                    />
                  </div>
                  
                  <p className="text-warning mt-3">
                    <CIcon icon={cilWarning} className="me-2" />
                    <strong>Note:</strong> This will move the item back to available stock and remove it from faulty stock.
                  </p>
                </>
              )}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setRevertModalVisible(false)}
            disabled={revertLoading || checkingEligibility}
          >
            {revertSuccess ? 'Close' : 'Cancel'}
          </CButton>
          {!revertSuccess && eligibilityCheck?.eligible && (
            <CButton 
              className='reset-button'
              onClick={confirmRevert}
              disabled={revertLoading || checkingEligibility}
            >
              {revertLoading ? <CSpinner size="sm" /> : 'Confirm Revert'}
            </CButton>
          )}
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
                <CIcon icon={cilZoomOut} className='icon' />
                Reset Search
              </CButton>
            )}
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
            <div className="text-muted">
              Showing {filteredData.length} items
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
                  <CTableHeaderCell scope="col" onClick={() => handleSort('center')} className="sortable-header">
                    Branch {getSortIcon('center')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('product')} className="sortable-header">
                    Product {getSortIcon('product')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('damageReason')} className="sortable-header">
                    Damage Reason {getSortIcon('damageReason')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('qty')} className="sortable-header">
                    Qty {getSortIcon('qty')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    Status
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredData.length > 0 ? (
                  <>
                    {filteredData.map((item) => {
                      const eligibility = itemEligibility[item._id];
                      const isEligible = eligibility?.eligible === true;
                      const isChecking = checkingEligibilityFor === item._id;
                      
                      return (
                        <CTableRow key={item._id}>
                          <CTableDataCell>{formatDate(item.date)}</CTableDataCell>
                          <CTableDataCell>{item.center}</CTableDataCell>
                          <CTableDataCell>
                            {item.product}
                          </CTableDataCell>
                          <CTableDataCell>{item.damageReason || 'N/A'}</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="fw-bold">{item.qty}</span>
                              {item.trackSerialNumber === "Yes" && item.serialNumberCount > 0 && (
                                <CTooltip content={`Click to view ${item.serialNumberCount} serial number(s)`}>
                                  <span
                                    onClick={() => handleShowSerialNumbers(item)}
                                    style={{
                                      fontSize: '18px',
                                      cursor: 'pointer',
                                      color: '#337ab7',
                                      marginLeft: '8px'
                                    }}
                                  >
                                    ☰
                                  </span>
                                </CTooltip>
                              )}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            {isChecking ? (
                              <CSpinner size="sm" color="info" />
                            ) : eligibility ? (
                              <CBadge color={isEligible ? 'success' : 'secondary'}>
                                {isEligible ? 'Pending' : 'Processed'}
                              </CBadge>
                            ) : (
                              <CBadge color="light">Checking...</CBadge>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CTooltip content={getRevertButtonTooltip(item)}>
                              <div>
                                <CButton
                                  size="sm"
                                  className={isEligible ? 'action-btn' : 'btn btn-secondary'}
                                  onClick={() => handleRevertClick(item)}
                                  disabled={!isEligible || revertLoading || isChecking}
                                >
                                  {isChecking ? (
                                    <CSpinner size="sm" />
                                  ) : (
                                    <>
                                      <CIcon icon={isEligible ? cilReload : cilBan} className='icon' /> 
                                      {isEligible ? 'Revert' : 'Cannot Revert'}
                                    </>
                                  )}
                                </CButton>
                              </div>
                            </CTooltip>
                          </CTableDataCell>
                        </CTableRow>
                      );
                    })}
                    <CTableRow className='total-row'>
                      <CTableDataCell colSpan="5" className="text-end fw-bold">
                        Total Quantity:
                      </CTableDataCell>
                      <CTableDataCell colSpan="2">
                        <div className="d-flex align-items-center">
                          <span className="fw-bold">{totals.total.toFixed(2)}</span>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
                      No completed damage records found
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

export default RevertDamage;