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
//   CFormCheck
// } from '@coreui/react';
// import CIcon from '@coreui/icons-react';
// import { cilArrowTop, cilArrowBottom, cilSearch, cilPlus, cilZoomOut, cilSettings, cilCheck, cilX, cilPrint } from '@coreui/icons';
// import { Link, useNavigate } from 'react-router-dom';
// import { CFormLabel } from '@coreui/react-pro';
// import axiosInstance from 'src/axiosInstance';

// import Pagination from 'src/utils/Pagination';
// import { confirmAction, showError, showSuccess } from 'src/utils/sweetAlerts';
// import usePermission from 'src/utils/usePermission';
// import SearchStockPurchase from '../stockPurchase/SearchStockPurchase';

// const StockPurchase = () => {
//   const [customers, setCustomers] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchModalVisible, setSearchModalVisible] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState({});
//   const [activeSearch, setActiveSearch] = useState({ 
//     keyword: '', 
//     outlet: '', 
//     startDate: '', 
//     endDate: '' 
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [selectedPO, setSelectedPO] = useState(null);
  
//   const user = JSON.parse(localStorage.getItem('user')) || {};
//   const userRole = (user?.role?.roleTitle || '').toLowerCase();

//   const dropdownRefs = useRef({});
//   const navigate = useNavigate();

//   const { hasPermission } = usePermission(); 

//   const numToWords = (num) => {
//     const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//     const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
//     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
//     if (num === 0) return 'Zero';
//     if (num < 10) return ones[Math.floor(num)];
//     if (num < 20) return teens[Math.floor(num) - 10];
//     if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    
//     if (num < 1000) {
//       return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' and ' + numToWords(num % 100) : '');
//     }
    
//     if (num < 100000) {
//       return numToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numToWords(num % 1000) : '');
//     }
    
//     if (num < 10000000) {
//       return numToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + numToWords(num % 100000) : '');
//     }
    
//     return numToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 !== 0 ? ' ' + numToWords(num % 10000000) : '');
//   };

//   const fetchData = async (searchParams = {}, page = 1) => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       if (searchParams.keyword) {
//         params.append('search', searchParams.keyword);
//       }
//       if (searchParams.outlet) {
//         params.append('outlet', searchParams.outlet);
//       }
//       if (searchParams.startDate) {
//         params.append('startDate', searchParams.startDate);
//       }
//       if (searchParams.endDate) {
//         params.append('endDate', searchParams.endDate);
//       }
      
//       params.append('page', page);
//       const url = params.toString() ? `/raisePO?${params.toString()}` : '/raisePO';
//       const response = await axiosInstance.get(url);
      
