
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import '../../css/table.css';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';
import VendorModal from './VendorModel';
import { CFormInput, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CAlert, CButton } from '@coreui/react';
import SerialNumberModal from './SerialNumberModel';
import Select from 'react-select';

const AddStockPurchase = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    type: '',
    date: new Date().toISOString().split('T')[0],
    invoiceNo: '',
    vendor: '',
    vendor_id: '',
    transportAmount: '',
    remark: '',
    cgst: '',
    sgst: '',
    igst: ''
  });
  
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [selectedProductForSerial, setSelectedProductForSerial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    type: 'success',
    message: ''
  });
  
  const [selectionOrder, setSelectionOrder] = useState([]);
  const selectionCounter = useRef(0);

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
    fetchProducts();
  }, []);

  // useEffect(() => {
  //   const fetchStockPurchase = async () => {
  //     if (!id) return;
  //     try {
  //       const res = await axiosInstance.get(`/stockpurchase/${id}`);
  //       if (res.data.success) {
  //         const data = res.data.data;
  //         setFormData({
  //           type: data.type,
  //           date: data.date.split('T')[0],
  //           invoiceNo: data.invoiceNo,
  //           vendor: data.vendor.businessName,
  //           vendor_id: data.vendor._id || data.vendor.id,
  //           transportAmount: data.transportAmount,
  //           remark: data.remark,
  //           cgst: data.cgst,
  //           sgst: data.sgst,
  //           igst: data.igst,
  //         });

  //         const selected = {};
  //         const order = [];
          
  //         data.products.forEach((prod, index) => {
  //           selected[prod.product._id] = {
  //             quantity: prod.purchasedQuantity.toString(),
  //             price: prod.price.toString(),
  //             productRemark: prod.productRemark || '',
  //             productInStock: prod.product.stock?.currentStock || 0,
  //             trackSerialNumber: prod.product.trackSerialNumber,
  //             serialNumbers: (prod.serialNumbers || []).map(sn => 
  //               typeof sn === 'string' ? sn : sn.serialNumber
  //             ),
  //           };
  //           order.push({ productId: prod.product._id, order: index });
  //         });
          
  //         setSelectedRows(selected);
  //         setSelectionOrder(order);
  //         selectionCounter.current = data.products.length;
  //       }
  //     } catch (error) {
  //       console.error('Error fetching stock purchase for edit:', error);
  //       showAlert('danger', 'Failed to fetch stock purchase data');
  //     }
  //   };

  //   fetchStockPurchase();
  // }, [id]);
  

  useEffect(() => {
    const fetchStockPurchase = async () => {
      if (!id) return;
  
      try {
        const res = await axiosInstance.get(`/stockpurchase/${id}`);
        if (res.data.success) {
          const data = res.data.data;
          setFormData({
            type: data.type,
            date: data.date.split('T')[0],
            invoiceNo: data.invoiceNo,
            vendor: data.vendor.businessName,
            vendor_id: data.vendor._id || data.vendor.id,
            transportAmount: data.transportAmount,
            remark: data.remark,
            cgst: data.cgst,
            sgst: data.sgst,
            igst: data.igst,
          });
  
          const selected = {};
          const order = [];
          
          data.products.forEach((prod, index) => {
            let serialNumbers = [];
            if (prod.serialNumbers && prod.serialNumbers.length > 0) {
              serialNumbers = prod.serialNumbers.map(sn => 
                typeof sn === 'string' ? sn : sn.serialNumber || sn
              );
            }
  
            selected[prod.product._id] = {
              quantity: prod.purchasedQuantity.toString(),
              price: prod.price.toString(),
              productRemark: prod.productRemark || '',
              productInStock: prod.product.stock?.currentStock || 0,
              trackSerialNumber: prod.product.trackSerialNumber,
              serialNumbers: serialNumbers,
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
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleVendorSelect = (selectedOption) => {
    if (selectedOption) {
      setFormData(prev => ({
        ...prev,
        vendor_id: selectedOption.value,
        vendor: selectedOption.label
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        vendor_id: '',
        vendor: ''
      }));
    }
    setErrors(prev => ({ ...prev, vendor: '' }));
  };

  const handleRowSelect = (productId, productPrice, productStock, trackSerialNumber) => {
    setSelectedRows((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {

        setSelectionOrder(prevOrder => prevOrder.filter(item => item.productId !== productId));
        delete updated[productId];
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[`quantity_${productId}`];
          delete newErrors[`serial_${productId}`];
          return newErrors;
        });
      } else {

        const newOrder = selectionCounter.current++;
        setSelectionOrder(prevOrder => [
          { productId, order: newOrder },
          ...prevOrder
        ]);
        updated[productId] = { 
          quantity: '1',
          productRemark: '',
          price: (productPrice || 0).toString(),
          productInStock: productStock || 0,
          trackSerialNumber: trackSerialNumber,
          serialNumbers: []
        };
      }
      return updated;
    });
    setErrors(prev => ({ ...prev, products: '' }));
  };

  const handleRowInputChange = (productId, field, value) => {
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));

    if (field === 'quantity') {
      setErrors(prev => ({ ...prev, [`quantity_${productId}`]: '' }));
    }
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
    setErrors(prev => ({ ...prev, vendor: '' }));
    showAlert('success', 'Vendor added successfully!');
  };

  const handleOpenSerialModal = (product) => {
    setSelectedProductForSerial(product);
    setShowSerialModal(true);
  };

  const handleSerialNumbersSave = (productId, serialNumbers) => {
    const serialsArray = serialNumbers.split('\n')
      .map(sn => sn.trim())
      .filter(sn => sn.length > 0);
    
    setSelectedRows((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        serialNumbers: serialsArray
      },
    }));
    setShowSerialModal(false);
    setSelectedProductForSerial(null);
    setErrors(prev => ({ ...prev, [`serial_${productId}`]: '' }));
    showAlert('success', 'Serial numbers saved successfully!');
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.type.trim()) newErrors.type = 'Type is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.invoiceNo.trim()) newErrors.invoiceNo = 'Invoice No is required';
    if (!formData.vendor_id) newErrors.vendor = 'Vendor is required';

    const selectedProducts = Object.keys(selectedRows);
    if (selectedProducts.length === 0) {
      newErrors.products = 'At least one product must be selected';
    } else {
      let hasValidProduct = false;
      
      selectedProducts.forEach(productId => {
        const row = selectedRows[productId];

        const quantity = parseInt(row.quantity);
        if (!quantity || quantity <= 0) {
          newErrors[`quantity_${productId}`] = 'Quantity must be greater than 0';
        } else {
          hasValidProduct = true;
        }

        if (row.trackSerialNumber === "Yes") {
          const serialCount = row.serialNumbers ? row.serialNumbers.length : 0;
          if (serialCount !== quantity) {
            newErrors[`serial_${productId}`] = 
              `Serial numbers (${serialCount}) must match quantity (${quantity})`;
          }
        }
      });

      if (!hasValidProduct) {
        newErrors.products = 'All selected products must have valid quantity';
      }
    }
    
    return newErrors;
  };

  // const prepareSubmitData = () => {
  //   const productsData = Object.keys(selectedRows)
  //     .filter(id => selectedRows[id] && parseInt(selectedRows[id].quantity) > 0)
  //     .map(productId => {
  //       const row = selectedRows[productId];
  //       const productData = {
  //         product: productId,
  //         price: parseFloat(row.price) || 0,
  //         purchasedQuantity: parseInt(row.quantity) || 0
  //       };
        
  //       if (row.trackSerialNumber === "Yes" && row.serialNumbers && row.serialNumbers.length > 0) {
  //         productData.serialNumbers = row.serialNumbers;
  //       }
        
  //       if (row.productRemark) {
  //         productData.productRemark = row.productRemark;
  //       }
        
  //       return productData;
  //     });
    
  //   return {
  //     type: formData.type,
  //     date: new Date(formData.date).toISOString(),
  //     invoiceNo: formData.invoiceNo.trim(),
  //     vendor: formData.vendor_id,
  //     transportAmount: parseFloat(formData.transportAmount) || 0,
  //     remark: formData.remark,
  //     cgst: parseFloat(formData.cgst) || 0,
  //     sgst: parseFloat(formData.sgst) || 0,
  //     igst: parseFloat(formData.igst) || 0,
  //     products: productsData
  //   };
  // };
  

  const prepareSubmitData = () => {
    const productsData = Object.keys(selectedRows)
      .filter(id => selectedRows[id] && parseInt(selectedRows[id].quantity) > 0)
      .map(productId => {
        const row = selectedRows[productId];
        const productData = {
          product: productId,
          price: parseFloat(row.price) || 0,
          purchasedQuantity: parseInt(row.quantity) || 0
        };
        if (row.trackSerialNumber === "Yes") {
          if (row.serialNumbers && row.serialNumbers.length > 0) {
            productData.serialNumbers = row.serialNumbers;
          } else {
            productData.serialNumbers = [];
          }
        }
        
        if (row.productRemark) {
          productData.productRemark = row.productRemark;
        }
        
        return productData;
      });
    
    return {
      type: formData.type,
      date: new Date(formData.date).toISOString(),
      invoiceNo: formData.invoiceNo.trim(),
      vendor: formData.vendor_id,
      transportAmount: parseFloat(formData.transportAmount) || 0,
      remark: formData.remark,
      cgst: parseFloat(formData.cgst) || 0,
      sgst: parseFloat(formData.sgst) || 0,
      igst: parseFloat(formData.igst) || 0,
      products: productsData
    };
  };

  const showAlert = (type, message) => {
    setAlert({ visible: true, type, message });
    setTimeout(() => setAlert(prev => ({ ...prev, visible: false })), 5000);
  };

  const handleReset = () => {
    setFormData({
      type: '',
      date: new Date().toISOString().split('T')[0],
      invoiceNo: '',
      vendor: '',
      vendor_id: '',
      transportAmount: '',
      remark: '',
      cgst: '',
      sgst: '',
      igst: ''
    });
    setSelectedRows({});
    setProductSearchTerm('');
    setErrors({});
    setSelectionOrder([]);
    selectionCounter.current = 0;
    showAlert('info', 'Form has been reset');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    setErrors({});

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);

      const firstErrorKey = Object.keys(newErrors)[0];
      if (firstErrorKey) {
        const elementId = firstErrorKey.includes('quantity_') || firstErrorKey.includes('serial_') 
          ? 'products-section'
          : firstErrorKey;
        const element = document.getElementById(elementId) || document.querySelector(`[name="${firstErrorKey}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      
      showAlert('warning', 'Please fix the form errors before submitting');
      return;
    }
    
    try {
      const submitData = prepareSubmitData();
      let response;

      if (id) {
        response = await axiosInstance.put(`/stockpurchase/${id}`, submitData);
      } else {
        response = await axiosInstance.post('/stockpurchase', submitData);
      }

      if (response.data.success) {
        showAlert('success', `Stock purchase ${id ? 'updated' : 'created'} successfully!`);
        setTimeout(() => {
          navigate('/stock-purchase');
        }, 1500);
      } else {
        showAlert('danger', response.data.message || 'Failed to save stock purchase');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Error saving stock purchase:', error);
      let errorMessage = 'Failed to save stock purchase';

      if (error.response?.data) {
        const err = error.response.data;

        if (err.errors && Array.isArray(err.errors)) {

          const backendErrors = {};
          err.errors.forEach((e) => {
            if (e.field) {
              backendErrors[e.field] = e.message;
            }
          });
          
          if (Object.keys(backendErrors).length > 0) {
            setErrors(backendErrors);
            showAlert('danger', 'Please check the form for errors');
            setSubmitting(false);
            return;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      showAlert('danger', errorMessage);
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
    navigate('/stock-purchase');
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
        {id ? 'Edit' : 'Add'} Stock Purchase
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
                  className={`form-label ${errors.type ? 'error-label' : formData.type ? 'valid-label' : ''}`}
                  htmlFor="type"
                >
                  Type <span className="required">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  className={`form-input ${errors.type ? 'error-input' : formData.type ? 'valid-input' : ''}`}
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="new">New</option>
                  <option value="refurbish">Refurbish</option>
                </select>
                {errors.type && <span className="error">{errors.type}</span>}
              </div>

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
                {errors.date && <span className="error">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label  
                  className={`form-label ${errors.invoiceNo ? 'error-label' : formData.invoiceNo ? 'valid-label' : ''}`}
                  htmlFor="invoiceNo"
                >
                  Invoice No <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="invoiceNo"
                  name="invoiceNo"
                  placeholder="Invoice No."
                  className={`form-input ${errors.invoiceNo ? 'error-input' : formData.invoiceNo ? 'valid-input' : ''}`}
                  value={formData.invoiceNo}
                  onChange={handleChange}
                />
                {errors.invoiceNo && <span className="error">{errors.invoiceNo}</span>}
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
                              label: formData.vendor
                            }
                          : null
                      }
                      onChange={handleVendorSelect}
                      options={vendors.map((vendor) => ({
                        value: vendor._id || vendor.id,
                        label: vendor.businessName,
                      }))}
                      isClearable
                      classNamePrefix="react-select"
                      className={`no-radius-input ${errors.vendor ? "error-input" : formData.vendor_id ? "valid-input" : ""}`}
                    />
                  </div>
                  <button type="button" className="add-btn" onClick={handleAddVendor}>
                    <CIcon icon={cilPlus} className='icon'/> ADD
                  </button>
                </div>
                {errors.vendor && <span className="error">{errors.vendor}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="transportAmount">
                  Transport Amount
                </label>
                <input
                  type="number"
                  id="transportAmount"
                  name="transportAmount"
                  className="form-input"
                  value={formData.transportAmount}
                  onChange={handleChange}
                  placeholder='Transport Amount'
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Remark
                </label>
                <textarea
                  name="remark"
                  className="form-textarea"
                  value={formData.remark}
                  onChange={handleChange}
                  placeholder="Remark"
                  rows="3"
                />
              </div>

              <div className="form-group"></div>
              <div className="form-group"></div>
            </div>
            
            <h5>Invoice Taxes</h5>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="cgst">
                  CGST
                </label>
                <input
                  type="number"
                  id="cgst"
                  name="cgst"
                  className="form-input"
                  value={formData.cgst}
                  onChange={handleChange}
                  placeholder="CGST"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="sgst">
                  SGST
                </label>
                <input
                  type="number"
                  id="sgst"
                  name="sgst"
                  className="form-input"
                  value={formData.sgst}
                  onChange={handleChange}
                  placeholder="SGST"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="igst">
                  IGST
                </label>
                <input
                  type="number"
                  id="igst"
                  name="igst"
                  className="form-input"
                  value={formData.igst}
                  onChange={handleChange}
                  placeholder="IGST"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group"></div>
              <div className="form-group"></div>
              <div className="form-group"></div>
            </div>

            <div className="mt-4" id="products-section">
              <div className="d-flex justify-content-between mb-2">
                <h5>Products {errors.products && <span className="error-text ms-2">({errors.products})</span>}</h5>
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
                                  value={selectedRows[p._id].price}
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
                                <div>
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
                                    className={`form-input ${errors[`quantity_${p._id}`] ? 'error-input' : ''}`}
                                    style={{ width: '100px', height: '32px' }}
                                    min="1"
                                  />
                                  {errors[`quantity_${p._id}`] && (
                                    <div className="error-text small mt-1">{errors[`quantity_${p._id}`]}</div>
                                  )}
                                  {errors[`serial_${p._id}`] && (
                                    <div className="error-text small mt-1">{errors[`serial_${p._id}`]}</div>
                                  )}
                                </div>
                              ) : (
                                ''
                              )}
                              {selectedRows[p._id] && p.trackSerialNumber === "Yes" ? (
                                <span 
                                  style={{ fontSize: '18px', cursor: 'pointer', marginLeft: '8px', color:'#337ab7' }}
                                  onClick={() => handleOpenSerialModal(p)}
                                  title="Add Serial Numbers"
                                >☰</span>
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
      
      <SerialNumberModal
        visible={showSerialModal}
        onClose={() => {
          setShowSerialModal(false);
          setSelectedProductForSerial(null);
        }}
        product={selectedProductForSerial}
        selectedRow={selectedProductForSerial ? selectedRows[selectedProductForSerial._id] : null}
        onSave={handleSerialNumbersSave}
      />
    </div>
  );
};

export default AddStockPurchase;