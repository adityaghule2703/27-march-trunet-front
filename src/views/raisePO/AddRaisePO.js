
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from 'src/axiosInstance';
// import '../../css/form.css';
// import '../../css/table.css';
// import CIcon from '@coreui/icons-react';
// import { cilPlus } from '@coreui/icons';
// import { CFormInput, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CAlert, CButton } from '@coreui/react';
// import VendorModal from '../stockPurchase/VendorModel';
// import Select from 'react-select';

// const AddRaisePO = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split('T')[0],
//     voucherNo: '',
//     vendor: '',
//     vendor_id: ''
//   });
//   const [vendors, setVendors] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedRows, setSelectedRows] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [productSearchTerm, setProductSearchTerm] = useState('');
//   const [errors, setErrors] = useState({});
//   const [showVendorModal, setShowVendorModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [generatingVoucher, setGeneratingVoucher] = useState(false);
 
//   const [selectionOrder, setSelectionOrder] = useState([]);
//   const selectionCounter = useRef(0);

//   const [alert, setAlert] = useState({
//     visible: false,
//     type: 'success',
//     message: ''
//   });
  
//   const { id } = useParams();

//   useEffect(() => {
//     if (!id) {
//       generateAutoVoucherNumber();
//     }
//   }, [id]);

//   useEffect(() => {
//     const fetchVendors = async () => {
//       try {
//         const res = await axiosInstance.get('/vendor');
//         setVendors(res.data.data || []);
//       } catch (error) {
//         console.log("error fetching vendors", error);
//         showAlert('danger', 'Failed to fetch vendors');
//       }
//     };
//     fetchVendors();
//   }, []);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const generateAutoVoucherNumber = async () => {
//     setGeneratingVoucher(true);
//     try {
//       const currentDate = new Date();
//       const currentYear = currentDate.getFullYear();
//       const currentMonth = currentDate.getMonth() + 1;

//       let financialYear = '';
//       if (currentMonth >= 4) {
//         financialYear = `${currentYear.toString().slice(-2)}-${(currentYear + 1).toString().slice(-2)}`;
//       } else {
//         financialYear = `${(currentYear - 1).toString().slice(-2)}-${currentYear.toString().slice(-2)}`;
//       }

//       const response = await axiosInstance.get('/raisePO/latest-voucher', {
//         params: {
//           financialYear: financialYear
//         }
//       });
      
//       let sequenceNumber = 1;
      
//       if (response.data.success && response.data.data?.voucherNo) {
//         const lastVoucher = response.data.data.voucherNo;
//         const match = lastVoucher.match(/^STELE\/(\d{2})\/\d{2}-\d{2}$/);
        
//         if (match && match[1]) {
//           sequenceNumber = parseInt(match[1]) + 1;
//         }
//       }
      
//       const paddedSequence = sequenceNumber.toString().padStart(2, '0');
//       const voucherNumber = `STELE/${paddedSequence}/${financialYear}`;
      
//       setFormData(prev => ({
//         ...prev,
//         voucherNo: voucherNumber
//       }));
      
//     } catch (error) {
//       console.error('Error generating voucher number:', error);
//       const currentDate = new Date();
//       const currentYear = currentDate.getFullYear();
//       const currentMonth = currentDate.getMonth() + 1;
      
//       let financialYear = '';
//       if (currentMonth >= 4) {
//         financialYear = `${currentYear.toString().slice(-2)}-${(currentYear + 1).toString().slice(-2)}`;
//       } else {
//         financialYear = `${(currentYear - 1).toString().slice(-2)}-${currentYear.toString().slice(-2)}`;
//       }
      
//       setFormData(prev => ({
//         ...prev,
//         voucherNo: `STELE/01/${financialYear}`
//       }));
      
//       showAlert('warning', 'Auto-generated voucher number: STELE/01/' + financialYear);
//     } finally {
//       setGeneratingVoucher(false);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await axiosInstance.get('/stockpurchase/products/with-stock');
//       if (res.data.success) {
//         setProducts(res.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       showAlert('danger', 'Failed to fetch products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const fetchStockPurchase = async () => {
//       if (!id) return;
  