//       if (response.data.success) {
//         setCustomers(response.data.data);
//         setCurrentPage(response.data.pagination.currentPage);
//         setTotalPages(response.data.pagination.totalPages);
//       } else {
//         throw new Error('API returned unsuccessful response');
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching customers:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCenters = async () => {
//     try {
//       const response = await axiosInstance.get('/centers/?centerType=Outlet');
//       if (response.data.success) {
//         setCenters(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCenters();
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

//   const toggleDropdown = (id) => {
//     setDropdownOpen(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   };

//   const handleSearch = (searchData) => {
//     setActiveSearch(searchData);
//     fetchData(searchData, 1);
//   };

//   const handleResetSearch = () => {
//     setActiveSearch({ 
//       keyword: '', 
//       outlet: '', 
//       startDate: '', 
//       endDate: '' 
//     });
//     setSearchTerm('');
//     fetchData({}, 1);
//   };

//   const handleSelectPO = (po) => {
//   // If the clicked PO is already selected, deselect it (set to null)
//   if (selectedPO?._id === po._id) {
//     setSelectedPO(null);
//   } else {
//     setSelectedPO(po);
//   }
// };

//   // const generateInvoice = () => {
//   //   if (!selectedPO) {
//   //     showError('Please select a PO first');
//   //     return;
//   //   }
  
//   //   const invoiceDate = new Date().toLocaleDateString('en-GB', {
//   //     day: '2-digit',
//   //     month: 'short',
//   //     year: '2-digit'
//   //   }).replace(/\//g, '-');
  
//   //   const totalBeforeTax = selectedPO.products.reduce((sum, product) => 
//   //     sum + (product.price * product.purchasedQuantity), 0
//   //   );
    
//   //   const vendorState = selectedPO.vendor?.state || '';
//   //   const isIntraState = vendorState.toLowerCase().includes('maharashtra'); 
    
//   //   let cgst = 0;
//   //   let sgst = 0;
//   //   let igst = 0;
//   //   let taxRate = 0.18; 
    
//   //   if (isIntraState) {
//   //     cgst = totalBeforeTax * (taxRate / 2);
//   //     sgst = totalBeforeTax * (taxRate / 2);
//   //   } else {
//   //     igst = totalBeforeTax * taxRate;
//   //   }
    
//   //   const roundOff = Math.round(totalBeforeTax + cgst + sgst + igst) - (totalBeforeTax + cgst + sgst + igst);
//   //   const total = totalBeforeTax + cgst + sgst + igst + roundOff;
  
//   //   const productsPerPage = 8;
//   //   const pages = [];
//   //   for (let i = 0; i < selectedPO.products.length; i += productsPerPage) {
//   //     pages.push(selectedPO.products.slice(i, i + productsPerPage));
//   //   }

//   //   const getStateCodeFromGSTIN = (gstin) => {
//   //     if (!gstin || gstin.length < 2) return '';
//   //     return gstin.substring(0, 2);
//   //   };
  
//   //   const buyerGSTIN = '27ABECS3422Q1ZX';
//   //   const buyerStateCode = getStateCodeFromGSTIN(buyerGSTIN);
//   //   const vendorGSTIN = selectedPO.vendor?.gstNumber || '';
//   //   const vendorStateCode = getStateCodeFromGSTIN(vendorGSTIN);
  
//   //   const invoiceHTML = `
//   //     <!DOCTYPE html>
//   //     <html>
//   //     <head>
//   //       <title>Invoice - ${selectedPO.voucherNo}</title>
//   //       <style>
//   //         @page { 
//   //           size: A4; 
//   //           margin: 12mm; 
//   //         }
//   //         body { 
//   //           font-family: Arial, sans-serif; 
//   //           color: #000; 
//   //           margin: 0; 
//   //           padding: 0;
//   //         }
//   //         .title { 
//   //           text-align: center; 
//   //           font-weight: bold; 
//   //           font-size: 18px; 
//   //           margin: 10px; 
//   //         }
//   //         .main-border { 
//   //           border: 1px solid #000; 
//   //           width: 100%; 
//   //           border-collapse: collapse; 
//   //           margin-bottom: 10px;
//   //         }
//   //         .main-border td, .main-border th { 
//   //           border: 1px solid #000; 
//   //           padding: 5px; 
//   //           vertical-align: top; 
//   //         }
//   //         .meta-table { 
//   //           width: 100%; 
//   //           border-collapse: collapse; 
//   //         }
//   //         .meta-table td { 
//   //           border: 1px solid #000; 
//   //           padding: 6px; 
//   //           vertical-align: top; 
//   //         }
//   //         .label { 
//   //           font-weight: bold; 
//   //         }
//   //         .right { 
//   //           text-align: right; 
//   //         }
//   //         .bold { 
//   //           font-weight: bold; 
//   //         }
//   //         .footer-note { 
//   //           font-style: italic; 
//   //           text-align: right; 
//   //           margin-top: 4px; 
//   //         }
//   //         .page-break { 
//   //           page-break-before: always; 
//   //         }
//   //         hr {
//   //           margin: 4px 0;
//   //           border: none;
//   //           border-top: 1px solid #000;
//   //         }
//   //         i {
//   //           font-style: italic;
//   //           margin-left: 10px;
//   //         }
  
//   //         .declaration-section {
//   //           margin-top: 20px;
//   //           display: flex;
//   //           justify-content: space-between;
//   //         }
//   //         .declaration-left {
//   //           width: 48%;
//   //         }
//   //         .declaration-right {
//   //           width: 48%;
//   //           text-align: center;
//   //         }
//   //         .signature-line {
//   //           margin-top: 60px;
//   //           border-top: 1px solid #000;
//   //           padding-top: 5px;
//   //         }
//   //         .computer-generated {
//   //           text-align: center;
//   //           font-style: italic;
//   //           margin-top: 50px;
//   //         }
//   //         .tax-details {
//   //           margin-top: 10px;
//   //           font-size: 12px;
//   //         }
//   //         .tax-notice {
//   //           font-size: 11px;
//   //           color: #666;
//   //           margin-top: 5px;
//   //         }
//   //       </style>
//   //     </head>
//   //     <body>
//   //       <div class="title">PURCHASE ORDER</div>
  
//   //       ${pages.map((products, pageIndex) => `
//   //         <table class="main-border">
//   //           <tr>
//   //             <td style="width:50%;">
//   //               <div style="border-bottom:1px solid #000; padding-bottom:6px; margin-bottom:6px;">
//   //                 <p>Invoice To</p>
//   //                 <div class="bold">SSV Telecom Private Limited FY 22-23</div>
//   //                 A-1, Landmark CHS, Sector 14<br/>
//   //                 Vashi, Navi Mumbai<br/>
//   //                 ${buyerGSTIN}<br/>
//   //                 GSTIN/UIN: ${buyerGSTIN}<br/>
//   //                 State Name: Maharashtra, Code: ${buyerStateCode}
//   //               </div>
  
//   //               <span class="label">Consignee (Ship to)</span><br/>
//   //               <div class="bold">SSV Telecom Private Limited FY 22-23</div>
//   //               A-1, Landmark CHS, Sector 14<br/>
//   //               Vashi, Navi Mumbai<br/>
//   //               ${buyerGSTIN}<br/>
//   //               GSTIN/UIN: 27AEGFS1650E1Z6<br/>
//   //               State Name: Maharashtra, Code: 27
//   //               <hr/>
  
//   //               <span class="label">Supplier (Bill from)</span><br/>
//   //               ${selectedPO.vendor?.businessName || ' '}<br/>
//   //               ${selectedPO.vendor?.address1 || ''}, ${selectedPO.vendor?.city || ''}<br/>
//   //               GSTIN/UIN: ${selectedPO.vendor?.gstNumber || 'N/A'}<br/>
//   //               State Name: ${selectedPO.vendor?.state || 'N/A'}, Code: ${vendorStateCode || 'N/A'}
                
//   //               <div class="tax-details">
//   //                 <b>Transaction Type:</b> ${isIntraState ? 'INTRA-STATE (CGST+SGST)' : 'INTER-STATE (IGST)'}
//   //               </div>
//   //               <div class="tax-notice">
//   //                 ${isIntraState 
//   //                   ? `CGST @${(taxRate/2*100).toFixed(0)}% + SGST @${(taxRate/2*100).toFixed(0)}% applicable` 
//   //                   : `IGST @${(taxRate*100).toFixed(0)}% applicable`}
//   //               </div>
//   //             </td>
  
//   //             <td style="width:50%; padding:0;">
//   //               <table class="meta-table">
//   //                 <tr>
//   //                   <td><span class="label">Voucher No.</span><br/>${selectedPO.voucherNo || ''}</td>
//   //                   <td><span class="label">Dated</span><br/>${invoiceDate}</td>
//   //                 </tr>
//   //                 <tr>
//   //                   <td></td>
//   //                   <td><span class="label">Mode/Terms of Payment</span><br/></td>
//   //                 </tr>
//   //                 <tr>
//   //                   <td><span class="label">Reference No. & Date</span><br/></td>
//   //                   <td><span class="label">Other References</span><br/></td>
//   //                 </tr>
              
//   //                 <tr>
//   //                   <td><span class="label">Dispatched through</span><br/></td>
//   //                   <td><span class="label">Destination</span><br/><b>All Alpha Area</b></td>
//   //                 </tr>
//   //                 <tr>
//   //                   <td colspan="2"><span class="label">Terms of Delivery</span><br/></td>
//   //                 </tr>
//   //               </table>
//   //             </td>
//   //           </tr>
//   //         </table>
  
//   //         <table class="main-border" style="margin-top:10px;">
//   //           <thead>
//   //             <tr>
//   //               <th style="width: 5%;">Sl No.</th>
//   //               <th style="width: 35%;">Description of Goods</th>
//   //               <th style="width: 10%;">Due on</th>
//   //               <th style="width: 10%;">Quantity</th>
//   //               <th style="width: 10%;">Rate</th>
//   //               <th style="width: 10%;">Per</th>
//   //               <th style="width: 20%;">Amount</th>
//   //             </tr>
//   //           </thead>
//   //           <tbody>
//   //             ${products.map((product, i) => `
//   //               <tr>
//   //                 <td>${pageIndex * productsPerPage + i + 1}</td>
//   //                 <td>${product.product?.productTitle || 'N/A'}</td>
//   //                 <td>${new Date(selectedPO.date).toLocaleDateString('en-GB')}</td>
//   //                 <td class="right">${product.purchasedQuantity}</td>
//   //                 <td class="right">${product.price.toFixed(2)}</td>
//   //                 <td>${product.product?.trackSerialNumber === 'Yes' ? 'Pcs' : 'Nos'}</td>
//   //                 <td class="right">${(product.price * product.purchasedQuantity).toFixed(2)}</td>
//   //               </tr>
//   //             `).join('')}
              
//   //             ${pageIndex === pages.length - 1 ? `
//   //               <tr>
//   //                 <td colspan="5" rowspan="${isIntraState ? '5' : '3'}"></td>
//   //                 <td><b>Sub Total</b></td>
//   //                 <td class="right">${totalBeforeTax.toFixed(2)}</td>
//   //               </tr>
//   //               ${isIntraState ? `
//   //                 <tr>
//   //                   <td><b>CGST @${(taxRate/2*100).toFixed(0)}%</b></td>
//   //                   <td class="right">${cgst.toFixed(2)}</td>
//   //                 </tr>
//   //                 <tr>
//   //                   <td><b>SGST @${(taxRate/2*100).toFixed(0)}%</b></td>
//   //                   <td class="right">${sgst.toFixed(2)}</td>
//   //                 </tr>
//   //               ` : `
//   //                 <tr>
//   //                   <td><b>IGST @${(taxRate*100).toFixed(0)}%</b></td>
//   //                   <td class="right">${igst.toFixed(2)}</td>
//   //                 </tr>
//   //               `}
//   //               <tr>
//   //                 <td><b>Round Off</b></td>
//   //                 <td class="right">${roundOff.toFixed(2)}</td>
//   //               </tr>
//   //               <tr>
//   //                 <td><b>Grand Total</b></td>
//   //                 <td class="right">${total.toFixed(2)}</td>
//   //               </tr>
//   //               <tr>
//   //                 <td colspan="7">
//   //                   <b>Amount Chargeable (in words):</b>
//   //                   <i>INR ${numToWords(Math.floor(total))} Only</i>
//   //                 </td>
//   //               </tr>
//   //             ` : ''}
//   //           </tbody>
//   //         </table>
          
//   //         ${pageIndex === pages.length - 1 ? `
//   //           <div class="declaration-section">
//   //             <div class="declaration-left">
//   //               <div class="bold">Declaration</div>
//   //               <div>Payment Terms & Conditions</div>
//   //               <div>1. PO valid for 30 days</div>
//   //               <div>2. Taxes will be applicable</div>
//   //               <div>3. Default or damaged goods will not be accepted.</div>
//   //             </div>
//   //             <div class="declaration-right">
//   //               <div class="bold">For SSV Telecom Private Limited</div>
  
//   //               ${
//   //                 selectedPO.status === 'approved'
//   //                   ? `
//   //                     <div style="margin-top:20px">
//   //                       <b>${selectedPO.approvedBy?.fullName || 'N/A'},</b>
//   //                       <p>(${formatDate(selectedPO.approvedAt)})</p>
//   //                     </div>
//   //                   `
//   //                   : ''
//   //               }
//   //               <div class="signature-line">
//   //                 Authorised Signatory
//   //               </div>
//   //             </div>
//   //           </div>
//   //          <div class="computer-generated">
//   //             This is a Computer Generated Document
//   //            </div>
//   //         ` : ''}
          
//   //         ${pageIndex < pages.length - 1 ? `
//   //           <div class="footer-note">continued ...</div>
//   //           <div class="page-break"></div>
//   //         ` : ''}
//   //       `).join('')}
        
//   //       <script>
//   //         window.onload = function() {
//   //           window.print();
//   //         }
//   //       </script>
//   //     </body>
//   //     </html>
//   //   `;
  
//   //   const newWindow = window.open('', '_blank');
//   //   newWindow.document.write(invoiceHTML);
//   //   newWindow.document.close();
//   // };


//   const generateInvoice = () => {
//     if (!selectedPO) {
//       showError('Please select a PO first');
//       return;
//     }
  
//     const invoiceDate = new Date().toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: '2-digit'
//     }).replace(/\//g, '-');
  
//     const totalBeforeTax = selectedPO.products.reduce((sum, product) => 
//       sum + (product.price * product.purchasedQuantity), 0
//     );
    
//     const vendorState = selectedPO.vendor?.state || '';
//     const isIntraState = vendorState.toLowerCase().includes('maharashtra'); 
    
//     let cgst = 0;
//     let sgst = 0;
//     let igst = 0;
//     let taxRate = 0.18; 
    
//     if (isIntraState) {
//       cgst = totalBeforeTax * (taxRate / 2);
//       sgst = totalBeforeTax * (taxRate / 2);
//     } else {
//       igst = totalBeforeTax * taxRate;
//     }
    
//     const roundOff = Math.round(totalBeforeTax + cgst + sgst + igst) - (totalBeforeTax + cgst + sgst + igst);
//     const total = totalBeforeTax + cgst + sgst + igst + roundOff;
  
//     const productsPerPage = 8;
//     const pages = [];
//     for (let i = 0; i < selectedPO.products.length; i += productsPerPage) {
//       pages.push(selectedPO.products.slice(i, i + productsPerPage));
//     }
  
//     const getStateCodeFromGSTIN = (gstin) => {
//       if (!gstin || gstin.length < 2) return '';
//       return gstin.substring(0, 2);
//     };
  
//     const buyerGSTIN = '27ABECS3422Q1ZX';
//     const buyerStateCode = getStateCodeFromGSTIN(buyerGSTIN);
//     const vendorGSTIN = selectedPO.vendor?.gstNumber || '';
//     const vendorStateCode = getStateCodeFromGSTIN(vendorGSTIN);
  
//     const invoiceHTML = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Invoice - ${selectedPO.voucherNo}</title>
//         <style>
//           @page { 
//             size: A4; 
//             margin: 12mm; 
//           }
//           body { 
//             font-family: Arial, sans-serif; 
//             color: #000; 
//             margin: 0; 
//             padding: 0;
//           }
//           @media screen {
//             body {
//               margin-left: 100px;
//               margin-right: 100px;
//               margin-top: 20px;
//               margin-bottom: 20px;
//             }
//             .print-button {
//               display: block;
//               margin: 20px auto;
//               padding: 10px 15px;
//               background-color: #3c8dbc;
//               color: white;
//               border: none;
//               font-size: 16px;
//               cursor: pointer;
//               position: sticky;
//               top: 20px;
//               z-index: 1000;
//             }
//             .print-button:hover {
//               background-color: #3c8dbc;
//             }
//           }

//           @media print {
//             body {
//               margin: 0;
//               padding: 0;
//             }
//             .print-button {
//               display: none;
//             }
//             .page-break { 
//               page-break-before: always; 
//             }
//           }
          
//           .title { 
//             text-align: center; 
//             font-weight: bold; 
//             font-size: 18px; 
//             margin: 10px; 
//           }
//           .main-border { 
//             border: 1px solid #000; 
//             width: 100%; 
//             border-collapse: collapse; 
//             margin-bottom: 10px;
//           }
//           .main-border td, .main-border th { 
//             border: 1px solid #000; 
//             padding: 5px; 
//             vertical-align: top; 
//           }
//           .meta-table { 
//             width: 100%; 
//             border-collapse: collapse; 
//           }
//           .meta-table td { 
//             border: 1px solid #000; 
//             padding: 6px; 
//             vertical-align: top; 
//           }
//           .label { 
//             font-weight: bold; 
//           }
//           .right { 
//             text-align: right; 
//           }
//           .bold { 
//             font-weight: bold; 
//           }
//           .footer-note { 
//             font-style: italic; 
//             text-align: right; 
//             margin-top: 4px; 
//           }
//           hr {
//             margin: 4px 0;
//             border: none;
//             border-top: 1px solid #000;
//           }
//           i {
//             font-style: italic;
//             margin-left: 10px;
//           }
  
//           .declaration-section {
//             margin-top: 20px;
//             display: flex;
//             justify-content: space-between;
//           }
//           .declaration-left {
//             width: 48%;
//           }
//           .declaration-right {
//             width: 48%;
//             text-align: center;
//           }
//           .signature-line {
//             margin-top: 60px;
//             border-top: 1px solid #000;
//             padding-top: 5px;
//           }
//           .computer-generated {
//             text-align: center;
//             font-style: italic;
//             margin-top: 50px;
//           }
//           .tax-details {
//             margin-top: 10px;
//             font-size: 12px;
//           }
//           .tax-notice {
//             font-size: 11px;
//             color: #666;
//             margin-top: 5px;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="title">PURCHASE ORDER</div>
//         ${pages.map((products, pageIndex) => `
//           <table class="main-border">
//             <tr>
//               <td style="width:50%;">
//                 <div style="border-bottom:1px solid #000; padding-bottom:6px; margin-bottom:6px;">
//                   <p>Invoice To</p>
//                   <div class="bold">SSV Telecom Private Limited FY 22-23</div>
//                   A-1, Landmark CHS, Sector 14<br/>
//                   Vashi, Navi Mumbai<br/>
//                   ${buyerGSTIN}<br/>
//                   GSTIN/UIN: ${buyerGSTIN}<br/>
//                   State Name: Maharashtra, Code: ${buyerStateCode}
//                 </div>
  
//                 <span class="label">Consignee (Ship to)</span><br/>
//                 <div class="bold">SSV Telecom Private Limited FY 22-23</div>
//                 A-1, Landmark CHS, Sector 14<br/>
//                 Vashi, Navi Mumbai<br/>
//                 ${buyerGSTIN}<br/>
//                 GSTIN/UIN: 27AEGFS1650E1Z6<br/>
//                 State Name: Maharashtra, Code: 27
//                 <hr/>
  
//                 <span class="label">Supplier (Bill from)</span><br/>
//                 ${selectedPO.vendor?.businessName || ' '}<br/>
//                 ${selectedPO.vendor?.address1 || ''}, ${selectedPO.vendor?.city || ''}<br/>
//                 GSTIN/UIN: ${selectedPO.vendor?.gstNumber || 'N/A'}<br/>
//                 State Name: ${selectedPO.vendor?.state || 'N/A'}, Code: ${vendorStateCode || 'N/A'}
                
//                 <div class="tax-details">
//                   <b>Transaction Type:</b> ${isIntraState ? 'INTRA-STATE (CGST+SGST)' : 'INTER-STATE (IGST)'}
//                 </div>
//                 <div class="tax-notice">
//                   ${isIntraState 
//                     ? `CGST @${(taxRate/2*100).toFixed(0)}% + SGST @${(taxRate/2*100).toFixed(0)}% applicable` 
//                     : `IGST @${(taxRate*100).toFixed(0)}% applicable`}
//                 </div>
//               </td>
  
//               <td style="width:50%; padding:0;">
//                 <table class="meta-table">
//                   <tr>
//                     <td><span class="label">Voucher No.</span><br/>${selectedPO.voucherNo || ''}</td>
//                     <td><span class="label">Dated</span><br/>${invoiceDate}</td>
//                   </tr>
//                   <tr>
//                     <td></td>
//                     <td><span class="label">Mode/Terms of Payment</span><br/></td>
//                   </tr>
//                   <tr>
//                     <td><span class="label">Reference No. & Date</span><br/></td>
//                     <td><span class="label">Other References</span><br/></td>
//                   </tr>
              
//                   <tr>
//                     <td><span class="label">Dispatched through</span><br/></td>
//                     <td><span class="label">Destination</span><br/><b>All Alpha Area</b></td>
//                   </tr>
//                   <tr>
//                     <td colspan="2"><span class="label">Terms of Delivery</span><br/></td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>
//           </table>
  
//           <table class="main-border" style="margin-top:10px;">
//             <thead>
//               <tr>
//                 <th style="width: 5%;">Sl No.</th>
//                 <th style="width: 35%;">Description of Goods</th>
//                 <th style="width: 10%;">Due on</th>
//                 <th style="width: 10%;">Quantity</th>
//                 <th style="width: 10%;">Rate</th>
//                 <th style="width: 10%;">Per</th>
//                 <th style="width: 20%;">Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${products.map((product, i) => `
//                 <tr>
//                   <td>${pageIndex * productsPerPage + i + 1}</td>
//                   <td>${product.product?.productTitle || 'N/A'}</td>
//                   <td>${new Date(selectedPO.date).toLocaleDateString('en-GB')}</td>
//                   <td class="right">${product.purchasedQuantity}</td>
//                   <td class="right">${product.price.toFixed(2)}</td>
//                   <td>${product.product?.trackSerialNumber === 'Yes' ? 'Pcs' : 'Nos'}</td>
//                   <td class="right">${(product.price * product.purchasedQuantity).toFixed(2)}</td>
//                 </tr>
//               `).join('')}
              
//               ${pageIndex === pages.length - 1 ? `
//                 <tr>
//                   <td colspan="5" rowspan="${isIntraState ? '5' : '3'}"></td>
//                   <td><b>Sub Total</b></td>
//                   <td class="right">${totalBeforeTax.toFixed(2)}</td>
//                 </tr>
//                 ${isIntraState ? `
//                   <tr>
//                     <td><b>CGST @${(taxRate/2*100).toFixed(0)}%</b></td>
//                     <td class="right">${cgst.toFixed(2)}</td>
//                   </tr>
//                   <tr>
//                     <td><b>SGST @${(taxRate/2*100).toFixed(0)}%</b></td>
//                     <td class="right">${sgst.toFixed(2)}</td>
//                   </tr>
//                 ` : `
//                   <tr>
//                     <td><b>IGST @${(taxRate*100).toFixed(0)}%</b></td>
//                     <td class="right">${igst.toFixed(2)}</td>
//                   </tr>
//                 `}
//                 <tr>
//                   <td><b>Round Off</b></td>
//                   <td class="right">${roundOff.toFixed(2)}</td>
//                 </tr>
//                 <tr>
//                   <td><b>Grand Total</b></td>
//                   <td class="right">${total.toFixed(2)}</td>
//                 </tr>
//                 <tr>
//                   <td colspan="7">
//                     <b>Amount Chargeable (in words):</b>
//                     <i>INR ${numToWords(Math.floor(total))} Only</i>
//                   </td>
//                 </tr>
//               ` : ''}
//             </tbody>
//           </table>
          
//           ${pageIndex === pages.length - 1 ? `
//             <div class="declaration-section">
//               <div class="declaration-left">
//                 <div class="bold">Declaration</div>
//                 <div>Payment Terms & Conditions</div>
//                 <div>1. PO valid for 30 days</div>
//                 <div>2. Taxes will be applicable</div>
//                 <div>3. Default or damaged goods will not be accepted.</div>
//               </div>
//               <div class="declaration-right">
//                 <div class="bold">For SSV Telecom Private Limited</div>
  
//                 ${
//                   selectedPO.status === 'approved'
//                     ? `
//                       <div style="margin-top:20px">
//                         <b>${selectedPO.approvedBy?.fullName || 'N/A'},</b>
//                         <p>(${formatDate(selectedPO.approvedAt)})</p>
//                       </div>
//                     `
//                     : ''
//                 }
//                 <div class="signature-line">
//                   Authorised Signatory
//                 </div>
//               </div>
//             </div>
//            <div class="computer-generated">
//               This is a Computer Generated Document
//              </div>
//           ` : ''}
          
//           ${pageIndex < pages.length - 1 ? `
//             <div class="footer-note">continued ...</div>
//             <div class="page-break"></div>
//           ` : ''}
//         `).join('')}
//          <button class="print-button" onclick="window.print()">🖨️ Print</button>
//       </body>
//       </html>
//     `;
  
//     const newWindow = window.open('', '_blank');
//     newWindow.document.write(invoiceHTML);
//     newWindow.document.close();
//   };

//   const filteredCustomers = customers.filter(customer => {
//     if (activeSearch.keyword || activeSearch.outlet || activeSearch.startDate || activeSearch.endDate) {
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

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     });
//   };

//   const approvePO = async (poId, voucherNo) => {
//     const confirmed = await confirmAction(
//       'Approve Purchase Order',
//       `Are you sure you want to approve PO: ${voucherNo}?`,
//       'question',
//       'Yes, Approve!'
//     );
    
//     if (!confirmed) return;

//     try {
//       setLoading(true);
//       const response = await axiosInstance.put(`/raisePO/${poId}/approve`);
      
//       if (response.data.success) {
//         showSuccess('PO approved successfully!');
//         fetchData(activeSearch, currentPage);
//       } else {
//         throw new Error(response.data.message || 'Failed to approve PO');
//       }
//     } catch (error) {
//       console.error('Error approving PO:', error);
//       showError(error.response?.data?.message || 'Failed to approve PO');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const rejectPO = async (poId, voucherNo) => {
//     const confirmed = await confirmAction(
//       'Reject Purchase Order',
//       `Are you sure you want to reject PO: ${voucherNo}?`,
//       'warning',
//       'Yes, Reject!',
//       'No, Keep it'
//     );
    
//     if (!confirmed) return;

//     try {
//       setLoading(true);
//       const response = await axiosInstance.put(`/raisePO/${poId}/reject`);
      
//       if (response.data.success) {
//         showSuccess('PO rejected successfully!');
//         fetchData(activeSearch, currentPage);
//       } else {
//         throw new Error(response.data.message || 'Failed to reject PO');
//       }
//     } catch (error) {
//       console.error('Error rejecting PO:', error);
//       showError(error.response?.data?.message || 'Failed to reject PO');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const hasActiveFilters = activeSearch.keyword || activeSearch.outlet || activeSearch.startDate || activeSearch.endDate;

//   return (
//     <div>
//       <div className='title'>Raise PO</div>
    
//       <SearchStockPurchase
//         visible={searchModalVisible}
//         onClose={() => setSearchModalVisible(false)}
//         onSearch={handleSearch}
//         centers={centers}
//       />
      
//       <CCard className='table-container mt-4'>
//         <CCardHeader className='card-header d-flex justify-content-between align-items-center'>
//           <div>
//             {hasPermission('Purchase', 'add_purchase_stock') && (
//               <Link to='/add-po'>
//                 <CButton size="sm" className="action-btn me-1">
//                   <CIcon icon={cilPlus} className='icon'/> Add
//                 </CButton>
//               </Link>
//             )}
//             <CButton 
//               size="sm" 
//               className="action-btn me-1"
//               onClick={() => setSearchModalVisible(true)}
//             >
//               <CIcon icon={cilSearch} className='icon' /> Search
//             </CButton>
//             {hasActiveFilters && (
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
//               onClick={generateInvoice}
//               disabled={!selectedPO}
//             >
//               <CIcon icon={cilPrint} className='icon' /> 
//               View PO
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
//                   <CTableHeaderCell scope="col">Select</CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('outlet')} className="sortable-header">
//                     Branch {getSortIcon('outlet')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
//                     Date {getSortIcon('date')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('voucherNo')} className="sortable-header">
//                     Voucher NO {getSortIcon('voucherNo')}
//                   </CTableHeaderCell>
//                   <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
//                     Vendor {getSortIcon('vendor.businessName')}
//                   </CTableHeaderCell>
//                   {(userRole === 'admin' || userRole === 'superadmin') &&   <CTableHeaderCell scope="col" className="sortable-header">
//                     Action
//                   </CTableHeaderCell>
//                    }
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {filteredCustomers.length > 0 ? (
//                   <>
//                     {filteredCustomers.map((customer) => (
//                       <CTableRow 
//                         key={customer._id} 
//                         className={`${customer.status === 'approved' ? 'use-product-row' : ''} ${customer.status === 'rejected' ? 'damage-product-row' : ''}`}
//                       >
//                         <CTableDataCell>
//                           <CFormCheck
//                             type="checkbox"
//                             name="selectedPO"
//                             checked={selectedPO?._id === customer._id}
//                             onChange={() => handleSelectPO(customer)}
//                           />
//                         </CTableDataCell>
//                         <CTableDataCell>
//                           {customer.outlet?.centerName || ''}
//                         </CTableDataCell>
//                         <CTableDataCell>{formatDate(customer.date)}</CTableDataCell>
//                         <CTableDataCell>
//                             {customer.voucherNo}
//                         </CTableDataCell>
//                         <CTableDataCell>{customer.vendor?.businessName || 'N/A'}</CTableDataCell>
//                         {(userRole === 'admin' || userRole === 'superadmin') && 
//                         <CTableDataCell>
//                           <div className="dropdown-container" ref={el => dropdownRefs.current[customer._id] = el}>
//                           {customer.status === 'pending' && (
//                             <CButton 
//                               size="sm"
//                               className='option-button btn-sm'
//                               onClick={() => toggleDropdown(customer._id)}
//                             >
//                               <CIcon icon={cilSettings} />
//                               Options
//                             </CButton>
//                           )}
//                             {dropdownOpen[customer._id] && (
//                               <div className="dropdown-menu show">
//                                     <button 
//                                       className="dropdown-item text-success"
//                                       onClick={() => approvePO(customer._id, customer.voucherNo)}
//                                     >
//                                       <CIcon icon={cilCheck} className="me-2" />
//                                       Approve
//                                     </button>
//                                     <button 
//                                       className="dropdown-item text-danger"
//                                       onClick={() => rejectPO(customer._id, customer.voucherNo)}
//                                     >
//                                       <CIcon icon={cilX} className="me-2" />
//                                       Reject
//                                     </button>
//                               </div>
//                             )}
//                           </div>
//                         </CTableDataCell>
//                         }
//                       </CTableRow>
//                     ))}
//                   </>
//                 ) : (
//                   <CTableRow>
//                     <CTableDataCell colSpan="6" className="text-center">
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

// export default StockPurchase;




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
  CFormCheck
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilSearch, cilPlus, cilZoomOut, cilSettings, cilCheck, cilX, cilPrint } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { CFormLabel } from '@coreui/react-pro';
import axiosInstance from 'src/axiosInstance';

import Pagination from 'src/utils/Pagination';
import { confirmAction, showError, showSuccess } from 'src/utils/sweetAlerts';
import usePermission from 'src/utils/usePermission';
import SearchStockPurchase from '../stockPurchase/SearchStockPurchase';

const StockPurchase = () => {
  const [customers, setCustomers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [activeSearch, setActiveSearch] = useState({ 
    keyword: '', 
    outlet: '', 
    startDate: '', 
    endDate: '' 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPO, setSelectedPO] = useState(null);
  
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = (user?.role?.roleTitle || '').toLowerCase();

  const dropdownRefs = useRef({});
  const navigate = useNavigate();

  const { hasPermission } = usePermission(); 

  const numToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    if (num < 10) return ones[Math.floor(num)];
    if (num < 20) return teens[Math.floor(num) - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    
    if (num < 1000) {
      return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' and ' + numToWords(num % 100) : '');
    }
    
    if (num < 100000) {
      return numToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numToWords(num % 1000) : '');
    }
    
    if (num < 10000000) {
      return numToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + numToWords(num % 100000) : '');
    }
    
    return numToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 !== 0 ? ' ' + numToWords(num % 10000000) : '');
  };

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
      const url = params.toString() ? `/raisePO?${params.toString()}` : '/raisePO';
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

  const toggleDropdown = (id) => {
    setDropdownOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const closeAllDropdowns = () => {
    setDropdownOpen({});
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

  const handleSelectPO = (po) => {
    if (selectedPO?._id === po._id) {
      setSelectedPO(null);
    } else {
      setSelectedPO(po);
    }
  };

  const generateInvoice = () => {
    if (!selectedPO) {
      showError('Please select a PO first');
      return;
    }
  
    const invoiceDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    }).replace(/\//g, '-');
  
    const totalBeforeTax = selectedPO.products.reduce((sum, product) => 
      sum + (product.price * product.purchasedQuantity), 0
    );
    
    const vendorState = selectedPO.vendor?.state || '';
    const isIntraState = vendorState.toLowerCase().includes('maharashtra'); 
    
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let taxRate = 0.18; 
    
    if (isIntraState) {
      cgst = totalBeforeTax * (taxRate / 2);
      sgst = totalBeforeTax * (taxRate / 2);
    } else {
      igst = totalBeforeTax * taxRate;
    }
    
    const roundOff = Math.round(totalBeforeTax + cgst + sgst + igst) - (totalBeforeTax + cgst + sgst + igst);
    const total = totalBeforeTax + cgst + sgst + igst + roundOff;
  
    const productsPerPage = 8;
    const pages = [];
    for (let i = 0; i < selectedPO.products.length; i += productsPerPage) {
      pages.push(selectedPO.products.slice(i, i + productsPerPage));
    }
  
    const getStateCodeFromGSTIN = (gstin) => {
      if (!gstin || gstin.length < 2) return '';
      return gstin.substring(0, 2);
    };
  
    const buyerGSTIN = '27ABECS3422Q1ZX';
    const buyerStateCode = getStateCodeFromGSTIN(buyerGSTIN);
    const vendorGSTIN = selectedPO.vendor?.gstNumber || '';
    const vendorStateCode = getStateCodeFromGSTIN(vendorGSTIN);
  
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${selectedPO.voucherNo}</title>
        <style>
          @page { 
            size: A4; 
            margin: 12mm; 
          }
          body { 
            font-family: Arial, sans-serif; 
            color: #000; 
            margin: 0; 
            padding: 0;
          }
          @media screen {
            body {
              margin-left: 100px;
              margin-right: 100px;
              margin-top: 20px;
              margin-bottom: 20px;
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
          }

          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .print-button {
              display: none;
            }
            .page-break { 
              page-break-before: always; 
            }
          }
          
          .title { 
            text-align: center; 
            font-weight: bold; 
            font-size: 18px; 
            margin: 10px; 
          }
          .main-border { 
            border: 1px solid #000; 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 10px;
          }
          .main-border td, .main-border th { 
            border: 1px solid #000; 
            padding: 5px; 
            vertical-align: top; 
          }
          .meta-table { 
            width: 100%; 
            border-collapse: collapse; 
          }
          .meta-table td { 
            border: 1px solid #000; 
            padding: 6px; 
            vertical-align: top; 
          }
          .label { 
            font-weight: bold; 
          }
          .right { 
            text-align: right; 
          }
          .bold { 
            font-weight: bold; 
          }
          .footer-note { 
            font-style: italic; 
            text-align: right; 
            margin-top: 4px; 
          }
          hr {
            margin: 4px 0;
            border: none;
            border-top: 1px solid #000;
          }
          i {
            font-style: italic;
            margin-left: 10px;
          }
  
          .declaration-section {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
          }
          .declaration-left {
            width: 48%;
          }
          .declaration-right {
            width: 48%;
            text-align: center;
          }
          .signature-line {
            margin-top: 60px;
            border-top: 1px solid #000;
            padding-top: 5px;
          }
          .computer-generated {
            text-align: center;
            font-style: italic;
            margin-top: 50px;
          }
          .tax-details {
            margin-top: 10px;
            font-size: 12px;
          }
          .tax-notice {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="title">PURCHASE ORDER</div>
        ${pages.map((products, pageIndex) => `
          <table class="main-border">
            <tr>
              <td style="width:50%;">
                <div style="border-bottom:1px solid #000; padding-bottom:6px; margin-bottom:6px;">
                  <p>Invoice To</p>
                  <div class="bold">SSV Telecom Private Limited FY 22-23</div>
                  A-1, Landmark CHS, Sector 14<br/>
                  Vashi, Navi Mumbai<br/>
                  ${buyerGSTIN}<br/>
                  GSTIN/UIN: ${buyerGSTIN}<br/>
                  State Name: Maharashtra, Code: ${buyerStateCode}
                </div>
  
                <span class="label">Consignee (Ship to)</span><br/>
                <div class="bold">SSV Telecom Private Limited FY 22-23</div>
                A-1, Landmark CHS, Sector 14<br/>
                Vashi, Navi Mumbai<br/>
                ${buyerGSTIN}<br/>
                GSTIN/UIN: 27AEGFS1650E1Z6<br/>
                State Name: Maharashtra, Code: 27
                <hr/>
  
                <span class="label">Supplier (Bill from)</span><br/>
                ${selectedPO.vendor?.businessName || ' '}<br/>
                ${selectedPO.vendor?.address1 || ''}, ${selectedPO.vendor?.city || ''}<br/>
                GSTIN/UIN: ${selectedPO.vendor?.gstNumber || 'N/A'}<br/>
                State Name: ${selectedPO.vendor?.state || 'N/A'}, Code: ${vendorStateCode || 'N/A'}
                
                <div class="tax-details">
                  <b>Transaction Type:</b> ${isIntraState ? 'INTRA-STATE (CGST+SGST)' : 'INTER-STATE (IGST)'}
                </div>
                <div class="tax-notice">
                  ${isIntraState 
                    ? `CGST @${(taxRate/2*100).toFixed(0)}% + SGST @${(taxRate/2*100).toFixed(0)}% applicable` 
                    : `IGST @${(taxRate*100).toFixed(0)}% applicable`}
                </div>
              </td>
  
              <td style="width:50%; padding:0;">
                <table class="meta-table">
                  <tr>
                    <td><span class="label">Voucher No.</span><br/>${selectedPO.voucherNo || ''}</td>
                    <td><span class="label">Dated</span><br/>${invoiceDate}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td><span class="label">Mode/Terms of Payment</span><br/></td>
                  </tr>
                  <tr>
                    <td><span class="label">Reference No. & Date</span><br/></td>
                    <td><span class="label">Other References</span><br/></td>
                  </tr>
              
                  <tr>
                    <td><span class="label">Dispatched through</span><br/></td>
                    <td><span class="label">Destination</span><br/><b>All Alpha Area</b></td>
                  <tr>
                  <tr>
                    <td colspan="2"><span class="label">Terms of Delivery</span><br/></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
  
          <table class="main-border" style="margin-top:10px;">
            <thead>
              <tr>
                <th style="width: 5%;">Sl No.</th>
                <th style="width: 35%;">Description of Goods</th>
                <th style="width: 10%;">Due on</th>
                <th style="width: 10%;">Quantity</th>
                <th style="width: 10%;">Rate</th>
                <th style="width: 10%;">Per</th>
                <th style="width: 20%;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${products.map((product, i) => `
                <tr>
                  <td>${pageIndex * productsPerPage + i + 1}</td>
                  <td>${product.product?.productTitle || 'N/A'}</td>
                  <td>${new Date(selectedPO.date).toLocaleDateString('en-GB')}</td>
                  <td class="right">${product.purchasedQuantity}</td>
                  <td class="right">${product.price.toFixed(2)}</td>
                  <td>${product.product?.trackSerialNumber === 'Yes' ? 'Pcs' : 'Nos'}</td>
                  <td class="right">${(product.price * product.purchasedQuantity).toFixed(2)}</td>
                </tr>
              `).join('')}
              
              ${pageIndex === pages.length - 1 ? `
                <tr>
                  <td colspan="5" rowspan="${isIntraState ? '5' : '3'}"></td>
                  <td><b>Sub Total</b></td>
                  <td class="right">${totalBeforeTax.toFixed(2)}</td>
                </tr>
                ${isIntraState ? `
                  <tr>
                    <td><b>CGST @${(taxRate/2*100).toFixed(0)}%</b></td>
                    <td class="right">${cgst.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td><b>SGST @${(taxRate/2*100).toFixed(0)}%</b></td>
                    <td class="right">${sgst.toFixed(2)}</td>
                  </tr>
                ` : `
                  <tr>
                    <td><b>IGST @${(taxRate*100).toFixed(0)}%</b></td>
                    <td class="right">${igst.toFixed(2)}</td>
                  </tr>
                `}
                <tr>
                  <td><b>Round Off</b></td>
                  <td class="right">${roundOff.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><b>Grand Total</b></td>
                  <td class="right">${total.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="7">
                    <b>Amount Chargeable (in words):</b>
                    <i>INR ${numToWords(Math.floor(total))} Only</i>
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
          
          ${pageIndex === pages.length - 1 ? `
            <div class="declaration-section">
              <div class="declaration-left">
                <div class="bold">Declaration</div>
                <div>Payment Terms & Conditions</div>
                <div>1. PO valid for 30 days</div>
                <div>2. Taxes will be applicable</div>
                <div>3. Default or damaged goods will not be accepted.</div>
              </div>
              <div class="declaration-right">
                <div class="bold">For SSV Telecom Private Limited</div>
  
                ${
                  selectedPO.status === 'approved'
                    ? `
                      <div style="margin-top:20px">
                        <b>${selectedPO.approvedBy?.fullName || 'N/A'},</b>
                        <p>(${formatDate(selectedPO.approvedAt)})</p>
                      </div>
                    `
                    : ''
                }
                <div class="signature-line">
                  Authorised Signatory
                </div>
              </div>
            </div>
           <div class="computer-generated">
              This is a Computer Generated Document
             </div>
          ` : ''}
          
          ${pageIndex < pages.length - 1 ? `
            <div class="footer-note">continued ...</div>
            <div class="page-break"></div>
          ` : ''}
        `).join('')}
         <button class="print-button" onclick="window.print()">🖨️ Print</button>
      </body>
      </html>
    `;
  
    const newWindow = window.open('', '_blank');
    newWindow.document.write(invoiceHTML);
    newWindow.document.close();
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

 const approvePO = async (poId, voucherNo) => {
  // Use native confirm as fallback
  const confirmed = window.confirm(`Are you sure you want to approve PO: ${voucherNo}?`);
  
  if (!confirmed) return;

  try {
    setLoading(true);
    closeAllDropdowns();
    const response = await axiosInstance.put(`/raisePO/${poId}/approve`);
    
    if (response.data.success) {
      showSuccess('PO approved successfully!');
      fetchData(activeSearch, currentPage);
    } else {
      throw new Error(response.data.message || 'Failed to approve PO');
    }
  } catch (error) {
    console.error('Error approving PO:', error);
    showError(error.response?.data?.message || 'Failed to approve PO');
  } finally {
    setLoading(false);
  }
};

const rejectPO = async (poId, voucherNo) => {
  // Use native confirm as fallback
  const confirmed = window.confirm(`Are you sure you want to reject PO: ${voucherNo}?`);
  
  if (!confirmed) return;

  try {
    setLoading(true);
    closeAllDropdowns();
    const response = await axiosInstance.put(`/raisePO/${poId}/reject`);
    
    if (response.data.success) {
      showSuccess('PO rejected successfully!');
      fetchData(activeSearch, currentPage);
    } else {
      throw new Error(response.data.message || 'Failed to reject PO');
    }
  } catch (error) {
    console.error('Error rejecting PO:', error);
    showError(error.response?.data?.message || 'Failed to reject PO');
  } finally {
    setLoading(false);
  }
};

const revertToPending = async (poId, voucherNo) => {
  // Use native confirm as fallback
  const confirmed = window.confirm(`Are you sure you want to revert PO: ${voucherNo} back to pending status?`);
  
  if (!confirmed) return;

  try {
    setLoading(true);
    closeAllDropdowns();
    const response = await axiosInstance.patch(`/raisePO/${poId}/change-to-pending`);
    
    if (response.data.success) {
      showSuccess('PO reverted to pending successfully!');
      fetchData(activeSearch, currentPage);
    } else {
      throw new Error(response.data.message || 'Failed to revert PO');
    }
  } catch (error) {
    console.error('Error reverting PO:', error);
    showError(error.response?.data?.message || 'Failed to revert PO to pending');
  } finally {
    setLoading(false);
  }
};

  const hasActiveFilters = activeSearch.keyword || activeSearch.outlet || activeSearch.startDate || activeSearch.endDate;

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className='title'>Raise PO</div>
    
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
              <Link to='/add-po'>
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
              onClick={generateInvoice}
              disabled={!selectedPO}
            >
              <CIcon icon={cilPrint} className='icon' /> 
              View PO
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
                  <CTableHeaderCell scope="col">Select</CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('outlet')} className="sortable-header">
                    Branch {getSortIcon('outlet')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('date')} className="sortable-header">
                    Date {getSortIcon('date')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('voucherNo')} className="sortable-header">
                    Voucher NO {getSortIcon('voucherNo')}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" onClick={() => handleSort('vendor.businessName')} className="sortable-header">
                    Vendor {getSortIcon('vendor.businessName')}
                  </CTableHeaderCell>
                  {(userRole === 'admin' || userRole === 'superadmin') && (
                    <CTableHeaderCell scope="col" className="sortable-header">
                      Action
                    </CTableHeaderCell>
                  )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredCustomers.length > 0 ? (
                  <>
                    {filteredCustomers.map((customer) => (
                      <CTableRow 
                        key={customer._id} 
                        className={`${customer.status === 'approved' ? 'use-product-row' : ''} ${customer.status === 'rejected' ? 'damage-product-row' : ''}`}
                      >
                        <CTableDataCell>
                          <CFormCheck
                            type="checkbox"
                            name="selectedPO"
                            checked={selectedPO?._id === customer._id}
                            onChange={() => handleSelectPO(customer)}
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          {customer.outlet?.centerName || ''}
                        </CTableDataCell>
                        <CTableDataCell>{formatDate(customer.date)}</CTableDataCell>
                        <CTableDataCell>
                          {customer.voucherNo}
                        </CTableDataCell>
                        <CTableDataCell>{customer.vendor?.businessName || 'N/A'}</CTableDataCell>
                        {(userRole === 'admin' || userRole === 'superadmin') && (
                          <CTableDataCell>
                            <div className="dropdown-container" ref={el => dropdownRefs.current[customer._id] = el}>
                              {customer.status === 'pending' && (
                                <CButton 
                                  size="sm"
                                  className='option-button btn-sm'
                                  onClick={() => toggleDropdown(customer._id)}
                                >
                                  <CIcon icon={cilSettings} />
                                  Options
                                </CButton>
                              )}
                              
                              {customer.status === 'rejected' && (
                                <CButton 
                                  size="sm"
                                  className='option-button btn-sm btn-warning'
                                  onClick={() => revertToPending(customer._id, customer.voucherNo)}
                                >
                                  <CIcon icon={cilSettings} />
                                  Revert
                                </CButton>
                              )}
                              
                              {dropdownOpen[customer._id] && (
                                <div className="dropdown-menu show">
                                  <button 
                                    className="dropdown-item text-success"
                                    onClick={() => approvePO(customer._id, customer.voucherNo)}
                                  >
                                    <CIcon icon={cilCheck} className="me-2" />
                                    Approve
                                  </button>
                                  <button 
                                    className="dropdown-item text-danger"
                                    onClick={() => rejectPO(customer._id, customer.voucherNo)}
                                  >
                                    <CIcon icon={cilX} className="me-2" />
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          </CTableDataCell>
                        )}
                      </CTableRow>
                    ))}
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

export default StockPurchase;