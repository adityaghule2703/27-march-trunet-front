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
// import CommonSearch from './CommonSearch';

// const StolenReport = () => {
//   const [data, setData] = useState([]);
//   const [centers, setCenters] = useState([]);
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
//     keyword: '', 
//     outlet: '' 
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [products, setProducts] = useState([]);

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
  
//       if (searchParams.date && searchParams.date.includes(' to ')) {
//         const [startDateStr, endDateStr] = searchParams.date.split(' to ');
//         const convertDateFormat = (dateStr) => {
//           const [day, month, year] = dateStr.split('-');
//           return `${year}-${month}-${day}`;
//         };
        
//         params.append('startDate', convertDateFormat(startDateStr));
//         params.append('endDate', convertDateFormat(endDateStr));
//       }
//       if (searchParams.keyword) {
//         params.append('search', searchParams.keyword);
//       }
//       if (searchParams.outlet) {
//         params.append('outlet', searchParams.outlet);
//       }
      
//       params.append('page', page);
//       const url = params.toString() ? `/reports/stolenstock?${params.toString()}` : '/reports/stolenstock';
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
//     data.forEach(report => {
//       if (report.items && report.items.length > 0) {
//         report.items.forEach(item => {
//           flattened.push({
//             ...report,
//             itemDetail: item,
//             uniqueKey: `${report._id}_${item._id}`,
//           });
//         });
//       } else {
//         flattened.push({
//           ...report,
//           itemDetail: null,
//           uniqueKey: `${report._id}_no_item`,
//         });
//       }
//     });
//     return flattened;
//   };

//   const calculateTotals = () => {
//     let totalQty = 0;
//     getFlattenedData().forEach(row => {
//       totalQty += parseFloat(row.itemDetail?.quantity || 0);
//     });
//     return { totalQty };
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
//       endDate: '',
//       keyword: '', 
//       outlet: '' 
//     });
//     setSearchTerm('');
//     fetchData({}, 1);
//   };

//   const isSearchActive = () => {
//     return activeSearch.center || 
//            activeSearch.product || 
//            activeSearch.startDate || 
//            activeSearch.endDate ||
//            activeSearch.keyword || 
//            activeSearch.outlet;
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

//   const fetchAllDataForExport = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();

//       if (activeSearch.center) {
//         params.append('center', activeSearch.center);
//       }
      
//       if (activeSearch.product) {
//         params.append('product', activeSearch.product);
//       }
//       if (activeSearch.startDate && activeSearch.endDate) {
//         const convertDateFormat = (dateStr) => {
//           const [day, month, year] = dateStr.split('-');
//           return `${year}-${month}-${day}`;
//         };
        
