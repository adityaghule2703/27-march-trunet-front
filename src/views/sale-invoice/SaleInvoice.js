/////////////***************** Download Invoice Option ***********************/

// import '../../css/table.css';
// import '../../css/form.css';
// import '../../css/profile.css';
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
//   CNav,
//   CNavItem,
//   CNavLink,
//   CTabContent,
//   CTabPane,
//   CBadge
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut, cilFile, cilCloudDownload, cilBan, cilSettings } from '@coreui/icons';
// import { useNavigate } from 'react-router-dom';
// import { CFormLabel } from '@coreui/react-pro';
// import axiosInstance from 'src/axiosInstance';
// import Pagination from 'src/utils/Pagination';
// import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
// import ChallanModal from '../stockRequest/ChallanModal';
// import { Menu, MenuItem } from '@mui/material';
// import SearchSaleInvoice from './SearchSaleInvoice';
// import { numToWords } from 'src/utils/NumToWords';
// import html2pdf from 'html2pdf.js';
// import CancelInvoiceModal from './CancelInvoiceModal';
// import InvoiceDetailsModal from './InvoiceDetailsModal';
// import {
//   CAlert
// } from '@coreui/react';
// import { cilCheck, cilWarning } from '@coreui/icons';

// const SaleInvoices = () => {
//   const [customers, setCustomers] = useState([]);
//   const [invoices, setInvoices] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [resellers, setResellers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [invoiceLoading, setInvoiceLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [selectedChallans, setSelectedChallans] = useState([]);
//   const [activeTab, setActiveTab] = useState('stockRequests'); 
//   const [activeSearch, setActiveSearch] = useState({ 
//     keyword: '', 
//     center: '', 
//     reseller: '',
//     status: 'Completed',
//     startDate: '',
//     endDate: '',
//   });

