// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from 'src/axiosInstance';
// import '../../css/form.css';
// import { CButton, CFormInput, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
// import Select from 'react-select';

// const AddReportSubmission = () => {
//   const [productSearchTerm, setProductSearchTerm] = useState('');
//   const [selectedRows, setSelectedRows] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [products, setProducts] = useState([]);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split('T')[0],
//     remark: '',
//   });

//   const [errors, setErrors] = useState({});
//   const [centers, setCenters] = useState([]);
//   const [otherCenter, setOtherCenter] = useState(false);
//   const [centerId, setCenterId] = useState('');
//   const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
// const userCenterType = (userCenter.centerType || 'Outlet').toLowerCase();

//   useEffect(() => {
//     const fetchCenters = async () => {
//       try {
//         const res = await axiosInstance.get('/centers');
//         setCenters(res.data.data || []);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchCenters();
//   }, []);

//   useEffect(() => {
//     const loadData = async () => {
//       await fetchProducts();
//       if (id) await fetchExistingSubmission(id);
//     };
//     loadData();
//   }, [id]);  

//   const fetchExistingSubmission = async (submissionId) => {
//     try {
//       const res = await axiosInstance.get(`/reportsubmission/${submissionId}`);
//       const data = res.data.data;
      
//       setFormData({
//         date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//         remark: data.remark || '',
//       });      
      
//       setOtherCenter(data.stockClosingForOtherCenter || false);
//       setCenterId(data.center?._id || '');
//       const existingSelectedRows = {};
//       if (data.products && Array.isArray(data.products)) {
//         data.products.forEach(product => {

//           existingSelectedRows[product.product._id || product.product] = {
//             productQty: product.productQty || 0,
//             damageQty: product.damageQty || 0,
//             comment: product.comment || '',
//           };          

//         });
//         setSelectedRows(existingSelectedRows);
//       }
//     } catch (error) {
//       console.log("Error fetching existing submission", error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await axiosInstance.get('/stocktransfer/summary/original-outlet');
//       if (res.data.success) {
//         const productSummary = res.data.data?.summary || [];
//         setProducts(productSummary);
       
