

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { CCard, CCardBody, CButton, CSpinner, CContainer, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CFormText, CAlert, CBadge, CTooltip } from '@coreui/react';
// import RejectionReasonModal from './RejectionReasonModal';
// import axiosInstance from 'src/axiosInstance';
// import '../../css/profile.css'
// import '../../css/form.css';
// import companyLogo from '../../assets/images/logo.png'
// import ShipGoodsModal from './ShipGoodsModal';
// import IncompleteRemarkModal from './IncompleteRemarkModal';
// import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
// import SerialNumbers from './SerialNumbers';
// import ReceivedSerialNumbers from './ReceivedSerialNumbers';
// import usePermission from 'src/utils/usePermission';
// import ChallanModal from './ChallanModal';
// import Swal from 'sweetalert2';
// const StockProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [approvedProducts, setApprovedProducts] = useState([]);
//   const [alert, setAlert] = useState({ type: '', message: '', visible: false });
//   const [shipmentModal, setShipmentModal] = useState(false)
//   const [errors, setErrors] = useState({});
//   const [currentShipmentAction, setCurrentShipmentAction] = useState(null);
//   const [incompleteModal, setIncompleteModal] = useState(false);

//   const [productReceipts, setProductReceipts] = useState([]);
//   const [serialModalVisible, setSerialModalVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [assignedSerials, setAssignedSerials] = useState({});
//   const [challanModal, setChallanModal] = useState(false);
//   const [rejectionModal, setRejectionModal] = useState(false);
//   const [receivedSerialModal, setReceivedSerialModal] = useState(false);
//   const [selectedReceivedProduct, setSelectedReceivedProduct] = useState(null);
  
//   const user = JSON.parse(localStorage.getItem('user')) || {};
//   const userRole = (user?.role?.roleTitle || '').toLowerCase();
//   const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
//   const userCenterType = (userCenter.centerType || 'Outlet').toLowerCase();
  
//   const userCenterId = userCenter._id;
//   const isCenter = data?.center?._id === userCenterId;
//   const isWarehouse = data?.warehouse?._id === userCenterId;

//   const showStockQty = userRole === 'admin' || 'superadmin';

//   const [shipmentData, setShipmentData] = useState({
//     shippedDate: '',
//     expectedDeliveryDate: '',
//     shipmentDetails: '',
//     shipmentRemark: '',
//     documents: []
//   });
  
//   const { hasPermission, hasAnyPermission } = usePermission();
  
//   const handleOpenSerialModal = (product) => {
//     setSelectedProduct(product);
//     setSerialModalVisible(true);
//   };
  
//   const handleOpenReceivedSerialModal = (product) => {
//     setSelectedReceivedProduct(product);
//     setReceivedSerialModal(true);
//   };
   
//   const handleSerialNumbersUpdate = (productId, serialsArray) => {
//     setAssignedSerials(prev => ({
//       ...prev,
//       [productId]: serialsArray
//     }));
//   };
  
//   const openRejectionModal = () => {
//     setRejectionModal(true);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await axiosInstance.get(`/stockrequest/${id}`);
//         if (response.data.success) {
//           const stockData = response.data.data;
//           setData(stockData);

//           const initialApproved = stockData.products.map(item => ({
//             _id: item._id,
//             productId: item.product?._id,
//             approvedQty:
//               item.approvedQuantity !== undefined && item.approvedQuantity !== null
//                 ? item.approvedQuantity
//                 : item.quantity || '',
//             approvedRemark: item.approvedRemark || ''
//           }));
//           setApprovedProducts(initialApproved);
  
//           const initialSerials = {};
//           stockData.products.forEach(item => {
//             if (item.product?.trackSerialNumber === "Yes" && item.approvedSerials?.length > 0) {
//               initialSerials[item.product._id] = item.approvedSerials.map(sn => ({ serialNumber: sn }));
//             }
//           });
//           setAssignedSerials(initialSerials);
  
//         } else {
//           throw new Error('Failed to fetch data');
//         }
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     if (id) fetchData();
//   }, [id]);

//   const handleShipGoods = async (shipmentData) => {
//     try {
//       const response = await axiosInstance.post(`/stockrequest/${id}/ship`, shipmentData)
//       if (response.data.success) {
//         setAlert({ type: 'success', message: 'Shipment created successfully', visible: true })
//         setShipmentModal(false)
//         try {
//           await axiosInstance.patch(`/stockrequest/${id}/warehouse-challan-approval`, { 
//             warehouseChallanApproval: 'approved' 
//           });
//           console.log('Challan auto-approved after shipment');
//         } catch (challanError) {
//           console.error('Failed to auto-approve challan:', challanError);
//         }
        
//         setTimeout(() => window.location.reload(), 1000)
//       } else {
//         setAlert({ type: 'danger', message: 'Failed to create shipment', visible: true })
//       }
//     } catch (err) {
//       console.error(err)
//       setAlert({ type: 'danger', message: 'Error creating shipment', visible: true })
//     }
//   }

//   const handleBack = () => navigate('/stock-request');

//   useEffect(() => {
//     if (data?.products) {
//       const initialReceipts = data.products.map(item => ({
//         productId: item.product?._id, 
//         receivedQuantity: item.receivedQuantity || 0,
//         receivedRemark: item.receivedRemark,
//       }));
//       setProductReceipts(initialReceipts);
//     }
//   }, [data]);
  
//   const handleReceiptChange = (productId, field, value) => {
//     setProductReceipts(prev =>
//       prev.map(p => (p.productId === productId ? { ...p, [field]: value } : p))
//     );
//   };

//   const handleApprovedChange = (productId, field, value) => {
//     if (field === 'approvedQty') {
//       if (value === '' || /^\d+$/.test(value)) {
//         setErrors(prev => ({ ...prev, [productId]: undefined }));
//       } else {
//         setErrors(prev => ({ ...prev, [productId]: 'The input value was not a correct number' }));
//       }
//     }
  
//     setApprovedProducts(prev =>
//       prev.map(p =>
//         p._id === productId ? { ...p, [field]: value } : p
//       )
//     );
//   };  

// const handleApprove = async () => {
//   let hasError = false;

//   const payload = approvedProducts.map(p => {
//     if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
//       setErrors(prev => ({ ...prev, [p._id]: 'The input value was not a correct number' }));
//       hasError = true;
//     }
//     const productSerials = assignedSerials[p.productId] || [];
//     const limitedSerials = productSerials.slice(0, Number(p.approvedQty));

//     return {
//       productId: p.productId,
//       approvedQuantity: Number(p.approvedQty),
//       approvedRemark: p.approvedRemark || '',
//       approvedSerials: limitedSerials.map(s => s.serialNumber),
//     };
//   });

//   if (hasError) return;

//   try {
//     const response = await axiosInstance.post(`/stockrequest/${id}/approve`, {
//       productApprovals: payload,
//     });
//     if (!response.data.success) {
//       setAlert({
//         type: 'danger',
//         message: response.data.message || 'Failed to approve request',
//         visible: true,
//       });
//       return;
//     }
//     setAlert({
//       type: 'success',
//       message: 'Stock request approved successfully',
//       visible: true,
//     });
//     setTimeout(() => window.location.reload(), 1000);
//   } catch (err) {
//     console.error(err);

//     const errorMessage =
//       err.response?.data?.message ||
//       err.message || 
//       'An unexpected error occurred';

//     setAlert({
//       type: 'danger',
//       message: errorMessage,
//       visible: true,
//     });
//   }
// };

// const handleReject = async (rejectionReason) => {
//   try {
//     const response = await axiosInstance.put(`/stockrequest/${id}`, { 
//       status: 'Rejected', 
//       rejectionReason: rejectionReason 
//     });
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Stock request rejected successfully', visible: true });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to reject request', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     const errorMessage = err.response?.data?.message || 'Error rejecting stock request';
//     setAlert({ type: 'danger', message: errorMessage, visible: true });
//   }
// };

// const handleSubmitRequest = async () => {
//   try {
//     const response = await axiosInstance.put(`/stockrequest/${id}`, { status: 'Submitted' });
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Data submitted successfully', visible: true });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to submit', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error to submit data', visible: true });
//   }
// };

// const handleChangeApprovedQty = async () => {
//   let hasError = false;
//   const payload = approvedProducts.map(p => {
//     if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
//       setErrors(prev => ({
//         ...prev,
//         [p._id]: 'The input value was not a correct number',
//       }));
//       hasError = true;
//     }
//     return {
//       productId: p.productId,
//       approvedQuantity: Number(p.approvedQty),
//       approvedRemark: p.approvedRemark || '',
//       approvedSerials: (assignedSerials[p.productId] || []).map(s => s.serialNumber),
//     };
//   });

//   if (hasError) return;
//   console.log("Final payload sent to API:", payload); 
//   try {
//     const response = await axiosInstance.patch(
//       `/stockrequest/${id}/approved-quantities`,
//       { productApprovals: payload }
//     );

//     if (response.data.success) {
//       setAlert({
//         type: 'success',
//         message: 'Approved quantities updated successfully',
//         visible: true,
//       });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({
//         type: 'danger',
//         message: response.data.message || 'Failed to update approved quantities',
//         visible: true,
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     const backendMessage =
//       err.response?.data?.message || 'Error updating approved quantities';

//     setAlert({
//       type: 'danger',
//       message: backendMessage,
//       visible: true,
//     });
//   }
// };

// const handleCancelShipment = async () => {
//   try {
//     const response = await axiosInstance.post(`/stockrequest/${id}/reject-shipment`);
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Shipment canceled successfully', visible: true });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to cancel shipment', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error canceling shipment', visible: true });
//   }
// };

// const handleCompleteIndent = async () => {
//   try {
//     if (userCenterType === 'center') {
//       const missingReceipts = productReceipts.filter(item => 
//         !item.receivedQuantity || item.receivedQuantity === ''
//       );

//       if (missingReceipts.length > 0) {
//         setAlert({
//           type: 'danger',
//           message: 'Please enter received quantity for all products before completing the indent',
//           visible: true,
//         });
//         return;
//       }
//     }

//     let payload = [];

//     if (isCenter) {
//       payload = productReceipts.map(item => ({
//         productId: item.productId,
//         receivedQuantity: Number(item.receivedQuantity) || 0,
//         receivedRemark: item.receivedRemark || '',
//       }));
//     } else {
//       payload = data.products.map(item => ({
//         productId: item.product?._id,
//         receivedQuantity: item.approvedQuantity || item.receivedQuantity || 0,
//         receivedRemark: item.receivedRemark || '',
//       }));
//     }

//     const response = await axiosInstance.post(`/stockrequest/${id}/complete`, {
//       productReceipts: payload,
//     });
    
//     if (!response.data.success) {
//       setAlert({
//         type: 'danger',
//         message: response.data.message || 'Failed to complete indent',
//         visible: true,
//       });
//       return;
//     }
    