//         params.append('startDate', convertDateFormat(activeSearch.startDate));
//         params.append('endDate', convertDateFormat(activeSearch.endDate));
//       }
//       const url = `/reports/stolenstock?${params.toString()}`;
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         return response.data.data;
//       } else {
//         throw new Error('API returned unsuccessful response');
//       }
//     } catch (err) {
//       console.error('Error fetching data for export:', err);
//       showError('Error fetching data for export');
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const generateDetailExport = async () => {
//     try {
//       setLoading(true);
//       const allData = await fetchAllDataForExport();
      
//       if (!allData || allData.length === 0) {
//         showError('No data available for export');
//         return;
//       }
  
//       const headers = [
//         'Date',
//         'Type',
//         'Center',
//         'Product',
//         'Quantity',
//         'Remark',
//       ];
      
//       const csvData = allData.flatMap(request => {
//         if (request.items && request.items.length > 0) {
//           return request.items.map(item => [
//             formatDate(request.date),
//             request.usageType || 'N/A',
//             request.center?.centerName || 'N/A',
//             item.product?.productTitle || 'N/A',
//             item.quantity || 0,
//             request.remark || ''
//           ]);
//         } else {
//           return [[
//             formatDate(request.date),
//             request.usageType || 'N/A',
//             request.center?.centerName || 'N/A',
//             'No Product',
//             0,
//             request.remark || ''
//           ]];
//         }
//       });
      
//       const csvContent = [
//         headers.join(','),
//         ...csvData.map(row =>
//           row
//             .map(field => {
//               const stringField = String(field || '');
//               return `"${stringField.replace(/"/g, '""')}"`;
//             })
//             .join(',')
//         )
//       ].join('\n');
      
//       const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
  
//       link.setAttribute('href', url);
//       link.setAttribute('download', `stolen_report_${new Date().toISOString().split('T')[0]}.csv`);
//       link.style.visibility = 'hidden';
  
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error generating export:', error);
//       showError('Error generating export file');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <div>
//       <div className='title'>Stolen Report</div>
       
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
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
//                     Date {getSortIcon('date')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('usageType')} className="sortable-header">
//                     Type {getSortIcon('usageType')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
//                     Branch {getSortIcon('center.centerName')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('itemDetail.product.productTitle')} className="sortable-header">
//                     Product {getSortIcon('itemDetail.product.productTitle')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('itemDetail.quantity')} className="sortable-header">
//                    Qty {getSortIcon('itemDetail.quantity')}
//                   </CTableHeaderCell>
            
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
//                     Remark {getSortIcon('remark')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('createdAt')} className="sortable-header">
//                     Created At {getSortIcon('createdAt')}
//                   </CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredFlattenedData.length > 0 ? (
//                   <>
//                     {filteredFlattenedData.map((item) => (
//                       <CTableRow key={item.uniqueKey}>
//                         <CTableDataCell>{formatDate(item.date)}</CTableDataCell>
//                         <CTableDataCell>{item.usageType}</CTableDataCell>
//                         <CTableDataCell>{item.center?.centerName}</CTableDataCell>
//                         <CTableDataCell>{item.itemDetail?.product?.productTitle || 'No Product'}</CTableDataCell>
//                         <CTableDataCell>{item.itemDetail?.quantity || 0}</CTableDataCell>
//                         <CTableDataCell>{item.remark || ''}</CTableDataCell>
//                         <CTableDataCell>{formatDateTime(item.createdAt)}</CTableDataCell>
//                       </CTableRow>
//                     ))}
//                     <CTableRow className='total-row'>
//                       <CTableDataCell colSpan="4">Total Count</CTableDataCell>
//                       <CTableDataCell>{totals.totalQty}</CTableDataCell>
//                       <CTableDataCell colSpan="4"></CTableDataCell>
//                     </CTableRow>
//                   </>
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan="9" className="text-center">
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

// export default StolenReport;





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
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
import CommonSearch from './CommonSearch';

const StolenReport = () => {
  const [data, setData] = useState([]);
  const [centers, setCenters] = useState([]);
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
    keyword: '', 
    outlet: '' 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);

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
      // Validate that day, month, year are numbers
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    return dateStr;
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
      
      // Handle dates - convert from DD-MM-YYYY to YYYY-MM-DD for API
      if (searchParams.startDate && searchParams.endDate) {
        const convertedStartDate = convertToYYYYMMDD(searchParams.startDate);
        const convertedEndDate = convertToYYYYMMDD(searchParams.endDate);
        
        params.append('startDate', convertedStartDate);
        params.append('endDate', convertedEndDate);
        
        console.log('Original dates (from search):', searchParams.startDate, searchParams.endDate);
        console.log('Converted dates (for API):', convertedStartDate, convertedEndDate);
      }
      
      if (searchParams.keyword) {
        params.append('search', searchParams.keyword);
      }
      if (searchParams.outlet) {
        params.append('outlet', searchParams.outlet);
      }
      
      params.append('page', page);
      const url = params.toString() ? `/reports/stolenstock?${params.toString()}` : '/reports/stolenstock';
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
    data.forEach(report => {
      if (report.items && report.items.length > 0) {
        report.items.forEach(item => {
          flattened.push({
            ...report,
            itemDetail: item,
            uniqueKey: `${report._id}_${item._id}`,
          });
        });
      } else {
        flattened.push({
          ...report,
          itemDetail: null,
          uniqueKey: `${report._id}_no_item`,
        });
      }
    });
    return flattened;
  };

  const calculateTotals = () => {
    let totalQty = 0;
    getFlattenedData().forEach(row => {
      totalQty += parseFloat(row.itemDetail?.quantity || 0);
    });
    return { totalQty };
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
    console.log('Search data received from modal:', searchData);
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
      keyword: '', 
      outlet: '' 
    });
    setSearchTerm('');
    fetchData({}, 1);
  };

  const isSearchActive = () => {
    return activeSearch.center || 
           activeSearch.product || 
           activeSearch.startDate || 
           activeSearch.endDate ||
           activeSearch.keyword || 
           activeSearch.outlet;
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

  const fetchAllDataForExport = async () => {
    try {
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
      
      const url = `/reports/stolenstock?${params.toString()}`;
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
        'Quantity',
        'Remark',
        'Created At'
      ];
      
      const csvData = allData.flatMap(request => {
        if (request.items && request.items.length > 0) {
          return request.items.map(item => [
            formatDate(request.date),
            request.usageType || 'N/A',
            request.center?.centerName || 'N/A',
            item.product?.productTitle || 'N/A',
            item.quantity || 0,
            request.remark || '',
            formatDateTime(request.createdAt)
          ]);
        } else {
          return [[
            formatDate(request.date),
            request.usageType || 'N/A',
            request.center?.centerName || 'N/A',
            'No Product',
            0,
            request.remark || '',
            formatDateTime(request.createdAt)
          ]];
        }
      });
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row =>
          row
            .map(field => {
              const stringField = String(field || '');
              return `"${stringField.replace(/"/g, '""')}"`;
            })
            .join(',')
        )
      ].join('\n');
      
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
  
      link.setAttribute('href', url);
      link.setAttribute('download', `stolen_report_${new Date().toISOString().split('T')[0]}.csv`);
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
  
  return (
    <div>
      <div className='title'>Stolen Report</div>
       
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
                  <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                    Date {getSortIcon('date')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('usageType')} className="sortable-header">
                    Type {getSortIcon('usageType')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
                    Branch {getSortIcon('center.centerName')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('itemDetail.product.productTitle')} className="sortable-header">
                    Product {getSortIcon('itemDetail.product.productTitle')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('itemDetail.quantity')} className="sortable-header">
                   Qty {getSortIcon('itemDetail.quantity')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('remark')} className="sortable-header">
                    Remark {getSortIcon('remark')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('createdAt')} className="sortable-header">
                    Created At {getSortIcon('createdAt')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredFlattenedData.length > 0 ? (
                  <>
                    {filteredFlattenedData.map((item) => (
                      <CTableRow key={item.uniqueKey}>
                        <CTableDataCell>{formatDate(item.date)}</CTableDataCell>
                        <CTableDataCell>{item.usageType}</CTableDataCell>
                        <CTableDataCell>{item.center?.centerName}</CTableDataCell>
                        <CTableDataCell>{item.itemDetail?.product?.productTitle || 'No Product'}</CTableDataCell>
                        <CTableDataCell>{item.itemDetail?.quantity || 0}</CTableDataCell>
                        <CTableDataCell>{item.remark || ''}</CTableDataCell>
                        <CTableDataCell>{formatDateTime(item.createdAt)}</CTableDataCell>
                      </CTableRow>
                    ))}
                    <CTableRow className='total-row'>
                      <CTableDataCell colSpan="4">Total Count</CTableDataCell>
                      <CTableDataCell>{totals.totalQty}</CTableDataCell>
                      <CTableDataCell colSpan="2"></CTableDataCell>
                    </CTableRow>
                  </>
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="7" className="text-center">
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

export default StolenReport;