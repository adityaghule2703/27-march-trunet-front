import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCard, CCardBody, CButton, CSpinner, CContainer, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CFormText, CAlert } from '@coreui/react';
import axiosInstance from 'src/axiosInstance';
import companyLogo from '../../assets/images/logo.png'
import '../../css/profile.css'
import '../../css/form.css';
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
import ShipGoodsModal from '../stockRequest/ShipGoodsModal';
import IncompleteRemarkModal from '../stockRequest/IncompleteRemarkModal';
import usePermission from 'src/utils/usePermission';
import StockSerialNumber from './StockSerialNumber';

const StockTransferDetails = () => {
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

  const { hasPermission} = usePermission(); 
  
  const [shipmentData, setShipmentData] = useState({
    shippedDate: '',
    expectedDeliveryDate: '',
    shipmentDetails: '',
    shipmentRemark: '',
    documents: []
  });

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = (user?.role?.roleTitle || '').toLowerCase();
  const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
  const userCenterType = userCenter.centerType || 'Outlet';

  const userCenterId = userCenter._id;
  const isToCenterUser = data?.toCenter?._id === userCenterId;

  const isFromCenterUser = data?.fromCenter?._id === userCenterId;

  const handleOpenSerialModal = (product) => {
    console.log('Opening serial modal for product:', {
      productId: product.product?._id,
      productTitle: product.product?.productTitle,
      currentApprovedQty: approvedProducts.find(p => p.productId === product.product?._id)?.approvedQty,
      hasAssignedSerials: !!assignedSerials[product.product?._id]
    });
    setSelectedProduct(product);
    setSerialModalVisible(true);
  };
   
  // const handleSerialNumbersUpdate = (productId, serialsArray) => {
  //   setAssignedSerials(prev => ({
  //     ...prev,
  //     [productId]: serialsArray
  //   }));
  // };

  const handleSerialNumbersUpdate = (productId, serialsArray) => {
    console.log('handleSerialNumbersUpdate called:', {
      productId,
      serialsArray,
      serialsCount: serialsArray.length
    });
    
    setAssignedSerials(prev => ({
      ...prev,
      [productId]: serialsArray
    }));
    
    setApprovedProducts(prev => prev.map(p => {
      if (p.productId === productId) {
        return {
          ...p,
          approvedQty: serialsArray.length.toString()
        };
      }
      return p;
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/stocktransfer/${id}`);
        if (response.data.success) {
          setData(response.data.data);
          const initialApproved = response.data.data.products.map(item => ({
            _id: item._id,    
            productId: item.product?._id,   
            approvedQty:item.approvedQuantity !== undefined && item.approvedQuantity !== null? item.approvedQuantity: item.quantity || '',
  
            approvedRemark: item.approvedRemark || ''
          }));
          setApprovedProducts(initialApproved);
          
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
      const response = await axiosInstance.post(`/stocktransfer/${id}/ship`, shipmentData)
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Shipment created successfully', visible: true })
        setShipmentModal(false)
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setAlert({ type: 'danger', message: 'Failed to create shipment', visible: true })
      }
    } catch (err) {
      console.error(err)
      setAlert({ type: 'danger', message: 'Error creating shipment', visible: true })
    }
  }

  const handleBack = () => navigate('/stock-transfer');

  useEffect(() => {
    if (data?.products) {
      const initialReceipts = data.products.map(item => ({
        productId: item.product?._id, 
        receivedQuantity: item.receivedQuantity,
        receivedRemark:item.receivedRemark
      }));
      setProductReceipts(initialReceipts);
    }
  }, [data]);
  
  const handleReceiptChange = (productId, field, value) => {
    setProductReceipts(prev =>
      prev.map(p => (p.productId === productId ? { ...p, [field]: value } : p))
    );
  };

  // const handleApprovedChange = (productId, field, value) => {
  //   if (field === 'approvedQty') {
  //     if (value === '' || /^\d+$/.test(value)) {
  //       setErrors(prev => ({ ...prev, [productId]: undefined }));
  //     } else {
  //       setErrors(prev => ({ ...prev, [productId]: 'The input value was not a correct number' }));
  //     }
  //   }
  
  //   setApprovedProducts(prev =>
  //     prev.map(p =>
  //       p._id === productId ? { ...p, [field]: value } : p
  //     )
  //   );
  // };  

  
  const handleApprovedChange = (productId, field, value) => {
    if (field === 'approvedQty') {
      if (value === '' || /^\d+$/.test(value)) {
        setErrors(prev => ({ ...prev, [productId]: undefined }));
      } else {
        setErrors(prev => ({ ...prev, [productId]: 'Invalid number' }));
      }
    }
  
    setApprovedProducts(prev =>
      prev.map(p =>
        p.productId === productId ? { ...p, [field]: value } : p
      )
    );
  };
  
//approve admin

const handleApprove = async () => {
  let hasError = false;
  const validationErrors = {};
  
  const payload = approvedProducts.map(p => {

    if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
      validationErrors[p._id] = 'The input value was not a correct number';
      hasError = true;
    }
    
    const productItem = data.products.find(item => item.product?._id === p.productId);
    if (productItem && Number(p.approvedQty) > productItem.quantity) {
      validationErrors[p._id] = `Approved quantity cannot exceed requested quantity (${productItem.quantity})`;
      hasError = true;
    }
    
    if (productItem?.product?.trackSerialNumber === "Yes" && Number(p.approvedQty) > 0) {
      const serialsForProduct = assignedSerials[p.productId] || [];
      if (serialsForProduct.length !== Number(p.approvedQty)) {
        validationErrors[p._id] = `Please assign ${p.approvedQty} serial number(s) for this product`;
        hasError = true;
      }
    }
    
    return {
      productId: p.productId,
      approvedQuantity: Number(p.approvedQty),
      approvedRemark: p.approvedRemark || '',
      approvedSerials: (assignedSerials[p.productId] || []).map(s => s.serialNumber)
    };
  });

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    
    const missingSerials = Object.entries(validationErrors)
      .filter(([_, error]) => error.includes('serial number'))
      .map(([_, error]) => error);
    
    if (missingSerials.length > 0) {
      setAlert({ 
        type: 'danger', 
        message: `Missing serial numbers: ${missingSerials.join('. ')}`, 
        visible: true 
      });
    }
    return;
  }
  try {
    
    setAlert({ type: 'info', message: 'Processing approval...', visible: true });
    const response = await axiosInstance.post(`/stocktransfer/${id}/approve`, {
      productApprovals: payload
    });

    if (response.data.success) {
      setAlert({ 
        type: 'success', 
        message: response.data.message || 'Transfer approved successfully', 
        visible: true 
      });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ 
        type: 'danger', 
        message: response.data.message || 'Failed to approve transfer', 
        visible: true 
      });
    }
  } catch (err) {
    console.error('Error approving transfer:', err);
    
    let errorMessage = "Something went wrong while approving the transfer";
    
    if (err.response?.data) {
      const { data } = err.response;
      
      if (data.errors && Array.isArray(data.errors)) {
        const validationMessages = data.errors.map(error => {
          if (typeof error === 'string') return error;
          if (error.message) return error.message;
          if (error.field && error.message) return `${error.field}: ${error.message}`;
          return JSON.stringify(error);
        }).join('. ');
        
        errorMessage = `Validation failed: ${validationMessages}`;
      }

      else if (data.validationResults && Array.isArray(data.validationResults)) {
        const failedValidations = data.validationResults
          .filter(result => !result.valid)
          .map(result => result.error || `Product ${result.productName} validation failed`)
          .join('. ');
        
        errorMessage = failedValidations || data.message || "Validation failed";
      }

      else if (data.validationErrors && Array.isArray(data.validationErrors)) {
        const validationErrors = data.validationErrors
          .map(error => error.error || `Product ${error.productName || error.productId} validation failed`)
          .join('. ');
        
        errorMessage = validationErrors || data.message || "Validation failed";
      }
   
      else if (data.error && typeof data.error === 'string') {
        errorMessage = data.error;
      }

      else if (data.message) {
        errorMessage = data.message;
      }
    }
    
    setAlert({ 
      type: 'danger', 
      message: errorMessage, 
      visible: true 
    });
  }
};


const handleApproveAdmin = async () => {
  let hasError = false;
  const payload = approvedProducts.map(p => {
    if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
      setErrors(prev => ({ ...prev, [p._id]: 'The input value was not a correct number' }));
      hasError = true;
    }
    return {
      productId: p.productId,
      approvedQuantity: Number(p.approvedQty),
      approvedRemark: p.approvedRemark || ''
    };
  });

  if (hasError) return;

  try {
    const response = await axiosInstance.patch(`/stocktransfer/${id}/admin/approve`, {
      productApprovals: payload
    });

    if (response.data.success) {
      setAlert({ type: 'success', message: 'Data approved successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to approve data', visible: true });
    }
  } catch (err) {
    console.error(err);
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||   
      err.message ||              
      "Something went wrong";
  
    setAlert({ type: 'danger', message: errorMessage, visible: true });
  }
};


//reject admin
const handleRejectAdmin = async () => {
  try {
    const response = await axiosInstance.patch(`/stocktransfer/${id}/admin/reject`);
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Data reject successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to reject data', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error rejecting data', visible: true });
  }
};



// Reject
const handleReject = async () => {
  try {
    const response = await axiosInstance.post(`/stocktransfer/${id}/reject`);
    if (response.data.success) {
      setAlert({ type: 'success', message: 'Data rejected successfully', visible: true });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to reject data', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error rejecting data', visible: true });
  }
};


// Submit
const handleSubmitRequest = async () => {
  try {
    const response = await axiosInstance.post(`/stocktransfer/${id}/submit`, { status: 'Submitted' });
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


//****************************** approve qty **************************************/

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

//   try {
//     const response = await axiosInstance.patch(
//       `/stocktransfer/${id}/approved-quantities`,
//       { productApprovals: payload }
//     );

//     if (response.data.success) {
//       setAlert({
//         type: 'success',
//         message: 'Approved quantities updated successfully',
//         visible: true,
//       });
//       // setTimeout(() => window.location.reload(), 1000);
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


// approve qty
const handleChangeApprovedQty = async () => {
  let hasError = false;
  const validationErrors = {};
  
  const payload = approvedProducts.map(p => {
    if (p.approvedQty === '' || !/^\d+$/.test(p.approvedQty)) {
      validationErrors[p._id] = 'The input value was not a correct number';
      hasError = true;
    }
    
    const productItem = data.products.find(item => item.product?._id === p.productId);
    if (productItem && Number(p.approvedQty) > productItem.quantity) {
      validationErrors[p._id] = `Approved quantity cannot exceed requested quantity (${productItem.quantity})`;
      hasError = true;
    }
    if (productItem?.product?.trackSerialNumber === "Yes" && Number(p.approvedQty) > 0) {
      const serialsForProduct = assignedSerials[p.productId] || [];
      if (serialsForProduct.length !== Number(p.approvedQty)) {
        validationErrors[p._id] = `Please assign ${p.approvedQty} serial number(s) for this product`;
        hasError = true;
      }
    }
    const serialsArray = assignedSerials[p.productId] || [];
    return {
      productId: p.productId,
      approvedQuantity: Number(p.approvedQty),
      approvedRemark: p.approvedRemark || '',
      approvedSerials: serialsArray.map(s => s.serialNumber),
    };
  });

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    
    const missingSerials = Object.entries(validationErrors)
      .filter(([_, error]) => error.includes('serial number'))
      .map(([_, error]) => error);
    
    if (missingSerials.length > 0) {
      setAlert({ 
        type: 'danger', 
        message: `Missing serial numbers: ${missingSerials.join('. ')}`, 
        visible: true 
      });
    }
    
    return;
  }

  try {
    setAlert({ type: 'info', message: 'Updating approved quantities...', visible: true });
    
    const response = await axiosInstance.patch(
      `/stocktransfer/${id}/approved-quantities`,
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

//Cancel Shipment
const handleCancelShipment = async () => {
  try {
    const response = await axiosInstance.patch(`/stocktransfer/${id}/reject-shipment`);
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

// complete

// const handleCompleteIndent = async () => {
//   try {
//     let payload = [];

//     if (isToCenterUser) {
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

//     const response = await axiosInstance.post(`/stocktransfer/${id}/complete`, {
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


const handleCompleteIndent = async () => {
  try {
    let payload = [];
    
    if (isToCenterUser) {
      payload = data.products.map(item => {
        const receiptItem = productReceipts.find(p => p.productId === item.product?._id);
        const receivedQtyInput = receiptItem?.receivedQuantity;
        const receivedQuantity = receivedQtyInput !== undefined && receivedQtyInput !== '' 
          ? Number(receivedQtyInput) 
          : (item.approvedQuantity || 0);
        if (receivedQtyInput !== undefined && receivedQtyInput !== '' && Number(receivedQtyInput) <= 0) {
          throw new Error(`Received quantity must be greater than 0 for product: ${item.product?.productTitle || item.product?._id}`);
        }
        if (receivedQuantity > (item.approvedQuantity || 0)) {
          throw new Error(`Received quantity (${receivedQuantity}) cannot exceed approved quantity (${item.approvedQuantity || 0}) for product: ${item.product?.productTitle || item.product?._id}`);
        }
        
        return {
          productId: item.product?._id,
          receivedQuantity: receivedQuantity,
          receivedRemark: receiptItem?.receivedRemark || item.receivedRemark || '',
        };
      });
    } else {
      payload = data.products.map(item => ({
        productId: item.product?._id,
        receivedQuantity: item.approvedQuantity || item.receivedQuantity || 0,
        receivedRemark: item.receivedRemark || '',
      }));
    }

    const response = await axiosInstance.post(`/stocktransfer/${id}/complete`, {
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

    const errorMessage = err.message || 
      err.response?.data?.message ||
      'An unexpected error occurred while completing the indent';

    setAlert({
      type: 'danger',
      message: errorMessage,
      visible: true,
    });
  }
};

// Update Shipment
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
    const response = await axiosInstance.patch(`/stocktransfer/${id}/shipping-info`, shipmentData);
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

    const receivedProducts = productReceipts.map(item => ({
      productId: item.productId,
      receivedQuantity: Number(item.receivedQuantity) || 0,
      receivedRemark: item.receivedRemark || '',
    }));
    const payload = {
      incompleteRemark: remark,
      receivedProducts,
    };
    const response = await axiosInstance.post(
      `/stocktransfer/${id}/mark-incomplete`,
       payload
    );
    if (response.data.success) {
      setAlert({ type: 'success', message: 'marked as incomplete', visible: true });
      setIncompleteModal(false);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ type: 'danger', message: 'Failed to mark incomplete', visible: true });
    }
  } catch (err) {
    console.error(err);
    setAlert({ type: 'danger', message: 'Error marking incomplete', visible: true });
  }
};

//handle incomplete
// const handleIncomplete = async () => {
//   try {
//     const approvalsPayload = approvedProducts.map(p => ({
//       productId: p.productId,
//       approvedQuantity: Number(p.approvedQty) || 0,
//       approvedRemark: p.approvedRemark || ''
//     }));
//     const receiptsPayload = productReceipts.map(r => ({
//       productId: r.productId,
//      receivedQuantity: Number(r.receivedQuantity) || 0,
//       receivedRemark: r.receivedRemark || ''
//     }));

//     const response = await axiosInstance.patch(
//       `/stocktransfer/${id}/complete-incomplete`,
//       {
//         productApprovals: approvalsPayload,
//         productReceipts: receiptsPayload,
//       }
//     );

//     if (response.data.success) {
//       setAlert({ type: 'success', message: 'Indent completed successfully', visible: true });
//       setTimeout(() => window.location.reload(), 1000);
//     } else {
//       setAlert({ type: 'danger', message: response.data.message || 'Failed to complete indent', visible: true });
//     }
//   } catch (err) {
//     console.error(err);
//     setAlert({ type: 'danger', message: 'Error completing indent', visible: true });
//   }
// };



//handle incomplete

const handleIncomplete = async () => {
  try {
    const approvalsPayload = approvedProducts.map(p => {
      const productItem = data.products.find(item => item.product?._id === p.productId);
      const serialsForProduct = assignedSerials[p.productId] || [];
      let approvedSerialsArray = [];
      
      if (serialsForProduct.length > 0) {
        approvedSerialsArray = serialsForProduct.map(s => s.serialNumber);
      } else if (productItem?.approvedSerials?.length > 0) {
        approvedSerialsArray = productItem.approvedSerials.slice(0, Number(p.approvedQty) || 0);
      }
      if (productItem?.product?.trackSerialNumber === "Yes" && 
          Number(p.approvedQty) > 0 && 
          approvedSerialsArray.length === 0) {
        throw new Error(`Please assign serial numbers for product: ${productItem.product.productTitle}`);
      }
      
      return {
        productId: p.productId,
        approvedQuantity: Number(p.approvedQty) || 0,
        approvedRemark: p.approvedRemark || '',
        approvedSerials: approvedSerialsArray
      };
    });
    const receiptsPayload = productReceipts.map(r => ({
      productId: r.productId,
      receivedQuantity: Number(r.receivedQuantity) || 0,
      receivedRemark: r.receivedRemark || ''
    }));

    const response = await axiosInstance.patch(
      `/stocktransfer/${id}/complete-incomplete`,
      {
        productApprovals: approvalsPayload,
        productReceipts: receiptsPayload,
      }
    );

    if (response.data.success) {
      setAlert({ 
        type: 'success', 
        message: response.data.message || 'Incomplete transfer completed successfully', 
        visible: true 
      });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setAlert({ 
        type: 'danger', 
        message: response.data.message || 'Failed to complete incomplete transfer', 
        visible: true 
      });
    }
  } catch (err) {
    console.error(err);
    if (err.response?.data) {
      const { data } = err.response;
      
      if (data.validationErrors && Array.isArray(data.validationErrors)) {
        const validationMessages = data.validationErrors
          .map(error => error.error || `Product ${error.productName || error.productId} validation failed`)
          .join('. ');
        
        setAlert({ 
          type: 'danger', 
          message: validationMessages, 
          visible: true 
        });
      } else if (data.message) {
        setAlert({ 
          type: 'danger', 
          message: data.message, 
          visible: true 
        });
      } else {
        setAlert({ 
          type: 'danger', 
          message: err.message || 'Error completing incomplete transfer', 
          visible: true 
        });
      }
    } else {
      setAlert({ 
        type: 'danger', 
        message: err.message || 'Error completing incomplete transfer', 
        visible: true 
      });
    }
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
            <span class="indent-info-value"><strong>${data.transferNumber || ''}</strong></span>
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
            <strong>From Center</strong>
            <p><strong>${data.fromCenter?.centerName || ''}</strong></p>
            <p>${data.fromCenter?.addressLine1 || ''} ${data.fromCenter?.addressLine2 || ''}</p>
            <p>${data.fromCenter?.city || ''}, ${data.fromCenter?.state || ''}</p>
            <p>${data.fromCenter?.email || ''}</p>
          </div>
          <div class="warehouse-details">
            <strong>To Center</strong>
            <p><strong>${data.toCenter?.centerName || ''}</strong></p>
            <p>${data.toCenter?.addressLine1 || ''} ${data.toCenter?.addressLine2 || ''}</p>
            <p>${data.toCenter?.city || ''}, ${data.toCenter?.state || ''}</p>
            <p>${data.toCenter?.email || ''}</p>
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
                  <td>${item.product?.productTitle || ''}
                  </td>
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
      <td class="value">${formatDateTime(data.centerApproval?.approvedAt) || ''}</td>
      <td class="label">Shipment Date</td>
      <td class="value">${formatDate(data.shippingInfo?.shippedDate) || ''}</td>
    </tr>
    <tr>
      <td class="label">Expected Delivery</td>
      <td class="value">${formatDate(data.shippingInfo?.expectedDeliveryDate) || formatDate(data.shippingInfo?.shippedDate) || ''}</td>
      <td class="label">Completed On</td>
      <td class="value">${formatDateTime(data.completedOn) || ''}</td>
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
  if (error) return <div className="alert alert-danger">{error}</div>;
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

    {data.status === 'Shipped' && isToCenterUser &&(
      <CButton className='btn-action btn-incomplete me-2' onClick={handleCompleteIndent}>
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
<tr className="table-row" style={{ backgroundColor: "#d9edf7" }}>
  <td className="profile-label-cell">Status:</td>
  <td className="profile-value-cell" colSpan={5}>
    {data.status === 'Submitted' ? (
      <strong>Transfer Pending from SSV TELECOM PVT LTD</strong>
    ) : (
      <>
        <strong>Transfer Approved by SSV TELECOM PVT LTD at{" "}</strong>
        {formatDateTime(data.adminApproval?.approvedAt || '')}
      </>
    )}
  </td>
</tr>

      <tr className="table-row">
        <td className="profile-label-cell">Center/Center Code:</td>
        <td className="profile-value-cell">{data.orderNumber || ''}</td>

        <td className="profile-label-cell">Shipment Date:</td>
        <td className="profile-value-cell">{formatDate(data.shippingInfo.shippedDate || '')}</td>

        <td className="profile-label-cell">Completed on:</td>
        <td className="profile-value-cell">{formatDateTime(data.completionInfo?.completedOn || '')}</td>
      </tr>

      <tr className="table-row">
        <td className="profile-label-cell">Indent Date:</td>
        <td className="profile-value-cell">{formatDate(data.date || '')}</td>

        <td className="profile-label-cell">Expected Delivery:</td>
        <td className="profile-value-cell">{formatDate(data.shippingInfo.expectedDeliveryDate || '')}</td>

        <td className="profile-label-cell">Completed by:</td>
        <td className="profile-value-cell">{data.completionInfo?.completedBy?.fullName || ''}</td>
      </tr>

      <tr className="table-row">
        <td className="profile-label-cell">Remark:</td>
        <td className="profile-value-cell">{data.remark || ''}</td>

        <td className="profile-label-cell">Shipment Detail:</td>
        <td className="profile-value-cell">{data.shippingInfo?.shipmentDetails || ''}</td>

        <td className="profile-label-cell">Incomplete on:</td>
        <td className="profile-value-cell">{formatDateTime(data.completionInfo?.incompleteOn || '')}</td>
      </tr>

      <tr className="table-row">
        <td className="profile-label-cell">Created at:</td>
        <td className="profile-value-cell">{formatDateTime(data.createdAt)}</td>

        <td className="profile-label-cell">Shipment Remark:</td>
        <td className="profile-value-cell">{data.shippingInfo?.shipmentRemark || ''}</td>

        <td className="profile-label-cell">Incomplete by:</td>
        <td className="profile-value-cell">{data.completionInfo?.incompleteBy?.fullName || ''}</td>
      </tr>

      <tr className="table-row">
        <td className="profile-label-cell">Created by:</td>
        <td className="profile-value-cell">{data.createdBy?.fullName || ''}</td>

        <td className="profile-label-cell">Document:</td>
        <td className="profile-value-cell">{data.document || ''}</td>

        <td className="profile-label-cell">Incomplete Remark:</td>
        <td className="profile-value-cell">{data.completionInfo?.incompleteRemark || ''}</td>
      </tr>

       <tr className="table-row">
        <td className="profile-label-cell">Approved at:</td>
        <td className="profile-value-cell">{formatDateTime(data.centerApproval?.approvedAt || '')}</td>

        <td className="profile-label-cell">Shipped at:</td>
        <td className="profile-value-cell">{formatDateTime(data.shippingInfo?.shippedAt || '')}</td>

        <td className="profile-label-cell">Received at:</td>
        <td className="profile-value-cell">{formatDateTime(data.receivingInfo?.receivedAt || '')}</td>
      </tr>

      <tr className="table-row">
        <td className="profile-label-cell">Approved by:</td>
        <td className="profile-value-cell">{data.centerApproval?.approvedBy?.fullName || ''}</td>

        <td className="profile-label-cell">Shipped by:</td>
        <td className="profile-value-cell">{data.shippingInfo?.shippedBy?.fullName || ''}</td>

        <td className="profile-label-cell">Received by:</td>
        <td className="profile-value-cell">{data.receivingInfo?.receivedBy?.fullName || ''}</td>
      </tr>
    </tbody>
  </table>
</CCardBody>

     </CCard>

     <CCard className="profile-card" style={{ marginTop: '20px' }}>
        <div className="subtitle-row d-flex justify-content-between align-items-center">
          <div className="subtitle">Product Details</div>
       <div className="action-buttons">

       {data.status === 'Draft' && userRole !== 'admin' && userRole !== 'superadmin' && (
        <CButton className="btn-action btn-incomplete" onClick={handleSubmitRequest}>
          Submit
        </CButton>
      )}
     
      {data.status === 'Incompleted' && userRole !== 'admin' && isFromCenterUser &&(
        <>
          <CButton className="btn-action btn-incomplete me-2" onClick={handleIncomplete}>
            Change Qty And Complete Request
          </CButton>
        </>
      )}
      
      {data.status === 'Confirmed' && userRole !== 'admin' && isFromCenterUser &&  (
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

          <CButton className="btn-action btn-reject" onClick={handleReject}>
            Reject Request
          </CButton>
        </>
      )}

      {data.status === 'Shipped' && userRole !== 'admin' && isFromCenterUser &&(
        <>
          <CButton className="btn-action btn-update me-2" onClick={handleOpenUpdateShipment}>
          <i className="fa fa-truck me-1"></i> Update Shipment
          </CButton>
          <CButton className="btn-action btn-reject me-2" onClick={handleCancelShipment}>
          <i className="fa fa-ban me-1"></i> Cancel Shipment
          </CButton>
          <CButton className="btn-action btn-reject me-2" onClick={handleReject}>
            Reject Request
          </CButton>
        </>
      )}


       {data.status === 'Shipped' && userRole !== 'admin' && isToCenterUser &&(
        <>
          <CButton className="btn-action btn-update"
           onClick={() => setIncompleteModal(true)}
          >
            Incomplete
          </CButton>
        </>
      )}

      {data.status === 'Admin_Approved' && userRole !== 'admin' && hasPermission('Transfer', 'approval_transfer_center') && isFromCenterUser &&(
        <>
          <CButton className="btn-action btn-submitted me-2" onClick={handleApprove}>
            Submit &amp; Approve Request
          </CButton>
          <CButton className="btn-action btn-reject" onClick={handleReject}>
            Submit &amp; Reject Request
          </CButton>
        </>
      )}
      

      {data.status === 'Submitted' &&  (userRole === 'admin' || userRole === 'superadmin') && (
        <>
         <CButton className="btn-action btn-incomplete me-2" onClick={handleApproveAdmin}>
          Approval
        </CButton>
        <CButton className="btn-action btn-reject" onClick={handleRejectAdmin}>
          Reject
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
                <CTableHeaderCell>Stock Qty</CTableHeaderCell>
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
                  const approvedItem = approvedProducts.find(p => p.productId === item.product._id) || {};
                  
                  const receivedQty = productReceipts.find(p => p.productId === item.product?._id)?.receivedQuantity || 
                  item.receivedQuantity || 0;
                  const approvedQty = approvedItem.approvedQty || item.approvedQuantity || 0;
                  const shouldShowMismatch = data.status === 'Incompleted' || data.status === 'Completed';
                  const isQuantityMismatch = shouldShowMismatch && (Number(receivedQty) !== Number(approvedQty));
                  return (
                    <CTableRow key={item._id}
                     className={isQuantityMismatch ? 'bg-quantity-mismatch' : ''}
                    >
                      <CTableDataCell>{item.product?.productTitle || ''}</CTableDataCell>
                      <CTableDataCell>{item.centerStockQuantity || 0}</CTableDataCell>
                      <CTableDataCell>{item.quantity || 0}</CTableDataCell>
                      <CTableDataCell>{item.productInStock || 0}</CTableDataCell>
                      <CTableDataCell>{item.productRemark || ''}</CTableDataCell>

                      <CTableDataCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        { isFromCenterUser ? (
                          <>
                        <CFormInput
                              type="text"
                              value={approvedItem.approvedQty}
                              onChange={e => handleApprovedChange(item.product._id, 'approvedQty', e.target.value)}
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
                    ):( approvedItem.approvedQty || '')}
  </div>

  {errors[item._id] && (
    <CFormText className="text-danger">{errors[item._id]}</CFormText>
  )}
</CTableDataCell>

                      <CTableDataCell>
                        { isFromCenterUser ? (
                            <CFormInput
                            type="text"
                            value={approvedItem.approvedRemark || ''}
                            onChange={e => handleApprovedChange(item._id, 'approvedRemark', e.target.value)}
                          />
                        ):(
                          item.approvedRemark || ''
                        )
                        }
                     
         </CTableDataCell>

        

<CTableDataCell>
  {userCenterType === 'Center' && isToCenterUser && data.status === 'Shipped' ? (
    <CFormInput
      type="text"
      value={productReceipts.find(p => p.productId === item.product?._id)?.receivedQuantity || ''}
      onChange={e => handleReceiptChange(item.product?._id, 'receivedQuantity', e.target.value)}
    />
  ) : (
     item.receivedQuantity ||  ''
  )}
</CTableDataCell>

<CTableDataCell>
  {userCenterType === 'Center' && isToCenterUser && data.status === 'Shipped' ? (
    <CFormInput
      type="text"
      value={productReceipts.find(p => p.productId === item.product?._id)?.receivedRemark || ''}
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
                  <CTableDataCell colSpan={9} className="text-center">No products found</CTableDataCell>
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
<StockSerialNumber
  visible={serialModalVisible}
  onClose={() => setSerialModalVisible(false)}
  product={selectedProduct}
  approvedQty={Number(approvedProducts.find(p => p.productId === selectedProduct?.product?._id)?.approvedQty) || 0}
  initialSerials={assignedSerials[selectedProduct?.product?._id] || []} 
  onSerialNumbersUpdate={handleSerialNumbersUpdate}
  warehouseId={data?.fromCenter?._id}
/>
    </CContainer>
  );
};

export default StockTransferDetails;