//     setAlert({
//       type: 'success',
//       message: 'Indent completed successfully',
//       visible: true,
//     });

//     setTimeout(() => window.location.reload(), 1000);
//   } catch (err) {
//     console.error('Error in handleCompleteIndent:', err);

//     const errorMessage =
//       err.response?.data?.message ||
//       err.message ||
//       'An unexpected error occurred while completing the indent';

//     setAlert({
//       type: 'danger',
//       message: errorMessage,
//       visible: true,
//     });
//   }
// };

// const handleCompleteIndentWithChallan = async () => {
//   const result = await Swal.fire({
//     title: 'Are you sure?',
//     text: 'Do you want to complete this indent and approve the challan?',
//     icon: 'question',
//     showCancelButton: true,
//     confirmButtonColor: '#dc3545',
//     cancelButtonColor: '#6c757d',
//     confirmButtonText: 'Yes, complete it!',
//     cancelButtonText: 'Cancel'
//   });

//   if (!result.isConfirmed) {
//     return;
//   }

//   try {
//     await handleCompleteIndent();
//     const response = await axiosInstance.patch(`/stockrequest/${id}/center-challan-approval`, { 
//       centerChallanApproval: 'approved' 
//     });
    
//     if (response.data.success) {
//       console.log('Challan auto-approved after completion');
//     }
    
//   } catch (err) {
//     console.error('Error in complete process:', err);
//   }
// };

// const handleOpenUpdateShipment = () => {
//   if (data.shippingInfo) {
//     setShipmentData({
//       shippedDate: data.shippingInfo.shippedDate?.split('T')[0] || '',
//       expectedDeliveryDate: data.shippingInfo.expectedDeliveryDate?.split('T')[0] || '',
//       shipmentDetails: data.shippingInfo.shipmentDetails || '',
//       shipmentRemark: data.shippingInfo.shipmentRemark || '',
//       documents: data.shippingInfo.documents || []
//     });
//   }
//   setCurrentShipmentAction(() => handleUpdateShipment);
//   setShipmentModal(true);
// };

// const handleUpdateShipment = async (shipmentData) => {
//   try {
//     const response = await axiosInstance.patch(`/stockrequest/${id}/shipping-info`, shipmentData);
//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Shipment updated successfully', visible: true });
//       setShipmentModal(false);
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: 'Failed to update shipment', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error updating shipment', visible: true });
//   }
// };

// // const handleMarkIncomplete = async (remark) => {
// //   try {
// //     if (userCenterType === 'center') {
// //       const missingReceipts = productReceipts.filter(item => 
// //         !item.receivedQuantity || item.receivedQuantity === '' || Number(item.receivedQuantity) <= 0
// //       );

// //       if (missingReceipts.length > 0) {
// //         setAlert({
// //           type: 'danger',
// //           message: 'Please enter received quantity for all products before marking as incomplete',
// //           visible: true,
// //         });
// //         return;
// //       }
// //     }
// //     const receivedProducts = productReceipts.map(item => ({
// //       productId: item.productId,
// //       receivedQuantity: Number(item.receivedQuantity) || 0,
// //       receivedRemark: item.receivedRemark || '',
// //     }));
// //     const payload = {
// //       incompleteRemark: remark,
// //       receivedProducts,
// //     };
// //     console.log('Incomplete Payload:', payload);
// //     const response = await axiosInstance.post(
// //       `/stockrequest/${id}/mark-incomplete`,
// //       payload
// //     );

// //     if (response.data.success) {
// //       setAlert({
// //         type: 'success',
// //         message: 'Stock request marked as incomplete',
// //         visible: true,
// //       });
// //       setIncompleteModal(false);
// //      setTimeout(() => window.location.reload(), 1000);
// //     } else {
// //       setAlert({
// //         type: 'danger',
// //         message: 'Failed to mark incomplete',
// //         visible: true,
// //       });
// //     }
// //   } catch (err) {
// //     console.error(err);
// //     setAlert({
// //       type: 'danger',
// //       message: 'Error marking incomplete',
// //       visible: true,
// //     });
// //   }
// // };

// const handleMarkIncomplete = async (remark) => {
//   try {
//     if (userCenterType === 'center') {
//       const missingReceipts = productReceipts.filter(item => 
//         item.receivedQuantity === undefined || 
//         item.receivedQuantity === null || 
//         item.receivedQuantity === '' ||
//         isNaN(Number(item.receivedQuantity))
//       );

//       if (missingReceipts.length > 0) {
//         setAlert({
//           type: 'danger',
//           message: 'Please enter received quantity for all products before marking as incomplete',
//           visible: true,
//         });
//         return;
//       }
//     }
    
//     const receivedProducts = productReceipts.map(item => ({
//       productId: item.productId,
//       receivedQuantity: Number(item.receivedQuantity) || 0,
//       receivedRemark: item.receivedRemark || '',
//     }));
    
//     const payload = {
//       incompleteRemark: remark,
//       receivedProducts,
//     };
    
//     console.log('Incomplete Payload:', payload);
//     const response = await axiosInstance.post(
//       `/stockrequest/${id}/mark-incomplete`,
//       payload
//     );