//       try {
//         const res = await axiosInstance.get(`/raisePO/${id}`);
//         if (res.data.success) {
//           const data = res.data.data;
//           setFormData({
//             date: data.date.split('T')[0],
//             voucherNo: data.voucherNo,
//             vendor: data.vendor.businessName,
//             vendor_id: data.vendor._id || data.vendor.id
//           });
  
//           setSearchTerm(data.vendor.businessName);
//           const selected = {};
//           const order = [];
          
//           data.products.forEach((prod, index) => {
//             selected[prod.product._id] = {
//               quantity: prod.purchasedQuantity,
//               price: prod.price,
//               productRemark: prod.productRemark || '',
//               productInStock: prod.product.stock?.currentStock || 0
//             };
//             order.push({ productId: prod.product._id, order: index });
//           });
          
//           setSelectedRows(selected);
//           setSelectionOrder(order);
//           selectionCounter.current = data.products.length;
//         }
//       } catch (error) {
//         console.error('Error fetching stock purchase for edit:', error);
//         showAlert('danger', 'Failed to fetch stock purchase data');
//       }
//     };
  
//     fetchStockPurchase();
//   }, [id, products, vendors]);
  

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const handleRowSelect = (productId, productPrice, productStock) => {
//     setSelectedRows((prev) => {
//       const updated = { ...prev };
//       if (updated[productId]) {
//         setSelectionOrder(prevOrder => prevOrder.filter(item => item.productId !== productId));
//         delete updated[productId];
//       } else {
//         const newOrder = selectionCounter.current++;
//         setSelectionOrder(prevOrder => [
//           { productId, order: newOrder },
//           ...prevOrder
//         ]);
//         updated[productId] = { 
//           quantity: '', 
//           productRemark: '',
//           price: productPrice || 0,
//           productInStock: productStock || 0
//         };
//       }
//       return updated;
//     });
//   };

//   const handleRowInputChange = (productId, field, value) => {
//     setSelectedRows((prev) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         [field]: value,
//       },
//     }));
//   };

//   const handleAddVendor = () => {
//     setShowVendorModal(true);
//   };

//   const handleVendorAdded = (newVendor) => {
//     setVendors((prev) => [...prev, newVendor]);
//     setFormData((prev) => ({
//       ...prev,
//       vendor: newVendor.businessName,
//       vendor_id: newVendor._id || newVendor.id
//     }));
//     setSearchTerm(newVendor.businessName);
//     showAlert('success', 'Vendor added successfully!');
//   };

//   const validateForm = () => {
//     let newErrors = {};

//     if (!formData.date) newErrors.date = 'Date is required';
//     if (!formData.voucherNo) newErrors.voucherNo = 'Voucher No is required';
//     if (!formData.vendor_id) newErrors.vendor = 'Vendor is required';
  
//     const selectedProducts = Object.keys(selectedRows).filter(id => selectedRows[id]);
//     if (selectedProducts.length === 0) {
//       newErrors.products = 'At least one product must be selected';
//     } else {
//       selectedProducts.forEach(productId => {
//         const row = selectedRows[productId];
//         if (!row.quantity || row.quantity <= 0) {
//           newErrors[`quantity_${productId}`] = 'Quantity is required and must be greater than 0';
//         }
//       });
//     }
    
//     return newErrors;
//   };

//   const prepareSubmitData = () => {
//     const productsData = Object.keys(selectedRows)
//       .filter(id => selectedRows[id] && selectedRows[id].quantity > 0)
//       .map(productId => {
//         const row = selectedRows[productId];
//         const productData = {
//           product: productId,
//           price: parseFloat(row.price) || 0,
//           purchasedQuantity: parseInt(row.quantity) || 0
//         };
        
//         return productData;
//       });
    
//     return {
//       date: new Date(formData.date).toISOString(),
//       voucherNo: formData.voucherNo,
//       vendor: formData.vendor_id,
//       products: productsData
//     };
//   };

//   const showAlert = (type, message) => {
//     setAlert({ visible: true, type, message });
//     setTimeout(() => setAlert(prev => ({ ...prev, visible: false })), 5000);
//   };

//   const handleReset = () => {
//     setFormData({
//       date: new Date().toISOString().split('T')[0],
//       voucherNo: '',
//       vendor: '',
//       vendor_id: ''
//     });
//     setSelectedRows({});
//     setSearchTerm('');
//     setProductSearchTerm('');
//     setErrors({});
//     setSelectionOrder([]);
//     selectionCounter.current = 0;
//     if (!id) {
//       generateAutoVoucherNumber();
//     }
    
//     showAlert('info', 'Form has been reset');
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
  
//     const newErrors = validateForm();
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setSubmitting(false);
//       showAlert('warning', 'Please fix the form errors before submitting');
//       return;
//     }
  
//     try {
//       const submitData = prepareSubmitData();
//       let response;
  
//       if (id) {
//         response = await axiosInstance.put(`/raisePO/${id}`, submitData);
//       } else {
//         response = await axiosInstance.post('/raisePO', submitData);
//       }
  
//       if (response.data.success) {
//         showAlert('success', `PO ${id ? 'updated' : 'created'} successfully!`);
//         setTimeout(() => {
//           navigate('/raise-po');
//         }, 1500);
//       } else {
//         showAlert('danger', response.data.message || 'Failed to save stock purchase');
//       }
      
//     } catch (error) {
//       console.error('Error saving stock purchase:', error);
      
//       let errorMessage = 'Failed to save stock purchase';
      
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
        
//         if (errorMessage.includes('validation failed')) {
//           if (errorMessage.includes('voucherNo')) {
//             errorMessage = 'Voucher number is required or already exists';
//           } else if (errorMessage.includes('vendor')) {
//             errorMessage = 'Please select a valid vendor';
//           } else if (errorMessage.includes('products')) {
//             errorMessage = 'Please select at least one product with valid quantity';
//           }
//         }
        
//         if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
//           errorMessage = 'Voucher number already exists. Please try again with a new voucher number.';

//           if (!id) {
//             setTimeout(() => {
//               generateAutoVoucherNumber();
//             }, 2000);
//           }
//         }
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       showAlert('danger', errorMessage);
//     } finally {
//       setSubmitting(false);
//     }
//   };
  
//   const filteredProducts = products
//     .filter((p) =>
//       p.productTitle?.toLowerCase().includes(productSearchTerm.toLowerCase())
//     )
//     .sort((a, b) => {
//       const aSelected = !!selectedRows[a._id];
//       const bSelected = !!selectedRows[b._id];
//       if (aSelected && bSelected) {
//         const aOrder = selectionOrder.find(item => item.productId === a._id)?.order || 0;
//         const bOrder = selectionOrder.find(item => item.productId === b._id)?.order || 0;
//         return aOrder - bOrder; 
//       }
//       if (aSelected && !bSelected) return -1;
//       if (!aSelected && bSelected) return 1;
//       return 0;
//     });

//   const handleBack = () => {
//     navigate('/raise-po');
//   };

//   return (
//     <div className="form-container">
//       <div className="title">
//         <CButton
//           size="sm"
//           className="back-button me-3"
//           onClick={handleBack}
//         >
//           <i className="fa fa-fw fa-arrow-left"></i>Back
//         </CButton>
//         Raise PO
//       </div>
      
//       <div className="form-card">
//         <div className="form-header header-button">
//           <button type="button" className="reset-button" onClick={handleReset}>
//             Reset
//           </button>
//         </div>

//         <div className="form-body">
//           {alert.visible && (
//             <CAlert 
//               color={alert.type} 
//               className="mb-3 mx-3" 
//               dismissible 
//               onClose={() => setAlert(prev => ({ ...prev, visible: false }))}
//             >
//               {alert.message}
//             </CAlert>
//           )}
 
//           <form onSubmit={handleSubmit}>
//             <div className="form-row">
//               <div className="form-group">
//                 <label  
//                   className={`form-label 
//                     ${errors.date ? 'error-label' : formData.date ? 'valid-label' : ''}`}
//                   htmlFor="date"
//                 >
//                   Date <span className="required">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   className={`form-input 
//                     ${errors.date ? 'error-input' : formData.date ? 'valid-input' : ''}`}
//                   value={formData.date}
//                   onChange={handleChange}
//                 />
//                 {errors.date && <span className="error">{errors.date}</span>}
//               </div>

//               <div className="form-group">
//                 <label  
//                   className={`form-label 
//                     ${errors.voucherNo ? 'error-label' : formData.voucherNo ? 'valid-label' : ''}`}
//                   htmlFor="voucherNo"
//                 >
//                   Voucher No <span className="required">*</span>
//                 </label>
//                 <div className="position-relative">
//                   <input
//                     type="text"
//                     id="voucherNo"
//                     name="voucherNo"
//                     className={`form-input ${errors.voucherNo ? 'error-input' : formData.voucherNo ? 'valid-input' : ''}`}
//                     value={formData.voucherNo}
//                     onChange={handleChange}
//                     disabled={id || generatingVoucher}
//                     style={{ width: '100%' }}
//                   />
//                   {generatingVoucher && !formData.voucherNo && (
//                     <div className="position-absolute top-50 end-0 translate-middle-y me-2">
//                       <CSpinner size="sm" />
//                     </div>
//                   )}
//                 </div>
//                 {errors.voucherNo && <span className="error">{errors.voucherNo}</span>}
//               </div>

//               <div className="form-group">
//                 <label className={`form-label ${errors.vendor ? 'error-label' : formData.vendor_id ? 'valid-label' : ''}`}>
//                   Vendor <span className="required">*</span>
//                 </label>
//                 <div className="input-with-button">
//                   <div className="select-input-wrapper">
//                     <Select
//                       id="vendor"
//                       name="vendor"
//                       placeholder="Search Vendor..."
//                       value={
//                         formData.vendor_id
//                           ? {
//                               value: formData.vendor_id,
//                               label: vendors.find((v) => v._id === formData.vendor_id)
//                                 ?.businessName || "",
//                             }
//                           : null
//                       }
//                       onChange={(selected) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           vendor_id: selected ? selected.value : "",
//                           vendor: selected ? vendors.find(v => v._id === selected.value)?.businessName : ""
//                         }))
//                       }
//                       options={vendors.map((vendor) => ({
//                         value: vendor._id,
//                         label: vendor.businessName,
//                       }))}
//                       isClearable
//                       classNamePrefix="react-select"
//                       className={`no-radius-input ${
//                         errors.vendor ? "error-input" : formData.vendor_id ? "valid-input" : ""
//                       }`}
//                     />
//                   </div>
//                   <button type="button" className="add-btn" onClick={handleAddVendor}>
//                     <CIcon icon={cilPlus} className='icon'/> ADD
//                   </button>
//                 </div>
//                 {errors.vendor && <span className="error">{errors.vendor}</span>}
//               </div>
//             </div>

//             <div className="mt-4">
//               <div className="d-flex justify-content-between mb-2">
//                 <h5>Products</h5>
//                 {errors.products && <span className="error-text">{errors.products}</span>}
//                 <div className="d-flex">
//                   <label className="me-2 mt-1">Search:</label>
//                   <CFormInput
//                     type="text"
//                     value={productSearchTerm}
//                     onChange={(e) => setProductSearchTerm(e.target.value)}
//                     style={{ maxWidth: '250px' }}
//                   />
//                 </div>
//               </div>

//               {loading ? (
//                 <div className="text-center my-3">
//                   <CSpinner color="primary" />
//                 </div>
//               ) : (
//                 <div className="responsive-table-wrapper">
//                 <CTable bordered striped className='responsive-table'>
//                   <CTableHead>
//                     <CTableRow>
//                       <CTableHeaderCell>Select</CTableHeaderCell>
//                       <CTableHeaderCell>Product Name</CTableHeaderCell>
//                       <CTableHeaderCell>Price</CTableHeaderCell>
//                       <CTableHeaderCell>Available Qty</CTableHeaderCell>
//                       <CTableHeaderCell>Purchase Qty</CTableHeaderCell>
//                     </CTableRow>
//                   </CTableHead>
//                   <CTableBody>
//                     {filteredProducts.length > 0 ? (
//                       filteredProducts.map((p) => (
//                         <CTableRow 
//                           key={p._id}
//                           className={selectedRows[p._id] ? 'selected-row' : 'table-row'}
//                         >
//                           <CTableDataCell>
//                             <input
//                               type="checkbox"
//                               checked={!!selectedRows[p._id]}
//                               onChange={() => handleRowSelect(p._id, p.productPrice, p.stock?.currentStock, p.trackSerialNumber)}
//                               style={{height:"20px", width:"20px"}}
//                             />
//                           </CTableDataCell>
//                           <CTableDataCell>{p.productTitle}</CTableDataCell>
//                           <CTableDataCell>
//                             {selectedRows[p._id] ? (
//                               <input
//                                 type="number"
//                                 value={selectedRows[p._id].price || p.productPrice}
//                                 onChange={(e) =>
//                                   handleRowInputChange(
//                                     p._id,
//                                     'price',
//                                     e.target.value
//                                   )
//                                 }
//                                 className="form-input"
//                                 style={{ width: '100px', height: '32px' }}
//                                 min="0"
//                                 step="0.01"
//                               />
//                             ) : (
//                              ''
//                             )}
//                           </CTableDataCell>
                  
//                           <CTableDataCell>{p.stock?.currentStock || 0}</CTableDataCell>
//                           <CTableDataCell>
//                             {selectedRows[p._id] ? (
//                               <input
//                                 type="number"
//                                 value={selectedRows[p._id].quantity}
//                                 onChange={(e) =>
//                                   handleRowInputChange(
//                                     p._id,
//                                     'quantity',
//                                     e.target.value
//                                   )
//                                 }
//                                 className={`form-input ${errors[`quantity_${p._id}`] ? 'error' : ''}`}
//                                 style={{ width: '100px', height: '32px' }}
//                                 min="1"
                                
//                               />
//                               ) : (
//                               ''
//                             )}
//                           </CTableDataCell>
//                         </CTableRow>
//                       ))
//                     ) : (
//                       <CTableRow>
//                         <CTableDataCell colSpan={6} className="text-center">
//                           No products found
//                         </CTableDataCell>
//                       </CTableRow>
//                     )}
//                   </CTableBody>
//                 </CTable>
//                 </div>
//               )}
//             </div>

//             <div className="form-footer">
//               <button type="submit" className="submit-button" disabled={submitting}>
//                 {submitting ? 'Submitting...' : 'Submit'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//       <VendorModal
//         visible={showVendorModal}
//         onClose={() => setShowVendorModal(false)}
//         onVendorAdded={handleVendorAdded} 
//       />
//     </div>
//   );
// };

// export default AddRaisePO;









import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import '../../css/table.css';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';
import { CFormInput, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CAlert, CButton } from '@coreui/react';
import VendorModal from '../stockPurchase/VendorModel';
import Select from 'react-select';

const AddRaisePO = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    voucherNo: '',
    vendor: '',
    vendor_id: ''
  });
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generatingVoucher, setGeneratingVoucher] = useState(false);
 
  const [selectionOrder, setSelectionOrder] = useState([]);
  const selectionCounter = useRef(0);

  const [alert, setAlert] = useState({
    visible: false,
    type: 'success',
    message: ''
  });
  
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      generateAutoVoucherNumber();
    }
  }, [id]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await axiosInstance.get('/vendor');
        setVendors(res.data.data || []);
      } catch (error) {
        console.log("error fetching vendors", error);
        showAlert('danger', 'Failed to fetch vendors');
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

const generateAutoVoucherNumber = async () => {
  setGeneratingVoucher(true);
  try {
    // Just call your new API endpoint
    const response = await axiosInstance.get('/raisePO/next-voucher');
    
    if (response.data.success && response.data.voucherNo) {
      setFormData(prev => ({
        ...prev,
        voucherNo: response.data.voucherNo
      }));
    } else {
      throw new Error('Invalid response from server');
    }
    
  } catch (error) {
    console.error('Error generating voucher number:', error);
    showAlert('danger', 'Failed to generate unique voucher number. Please try again.');
    
    // Optional: Clear the voucher number field so user can enter manually if needed
    setFormData(prev => ({
      ...prev,
      voucherNo: ''
    }));
  } finally {
    setGeneratingVoucher(false);
  }
};

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/stockpurchase/products/with-stock');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showAlert('danger', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStockPurchase = async () => {
      if (!id) return;
  
      try {
        const res = await axiosInstance.get(`/raisePO/${id}`);
        if (res.data.success) {
          const data = res.data.data;
          setFormData({
            date: data.date.split('T')[0],
            voucherNo: data.voucherNo,
            vendor: data.vendor.businessName,
            vendor_id: data.vendor._id || data.vendor.id
          });
  
          setSearchTerm(data.vendor.businessName);
          const selected = {};
          const order = [];
          
          data.products.forEach((prod, index) => {
            selected[prod.product._id] = {
              quantity: prod.purchasedQuantity,
              price: prod.price,
              productRemark: prod.productRemark || '',
              productInStock: prod.product.stock?.currentStock || 0
            };
            order.push({ productId: prod.product._id, order: index });
          });
          
          setSelectedRows(selected);
          setSelectionOrder(order);
          selectionCounter.current = data.products.length;
        }
      } catch (error) {
        console.error('Error fetching stock purchase for edit:', error);
        showAlert('danger', 'Failed to fetch stock purchase data');
      }
    };
  
    fetchStockPurchase();
  }, [id, products, vendors]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRowSelect = (productId, productPrice, productStock) => {
    setSelectedRows((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {
        setSelectionOrder(prevOrder => prevOrder.filter(item => item.productId !== productId));
        delete updated[productId];
      } else {
        const newOrder = selectionCounter.current++;
        setSelectionOrder(prevOrder => [
          { productId, order: newOrder },
          ...prevOrder
        ]);
        updated[productId] = { 
          quantity: '', 
          productRemark: '',
          price: productPrice || 0,
          productInStock: productStock || 0
        };
      }
      return updated;
    });
  };

  const handleRowInputChange = (productId, field, value) => {
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleAddVendor = () => {
    setShowVendorModal(true);
  };

  const handleVendorAdded = (newVendor) => {
    setVendors((prev) => [...prev, newVendor]);
    setFormData((prev) => ({
      ...prev,
      vendor: newVendor.businessName,
      vendor_id: newVendor._id || newVendor.id
    }));
    setSearchTerm(newVendor.businessName);
    showAlert('success', 'Vendor added successfully!');
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.voucherNo) newErrors.voucherNo = 'Voucher No is required';
    if (!formData.vendor_id) newErrors.vendor = 'Vendor is required';
  
    const selectedProducts = Object.keys(selectedRows).filter(id => selectedRows[id]);
    if (selectedProducts.length === 0) {
      newErrors.products = 'At least one product must be selected';
    } else {
      selectedProducts.forEach(productId => {
        const row = selectedRows[productId];
        if (!row.quantity || row.quantity <= 0) {
          newErrors[`quantity_${productId}`] = 'Quantity is required and must be greater than 0';
        }
      });
    }
    
    return newErrors;
  };

  const prepareSubmitData = () => {
    const productsData = Object.keys(selectedRows)
      .filter(id => selectedRows[id] && selectedRows[id].quantity > 0)
      .map(productId => {
        const row = selectedRows[productId];
        const productData = {
          product: productId,
          price: parseFloat(row.price) || 0,
          purchasedQuantity: parseInt(row.quantity) || 0
        };
        
        return productData;
      });
    
    return {
      date: new Date(formData.date).toISOString(),
      voucherNo: formData.voucherNo,
      vendor: formData.vendor_id,
      products: productsData
    };
  };

  const showAlert = (type, message) => {
    setAlert({ visible: true, type, message });
    setTimeout(() => setAlert(prev => ({ ...prev, visible: false })), 5000);
  };

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      voucherNo: '',
      vendor: '',
      vendor_id: ''
    });
    setSelectedRows({});
    setSearchTerm('');
    setProductSearchTerm('');
    setErrors({});
    setSelectionOrder([]);
    selectionCounter.current = 0;
    if (!id) {
      generateAutoVoucherNumber();
    }
    
    showAlert('info', 'Form has been reset');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
  
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      showAlert('warning', 'Please fix the form errors before submitting');
      return;
    }
  
    try {
      const submitData = prepareSubmitData();
      let response;
  
      if (id) {
        response = await axiosInstance.put(`/raisePO/${id}`, submitData);
      } else {
        response = await axiosInstance.post('/raisePO', submitData);
      }
  
      if (response.data.success) {
        showAlert('success', `PO ${id ? 'updated' : 'created'} successfully!`);
        setTimeout(() => {
          navigate('/raise-po');
        }, 1500);
      } else {
        showAlert('danger', response.data.message || 'Failed to save stock purchase');
      }
      
    } catch (error) {
      console.error('Error saving stock purchase:', error);
      
      let errorMessage = 'Failed to save stock purchase';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        
        if (errorMessage.includes('validation failed')) {
          if (errorMessage.includes('voucherNo')) {
            errorMessage = 'Voucher number is required or already exists';
          } else if (errorMessage.includes('vendor')) {
            errorMessage = 'Please select a valid vendor';
          } else if (errorMessage.includes('products')) {
            errorMessage = 'Please select at least one product with valid quantity';
          }
        }
        
        if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
          errorMessage = 'Voucher number already exists. Please try again with a new voucher number.';

          if (!id) {
            setTimeout(() => {
              generateAutoVoucherNumber();
            }, 2000);
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showAlert('danger', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  
  const filteredProducts = products
    .filter((p) =>
      p.productTitle?.toLowerCase().includes(productSearchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aSelected = !!selectedRows[a._id];
      const bSelected = !!selectedRows[b._id];
      if (aSelected && bSelected) {
        const aOrder = selectionOrder.find(item => item.productId === a._id)?.order || 0;
        const bOrder = selectionOrder.find(item => item.productId === b._id)?.order || 0;
        return aOrder - bOrder; 
      }
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });

  const handleBack = () => {
    navigate('/raise-po');
  };

  return (
    <div className="form-container">
      <div className="title">
        <CButton
          size="sm"
          className="back-button me-3"
          onClick={handleBack}
        >
          <i className="fa fa-fw fa-arrow-left"></i>Back
        </CButton>
        Raise PO
      </div>
      
      <div className="form-card">
        <div className="form-header header-button">
          <button type="button" className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>

        <div className="form-body">
          {alert.visible && (
            <CAlert 
              color={alert.type} 
              className="mb-3 mx-3" 
              dismissible 
              onClose={() => setAlert(prev => ({ ...prev, visible: false }))}
            >
              {alert.message}
            </CAlert>
          )}
 
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label  
                  className={`form-label 
                    ${errors.date ? 'error-label' : formData.date ? 'valid-label' : ''}`}
                  htmlFor="date"
                >
                  Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className={`form-input 
                    ${errors.date ? 'error-input' : formData.date ? 'valid-input' : ''}`}
                  value={formData.date}
                  onChange={handleChange}
                />
                {errors.date && <span className="error">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label  
                  className={`form-label 
                    ${errors.voucherNo ? 'error-label' : formData.voucherNo ? 'valid-label' : ''}`}
                  htmlFor="voucherNo"
                >
                  Voucher No <span className="required">*</span>
                </label>
                <div className="position-relative">
                  <input
                    type="text"
                    id="voucherNo"
                    name="voucherNo"
                    className={`form-input ${errors.voucherNo ? 'error-input' : formData.voucherNo ? 'valid-input' : ''}`}
                    value={formData.voucherNo}
                    onChange={handleChange}
                    disabled={id || generatingVoucher}
                    style={{ width: '100%' }}
                  />
                  {generatingVoucher && !formData.voucherNo && (
                    <div className="position-absolute top-50 end-0 translate-middle-y me-2">
                      <CSpinner size="sm" />
                    </div>
                  )}
                </div>
                {errors.voucherNo && <span className="error">{errors.voucherNo}</span>}
              </div>

              <div className="form-group">
                <label className={`form-label ${errors.vendor ? 'error-label' : formData.vendor_id ? 'valid-label' : ''}`}>
                  Vendor <span className="required">*</span>
                </label>
                <div className="input-with-button">
                  <div className="select-input-wrapper">
                    <Select
                      id="vendor"
                      name="vendor"
                      placeholder="Search Vendor..."
                      value={
                        formData.vendor_id
                          ? {
                              value: formData.vendor_id,
                              label: vendors.find((v) => v._id === formData.vendor_id)
                                ?.businessName || "",
                            }
                          : null
                      }
                      onChange={(selected) =>
                        setFormData((prev) => ({
                          ...prev,
                          vendor_id: selected ? selected.value : "",
                          vendor: selected ? vendors.find(v => v._id === selected.value)?.businessName : ""
                        }))
                      }
                      options={vendors.map((vendor) => ({
                        value: vendor._id,
                        label: vendor.businessName,
                      }))}
                      isClearable
                      classNamePrefix="react-select"
                      className={`no-radius-input ${
                        errors.vendor ? "error-input" : formData.vendor_id ? "valid-input" : ""
                      }`}
                    />
                  </div>
                  <button type="button" className="add-btn" onClick={handleAddVendor}>
                    <CIcon icon={cilPlus} className='icon'/> ADD
                  </button>
                </div>
                {errors.vendor && <span className="error">{errors.vendor}</span>}
              </div>
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-between mb-2">
                <h5>Products</h5>
                {errors.products && <span className="error-text">{errors.products}</span>}
                <div className="d-flex">
                  <label className="me-2 mt-1">Search:</label>
                  <CFormInput
                    type="text"
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    style={{ maxWidth: '250px' }}
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center my-3">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <div className="responsive-table-wrapper">
                <CTable bordered striped className='responsive-table'>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Select</CTableHeaderCell>
                      <CTableHeaderCell>Product Name</CTableHeaderCell>
                      <CTableHeaderCell>Price</CTableHeaderCell>
                      <CTableHeaderCell>Available Qty</CTableHeaderCell>
                      <CTableHeaderCell>Purchase Qty</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((p) => (
                        <CTableRow 
                          key={p._id}
                          className={selectedRows[p._id] ? 'selected-row' : 'table-row'}
                        >
                          <CTableDataCell>
                            <input
                              type="checkbox"
                              checked={!!selectedRows[p._id]}
                              onChange={() => handleRowSelect(p._id, p.productPrice, p.stock?.currentStock, p.trackSerialNumber)}
                              style={{height:"20px", width:"20px"}}
                            />
                          </CTableDataCell>
                          <CTableDataCell>{p.productTitle}</CTableDataCell>
                          <CTableDataCell>
                            {selectedRows[p._id] ? (
                              <input
                                type="number"
                                value={selectedRows[p._id].price || p.productPrice}
                                onChange={(e) =>
                                  handleRowInputChange(
                                    p._id,
                                    'price',
                                    e.target.value
                                  )
                                }
                                className="form-input"
                                style={{ width: '100px', height: '32px' }}
                                min="0"
                                step="0.01"
                              />
                            ) : (
                             ''
                            )}
                          </CTableDataCell>
                  
                          <CTableDataCell>{p.stock?.currentStock || 0}</CTableDataCell>
                          <CTableDataCell>
                            {selectedRows[p._id] ? (
                              <input
                                type="number"
                                value={selectedRows[p._id].quantity}
                                onChange={(e) =>
                                  handleRowInputChange(
                                    p._id,
                                    'quantity',
                                    e.target.value
                                  )
                                }
                                className={`form-input ${errors[`quantity_${p._id}`] ? 'error' : ''}`}
                                style={{ width: '100px', height: '32px' }}
                                min="1"
                                
                              />
                              ) : (
                              ''
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={6} className="text-center">
                          No products found
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
                </div>
              )}
            </div>

            <div className="form-footer">
              <button type="submit" className="submit-button" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <VendorModal
        visible={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        onVendorAdded={handleVendorAdded} 
      />
    </div>
  );
};

export default AddRaisePO;