//   const [invoiceSearch, setInvoiceSearch] = useState({
//     invoiceNumber: '',
//     reseller: '',
//     startDate: '',
//     endDate: '',
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [invoiceCurrentPage, setInvoiceCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [invoiceTotalPages, setInvoiceTotalPages] = useState(1);
//   const [showChallanModal, setShowChallanModal] = useState(false);
//   const [selectedChallan, setSelectedChallan] = useState(null);
//   const [invoiceMetaData, setInvoiceMetaData] = useState(null);

//   const [cancelModalVisible, setCancelModalVisible] = useState(false);
//   const [selectedInvoiceForCancel, setSelectedInvoiceForCancel] = useState(null);
//   const [invoiceDetailsModalVisible, setInvoiceDetailsModalVisible] = useState(false);
//   const [selectedInvoiceForDetails, setSelectedInvoiceForDetails] = useState(null);

//   const [alertVisible, setAlertVisible] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [alertColor, setAlertColor] = useState('success');

//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuId, setMenuId] = useState(null);

//   const dropdownRefs = useRef({});
//   const navigate = useNavigate();

//   const showAlert = (message, color = 'success') => {
//     setAlertMessage(message);
//     setAlertColor(color);
//     setAlertVisible(true);
//     setTimeout(() => {
//       setAlertVisible(false);
//     }, 3000);
//   };

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       params.append('status', 'Completed');
//       if (searchParams.center) {
//         params.append('center', searchParams.center);
//       }
//       if (searchParams.reseller) {
//         params.append('reseller', searchParams.reseller);
//       }
//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate);
//       }
//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate);
//       }
//       params.append('page', page);
      
//       const url = `/stockrequest?${params.toString()}`;
//       console.log('API URL:', url);
      
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         setCustomers(response.data.data);
//         setCurrentPage(response.data.pagination.currentPage);
//         setTotalPages(response.data.pagination.totalPages);
//         console.log('Fetched data:', response.data.data.length, 'items');
//       } else {
//         throw new Error('API returned unsuccessful response');
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchInvoices = async (searchParams = {}, page = 1) => {
//     try {
//       setInvoiceLoading(true);
//       const params = new URLSearchParams();
      
//       if (searchParams.invoiceNumber) {
//         params.append('invoiceNumber', searchParams.invoiceNumber);
//       }
//       if (searchParams.reseller) {
//         params.append('reseller', searchParams.reseller);
//       }
//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate);
//       }
//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate);
//       }
//       params.append('page', page);
      
//       const url = `/invoice`;
//       console.log('Fetching invoices URL:', url);
      
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         setInvoices(response.data.data || []);
//         setInvoiceCurrentPage(response.data.pagination?.currentPage || 1);
//         setInvoiceTotalPages(response.data.pagination?.totalPages || 1);
//         console.log('Fetched invoices:', response.data.data?.length || 0, 'items');
//       } else {
//         throw new Error('API returned unsuccessful response');
//       }
//     } catch (err) {
//       console.error('Error fetching invoices:', err);
//       setInvoices([]);
//     } finally {
//       setInvoiceLoading(false);
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

//   const fetchResellers = async () => {
//     try {
//       const response = await axiosInstance.get('/resellers');
//       if (response.data.success) {
//         setResellers(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const fetchRepairCosts = async (productIds) => {
//     try {
//       const response = await axiosInstance.get('/repaired-cost');
//       if (response.data.success) {
//         const repairCostMap = new Map();
//         response.data.data.forEach(item => {
//           if (item.product && item.product._id) {
//             repairCostMap.set(item.product._id, item.repairCost);
//           }
//         });
//         return repairCostMap;
//       }
//       return new Map();
//     } catch (error) {
//       console.error('Error fetching repair costs:', error);
//       return new Map();
//     }
//   };  
  
//   const markAsInvoiced = async (stockRequestIds, invoiceNumber, invoiceDate, invoiceData) => {
//     try {
//       const cleanInvoiceData = {
//         resellerId: invoiceData.resellerId,
//         centers: invoiceData.centers,
//         products: invoiceData.products.map(p => ({
//           productId: p.productId,
//           productTitle: p.productTitle,
//           hsnCode: p.hsnCode,
//           quantity: p.quantity,
//           outletQty: p.outletQty,
//           damageRepairQty: p.damageRepairQty,
//           centerReturnQty: p.centerReturnQty,
//           outletRate: p.outletRate,
//           repairRate: p.repairRate,
//           centerReturnRate: p.centerReturnRate,
//           outletAmount: p.outletAmount,
//           damageRepairAmount: p.damageRepairAmount,
//           centerReturnAmount: p.centerReturnAmount,
//           totalAmount: p.totalAmount,
//           unit: p.unit
//         })),
//         totalOutletAmount: invoiceData.totalOutletAmount,
//         totalDamageRepairAmount: invoiceData.totalDamageRepairAmount,
//         totalCenterReturnAmount: invoiceData.totalCenterReturnAmount,
//         totalBeforeTax: invoiceData.totalBeforeTax,
//         cgst: invoiceData.cgst,
//         sgst: invoiceData.sgst,
//         roundOff: invoiceData.roundOff,
//         totalAmount: invoiceData.total,
//         hsnSummary: invoiceData.hsnSummary.map(h => ({
//           hsnCode: h.hsnCode,
//           taxableValue: h.taxableValue,
//           cgstAmount: h.cgstAmount,
//           sgstAmount: h.sgstAmount,
//           totalTax: h.totalTax
//         })),
//         metadata: invoiceData.metadata || {},
//         invoiceHtml: invoiceData.invoiceHtml
//       };

//       const response = await axiosInstance.post('/invoice/mark-invoiced', {
//         stockRequestIds,
//         invoiceNumber,
//         invoiceDate: invoiceDate || new Date().toISOString(),
//         invoiceData: cleanInvoiceData
//       });
      
//       if (response.data.success) {
//         console.log('Invoice saved to database:', response.data);
//         return response.data;
//       } else {
//         throw new Error(response.data.message || 'Failed to mark as invoiced');
//       }
//     } catch (error) {
//       console.error('Error marking as invoiced:', error);
//       if (error.response?.data?.message) {
//         throw new Error(error.response.data.message);
//       }
//       throw error;
//     }
//   };
  
//   const handleCancelInvoice = async (cancelData) => {
//     try {
//       if (!selectedInvoiceForCancel) return;
  
//       const response = await axiosInstance.put(`/invoice/${selectedInvoiceForCancel._id}/cancel`, {
//         cancelReason: cancelData.cancelReason,
//         cancelWithCreditNote: cancelData.cancelWithCreditNote
//       });
  
//       if (response.data.success) {
//         showAlert(response.data.message, 'success');
//         fetchInvoices(invoiceSearch, invoiceCurrentPage);
//         setCancelModalVisible(false);
//         setSelectedInvoiceForCancel(null);
//       } else {
//         throw new Error(response.data.message || 'Failed to cancel invoice');
//       }
//     } catch (error) {
//       console.error('Error cancelling invoice:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel invoice';

//       showAlert(errorMessage, 'danger');
      
//       throw error;
//     }
//   };

//   const handleDownloadInvoice = async (invoice) => {
//     try {
//       if (!invoice.invoiceHtml) {
//         alert('Invoice HTML not available for download');
//         return;
//       }

//       const originalButtonText = document.activeElement.innerHTML;
//       document.activeElement.innerHTML = '<span>Downloading PDF...</span>';
//       document.activeElement.disabled = true;

//       const tempDiv = document.createElement('div');
//       tempDiv.innerHTML = invoice.invoiceHtml;
      
//       const scripts = tempDiv.getElementsByTagName('script');
//       for (let script of scripts) {
//         if (script.textContent.includes('window.print()')) {
//           script.remove();
//         }
//       }

//       const opt = {
//         margin: [12, 12, 12, 12],
//         filename: `Invoice_${invoice.invoiceNumber.replace(/\//g, '_')}.pdf`,
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { 
//           scale: 2,
//           useCORS: true,
//           letterRendering: true,
//           allowTaint: true
//         },
//         jsPDF: { 
//           unit: 'mm', 
//           format: 'a4', 
//           orientation: 'portrait',
//           compress: true
//         },
//         pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
//       };

//       await html2pdf().set(opt).from(tempDiv).save();
//       document.activeElement.innerHTML = originalButtonText;
//       document.activeElement.disabled = false;

//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       alert('Error downloading PDF: ' + error.message);
//       if (invoice.invoiceHtml) {
//         const blob = new Blob([invoice.invoiceHtml], { type: 'text/html' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `Invoice_${invoice.invoiceNumber.replace(/\//g, '_')}.html`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//       }
//     }
//   };

//   const handleMenuClick = (event, invoiceId) => {
//     setAnchorEl(event.currentTarget);
//     setMenuId(invoiceId);
//   };

//   const handleCloseMenu = () => {
//     setAnchorEl(null);
//     setMenuId(null);
//   };

//   const handleSelectChallan = (id) => {
//     setSelectedChallans((prev) =>
//       prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
//     );
//   };
  
//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       const nonInvoicedIds = filteredCustomers
//         .filter(c => !c.invoiceInfo?.invoiceRaised)
//         .map((c) => c._id);
//       setSelectedChallans(nonInvoicedIds);
//     } else {
//       setSelectedChallans([]);
//     }
//   };
  
//   useEffect(() => {
//     fetchData();
//     fetchCenters();
//     fetchResellers();
//     if (activeTab === 'invoices') {
//       fetchInvoices();
//     }
//   }, []);
  
//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     fetchData(activeSearch, page);
//   };

//   const handleInvoicePageChange = (page) => {
//     if (page < 1 || page > invoiceTotalPages) return;
//     fetchInvoices(invoiceSearch, page);
//   };

//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });

//     const sortedCustomers = [...customers].sort((a, b) => {
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

//     setCustomers(sortedCustomers);
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
//     const searchWithCompleted = { ...searchData, status: 'Completed' };
//     setActiveSearch(searchWithCompleted);
//     fetchData(searchWithCompleted, 1);
//   };

//   const handleInvoiceSearch = (searchData) => {
//     setInvoiceSearch(searchData);
//     fetchInvoices(searchData, 1);
//   };

//   const handleResetSearch = () => {
//     const resetSearch = { 
//       center: '', 
//       reseller: '',
//       startDate: '',
//       endDate: '',
//     };
//     setActiveSearch(resetSearch);
//     setSearchTerm('');
//     fetchData(resetSearch, 1);
//   };

//   const handleResetInvoiceSearch = () => {
//     const resetSearch = {
//       invoiceNumber: '',
//       reseller: '',
//       startDate: '',
//       endDate: '',
//     };
//     setInvoiceSearch(resetSearch);
//     setInvoiceSearchTerm('');
//     fetchInvoices(resetSearch, 1);
//   };

//   const handleClick = (itemId) => {
//     navigate(`/stockRequest-profile/${itemId}`);
//   };

//   const filteredCustomers = customers.filter(customer => {
//     if (activeSearch.keyword || activeSearch.center || activeSearch.outlet) {
//       return true;
//     }
//     return Object.values(customer).some(value => {
//       if (typeof value === 'object' && value !== null) {
//         return Object.values(value).some(nestedValue => 
//           nestedValue && nestedValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
//       return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
//     });
//   });

//   const filteredInvoices = invoices.filter(invoice => {
//     if (invoiceSearch.invoiceNumber || invoiceSearch.reseller || invoiceSearch.startDate || invoiceSearch.endDate) {
//       return true;
//     }
//     if (!invoiceSearchTerm.trim()) {
//       return true;
//     }
    
//     const searchLower = invoiceSearchTerm.toLowerCase();
//     if (invoice.invoiceNumber?.toLowerCase().includes(searchLower)) {
//       return true;
//     }
//     if (invoice.reseller?.businessName?.toLowerCase().includes(searchLower)) {
//       return true;
//     }
//     if (invoice.reseller?.gstNumber?.toLowerCase().includes(searchLower)) {
//       return true;
//     }
    
//     return false;
//   });
  
//   const handleGenerateChallan = (item) => {
//     setSelectedChallan(item);
//     setShowChallanModal(true);
//   };

//   // const handleGenerateInvoice = async (metaData) => {
//   //   let invoiceWindow = null;
    
//   //   try {
//   //     setInvoiceMetaData(metaData);
  
//   //     const selectedData = customers.filter(c => selectedChallans.includes(c._id));
//   //     if (selectedData.length === 0) return;
  
//   //     const invoiceNumber = `STEL/${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(2)}/${Math.floor(Math.random() * 1000)}`;
//   //     const invoiceDate = new Date().toLocaleDateString('en-GB', { 
//   //       day: '2-digit', 
//   //       month: 'short', 
//   //       year: '2-digit' 
//   //     });
  
//   //     const allProductIds = [];
//   //     selectedData.forEach(challan => {
//   //       challan.products.forEach(product => {
//   //         if (product.product?._id) {
//   //           allProductIds.push(product.product._id.toString());
//   //         }
//   //       });
//   //     });
  
//   //     const repairCostMap = await fetchRepairCosts(allProductIds);
      
//   //     const reseller = selectedData[0]?.center?.reseller;
  
//   //     const allCenters = [
//   //       ...new Set(selectedData.map(c => c.center?._id).filter(Boolean))
//   //     ];
      
//   //     const centerNames = [
//   //       ...new Set(selectedData.map(c => c.center?.centerName).filter(Boolean))
//   //     ];
//   //     const centersList = centerNames.join(', ');
  
//   //     const productMap = new Map();
      
//   //     selectedData.forEach(challan => {
//   //       challan.products.forEach(product => {
//   //         const productId = product.product?._id || product.product?.productTitle;
//   //         const productTitle = product.product?.productTitle || '';
//   //         const hsnCode = product.product?.hsnCode || '85176990';
//   //         const salePrice = product.product?.salePrice || product.rate || 0;
          
//   //         const repairCostPerUnit = repairCostMap.get(product.product?._id?.toString()) || 150;
          
//   //         const sourceBreakdown = product.sourceBreakdown || {};
//   //         const resellerQty = sourceBreakdown.fromReseller?.quantity || 0;
//   //         const outletQty = sourceBreakdown.fromOutlet?.quantity || 0;
          
//   //         const resellerStock = product.resellerStock || {};
//   //         const availableBreakdown = resellerStock.availableBreakdown || {};
          
//   //         let damageRepairQty = 0;
//   //         let centerReturnQty = 0;
          
//   //         if (resellerQty > 0) {
//   //           const totalDamageRepairInStock = availableBreakdown.damageRepair || 0;
//   //           const totalCenterReturnInStock = availableBreakdown.centerReturn || 0;
//   //           const totalResellerStockAvailable = totalDamageRepairInStock + totalCenterReturnInStock;
            
//   //           if (totalResellerStockAvailable > 0) {
//   //             const damageRepairRatio = totalDamageRepairInStock / totalResellerStockAvailable;
//   //             const centerReturnRatio = totalCenterReturnInStock / totalResellerStockAvailable;
              
//   //             damageRepairQty = Math.min(
//   //               Math.round(resellerQty * damageRepairRatio),
//   //               totalDamageRepairInStock
//   //             );
//   //             centerReturnQty = Math.min(
//   //               resellerQty - damageRepairQty,
//   //               totalCenterReturnInStock
//   //             );
              
//   //             if (damageRepairQty + centerReturnQty !== resellerQty) {
//   //               const remaining = resellerQty - damageRepairQty - centerReturnQty;
//   //               if (remaining > 0) {
//   //                 if (totalDamageRepairInStock - damageRepairQty > totalCenterReturnInStock - centerReturnQty) {
//   //                   damageRepairQty += remaining;
//   //                 } else {
//   //                   centerReturnQty += remaining;
//   //                 }
//   //               }
//   //             }
//   //           } else {
//   //             damageRepairQty = Math.round(resellerQty / 2);
//   //             centerReturnQty = resellerQty - damageRepairQty;
//   //           }
//   //         }
  
//   //         if (productMap.has(productId)) {
//   //           const existing = productMap.get(productId);
           
//   //           const outletAmount = outletQty * salePrice;
//   //           const damageRepairAmount = damageRepairQty * repairCostPerUnit;
//   //           const centerReturnAmount = centerReturnQty * 0;
            
//   //           existing.quantity += (resellerQty + outletQty);
//   //           existing.outletQty += outletQty;
//   //           existing.damageRepairQty += damageRepairQty;
//   //           existing.centerReturnQty += centerReturnQty;
            
//   //           existing.outletAmount += outletAmount;
//   //           existing.damageRepairAmount += damageRepairAmount;
//   //           existing.centerReturnAmount += centerReturnAmount;
//   //           existing.totalAmount += outletAmount + damageRepairAmount + centerReturnAmount;
//   //         } else {
            
//   //           const outletAmount = outletQty * salePrice;
//   //           const damageRepairAmount = damageRepairQty * repairCostPerUnit;
//   //           const centerReturnAmount = centerReturnQty * 0;
            
//   //           productMap.set(productId, {
//   //             productId: product.product?._id,
//   //             productTitle: productTitle,
//   //             hsnCode: hsnCode,
//   //             quantity: resellerQty + outletQty,
             
//   //             outletQty: outletQty, 
//   //             damageRepairQty: damageRepairQty,
//   //             centerReturnQty: centerReturnQty, 
              
//   //             outletRate: salePrice,
//   //             repairRate: repairCostPerUnit,
//   //             centerReturnRate: 0, 
  
//   //             outletAmount: outletAmount,
//   //             damageRepairAmount: damageRepairAmount,
//   //             centerReturnAmount: centerReturnAmount,
//   //             totalAmount: outletAmount + damageRepairAmount + centerReturnAmount,
              
//   //             unit: 'Nos'
//   //           });
//   //         }
//   //       });
//   //     });
  
//   //     const combinedProducts = Array.from(productMap.values());
  
//   //     const totalOutletAmount = combinedProducts.reduce((sum, p) => sum + p.outletAmount, 0);
//   //     const totalDamageRepairAmount = combinedProducts.reduce((sum, p) => sum + p.damageRepairAmount, 0);
//   //     const totalCenterReturnAmount = combinedProducts.reduce((sum, p) => sum + p.centerReturnAmount, 0);
      
//   //     const totalBeforeTax = totalOutletAmount + totalDamageRepairAmount + totalCenterReturnAmount;
      
//   //     const cgst = totalBeforeTax * 0.09;
//   //     const sgst = totalBeforeTax * 0.09;
//   //     const roundOff = Math.round(totalBeforeTax + cgst + sgst) - (totalBeforeTax + cgst + sgst);
//   //     const total = totalBeforeTax + cgst + sgst + roundOff;
  
//   //     const hsnMap = new Map();
//   //     combinedProducts.forEach(product => {
//   //       const hsn = product.hsnCode;
//   //       const taxableValue = product.totalAmount;
//   //       const cgstAmount = taxableValue * 0.09;
//   //       const sgstAmount = taxableValue * 0.09;
//   //       const totalTax = cgstAmount + sgstAmount;
        
//   //       if (hsnMap.has(hsn)) {
//   //         const existing = hsnMap.get(hsn);
//   //         existing.taxableValue += taxableValue;
//   //         existing.cgstAmount += cgstAmount;
//   //         existing.sgstAmount += sgstAmount;
//   //         existing.totalTax += totalTax;
//   //       } else {
//   //         hsnMap.set(hsn, {
//   //           hsnCode: hsn,
//   //           taxableValue: taxableValue,
//   //           cgstAmount: cgstAmount,
//   //           sgstAmount: sgstAmount,
//   //           totalTax: totalTax
//   //         });
//   //       }
//   //     });
  
//   //     const hsnSummary = Array.from(hsnMap.values());
  
//   //     const productsPerPage = 8;
//   //     const pages = [];
//   //     for (let i = 0; i < combinedProducts.length; i += productsPerPage) {
//   //       pages.push(combinedProducts.slice(i, i + productsPerPage));
//   //     }
  
//   //     const invoiceHTML = `
//   //       <html>
//   //       <head>
//   //         <title>Invoice - ${reseller?.businessName || 'SSV Alpha Broadband LLP'}</title>
//   //         <style>
//   //           @page { size: A4; margin: 12mm; }
//   //           body { font-family: Arial, sans-serif; color: #000; margin: 0; padding: 0;}

//   //           @media screen {
//   //              body {
//   //                 margin-left: 100px;
//   //                 margin-right: 100px;
//   //                 margin-top: 20px;
//   //                 margin-bottom: 20px;
//   //                }
//   //               }
//   //              @media print {
//   //              body {
//   //                  margin: 0;
//   //                  padding: 0;
//   //                 }
//   //                 @page {
//   //                margin: 12mm;
//   //                 }
//   //               }
//   //           .title { text-align: center; font-weight: bold; font-size: 16px; margin: 6px 0; }
//   //           .main-border { border: 1px solid #000; width: 100%; border-collapse: collapse; }
//   //           .main-border td, .main-border th { border: 1px solid #000; padding: 5px; vertical-align: top; }
//   //           .meta-table { width: 100%; border-collapse: collapse; }
//   //           .meta-table td { border: 1px solid #000; padding: 6px; vertical-align: top; }
//   //           .label { font-weight: bold; }
//   //           .right { text-align: right; }
//   //           .bold { font-weight: bold; }
//   //           .footer-note { font-style: italic; text-align: right; margin-top: 4px; }
//   //           .repair-note { color: #666; font-size: 0.9em; }
//   //           .free-note { color: green; font-size: 0.9em; }
//   //           .invoice-info { 
//   //             background-color: #f8f9fa; 
//   //             padding: 10px; 
//   //             margin: 10px 0; 
//   //             border: 1px solid #dee2e6;
//   //             border-radius: 4px;
//   //           }
//   //           .print-button {
//   //             display: block;
//   //             margin: 20px auto;
//   //             padding: 10px 15px;
//   //             background-color: #3c8dbc;
//   //             color: white;
//   //             border: none;
//   //             font-size: 16px;
//   //             cursor: pointer;
//   //             position: sticky;
//   //             top: 20px;
//   //             z-index: 1000;
//   //           }
//   //           .print-button:hover {
//   //             background-color: #3c8dbc;
//   //           }
//   //           @media print { 
//   //             .page-break { page-break-before: always; } 
//   //             .no-print { display: none; }
//   //             .print-button { display: none; }
//   //           }
//   //         </style>
//   //       </head>
//   //       <body>
//   //         <div class="title">Tax Invoice</div>
  
//   //         ${pages.map((products, pageIndex) => `
//   //           <table class="main-border">
//   //             <tr>
//   //               <td style="width:50%;">
//   //                 <div style="border-bottom:1px solid #000; padding-bottom:6px; margin-bottom:6px;">
//   //                   <div class="bold">SSV Telecom Private Limited FY 22-23</div>
//   //                   A-1, Landmark CHS, Sector 14<br/>
//   //                   Vashi, Navi Mumbai<br/>
//   //                   27ABECS3422Q1ZX<br/>
//   //                   GSTIN/UIN: 27ABECS3422Q1ZX
//   //                 </div>
  
//   //                 <span class="label">Consignee (Ship to)</span><br/>
//   //                 ${reseller?.businessName || 'SSV Alpha Broadband LLP'}<br/>
//   //                 ${centersList || 'All Alpha Area'}<br/><br/>
//   //                 GSTIN/UIN: ${reseller?.gstNumber || '27AEGFS1650E1Z6'}<br/>
//   //                 State Name : ${reseller?.state || 'Maharashtra'}, Code : 27
//   //                 <hr/>
  
//   //                 <span class="label">Buyer (Bill to)</span><br/>
//   //                 ${reseller?.businessName || 'SSV Alpha Broadband LLP'}<br/>
//   //                 ${reseller?.address1 || 'A/3, Landmark Soc, Sector-14, Vashi'}<br/>
//   //                 GSTIN/UIN: ${reseller?.gstNumber || '27AEGFS1650E1Z6'}<br/>
//   //                 State Name : ${reseller?.state || 'Maharashtra'}, Code : 27
//   //               </td>
  
//   //               <td style="width:50%; padding:0;">
//   //                 <table class="meta-table">
//   //                   <tr>
//   //                     <td><span class="label">Invoice No.</span><br/>${invoiceNumber}</td>
//   //                     <td><span class="label">Dated</span><br/>${invoiceDate}</td>
//   //                   </tr>
//   //                   <tr>
//   //                     <td><span class="label">Delivery Note</span><br/>${metaData?.deliveryNote || ''}</td>
//   //                     <td><span class="label">Mode/Terms of Payment</span><br/>${metaData?.modeOfPayment || ''}</td>
//   //                   </tr>
//   //                   <tr>
//   //                     <td><span class="label">Reference No. & Date</span><br/>${metaData?.referenceNo || ''} ${metaData?.referenceDate ? new Date(metaData.referenceDate).toLocaleDateString() : ''}</td>
//   //                     <td><span class="label">Other References</span><br/>${metaData?.otherReferences || ''}</td>
//   //                   </tr>
//   //                   <tr>
//   //                     <td><span class="label">Buyer's Order No.</span><br/>${metaData?.buyerOrderNo || ''}</td>
//   //                     <td><span class="label">Dated</span><br/>${metaData?.buyerOrderDate ? new Date(metaData.buyerOrderDate).toLocaleDateString() : ''}</td>
//   //                   </tr>
//   //                   <tr>
//   //                     <td><span class="label">Dispatch Doc No.</span><br/>${metaData?.dispatchDocNo || '16.07-31.07.25'}</td>
//   //                     <td><span class="label">Delivery Note Date</span><br/>${metaData?.deliveryNoteDate ? new Date(metaData.deliveryNoteDate).toLocaleDateString() : ''}</td>
//   //                   </tr>
//   //                   <tr>
//   //                     <td><span class="label">Dispatched through</span><br/>${metaData?.dispatchedThrough || ''}</td>
//   //                     <td><span class="label">Destination</span><br/><b>${metaData?.destination || 'All Alpha Area'}</b></td>
//   //                   </tr>
//   //                   <tr>
//   //                     <td colspan="2"><span class="label">Terms of Delivery</span><br/>${metaData?.termsOfDelivery || ''}</td>
//   //                   </tr>
//   //                 </table>
//   //               </td>
//   //             </tr>
//   //           </table>
  
//   //           <table class="main-border" style="margin-top:10px;">
//   //             <thead>
//   //               <tr>
//   //                 <th>Sl No.</th>
//   //                 <th>Description of Goods</th>
//   //                 <th>HSN/SAC</th>
//   //                 <th>Quantity</th>
//   //                 <th>Rate</th>
//   //                 <th>Per</th>
//   //                 <th>Amount</th>
//   //               </tr>
//   //             </thead>
//   //             <tbody>
//   //               ${products.map((p, i) => {
//   //                 const productIndex = pageIndex * productsPerPage + i + 1;
//   //                 let rows = [];
//   //                 let rowCount = 0;
                  
//   //                 if (p.outletQty > 0) {
//   //                   rows.push(`
//   //                     <tr>
//   //                       <td${rowCount > 0 ? ' rowspan="' + rowCount + '"' : ''}>${productIndex}</td>
//   //                       <td>${p.productTitle}</td>
//   //                       <td>${p.hsnCode}</td>
//   //                       <td class="right">${p.outletQty}</td>
//   //                       <td class="right">${p.outletRate.toFixed(2)}</td>
//   //                       <td>${p.unit}</td>
//   //                       <td class="right">${p.outletAmount.toFixed(2)}</td>
//   //                     </tr>
//   //                   `);
//   //                   rowCount++;
//   //                 }
                  
//   //                 if (p.damageRepairQty > 0) {
//   //                   rows.push(`
//   //                     <tr>
//   //                       <td${rowCount === 0 ? ' rowspan="' + (rowCount + 1) + '"' : ''}></td>
//   //                       <td>${p.productTitle} <span class="repair-note">(Damage Repair - Charged @₹${p.repairRate}/unit)</span></td>
//   //                       <td>${p.hsnCode}</td>
//   //                       <td class="right">${p.damageRepairQty}</td>
//   //                       <td class="right">${p.repairRate.toFixed(2)}</td>
//   //                       <td>${p.unit}</td>
//   //                       <td class="right">${p.damageRepairAmount.toFixed(2)}</td>
//   //                     </tr>
//   //                   `);
//   //                   rowCount++;
//   //                 }
                  
//   //                 if (p.centerReturnQty > 0) {
//   //                   rows.push(`
//   //                     <tr>
//   //                       <td${rowCount === 0 ? ' rowspan="' + (rowCount + 1) + '"' : ''}></td>
//   //                       <td>${p.productTitle} <span class="free-note">(Center Return - Free)</span></td>
//   //                       <td>${p.hsnCode}</td>
//   //                       <td class="right">${p.centerReturnQty}</td>
//   //                       <td class="right">${p.centerReturnRate.toFixed(2)}</td>
//   //                       <td>${p.unit}</td>
//   //                       <td class="right">${p.centerReturnAmount.toFixed(2)}</td>
//   //                     </tr>
//   //                   `);
//   //                   rowCount++;
//   //                 }
                  
//   //                 return rows.join('');
//   //               }).join('')}
//   //               ${pageIndex === pages.length - 1 ? `
//   //               <tr>
//   //                 <td colspan="4" rowspan="7"></td>
//   //                 <td colspan="2"><b>Subtotal (New Stock from Outlet)</b></td>
//   //                 <td class="right">${totalOutletAmount.toFixed(2)}</td>
//   //               </tr>
//   //               <tr>
//   //                 <td colspan="2"><b>Subtotal (Damage Repair)</b></td>
//   //                 <td class="right">${totalDamageRepairAmount.toFixed(2)}</td>
//   //               </tr>
//   //               <tr>
//   //                 <td colspan="2"><b>Total Before Tax</b></td>
//   //                 <td class="right">${totalBeforeTax.toFixed(2)}</td>
//   //               </tr>
//   //               <tr><td colspan="2"><b>Output CGST @9%</b></td><td class="right">${cgst.toFixed(2)}</td></tr>
//   //               <tr><td colspan="2"><b>Output SGST @9%</b></td><td class="right">${sgst.toFixed(2)}</td></tr>
//   //               <tr><td colspan="2"><b>Round Off</b></td><td class="right">${roundOff.toFixed(2)}</td></tr>
//   //               <tr><td colspan="2"><b>Total</b></td><td class="right">${total.toFixed(2)}</td></tr>
//   //               <tr><td colspan="7"><b>Amount Chargeable (in words):</b><i>${numToWords(total)}</i></td></tr>` : ''}
//   //             </tbody>
//   //           </table>
//   //           ${pageIndex < pages.length - 1 ? '<div class="footer-note">continued ...</div><div class="page-break"></div>' : ''}
//   //         `).join('')}
  
//   //         <!-- Tax Summary Page -->
//   //         <div class="page-break"></div>
  
//   //         <div class="analysis-header" style="display:flex; justify-content:space-between; margin-top:10px;">
//   //           <div>Invoice No. <strong>${invoiceNumber}</strong></div>
//   //           <div>Dated <strong>${invoiceDate}</strong></div>
//   //         </div>
  
//   //         <div style="text-align:center;">
//   //           <p><strong>SSV Telecom Private Limited</strong><br/>
//   //             A-1, Landmark CHS, Sector 14<br/>
//   //             Vashi , Navi Mumbai<br/>
//   //             27ABECS3422Q1ZX<br/>
//   //             GSTIN/UIN: 27ABECS3422Q1ZX<br/><br/>
//   //             Party: <strong>SSV Telecom Private Limited</strong><br/>
//   //             A/3, Landmark Soc, Sector-14 , Vashi<br/>
//   //             Navi Mumbai<br/>
//   //             GSTIN/UIN : 27AEGFS1650E1Z6<br/>
//   //             State Name : Maharashtra, Code : 27
//   //           </p>
//   //         </div>
  
//   //         <table class="main-border" style="margin-top:10px;">
//   //           <thead>
//   //             <tr>
//   //               <th>HSN/SAC</th>
//   //               <th>Taxable Value</th>
//   //               <th colspan="2">CGST</th>
//   //               <th colspan="2">SGST</th>
//   //               <th>Total Tax Amount</th>
//   //             </tr>
//   //             <tr>
//   //               <th></th>
//   //               <th></th>
//   //               <th>Rate</th>
//   //               <th>Amount</th>
//   //               <th>Rate</th>
//   //               <th>Amount</th>
//   //               <th></th>
//   //             </tr>
//   //           </thead>
//   //           <tbody>
//   //             ${hsnSummary.map(hsn => `
//   //               <tr>
//   //                 <td>${hsn.hsnCode}</td>
//   //                 <td class="right">${hsn.taxableValue.toFixed(2)}</td>
//   //                 <td>9%</td>
//   //                 <td class="right">${hsn.cgstAmount.toFixed(2)}</td>
//   //                 <td>9%</td>
//   //                 <td class="right">${hsn.sgstAmount.toFixed(2)}</td>
//   //                 <td class="right">${hsn.totalTax.toFixed(2)}</td>
//   //               </tr>`).join('')}
//   //              <tr class="bold">
//   //               <td><b>Total</b></td>
//   //               <td class="right">${totalBeforeTax.toFixed(2)}</td>
//   //               <td></td>
//   //               <td class="right">${cgst.toFixed(2)}</td>
//   //               <td></td>
//   //               <td class="right">${sgst.toFixed(2)}</td>
//   //               <td class="right">${(cgst + sgst).toFixed(2)}</td>
//   //             </tr>
//   //              <tr>
//   //            <td colspan="7"><b>Taxable Amount (in words):</b> <i>${numToWords(parseFloat((cgst + sgst).toFixed(2)))}
//   //           </i></td>
//   //            </tr>
//   //           </tbody>
//   //         </table>
//   //           <button class="print-button no-print" onclick="window.print()">🖨️ Print</button>
          
//   //       </body>
//   //       </html>
//   //     `;
  
//   //     const invoiceData = {
//   //       resellerId: reseller?._id,
//   //       centers: allCenters,
//   //       products: combinedProducts,
//   //       totalOutletAmount,
//   //       totalDamageRepairAmount,
//   //       totalCenterReturnAmount,
//   //       totalBeforeTax,
//   //       cgst,
//   //       sgst,
//   //       roundOff,
//   //       total,
//   //       hsnSummary,
//   //       metadata: {
//   //         deliveryNote: metaData?.deliveryNote || '',
//   //         modeOfPayment: metaData?.modeOfPayment || '',
//   //         referenceNo: metaData?.referenceNo || '',
//   //         referenceDate: metaData?.referenceDate || null,
//   //         otherReferences: metaData?.otherReferences || '',
//   //         buyerOrderNo: metaData?.buyerOrderNo || '',
//   //         buyerOrderDate: metaData?.buyerOrderDate || null,
//   //         dispatchDocNo: metaData?.dispatchDocNo || '',
//   //         deliveryNoteDate: metaData?.deliveryNoteDate || null,
//   //         dispatchedThrough: metaData?.dispatchedThrough || '',
//   //         destination: metaData?.destination || centersList || 'All Alpha Area',
//   //         termsOfDelivery: metaData?.termsOfDelivery || ''
//   //       },
//   //       invoiceHtml: invoiceHTML
//   //     };
  
//   //     let saveSuccess = false;
//   //     try {
//   //       const invoicedResponse = await markAsInvoiced(
//   //         selectedChallans, 
//   //         invoiceNumber, 
//   //         new Date().toISOString(), 
//   //         invoiceData
//   //       );
        
//   //       if (invoicedResponse.success) {
//   //         console.log('Successfully saved invoice to database:', invoicedResponse.message);
//   //         saveSuccess = true;
//   //       } else {
//   //         throw new Error(invoicedResponse.message || 'Failed to save invoice');
//   //       }
//   //     } catch (saveError) {
//   //       console.error('Error saving invoice to database:', saveError);
//   //     }
//   //     invoiceWindow = window.open('', '_blank');
//   //     if (invoiceWindow) {
//   //       invoiceWindow.document.write(invoiceHTML);
//   //       invoiceWindow.document.close();
//   //     } else {
//   //       throw new Error('Could not open invoice window. Please allow popups.');
//   //     }
  
//   //     fetchData(activeSearch, currentPage);
      
//   //     setSelectedChallans([]);
      
//   //     if (saveSuccess) {
//   //       if (activeTab === 'invoices') {
//   //         fetchInvoices(invoiceSearch, invoiceCurrentPage);
//   //       }
//   //     } else {
//   //       alert(`Invoice ${invoiceNumber} generated but could not be saved to database. Please contact administrator.`);
//   //     }
  
//   //   } catch (error) {
//   //     console.error('Error generating invoice:', error);
      
//   //     if (invoiceWindow && invoiceWindow.document) {
//   //       invoiceWindow.document.write(`
//   //         <html>
//   //         <body>
//   //           <h2>Error Generating Invoice</h2>
//   //           <p>${error.message || 'Unknown error occurred'}</p>
//   //           <button onclick="window.close()">Close</button>
//   //         </body>
//   //         </html>
//   //       `);
//   //       invoiceWindow.document.close();
//   //     }
      
//   //     alert('Error generating invoice: ' + (error.message || 'Please try again'));
//   //   }
//   // };



//   const handleGenerateInvoice = async (metaData) => {
//     let invoiceWindow = null;
    
//     try {
//       setInvoiceMetaData(metaData);
  
//       const selectedData = customers.filter(c => selectedChallans.includes(c._id));
//       if (selectedData.length === 0) return;
  
//       const invoiceNumber = `STEL/${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(2)}/${Math.floor(Math.random() * 1000)}`;
//       const invoiceDate = new Date().toLocaleDateString('en-GB', { 
//         day: '2-digit', 
//         month: 'short', 
//         year: '2-digit' 
//       });
  
//       const allProductIds = [];
//       selectedData.forEach(challan => {
//         challan.products.forEach(product => {
//           if (product.product?._id) {
//             allProductIds.push(product.product._id.toString());
//           }
//         });
//       });
  
//       const repairCostMap = await fetchRepairCosts(allProductIds);
      
//       const reseller = selectedData[0]?.center?.reseller;
  
//       const allCenters = [
//         ...new Set(selectedData.map(c => c.center?._id).filter(Boolean))
//       ];
      
//       const centerNames = [
//         ...new Set(selectedData.map(c => c.center?.centerName).filter(Boolean))
//       ];
//       const centersList = centerNames.join(', ');
  
//       const productMap = new Map();
      
//       selectedData.forEach(challan => {
//         challan.products.forEach(product => {
//           const productId = product.product?._id || product.product?.productTitle;
//           const productTitle = product.product?.productTitle || '';
//           const hsnCode = product.product?.hsnCode || '85176990';
//           const salePrice = product.product?.salePrice || product.rate || 0;
          
//           const repairCostPerUnit = repairCostMap.get(product.product?._id?.toString()) || 150;
          
//           // Check if sourceBreakdown has valid data
//           const sourceBreakdown = product.sourceBreakdown || {};
//           const hasValidSourceBreakdown = sourceBreakdown.totalApproved > 0;
          
//           let resellerQty = 0;
//           let outletQty = 0;
          
//           if (hasValidSourceBreakdown) {
//             // Use sourceBreakdown if available (for newer requests)
//             resellerQty = sourceBreakdown.fromReseller?.quantity || 0;
//             outletQty = sourceBreakdown.fromOutlet?.quantity || 0;
//             console.log(`Using sourceBreakdown for ${productTitle}: Reseller=${resellerQty}, Outlet=${outletQty}`);
//           } else {
//             // Fall back to receivedQuantity for older requests without sourceBreakdown
//             // Assume all received quantity came from outlet
//             outletQty = product.receivedQuantity || 0;
//             resellerQty = 0;
//             console.log(`Using receivedQuantity fallback for ${productTitle}: Outlet=${outletQty} (sourceBreakdown not available)`);
//           }
          
//           const resellerStock = product.resellerStock || {};
//           const availableBreakdown = resellerStock.availableBreakdown || {};
          
//           let damageRepairQty = 0;
//           let centerReturnQty = 0;
          
//           // Only calculate damage repair if there's reseller quantity
//           if (resellerQty > 0) {
//             const totalDamageRepairInStock = availableBreakdown.damageRepair || 0;
//             const totalCenterReturnInStock = availableBreakdown.centerReturn || 0;
//             const totalResellerStockAvailable = totalDamageRepairInStock + totalCenterReturnInStock;
            
//             if (totalResellerStockAvailable > 0) {
//               const damageRepairRatio = totalDamageRepairInStock / totalResellerStockAvailable;
              
//               damageRepairQty = Math.min(
//                 Math.round(resellerQty * damageRepairRatio),
//                 totalDamageRepairInStock
//               );
//               centerReturnQty = Math.min(
//                 resellerQty - damageRepairQty,
//                 totalCenterReturnInStock
//               );
              
//               if (damageRepairQty + centerReturnQty !== resellerQty) {
//                 const remaining = resellerQty - damageRepairQty - centerReturnQty;
//                 if (remaining > 0) {
//                   if (totalDamageRepairInStock - damageRepairQty > totalCenterReturnInStock - centerReturnQty) {
//                     damageRepairQty += remaining;
//                   } else {
//                     centerReturnQty += remaining;
//                   }
//                 }
//               }
//             } else {
//               // If no breakdown info, assume 50-50 split
//               damageRepairQty = Math.round(resellerQty / 2);
//               centerReturnQty = resellerQty - damageRepairQty;
//             }
//           }
  
//           // For products with sourceBreakdown missing, we don't have damage repair info
//           // So we'll treat all as outlet stock (no damage repair)
//           if (!hasValidSourceBreakdown) {
//             damageRepairQty = 0;
//             centerReturnQty = 0;
//           }
  
//           if (productMap.has(productId)) {
//             const existing = productMap.get(productId);
           
//             const outletAmount = outletQty * salePrice;
//             const damageRepairAmount = damageRepairQty * repairCostPerUnit;
//             const centerReturnAmount = centerReturnQty * 0;
            
//             existing.quantity += (resellerQty + outletQty);
//             existing.outletQty += outletQty;
//             existing.damageRepairQty += damageRepairQty;
//             existing.centerReturnQty += centerReturnQty;
            
//             existing.outletAmount += outletAmount;
//             existing.damageRepairAmount += damageRepairAmount;
//             existing.centerReturnAmount += centerReturnAmount;
//             existing.totalAmount += outletAmount + damageRepairAmount + centerReturnAmount;
//           } else {
            
//             const outletAmount = outletQty * salePrice;
//             const damageRepairAmount = damageRepairQty * repairCostPerUnit;
//             const centerReturnAmount = centerReturnQty * 0;
            
//             productMap.set(productId, {
//               productId: product.product?._id,
//               productTitle: productTitle,
//               hsnCode: hsnCode,
//               quantity: resellerQty + outletQty,
             
//               outletQty: outletQty, 
//               damageRepairQty: damageRepairQty,
//               centerReturnQty: centerReturnQty, 
              
//               outletRate: salePrice,
//               repairRate: repairCostPerUnit,
//               centerReturnRate: 0, 
  
//               outletAmount: outletAmount,
//               damageRepairAmount: damageRepairAmount,
//               centerReturnAmount: centerReturnAmount,
//               totalAmount: outletAmount + damageRepairAmount + centerReturnAmount,
              
//               unit: 'Nos'
//             });
//           }
//         });
//       });
  
//       const combinedProducts = Array.from(productMap.values());
  
//       // Filter out products with zero quantity
//       const nonZeroProducts = combinedProducts.filter(p => p.quantity > 0);
      
//       if (nonZeroProducts.length === 0) {
//         alert('No products with quantity > 0 found in selected stock requests');
//         return;
//       }
  
//       const totalOutletAmount = nonZeroProducts.reduce((sum, p) => sum + p.outletAmount, 0);
//       const totalDamageRepairAmount = nonZeroProducts.reduce((sum, p) => sum + p.damageRepairAmount, 0);
//       const totalCenterReturnAmount = nonZeroProducts.reduce((sum, p) => sum + p.centerReturnAmount, 0);
      
//       const totalBeforeTax = totalOutletAmount + totalDamageRepairAmount + totalCenterReturnAmount;
      
//       const cgst = totalBeforeTax * 0.09;
//       const sgst = totalBeforeTax * 0.09;
//       const roundOff = Math.round(totalBeforeTax + cgst + sgst) - (totalBeforeTax + cgst + sgst);
//       const total = totalBeforeTax + cgst + sgst + roundOff;
  
//       const hsnMap = new Map();
//       nonZeroProducts.forEach(product => {
//         const hsn = product.hsnCode;
//         const taxableValue = product.totalAmount;
//         const cgstAmount = taxableValue * 0.09;
//         const sgstAmount = taxableValue * 0.09;
//         const totalTax = cgstAmount + sgstAmount;
        
//         if (hsnMap.has(hsn)) {
//           const existing = hsnMap.get(hsn);
//           existing.taxableValue += taxableValue;
//           existing.cgstAmount += cgstAmount;
//           existing.sgstAmount += sgstAmount;
//           existing.totalTax += totalTax;
//         } else {
//           hsnMap.set(hsn, {
//             hsnCode: hsn,
//             taxableValue: taxableValue,
//             cgstAmount: cgstAmount,
//             sgstAmount: sgstAmount,
//             totalTax: totalTax
//           });
//         }
//       });
  
//       const hsnSummary = Array.from(hsnMap.values());
  
//       const productsPerPage = 8;
//       const pages = [];
//       for (let i = 0; i < nonZeroProducts.length; i += productsPerPage) {
//         pages.push(nonZeroProducts.slice(i, i + productsPerPage));
//       }
  
      // const invoiceHTML = `
      //   <html>
      //   <head>
      //     <title>Invoice - ${reseller?.businessName || 'SSV Alpha Broadband LLP'}</title>
      //     <style>
      //       @page { size: A4; margin: 12mm; }
      //       body { font-family: Arial, sans-serif; color: #000; margin: 0; padding: 0;}
  
      //       @media screen {
      //          body {
      //             margin-left: 100px;
      //             margin-right: 100px;
      //             margin-top: 20px;
      //             margin-bottom: 20px;
      //            }
      //           }
      //          @media print {
      //          body {
      //              margin: 0;
      //              padding: 0;
      //             }
      //             @page {
      //            margin: 12mm;
      //             }
      //           }
      //       .title { text-align: center; font-weight: bold; font-size: 16px; margin: 6px 0; }
      //       .main-border { border: 1px solid #000; width: 100%; border-collapse: collapse; }
      //       .main-border td, .main-border th { border: 1px solid #000; padding: 5px; vertical-align: top; }
      //       .meta-table { width: 100%; border-collapse: collapse; }
      //       .meta-table td { border: 1px solid #000; padding: 6px; vertical-align: top; }
      //       .label { font-weight: bold; }
      //       .right { text-align: right; }
      //       .bold { font-weight: bold; }
      //       .footer-note { font-style: italic; text-align: right; margin-top: 4px; }
      //       .repair-note { color: #666; font-size: 0.9em; }
      //       .free-note { color: green; font-size: 0.9em; }
      //       .invoice-info { 
      //         background-color: #f8f9fa; 
      //         padding: 10px; 
      //         margin: 10px 0; 
      //         border: 1px solid #dee2e6;
      //         border-radius: 4px;
      //       }
      //       .print-button {
      //         display: block;
      //         margin: 20px auto;
      //         padding: 10px 15px;
      //         background-color: #3c8dbc;
      //         color: white;
      //         border: none;
      //         font-size: 16px;
      //         cursor: pointer;
      //         position: sticky;
      //         top: 20px;
      //         z-index: 1000;
      //       }
      //       .print-button:hover {
      //         background-color: #3c8dbc;
      //       }
      //       @media print { 
      //         .page-break { page-break-before: always; } 
      //         .no-print { display: none; }
      //         .print-button { display: none; }
      //       }
      //     </style>
      //   </head>
      //   <body>
      //     <div class="title">Tax Invoice</div>
  
      //     ${pages.map((products, pageIndex) => `
      //       <table class="main-border">
      //         <tr>
      //           <td style="width:50%;">
      //             <div style="border-bottom:1px solid #000; padding-bottom:6px; margin-bottom:6px;">
      //               <div class="bold">SSV Telecom Private Limited FY 22-23</div>
      //               A-1, Landmark CHS, Sector 14<br/>
      //               Vashi, Navi Mumbai<br/>
      //               27ABECS3422Q1ZX<br/>
      //               GSTIN/UIN: 27ABECS3422Q1ZX
      //             </div>
  
      //             <span class="label">Consignee (Ship to)</span><br/>
      //             ${reseller?.businessName || 'SSV Alpha Broadband LLP'}<br/>
      //             ${centersList || 'All Alpha Area'}<br/><br/>
      //             GSTIN/UIN: ${reseller?.gstNumber || '27AEGFS1650E1Z6'}<br/>
      //             State Name : ${reseller?.state || 'Maharashtra'}, Code : 27
      //             <hr/>
  
      //             <span class="label">Buyer (Bill to)</span><br/>
      //             ${reseller?.businessName || 'SSV Alpha Broadband LLP'}<br/>
      //             ${reseller?.address1 || 'A/3, Landmark Soc, Sector-14, Vashi'}<br/>
      //             GSTIN/UIN: ${reseller?.gstNumber || '27AEGFS1650E1Z6'}<br/>
      //             State Name : ${reseller?.state || 'Maharashtra'}, Code : 27
      //           </td>
  
      //           <td style="width:50%; padding:0;">
      //             <table class="meta-table">
      //               <tr>
      //                 <td><span class="label">Invoice No.</span><br/>${invoiceNumber}</td>
      //                 <td><span class="label">Dated</span><br/>${invoiceDate}</td>
      //               </tr>
      //               <tr>
      //                 <td><span class="label">Delivery Note</span><br/>${metaData?.deliveryNote || ''}</td>
      //                 <td><span class="label">Mode/Terms of Payment</span><br/>${metaData?.modeOfPayment || ''}</td>
      //               </tr>
      //               <tr>
      //                 <td><span class="label">Reference No. & Date</span><br/>${metaData?.referenceNo || ''} ${metaData?.referenceDate ? new Date(metaData.referenceDate).toLocaleDateString() : ''}</td>
      //                 <td><span class="label">Other References</span><br/>${metaData?.otherReferences || ''}</td>
      //               </tr>
      //               <tr>
      //                 <td><span class="label">Buyer's Order No.</span><br/>${metaData?.buyerOrderNo || ''}</td>
      //                 <td><span class="label">Dated</span><br/>${metaData?.buyerOrderDate ? new Date(metaData.buyerOrderDate).toLocaleDateString() : ''}</td>
      //               </tr>
      //               <tr>
      //                 <td><span class="label">Dispatch Doc No.</span><br/>${metaData?.dispatchDocNo || '16.07-31.07.25'}</td>
      //                 <td><span class="label">Delivery Note Date</span><br/>${metaData?.deliveryNoteDate ? new Date(metaData.deliveryNoteDate).toLocaleDateString() : ''}</td>
      //               </tr>
      //               <tr>
      //                 <td><span class="label">Dispatched through</span><br/>${metaData?.dispatchedThrough || ''}</td>
      //                 <td><span class="label">Destination</span><br/><b>${metaData?.destination || 'All Alpha Area'}</b></td>
      //               </tr>
      //               <tr>
      //                 <td colspan="2"><span class="label">Terms of Delivery</span><br/>${metaData?.termsOfDelivery || ''}</td>
      //               </tr>
      //             </table>
      //           </td>
      //         </tr>
      //       </table>
  
      //       <table class="main-border" style="margin-top:10px;">
      //         <thead>
      //           <tr>
      //             <th>Sl No.</th>
      //             <th>Description of Goods</th>
      //             <th>HSN/SAC</th>
      //             <th>Quantity</th>
      //             <th>Rate</th>
      //             <th>Per</th>
      //             <th>Amount</th>
      //           </tr>
      //         </thead>
      //         <tbody>
      //           ${products.map((p, i) => {
      //             const productIndex = pageIndex * productsPerPage + i + 1;
      //             let rows = [];
      //             let rowCount = 0;
                  
      //             if (p.outletQty > 0) {
      //               rows.push(`
      //                 <tr>
      //                   <td${rowCount > 0 ? ' rowspan="' + rowCount + '"' : ''}>${productIndex}</td>
      //                   <td>${p.productTitle}</td>
      //                   <td>${p.hsnCode}</td>
      //                   <td class="right">${p.outletQty}</td>
      //                   <td class="right">${p.outletRate.toFixed(2)}</td>
      //                   <td>${p.unit}</td>
      //                   <td class="right">${p.outletAmount.toFixed(2)}</td>
      //                 </tr>
      //               `);
      //               rowCount++;
      //             }
                  
      //             if (p.damageRepairQty > 0) {
      //               rows.push(`
      //                 <tr>
      //                   <td${rowCount === 0 ? ' rowspan="' + (rowCount + 1) + '"' : ''}></td>
      //                   <td>${p.productTitle} <span class="repair-note">(Damage Repair - Charged @₹${p.repairRate}/unit)</span></td>
      //                   <td>${p.hsnCode}</td>
      //                   <td class="right">${p.damageRepairQty}</td>
      //                   <td class="right">${p.repairRate.toFixed(2)}</td>
      //                   <td>${p.unit}</td>
      //                   <td class="right">${p.damageRepairAmount.toFixed(2)}</td>
      //                 </tr>
      //               `);
      //               rowCount++;
      //             }
                  
      //             if (p.centerReturnQty > 0) {
      //               rows.push(`
      //                 <tr>
      //                   <td${rowCount === 0 ? ' rowspan="' + (rowCount + 1) + '"' : ''}></td>
      //                   <td>${p.productTitle} <span class="free-note">(Center Return - Free)</span></td>
      //                   <td>${p.hsnCode}</td>
      //                   <td class="right">${p.centerReturnQty}</td>
      //                   <td class="right">${p.centerReturnRate.toFixed(2)}</td>
      //                   <td>${p.unit}</td>
      //                   <td class="right">${p.centerReturnAmount.toFixed(2)}</td>
      //                 </tr>
      //               `);
      //               rowCount++;
      //             }
                  
      //             return rows.join('');
      //           }).join('')}
      //           ${pageIndex === pages.length - 1 ? `
      //           <tr>
      //             <td colspan="4" rowspan="7"></td>
      //             <td colspan="2"><b>Subtotal (New Stock from Outlet)</b></td>
      //             <td class="right">${totalOutletAmount.toFixed(2)}</td>
      //           </tr>
      //           <tr>
      //             <td colspan="2"><b>Subtotal (Damage Repair)</b></td>
      //             <td class="right">${totalDamageRepairAmount.toFixed(2)}</td>
      //           </tr>
      //           <tr>
      //             <td colspan="2"><b>Total Before Tax</b></td>
      //             <td class="right">${totalBeforeTax.toFixed(2)}</td>
      //           </tr>
      //           <tr><td colspan="2"><b>Output CGST @9%</b></td><td class="right">${cgst.toFixed(2)}</td></tr>
      //           <tr><td colspan="2"><b>Output SGST @9%</b></td><td class="right">${sgst.toFixed(2)}</td></tr>
      //           <tr><td colspan="2"><b>Round Off</b></td><td class="right">${roundOff.toFixed(2)}</td></tr>
      //           <tr><td colspan="2"><b>Total</b></td><td class="right">${total.toFixed(2)}</td></tr>
      //           <tr><td colspan="7"><b>Amount Chargeable (in words):</b><i>${numToWords(total)}</i></td></tr>` : ''}
      //         </tbody>
      //       </table>
      //       ${pageIndex < pages.length - 1 ? '<div class="footer-note">continued ...</div><div class="page-break"></div>' : ''}
      //     `).join('')}
  
      //     <!-- Tax Summary Page -->
      //     <div class="page-break"></div>
  
      //     <div class="analysis-header" style="display:flex; justify-content:space-between; margin-top:10px;">
      //       <div>Invoice No. <strong>${invoiceNumber}</strong></div>
      //       <div>Dated <strong>${invoiceDate}</strong></div>
      //     </div>
  
      //     <div style="text-align:center;">
      //       <p><strong>SSV Telecom Private Limited</strong><br/>
      //         A-1, Landmark CHS, Sector 14<br/>
      //         Vashi , Navi Mumbai<br/>
      //         27ABECS3422Q1ZX<br/>
      //         GSTIN/UIN: 27ABECS3422Q1ZX<br/><br/>
      //         Party: <strong>SSV Telecom Private Limited</strong><br/>
      //         A/3, Landmark Soc, Sector-14 , Vashi<br/>
      //         Navi Mumbai<br/>
      //         GSTIN/UIN : 27AEGFS1650E1Z6<br/>
      //         State Name : Maharashtra, Code : 27
      //       </p>
      //     </div>
  
      //     <table class="main-border" style="margin-top:10px;">
      //       <thead>
      //         <tr>
      //           <th>HSN/SAC</th>
      //           <th>Taxable Value</th>
      //           <th colspan="2">CGST</th>
      //           <th colspan="2">SGST</th>
      //           <th>Total Tax Amount</th>
      //         </tr>
      //         <tr>
      //           <th></th>
      //           <th></th>
      //           <th>Rate</th>
      //           <th>Amount</th>
      //           <th>Rate</th>
      //           <th>Amount</th>
      //           <th></th>
      //         </tr>
      //       </thead>
      //       <tbody>
      //         ${hsnSummary.map(hsn => `
      //           <tr>
      //             <td>${hsn.hsnCode}</td>
      //             <td class="right">${hsn.taxableValue.toFixed(2)}</td>
      //             <td>9%</td>
      //             <td class="right">${hsn.cgstAmount.toFixed(2)}</td>
      //             <td>9%</td>
      //             <td class="right">${hsn.sgstAmount.toFixed(2)}</td>
      //             <td class="right">${hsn.totalTax.toFixed(2)}</td>
      //           </tr>`).join('')}
      //          <tr class="bold">
      //           <td><b>Total</b></td>
      //           <td class="right">${totalBeforeTax.toFixed(2)}</td>
      //           <td></td>
      //           <td class="right">${cgst.toFixed(2)}</td>
      //           <td></td>
      //           <td class="right">${sgst.toFixed(2)}</td>
      //           <td class="right">${(cgst + sgst).toFixed(2)}</td>
      //         </tr>
      //          <tr>
      //        <td colspan="7"><b>Taxable Amount (in words):</b> <i>${numToWords(parseFloat((cgst + sgst).toFixed(2)))}
      //       </i></td>
      //        </tr>
      //       </tbody>
      //     </table>
      //       <button class="print-button no-print" onclick="window.print()">🖨️ Print</button>
          
      //   </body>
      //   </html>
      // `;
  
//       const invoiceData = {
//         resellerId: reseller?._id,
//         centers: allCenters,
//         products: nonZeroProducts,
//         totalOutletAmount,
//         totalDamageRepairAmount,
//         totalCenterReturnAmount,
//         totalBeforeTax,
//         cgst,
//         sgst,
//         roundOff,
//         total,
//         hsnSummary,
//         metadata: {
//           deliveryNote: metaData?.deliveryNote || '',
//           modeOfPayment: metaData?.modeOfPayment || '',
//           referenceNo: metaData?.referenceNo || '',
//           referenceDate: metaData?.referenceDate || null,
//           otherReferences: metaData?.otherReferences || '',
//           buyerOrderNo: metaData?.buyerOrderNo || '',
//           buyerOrderDate: metaData?.buyerOrderDate || null,
//           dispatchDocNo: metaData?.dispatchDocNo || '',
//           deliveryNoteDate: metaData?.deliveryNoteDate || null,
//           dispatchedThrough: metaData?.dispatchedThrough || '',
//           destination: metaData?.destination || centersList || 'All Alpha Area',
//           termsOfDelivery: metaData?.termsOfDelivery || ''
//         },
//         invoiceHtml: invoiceHTML
//       };
  
//       let saveSuccess = false;
//       try {
//         const invoicedResponse = await markAsInvoiced(
//           selectedChallans, 
//           invoiceNumber, 
//           new Date().toISOString(), 
//           invoiceData
//         );
        
//         if (invoicedResponse.success) {
//           console.log('Successfully saved invoice to database:', invoicedResponse.message);
//           saveSuccess = true;
//         } else {
//           throw new Error(invoicedResponse.message || 'Failed to save invoice');
//         }
//       } catch (saveError) {
//         console.error('Error saving invoice to database:', saveError);
//       }
      
//       invoiceWindow = window.open('', '_blank');
//       if (invoiceWindow) {
//         invoiceWindow.document.write(invoiceHTML);
//         invoiceWindow.document.close();
//       } else {
//         throw new Error('Could not open invoice window. Please allow popups.');
//       }
  
//       fetchData(activeSearch, currentPage);
      
//       setSelectedChallans([]);
      
//       if (saveSuccess) {
//         if (activeTab === 'invoices') {
//           fetchInvoices(invoiceSearch, invoiceCurrentPage);
//         }
//       } else {
//         alert(`Invoice ${invoiceNumber} generated but could not be saved to database. Please contact administrator.`);
//       }
  
//     } catch (error) {
//       console.error('Error generating invoice:', error);
      
//       if (invoiceWindow && invoiceWindow.document) {
//         invoiceWindow.document.write(`
//           <html>
//           <body>
//             <h2>Error Generating Invoice</h2>
//             <p>${error.message || 'Unknown error occurred'}</p>
//             <button onclick="window.close()">Close</button>
//           </body>
//           </html>
//         `);
//         invoiceWindow.document.close();
//       }
      
//       alert('Error generating invoice: ' + (error.message || 'Please try again'));
//     }
//   };

  
//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     if (tab === 'invoices') {
//       fetchInvoices();
//     } else {
//       fetchData();
//     }
//     setActiveSearch({ 
//       keyword: '', 
//       center: '', 
//       reseller: '',
//       status: 'Completed',
//       startDate: '',
//       endDate: '',
//     });
//     setInvoiceSearch({
//       invoiceNumber: '',
//       reseller: '',
//       startDate: '',
//       endDate: '',
//     });
//     setSearchTerm('');
//     setInvoiceSearchTerm('');
//     setSelectedChallans([]);
//   };

//   const handleViewInvoiceDetails = (invoice) => {
//     setSelectedInvoiceForDetails(invoice);
//     setInvoiceDetailsModalVisible(true);
//   };

//   if (loading && activeTab === 'stockRequests') {
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
  
//   const renderStockRequestTable = () => (
//     <div className="responsive-table-wrapper">
//       <CTable striped bordered hover className='responsive-table'>
//         <CTableHead>
//           <CTableRow>
//             <CTableHeaderCell scope="col">
//               <input
//                 type="checkbox"
//                 checked={selectedChallans.length === filteredCustomers.filter(c => !c.invoiceInfo?.invoiceRaised).length && filteredCustomers.filter(c => !c.invoiceInfo?.invoiceRaised).length > 0}
//                 onChange={handleSelectAll}
//               />
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
//               Order Date {getSortIcon('date')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('orderNumber')} className="sortable-header">
//               Order Number {getSortIcon('orderNumber')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('challanNo')} className="sortable-header">
//               Challan No {getSortIcon('challanNo')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('challanDate')} className="sortable-header">
//               Challan Date {getSortIcon('challanDate')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('warehouse.centerName')} className="sortable-header">
//               Warehouse {getSortIcon('warehouse.centerName')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
//               Branch {getSortIcon('center.centerName')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('createdBy.email')} className="sortable-header">
//               Posted By {getSortIcon('createdBy.email')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col" onClick={() => handleSort('completionInfo.completedOn')} className="sortable-header">
//               Completed At {getSortIcon('completionInfo.completedOn')}
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col">
//               Actions
//             </CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {filteredCustomers.length > 0 ? (
//             filteredCustomers.map((item) => {
//               const isInvoiceRaised = item.invoiceInfo?.invoiceRaised;
              
//               return (
//                 <CTableRow 
//                   key={item._id}
//                   className={isInvoiceRaised ? 'invoice-generated-row' : ''}
//                 >
//                   <CTableDataCell>
//                     {!isInvoiceRaised && (
//                       <input
//                         type="checkbox"
//                         checked={selectedChallans.includes(item._id)}
//                         onChange={() => handleSelectChallan(item._id)}
//                       />
//                     )}
//                   </CTableDataCell>
//                   <CTableDataCell>{formatDate(item.date)}</CTableDataCell>
//                   <CTableDataCell>
//                     <button 
//                       className="btn btn-link p-0 text-decoration-none"
//                       onClick={() => handleClick(item._id)}
//                       style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
//                     >
//                       {item.orderNumber}
//                     </button>
//                     {isInvoiceRaised && (
//                       <div className="invoice-badge">
//                         <small className="text-muted">Invoice: {item.invoiceInfo?.invoiceNumber}</small>
//                       </div>
//                     )}
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <strong>{item.challanNo || 'N/A'}</strong>
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     {item.challanDate ? formatDate(item.challanDate) : 'N/A'}
//                   </CTableDataCell>
//                   <CTableDataCell>{item.warehouse?.centerName || ''}</CTableDataCell>
//                   <CTableDataCell>{item.center?.centerName || 'N/A'}</CTableDataCell>
//                   <CTableDataCell>
//                     {item.createdBy?.email || 'N/A'} 
//                     {item.createdAt && ` At ${new Date(item.createdAt).toLocaleTimeString('en-US', { 
//                       hour: 'numeric', 
//                       minute: 'numeric',
//                       hour12: true 
//                     })}`}
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     {item.completionInfo?.completedOn ? formatDateTime(item.completionInfo.completedOn) : 'N/A'}
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <div className="d-flex gap-1">
//                       <div
//                         className="dropdown-container"
//                         ref={el => dropdownRefs.current[item._id] = el}
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <CButton
//                           size="sm"
//                           className='option-button btn-sm'
//                           onClick={() => handleGenerateChallan(item)}
//                         >
//                           <CIcon icon={cilFile} />
//                          Challan
//                         </CButton>
//                       </div>
//                     </div>
//                   </CTableDataCell>
//                 </CTableRow>
//               );
//             })
//           ) : (
//             <CTableRow>
//               <CTableDataCell colSpan="10" className="text-center">
//                 No completed stock requests found for invoice generation
//               </CTableDataCell>
//             </CTableRow>
//           )}
//         </CTableBody>
//       </CTable>
//     </div>
//   );

//   // const renderInvoiceTable = () => (
//   //   <div className="responsive-table-wrapper">
//   //     <CTable striped bordered hover className='responsive-table'>
//   //       <CTableHead>
//   //         <CTableRow>
//   //           <CTableHeaderCell scope="col">
//   //             Invoice Number
//   //           </CTableHeaderCell>
//   //           <CTableHeaderCell scope="col">
//   //             Invoice Date
//   //           </CTableHeaderCell>
//   //           <CTableHeaderCell scope="col">
//   //             Reseller
//   //           </CTableHeaderCell>
//   //           <CTableHeaderCell scope="col">
//   //             Total Amount
//   //           </CTableHeaderCell>
//   //           <CTableHeaderCell scope="col">
//   //             Status
//   //           </CTableHeaderCell>
//   //           <CTableHeaderCell scope="col">
//   //             Created At
//   //           </CTableHeaderCell>
//   //           <CTableHeaderCell scope="col">
//   //             Actions
//   //           </CTableHeaderCell>
//   //         </CTableRow>
//   //       </CTableHead>
//   //       <CTableBody>
//   //         {invoiceLoading ? (
//   //           <CTableRow>
//   //             <CTableDataCell colSpan="9" className="text-center">
//   //               <CSpinner size="sm" /> Loading invoices...
//   //             </CTableDataCell>
//   //           </CTableRow>
//   //         ) : filteredInvoices.length > 0 ? (
//   //           filteredInvoices.map((invoice) => (
//   //             <CTableRow key={invoice._id}>
//   //               <CTableDataCell>
//   //                 <strong>{invoice.invoiceNumber}</strong>
//   //                 {invoice.stockRequestIds && invoice.stockRequestIds.length > 0 && (
//   //                   <div className="text-muted small">
//   //                     Stock Requests: {invoice.stockRequestIds.length}
//   //                   </div>
//   //                 )}
//   //               </CTableDataCell>
//   //               <CTableDataCell>
//   //                 {invoice.invoiceDate ? formatDate(invoice.invoiceDate) : 'N/A'}
//   //               </CTableDataCell>
//   //               <CTableDataCell>
//   //                 {invoice.reseller?.businessName || 'N/A'}
//   //               </CTableDataCell>
//   //               <CTableDataCell className="text-end">
//   //                 ₹{invoice.totalOutletAmount?.toFixed(2) || '0.00'}
//   //               </CTableDataCell>
//   //               <CTableDataCell>
//   //                 <CBadge color="success">
//   //                   {invoice.status || 'Generated'}
//   //                 </CBadge>
//   //               </CTableDataCell>
//   //               <CTableDataCell>
//   //                 {invoice.createdAt ? formatDateTime(invoice.createdAt) : 'N/A'}
//   //               </CTableDataCell>
//   //               <CTableDataCell>
//   //                 <div className="d-flex gap-1">
//   //                   <CButton
//   //                     size="sm"
//   //                     className='option-button btn-sm'
//   //                     onClick={(event) => handleMenuClick(event, invoice._id)}
//   //                     disabled={invoice.cancelled}
//   //                   >
//   //                     <CIcon icon={cilSettings} />
//   //                     Options
//   //                   </CButton>
                    
//   //                   <Menu
//   //                     id={`invoice-menu-${invoice._id}`}
//   //                     anchorEl={anchorEl}
//   //                     open={menuId === invoice._id}
//   //                     onClose={handleCloseMenu}
//   //                   >
//   //                     <MenuItem onClick={() => handleDownloadInvoice(invoice)}>
//   //                       <CIcon icon={cilCloudDownload} className="me-2" /> Download PDF
//   //                     </MenuItem>
//   //                     <MenuItem onClick={() => {
//   //                              handleCloseMenu();
//   //                              setSelectedInvoiceForCancel(invoice);
//   //                              setCancelModalVisible(true);
//   //                     }}>
//   //                       <CIcon icon={cilBan} className="me-2" /> Cancel Invoice
//   //                     </MenuItem>
//   //                   </Menu>
//   //                 </div>
//   //               </CTableDataCell>
//   //             </CTableRow>
//   //           ))
//   //         ) : (
//   //           <CTableRow>
//   //             <CTableDataCell colSpan="9" className="text-center">
//   //               {invoices.length === 0 
//   //                 ? 'No invoices found. Generate invoices from the Stock Requests tab.'
//   //                 : 'No invoices match your search criteria.'}
//   //             </CTableDataCell>
//   //           </CTableRow>
//   //         )}
//   //       </CTableBody>
//   //     </CTable>
//   //   </div>
//   // );


//   const renderInvoiceTable = () => (
//     <div className="responsive-table-wrapper">
//       <CTable striped bordered hover className='responsive-table'>
//         <CTableHead>
//           <CTableRow>
//             <CTableHeaderCell scope="col">
//               Invoice Number
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col">
//               Invoice Date
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col">
//               Reseller
//             </CTableHeaderCell>
//            {/* <CTableHeaderCell scope="col">
//               Total Amount
//             </CTableHeaderCell> */}
//             <CTableHeaderCell scope="col">
//               Status
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col">
//               Created At
//             </CTableHeaderCell>
//             <CTableHeaderCell scope="col">
//               Actions
//             </CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {invoiceLoading ? (
//             <CTableRow>
//               <CTableDataCell colSpan="7" className="text-center">
//                 <CSpinner size="sm" /> Loading invoices...
//               </CTableDataCell>
//             </CTableRow>
//           ) : filteredInvoices.length > 0 ? (
//             filteredInvoices.map((invoice) => {
//               const isCancelled = invoice.status === 'cancelled';
              
//               return (
//                 <CTableRow 
//                   key={invoice._id}
//                   className={isCancelled ? 'invoice-cancelled-row' : ''}
//                 >
//                   <CTableDataCell>
//                     {/* <strong className={isCancelled ? 'invoice-number' : ''}>
//                       {invoice.invoiceNumber}
//                     </strong>
//                     {invoice.stockRequestIds && invoice.stockRequestIds.length > 0 && (
//                       <div className="text-muted small">
//                         Stock Requests: {invoice.stockRequestIds.length}
//                       </div>
//                     )} */}
//                     <button 
//                     className="btn btn-link p-0 text-decoration-none"
//                     onClick={() => handleViewInvoiceDetails(invoice)}
//                     style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
//                   >
//                     {invoice.invoiceNumber}
//                   </button>
//                   {invoice.stockRequestIds && invoice.stockRequestIds.length > 0 && (
//                       <div className="text-muted small">
//                         Stock Requests: {invoice.stockRequestIds.length}
//                       </div>
//                     )}
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     {invoice.invoiceDate ? formatDate(invoice.invoiceDate) : 'N/A'}
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     {invoice.reseller?.businessName || 'N/A'}
//                   </CTableDataCell>
//                   {/*  <CTableDataCell className="text-end">
//                     ₹{invoice.totalAmount?.toFixed(2) || '0.00'}
//                   </CTableDataCell> */}
//                   <CTableDataCell>
//                     {isCancelled ? (
//                       <CBadge color="danger" className="badge-cancelled">
//                         Cancelled
//                       </CBadge>
//                     ) : (
//                       <CBadge color="success" className="badge-generated">
//                         {invoice.status || 'Generated'}
//                       </CBadge>
//                     )}
//                     {isCancelled && invoice.cancellationDetails && (
//                       <div className="text-muted small mt-1">
//                         <strong>Reason:</strong> {invoice.cancellationDetails.cancelReason}
//                         <br />
//                         <small>Cancelled on: {formatDate(invoice.cancellationDetails.cancelledAt)}</small>
//                       </div>
//                     )}
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     {invoice.createdAt ? formatDateTime(invoice.createdAt) : 'N/A'}
//                   </CTableDataCell>
//                   <CTableDataCell>
//                     <div className="d-flex gap-1">
//                       <CButton
//                         size="sm"
//                         className='option-button btn-sm'
//                         onClick={(event) => handleMenuClick(event, invoice._id)}
//                       >
//                         <CIcon icon={cilSettings} />
//                         Options
//                       </CButton>
                      
//                       <Menu
//                         id={`invoice-menu-${invoice._id}`}
//                         anchorEl={anchorEl}
//                         open={menuId === invoice._id}
//                         onClose={handleCloseMenu}
//                       >
//                         <MenuItem onClick={() => handleDownloadInvoice(invoice)}>
//                           <CIcon icon={cilCloudDownload} className="me-2" /> Download PDF
//                         </MenuItem>

//                         {!isCancelled && (
//                           <MenuItem onClick={() => {
//                             handleCloseMenu();
//                             setSelectedInvoiceForCancel(invoice);
//                             setCancelModalVisible(true);
//                           }}>
//                             <CIcon icon={cilBan} className="me-2" /> Cancel Invoice
//                           </MenuItem>
//                        )} 
//                       </Menu>
//                     </div>
//                   </CTableDataCell>
//                 </CTableRow>
//               );
//             })
//           ) : (
//             <CTableRow>
//               <CTableDataCell colSpan="7" className="text-center">
//                 {invoices.length === 0 
//                   ? 'No invoices found. Generate invoices from the Stock Requests tab.'
//                   : 'No invoices match your search criteria.'}
//               </CTableDataCell>
//             </CTableRow>
//           )}
//         </CTableBody>
//       </CTable>
//     </div>
//   );

//   return (
//     <div>
//       <div className='title'>Sale Invoices</div>
//       {alertVisible && (
//       <CAlert 
//         color={alertColor} 
//         className="d-flex align-items-center mt-2"
//         dismissible
//         onClose={() => setAlertVisible(false)}
//       >
//         <CIcon 
//           icon={alertColor === 'success' ? cilCheck : cilWarning} 
//           className="me-2" 
//         />
//         {alertMessage}
//       </CAlert>
//     )}
//       <SearchSaleInvoice
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={activeTab === 'stockRequests' ? handleSearch : handleInvoiceSearch}
//         centers={centers}
//         resellers={resellers}
//         defaultStatus="Completed" 
//         isInvoiceTab={activeTab === 'invoices'}
//       />

//       <ChallanModal
//         visible={showChallanModal}
//         onClose={() => setShowChallanModal(false)}
//         data={selectedChallan}
//       />

//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             <CNav variant="tabs" className="mb-0 border-bottom-0">
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 'stockRequests'}
//                   onClick={() => handleTabChange('stockRequests')}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 'stockRequests' ? '4px solid #2759a2' : '3px solid transparent',
//                     color:'black',
//                     borderBottom: 'none'
//                   }}
//                 >
//                   Stock Requests
//                 </CNavLink>
//               </CNavItem>
//               <CNavItem>
//                 <CNavLink
//                   active={activeTab === 'invoices'}
//                   onClick={() => handleTabChange('invoices')}
//                   style={{ 
//                     cursor: 'pointer',
//                     borderTop: activeTab === 'invoices' ? '4px solid #2759a2' : '3px solid transparent',
//                     color:'black',
//                     borderBottom: 'none'
//                   }}
//                 >
//                   Invoices
//                 </CNavLink>
//               </CNavItem>
//             </CNav>
//           </div>
          
//           <div>
//             <Pagination
//               currentPage={activeTab === 'stockRequests' ? currentPage : invoiceCurrentPage}
//               totalPages={activeTab === 'stockRequests' ? totalPages : invoiceTotalPages}
//               onPageChange={activeTab === 'stockRequests' ? handlePageChange : handleInvoicePageChange}
//             />
//           </div>
//         </CCardHeader>
        
//         <CCardBody>
//           <CTabContent>
//             <CTabPane visible={activeTab === 'stockRequests'}>
//               <div className="d-flex justify-content-between mb-3">
//                 <div>
//                   <CButton 
//                     size="sm" 
//                     className="action-btn me-1"
//                     onClick={() => setSearchModalVisible(true)}
//                   >
//                     <CIcon icon={cilSearch} className='icon' /> Search
//                   </CButton>
//                   {(activeSearch.reseller || activeSearch.center || activeSearch.startDate || activeSearch.endDate) && (
//                     <CButton 
//                       size="sm" 
//                       color="secondary" 
//                       className="action-btn me-1"
//                       onClick={handleResetSearch}
//                     >
//                       <CIcon icon={cilZoomOut} className='icon' />Reset Search
//                     </CButton>
//                   )}
//                   {(activeSearch.reseller || activeSearch.startDate || activeSearch.endDate || activeSearch.center) && selectedChallans.length > 0 && (
//                     <CButton 
//                       size="sm"
//                       className="action-btn me-2"
//                       onClick={handleGenerateInvoice}
//                     >
//                       <CIcon icon={cilFile} className="me-1" />
//                       Generate Invoice
//                     </CButton>
//                   )}
//                 </div>
                
//                 <div className='d-flex'>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     disabled={!!(activeSearch.keyword || activeSearch.center || activeSearch.outlet)} 
//                     placeholder={activeSearch.keyword || activeSearch.center || activeSearch.outlet ? "Disabled during advanced search" : ""}
//                   />
//                 </div>
//               </div>

//               {renderStockRequestTable()}
//             </CTabPane>
            
//             <CTabPane visible={activeTab === 'invoices'}>
//               <div className="d-flex justify-content-between mb-3">
//                 <div>
//                   <CButton 
//                     size="sm" 
//                     className="action-btn me-1"
//                     onClick={() => setSearchModalVisible(true)}
//                   >
//                     <CIcon icon={cilSearch} className='icon' /> Search
//                   </CButton>
//                   {(invoiceSearch.invoiceNumber || invoiceSearch.reseller || invoiceSearch.startDate || invoiceSearch.endDate) && (
//                     <CButton 
//                       size="sm" 
//                       color="secondary" 
//                       className="action-btn me-1"
//                       onClick={handleResetInvoiceSearch}
//                     >
//                       <CIcon icon={cilZoomOut} className='icon' />Reset Search
//                     </CButton>
//                   )}
//                 </div>
                
//                 <div className='d-flex'>
//                   <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
//                   <CFormInput
//                     type="text"
//                     style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
//                     className="d-inline-block square-search"
//                     value={invoiceSearchTerm}
//                     onChange={(e) => setInvoiceSearchTerm(e.target.value)}
//                     disabled={!!(invoiceSearch.invoiceNumber || invoiceSearch.reseller)} 
//                     // placeholder={invoiceSearch.invoiceNumber || invoiceSearch.reseller ? "Disabled during advanced search" : "Search by invoice number or reseller..."}
//                   />
//                 </div>
//               </div>

//               {renderInvoiceTable()}
//             </CTabPane>
//           </CTabContent>
//         </CCardBody>
//       </CCard>
//     <CancelInvoiceModal
//   visible={cancelModalVisible}
//   onClose={() => {
//     setCancelModalVisible(false);
//     setSelectedInvoiceForCancel(null);
//   }}
//   onConfirm={handleCancelInvoice}
//   invoice={selectedInvoiceForCancel}
// />

// <InvoiceDetailsModal
//   visible={invoiceDetailsModalVisible}
//   onClose={() => {
//     setInvoiceDetailsModalVisible(false);
//     setSelectedInvoiceForDetails(null);
//   }}
//   invoice={selectedInvoiceForDetails}
//   onDownload={handleDownloadInvoice}
// />
//     </div>
//   );
// };

// export default SaleInvoices;




////************************   with report   ************************************ */




import '../../css/table.css';
import '../../css/form.css';
import '../../css/profile.css';
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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CBadge
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilZoomOut, cilFile, cilCloudDownload, cilBan, cilSettings } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';
import Pagination from 'src/utils/Pagination';
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
import ChallanModal from '../stockRequest/ChallanModal';
import { Menu, MenuItem } from '@mui/material';
import SearchSaleInvoice from './SearchSaleInvoice'; 
import InvoiceSearch from './InvoiceSearch';
import { numToWords } from 'src/utils/NumToWords';
import html2pdf from 'html2pdf.js';
import CancelInvoiceModal from './CancelInvoiceModal';
import InvoiceDetailsModal from './InvoiceDetailsModal';
import {
  CAlert
} from '@coreui/react';
import { cilCheck, cilWarning } from '@coreui/icons';
import { exportToCSV } from 'src/utils/ExportToCSV';

const SaleInvoices = () => {
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [centers, setCenters] = useState([]);
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [invoiceSearchModalVisible, setInvoiceSearchModalVisible] = useState(false);
  const [selectedChallans, setSelectedChallans] = useState([]);
  const [activeTab, setActiveTab] = useState('stockRequests'); 
  const [activeSearch, setActiveSearch] = useState({ 
    keyword: '', 
    center: '', 
    reseller: '',
    status: 'Completed',
    startDate: '',
    endDate: '',
  });

  const [invoiceSearch, setInvoiceSearch] = useState({
    invoiceNumber: '',
    reseller: '',
    center: '',
    startDate: '',
    endDate: '',
    status: '',
    cancelWithCreditNote: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [invoiceCurrentPage, setInvoiceCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [invoiceTotalPages, setInvoiceTotalPages] = useState(1);
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [invoiceMetaData, setInvoiceMetaData] = useState(null);

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedInvoiceForCancel, setSelectedInvoiceForCancel] = useState(null);
  const [invoiceDetailsModalVisible, setInvoiceDetailsModalVisible] = useState(false);
  const [selectedInvoiceForDetails, setSelectedInvoiceForDetails] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('success');

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const dropdownRefs = useRef({});
  const navigate = useNavigate();

  const showAlert = (message, color = 'success') => {
    setAlertMessage(message);
    setAlertColor(color);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  const fetchData = async (searchParams = {}, page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('status', 'Completed');
      if (searchParams.center) {
        params.append('center', searchParams.center);
      }
      if (searchParams.reseller) {
        params.append('reseller', searchParams.reseller);
      }
      if (searchParams.startDate) {
        params.append('startDate', searchParams.startDate);
      }
      if (searchParams.endDate) {
        params.append('endDate', searchParams.endDate);
      }
      params.append('page', page);
      
      const url = `/stockrequest?${params.toString()}`;
      console.log('API URL:', url);
      
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setCustomers(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
        console.log('Fetched data:', response.data.data.length, 'items');
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async (searchParams = {}, page = 1) => {
    try {
      setInvoiceLoading(true);
      const params = new URLSearchParams();
      
      if (searchParams.invoiceNumber) {
        params.append('invoiceNumber', searchParams.invoiceNumber);
      }
      if (searchParams.reseller) {
        params.append('resellerId', searchParams.reseller);
      }
      if (searchParams.center) {
        params.append('center', searchParams.center);
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
      if (searchParams.cancelWithCreditNote) {
        params.append('cancelWithCreditNote', searchParams.cancelWithCreditNote);
      }
      
      params.append('page', page);
      
      const url = `/invoice?${params.toString()}`;
      console.log('Fetching invoices URL:', url);
      
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        setInvoices(response.data.data || []);
        setInvoiceCurrentPage(response.data.pagination?.currentPage || 1);
        setInvoiceTotalPages(response.data.pagination?.totalPages || 1);
        console.log('Fetched invoices:', response.data.data?.length || 0, 'items');
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setInvoices([]);
      showAlert('Error fetching invoices: ' + (err.message || 'Please try again'), 'danger');
    } finally {
      setInvoiceLoading(false);
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

  const fetchResellers = async () => {
    try {
      const response = await axiosInstance.get('/resellers');
      if (response.data.success) {
        setResellers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchRepairCosts = async (productIds) => {
    try {
      const response = await axiosInstance.get('/repaired-cost');
      if (response.data.success) {
        const repairCostMap = new Map();
        response.data.data.forEach(item => {
          if (item.product && item.product._id) {
            repairCostMap.set(item.product._id, item.repairCost);
          }
        });
        return repairCostMap;
      }
      return new Map();
    } catch (error) {
      console.error('Error fetching repair costs:', error);
      return new Map();
    }
  };  
  
  const markAsInvoiced = async (stockRequestIds, invoiceNumber, invoiceDate, invoiceData) => {
    try {
      const cleanInvoiceData = {
        resellerId: invoiceData.resellerId,
        centers: invoiceData.centers,
        products: invoiceData.products.map(p => ({
          productId: p.productId,
          productTitle: p.productTitle,
          hsnCode: p.hsnCode,
          quantity: p.quantity,
          outletQty: p.outletQty,
          damageRepairQty: p.damageRepairQty,
          centerReturnQty: p.centerReturnQty,
          outletRate: p.outletRate,
          repairRate: p.repairRate,
          centerReturnRate: p.centerReturnRate,
          outletAmount: p.outletAmount,
          damageRepairAmount: p.damageRepairAmount,
          centerReturnAmount: p.centerReturnAmount,
          totalAmount: p.totalAmount,
          unit: p.unit
        })),
        totalOutletAmount: invoiceData.totalOutletAmount,
        totalDamageRepairAmount: invoiceData.totalDamageRepairAmount,
        totalCenterReturnAmount: invoiceData.totalCenterReturnAmount,
        totalBeforeTax: invoiceData.totalBeforeTax,
        cgst: invoiceData.cgst,
        sgst: invoiceData.sgst,
        roundOff: invoiceData.roundOff,
        totalAmount: invoiceData.total,
        hsnSummary: invoiceData.hsnSummary.map(h => ({
          hsnCode: h.hsnCode,
          taxableValue: h.taxableValue,
          cgstAmount: h.cgstAmount,
          sgstAmount: h.sgstAmount,
          totalTax: h.totalTax
        })),
        metadata: invoiceData.metadata || {},
        invoiceHtml: invoiceData.invoiceHtml
      };

      const response = await axiosInstance.post('/invoice/mark-invoiced', {
        stockRequestIds,
        invoiceNumber,
        invoiceDate: invoiceDate || new Date().toISOString(),
        invoiceData: cleanInvoiceData
      });
      
      if (response.data.success) {
        console.log('Invoice saved to database:', response.data);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to mark as invoiced');
      }
    } catch (error) {
      console.error('Error marking as invoiced:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  };
  
  const handleCancelInvoice = async (cancelData) => {
    try {
      if (!selectedInvoiceForCancel) return;
  
      const response = await axiosInstance.put(`/invoice/${selectedInvoiceForCancel._id}/cancel`, {
        cancelReason: cancelData.cancelReason,
        cancelWithCreditNote: cancelData.cancelWithCreditNote
      });
  
      if (response.data.success) {
        showAlert(response.data.message, 'success');
        fetchInvoices(invoiceSearch, invoiceCurrentPage);
        setCancelModalVisible(false);
        setSelectedInvoiceForCancel(null);
      } else {
        throw new Error(response.data.message || 'Failed to cancel invoice');
      }
    } catch (error) {
      console.error('Error cancelling invoice:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel invoice';
      showAlert(errorMessage, 'danger');
      throw error;
    }
  };

  const handleDownloadInvoice = async (invoice) => {
    try {
      if (!invoice.invoiceHtml) {
        alert('Invoice HTML not available for download');
        return;
      }

      const originalButtonText = document.activeElement.innerHTML;
      document.activeElement.innerHTML = '<span>Downloading PDF...</span>';
      document.activeElement.disabled = true;

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = invoice.invoiceHtml;
      
      const scripts = tempDiv.getElementsByTagName('script');
      for (let script of scripts) {
        if (script.textContent.includes('window.print()')) {
          script.remove();
        }
      }

      const opt = {
        margin: [12, 12, 12, 12],
        filename: `Invoice_${invoice.invoiceNumber.replace(/\//g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(tempDiv).save();
      document.activeElement.innerHTML = originalButtonText;
      document.activeElement.disabled = false;

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error downloading PDF: ' + error.message);
      if (invoice.invoiceHtml) {
        const blob = new Blob([invoice.invoiceHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${invoice.invoiceNumber.replace(/\//g, '_')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
  };

  // const handleExportInvoices = async () => {
  //   try {
  //     setInvoiceLoading(true);
      
  //     // Build search params from current filters
  //     const params = new URLSearchParams();
      
  //     if (invoiceSearch.invoiceNumber) {
  //       params.append('invoiceNumber', invoiceSearch.invoiceNumber);
  //     }
  //     if (invoiceSearch.reseller) {
  //       params.append('resellerId', invoiceSearch.reseller);
  //     }
  //     if (invoiceSearch.center) {
  //       params.append('center', invoiceSearch.center);
  //     }
  //     if (invoiceSearch.startDate) {
  //       params.append('startDate', invoiceSearch.startDate);
  //     }
  //     if (invoiceSearch.endDate) {
  //       params.append('endDate', invoiceSearch.endDate);
  //     }
  //     if (invoiceSearch.status) {
  //       params.append('status', invoiceSearch.status);
  //     }
  //     if (invoiceSearch.cancelWithCreditNote) {
  //       params.append('cancelWithCreditNote', invoiceSearch.cancelWithCreditNote);
  //     }
      
  //     // Request all data (no pagination) for export
  //     params.append('limit', '10000'); // Large limit to get all data
      
  //     const url = `/invoice?${params.toString()}`;
  //     console.log('Export URL:', url);
      
  //     const response = await axiosInstance.get(url);
      
  //     if (response.data.success) {
  //       const invoices = response.data.data || [];
        
  //       if (invoices.length === 0) {
  //         showAlert('No invoices found to export', 'warning');
  //         return;
  //       }
        
  //       // Define CSV headers with proper readable names
  //       const headers = [
  //         { key: 'invoiceNumber', label: 'Invoice Number' },
  //         { key: 'invoiceDate', label: 'Invoice Date' },
  //         { key: 'reseller.businessName', label: 'Reseller Name' },
  //         { key: 'reseller.gstNumber', label: 'Reseller GST' },
  //         { key: 'totalOutletAmount', label: 'Outlet Amount (₹)' },
  //         { key: 'totalDamageRepairAmount', label: 'Damage Repair Amount (₹)' },
  //         { key: 'totalCenterReturnAmount', label: 'Center Return Amount (₹)' },
  //         { key: 'totalBeforeTax', label: 'Total Before Tax (₹)' },
  //         { key: 'cgst', label: 'CGST (₹)' },
  //         { key: 'sgst', label: 'SGST (₹)' },
  //         { key: 'roundOff', label: 'Round Off (₹)' },
  //         { key: 'totalAmount', label: 'Total Amount (₹)' },
  //         { key: 'status', label: 'Status' },
  //         { key: 'cancellationDetails.cancelWithCreditNote', label: 'Cancel With Credit Note' },
  //         { key: 'cancellationDetails.cancelReason', label: 'Cancel Reason' },
  //         { key: 'cancellationDetails.cancelledAt', label: 'Cancelled At' },
  //         { key: 'createdAt', label: 'Created At' },
  //         { key: 'centersCount', label: 'Number of Branches' }
  //       ];
        
  //       // Format the data for export
  //       const exportData = invoices.map(invoice => {
  //         // Helper function to get nested values
  //         const getNestedValue = (obj, path) => {
  //           return path.split('.').reduce((current, key) => 
  //             current && current[key] !== undefined ? current[key] : '', obj);
  //         };
  
  //         // Create a flat object with proper formatted values
  //         const row = {};
          
  //         headers.forEach(header => {
  //           let value = getNestedValue(invoice, header.key);
            
  //           // Format based on key
  //           if (header.key === 'invoiceDate' && value) {
  //             value = new Date(value).toLocaleDateString('en-GB');
  //           } else if (header.key === 'createdAt' && value) {
  //             value = new Date(value).toLocaleString('en-GB');
  //           } else if (header.key === 'cancellationDetails.cancelledAt' && value) {
  //             value = new Date(value).toLocaleString('en-GB');
  //           } else if (header.key.includes('Amount') || header.key.includes('cgst') || header.key.includes('sgst') || header.key.includes('roundOff')) {
  //             value = value ? Number(value).toFixed(2) : '0.00';
  //           } else if (header.key === 'cancellationDetails.cancelWithCreditNote') {
  //             value = value === true ? 'Yes' : (value === false ? 'No' : '');
  //           } else if (header.key === 'status') {
  //             value = value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
  //           }
            
  //           row[header.label] = value !== null && value !== undefined ? value : '';
  //         });
          
  //         return row;
  //       });
        
  //       // Generate filename with filters
  //       let filename = 'invoices';
  //       if (invoiceSearch.startDate && invoiceSearch.endDate) {
  //         filename += `_${invoiceSearch.startDate}_to_${invoiceSearch.endDate}`;
  //       }
  //       if (invoiceSearch.reseller) {
  //         const reseller = resellers.find(r => r._id === invoiceSearch.reseller);
  //         if (reseller) {
  //           filename += `_${reseller.businessName.replace(/\s+/g, '_')}`;
  //         }
  //       }
  //       if (invoiceSearch.status) {
  //         filename += `_${invoiceSearch.status}`;
  //       }
        
  //       // Get just the labels for CSV headers
  //       const headerLabels = headers.map(h => h.label);
        
  //       exportToCSV(exportData, filename, headerLabels);
  //       showAlert(`Successfully exported ${invoices.length} invoices`, 'success');
  //     } else {
  //       throw new Error('Failed to fetch invoices for export');
  //     }
  //   } catch (error) {
  //     console.error('Error exporting invoices:', error);
  //     showAlert('Error exporting invoices: ' + (error.message || 'Please try again'), 'danger');
  //   } finally {
  //     setInvoiceLoading(false);
  //   }
  // };

  const handleExportInvoices = async () => {
    try {
      setInvoiceLoading(true);
      
      const params = new URLSearchParams();
      
      if (invoiceSearch.invoiceNumber) {
        params.append('invoiceNumber', invoiceSearch.invoiceNumber);
      }
      if (invoiceSearch.reseller) {
        params.append('resellerId', invoiceSearch.reseller);
      }
      if (invoiceSearch.center) {
        params.append('center', invoiceSearch.center);
      }
      if (invoiceSearch.startDate) {
        params.append('startDate', invoiceSearch.startDate);
      }
      if (invoiceSearch.endDate) {
        params.append('endDate', invoiceSearch.endDate);
      }
      if (invoiceSearch.status) {
        params.append('status', invoiceSearch.status);
      }
      if (invoiceSearch.cancelWithCreditNote) {
        params.append('cancelWithCreditNote', invoiceSearch.cancelWithCreditNote);
      }

      const url = `/invoice?${params.toString()}`;
      console.log('Export URL:', url);
      
      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        const invoices = response.data.data || [];
        
        if (invoices.length === 0) {
          showAlert('No invoices found to export', 'warning');
          return;
        }
        
        // Define CSV headers for detailed line-item report
        const headers = [
          { key: 'invoiceNumber', label: 'Invoice Number' },
          { key: 'invoiceDate', label: 'Invoice Date' },
          { key: 'resellerName', label: 'Reseller Name' },
          { key: 'resellerGST', label: 'Reseller GST' },
          { key: 'centerName', label: 'Branch/Center' },
          { key: 'challanNo', label: 'Challan No' },
          { key: 'productName', label: 'Product Description' },
          { key: 'hsnCode', label: 'HSN Code' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'rate', label: 'Rate (₹)' },
          { key: 'totalAmount', label: 'Total (₹)' },
          { key: 'gstRate', label: 'GST Rate (%)' },
          { key: 'cgstAmount', label: 'CGST (₹)' },
          { key: 'sgstAmount', label: 'SGST (₹)' },
          { key: 'totalWithGST', label: 'Total with GST (₹)' },
          { key: 'status', label: 'Invoice Status' }
        ];
        
        // Prepare line items data
        const lineItems = [];
        
        invoices.forEach(invoice => {
          const invoiceDate = invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString('en-GB') : '';
          const resellerName = invoice.reseller?.businessName || '';
          const resellerGST = invoice.reseller?.gstNumber || '';
          const centerNames = invoice.centers?.map(c => c.centerName).join(', ') || '';
          const invoiceStatus = invoice.status || 'generated';
          const formattedStatus = invoiceStatus.charAt(0).toUpperCase() + invoiceStatus.slice(1);
          
          // GST rate is 18% (9% CGST + 9% SGST)
          const gstRate = 18;
          
          // Get challan numbers from stockRequestIds
          const challanNumbers = invoice.stockRequestIds
            ?.map(sr => sr.challanNo)
            .filter(Boolean)
            .join(', ') || '';
          
          console.log('Processing invoice:', invoice.invoiceNumber, 'Products:', invoice.products?.length);
          
          // If invoice has products array, create one row per product
          if (invoice.products && invoice.products.length > 0) {
            invoice.products.forEach((product, index) => {
              console.log(`Product ${index + 1}:`, product.productTitle);
              
              // Calculate GST amounts for this product
              const productTotal = product.totalAmount || 0;
              const cgstAmount = productTotal * 0.09;
              const sgstAmount = productTotal * 0.09;
              const totalWithGST = productTotal + cgstAmount + sgstAmount;
              
              // Use outletRate as the rate (since damageRepair and centerReturn are 0 in your data)
              const rate = product.outletRate || product.repairRate || 0;
              
              const lineItem = {
                invoiceNumber: invoice.invoiceNumber || '',
                invoiceDate: invoiceDate,
                resellerName: resellerName,
                resellerGST: resellerGST,
                centerName: centerNames,
                challanNo: challanNumbers,
                productName: product.productTitle || '',
                hsnCode: product.hsnCode || '',
                quantity: product.quantity || 0,
                rate: rate.toFixed(2),
                totalAmount: productTotal.toFixed(2),
                gstRate: gstRate,
                cgstAmount: cgstAmount.toFixed(2),
                sgstAmount: sgstAmount.toFixed(2),
                totalWithGST: totalWithGST.toFixed(2),
                status: formattedStatus
              };
              
              console.log('Adding line item:', lineItem);
              lineItems.push(lineItem);
            });
          } else {
            console.log('No products found for invoice:', invoice.invoiceNumber);
            // If no products array, create a summary row
            const lineItem = {
              invoiceNumber: invoice.invoiceNumber || '',
              invoiceDate: invoiceDate,
              resellerName: resellerName,
              resellerGST: resellerGST,
              centerName: centerNames,
              challanNo: challanNumbers,
              productName: 'Multiple Products',
              hsnCode: '',
              quantity: '',
              rate: '',
              totalAmount: invoice.totalBeforeTax?.toFixed(2) || '0.00',
              gstRate: gstRate,
              cgstAmount: invoice.cgst?.toFixed(2) || '0.00',
              sgstAmount: invoice.sgst?.toFixed(2) || '0.00',
              totalWithGST: invoice.totalAmount?.toFixed(2) || '0.00',
              status: formattedStatus
            };
            lineItems.push(lineItem);
          }
        });
        
        console.log('Total line items created:', lineItems.length);
        
        if (lineItems.length === 0) {
          showAlert('No line items found to export', 'warning');
          return;
        }
        let filename = 'invoice_details';
        if (invoiceSearch.startDate && invoiceSearch.endDate) {
          filename += `_${invoiceSearch.startDate}_to_${invoiceSearch.endDate}`;
        }
        if (invoiceSearch.reseller) {
          const reseller = resellers.find(r => r._id === invoiceSearch.reseller);
          if (reseller) {
            filename += `_${reseller.businessName.replace(/\s+/g, '_')}`;
          }
        }
        
        // Get just the labels for CSV headers
        const headerLabels = headers.map(h => h.label);
        
        // Log first few items for debugging
        console.log('First line item:', lineItems[0]);
        console.log('Header labels:', headerLabels);
        
        exportToCSV(lineItems, filename, headerLabels);
        showAlert(`Successfully exported ${lineItems.length} line items from ${invoices.length} invoices`, 'success');
      } else {
        throw new Error('Failed to fetch invoices for export');
      }
    } catch (error) {
      console.error('Error exporting invoices:', error);
      showAlert('Error exporting invoices: ' + (error.message || 'Please try again'), 'danger');
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleMenuClick = (event, invoiceId) => {
    setAnchorEl(event.currentTarget);
    setMenuId(invoiceId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleSelectChallan = (id) => {
    setSelectedChallans((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const nonInvoicedIds = filteredCustomers
        .filter(c => !c.invoiceInfo?.invoiceRaised)
        .map((c) => c._id);
      setSelectedChallans(nonInvoicedIds);
    } else {
      setSelectedChallans([]);
    }
  };
  
  useEffect(() => {
    fetchData();
    fetchCenters();
    fetchResellers();
    if (activeTab === 'invoices') {
      fetchInvoices();
    }
  }, []);
  
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchData(activeSearch, page);
  };

  const handleInvoicePageChange = (page) => {
    if (page < 1 || page > invoiceTotalPages) return;
    fetchInvoices(invoiceSearch, page);
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

  const handleStockRequestSearch = (searchData) => {
    const searchWithCompleted = { ...searchData, status: 'Completed' };
    setActiveSearch(searchWithCompleted);
    fetchData(searchWithCompleted, 1);
  };

  const handleInvoiceSearch = (searchData) => {
    setInvoiceSearch(searchData);
    fetchInvoices(searchData, 1);
  };

  const handleResetSearch = () => {
    const resetSearch = { 
      center: '', 
      reseller: '',
      startDate: '',
      endDate: '',
    };
    setActiveSearch(resetSearch);
    setSearchTerm('');
    fetchData(resetSearch, 1);
  };

  const handleResetInvoiceSearch = () => {
    const resetSearch = {
      invoiceNumber: '',
      reseller: '',
      center: '',
      startDate: '',
      endDate: '',
      status: '',
      cancelWithCreditNote: ''
    };
    setInvoiceSearch(resetSearch);
    setInvoiceSearchTerm('');
    fetchInvoices(resetSearch, 1);
  };

  const handleClick = (itemId) => {
    navigate(`/stockRequest-profile/${itemId}`);
  };

  const filteredCustomers = customers.filter(customer => {
    if (activeSearch.keyword || activeSearch.center || activeSearch.outlet) {
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

  const filteredInvoices = invoices.filter(invoice => {
    if (invoiceSearch.invoiceNumber || invoiceSearch.reseller || invoiceSearch.startDate || invoiceSearch.endDate || invoiceSearch.status || invoiceSearch.cancelWithCreditNote) {
      return true;
    }
    if (!invoiceSearchTerm.trim()) {
      return true;
    }
    
    const searchLower = invoiceSearchTerm.toLowerCase();
    if (invoice.invoiceNumber?.toLowerCase().includes(searchLower)) {
      return true;
    }
    if (invoice.reseller?.businessName?.toLowerCase().includes(searchLower)) {
      return true;
    }
    if (invoice.reseller?.gstNumber?.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    return false;
  });
  
  const handleGenerateChallan = (item) => {
    setSelectedChallan(item);
    setShowChallanModal(true);
  };

  const handleGenerateInvoice = async (metaData) => {
    let invoiceWindow = null;
    
    try {
      setInvoiceMetaData(metaData);
  
      const selectedData = customers.filter(c => selectedChallans.includes(c._id));
      if (selectedData.length === 0) return;
  
      const invoiceNumber = `STEL/${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().slice(2)}/${Math.floor(Math.random() * 1000)}`;
      const invoiceDate = new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: '2-digit' 
      });
  
      const allProductIds = [];
      selectedData.forEach(challan => {
        challan.products.forEach(product => {
          if (product.product?._id) {
            allProductIds.push(product.product._id.toString());
          }
        });
      });
  
      const repairCostMap = await fetchRepairCosts(allProductIds);
      
      const reseller = selectedData[0]?.center?.reseller;
  
      const allCenters = [
        ...new Set(selectedData.map(c => c.center?._id).filter(Boolean))
      ];
      
      const centerNames = [
        ...new Set(selectedData.map(c => c.center?.centerName).filter(Boolean))
      ];
      const centersList = centerNames.join(', ');
  
      const productMap = new Map();
      
      selectedData.forEach(challan => {
        challan.products.forEach(product => {
          const productId = product.product?._id || product.product?.productTitle;
          const productTitle = product.product?.productTitle || '';
          const hsnCode = product.product?.hsnCode || '85176990';
          const salePrice = product.product?.salePrice || product.rate || 0;
          
          const repairCostPerUnit = repairCostMap.get(product.product?._id?.toString()) || 150;
          
          // Check if sourceBreakdown has valid data
          const sourceBreakdown = product.sourceBreakdown || {};
          const hasValidSourceBreakdown = sourceBreakdown.totalApproved > 0;
          
          let resellerQty = 0;
          let outletQty = 0;
          
          if (hasValidSourceBreakdown) {
            // Use sourceBreakdown if available (for newer requests)
            resellerQty = sourceBreakdown.fromReseller?.quantity || 0;
            outletQty = sourceBreakdown.fromOutlet?.quantity || 0;
            console.log(`Using sourceBreakdown for ${productTitle}: Reseller=${resellerQty}, Outlet=${outletQty}`);
          } else {
            // Fall back to receivedQuantity for older requests without sourceBreakdown
            // Assume all received quantity came from outlet
            outletQty = product.receivedQuantity || 0;
            resellerQty = 0;
            console.log(`Using receivedQuantity fallback for ${productTitle}: Outlet=${outletQty} (sourceBreakdown not available)`);
          }
          
          const resellerStock = product.resellerStock || {};
          const availableBreakdown = resellerStock.availableBreakdown || {};
          
          let damageRepairQty = 0;
          let centerReturnQty = 0;
          
          // Only calculate damage repair if there's reseller quantity
          if (resellerQty > 0) {
            const totalDamageRepairInStock = availableBreakdown.damageRepair || 0;
            const totalCenterReturnInStock = availableBreakdown.centerReturn || 0;
            const totalResellerStockAvailable = totalDamageRepairInStock + totalCenterReturnInStock;
            
            if (totalResellerStockAvailable > 0) {
              const damageRepairRatio = totalDamageRepairInStock / totalResellerStockAvailable;
              
              damageRepairQty = Math.min(
                Math.round(resellerQty * damageRepairRatio),
                totalDamageRepairInStock
              );
              centerReturnQty = Math.min(
                resellerQty - damageRepairQty,
                totalCenterReturnInStock
              );
              
              if (damageRepairQty + centerReturnQty !== resellerQty) {
                const remaining = resellerQty - damageRepairQty - centerReturnQty;
                if (remaining > 0) {
                  if (totalDamageRepairInStock - damageRepairQty > totalCenterReturnInStock - centerReturnQty) {
                    damageRepairQty += remaining;
                  } else {
                    centerReturnQty += remaining;
                  }
                }
              }
            } else {
              // If no breakdown info, assume 50-50 split
              damageRepairQty = Math.round(resellerQty / 2);
              centerReturnQty = resellerQty - damageRepairQty;
            }
          }
  
          // For products with sourceBreakdown missing, we don't have damage repair info
          // So we'll treat all as outlet stock (no damage repair)
          if (!hasValidSourceBreakdown) {
            damageRepairQty = 0;
            centerReturnQty = 0;
          }
  
          if (productMap.has(productId)) {
            const existing = productMap.get(productId);
           
            const outletAmount = outletQty * salePrice;
            const damageRepairAmount = damageRepairQty * repairCostPerUnit;
            const centerReturnAmount = centerReturnQty * 0;
            
            existing.quantity += (resellerQty + outletQty);
            existing.outletQty += outletQty;
            existing.damageRepairQty += damageRepairQty;
            existing.centerReturnQty += centerReturnQty;
            
            existing.outletAmount += outletAmount;
            existing.damageRepairAmount += damageRepairAmount;
            existing.centerReturnAmount += centerReturnAmount;
            existing.totalAmount += outletAmount + damageRepairAmount + centerReturnAmount;
          } else {
            
            const outletAmount = outletQty * salePrice;
            const damageRepairAmount = damageRepairQty * repairCostPerUnit;
            const centerReturnAmount = centerReturnQty * 0;
            
            productMap.set(productId, {
              productId: product.product?._id,
              productTitle: productTitle,
              hsnCode: hsnCode,
              quantity: resellerQty + outletQty,
             
              outletQty: outletQty, 
              damageRepairQty: damageRepairQty,
              centerReturnQty: centerReturnQty, 
              
              outletRate: salePrice,
              repairRate: repairCostPerUnit,
              centerReturnRate: 0, 
  
              outletAmount: outletAmount,
              damageRepairAmount: damageRepairAmount,
              centerReturnAmount: centerReturnAmount,
              totalAmount: outletAmount + damageRepairAmount + centerReturnAmount,
              
              unit: 'Nos'
            });
          }
        });
      });
  
      const combinedProducts = Array.from(productMap.values());
  
      // Filter out products with zero quantity
      const nonZeroProducts = combinedProducts.filter(p => p.quantity > 0);
      
      if (nonZeroProducts.length === 0) {
        alert('No products with quantity > 0 found in selected stock requests');
        return;
      }
  
      const totalOutletAmount = nonZeroProducts.reduce((sum, p) => sum + p.outletAmount, 0);
      const totalDamageRepairAmount = nonZeroProducts.reduce((sum, p) => sum + p.damageRepairAmount, 0);
      const totalCenterReturnAmount = nonZeroProducts.reduce((sum, p) => sum + p.centerReturnAmount, 0);
      
      const totalBeforeTax = totalOutletAmount + totalDamageRepairAmount + totalCenterReturnAmount;
      
      const cgst = totalBeforeTax * 0.09;
      const sgst = totalBeforeTax * 0.09;
      const roundOff = Math.round(totalBeforeTax + cgst + sgst) - (totalBeforeTax + cgst + sgst);
      const total = totalBeforeTax + cgst + sgst + roundOff;
  
      const hsnMap = new Map();
      nonZeroProducts.forEach(product => {
        const hsn = product.hsnCode;
        const taxableValue = product.totalAmount;
        const cgstAmount = taxableValue * 0.09;
        const sgstAmount = taxableValue * 0.09;
        const totalTax = cgstAmount + sgstAmount;
        
        if (hsnMap.has(hsn)) {
          const existing = hsnMap.get(hsn);
          existing.taxableValue += taxableValue;
          existing.cgstAmount += cgstAmount;
          existing.sgstAmount += sgstAmount;
          existing.totalTax += totalTax;
        } else {
          hsnMap.set(hsn, {
            hsnCode: hsn,
            taxableValue: taxableValue,
            cgstAmount: cgstAmount,
            sgstAmount: sgstAmount,
            totalTax: totalTax
          });
        }
      });
  
      const hsnSummary = Array.from(hsnMap.values());
  
      const productsPerPage = 8;
      const pages = [];
      for (let i = 0; i < nonZeroProducts.length; i += productsPerPage) {
        pages.push(nonZeroProducts.slice(i, i + productsPerPage));
      }
  
      
      const invoiceHTML = `
      <html>
      <head>
        <title>Invoice - ${reseller?.businessName || 'SSV Alpha Broadband LLP'}</title>
        <style>
          @page { size: A4; margin: 12mm; }
          body { font-family: Arial, sans-serif; color: #000; margin: 0; padding: 0;}

          @media screen {
             body {
                margin-left: 100px;
                margin-right: 100px;
                margin-top: 20px;
                margin-bottom: 20px;
               }
              }
             @media print {
             body {
                 margin: 0;
                 padding: 0;
                }
                @page {
               margin: 12mm;
                }
              }
          .title { text-align: center; font-weight: bold; font-size: 16px; margin: 6px 0; }
          .main-border { border: 1px solid #000; width: 100%; border-collapse: collapse; }
          .main-border td, .main-border th { border: 1px solid #000; padding: 5px; vertical-align: top; }
          .meta-table { width: 100%; border-collapse: collapse; }
          .meta-table td { border: 1px solid #000; padding: 6px; vertical-align: top; }
          .label { font-weight: bold; }
          .right { text-align: right; }
          .bold { font-weight: bold; }
          .footer-note { font-style: italic; text-align: right; margin-top: 4px; }
          .repair-note { color: #666; font-size: 0.9em; }
          .free-note { color: green; font-size: 0.9em; }
          .invoice-info { 
            background-color: #f8f9fa; 
            padding: 10px; 
            margin: 10px 0; 
            border: 1px solid #dee2e6;
            border-radius: 4px;
          }
          .print-button {
            display: block;
            margin: 20px auto;
            padding: 10px 15px;
            background-color: #3c8dbc;
            color: white;
            border: none;
            font-size: 16px;
            cursor: pointer;
            position: sticky;
            top: 20px;
            z-index: 1000;
          }
          .print-button:hover {
            background-color: #3c8dbc;
          }
          @media print { 
            .page-break { page-break-before: always; } 
            .no-print { display: none; }
            .print-button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="title">Tax Invoice</div>

        ${pages.map((products, pageIndex) => `
          <table class="main-border">
            <tr>
              <td style="width:50%;">
                <div style="border-bottom:1px solid #000; padding-bottom:6px; margin-bottom:6px;">
                  <div class="bold">SSV Telecom Private Limited FY 22-23</div>
                  A-1, Landmark CHS, Sector 14<br/>
                  Vashi, Navi Mumbai<br/>
                  27ABECS3422Q1ZX<br/>
                  GSTIN/UIN: 27ABECS3422Q1ZX
                </div>

                <span class="label">Consignee (Ship to)</span><br/>
                ${reseller?.businessName || 'SSV Alpha Broadband LLP'}<br/>
                ${centersList || 'All Alpha Area'}<br/><br/>
                GSTIN/UIN: ${reseller?.gstNumber || '27AEGFS1650E1Z6'}<br/>
                State Name : ${reseller?.state || 'Maharashtra'}, Code : 27
                <hr/>

                <span class="label">Buyer (Bill to)</span><br/>
                ${reseller?.businessName || 'SSV Alpha Broadband LLP'}<br/>
                ${reseller?.address1 || 'A/3, Landmark Soc, Sector-14, Vashi'}<br/>
                GSTIN/UIN: ${reseller?.gstNumber || '27AEGFS1650E1Z6'}<br/>
                State Name : ${reseller?.state || 'Maharashtra'}, Code : 27
              </td>

              <td style="width:50%; padding:0;">
                <table class="meta-table">
                  <tr>
                    <td><span class="label">Invoice No.</span><br/>${invoiceNumber}</td>
                    <td><span class="label">Dated</span><br/>${invoiceDate}</td>
                  </tr>
                  <tr>
                    <td><span class="label">Delivery Note</span><br/>${metaData?.deliveryNote || ''}</td>
                    <td><span class="label">Mode/Terms of Payment</span><br/>${metaData?.modeOfPayment || ''}</td>
                  </tr>
                  <tr>
                    <td><span class="label">Reference No. & Date</span><br/>${metaData?.referenceNo || ''} ${metaData?.referenceDate ? new Date(metaData.referenceDate).toLocaleDateString() : ''}</td>
                    <td><span class="label">Other References</span><br/>${metaData?.otherReferences || ''}</td>
                  </tr>
                  <tr>
                    <td><span class="label">Buyer's Order No.</span><br/>${metaData?.buyerOrderNo || ''}</td>
                    <td><span class="label">Dated</span><br/>${metaData?.buyerOrderDate ? new Date(metaData.buyerOrderDate).toLocaleDateString() : ''}</td>
                  </tr>
                  <tr>
                    <td><span class="label">Dispatch Doc No.</span><br/>${metaData?.dispatchDocNo || '16.07-31.07.25'}</td>
                    <td><span class="label">Delivery Note Date</span><br/>${metaData?.deliveryNoteDate ? new Date(metaData.deliveryNoteDate).toLocaleDateString() : ''}</td>
                  </tr>
                  <tr>
                    <td><span class="label">Dispatched through</span><br/>${metaData?.dispatchedThrough || ''}</td>
                    <td><span class="label">Destination</span><br/><b>${metaData?.destination || 'All Alpha Area'}</b></td>
                  </tr>
                  <tr>
                    <td colspan="2"><span class="label">Terms of Delivery</span><br/>${metaData?.termsOfDelivery || ''}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <table class="main-border" style="margin-top:10px;">
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>Description of Goods</th>
                <th>HSN/SAC</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Per</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${products.map((p, i) => {
                const productIndex = pageIndex * productsPerPage + i + 1;
                let rows = [];
                let rowCount = 0;
                
                if (p.outletQty > 0) {
                  rows.push(`
                    <tr>
                      <td${rowCount > 0 ? ' rowspan="' + rowCount + '"' : ''}>${productIndex}</td>
                      <td>${p.productTitle}</td>
                      <td>${p.hsnCode}</td>
                      <td class="right">${p.outletQty}</td>
                      <td class="right">${p.outletRate.toFixed(2)}</td>
                      <td>${p.unit}</td>
                      <td class="right">${p.outletAmount.toFixed(2)}</td>
                    </tr>
                  `);
                  rowCount++;
                }
                
                if (p.damageRepairQty > 0) {
                  rows.push(`
                    <tr>
                      <td${rowCount === 0 ? ' rowspan="' + (rowCount + 1) + '"' : ''}></td>
                      <td>${p.productTitle} <span class="repair-note">(Damage Repair - Charged @₹${p.repairRate}/unit)</span></td>
                      <td>${p.hsnCode}</td>
                      <td class="right">${p.damageRepairQty}</td>
                      <td class="right">${p.repairRate.toFixed(2)}</td>
                      <td>${p.unit}</td>
                      <td class="right">${p.damageRepairAmount.toFixed(2)}</td>
                    </tr>
                  `);
                  rowCount++;
                }
                
                if (p.centerReturnQty > 0) {
                  rows.push(`
                    <tr>
                      <td${rowCount === 0 ? ' rowspan="' + (rowCount + 1) + '"' : ''}></td>
                      <td>${p.productTitle} <span class="free-note">(Center Return - Free)</span></td>
                      <td>${p.hsnCode}</td>
                      <td class="right">${p.centerReturnQty}</td>
                      <td class="right">${p.centerReturnRate.toFixed(2)}</td>
                      <td>${p.unit}</td>
                      <td class="right">${p.centerReturnAmount.toFixed(2)}</td>
                    </tr>
                  `);
                  rowCount++;
                }
                
                return rows.join('');
              }).join('')}
              ${pageIndex === pages.length - 1 ? `
              <tr>
                <td colspan="4" rowspan="7"></td>
                <td colspan="2"><b>Subtotal (New Stock from Outlet)</b></td>
                <td class="right">${totalOutletAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2"><b>Subtotal (Damage Repair)</b></td>
                <td class="right">${totalDamageRepairAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2"><b>Total Before Tax</b></td>
                <td class="right">${totalBeforeTax.toFixed(2)}</td>
              </tr>
              <tr><td colspan="2"><b>Output CGST @9%</b></td><td class="right">${cgst.toFixed(2)}</td></tr>
              <tr><td colspan="2"><b>Output SGST @9%</b></td><td class="right">${sgst.toFixed(2)}</td></tr>
              <tr><td colspan="2"><b>Round Off</b></td><td class="right">${roundOff.toFixed(2)}</td></tr>
              <tr><td colspan="2"><b>Total</b></td><td class="right">${total.toFixed(2)}</td></tr>
              <tr><td colspan="7"><b>Amount Chargeable (in words):</b><i>${numToWords(total)}</i></td></tr>` : ''}
            </tbody>
          </table>
          ${pageIndex < pages.length - 1 ? '<div class="footer-note">continued ...</div><div class="page-break"></div>' : ''}
        `).join('')}

        <!-- Tax Summary Page -->
        <div class="page-break"></div>

        <div class="analysis-header" style="display:flex; justify-content:space-between; margin-top:10px;">
          <div>Invoice No. <strong>${invoiceNumber}</strong></div>
          <div>Dated <strong>${invoiceDate}</strong></div>
        </div>

        <div style="text-align:center;">
          <p><strong>SSV Telecom Private Limited</strong><br/>
            A-1, Landmark CHS, Sector 14<br/>
            Vashi , Navi Mumbai<br/>
            27ABECS3422Q1ZX<br/>
            GSTIN/UIN: 27ABECS3422Q1ZX<br/><br/>
            Party: <strong>SSV Telecom Private Limited</strong><br/>
            A/3, Landmark Soc, Sector-14 , Vashi<br/>
            Navi Mumbai<br/>
            GSTIN/UIN : 27AEGFS1650E1Z6<br/>
            State Name : Maharashtra, Code : 27
          </p>
        </div>

        <table class="main-border" style="margin-top:10px;">
          <thead>
            <tr>
              <th>HSN/SAC</th>
              <th>Taxable Value</th>
              <th colspan="2">CGST</th>
              <th colspan="2">SGST</th>
              <th>Total Tax Amount</th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Rate</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${hsnSummary.map(hsn => `
              <tr>
                <td>${hsn.hsnCode}</td>
                <td class="right">${hsn.taxableValue.toFixed(2)}</td>
                <td>9%</td>
                <td class="right">${hsn.cgstAmount.toFixed(2)}</td>
                <td>9%</td>
                <td class="right">${hsn.sgstAmount.toFixed(2)}</td>
                <td class="right">${hsn.totalTax.toFixed(2)}</td>
              </tr>`).join('')}
             <tr class="bold">
              <td><b>Total</b></td>
              <td class="right">${totalBeforeTax.toFixed(2)}</td>
              <td></td>
              <td class="right">${cgst.toFixed(2)}</td>
              <td></td>
              <td class="right">${sgst.toFixed(2)}</td>
              <td class="right">${(cgst + sgst).toFixed(2)}</td>
            </tr>
             <tr>
           <td colspan="7"><b>Taxable Amount (in words):</b> <i>${numToWords(parseFloat((cgst + sgst).toFixed(2)))}
          </i></td>
           </tr>
          </tbody> 
        </table>
          <button class="print-button no-print" onclick="window.print()">🖨️ Print</button>
        
      </body>
      </html>
    `;
  
      const invoiceData = {
        resellerId: reseller?._id,
        centers: allCenters,
        products: nonZeroProducts,
        totalOutletAmount,
        totalDamageRepairAmount,
        totalCenterReturnAmount,
        totalBeforeTax,
        cgst,
        sgst,
        roundOff,
        total,
        hsnSummary,
        metadata: {
          deliveryNote: metaData?.deliveryNote || '',
          modeOfPayment: metaData?.modeOfPayment || '',
          referenceNo: metaData?.referenceNo || '',
          referenceDate: metaData?.referenceDate || null,
          otherReferences: metaData?.otherReferences || '',
          buyerOrderNo: metaData?.buyerOrderNo || '',
          buyerOrderDate: metaData?.buyerOrderDate || null,
          dispatchDocNo: metaData?.dispatchDocNo || '',
          deliveryNoteDate: metaData?.deliveryNoteDate || null,
          dispatchedThrough: metaData?.dispatchedThrough || '',
          destination: metaData?.destination || centersList || 'All Alpha Area',
          termsOfDelivery: metaData?.termsOfDelivery || ''
        },
        invoiceHtml: invoiceHTML
      };
  
      let saveSuccess = false;
      try {
        const invoicedResponse = await markAsInvoiced(
          selectedChallans, 
          invoiceNumber, 
          new Date().toISOString(), 
          invoiceData
        );
        
        if (invoicedResponse.success) {
          console.log('Successfully saved invoice to database:', invoicedResponse.message);
          saveSuccess = true;
        } else {
          throw new Error(invoicedResponse.message || 'Failed to save invoice');
        }
      } catch (saveError) {
        console.error('Error saving invoice to database:', saveError);
      }
      
      invoiceWindow = window.open('', '_blank');
      if (invoiceWindow) {
        invoiceWindow.document.write(invoiceHTML);
        invoiceWindow.document.close();
      } else {
        throw new Error('Could not open invoice window. Please allow popups.');
      }
  
      fetchData(activeSearch, currentPage);
      
      setSelectedChallans([]);
      
      if (saveSuccess) {
        if (activeTab === 'invoices') {
          fetchInvoices(invoiceSearch, invoiceCurrentPage);
        }
      } else {
        alert(`Invoice ${invoiceNumber} generated but could not be saved to database. Please contact administrator.`);
      }
  
    } catch (error) {
      console.error('Error generating invoice:', error);
      
      if (invoiceWindow && invoiceWindow.document) {
        invoiceWindow.document.write(`
          <html>
          <body>
            <h2>Error Generating Invoice</h2>
            <p>${error.message || 'Unknown error occurred'}</p>
            <button onclick="window.close()">Close</button>
          </body>
          </html>
        `);
        invoiceWindow.document.close();
      }
      
      alert('Error generating invoice: ' + (error.message || 'Please try again'));
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'invoices') {
      fetchInvoices();
    } else {
      fetchData();
    }
    setActiveSearch({ 
      keyword: '', 
      center: '', 
      reseller: '',
      status: 'Completed',
      startDate: '',
      endDate: '',
    });
    setInvoiceSearch({
      invoiceNumber: '',
      reseller: '',
      center: '',
      startDate: '',
      endDate: '',
      status: '',
      cancelWithCreditNote: ''
    });
    setSearchTerm('');
    setInvoiceSearchTerm('');
    setSelectedChallans([]);
  };

  const handleViewInvoiceDetails = (invoice) => {
    setSelectedInvoiceForDetails(invoice);
    setInvoiceDetailsModalVisible(true);
  };

  if (loading && activeTab === 'stockRequests') {
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
  
  const renderStockRequestTable = () => (
    <div className="responsive-table-wrapper">
      <CTable striped bordered hover className='responsive-table'>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">
              <input
                type="checkbox"
                checked={selectedChallans.length === filteredCustomers.filter(c => !c.invoiceInfo?.invoiceRaised).length && filteredCustomers.filter(c => !c.invoiceInfo?.invoiceRaised).length > 0}
                onChange={handleSelectAll}
              />
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
              Order Date {getSortIcon('date')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('orderNumber')} className="sortable-header">
              Order Number {getSortIcon('orderNumber')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('challanNo')} className="sortable-header">
              Challan No {getSortIcon('challanNo')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('challanDate')} className="sortable-header">
              Challan Date {getSortIcon('challanDate')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('warehouse.centerName')} className="sortable-header">
              Warehouse {getSortIcon('warehouse.centerName')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('center.centerName')} className="sortable-header">
              Branch {getSortIcon('center.centerName')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('createdBy.email')} className="sortable-header">
              Posted By {getSortIcon('createdBy.email')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" onClick={() => handleSort('completionInfo.completedOn')} className="sortable-header">
              Completed At {getSortIcon('completionInfo.completedOn')}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((item) => {
              const isInvoiceRaised = item.invoiceInfo?.invoiceRaised;
              
              return (
                <CTableRow 
                  key={item._id}
                  className={isInvoiceRaised ? 'invoice-generated-row' : ''}
                >
                  <CTableDataCell>
                    {!isInvoiceRaised && (
                      <input
                        type="checkbox"
                        checked={selectedChallans.includes(item._id)}
                        onChange={() => handleSelectChallan(item._id)}
                      />
                    )}
                  </CTableDataCell>
                  <CTableDataCell>{formatDate(item.date)}</CTableDataCell>
                  <CTableDataCell>
                    <button 
                      className="btn btn-link p-0 text-decoration-none"
                      onClick={() => handleClick(item._id)}
                      style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                    >
                      {item.orderNumber}
                    </button>
                    {isInvoiceRaised && (
                      <div className="invoice-badge">
                        <small className="text-muted">Invoice: {item.invoiceInfo?.invoiceNumber}</small>
                      </div>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <strong>{item.challanNo || 'N/A'}</strong>
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.challanDate ? formatDate(item.challanDate) : 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>{item.warehouse?.centerName || ''}</CTableDataCell>
                  <CTableDataCell>{item.center?.centerName || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    {item.createdBy?.email || 'N/A'} 
                    {item.createdAt && ` At ${new Date(item.createdAt).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: 'numeric',
                      hour12: true 
                    })}`}
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.completionInfo?.completedOn ? formatDateTime(item.completionInfo.completedOn) : 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-1">
                      <div
                        className="dropdown-container"
                        ref={el => dropdownRefs.current[item._id] = el}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CButton
                          size="sm"
                          className='option-button btn-sm'
                          onClick={() => handleGenerateChallan(item)}
                        >
                          <CIcon icon={cilFile} />
                         Challan
                        </CButton>
                      </div>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              );
            })
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="10" className="text-center">
                No completed stock requests found for invoice generation
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );

  const renderInvoiceTable = () => (
    <div className="responsive-table-wrapper">
      <CTable striped bordered hover className='responsive-table'>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">
              Invoice Number
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
              Invoice Date
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
              Reseller
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
              Status
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
              Created At
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {invoiceLoading ? (
            <CTableRow>
              <CTableDataCell colSpan="6" className="text-center">
                <CSpinner size="sm" /> Loading invoices...
              </CTableDataCell>
            </CTableRow>
          ) : filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => {
              const isCancelled = invoice.status === 'cancelled';
              
              return (
                <CTableRow 
                  key={invoice._id}
                  className={isCancelled ? 'invoice-cancelled-row' : ''}
                >
                  <CTableDataCell>
                    <button 
                      className="btn btn-link p-0 text-decoration-none"
                      onClick={() => handleViewInvoiceDetails(invoice)}
                      style={{border: 'none', background: 'none', cursor: 'pointer',color:'#337ab7'}}
                    >
                      {invoice.invoiceNumber}
                    </button>
                    {invoice.stockRequestIds && invoice.stockRequestIds.length > 0 && (
                      <div className="text-muted small">
                        Stock Requests: {invoice.stockRequestIds.length}
                      </div>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    {invoice.invoiceDate ? formatDate(invoice.invoiceDate) : 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>
                    {invoice.reseller?.businessName || 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>
                    {isCancelled ? (
                      <CBadge color="danger" className="badge-cancelled">
                        Cancelled
                      </CBadge>
                    ) : (
                      <CBadge color="success" className="badge-generated">
                        {invoice.status || 'Generated'}
                      </CBadge>
                    )}
                    {isCancelled && invoice.cancellationDetails && (
                      <div className="text-muted small mt-1">
                        <strong>Reason:</strong> {invoice.cancellationDetails.cancelReason}
                        <br />
                        <small>Cancelled on: {formatDate(invoice.cancellationDetails.cancelledAt)}</small>
                      </div>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    {invoice.createdAt ? formatDateTime(invoice.createdAt) : 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-1">
                      <CButton
                        size="sm"
                        className='option-button btn-sm'
                        onClick={(event) => handleMenuClick(event, invoice._id)}
                      >
                        <CIcon icon={cilSettings} />
                        Options
                      </CButton>
                      
                      <Menu
                        id={`invoice-menu-${invoice._id}`}
                        anchorEl={anchorEl}
                        open={menuId === invoice._id}
                        onClose={handleCloseMenu}
                      >
                        <MenuItem onClick={() => handleDownloadInvoice(invoice)}>
                          <CIcon icon={cilCloudDownload} className="me-2" /> Download PDF
                        </MenuItem>

                        {!isCancelled && (
                          <MenuItem onClick={() => {
                            handleCloseMenu();
                            setSelectedInvoiceForCancel(invoice);
                            setCancelModalVisible(true);
                          }}>
                            <CIcon icon={cilBan} className="me-2" /> Cancel Invoice
                          </MenuItem>
                        )} 
                      </Menu>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              );
            })
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="6" className="text-center">
                {invoices.length === 0 
                  ? 'No invoices found. Generate invoices from the Stock Requests tab.'
                  : 'No invoices match your search criteria.'}
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );

  return (
    <div>
      <div className='title'>Sale Invoices</div>
      {alertVisible && (
        <CAlert 
          color={alertColor} 
          className="d-flex align-items-center mt-2"
          dismissible
          onClose={() => setAlertVisible(false)}
        >
          <CIcon 
            icon={alertColor === 'success' ? cilCheck : cilWarning} 
            className="me-2" 
          />
          {alertMessage}
        </CAlert>
      )}
      
      <SearchSaleInvoice
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleStockRequestSearch}
        centers={centers}
        resellers={resellers}
      />

      <InvoiceSearch
        visible={invoiceSearchModalVisible}
        onClose={() => setInvoiceSearchModalVisible(false)}
        onSearch={handleInvoiceSearch}
        centers={centers}
        resellers={resellers}
      />

      <ChallanModal
        visible={showChallanModal}
        onClose={() => setShowChallanModal(false)}
        data={selectedChallan}
      />

      <CCard className='table-container mt-4'>
        <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
          <div>
            <CNav variant="tabs" className="mb-0 border-bottom-0">
              <CNavItem>
                <CNavLink
                  active={activeTab === 'stockRequests'}
                  onClick={() => handleTabChange('stockRequests')}
                  style={{ 
                    cursor: 'pointer',
                    borderTop: activeTab === 'stockRequests' ? '4px solid #2759a2' : '3px solid transparent',
                    color:'black',
                    borderBottom: 'none'
                  }}
                >
                  Stock Requests
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'invoices'}
                  onClick={() => handleTabChange('invoices')}
                  style={{ 
                    cursor: 'pointer',
                    borderTop: activeTab === 'invoices' ? '4px solid #2759a2' : '3px solid transparent',
                    color:'black',
                    borderBottom: 'none'
                  }}
                >
                  Invoices
                </CNavLink>
              </CNavItem>
            </CNav>
          </div>
          
          <div>
            <Pagination
              currentPage={activeTab === 'stockRequests' ? currentPage : invoiceCurrentPage}
              totalPages={activeTab === 'stockRequests' ? totalPages : invoiceTotalPages}
              onPageChange={activeTab === 'stockRequests' ? handlePageChange : handleInvoicePageChange}
            />
          </div>
        </CCardHeader>
        
        <CCardBody>
          <CTabContent>
            <CTabPane visible={activeTab === 'stockRequests'}>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <CButton 
                    size="sm" 
                    className="action-btn me-1"
                    onClick={() => setSearchModalVisible(true)}
                  >
                    <CIcon icon={cilSearch} className='icon' /> Search
                  </CButton>
                  {(activeSearch.reseller || activeSearch.center || activeSearch.startDate || activeSearch.endDate) && (
                    <CButton 
                      size="sm" 
                      color="secondary" 
                      className="action-btn me-1"
                      onClick={handleResetSearch}
                    >
                      <CIcon icon={cilZoomOut} className='icon' />Reset Search
                    </CButton>
                  )}
                  {(activeSearch.reseller || activeSearch.startDate || activeSearch.endDate || activeSearch.center) && selectedChallans.length > 0 && (
                    <CButton 
                      size="sm"
                      className="action-btn me-2"
                      onClick={handleGenerateInvoice}
                    >
                      <CIcon icon={cilFile} className="me-1" />
                      Generate Invoice
                    </CButton>
                  )}
                </div>
                
                <div className='d-flex'>
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <CFormInput
                    type="text"
                    style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                    className="d-inline-block square-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={!!(activeSearch.keyword || activeSearch.center || activeSearch.outlet)} 
                    placeholder={activeSearch.keyword || activeSearch.center || activeSearch.outlet ? "Disabled during advanced search" : ""}
                  />
                </div>
              </div>

              {renderStockRequestTable()}
            </CTabPane>
            
            <CTabPane visible={activeTab === 'invoices'}>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <CButton 
                    size="sm" 
                    className="action-btn me-1"
                    onClick={() => setInvoiceSearchModalVisible(true)}
                  >
                    <CIcon icon={cilSearch} className='icon' /> Search
                  </CButton>
                  {(invoiceSearch.invoiceNumber || invoiceSearch.reseller || invoiceSearch.center || invoiceSearch.startDate || invoiceSearch.endDate || invoiceSearch.status || invoiceSearch.cancelWithCreditNote) && (
                    <CButton 
                      size="sm" 
                      color="secondary" 
                      className="action-btn me-1"
                      onClick={handleResetInvoiceSearch}
                    >
                      <CIcon icon={cilZoomOut} className='icon' />Reset Search
                    </CButton>
                  )}
                  <CButton 
                    size="sm" 
                    className="action-btn me-1"
                    onClick={handleExportInvoices}
                    disabled={invoiceLoading}
                  >
                    <i className="fa fa-fw fa-file-excel"></i>
                    {invoiceLoading ? ' Exporting...' : ' Export'}
                  </CButton>
                </div>
                
                <div className='d-flex'>
                  <CFormLabel className='mt-1 m-1'>Search:</CFormLabel>
                  <CFormInput
                    type="text"
                    style={{maxWidth: '350px', height: '30px', borderRadius: '0'}}
                    className="d-inline-block square-search"
                    value={invoiceSearchTerm}
                    onChange={(e) => setInvoiceSearchTerm(e.target.value)}
                    placeholder="Quick search..."
                  />
                </div>
              </div>

              {renderInvoiceTable()}
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
      
      <CancelInvoiceModal
        visible={cancelModalVisible}
        onClose={() => {
          setCancelModalVisible(false);
          setSelectedInvoiceForCancel(null);
        }}
        onConfirm={handleCancelInvoice}
        invoice={selectedInvoiceForCancel}
      />

      <InvoiceDetailsModal
        visible={invoiceDetailsModalVisible}
        onClose={() => {
          setInvoiceDetailsModalVisible(false);
          setSelectedInvoiceForDetails(null);
        }}
        invoice={selectedInvoiceForDetails}
        onDownload={handleDownloadInvoice}
      />
    </div>
  );
};

export default SaleInvoices;