//     if (response.data.success) {
//       setAlert({
//         type: 'success',
//         message: 'Stock request marked as incomplete',
//         visible: true,
//       });
//       setIncompleteModal(false);
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({
//         type: 'danger',
//         message: 'Failed to mark incomplete',
//         visible: true,
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({
//       type: 'danger',
//       message: 'Error marking incomplete',
//       visible: true,
//     });
//   }
// };

// const handleIncomplete = async () => {
//   try {
//     const approvalsPayload = approvedProducts.map(p => {
//       const product = data.products.find(prod => prod.product?._id === p.productId);
//       const isSerialized = product?.product?.trackSerialNumber === "Yes";
      
//       const currentSerials = assignedSerials[p.productId] || [];
      
//       return {
//         productId: p.productId,
//         approvedQuantity: Number(p.approvedQty) || 0,
//         approvedRemark: p.approvedRemark || '',
//         ...(isSerialized && {
//           approvedSerials: currentSerials.map(s => s.serialNumber).slice(0, Number(p.approvedQty))
//         })
//       };
//     });

//     const receiptsPayload = productReceipts.map(r => ({
//       productId: r.productId,
//       receivedQuantity: Number(r.receivedQuantity) || 0,
//       receivedRemark: r.receivedRemark || '',
//     }));

//     console.log('Final Incomplete Payload:', {
//       productApprovals: approvalsPayload,
//       productReceipts: receiptsPayload,
//     });

//     const response = await axiosInstance.patch(
//       `/stockrequest/${id}/complete-incomplete`,
//       {
//         productApprovals: approvalsPayload,
//         productReceipts: receiptsPayload,
//       }
//     );
//     if (!response.data.success) {
//       setAlert({
//         type: 'danger',
//         message: response.data.message || 'Failed to complete indent',
//         visible: true,
//       });
//       return;
//     }
//     setAlert({
//       type: 'success',
//       message: 'Indent completed successfully',
//       visible: true,
//     });

//     setTimeout(() => window.location.reload(), 1000);
//   } catch (err) {
//     console.error('Error in handleIncomplete:', err);
//     const errorMessage =
//       err.response?.data?.message ||
//       err.message ||
//       'An unexpected error occurred while completing the indent';

//     setAlert({
//       type: 'danger',
//       message: errorMessage,
//       visible: true,
//     });
//   }
// };
// const handleApprovedBlur = (productId, value) => {
//     if (value === '' || !/^\d+$/.test(value)) {
//       setErrors(prev => ({ ...prev, [productId]: 'The input value was not a correct number' }));
//     }
// };

// const handlePrintIndent = () => {
//   const printWindow = window.open('', '_blank');
//   const logoPath = companyLogo; 
//   const currentDate = new Date().toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });

//   let subtotal = 0;
//   const gstRate = 18;
  
//   const productsWithTotals = data.products.map(item => {
//     const approvedQty = item.quantity || 0;
//     const salePrice = item.product?.salePrice || 0;
//     const total = approvedQty * salePrice;
//     const gstAmount = (total * gstRate) / 100;
//     const amountWithGst = total + gstAmount;
    
//     subtotal += total;
    
//     return {
//       ...item,
//       approvedQty,
//       salePrice,
//       total,
//       gstAmount,
//       amountWithGst
//     };
//   });

//   const totalGst = (subtotal * gstRate) / 100;
//   const grandTotal = subtotal + totalGst;
//   const indentDate = data.date ? new Date(data.date).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   }) : '';

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return '';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const printContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>Indent Invoice - ${data.orderNumber || ''}</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           margin-left: 200px;
//           margin-right: 200px;
//           margin-top:20px;
//         }
//         .header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//         }
//         .logo {
//           width: 200px;
//           height: 170px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-right: 15px;
//         }
//         .invoice-details {
//           text-align: right; 
//           flex: 1;
//           padding-left: 20px;
//         }
//         .invoice-details p {
//           margin: 5px 0;
//           font-size: 14px;
//           line-height: 1.4; 
//           color:#000
//         }
//         .invoice-details strong {
//           display: block;
//           font-size: 18px;
//         }

//         .indent-info-bar {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           padding: 10px 15px;
//           background-color: #f5f6f7;
//           border-radius: 5px;
//           font-size: 14px;
//           margin-top: -27px
//         }
//         .indent-info-item {
//           display: flex;
//           align-items: center;
//         }
//         .indent-info-label {
//           font-weight: bold;
//           margin-right: 8px;
//           color: #495057;
//         }
//         .indent-info-value {
//           color: #212529;
//         }
        
//         .address-section {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 10px;
//         }
//         .address-section p {
//           margin: 3px 0;
//           font-size: 14px;
//           line-height: 1.3; 
//           color:#000
//         }
//         .warehouse-details {
//           text-align: right;
//         }
// .info-table {
//   width: 100%;
//   border-collapse: collapse;
//   font-size: 13px;
//   border: 1px solid #ddd;
//   table-layout: fixed;
// }

// .info-table td {
//   padding: 8px 10px;
//   border: 1px solid #ddd;
//   vertical-align: top;
// }

// .info-table .label {
//   font-weight: bold;
//   color: #333;
//   width: 15%;
//   background-color: #f5f5f5;
//   white-space: nowrap; 
// }

// .info-table .value {
//   color: #000;
//   width: 35%;
// }

// .info-table td[colspan="3"] {
//   width: auto;
// }
        
//         .products-table {
//           width: 100%;
//           border-collapse: collapse;
//           margin-bottom: 20px;
//           font-size: 13px;
//         }
//         .products-table th {
//           background-color: #333;
//           color: white;
//           padding: 8px;
//           text-align: left;
//           font-weight: 500;
//         }
//         .products-table td {
//           padding: 8px;
//           border: 1px solid #ddd;
//           vertical-align: top;
//         }
//         .products-table tbody tr:nth-child(even) {
//           background-color: #f9f9f9;
//         }
//         .serial-numbers {
//           font-size: 11px;
//           color: #666;
//           max-width: 150px;
//           word-break: break-word;
//         }
        
//         .footer {
//           display: flex;
//           justify-content: flex-end;
//           margin-top: 25px;
//           page-break-after: always;
//         }
        
//         .signature {
//           text-align: center;
//           width: 200px;
//         }
//         .signature p {
//           margin: 5px 0;
//           font-size: 12px;
//         }
//         .signature-line {
//           margin-top: 40px;
//           border-top: 1px solid #000;
//           padding-top: 5px;
//         }
//         .print-button {
//           text-align: center;
//           margin: 20px 0;
//         }
//         .print-button button {
//           padding: 10px 30px;
//           background-color: #3c8dbc;
//           color: white;
//           border: none;
//           cursor: pointer;
//           font-size: 16px;
//           margin: 0 10px;
//         }
//         .print-button button:hover {
//           background-color: #3c8dbc;
//         }
        
//         /* Page break for 14th page */
//         .page-break {
//           page-break-before: always;
//         }
        
//         @media print {
//           body { margin: 0.5in; }
//           .print-button { display: none; }
//           .products-table th { background-color: #333 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//           .info-table .label { background-color: #f5f5f5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//           <div class="logo">
//             <img src="${logoPath}" alt="Company Logo" style="max-width: 100%; max-height: 100%;">
//           </div>
//           <div class="invoice-details">
//           <strong>Sancfil Technologies Internet Services Pvt Ltd</strong>
//           <p>Address : A1, 1st Floor,</p>
//           <p>Landmark Co.operative Housing Society, Sector 14,</p>
//           <p>Vashi, Navi Mumbai - 400 709</p>
//           <p>Tel: +91 809757810 /8097578176,</p>
//           <p>Email-stock@trunet.co.in</p>
//         </div>
//         </div>
      
//       <div class="indent-info-bar">
//         <div class="indent-info-item">
//           <span class="indent-info-label">Indent No:</span>
//           <span class="indent-info-value"><strong>${data.orderNumber || ''}</strong></span>
//         </div>
//         <div class="indent-info-item">
//           <span class="indent-info-label">Indent Date:</span>
//           <span class="indent-info-value">${indentDate}</span>
//         </div>
//         <div class="indent-info-item">
//           <strong>${data.status || ''}</strong>
//         </div>
//       </div>
      
//       <div class="address-section">
//         <div class="center-details">
//           <strong>Center Details</strong>
//           <p><strong>${data.center?.centerName || ''}</strong></p>
//           <p>${data.center?.addressLine1 || ''} ${data.center?.addressLine2 || ''}</p>
//           <p>${data.center?.city || ''}, ${data.center?.state || ''}</p>
//           <p>${data.center?.email || ''}</p>
//         </div>
//         <div class="warehouse-details">
//           <strong>Warehouse Details</strong>
//           <p><strong>${data.warehouse?.centerName || ''}</strong></p>
//           <p>${data.warehouse?.addressLine1 || ''} ${data.warehouse?.addressLine2 || ''}</p>
//           <p>${data.warehouse?.city || ''}, ${data.warehouse?.state || ''}</p>
//           <p>${data.warehouse?.email || ''}</p>
//         </div>
//       </div>
//       <table class="products-table">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Product</th>
//             <th>Qty</th>
//             <th>Rate (₹)</th>
//             <th>Total (₹)</th>
//             <th>GST @${gstRate}% (₹)</th>
//             <th>Amount (₹)</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${productsWithTotals.map((item, index) => {
//             return `
//               <tr>
//                 <td>${index + 1}</td>
//                 <td>${item.product?.productTitle || ''}
//                 </td>
//                 <td>${item.quantity || 0}</td>
//                 <td>${item.salePrice.toFixed(2)}</td>
//                 <td>${item.total.toFixed(2)}</td>
//                 <td>${item.gstAmount.toFixed(2)}</td>
//                 <td><strong>${item.amountWithGst.toFixed(2)}</strong></td>
//               </tr>
//             `;
//           }).join('')}
//         </tbody>
//       </table>
//       <!-- New table format for info grid with 2 items per row -->
// <table class="info-table">
//   <tr>
//     <td class="label">Approved On</td>
//     <td class="value">${formatDateTime(data.approvalInfo?.approvedAt) || 'March 6, 2026'}</td>
//     <td class="label">Shipment Date</td>
//     <td class="value">${formatDate(data.shippingInfo?.shippedDate) || 'March 6, 2026'}</td>
//   </tr>
//   <tr>
//     <td class="label">Expected Delivery</td>
//     <td class="value">${formatDate(data.shippingInfo?.expectedDeliveryDate) || formatDate(data.shippingInfo?.shippedDate) || 'March 6, 2026'}</td>
//     <td class="label">Completed On</td>
//     <td class="value">${formatDateTime(data.completedOn) || '07 Mar 2026'}</td>
//   </tr>
//   <tr>
//     <td class="label">Shipment Detail</td>
//     <td class="value">${data.shippingInfo?.shipmentDetail || ''}</td>
//     <td class="label">Shipment Remark</td>
//     <td class="value">${data.shippingInfo?.shipmentRemark || ''}</td>
//   </tr>
//   <tr>
//     <td class="label">Remark</td>
//     <td class="value" colspan="3">${data.remark || ''}</td>
//   </tr>
// </table>
//       <!-- Signature on right side -->
//       <div class="footer">
//         <div class="signature">
//           <div class="signature-line"></div>
//           <p>Authorized Signatory</p>
//         </div>
//       </div>

//       <!-- Print buttons -->
//       <div class="print-button">
//         <button onclick="window.print()">Print Indent</button>
//         <button onclick="window.close()">Close</button>
//       </div>
//     </body>
//     </html>
//   `;
  
//   printWindow.document.write(printContent);
//   printWindow.document.close();
// };

//   if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}><CSpinner color="primary" /></div>;
//   if (error) return <div className="alert alert-danger"> {error}</div>;
//   if (!data) return <div className="alert alert-warning">Stock Request not found</div>;

//   return (
//     <CContainer fluid>
//       {alert.visible && (
//         <CAlert color={alert.type} dismissible onClose={() => setAlert({ ...alert, visible: false })}>
//           {alert.message}
//         </CAlert>
//       )}

//       <div className="title">
//         <CButton size="sm" className="back-button me-3" onClick={handleBack}>
//           <i className="fa fa-fw fa-arrow-left"></i> Back
//         </CButton>
//         Indent Detail
//       </div>
      
//       <CCard className="profile-card">
//         <div className="subtitle-row">
//           <div className="subtitle">
//             Indent: {data.orderNumber || ''}
//             {data.status && (
//               <span className={`status-badge ${data.status.toLowerCase()}`}>
//                 {data.status}
//               </span>
//             )}
//           </div>

//           <div className="d-flex align-items-center">
//             {data.status === 'Shipped' && hasPermission('Indent', 'complete_indent') && (
//               <CButton className='btn-action btn-incomplete me-2' onClick={handleCompleteIndentWithChallan}>
//                 Complete The Indent
//               </CButton>
//             )}

//             <CButton className="print-btn" onClick={handlePrintIndent}>
//               <i className="fa fa-print me-1"></i> Print Indent
//             </CButton>
//           </div>
//         </div>
        
//         <CCardBody className="profile-body p-0">
//           <table className="customer-details-table">
//             <tbody>
//               <tr className="table-row">
//                 <td className="profile-label-cell">Center/Center Code:</td>
//                 <td className="profile-value-cell">{data.orderNumber || ''}</td>

//                 <td className="profile-label-cell">Shipment Date:</td>
//                 <td className="profile-value-cell">{formatDate(data.shippingInfo.shippedDate || '')}</td>

//                 <td className="profile-label-cell">Completed on:</td>
//                 <td className="profile-value-cell">{formatDateTime(data.completionInfo?.completedOn || '')}</td>
//               </tr>

//               <tr className="table-row">
//                 <td className="profile-label-cell">Indent Date:</td>
//                 <td className="profile-value-cell">{data.date || ''}</td>

//                 <td className="profile-label-cell">Expected Delivery:</td>
//                 <td className="profile-value-cell">{formatDate(data.shippingInfo.expectedDeliveryDate || '')}</td>

//                 <td className="profile-label-cell">Completed by:</td>
//                 <td className="profile-value-cell">{data.completionInfo?.completedBy?.fullName || ''}</td>
//               </tr>

//               <tr className="table-row">
//                 <td className="profile-label-cell">Remark:</td>
//                 <td className="profile-value-cell">{data.remark || ''}</td>

//                 <td className="profile-label-cell">Shipment Detail:</td>
//                 <td className="profile-value-cell">{data.shippingInfo?.shipmentDetails || ''}</td>

//                 <td className="profile-label-cell">Incomplete on:</td>
//                 <td className="profile-value-cell">{formatDateTime(data.incompleteInfo?.incompleteOn || '')}</td>
//               </tr>

//               <tr className="table-row">
//                 <td className="profile-label-cell">Created at:</td>
//                 <td className="profile-value-cell">{formatDateTime(data.createdAt)}</td>

//                 <td className="profile-label-cell">Shipment Remark:</td>
//                 <td className="profile-value-cell">{data.shippingInfo?.shipmentRemark || ''}</td>

//                 <td className="profile-label-cell">Incomplete by:</td>
//                 <td className="profile-value-cell">{data.incompleteInfo?.incompleteBy?.fullName || ''}</td>
//               </tr>

//               <tr className="table-row">
//                 <td className="profile-label-cell">Created by:</td>
//                 <td className="profile-value-cell">{data.createdBy?.fullName || ''}</td>

//                 <td className="profile-label-cell">Document:</td>
//                 <td className="profile-value-cell">{data.document || ''}</td>

//                 <td className="profile-label-cell">Incomplete Remark:</td>
//                 <td className="profile-value-cell">{data.incompleteInfo?.incompleteRemark || ''}</td>
//               </tr>

//               <tr className="table-row">
//                 <td className="profile-label-cell">Approved at:</td>
//                 <td className="profile-value-cell">{formatDateTime(data.approvalInfo?.approvedAt || '')}</td>

//                 <td className="profile-label-cell">Shipped at:</td>
//                 <td className="profile-value-cell">{formatDateTime(data.shippingInfo?.shippedAt || '')}</td>

//                 <td className="profile-label-cell">
//                   {data.status === 'Completed' && 'Received at:'}
//                   {data.status === 'Rejected' && 'Rejected at:'}
//                 </td>
//                 <td className="profile-value-cell">
//                   {data.status === 'Completed' && formatDateTime(data.receivingInfo?.receivedAt || '')}
//                   {data.status === 'Rejected' && formatDateTime(data.rejectionInfo?.rejectedAt || '')}
//                 </td>
//               </tr>

//               <tr className="table-row">
//                 <td className="profile-label-cell">Approved by:</td>
//                 <td className="profile-value-cell">{data.approvalInfo?.approvedBy.fullName || ''}</td>

//                 <td className="profile-label-cell">Shipped by:</td>
//                 <td className="profile-value-cell">{data.shippingInfo?.shippedBy?.fullName || ''}</td>

//                 <td className="profile-label-cell">
//                   {data.status === 'Completed' && 'Received by:'}
//                   {data.status === 'Rejected' && 'Rejected by:'}
//                 </td>
//                 <td className="profile-value-cell">
//                   {data.status === 'Completed' && (data.receivingInfo?.receivedBy?.fullName || '')}
//                   {data.status === 'Rejected' && (data.rejectionInfo?.rejectedBy?.fullName || '')}
//                 </td>
//               </tr>
              
//               <tr className="table-row">
//                 <td></td>
//                 <td></td>
//                 <td></td>
//                 <td></td>
//                 <td className="profile-label-cell">
//                   {data.status === 'Rejected' && 'Rejected Remark:'}
//                 </td>
//                 <td className="profile-value-cell">
//                   {data.status === 'Rejected' && (data.rejectionInfo?.rejectionReason || '')}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </CCardBody>
//       </CCard>
      
//       <CCard className="profile-card" style={{ marginTop: '20px' }}>
//         <div className="subtitle-row d-flex justify-content-between align-items-center">
//           <div className="subtitle">Product Details</div>
//           <div className="action-buttons">
//             {data.status === 'Draft' && (
//               <>
//                 <CButton className="btn-action btn-submitted me-2" onClick={handleSubmitRequest}>
//                   Submit
//                 </CButton>
//               </>
//             )}

//             {data.status === 'Confirmed' && userCenterType === 'outlet' &&  (userRole === 'admin' || userRole === 'superadmin')  && isWarehouse && (
//               <>
//                 <CButton className="btn-action btn-submitted me-2" onClick={handleChangeApprovedQty}>
//                   Change Approved Qty
//                 </CButton>
//                 <CButton className="btn-action btn-submitted me-2" 
//                   onClick={() => {
//                     setCurrentShipmentAction(() => handleShipGoods);
//                     setShipmentModal(true);
//                   }}
//                 >
//                   <i className="fa fa-truck me-1"></i> Ship the Goods
//                 </CButton>
//                 <CButton className="btn-action btn-reject me-2" onClick={openRejectionModal}>
//                   Reject Request
//                 </CButton>
//               </>
//             )}

//             {(data.status === 'Confirmed' || data.status === 'Shipped' || data.status === 'Incompleted' || data.status === 'Completed') && (
//               <>
//                 {(isWarehouse) && (
//                   <CButton className="btn-action btn-submitted me-2" 
//                     onClick={() => setChallanModal(true)}
//                   >
//                     View Challan
//                   </CButton>
//                 )}
//               </>
//             )}

//             {(data.status === 'Shipped' || data.status === 'Completed') && (
//               <>
//                 {(isCenter) && (
//                   <CButton className="btn-action btn-submitted me-2" 
//                     onClick={() => setChallanModal(true)}
//                   >
//                     View Challan
//                   </CButton>
//                 )}
//               </>
//             )}

//             {data.status === 'Shipped' && userCenterType === 'outlet' &&  (userRole === 'admin' || userRole === 'superadmin') && isWarehouse &&(
//               <>
//                 <CButton className="btn-action btn-update me-2" onClick={handleOpenUpdateShipment}>
//                 <i className="fa fa-truck me-1"></i>Update Shipment
//                 </CButton>
//                 <CButton className="btn-action btn-reject me-2" onClick={handleCancelShipment}>
//                 <i className="fa fa-ban me-1"></i> Cancel Shipment
//                 </CButton>
//                 <CButton className="btn-action btn-reject me-2" onClick={openRejectionModal}>
//                   Reject Request
//                 </CButton>
//               </>
//             )}

//             {data.status === 'Shipped' && userCenterType === 'center' && isCenter &&(
//               <>
//                 <CButton className="btn-action btn-update"
//                   onClick={() => setIncompleteModal(true)}
//                 >
//                   Incomplete
//                 </CButton>
//               </>
//             )}

//             {data.status === 'Submitted' && hasPermission('Indent','stock_transfer_approve_from_outlet') && isWarehouse && (
//               <>
//                 <CButton className="btn-action btn-submitted me-2" onClick={handleApprove}>
//                   Submit &amp; Approve Request
//                 </CButton>
//                 <CButton className="btn-action btn-reject" onClick={openRejectionModal}>
//                   Submit &amp; Reject Request
//                 </CButton>
//               </>
//             )}

//             {data.status === 'Incompleted' && userCenterType === 'outlet' && (userRole === 'admin' || userRole === 'superadmin') && isWarehouse && (
//               <>
//                 <CButton className="btn-action btn-incomplete me-2" onClick={handleIncomplete}>
//                   Change Qty And Complete Request
//                 </CButton>
//               </>
//             )}
//           </div>
//         </div>
        
//         <CCardBody>
//           <CTable bordered striped responsive>
//             <CTableHead>
//               <CTableRow>
//                 <CTableHeaderCell>Product</CTableHeaderCell>
//                 <CTableHeaderCell>Center Stock</CTableHeaderCell>
//                 <CTableHeaderCell>Requested Qty</CTableHeaderCell>
//                 { showStockQty && <CTableHeaderCell>Stock Qty</CTableHeaderCell>}
//                 <CTableHeaderCell>Reseller Qty</CTableHeaderCell>
//                 <CTableHeaderCell>Product Remark</CTableHeaderCell>
//                 <CTableHeaderCell>Approved Qty</CTableHeaderCell>
//                 <CTableHeaderCell>Approved Remark</CTableHeaderCell>
//                 <CTableHeaderCell>Received Qty</CTableHeaderCell>
//                 <CTableHeaderCell>Received Remark</CTableHeaderCell>
//               </CTableRow>
//             </CTableHead>

//             <CTableBody>
//               {data.products?.length > 0 ? (
//                 data.products.map(item => {
//                   const approvedItem = approvedProducts.find(p => p._id === item._id) || {};
//                   const hasTransferredSerials = item.product?.trackSerialNumber === "Yes" && 
//                     item.transferredSerials && item.transferredSerials.length > 0;
                  
//                     const receivedQty = productReceipts.find(p => p.productId === item.product?._id)?.receivedQuantity || 
//                     item.receivedQuantity || 0;

//                     const approvedQty = approvedItem.approvedQty || item.approvedQuantity || 0;
                    
//                     const shouldShowMismatch = data.status === 'Incompleted' || data.status === 'Completed';

//                     const isQuantityMismatch = shouldShowMismatch && (Number(receivedQty) !== Number(approvedQty));
//                   return (
//                     <CTableRow key={item._id}
//                     className={isQuantityMismatch ? 'bg-quantity-mismatch' : ''}
//                     >
//                       <CTableDataCell>{item.product?.productTitle || ''}</CTableDataCell>
//                       <CTableDataCell>{item.centerStockQuantity || 0}</CTableDataCell>
//                       <CTableDataCell>{item.quantity || 0}</CTableDataCell>
//                       { showStockQty && <CTableDataCell>{item.outletStock.availableQuantity || 0}</CTableDataCell>}
//                       <CTableDataCell>{item.resellerStock.availableQuantity || 0}</CTableDataCell>
//                       <CTableDataCell>{item.productRemark || ''}</CTableDataCell>
//                       <CTableDataCell>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                           {isWarehouse ? (
//                             <>
//                               <CFormInput
//                                 type="text"
//                                 value={approvedItem.approvedQty}
//                                 onChange={e => handleApprovedChange(item._id, 'approvedQty', e.target.value)}
//                                 onBlur={e => handleApprovedBlur(item._id, e.target.value)}
//                                 className={errors[item._id] ? 'is-invalid' : ''}
//                                 style={{ width: '80px' }}
//                               />
//                               {item.product?.trackSerialNumber === "Yes" && (
//                                 <span
//                                   style={{ fontSize: '18px', cursor: 'pointer', color: '#337ab7' }}
//                                   onClick={() => handleOpenSerialModal(item)}
//                                   title="Add Serial Numbers"
//                                 >
//                                   ☰
//                                 </span>
//                               )}
//                             </>
//                           ) : (
//                             approvedItem.approvedQty || 0
//                           )}
//                         </div>

//                         {errors[item._id] && (
//                           <CFormText className="text-danger">{errors[item._id]}</CFormText>
//                         )}
//                       </CTableDataCell>

//                       <CTableDataCell>
//                         {isWarehouse ? (
//                           <CFormInput
//                             type="text"
//                             value={approvedItem.approvedRemark || ''}
//                             onChange={e => handleApprovedChange(item._id, 'approvedRemark', e.target.value)}
//                           />
//                         ) : (
//                           item.approvedRemark || ''
//                         )}
//                       </CTableDataCell>
                
//                       <CTableDataCell>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                           {userCenterType === 'center' && isCenter && data.status === 'Shipped' ? (
//                             <CFormInput
//                               type="text"
//                               value={productReceipts.find(p => p.productId === item.product?._id)?.receivedQuantity || ''}
//                               onChange={e => handleReceiptChange(item.product?._id, 'receivedQuantity', e.target.value)}
//                               style={{ width: '80px' }}
//                             />
//                           ) : (
//                             <span>{item.receivedQuantity || 0}</span>
//                           )}
                          
//                           {item.product?.trackSerialNumber === "Yes" && item.receivedQuantity > 0 && (
//                             <CTooltip 
//                               content={`Received serial numbers (${item.transferredSerials?.length || 0})`}
//                             >
//                               <span
//                                style={{ fontSize: '18px', cursor: 'pointer', color: '#337ab7' }}
//                                 onClick={() => handleOpenReceivedSerialModal(item)}
//                                 title="View Received Serial Numbers"
//                               >
//                                 ☰
//                               </span>
//                             </CTooltip>
//                           )}
//                         </div>
//                       </CTableDataCell>

//                       <CTableDataCell>
//                         {userCenterType === 'center' && isCenter && data.status === 'Shipped' ? (
//                           <CFormInput
//                             type="text"
//                             value={productReceipts.find(p => p.productId === item.product?._id)?.receivedRemark || ''}
//                             onChange={e => handleReceiptChange(item.product?._id, 'receivedRemark', e.target.value)}
//                           />
//                         ) : (
//                           item.receivedRemark || ''
//                         )}
//                       </CTableDataCell>
//                     </CTableRow>
//                   );
//                 })
//               ) : (
//                 <CTableRow>
//                   <CTableDataCell colSpan={10} className="text-center">No products found</CTableDataCell>
//                 </CTableRow>
//               )}
//             </CTableBody>
//           </CTable>
//         </CCardBody>
//       </CCard>
      
//       <ShipGoodsModal
//         visible={shipmentModal}
//         onClose={() => setShipmentModal(false)}
//         onSubmit={currentShipmentAction}
//         initialData={shipmentData} 
//       />
      
//       <IncompleteRemarkModal
//         visible={incompleteModal}
//         onClose={() => setIncompleteModal(false)}
//         onSubmit={handleMarkIncomplete}
//         initialRemark={data.incompleteRemark}
//       />
      
//       <SerialNumbers
//         visible={serialModalVisible}
//         onClose={() => setSerialModalVisible(false)}
//         product={selectedProduct}
//         approvedQty={Number(approvedProducts.find(p => p._id === selectedProduct?._id)?.approvedQty) || 0}
//         initialSerials={assignedSerials[selectedProduct?.product?._id] || []} 
//         onSerialNumbersUpdate={handleSerialNumbersUpdate}
//         warehouseId={data?.warehouse?._id}
//         resellerId={data?.stockSummary?.resellerId}
//         resellerName={data?.stockSummary?.resellerName}
//         data={data}
//       />
//       <ReceivedSerialNumbers
//         visible={receivedSerialModal}
//         onClose={() => setReceivedSerialModal(false)}
//         product={selectedReceivedProduct}
//       />

//       <ChallanModal
//         visible={challanModal}
//         onClose={() => setChallanModal(false)}
//         data={data}
//       />
      
//       <RejectionReasonModal
//         visible={rejectionModal}
//         onClose={() => setRejectionModal(false)}
//         onSubmit={handleReject}
//       />
//     </CContainer>
//   );
// };

// export default StockProfile;





import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCard, CCardBody, CButton, CSpinner, CContainer, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CFormText, CAlert, CBadge, CTooltip } from '@coreui/react';
import RejectionReasonModal from './RejectionReasonModal';
import axiosInstance from 'src/axiosInstance';
import '../../css/profile.css'
import '../../css/form.css';
import companyLogo from '../../assets/images/logo.png'
import ShipGoodsModal from './ShipGoodsModal';
import IncompleteRemarkModal from './IncompleteRemarkModal';
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
import SerialNumbers from './SerialNumbers';
import ReceivedSerialNumbers from './ReceivedSerialNumbers';
import usePermission from 'src/utils/usePermission';
import ChallanModal from './ChallanModal';
import Swal from 'sweetalert2';

const StockProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [approvedProducts, setApprovedProducts] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '', visible: false });
  const [shipmentModal, setShipmentModal] = useState(false)
  const [errors, setErrors] = useState({});
  const [currentShipmentAction, setCurrentShipmentAction] = useState(null);
  const [incompleteModal, setIncompleteModal] = useState(false);

  const [productReceipts, setProductReceipts] = useState([]);
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assignedSerials, setAssignedSerials] = useState({});
  const [challanModal, setChallanModal] = useState(false);
  const [rejectionModal, setRejectionModal] = useState(false);
  const [receivedSerialModal, setReceivedSerialModal] = useState(false);
  const [selectedReceivedProduct, setSelectedReceivedProduct] = useState(null);
  
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = (user?.role?.roleTitle || '').toLowerCase();
  const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
  const userCenterType = (userCenter.centerType || 'Outlet').toLowerCase();
  
  const userCenterId = userCenter._id;
  const isCenter = data?.center?._id === userCenterId;
  const isWarehouse = data?.warehouse?._id === userCenterId;

  const showStockQty = userRole === 'admin' || 'superadmin';

  const [shipmentData, setShipmentData] = useState({
    shippedDate: '',
    expectedDeliveryDate: '',
    shipmentDetails: '',
    shipmentRemark: '',
    documents: []
  });
  
  const { hasPermission, hasAnyPermission } = usePermission();
  
  const handleOpenSerialModal = (product) => {
    setSelectedProduct(product);
    setSerialModalVisible(true);
  };
  
  const handleOpenReceivedSerialModal = (product) => {
    setSelectedReceivedProduct(product);
    setReceivedSerialModal(true);
  };
   
  const handleSerialNumbersUpdate = (productId, serialsArray) => {
    setAssignedSerials(prev => ({
      ...prev,
      [productId]: serialsArray
    }));
  };
  
  const openRejectionModal = () => {
    setRejectionModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching stock request data for ID:', id);
        const response = await axiosInstance.get(`/stockrequest/${id}`);
        if (response.data.success) {
          const stockData = response.data.data;
          console.log('Fetched stock data:', stockData);
          console.log('Products in stock data:', stockData.products);
          
          // Log received quantities from API
          stockData.products.forEach((item, index) => {
            console.log(`Product ${index + 1}: ${item.product?.productTitle}`, {
              receivedQuantity: item.receivedQuantity,
              approvedQuantity: item.approvedQuantity,
              status: item.status
            });
          });
          
          setData(stockData);

          const initialApproved = stockData.products.map(item => ({
            _id: item._id,
            productId: item.product?._id,
            approvedQty:
              item.approvedQuantity !== undefined && item.approvedQuantity !== null
                ? item.approvedQuantity
                : item.quantity || '',
            approvedRemark: item.approvedRemark || ''
          }));
          setApprovedProducts(initialApproved);
  
          const initialSerials = {};
          stockData.products.forEach(item => {
            if (item.product?.trackSerialNumber === "Yes" && item.approvedSerials?.length > 0) {
              initialSerials[item.product._id] = item.approvedSerials.map(sn => ({ serialNumber: sn }));
            }
          });
          setAssignedSerials(initialSerials);
  
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) fetchData();
  }, [id]);

  const handleShipGoods = async (shipmentData) => {
    try {
      const response = await axiosInstance.post(`/stockrequest/${id}/ship`, shipmentData)
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Shipment created successfully', visible: true })
        setShipmentModal(false)
        try {
          await axiosInstance.patch(`/stockrequest/${id}/warehouse-challan-approval`, { 
            warehouseChallanApproval: 'approved' 
          });
          console.log('Challan auto-approved after shipment');
        } catch (challanError) {
          console.error('Failed to auto-approve challan:', challanError);
        }
        
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setAlert({ type: 'danger', message: 'Failed to create shipment', visible: true })
      }
    } catch (err) {
      console.error(err)
      setAlert({ type: 'danger', message: 'Error creating shipment', visible: true })
    }
  }

  const handleBack = () => navigate('/stock-request');

  // Updated useEffect for productReceipts with console logs
  useEffect(() => {
    if (data?.products) {
      console.log('Initializing productReceipts from data.products');
      console.log('Current data.products:', data.products);
      
      const initialReceipts = data.products.map(item => {
        const receivedQty = item.receivedQuantity !== undefined && item.receivedQuantity !== null 
          ? item.receivedQuantity 
          : '';
        
        console.log(`Product: ${item.product?.productTitle}`, {
          originalReceivedQuantity: item.receivedQuantity,
          approvedQuantity: item.approvedQuantity,
          setReceivedQuantity: receivedQty,
          receivedRemark: item.receivedRemark || ''
        });
        
        return {
          productId: item.product?._id,
          productTitle: item.product?.productTitle,
          receivedQuantity: receivedQty,
          receivedRemark: item.receivedRemark || '',
        };
      });
      
      console.log('Initial productReceipts state:', initialReceipts);
      setProductReceipts(initialReceipts);
    }
  }, [data]);

  // Auto-fill received quantity with approved quantity for center users
  useEffect(() => {
    // Only auto-fill when:
    // 1. Data is loaded
    // 2. Status is Shipped
    // 3. User is center
    // 4. User is viewing their own center
    // 5. Product receipts are initialized
    if (data?.status === 'Shipped' && userCenterType === 'center' && isCenter && data?.products && productReceipts.length > 0) {
      let needsUpdate = false;
      const updatedReceipts = productReceipts.map(receipt => {
        const product = data.products.find(p => p.product?._id === receipt.productId);
        // If received quantity is empty or 0, and approved quantity exists, auto-fill
        if (product && 
            (receipt.receivedQuantity === undefined || 
             receipt.receivedQuantity === null || 
             receipt.receivedQuantity === '' || 
             receipt.receivedQuantity === 0) && 
            product.approvedQuantity && 
            product.approvedQuantity > 0) {
          needsUpdate = true;
          console.log(`Auto-filling ${product.product?.productTitle} with approved quantity: ${product.approvedQuantity}`);
          return {
            ...receipt,
            receivedQuantity: product.approvedQuantity
          };
        }
        return receipt;
      });
      
      if (needsUpdate) {
        console.log('Auto-filling received quantities with approved quantities:', updatedReceipts);
        setProductReceipts(updatedReceipts);
      }
    }
  }, [data, userCenterType, isCenter, productReceipts.length]);
  
  const handleReceiptChange = (productId, field, value) => {
    console.log(`Updating receipt for product ${productId}:`, { field, value });
    setProductReceipts(prev =>
      prev.map(p => {
        if (p.productId === productId) {
          console.log(`Updated product receipt:`, { ...p, [field]: value });
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  const handleApprovedChange = (productId, field, value) => {
    if (field === 'approvedQty') {
      if (value === '' || /^\d+$/.test(value)) {
        setErrors(prev => ({ ...prev, [productId]: undefined }));
      } else {
        setErrors(prev => ({ ...prev, [productId]: 'The input value was not a correct number' }));
      }
    }
  
    setApprovedProducts(prev =>
      prev.map(p =>
        p._id === productId ? { ...p, [field]: value } : p
      )
    );
  };  

const handleApprove = async () => {
  let hasError = false;

  const payload = approvedProducts.map(p => {
    if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
      setErrors(prev => ({ ...prev, [p._id]: 'The input value was not a correct number' }));
      hasError = true;
    }
    const productSerials = assignedSerials[p.productId] || [];
    const limitedSerials = productSerials.slice(0, Number(p.approvedQty));

    return {
      productId: p.productId,
      approvedQuantity: Number(p.approvedQty),
      approvedRemark: p.approvedRemark || '',
      approvedSerials: limitedSerials.map(s => s.serialNumber),
    };
  });

  if (hasError) return;

  try {
    const response = await axiosInstance.post(`/stockrequest/${id}/approve`, {
      productApprovals: payload,
    });
    if (!response.data.success) {
      setAlert({
        type: 'danger',
        message: response.data.message || 'Failed to approve request',
        visible: true,
      });
      return;
    }
    setAlert({
      type: 'success',
      message: 'Stock request approved successfully',
      visible: true,
    });
    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    console.error(err);

    const errorMessage =
      err.response?.data?.message ||
      err.message || 
      'An unexpected error occurred';

    setAlert({
      type: 'danger',
      message: errorMessage,
      visible: true,
    });
  }
};

const handleReject = async (rejectionReason) => {
  try {
    const response = await axiosInstance.put(`/stockrequest/${id}`, { 
      status: 'Rejected', 
      rejectionReason: rejectionReason 
    });
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Stock request rejected successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to reject request', visible: true });
    }
  } catch (err) {
    console.error(err);
    const errorMessage = err.response?.data?.message || 'Error rejecting stock request';
    setAlert({ type: 'danger', message: errorMessage, visible: true });
  }
};

const handleSubmitRequest = async () => {
  try {
    const response = await axiosInstance.put(`/stockrequest/${id}`, { status: 'Submitted' });
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Data submitted successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to submit', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error to submit data', visible: true });
  }
};

const handleChangeApprovedQty = async () => {
  let hasError = false;
  const payload = approvedProducts.map(p => {
    if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
      setErrors(prev => ({
        ...prev,
        [p._id]: 'The input value was not a correct number',
      }));
      hasError = true;
    }
    return {
      productId: p.productId,
      approvedQuantity: Number(p.approvedQty),
      approvedRemark: p.approvedRemark || '',
      approvedSerials: (assignedSerials[p.productId] || []).map(s => s.serialNumber),
    };
  });

  if (hasError) return;
  console.log("Final payload sent to API:", payload); 
  try {
    const response = await axiosInstance.patch(
      `/stockrequest/${id}/approved-quantities`,
      { productApprovals: payload }
    );

    if (response.data.success) {
      setAlert({
        type: 'success',
        message: 'Approved quantities updated successfully',
        visible: true,
      });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({
        type: 'danger',
        message: response.data.message || 'Failed to update approved quantities',
        visible: true,
      });
    }
  } catch (err) {
    console.error(err);
    const backendMessage =
      err.response?.data?.message || 'Error updating approved quantities';

    setAlert({
      type: 'danger',
      message: backendMessage,
      visible: true,
    });
  }
};