//         if (!id) {
//           const initialSelectedRows = {};
//           productSummary.forEach(product => {
//             initialSelectedRows[product.productId] = {
//               productQty: product.currentStock?.warehouse?.available || product.currentStock?.center?.available,
//               damageQty: product.currentStock?.distributedCenters?.damaged || 0,
//               comment: '',
//             };
//           });
//           setSelectedRows(initialSelectedRows);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setLoading(false);
//     }
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

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const handleCenterChange = (e) => {
//     setCenterId(e.target.value);
//     setErrors((prev) => ({ ...prev, centerId: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let newErrors = {};
//     if (!formData.date) newErrors.date = 'This is a required field';
//     if (otherCenter && !centerId) newErrors.centerId = 'This is a required field';
//     if (!formData.remark) newErrors.remark = 'This is a required field';

//     const hasProductData = Object.keys(selectedRows).some(productId => 
//       selectedRows[productId].productQty > 0 || 
//       selectedRows[productId].damageQty > 0 || 
//       selectedRows[productId].comment !== ''
//     );

//     if (!hasProductData) {
//       newErrors.products = 'At least one product must have data';
//     }

//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       return;
//     }

//     const submissionData = {
//       date: formData.date,
//       stockClosingForOtherCenter: otherCenter,
//       center: otherCenter ? centerId : undefined,
//       remark: formData.remark,
//       products: Object.keys(selectedRows)
//         .filter(productId => 
//           selectedRows[productId].productQty > 0 || 
//           selectedRows[productId].damageQty > 0 || 
//           selectedRows[productId].comment !== ''
//         )
//         .map(productId => ({
//           product: productId,
//           productQty: Number(selectedRows[productId].productQty) || 0,
//           damageQty: Number(selectedRows[productId].damageQty) || 0,
//           comment: selectedRows[productId].comment || ''
//         })),
//       status: "Submitted"
//     };

//     if (!otherCenter) {
//       delete submissionData.center;
//     }

//     try {
//       if (id) {
//         await axiosInstance.put(`/reportsubmission/${id}`, submissionData);
//       } else {
//         await axiosInstance.post('/reportsubmission', submissionData);
//       }
//       navigate('/report-submission');
//     } catch (error) {
//       console.error('Error saving shifting request:', error);
//     }
//   };

//   const handleBack = () => {
//     navigate('/report-submission');
//   };

//   const filteredProducts = products.filter((p) =>
//     p.productName?.toLowerCase().includes(productSearchTerm.toLowerCase())
//   );

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
//         {id ? 'Edit' : 'Add'} Closing Stock
//       </div>
//       <div className="form-card">
//         <div className="form-body">
//           <form onSubmit={handleSubmit}>
//             <div className="form-row">
//               <div className="form-group">
//                 <label 
//                   className={`form-label ${errors.date ? 'error-label' : formData.date ? 'valid-label' : ''}`}
//                   htmlFor="date"
//                 >
//                   Date <span className="required">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   className={`form-input ${errors.date ? 'error-input' : formData.date ? 'valid-input' : ''}`}
//                   value={formData.date}
//                   onChange={handleChange}
//                 />
//                 {errors.date && <span className="error-text">{errors.date}</span>}
//               </div>


//               {userCenterType == 'outlet'&&(
//               <div className="form-group" style={{ marginTop: "30px" }}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={otherCenter}
//                     onChange={(e) => setOtherCenter(e.target.checked)}
//                   />{' '}
//                   Stock closing for other center
//                 </label>
//               </div>
//              )}

//               {otherCenter && (
//                 <div className="form-group">
//                   <label 
//                     className={`form-label ${errors.centerId ? 'error-label' : centerId ? 'valid-label' : ''}`}
//                     htmlFor="centerId"
//                   >
//                     Branch <span className="required">*</span>
//                   </label>
//                   {/* <select
//                     id="centerId"
//                     name="centerId"
//                     className={`form-input ${errors.centerId ? 'error-input' : centerId ? 'valid-input' : ''}`}
//                     value={centerId}
//                     onChange={handleCenterChange}
//                   >
//                     <option value="">SELECT</option>
//                     {centers.map((c) => (
//                       <option key={c._id} value={c._id}>
//                         {c.centerName}
//                       </option>
//                     ))}
//                   </select> */}

// <Select
//     id="centerId"
//     name="centerId"
//     value={
//       centers.find((c) => c._id === centerId)
//         ? {
//             label: centers.find((c) => c._id === centerId).centerName,
//             value: centerId,
//           }
//         : null
//     }
//     onChange={(selected) =>
//       handleCenterChange({
//         target: {
//           name: "centerId",
//           value: selected ? selected.value : "",
//         },
//       })
//     }
//     options={centers.map((center) => ({
//       label: center.centerName,
//       value: center._id,
//     }))}
//     placeholder="Search Branch"
//     classNamePrefix="react-select"
//     className={`react-select-container ${
//       errors.centerId ? "error-input" : centerId ? "valid-input" : ""
//     }`}
//   />

//                   {errors.centerId && <span className="error-text">{errors.centerId}</span>}
//                 </div>
//               )}

//               <div className="form-group">
//                 <label 
//                 className={`form-label ${errors.remark ? 'error-label' : formData.remark ? 'valid-label' : ''}`}
//                 htmlFor="remark">
//                   Remark <span className="required">*</span>
//                 </label>
//                 <textarea
//                   id="remark"
//                   name="remark"
//                   className={`form-textarea ${errors.remark ? 'error-input' : formData.remark ? 'valid-input' : ''}`}
//                   value={formData.remark}
//                   onChange={handleChange}
//                   placeholder="Remark"
//                   rows="3"
//                 />
//                 {errors.remark && <span className="error-text">{errors.remark}</span>}
//               </div>
//               {userCenterType == 'center'&&(
//               <div className="form-group">
            
//               </div>
//              )}
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
//                     placeholder="Search products..."
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
//                       <CTableHeaderCell>#</CTableHeaderCell>
//                       <CTableHeaderCell>Product</CTableHeaderCell>
//                       <CTableHeaderCell>Current Stock</CTableHeaderCell>
//                       <CTableHeaderCell>Product Qty</CTableHeaderCell>
//                       <CTableHeaderCell>Damage Qty</CTableHeaderCell>
//                       <CTableHeaderCell>Comment</CTableHeaderCell>
//                     </CTableRow>
//                   </CTableHead>
//                   <CTableBody>
//                     {filteredProducts.length > 0 ? (
//                       filteredProducts.map((p, index) => (
//                         <CTableRow key={p.productId}>
//                           <CTableDataCell>
//                             {index + 1}
//                           </CTableDataCell>
//                           <CTableDataCell>
//                             {p.productName}
//                           </CTableDataCell>
//                           <CTableDataCell>
//                             {p.currentStock?.warehouse?.available || p.currentStock?.center?.available}
                      
//                           </CTableDataCell>
//                           <CTableDataCell>
//                             <CFormInput
//                               type="number"
//                               min="0"
//                               value={selectedRows[p.productId]?.productQty || 0}
//                               onChange={(e) => handleRowInputChange(p.productId, 'productQty', e.target.value)}
//                               placeholder="Product Qty"
//                             />
//                           </CTableDataCell>
//                           <CTableDataCell>
//                             <CFormInput
//                               type="number"
//                               min="0"
//                               value={selectedRows[p.productId]?.damageQty || 0}
//                               onChange={(e) => handleRowInputChange(p.productId, 'damageQty', e.target.value)}
//                               placeholder="Damage Qty"
//                             />
//                           </CTableDataCell>
//                           <CTableDataCell>
//                             <CFormInput
//                               type="text"
//                               value={selectedRows[p.productId]?.comment || ''}
//                               onChange={(e) => handleRowInputChange(p.productId, 'comment', e.target.value)}
//                               placeholder="Add comment..."
//                             />
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
//               <button type="submit" className="reset-button">
//                 {id ? 'Update' : 'Submit'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddReportSubmission;






// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axiosInstance from 'src/axiosInstance';
// import '../../css/form.css';
// import { 
//   CButton, 
//   CFormInput, 
//   CSpinner, 
//   CTable, 
//   CTableBody, 
//   CTableDataCell, 
//   CTableHead, 
//   CTableHeaderCell, 
//   CTableRow,
//   CAlert
// } from '@coreui/react';
// import Select from 'react-select';

// const AddReportSubmission = () => {
//   const [productSearchTerm, setProductSearchTerm] = useState('');
//   const [selectedRows, setSelectedRows] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [products, setProducts] = useState([]);
//   const [alert, setAlert] = useState({ type: '', message: '' });
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split('T')[0],
//     remark: '',
//   });

//   const [errors, setErrors] = useState({});
//   const [centers, setCenters] = useState([]);
//   const [otherCenter, setOtherCenter] = useState(false);
//   const [centerId, setCenterId] = useState('');
//   const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
//   const userCenterType = (userCenter.centerType || 'Outlet').toLowerCase();

//   useEffect(() => {
//     const fetchCenters = async () => {
//       try {
//         const res = await axiosInstance.get('/centers');
//         setCenters(res.data.data || []);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchCenters();
//   }, []);

//   useEffect(() => {
//     const loadData = async () => {
//       await fetchProducts();
//       if (id) await fetchExistingSubmission(id);
//     };
//     loadData();
//   }, [id]);  

//   const fetchExistingSubmission = async (submissionId) => {
//     try {
//       const res = await axiosInstance.get(`/reportsubmission/${submissionId}`);
//       const data = res.data.data;
      
//       setFormData({
//         date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//         remark: data.remark || '',
//       });      
      
//       setOtherCenter(data.stockClosingForOtherCenter || false);
//       setCenterId(data.center?._id || '');
//       const existingSelectedRows = {};
//       if (data.products && Array.isArray(data.products)) {
//         data.products.forEach(product => {
//           existingSelectedRows[product.product._id || product.product] = {
//             productQty: product.productQty || 0,
//             damageQty: product.damageQty || 0,
//             comment: product.comment || '',
//           };          
//         });
//         setSelectedRows(existingSelectedRows);
//       }
//     } catch (error) {
//       console.log("Error fetching existing submission", error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await axiosInstance.get('/stocktransfer/summary/original-outlet');
//       if (res.data.success) {
//         const productSummary = res.data.data?.summary || [];
//         setProducts(productSummary);
       
//         if (!id) {
//           const initialSelectedRows = {};
//           productSummary.forEach(product => {
//             initialSelectedRows[product.productId] = {
//               productQty: product.currentStock?.warehouse?.available || product.currentStock?.center?.available || 0,
//               damageQty: product.currentStock?.distributedCenters?.damaged || 0,
//               comment: '',
//             };
//           });
//           setSelectedRows(initialSelectedRows);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setLoading(false);
//     }
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

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const handleCenterChange = (e) => {
//     setCenterId(e.target.value);
//     setErrors((prev) => ({ ...prev, centerId: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let newErrors = {};
//     if (!formData.date) newErrors.date = 'This is a required field';
//     if (otherCenter && !centerId) newErrors.centerId = 'This is a required field';
//     if (!formData.remark) newErrors.remark = 'This is a required field';

//     const hasProductData = Object.keys(selectedRows).some(productId => 
//       Number(selectedRows[productId].productQty) > 0 || 
//       Number(selectedRows[productId].damageQty) > 0 || 
//       selectedRows[productId].comment !== ''
//     );

//     if (!hasProductData) {
//       newErrors.products = 'At least one product must have data';
//     }

//     if (Object.keys(newErrors).length) {
//       setErrors(newErrors);
//       return;
//     }

//     const submissionData = {
//       date: formData.date,
//       stockClosingForOtherCenter: otherCenter,
//       center: otherCenter ? centerId : undefined,
//       remark: formData.remark,
//       products: Object.keys(selectedRows)
//         .filter(productId => 
//           Number(selectedRows[productId].productQty) > 0 || 
//           Number(selectedRows[productId].damageQty) > 0 || 
//           selectedRows[productId].comment !== ''
//         )
//         .map(productId => ({
//           product: productId,
//           productQty: Number(selectedRows[productId].productQty) || 0,
//           damageQty: Number(selectedRows[productId].damageQty) || 0,
//           comment: selectedRows[productId].comment || ''
//         })),
//       status: "Submitted"
//     };

//     if (!otherCenter) {
//       delete submissionData.center;
//     }

//     try {
//       if (id) {
//         await axiosInstance.put(`/reportsubmission/${id}`, submissionData);
//         setAlert({ type: 'success', message: 'Report submission updated successfully!' });
//       } else {
//         await axiosInstance.post('/reportsubmission', submissionData);
//         setAlert({ type: 'success', message: 'Report submission created successfully!' });
//       }
      
//       setTimeout(() => navigate('/report-submission'), 1500);
//     } catch (error) {
//       console.error('Error saving shifting request:', error);
      
//       let message = 'Failed to save report submission. Please try again!';
      
//       if (error.response) {
//         const data = error.response.data;
        
//         if (data.errors && Array.isArray(data.errors)) {
//           message = data.errors.join(", ");
//         } else {
//           message = data.message || data.error || message;
//         }
        
//         // Handle specific error message
//         if (data.message === "Only the closing center can update stockClosingForOtherCenter field") {
//           message = "Only the closing center can update stockClosingForOtherCenter field";
//         }
        
//       } else if (error.request) {
//         message = 'No response from server. Please check your connection.';
//       } else {
//         message = error.message;
//       }
      
//       setAlert({ type: 'danger', message });
//     }
//   };

//   const handleBack = () => {
//     navigate('/report-submission');
//   };

//   const filteredProducts = products.filter((p) =>
//     p.productName?.toLowerCase().includes(productSearchTerm.toLowerCase())
//   );

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
//         {id ? 'Edit' : 'Add'} Closing Stock
//       </div>
//       <div className="form-card">
//         <div className="form-body">
//           {alert.message && (
//             <CAlert color={alert.type} dismissible onClose={() => setAlert({ type: '', message: '' })}>
//               {alert.message}
//             </CAlert>
//           )}
//           <form onSubmit={handleSubmit}>
//             <div className="form-row">
//               <div className="form-group">
//                 <label 
//                   className={`form-label ${errors.date ? 'error-label' : formData.date ? 'valid-label' : ''}`}
//                   htmlFor="date"
//                 >
//                   Date <span className="required">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   className={`form-input ${errors.date ? 'error-input' : formData.date ? 'valid-input' : ''}`}
//                   value={formData.date}
//                   onChange={handleChange}
//                 />
//                 {errors.date && <span className="error-text">{errors.date}</span>}
//               </div>

//               {userCenterType == 'outlet' && (
//                 <div className="form-group" style={{ marginTop: "30px" }}>
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={otherCenter}
//                       onChange={(e) => setOtherCenter(e.target.checked)}
//                     />{' '}
//                     Stock closing for other center
//                   </label>
//                 </div>
//               )}

//               {otherCenter && (
//                 <div className="form-group">
//                   <label 
//                     className={`form-label ${errors.centerId ? 'error-label' : centerId ? 'valid-label' : ''}`}
//                     htmlFor="centerId"
//                   >
//                     Branch <span className="required">*</span>
//                   </label>
//                   <Select
//                     id="centerId"
//                     name="centerId"
//                     value={
//                       centers.find((c) => c._id === centerId)
//                         ? {
//                             label: centers.find((c) => c._id === centerId).centerName,
//                             value: centerId,
//                           }
//                         : null
//                     }
//                     onChange={(selected) =>
//                       handleCenterChange({
//                         target: {
//                           name: "centerId",
//                           value: selected ? selected.value : "",
//                         },
//                       })
//                     }
//                     options={centers.map((center) => ({
//                       label: center.centerName,
//                       value: center._id,
//                     }))}
//                     placeholder="Search Branch"
//                     classNamePrefix="react-select"
//                     className={`react-select-container ${
//                       errors.centerId ? "error-input" : centerId ? "valid-input" : ""
//                     }`}
//                   />
//                   {errors.centerId && <span className="error-text">{errors.centerId}</span>}
//                 </div>
//               )}

//               <div className="form-group">
//                 <label 
//                   className={`form-label ${errors.remark ? 'error-label' : formData.remark ? 'valid-label' : ''}`}
//                   htmlFor="remark">
//                   Remark <span className="required">*</span>
//                 </label>
//                 <textarea
//                   id="remark"
//                   name="remark"
//                   className={`form-textarea ${errors.remark ? 'error-input' : formData.remark ? 'valid-input' : ''}`}
//                   value={formData.remark}
//                   onChange={handleChange}
//                   placeholder="Remark"
//                   rows="3"
//                 />
//                 {errors.remark && <span className="error-text">{errors.remark}</span>}
//               </div>
//               {userCenterType == 'center' && (
//                 <div className="form-group">
//                   {/* Empty div */}
//                 </div>
//               )}
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
//                     placeholder="Search products..."
//                   />
//                 </div>
//               </div>

//               {loading ? (
//                 <div className="text-center my-3">
//                   <CSpinner color="primary" />
//                 </div>
//               ) : (
//                 <div className="responsive-table-wrapper">
//                   <CTable bordered striped className='responsive-table'>
//                     <CTableHead>
//                       <CTableRow>
//                         <CTableHeaderCell>#</CTableHeaderCell>
//                         <CTableHeaderCell>Product</CTableHeaderCell>
//                         <CTableHeaderCell>Current Stock</CTableHeaderCell>
//                         <CTableHeaderCell>Product Qty</CTableHeaderCell>
//                         <CTableHeaderCell>Damage Qty</CTableHeaderCell>
//                         <CTableHeaderCell>Comment</CTableHeaderCell>
//                       </CTableRow>
//                     </CTableHead>
//                     <CTableBody>
//                       {filteredProducts.length > 0 ? (
//                         filteredProducts.map((p, index) => (
//                           <CTableRow key={p.productId}>
//                             <CTableDataCell>
//                               {index + 1}
//                             </CTableDataCell>
//                             <CTableDataCell>
//                               {p.productName}
//                             </CTableDataCell>
//                             <CTableDataCell>
//                               {p.currentStock?.warehouse?.available || p.currentStock?.center?.available || 0}
//                             </CTableDataCell>
//                             <CTableDataCell>
//                               <CFormInput
//                                 type="number"
//                                 min="0"
//                                 value={selectedRows[p.productId]?.productQty || 0}
//                                 onChange={(e) => handleRowInputChange(p.productId, 'productQty', e.target.value)}
//                                 placeholder="Product Qty"
//                               />
//                             </CTableDataCell>
//                             <CTableDataCell>
//                               <CFormInput
//                                 type="number"
//                                 min="0"
//                                 value={selectedRows[p.productId]?.damageQty || 0}
//                                 onChange={(e) => handleRowInputChange(p.productId, 'damageQty', e.target.value)}
//                                 placeholder="Damage Qty"
//                               />
//                             </CTableDataCell>
//                             <CTableDataCell>
//                               <CFormInput
//                                 type="text"
//                                 value={selectedRows[p.productId]?.comment || ''}
//                                 onChange={(e) => handleRowInputChange(p.productId, 'comment', e.target.value)}
//                                 placeholder="Add comment..."
//                               />
//                             </CTableDataCell>
//                           </CTableRow>
//                         ))
//                       ) : (
//                         <CTableRow>
//                           <CTableDataCell colSpan={6} className="text-center">
//                             No products found
//                           </CTableDataCell>
//                         </CTableRow>
//                       )}
//                     </CTableBody>
//                   </CTable>
//                 </div>
//               )}
//             </div>
            
//             <div className="form-footer">
//               <button type="submit" className="reset-button">
//                 {id ? 'Update' : 'Submit'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddReportSubmission;









import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import { 
  CButton, 
  CFormInput, 
  CSpinner, 
  CTable, 
  CTableBody, 
  CTableDataCell, 
  CTableHead, 
  CTableHeaderCell, 
  CTableRow,
  CAlert
} from '@coreui/react';
import Select from 'react-select';

const AddReportSubmission = () => {
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    remark: '',
  });

  const [errors, setErrors] = useState({});
  const [centers, setCenters] = useState([]);
  const [otherCenter, setOtherCenter] = useState(false);
  const [centerId, setCenterId] = useState('');
  const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
  const userCenterType = (userCenter.centerType || 'Outlet').toLowerCase();

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axiosInstance.get('/centers');
        setCenters(res.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCenters();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();
      if (id) await fetchExistingSubmission(id);
    };
    loadData();
  }, [id]);  

  const fetchExistingSubmission = async (submissionId) => {
    try {
      const res = await axiosInstance.get(`/reportsubmission/${submissionId}`);
      const data = res.data.data;
      
      setFormData({
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        remark: data.remark || '',
      });      
      
      setOtherCenter(data.stockClosingForOtherCenter || false);
      setCenterId(data.center?._id || '');
      const existingSelectedRows = {};
      if (data.products && Array.isArray(data.products)) {
        data.products.forEach(product => {
          existingSelectedRows[product.product._id || product.product] = {
            productQty: product.productQty || 0,
            damageQty: product.damageQty || 0,
            comment: product.comment || '',
          };          
        });
        setSelectedRows(existingSelectedRows);
      }
    } catch (error) {
      console.log("Error fetching existing submission", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/stocktransfer/summary/original-outlet');
      if (res.data.success) {
        const productSummary = res.data.data?.summary || [];
        setProducts(productSummary);
       
        if (!id) {
          const initialSelectedRows = {};
          productSummary.forEach(product => {
            initialSelectedRows[product.productId] = {
              productQty: product.currentStock?.warehouse?.available || product.currentStock?.center?.available || 0,
              damageQty: product.currentStock?.distributedCenters?.damaged || 0,
              comment: '',
            };
          });
          setSelectedRows(initialSelectedRows);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCenterChange = (e) => {
    setCenterId(e.target.value);
    setErrors((prev) => ({ ...prev, centerId: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.date) newErrors.date = 'This is a required field';
    if (otherCenter && !centerId) newErrors.centerId = 'This is a required field';
    if (!formData.remark) newErrors.remark = 'This is a required field';

    const hasProductData = Object.keys(selectedRows).some(productId => 
      Number(selectedRows[productId].productQty) > 0 || 
      Number(selectedRows[productId].damageQty) > 0 || 
      selectedRows[productId].comment !== ''
    );

    if (!hasProductData) {
      newErrors.products = 'At least one product must have data';
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const submissionData = {
      date: formData.date,
      stockClosingForOtherCenter: otherCenter,
      center: otherCenter ? centerId : undefined,
      remark: formData.remark,
      products: Object.keys(selectedRows)
        .filter(productId => 
          Number(selectedRows[productId].productQty) > 0 || 
          Number(selectedRows[productId].damageQty) > 0 || 
          selectedRows[productId].comment !== ''
        )
        .map(productId => ({
          product: productId,
          productQty: Number(selectedRows[productId].productQty) || 0,
          damageQty: Number(selectedRows[productId].damageQty) || 0,
          comment: selectedRows[productId].comment || ''
        })),
      status: "Submitted"
    };

    if (!otherCenter) {
      delete submissionData.center;
    }

    try {
      if (id) {
        await axiosInstance.put(`/reportsubmission/${id}`, submissionData);
        setAlert({ type: 'success', message: 'Report submission updated successfully!' });
      } else {
        await axiosInstance.post('/reportsubmission', submissionData);
        setAlert({ type: 'success', message: 'Report submission created successfully!' });
      }
      
      setTimeout(() => navigate('/report-submission'), 1500);
    } catch (error) {
      console.error('Error saving shifting request:', error);
      
      let message = 'Failed to save report submission. Please try again!';
      
      if (error.response) {
        const data = error.response.data;
        
        if (data.errors && Array.isArray(data.errors)) {
          message = data.errors.join(", ");
        } else {
          message = data.message || data.error || message;
        }
        
        if (data.message === "Only the closing center can update stockClosingForOtherCenter field") {
          message = "Only the closing center can update stockClosingForOtherCenter field";
        }
        
      } else if (error.request) {
        message = 'No response from server. Please check your connection.';
      } else {
        message = error.message;
      }
      
      setAlert({ type: 'danger', message });
    }
  };

  const handleBack = () => {
    navigate('/report-submission');
  };

  const filteredProducts = products.filter((p) =>
    p.productName?.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

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
        {id ? 'Edit' : 'Add'} Closing Stock
      </div>
      <div className="form-card">
        <div className="form-body">
          {alert.message && (
            <CAlert color={alert.type} dismissible onClose={() => setAlert({ type: '', message: '' })}>
              {alert.message}
            </CAlert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label 
                  className={`form-label ${errors.date ? 'error-label' : formData.date ? 'valid-label' : ''}`}
                  htmlFor="date"
                >
                  Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className={`form-input ${errors.date ? 'error-input' : formData.date ? 'valid-input' : ''}`}
                  value={formData.date}
                  onChange={handleChange}
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>

              {userCenterType == 'outlet' && (
                <div className="form-group" style={{ marginTop: "30px" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={otherCenter}
                      onChange={(e) => setOtherCenter(e.target.checked)}
                    />{' '}
                    Stock closing for other center
                  </label>
                </div>
              )}

              {otherCenter && (
                <div className="form-group">
                  <label 
                    className={`form-label ${errors.centerId ? 'error-label' : centerId ? 'valid-label' : ''}`}
                    htmlFor="centerId"
                  >
                    Branch <span className="required">*</span>
                  </label>
                  <Select
                    id="centerId"
                    name="centerId"
                    value={
                      centers.find((c) => c._id === centerId)
                        ? {
                            label: centers.find((c) => c._id === centerId).centerName,
                            value: centerId,
                          }
                        : null
                    }
                    onChange={(selected) =>
                      handleCenterChange({
                        target: {
                          name: "centerId",
                          value: selected ? selected.value : "",
                        },
                      })
                    }
                    options={centers.map((center) => ({
                      label: center.centerName,
                      value: center._id,
                    }))}
                    placeholder="Search Branch"
                    classNamePrefix="react-select"
                    className={`react-select-container ${
                      errors.centerId ? "error-input" : centerId ? "valid-input" : ""
                    }`}
                  />
                  {errors.centerId && <span className="error-text">{errors.centerId}</span>}
                </div>
              )}

              <div className="form-group">
                <label 
                  className={`form-label ${errors.remark ? 'error-label' : formData.remark ? 'valid-label' : ''}`}
                  htmlFor="remark">
                  Remark <span className="required">*</span>
                </label>
                <textarea
                  id="remark"
                  name="remark"
                  className={`form-textarea ${errors.remark ? 'error-input' : formData.remark ? 'valid-input' : ''}`}
                  value={formData.remark}
                  onChange={handleChange}
                  placeholder="Remark"
                  rows="3"
                />
                {errors.remark && <span className="error-text">{errors.remark}</span>}
              </div>
              {userCenterType == 'center' && (
                <div className="form-group">
                  {/* Empty div */}
                </div>
              )}
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
                    placeholder="Search products..."
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
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell>Product</CTableHeaderCell>
                        <CTableHeaderCell>Current Stock</CTableHeaderCell>
                        <CTableHeaderCell>Product Qty</CTableHeaderCell>
                        <CTableHeaderCell>Damage Qty</CTableHeaderCell>
                        <CTableHeaderCell>Comment</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((p, index) => (
                          <CTableRow key={p.productId}>
                            <CTableDataCell>
                              {index + 1}
                            </CTableDataCell>
                            <CTableDataCell>
                              {p.productName}
                            </CTableDataCell>
                            <CTableDataCell>
                              {p.currentStock?.warehouse?.available || p.currentStock?.center?.available || 0}
                            </CTableDataCell>
                            <CTableDataCell>
                              {/* Product Qty - Display as plain text, non-editable */}
                              {selectedRows[p.productId]?.productQty || 0}
                            </CTableDataCell>
                            <CTableDataCell>
                              {/* Damage Qty - Display as plain text, non-editable */}
                              {selectedRows[p.productId]?.damageQty || 0}
                            </CTableDataCell>
                            <CTableDataCell>
                              {/* Comment - Keep as editable input field */}
                              <CFormInput
                                type="text"
                                value={selectedRows[p.productId]?.comment || ''}
                                onChange={(e) => handleRowInputChange(p.productId, 'comment', e.target.value)}
                                placeholder="Add comment..."
                              />
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
              <button type="submit" className="reset-button">
                {id ? 'Update' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReportSubmission;