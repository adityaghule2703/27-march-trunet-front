
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../css/form.css';
import '../../css/table.css';
import { 
  CFormInput, 
  CSpinner, 
  CTable, 
  CTableBody, 
  CTableDataCell, 
  CTableHead, 
  CTableHeaderCell, 
  CTableRow, 
  CAlert,
  CButton,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CProgress
} from '@coreui/react';
import TransferSerialNumber from './TransferRepairedSerialNumber';
import { confirmAction, showSuccess, showError } from '../../utils/sweetAlerts';

const TransferToReseller = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    transferRemark: '',
  });
  
  const [products, setProducts] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serialModalVisible, setSerialModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assignedSerials, setAssignedSerials] = useState({});
  const [outlets, setOutlets] = useState([]);
  const [acceptingItems, setAcceptingItems] = useState({}); // Track accepting state per item

  const [alert, setAlert] = useState({
    visible: false,
    type: 'success',
    message: ''
  });

  // Tabs state
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'available'

  // Fetch repaired products in outlet stock
  useEffect(() => {
    fetchRepairedProducts();
  }, []);

  const fetchRepairedProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/faulty-stock/outlet-repaired-stock');
      
      if (response.data.success) {
        console.log('Fetched repaired products in outlet:', response.data.data);
        
        const allProducts = response.data.data.repairedProducts || [];
        
        // Transform the data to include a properly formatted repairedSerials array
        const transformedProducts = allProducts.map(product => {
          // Create a comprehensive repairedSerials array
          const repairedSerials = [];
          
          // Add pending serials
          if (product.pendingRepairedSerials && Array.isArray(product.pendingRepairedSerials)) {
            product.pendingRepairedSerials.forEach(serial => {
              repairedSerials.push({
                ...serial,
                status: serial.status || "pending_approval",
                isPending: true
              });
            });
          }
          
          // Add available serials
          if (product.availableRepairedSerials && Array.isArray(product.availableRepairedSerials)) {
            product.availableRepairedSerials.forEach(serial => {
              repairedSerials.push({
                ...serial,
                status: serial.status || "available",
                isPending: false
              });
            });
          }
          
          // Also add any serials from resellerGroups
          if (product.resellerGroups && Array.isArray(product.resellerGroups)) {
            product.resellerGroups.forEach(group => {
              if (group.serials && Array.isArray(group.serials)) {
                group.serials.forEach(serialNumber => {
                  // Check if serial already exists
                  if (!repairedSerials.some(s => s.serialNumber === serialNumber)) {
                    repairedSerials.push({
                      serialNumber: serialNumber,
                      status: "available",
                      isPending: false,
                      source: "reseller_group"
                    });
                  }
                });
              }
            });
          }
          
          return {
            ...product,
            repairedSerials, // Properly formatted array
            totalRepairedQuantity: product.totalRepairedQuantity || 0,
            pendingRepairedQuantity: product.pendingRepairedQuantity || 0,
            availableRepairedQuantity: product.availableRepairedQuantity || 0
          };
        });
        
        setProducts(transformedProducts);
  
        const uniqueOutlets = [];
        const outletIds = new Set();
        
        transformedProducts.forEach(product => {
          if (product.outlet && !outletIds.has(product.outlet._id)) {
            outletIds.add(product.outlet._id);
            uniqueOutlets.push(product.outlet);
          }
        });
        
        setOutlets(uniqueOutlets);
      }
    } catch (error) {
      console.error('Error fetching repaired products:', error);
      showAlert('danger', 'Failed to fetch repaired products');
    } finally {
      setLoading(false);
    }
  };

  // New function to accept pending items
  const handleAcceptItem = async (product) => {
    try {
      const isSerialized = product.product?.trackSerialNumber === "Yes";
      let serialNumbers = [];
      
      if (isSerialized) {
        // For serialized products, get pending serials
        const pendingSerials = product.repairedSerials?.filter(
          serial => serial.status === "pending_approval"
        );
        
        if (!pendingSerials || pendingSerials.length === 0) {
          showAlert('warning', 'No pending items found for this product');
          return;
        }
        
        serialNumbers = pendingSerials.map(serial => serial.serialNumber);
        
        // Show confirmation for serialized
        const result = await confirmAction(
          'Accept Repaired Items',
          `Are you sure you want to accept ${serialNumbers.length} items of ${product.product?.productTitle}?<br>
          <small>Serial Numbers: ${serialNumbers.join(', ')}</small>`,
          'question',
          'Yes, accept items'
        );
        
        if (!result.isConfirmed) return;
      } else {
        // For non-serialized products
        const result = await confirmAction(
          'Accept Repaired Items',
          `Are you sure you want to accept repaired items of ${product.product?.productTitle}?`,
          'question',
          'Yes, accept items'
        );
        
        if (!result.isConfirmed) return;
      }

      // Set accepting state
      setAcceptingItems(prev => ({
        ...prev,
        [product.outletStockId]: true
      }));

      // Call accept API
      const acceptData = {
        productId: product.product._id,
        action: 'accept',
        ...(isSerialized && serialNumbers.length > 0 && { serialNumbers })
      };

      const response = await axiosInstance.post('/warehouse-repaired', acceptData);

      if (response.data.success) {
        showSuccess(response.data.message || 'Items accepted successfully!');
        
        await fetchRepairedProducts();
        setSelectedRows(prev => {
          const updated = { ...prev };
          delete updated[product.outletStockId];
          return updated;
        });
      } else {
        throw new Error(response.data.message || 'Failed to accept items');
      }
    } catch (error) {
      console.error('Error accepting item:', error);
      showError(error, 'Failed to accept items');
    } finally {
      setAcceptingItems(prev => ({
        ...prev,
        [product.outletStockId]: false
      }));
    }
  };

  // New function to accept selected items in bulk
  const handleAcceptSelected = async () => {
    const selectedProducts = Object.keys(selectedRows)
      .filter(id => selectedRows[id])
      .map(id => {
        const row = selectedRows[id];
        const product = products.find(p => p.outletStockId === id);
        return { ...product, selectedRow: row };
      });

    if (selectedProducts.length === 0) {
      showAlert('warning', 'Please select items to accept');
      return;
    }

    try {
      // Show confirmation
      const result = await confirmAction(
        'Accept Selected Items',
        `Are you sure you want to accept ${selectedProducts.length} item(s)?`,
        'question',
        'Yes, accept all'
      );

      if (!result.isConfirmed) return;

      setSubmitting(true);

      // Process each selected item
      for (const product of selectedProducts) {
        const isSerialized = product.product?.trackSerialNumber === "Yes";
        let serialNumbers = [];

        if (isSerialized) {
          // Get assigned serials or all pending serials
          serialNumbers = assignedSerials[product.outletStockId] || 
                         product.repairedSerials?.filter(s => s.status === "pending_approval")
                           .map(s => s.serialNumber) || [];
        }

        const acceptData = {
          productId: product.product._id,
          action: 'accept',
          ...(isSerialized && serialNumbers.length > 0 && { serialNumbers })
        };

        await axiosInstance.post('/warehouse-repaired', acceptData);
      }

      showSuccess(`${selectedProducts.length} item(s) accepted successfully!`);
      
      // Refresh list
      await fetchRepairedProducts();
      
      // Clear selections
      setSelectedRows({});
      setAssignedSerials({});
    } catch (error) {
      console.error('Error accepting selected items:', error);
      showError(error, 'Failed to accept items');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleOpenSerialModal = (product) => {
    const productForSerial = {
      _id: product.product._id,
      productTitle: product.product.productTitle,
      trackSerialNumber: product.product.trackSerialNumber,
      productId: product.product._id,
      outletStockId: product.outletStockId
    };
    
    setSelectedProduct(productForSerial);
    setSerialModalVisible(true);
  };

  const handleSerialNumbersUpdate = (outletStockId, serialsArray) => {
    setAssignedSerials(prev => ({
      ...prev,
      [outletStockId]: serialsArray
    }));
  };

  const handleRowSelect = (product) => {
    const outletStockId = product.outletStockId;
    
    setSelectedRows((prev) => ({
      ...prev,
      [outletStockId]: prev[outletStockId]
        ? undefined
        : { 
            quantity: Math.min(1, getPendingCount(product)), 
            remark: '',
            outletStockId: outletStockId,
            productId: product.product._id,
            productData: product,
            resellerGroups: product.resellerGroups,
            outlet: product.outlet
          },
    }));
  };

  const handleRowDataChange = (outletStockId, field, value) => {
    setSelectedRows((prev) => ({
      ...prev,
      [outletStockId]: {
        ...prev[outletStockId],
        [field]: value
      }
    }));
  };
// Update the getAvailableCount function
const getAvailableCount = (product) => {
  if (product.product?.trackSerialNumber === "Yes") {
    // Check both availableRepairedSerials and repairedSerials
    const availableSerials = product.availableRepairedSerials || [];
    const repairedSerials = product.repairedSerials || [];
    
    // Count from availableRepairedSerials (from API)
    const countFromApi = availableSerials.length;
    
    // Also check repairedSerials array for "available" status
    const countFromRepairedSerials = repairedSerials.filter(
      s => s.status === "available" && !s.isPending
    ).length;
    
    // Return the larger count (or API count if it exists)
    return countFromApi > 0 ? countFromApi : countFromRepairedSerials;
  }
  
  // For non-serialized products
  return product.availableRepairedQuantity || 0;
};

// Also update the getPendingCount function
const getPendingCount = (product) => {
  if (product.product?.trackSerialNumber === "Yes") {
    // Check both pendingRepairedSerials and repairedSerials
    const pendingSerials = product.pendingRepairedSerials || [];
    const repairedSerials = product.repairedSerials || [];
    
    // Count from pendingRepairedSerials (from API)
    const countFromApi = pendingSerials.length;
    
    // Also check repairedSerials array for pending items
    const countFromRepairedSerials = repairedSerials.filter(
      s => (s.status === "pending_approval" || s.isPending === true)
    ).length;
    
    // Return the larger count (or API count if it exists)
    return countFromApi > 0 ? countFromApi : countFromRepairedSerials;
  }
  
  // For non-serialized products
  return product.pendingRepairedQuantity || 0;
};
  const showAlert = (type, message) => {
    setAlert({ visible: true, type, message });
    setTimeout(() => setAlert(prev => ({ ...prev, visible: false })), 5000);
  };

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      transferRemark: '',
    });
    setSelectedRows({});
    setAssignedSerials({});
    setProductSearchTerm('');
    setErrors({});
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
  
    try {
      // Prepare data for transfer to reseller
      const selectedProducts = Object.keys(selectedRows)
        .filter(id => selectedRows[id])
        .map(id => {
          const row = selectedRows[id];
          const product = products.find(p => p.outletStockId === id);

          const resellerGroup = row.resellerGroups && row.resellerGroups.length > 0 
            ? row.resellerGroups[0] 
            : null;
          
          if (!resellerGroup) {
            throw new Error(`No reseller information found for product ${row.productData?.product?.productTitle}`);
          }

          const itemData = {
            productId: row.productId,
            quantity: parseInt(row.quantity) || 0,
            remark: row.remark || '',
            resellerId: resellerGroup.reseller._id,
            destinationCenterId: resellerGroup.center._id,
            outletStockId: row.outletStockId
          };

          if (product?.product?.trackSerialNumber === "Yes") {
            const serialNumbers = assignedSerials[row.outletStockId] || [];
            if (serialNumbers.length > 0) {
              itemData.serialNumbers = serialNumbers;
            }
          }
          
          return itemData;
        });

      if (selectedProducts.length === 0) {
        showAlert('warning', 'Please select items to transfer');
        setSubmitting(false);
        return;
      }

      const submitData = {
        items: selectedProducts,
        transferRemark: formData.transferRemark || ''
      };

      console.log('Submitting data to reseller:', submitData);

      const response = await axiosInstance.post('/faulty-stock/transfer-to-reseller-center', submitData);

      if (response.data.success) {
        showSuccess(response.data.message || 'Repaired stock transferred to reseller successfully!');
        setTimeout(() => {
          navigate('/reseller-stock');
        }, 1500);
      } else {
        showAlert('danger', response.data.message || 'Failed to transfer repaired stock to reseller');
      }
      
    } catch (error) {
      console.error('Error transferring to reseller:', error);
      showError(error, 'Failed to transfer repaired stock to reseller');
    } finally {
      setSubmitting(false);
    }
  };  

  const filteredProducts = products.filter((p) =>
    p.product?.productTitle?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    p.product?.productCode?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
    (p.reseller?.resellerName?.toLowerCase() || '').includes(productSearchTerm.toLowerCase()) ||
    (p.center?.centerName?.toLowerCase() || '').includes(productSearchTerm.toLowerCase())
  );

  const handleBack = () => {
    navigate('/faulty-stock');
  };

  const groupedProducts = filteredProducts.reduce((groups, product) => {
    const outletName = product.outlet?.centerName || 'Unknown Outlet';
    if (!groups[outletName]) {
      groups[outletName] = [];
    }
    groups[outletName].push(product);
    return groups;
  }, {});

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
        Manage Repaired Stock in Outlet
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

          {/* Tabs for Pending vs Available */}
          <CRow className="mb-4">
            <CCol>
              <div className="d-flex justify-content-between align-items-center">
                <div className="btn-group" role="group">
                  <CButton
                    color={activeTab === 'pending' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('pending')}
                    className="me-2"
                  >
                    Pending Approval
                    <CBadge color="warning" className="ms-2">
                      {products.filter(p => getPendingCount(p) > 0).length}
                    </CBadge>
                  </CButton>
                  <CButton
                    color={activeTab === 'available' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('available')}
                  >
                    Available Stock
                    <CBadge color="success" className="ms-2">
                      {products.filter(p => getAvailableCount(p) > 0).length}
                    </CBadge>
                  </CButton>
                </div>
                
                {/* Bulk Accept Button for Pending Tab */}
                {activeTab === 'pending' && Object.keys(selectedRows).length > 0 && (
                  <CButton
                    color="success"
                    onClick={handleAcceptSelected}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <CSpinner size="sm" /> Accepting...
                      </>
                    ) : (
                      `Accept Selected (${Object.keys(selectedRows).length})`
                    )}
                  </CButton>
                )}
              </div>
            </CCol>
          </CRow>

          {activeTab === 'pending' ? (
            <>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Pending Approval Items</strong>
                  <small className="text-muted ms-2">
                    Items transferred from repair center waiting for acceptance
                  </small>
                </CCardHeader>
                <CCardBody>
                  <div className="d-flex justify-content-between mb-3">
                  <div>
                  </div>
                    <div>
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
                    <div className="text-center my-5">
                      <CSpinner color="primary" />
                      <p className="mt-2">Loading repaired products...</p>
                    </div>
                  ) : (
                    <>
                      {Object.keys(groupedProducts).length > 0 ? (
                        Object.keys(groupedProducts).map((outletName) => (
                          <div key={outletName} className="mb-4">
                            <div className="responsive-table-wrapper">
                              <CTable bordered striped className='responsive-table'>
                                <CTableHead>
                                  <CTableRow>
                                    <CTableHeaderCell width="50px">Select</CTableHeaderCell>
                                    <CTableHeaderCell>Product Name</CTableHeaderCell>
                                    <CTableHeaderCell>Reseller</CTableHeaderCell>
                                    <CTableHeaderCell>Original Center</CTableHeaderCell>
                                    <CTableHeaderCell>Pending Qty</CTableHeaderCell>
                                    <CTableHeaderCell>Available Qty</CTableHeaderCell>
                                    <CTableHeaderCell width="120px">Action</CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                  {groupedProducts[outletName].map((product) => {
                                    const isSelected = !!selectedRows[product.outletStockId];
                                    const selectedRow = selectedRows[product.outletStockId];
                                    const trackSerial = product.product?.trackSerialNumber === "Yes";
                                    const pendingCount = getPendingCount(product);
                                    const availableCount = getAvailableCount(product);
                                    const isAccepting = acceptingItems[product.outletStockId];
                                    const resellerInfo = product.resellerGroups && product.resellerGroups.length > 0 
                                      ? product.resellerGroups[0] 
                                      : { reseller: { resellerName: 'N/A' }, center: { centerName: 'N/A' } };

                                    if (pendingCount === 0) return null;

                                    return (
                                      <CTableRow 
                                        key={product.outletStockId}
                                        className={isSelected ? 'table-primary' : ''}
                                      >
                                        <CTableDataCell>
                                          <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleRowSelect(product)}
                                            style={{ height: "20px", width: "20px" }}
                                          />
                                        </CTableDataCell>
                                        <CTableDataCell>
                                           {product.product?.productTitle || ''}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {resellerInfo.reseller?.resellerName || 'N/A'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          {resellerInfo.center?.centerName || 'N/A'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          <div className="d-flex align-items-center">
                                            <span className="me-2">{pendingCount}</span>
                                            {trackSerial && isSelected && (
                                              <CButton
                                                size="sm"
                                                color="info"
                                                onClick={() => handleOpenSerialModal(product)}
                                                title="Assign specific serials"
                                              >
                                                <i className="fa fa-fw fa-list"></i>
                                              </CButton>
                                            )}
                                          </div>
                                          {trackSerial && (
                                            <div className="mt-1">
                                              <small className="text-muted">
                                                {product.repairedSerials?.filter(s => s.status === "pending_approval").length || 0} serial(s)
                                              </small>
                                            </div>
                                          )}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          <span className={availableCount > 0 ? 'text-success' : 'text-muted'}>
                                            {availableCount}
                                          </span>
                                        </CTableDataCell>
                                        <CTableDataCell>
                                          <CButton
                                            size="sm"
                                            color="success"
                                            onClick={() => handleAcceptItem(product)}
                                            disabled={isAccepting}
                                            className="w-100"
                                          >
                                            {isAccepting ? (
                                              <CSpinner size="sm" />
                                            ) : (
                                              'Accept'
                                            )}
                                          </CButton>
                                        </CTableDataCell>
                                      </CTableRow>
                                    );
                                  })}
                                </CTableBody>
                              </CTable>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center my-5 py-5">
                          <i className="fa fa-check-circle fa-3x text-success mb-3"></i>
                          <h5>No Pending Items</h5>
                          <p className="text-muted">All repaired items have been accepted.</p>
                        </div>
                      )}
                    </>
                  )}
                </CCardBody>
              </CCard>
            </>
          ) : (
            <CCard>
              <CCardHeader>
                <strong>Available Repaired Stock</strong>
                <small className="text-muted ms-2">
                  Accepted items available for transfer to resellers
                </small>
              </CCardHeader>
              <CCardBody>
                {/* Form for transferring to reseller */}
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label  
                        className={`form-label ${errors.date ? 'error-label' : formData.date ? 'valid-label' : ''}`}
                        htmlFor="date"
                      >
                        Transfer Date <span className="required">*</span>
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
                      <label className="form-label" htmlFor="transferRemark">
                        Transfer Remark
                      </label>
                      <textarea
                        id="transferRemark"
                        name="transferRemark"
                        className="form-textarea"
                        value={formData.transferRemark}
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="d-flex justify-content-between mb-2">
                      <h5>Select Products for Reseller Transfer</h5>
                      {errors.products && <span className="error-text">{errors.products}</span>}
                      <div className="d-flex">
                        <label className="me-2 mt-1">Search:</label>
                        <CFormInput
                          type="text"
                          value={productSearchTerm}
                          onChange={(e) => setProductSearchTerm(e.target.value)}
                          style={{ maxWidth: '250px' }}
                          placeholder="Search available products..."
                        />
                      </div>
                    </div>

                    {loading ? (
                      <div className="text-center my-3">
                        <CSpinner color="primary" />
                      </div>
                    ) : (
                      <>
                        {Object.keys(groupedProducts).length > 0 ? (
                          Object.keys(groupedProducts).map((outletName) => (
                            <div key={outletName} className="mb-4">
                              <div className="responsive-table-wrapper">
                                <CTable bordered striped className='responsive-table'>
                                  <CTableHead>
                                    <CTableRow>
                                      <CTableHeaderCell>Select</CTableHeaderCell>
                                      <CTableHeaderCell>Product Name</CTableHeaderCell>
                                      <CTableHeaderCell>Reseller</CTableHeaderCell>
                                      <CTableHeaderCell>Original Center</CTableHeaderCell>
                                      <CTableHeaderCell>Available Qty</CTableHeaderCell>
                                      <CTableHeaderCell>Transfer Qty</CTableHeaderCell>
                                      <CTableHeaderCell>Remark</CTableHeaderCell>
                                    </CTableRow>
                                  </CTableHead>
                                  <CTableBody>
                                    {groupedProducts[outletName].map((product) => {
                                      const isSelected = !!selectedRows[product.outletStockId];
                                      const selectedRow = selectedRows[product.outletStockId];
                                      const trackSerial = product.product?.trackSerialNumber === "Yes";
                                      const availableCount = getAvailableCount(product);
                                      const resellerInfo = product.resellerGroups && product.resellerGroups.length > 0 
                                        ? product.resellerGroups[0] 
                                        : { reseller: { resellerName: 'N/A' }, center: { centerName: 'N/A' } };

                                      if (availableCount === 0) return null;

                                      return (
                                        <CTableRow 
                                          key={product.outletStockId}
                                          className={isSelected ? 'selected-row' : 'table-row'}
                                        >
                                          <CTableDataCell>
                                            <input
                                              type="checkbox"
                                              checked={isSelected}
                                              onChange={() => handleRowSelect(product)}
                                              style={{height:"20px", width:"20px"}}
                                            />
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {product.product?.productTitle || 'N/A'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {resellerInfo.reseller?.resellerName || 'N/A'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {resellerInfo.center?.centerName || 'N/A'}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            <span className="text-success fw-bold">
                                              {availableCount}
                                            </span>
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {isSelected && (
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <CFormInput
                                                  type="number"
                                                  value={selectedRow?.quantity || ''}
                                                  onChange={(e) => handleRowDataChange(product.outletStockId, 'quantity', e.target.value)}
                                                  placeholder="Qty"
                                                  style={{width:'100px'}}
                                                  min="1"
                                                  max={availableCount}
                                                />
                                                {trackSerial && (
                                                  <span
                                                    style={{
                                                      fontSize: '18px',
                                                      cursor: 'pointer',
                                                      color: '#337ab7',
                                                    }}
                                                    onClick={() => handleOpenSerialModal(product)}
                                                    title="Assign Serial Numbers"
                                                  >
                                                    ☰
                                                  </span>
                                                )}
                                              </div>
                                            )}
                                          </CTableDataCell>
                                          <CTableDataCell>
                                            {isSelected && (
                                              <CFormInput
                                                type="text"
                                                placeholder="remark..."
                                                value={selectedRow?.remark || ''}
                                                onChange={(e) => handleRowDataChange(product.outletStockId, 'remark', e.target.value)}
                                              />
                                            )}
                                          </CTableDataCell>
                                        </CTableRow>
                                      );
                                    })}
                                  </CTableBody>
                                </CTable>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center my-3">
                            <p>No available repaired products found</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="form-footer">
                    <button type="submit" className="submit-button" disabled={submitting}>
                      {submitting ? 'Transferring to Reseller...' : 'Transfer to Reseller Stock'}
                    </button>
                  </div>
                </form>
              </CCardBody>
            </CCard>
          )}
        </div>
      </div>

      <TransferSerialNumber
        visible={serialModalVisible}
        onClose={() => setSerialModalVisible(false)}
        product={selectedProduct}
        usageQty={parseInt(selectedRows[selectedProduct?.outletStockId]?.quantity) || 0}
        onSerialNumbersUpdate={(productId, serials) => {
          handleSerialNumbersUpdate(selectedProduct?.outletStockId, serials);
        }}
        availableSerials={selectedProduct ? 
          (products.find(p => p.outletStockId === selectedProduct.outletStockId)?.repairedSerials || []) 
          : []}
        showOnlyPending={activeTab === 'pending'}
      />
    </div>
  );
};

export default TransferToReseller;