const handleCancelShipment = async () => {
  try {
    const response = await axiosInstance.post(`/stockrequest/${id}/reject-shipment`);
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Shipment canceled successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to cancel shipment', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error canceling shipment', visible: true });
  }
};

const handleCompleteIndent = async () => {
  try {
    console.log('Completing indent with productReceipts:', productReceipts);
    
    if (userCenterType === 'center') {
      const missingReceipts = productReceipts.filter(item => 
        item.receivedQuantity === undefined || 
        item.receivedQuantity === null || 
        item.receivedQuantity === '' ||
        isNaN(Number(item.receivedQuantity))
      );

      if (missingReceipts.length > 0) {
        console.log('Missing receipts:', missingReceipts);
        setAlert({
          type: 'danger',
          message: 'Please enter received quantity for all products before completing the indent',
          visible: true,
        });
        return;
      }
    }

    let payload = [];

    if (isCenter) {
      payload = productReceipts.map(item => ({
        productId: item.productId,
        receivedQuantity: Number(item.receivedQuantity) || 0,
        receivedRemark: item.receivedRemark || '',
      }));
    } else {
      payload = data.products.map(item => ({
        productId: item.product?._id,
        receivedQuantity: item.approvedQuantity || item.receivedQuantity || 0,
        receivedRemark: item.receivedRemark || '',
      }));
    }

    console.log('Complete indent payload:', payload);
    
    const response = await axiosInstance.post(`/stockrequest/${id}/complete`, {
      productReceipts: payload,
    });
    
    if (!response.data.success) {
      setAlert({
        type: 'danger',
        message: response.data.message || 'Failed to complete indent',
        visible: true,
      });
      return;
    }
    
    setAlert({
      type: 'success',
      message: 'Indent completed successfully',
      visible: true,
    });

    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    console.error('Error in handleCompleteIndent:', err);

    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred while completing the indent';

    setAlert({
      type: 'danger',
      message: errorMessage,
      visible: true,
    });
  }
};

const handleCompleteIndentWithChallan = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to complete this indent and approve the challan?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, complete it!',
    cancelButtonText: 'Cancel'
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    await handleCompleteIndent();
    const response = await axiosInstance.patch(`/stockrequest/${id}/center-challan-approval`, { 
      centerChallanApproval: 'approved' 
    });
    
    if (response.data.success) {
      console.log('Challan auto-approved after completion');
    }
    
  } catch (err) {
    console.error('Error in complete process:', err);
  }
};

const handleOpenUpdateShipment = () => {
  if (data.shippingInfo) {
    setShipmentData({
      shippedDate: data.shippingInfo.shippedDate?.split('T')[0] || '',
      expectedDeliveryDate: data.shippingInfo.expectedDeliveryDate?.split('T')[0] || '',
      shipmentDetails: data.shippingInfo.shipmentDetails || '',
      shipmentRemark: data.shippingInfo.shipmentRemark || '',
      documents: data.shippingInfo.documents || []
    });
  }
  setCurrentShipmentAction(() => handleUpdateShipment);
  setShipmentModal(true);
};

const handleUpdateShipment = async (shipmentData) => {
  try {
    const response = await axiosInstance.patch(`/stockrequest/${id}/shipping-info`, shipmentData);
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Shipment updated successfully', visible: true });
      setShipmentModal(false);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to update shipment', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error updating shipment', visible: true });
  }
};

const handleMarkIncomplete = async (remark) => {
  try {
    console.log('Marking as incomplete with productReceipts:', productReceipts);
    
    if (userCenterType === 'center') {
      const missingReceipts = productReceipts.filter(item => 
        item.receivedQuantity === undefined || 
        item.receivedQuantity === null || 
        item.receivedQuantity === '' ||
        isNaN(Number(item.receivedQuantity))
      );

      if (missingReceipts.length > 0) {
        console.log('Missing receipts:', missingReceipts);
        setAlert({
          type: 'danger',
          message: 'Please enter received quantity for all products before marking as incomplete',
          visible: true,
        });
        return;
      }
    }
    
    const receivedProducts = productReceipts.map(item => ({
      productId: item.productId,
      receivedQuantity: Number(item.receivedQuantity) || 0,
      receivedRemark: item.receivedRemark || '',
    }));
    
    const payload = {
      incompleteRemark: remark,
      receivedProducts,
    };
    
    console.log('Incomplete Payload:', payload);
    const response = await axiosInstance.post(
      `/stockrequest/${id}/mark-incomplete`,
      payload
    );

    if (response.data.success) {
      setAlert({
        type: 'success',
        message: 'Stock request marked as incomplete',
        visible: true,
      });
      setIncompleteModal(false);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({
        type: 'danger',
        message: 'Failed to mark incomplete',
        visible: true,
      });
    }
  } catch (err) {
    console.error(err);
    setAlert({
      type: 'danger',
      message: 'Error marking incomplete',
      visible: true,
    });
  }
};

const handleIncomplete = async () => {
  try {
    const approvalsPayload = approvedProducts.map(p => {
      const product = data.products.find(prod => prod.product?._id === p.productId);
      const isSerialized = product?.product?.trackSerialNumber === "Yes";
      
      const currentSerials = assignedSerials[p.productId] || [];
      
      return {
        productId: p.productId,
        approvedQuantity: Number(p.approvedQty) || 0,
        approvedRemark: p.approvedRemark || '',
        ...(isSerialized && {
          approvedSerials: currentSerials.map(s => s.serialNumber).slice(0, Number(p.approvedQty))
        })
      };
    });

    const receiptsPayload = productReceipts.map(r => ({
      productId: r.productId,
      receivedQuantity: Number(r.receivedQuantity) || 0,
      receivedRemark: r.receivedRemark || '',
    }));

    console.log('Final Incomplete Payload:', {
      productApprovals: approvalsPayload,
      productReceipts: receiptsPayload,
    });

    const response = await axiosInstance.patch(
      `/stockrequest/${id}/complete-incomplete`,
      {
        productApprovals: approvalsPayload,
        productReceipts: receiptsPayload,
      }
    );
    if (!response.data.success) {
      setAlert({
        type: 'danger',
        message: response.data.message || 'Failed to complete indent',
        visible: true,
      });
      return;
    }
    setAlert({
      type: 'success',
      message: 'Indent completed successfully',
      visible: true,
    });

    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    console.error('Error in handleIncomplete:', err);
    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred while completing the indent';

    setAlert({
      type: 'danger',
      message: errorMessage,
      visible: true,
    });
  }
};

const handleApprovedBlur = (productId, value) => {
    if (value === '' || !/^\d+$/.test(value)) {
      setErrors(prev => ({ ...prev, [productId]: 'The input value was not a correct number' }));
    }
};

const handlePrintIndent = () => {
  const printWindow = window.open('', '_blank');
  const logoPath = companyLogo; 
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let subtotal = 0;
  const gstRate = 18;
  
  const productsWithTotals = data.products.map(item => {
    const approvedQty = item.quantity || 0;
    const salePrice = item.product?.salePrice || 0;
    const total = approvedQty * salePrice;
    const gstAmount = (total * gstRate) / 100;
    const amountWithGst = total + gstAmount;
    
    subtotal += total;
    
    return {
      ...item,
      approvedQty,
      salePrice,
      total,
      gstAmount,
      amountWithGst
    };
  });

  const totalGst = (subtotal * gstRate) / 100;
  const grandTotal = subtotal + totalGst;
  const indentDate = data.date ? new Date(data.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Indent Invoice - ${data.orderNumber || ''}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin-left: 200px;
          margin-right: 200px;
          margin-top:20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .logo {
          width: 200px;
          height: 170px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
        }
        .invoice-details {
          text-align: right; 
          flex: 1;
          padding-left: 20px;
        }
        .invoice-details p {
          margin: 5px 0;
          font-size: 14px;
          line-height: 1.4; 
          color:#000
        }
        .invoice-details strong {
          display: block;
          font-size: 18px;
        }

        .indent-info-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding: 10px 15px;
          background-color: #f5f6f7;
          border-radius: 5px;
          font-size: 14px;
          margin-top: -27px
        }
        .indent-info-item {
          display: flex;
          align-items: center;
        }
        .indent-info-label {
          font-weight: bold;
          margin-right: 8px;
          color: #495057;
        }
        .indent-info-value {
          color: #212529;
        }
        
        .address-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .address-section p {
          margin: 3px 0;
          font-size: 14px;
          line-height: 1.3; 
          color:#000
        }
        .warehouse-details {
          text-align: right;
        }
.info-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  border: 1px solid #ddd;
  table-layout: fixed;
}

.info-table td {
  padding: 8px 10px;
  border: 1px solid #ddd;
  vertical-align: top;
}

.info-table .label {
  font-weight: bold;
  color: #333;
  width: 15%;
  background-color: #f5f5f5;
  white-space: nowrap; 
}

.info-table .value {
  color: #000;
  width: 35%;
}

.info-table td[colspan="3"] {
  width: auto;
}
        
        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 13px;
        }
        .products-table th {
          background-color: #333;
          color: white;
          padding: 8px;
          text-align: left;
          font-weight: 500;
        }
        .products-table td {
          padding: 8px;
          border: 1px solid #ddd;
          vertical-align: top;
        }
        .products-table tbody tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .serial-numbers {
          font-size: 11px;
          color: #666;
          max-width: 150px;
          word-break: break-word;
        }
        
        .footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 25px;
          page-break-after: always;
        }
        
        .signature {
          text-align: center;
          width: 200px;
        }
        .signature p {
          margin: 5px 0;
          font-size: 12px;
        }
        .signature-line {
          margin-top: 40px;
          border-top: 1px solid #000;
          padding-top: 5px;
        }
        .print-button {
          text-align: center;
          margin: 20px 0;
        }
        .print-button button {
          padding: 10px 30px;
          background-color: #3c8dbc;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 16px;
          margin: 0 10px;
        }
        .print-button button:hover {
          background-color: #3c8dbc;
        }
        
        /* Page break for 14th page */
        .page-break {
          page-break-before: always;
        }
        
        @media print {
          body { margin: 0.5in; }
          .print-button { display: none; }
          .products-table th { background-color: #333 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .info-table .label { background-color: #f5f5f5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
          <div class="logo">
            <img src="${logoPath}" alt="Company Logo" style="max-width: 100%; max-height: 100%;">
          </div>
          <div class="invoice-details">
          <strong>Sancfil Technologies Internet Services Pvt Ltd</strong>
          <p>Address : A1, 1st Floor,</p>
          <p>Landmark Co.operative Housing Society, Sector 14,</p>
          <p>Vashi, Navi Mumbai - 400 709</p>
          <p>Tel: +91 809757810 /8097578176,</p>
          <p>Email-stock@trunet.co.in</p>
        </div>
        </div>
      
      <div class="indent-info-bar">
        <div class="indent-info-item">
          <span class="indent-info-label">Indent No:</span>
          <span class="indent-info-value"><strong>${data.orderNumber || ''}</strong></span>
        </div>
        <div class="indent-info-item">
          <span class="indent-info-label">Indent Date:</span>
          <span class="indent-info-value">${indentDate}</span>
        </div>
        <div class="indent-info-item">
          <strong>${data.status || ''}</strong>
        </div>
      </div>
      
      <div class="address-section">
        <div class="center-details">
          <strong>Center Details</strong>
          <p><strong>${data.center?.centerName || ''}</strong></p>
          <p>${data.center?.addressLine1 || ''} ${data.center?.addressLine2 || ''}</p>
          <p>${data.center?.city || ''}, ${data.center?.state || ''}</p>
          <p>${data.center?.email || ''}</p>
        </div>
        <div class="warehouse-details">
          <strong>Warehouse Details</strong>
          <p><strong>${data.warehouse?.centerName || ''}</strong></p>
          <p>${data.warehouse?.addressLine1 || ''} ${data.warehouse?.addressLine2 || ''}</p>
          <p>${data.warehouse?.city || ''}, ${data.warehouse?.state || ''}</p>
          <p>${data.warehouse?.email || ''}</p>
        </div>
      </div>
      <table class="products-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Rate (₹)</th>
            <th>Total (₹)</th>
            <th>GST @${gstRate}% (₹)</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${productsWithTotals.map((item, index) => {
            return `
              <tr>
                <td>${index + 1}</td>
                <td>${item.product?.productTitle || ''}</td>
                <td>${item.quantity || 0}</td>
                <td>${item.salePrice.toFixed(2)}</td>
                <td>${item.total.toFixed(2)}</td>
                <td>${item.gstAmount.toFixed(2)}</td>
                <td><strong>${item.amountWithGst.toFixed(2)}</strong></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      <!-- New table format for info grid with 2 items per row -->
<table class="info-table">
   <tr>
    <td class="label">Approved On</td>
    <td class="value">${formatDateTime(data.approvalInfo?.approvedAt) || 'March 6, 2026'}</td>
    <td class="label">Shipment Date</td>
    <td class="value">${formatDate(data.shippingInfo?.shippedDate) || 'March 6, 2026'}</td>
   </tr>
   <tr>
    <td class="label">Expected Delivery</td>
    <td class="value">${formatDate(data.shippingInfo?.expectedDeliveryDate) || formatDate(data.shippingInfo?.shippedDate) || 'March 6, 2026'}</td>
    <td class="label">Completed On</td>
    <td class="value">${formatDateTime(data.completedOn) || '07 Mar 2026'}</td>
   </tr>
   <tr>
    <td class="label">Shipment Detail</td>
    <td class="value">${data.shippingInfo?.shipmentDetail || ''}</td>
    <td class="label">Shipment Remark</td>
    <td class="value">${data.shippingInfo?.shipmentRemark || ''}</td>
   </tr>
   <tr>
    <td class="label">Remark</td>
    <td class="value" colspan="3">${data.remark || ''}</td>
   </tr>
</table>
      <!-- Signature on right side -->
      <div class="footer">
        <div class="signature">
          <div class="signature-line"></div>
          <p>Authorized Signatory</p>
        </div>
      </div>

      <!-- Print buttons -->
      <div class="print-button">
        <button onclick="window.print()">Print Indent</button>
        <button onclick="window.close()">Close</button>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
};

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}><CSpinner color="primary" /></div>;
  if (error) return <div className="alert alert-danger"> {error}</div>;
  if (!data) return <div className="alert alert-warning">Stock Request not found</div>;

  return (
    <CContainer fluid>
      {alert.visible && (
        <CAlert color={alert.type} dismissible onClose={() => setAlert({ ...alert, visible: false })}>
          {alert.message}
        </CAlert>
      )}

      <div className="title">
        <CButton size="sm" className="back-button me-3" onClick={handleBack}>
          <i className="fa fa-fw fa-arrow-left"></i> Back
        </CButton>
        Indent Detail
      </div>
      
      <CCard className="profile-card">
        <div className="subtitle-row">
          <div className="subtitle">
            Indent: {data.orderNumber || ''}
            {data.status && (
              <span className={`status-badge ${data.status.toLowerCase()}`}>
                {data.status}
              </span>
            )}
          </div>

          <div className="d-flex align-items-center">
            {data.status === 'Shipped' && hasPermission('Indent', 'complete_indent') && (
              <CButton className='btn-action btn-incomplete me-2' onClick={handleCompleteIndentWithChallan}>
                Complete The Indent
              </CButton>
            )}

            <CButton className="print-btn" onClick={handlePrintIndent}>
              <i className="fa fa-print me-1"></i> Print Indent
            </CButton>
          </div>
        </div>
        
        <CCardBody className="profile-body p-0">
          <table className="customer-details-table">
            <tbody>
              <tr className="table-row">
                <td className="profile-label-cell">Center/Center Code:</td>
                <td className="profile-value-cell">{data.orderNumber || ''}</td>

                <td className="profile-label-cell">Shipment Date:</td>
                <td className="profile-value-cell">{formatDate(data.shippingInfo?.shippedDate || '')}</td>

                <td className="profile-label-cell">Completed on:</td>
                <td className="profile-value-cell">{formatDateTime(data.completionInfo?.completedOn || '')}</td>
              </tr>

              <tr className="table-row">
                <td className="profile-label-cell">Indent Date:</td>
                <td className="profile-value-cell">{data.date || ''}</td>

                <td className="profile-label-cell">Expected Delivery:</td>
                <td className="profile-value-cell">{formatDate(data.shippingInfo?.expectedDeliveryDate || '')}</td>

                <td className="profile-label-cell">Completed by:</td>
                <td className="profile-value-cell">{data.completionInfo?.completedBy?.fullName || ''}</td>
              </tr>

              <tr className="table-row">
                <td className="profile-label-cell">Remark:</td>
                <td className="profile-value-cell">{data.remark || ''}</td>

                <td className="profile-label-cell">Shipment Detail:</td>
                <td className="profile-value-cell">{data.shippingInfo?.shipmentDetails || ''}</td>

                <td className="profile-label-cell">Incomplete on:</td>
                <td className="profile-value-cell">{formatDateTime(data.incompleteInfo?.incompleteOn || '')}</td>
              </tr>

              <tr className="table-row">
                <td className="profile-label-cell">Created at:</td>
                <td className="profile-value-cell">{formatDateTime(data.createdAt)}</td>

                <td className="profile-label-cell">Shipment Remark:</td>
                <td className="profile-value-cell">{data.shippingInfo?.shipmentRemark || ''}</td>

                <td className="profile-label-cell">Incomplete by:</td>
                <td className="profile-value-cell">{data.incompleteInfo?.incompleteBy?.fullName || ''}</td>
              </tr>

              <tr className="table-row">
                <td className="profile-label-cell">Created by:</td>
                <td className="profile-value-cell">{data.createdBy?.fullName || ''}</td>

                <td className="profile-label-cell">Document:</td>
                <td className="profile-value-cell">{data.document || ''}</td>

                <td className="profile-label-cell">Incomplete Remark:</td>
                <td className="profile-value-cell">{data.incompleteInfo?.incompleteRemark || ''}</td>
              </tr>

              <tr className="table-row">
                <td className="profile-label-cell">Approved at:</td>
                <td className="profile-value-cell">{formatDateTime(data.approvalInfo?.approvedAt || '')}</td>

                <td className="profile-label-cell">Shipped at:</td>
                <td className="profile-value-cell">{formatDateTime(data.shippingInfo?.shippedAt || '')}</td>

                <td className="profile-label-cell">
                  {data.status === 'Completed' && 'Received at:'}
                  {data.status === 'Rejected' && 'Rejected at:'}
                </td>
                <td className="profile-value-cell">
                  {data.status === 'Completed' && formatDateTime(data.receivingInfo?.receivedAt || '')}
                  {data.status === 'Rejected' && formatDateTime(data.rejectionInfo?.rejectedAt || '')}
                </td>
              </tr>

              <tr className="table-row">
                <td className="profile-label-cell">Approved by:</td>
                <td className="profile-value-cell">{data.approvalInfo?.approvedBy?.fullName || ''}</td>

                <td className="profile-label-cell">Shipped by:</td>
                <td className="profile-value-cell">{data.shippingInfo?.shippedBy?.fullName || ''}</td>

                <td className="profile-label-cell">
                  {data.status === 'Completed' && 'Received by:'}
                  {data.status === 'Rejected' && 'Rejected by:'}
                </td>
                <td className="profile-value-cell">
                  {data.status === 'Completed' && (data.receivingInfo?.receivedBy?.fullName || '')}
                  {data.status === 'Rejected' && (data.rejectionInfo?.rejectedBy?.fullName || '')}
                </td>
              </tr>
              
              <tr className="table-row">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="profile-label-cell">
                  {data.status === 'Rejected' && 'Rejected Remark:'}
                </td>
                <td className="profile-value-cell">
                  {data.status === 'Rejected' && (data.rejectionInfo?.rejectionReason || '')}
                </td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      
      <CCard className="profile-card" style={{ marginTop: '20px' }}>
        <div className="subtitle-row d-flex justify-content-between align-items-center">
          <div className="subtitle">Product Details</div>
          <div className="action-buttons">
            {data.status === 'Draft' && (
              <>
                <CButton className="btn-action btn-submitted me-2" onClick={handleSubmitRequest}>
                  Submit
                </CButton>
              </>
            )}

            {data.status === 'Confirmed' && userCenterType === 'outlet' &&  (userRole === 'admin' || userRole === 'superadmin')  && isWarehouse && (
              <>
                <CButton className="btn-action btn-submitted me-2" onClick={handleChangeApprovedQty}>
                  Change Approved Qty
                </CButton>
                <CButton className="btn-action btn-submitted me-2" 
                  onClick={() => {
                    setCurrentShipmentAction(() => handleShipGoods);
                    setShipmentModal(true);
                  }}
                >
                  <i className="fa fa-truck me-1"></i> Ship the Goods
                </CButton>
                <CButton className="btn-action btn-reject me-2" onClick={openRejectionModal}>
                  Reject Request
                </CButton>
              </>
            )}

            {(data.status === 'Confirmed' || data.status === 'Shipped' || data.status === 'Incompleted' || data.status === 'Completed') && (
              <>
                {(isWarehouse) && (
                  <CButton className="btn-action btn-submitted me-2" 
                    onClick={() => setChallanModal(true)}
                  >
                    View Challan
                  </CButton>
                )}
              </>
            )}

            {(data.status === 'Shipped' || data.status === 'Completed') && (
              <>
                {(isCenter) && (
                  <CButton className="btn-action btn-submitted me-2" 
                    onClick={() => setChallanModal(true)}
                  >
                    View Challan
                  </CButton>
                )}
              </>
            )}

            {data.status === 'Shipped' && userCenterType === 'outlet' &&  (userRole === 'admin' || userRole === 'superadmin') && isWarehouse &&(
              <>
                <CButton className="btn-action btn-update me-2" onClick={handleOpenUpdateShipment}>
                <i className="fa fa-truck me-1"></i>Update Shipment
                </CButton>
                <CButton className="btn-action btn-reject me-2" onClick={handleCancelShipment}>
                <i className="fa fa-ban me-1"></i> Cancel Shipment
                </CButton>
                <CButton className="btn-action btn-reject me-2" onClick={openRejectionModal}>
                  Reject Request
                </CButton>
              </>
            )}

            {data.status === 'Shipped' && userCenterType === 'center' && isCenter &&(
              <>
                <CButton className="btn-action btn-update"
                  onClick={() => setIncompleteModal(true)}
                >
                  Incomplete
                </CButton>
              </>
            )}

            {data.status === 'Submitted' && hasPermission('Indent','stock_transfer_approve_from_outlet') && isWarehouse && (
              <>
                <CButton className="btn-action btn-submitted me-2" onClick={handleApprove}>
                  Submit &amp; Approve Request
                </CButton>
                <CButton className="btn-action btn-reject" onClick={openRejectionModal}>
                  Submit &amp; Reject Request
                </CButton>
              </>
            )}

            {data.status === 'Incompleted' && userCenterType === 'outlet' && (userRole === 'admin' || userRole === 'superadmin') && isWarehouse && (
              <>
                <CButton className="btn-action btn-incomplete me-2" onClick={handleIncomplete}>
                  Change Qty And Complete Request
                </CButton>
              </>
            )}
          </div>
        </div>
        
        <CCardBody>
          <CTable bordered striped responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Product</CTableHeaderCell>
                <CTableHeaderCell>Center Stock</CTableHeaderCell>
                <CTableHeaderCell>Requested Qty</CTableHeaderCell>
                { showStockQty && <CTableHeaderCell>Stock Qty</CTableHeaderCell>}
                <CTableHeaderCell>Reseller Qty</CTableHeaderCell>
                <CTableHeaderCell>Product Remark</CTableHeaderCell>
                <CTableHeaderCell>Approved Qty</CTableHeaderCell>
                <CTableHeaderCell>Approved Remark</CTableHeaderCell>
                <CTableHeaderCell>Received Qty</CTableHeaderCell>
                <CTableHeaderCell>Received Remark</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {data.products?.length > 0 ? (
                data.products.map(item => {
                  const approvedItem = approvedProducts.find(p => p._id === item._id) || {};
                  
                  // Get the current receipt value - now directly from productReceipts
                  const currentReceipt = productReceipts.find(p => p.productId === item.product?._id);
                  const receivedQtyValue = currentReceipt?.receivedQuantity !== undefined && 
                                           currentReceipt?.receivedQuantity !== '' 
                                           ? currentReceipt.receivedQuantity 
                                           : '';
                  
                  const receivedRemarkValue = currentReceipt?.receivedRemark !== undefined 
                    ? currentReceipt.receivedRemark 
                    : (item.receivedRemark || '');
                  
                  console.log(`Rendering product: ${item.product?.productTitle}`, {
                    currentReceipt,
                    receivedQtyValue,
                    receivedRemarkValue,
                    originalReceivedQuantity: item.receivedQuantity,
                    approvedQuantity: item.approvedQuantity,
                    status: data.status,
                    isCenter: isCenter,
                    userCenterType: userCenterType
                  });

                  const approvedQty = approvedItem.approvedQty || item.approvedQuantity || 0;
                  
                  const shouldShowMismatch = data.status === 'Incompleted' || data.status === 'Completed';
                  const isQuantityMismatch = shouldShowMismatch && (Number(receivedQtyValue) !== Number(approvedQty));
                  
                  return (
                    <CTableRow key={item._id}
                      className={isQuantityMismatch ? 'bg-quantity-mismatch' : ''}
                    >
                      <CTableDataCell>{item.product?.productTitle || ''}</CTableDataCell>
                      <CTableDataCell>{item.centerStockQuantity || 0}</CTableDataCell>
                      <CTableDataCell>{item.quantity || 0}</CTableDataCell>
                      { showStockQty && <CTableDataCell>{item.outletStock?.availableQuantity || 0}</CTableDataCell>}
                      <CTableDataCell>{item.resellerStock?.availableQuantity || 0}</CTableDataCell>
                      <CTableDataCell>{item.productRemark || ''}</CTableDataCell>
                      <CTableDataCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isWarehouse ? (
                            <>
                              <CFormInput
                                type="text"
                                value={approvedItem.approvedQty}
                                onChange={e => handleApprovedChange(item._id, 'approvedQty', e.target.value)}
                                onBlur={e => handleApprovedBlur(item._id, e.target.value)}
                                className={errors[item._id] ? 'is-invalid' : ''}
                                style={{ width: '80px' }}
                              />
                              {item.product?.trackSerialNumber === "Yes" && (
                                <span
                                  style={{ fontSize: '18px', cursor: 'pointer', color: '#337ab7' }}
                                  onClick={() => handleOpenSerialModal(item)}
                                  title="Add Serial Numbers"
                                >
                                  ☰
                                </span>
                              )}
                            </>
                          ) : (
                            approvedItem.approvedQty || 0
                          )}
                        </div>

                        {errors[item._id] && (
                          <CFormText className="text-danger">{errors[item._id]}</CFormText>
                        )}
                      </CTableDataCell>

                      <CTableDataCell>
                        {isWarehouse ? (
                          <CFormInput
                            type="text"
                            value={approvedItem.approvedRemark || ''}
                            onChange={e => handleApprovedChange(item._id, 'approvedRemark', e.target.value)}
                          />
                        ) : (
                          item.approvedRemark || ''
                        )}
                      </CTableDataCell>
                
                      <CTableDataCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {userCenterType === 'center' && isCenter && data.status === 'Shipped' ? (
                            <CFormInput
                              type="text"
                              value={receivedQtyValue}
                              onChange={e => handleReceiptChange(item.product?._id, 'receivedQuantity', e.target.value)}
                              style={{ width: '80px' }}
                              placeholder={item.approvedQuantity || 0}
                            />
                          ) : (
                            <span>{receivedQtyValue || 0}</span>
                          )}
                          
                          {item.product?.trackSerialNumber === "Yes" && item.receivedQuantity > 0 && (
                            <CTooltip 
                              content={`Received serial numbers (${item.transferredSerials?.length || 0})`}
                            >
                              <span
                                style={{ fontSize: '18px', cursor: 'pointer', color: '#337ab7' }}
                                onClick={() => handleOpenReceivedSerialModal(item)}
                                title="View Received Serial Numbers"
                              >
                                ☰
                              </span>
                            </CTooltip>
                          )}
                        </div>
                      </CTableDataCell>

                      <CTableDataCell>
                        {userCenterType === 'center' && isCenter && data.status === 'Shipped' ? (
                          <CFormInput
                            type="text"
                            value={receivedRemarkValue}
                            onChange={e => handleReceiptChange(item.product?._id, 'receivedRemark', e.target.value)}
                          />
                        ) : (
                          item.receivedRemark || ''
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  );
                })
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={10} className="text-center">No products found</CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
      
      <ShipGoodsModal
        visible={shipmentModal}
        onClose={() => setShipmentModal(false)}
        onSubmit={currentShipmentAction}
        initialData={shipmentData} 
      />
      
      <IncompleteRemarkModal
        visible={incompleteModal}
        onClose={() => setIncompleteModal(false)}
        onSubmit={handleMarkIncomplete}
        initialRemark={data.incompleteRemark}
      />
      
      <SerialNumbers
        visible={serialModalVisible}
        onClose={() => setSerialModalVisible(false)}
        product={selectedProduct}
        approvedQty={Number(approvedProducts.find(p => p._id === selectedProduct?._id)?.approvedQty) || 0}
        initialSerials={assignedSerials[selectedProduct?.product?._id] || []} 
        onSerialNumbersUpdate={handleSerialNumbersUpdate}
        warehouseId={data?.warehouse?._id}
        resellerId={data?.stockSummary?.resellerId}
        resellerName={data?.stockSummary?.resellerName}
        data={data}
      />
      <ReceivedSerialNumbers
        visible={receivedSerialModal}
        onClose={() => setReceivedSerialModal(false)}
        product={selectedReceivedProduct}
      />

      <ChallanModal
        visible={challanModal}
        onClose={() => setChallanModal(false)}
        data={data}
      />
      
      <RejectionReasonModal
        visible={rejectionModal}
        onClose={() => setRejectionModal(false)}
        onSubmit={handleReject}
      />
    </CContainer>
  );
};

export default StockProfile;