import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  CCard, 
  CCardBody, 
  CButton, 
  CSpinner, 
  CContainer, 
  CTable, 
  CTableHead, 
  CTableRow, 
  CTableHeaderCell, 
  CTableBody, 
  CTableDataCell, 
  CAlert, 
  CBadge, 
  CTooltip,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react';
import axiosInstance from 'src/axiosInstance';
import '../../css/profile.css';
import '../../css/form.css';
import { formatDateTime } from 'src/utils/FormatDateTime';
import usePermission from 'src/utils/usePermission';
import Swal from 'sweetalert2';

const TestingSerialNumbersModal = ({ visible, onClose, product }) => {
  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Serial Numbers for {product?.product?.productTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {product?.serialNumbers && product.serialNumbers.length > 0 ? (
          <div>
            <p><strong>Total Serial Numbers:</strong> {product.serialNumbers.length}</p>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <CTable bordered striped responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Serial Number</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {product.serialNumbers.map((serial, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{serial.serialNumber}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={
                          serial.status === 'pending_testing' ? 'warning' :
                          serial.status === 'under_testing' ? 'info' :
                          serial.status === 'tested' ? 'success' :
                          serial.status === 'returned' ? 'primary' :
                          serial.status === 'rejected' ? 'danger' : 'secondary'
                        }>
                          {serial.status || 'pending_testing'}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p>No serial numbers found for this product.</p>
          </div>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

TestingSerialNumbersModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    product: PropTypes.shape({
      productTitle: PropTypes.string
    }),
    serialNumbers: PropTypes.arrayOf(
      PropTypes.shape({
        serialNumber: PropTypes.string,
        status: PropTypes.string
      })
    )
  })
};

TestingSerialNumbersModal.defaultProps = {
  product: null
};

const TestingProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '', visible: false });
  const [serialModal, setSerialModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
  const userCenterId = userCenter._id;
  const isToCenter = data?.toCenter?._id === userCenterId;
  console.log("is to center", isToCenter);
  const { hasPermission } = usePermission();

  useEffect(() => {
    fetchTestingMaterial();
  }, [id]);

  const fetchTestingMaterial = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/testing-material/${id}`);
      
      if (response.data.success) {
        setData(response.data.data);
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

  const handleBack = () => navigate('/testing-stock');

  const handleOpenSerialModal = (product) => {
    setSelectedProduct(product);
    setSerialModal(true);
  };

  const handleAcceptRequest = async () => {
    const result = await Swal.fire({
      title: 'Accept Testing Request?',
      text: 'Are you sure you want to accept this testing request?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Accept',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      const response = await axiosInstance.put(`/testing-material/${id}/accept`, {});
      
      if (response.data.success) {
        setAlert({
          type: 'success',
          message: 'Testing request accepted successfully!',
          visible: true
        });
        fetchTestingMaterial();
      } else {
        throw new Error(response.data.message || 'Failed to accept request');
      }
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Error accepting request',
        visible: true
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending_testing': { color: 'warning', label: 'Pending Testing' },
      'under_testing': { color: 'info', label: 'Under Testing' },
      'completed': { color: 'success', label: 'Completed' },
      'cancelled': { color: 'danger', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { color: 'secondary', label: status };
    return <CBadge color={config.color}>{config.label}</CBadge>;
  };

  const getTestResultBadge = (result) => {
    const resultConfig = {
      'passed': { color: 'success', label: 'Passed' },
      'failed': { color: 'danger', label: 'Failed' },
      'inconclusive': { color: 'warning', label: 'Inconclusive' },
      'under_testing': { color: 'info', label: 'Testing' },
      'pending': { color: 'secondary', label: 'Pending' }
    };
    
    const config = resultConfig[result] || { color: 'secondary', label: result };
    return <CBadge color={config.color} size="sm">{config.label}</CBadge>;
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
        Error loading testing material: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="alert alert-warning" role="alert">
        Testing Material Request not found
      </div>
    );
  }

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
        Testing Material Request Details
      </div>
      
      <CCard className="profile-card">
        <div className="subtitle-row">
          <div className="subtitle">
            Request: {data.requestNumber}
            {data.status && (
              <span style={{ marginLeft: '10px' }}>
                {getStatusBadge(data.status)}
              </span>
            )}
          </div>

          <div className="d-flex align-items-center">
            {data.status === 'pending_testing' && isToCenter && hasPermission('Testing Material', 'accept_testing_request') && (
              <CButton color="success" className="me-2" onClick={handleAcceptRequest}>
                <i className="fa fa-check me-1"></i> Accept Request
              </CButton>
            )}
          </div>
        </div>
        
        <CCardBody className="profile-body p-0">
          <table className="customer-details-table">
            <tbody>
              <tr className="table-row">
                <td className="profile-label-cell">Request Number:</td>
                <td className="profile-value-cell">{data.requestNumber}</td>
                
                <td className="profile-label-cell">Status:</td>
                <td className="profile-value-cell">{getStatusBadge(data.status)}</td>
                
                <td className="profile-label-cell">Completed At:</td>
                <td className="profile-value-cell">{formatDateTime(data.completedAt || '')}</td>
              </tr>

              <tr className="table-row">
                <td className="profile-label-cell">From Center:</td>
                <td className="profile-value-cell">
                  {data.fromCenter?.centerName} ({data.fromCenter?.centerCode})
                </td>
                
                <td className="profile-label-cell">To Center:</td>
                <td className="profile-value-cell">
                  {data.toCenter?.centerName} ({data.toCenter?.centerCode})
                </td>
                
                <td className="profile-label-cell">Completed By:</td>
                <td className="profile-value-cell">{data.completedBy?.fullName || ''}</td>
              </tr>

              <tr className="table-row">
                <td className="profile-label-cell">Requested At:</td>
                <td className="profile-value-cell">{formatDateTime(data.requestedAt)}</td>
                
                <td className="profile-label-cell">Accepted At:</td>
                <td className="profile-value-cell">{formatDateTime(data.acceptedAt || '')}</td>
                
                <td className="profile-label-cell">Remark:</td>
                <td className="profile-value-cell">{data.remark || 'N/A'}</td>
              </tr>

              <tr className="table-row">
                <td className="profile-label-cell">Requested By:</td>
                <td className="profile-value-cell">{data.requestedBy?.fullName}</td>
                
                <td className="profile-label-cell">Accepted By:</td>
                <td className="profile-value-cell">{data.acceptedBy?.fullName || ''}</td>
                
                <td className="profile-label-cell">Total Products:</td>
                <td className="profile-value-cell">{data.products?.length || 0}</td>
              </tr>
            </tbody>
          </table>
        </CCardBody>
      </CCard>
      
      <CCard className="profile-card" style={{ marginTop: '20px' }}>
        <div className="subtitle-row">
          <div className="subtitle">Product Details</div>
        </div>
        
        <CCardBody>
          <CTable bordered striped responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Product</CTableHeaderCell>
                <CTableHeaderCell>Product Code</CTableHeaderCell>
                <CTableHeaderCell>Quantity</CTableHeaderCell>
                <CTableHeaderCell>Test Result</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {data.products?.length > 0 ? (
                data.products.map((item, index) => {
                  const isSerialized = item.product?.trackSerialNumber === "Yes";
                  const hasSerialNumbers = isSerialized && item.serialNumbers?.length > 0;
                  
                  return (
                    <CTableRow key={item._id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{item.product?.productTitle || ''}</CTableDataCell>
                      <CTableDataCell>{item.product?.productCode || ''}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <span>{item.quantity || 0}</span>
                          {hasSerialNumbers && (
                            <CTooltip 
                              content={`View ${item.serialNumbers.length} serial number(s)`}
                            >
                              <span
                                style={{ 
                                  fontSize: '18px', 
                                  cursor: 'pointer', 
                                  color: '#337ab7',
                                  marginLeft: '5px'
                                }}
                                onClick={() => handleOpenSerialModal(item)}
                                title="View Serial Numbers"
                              >
                                ☰
                              </span>
                            </CTooltip>
                          )}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {getTestResultBadge(item.testResult || 'pending')}
                      </CTableDataCell>
                    </CTableRow>
                  );
                })
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={6} className="text-center">
                    No products found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
      <TestingSerialNumbersModal
        visible={serialModal}
        onClose={() => setSerialModal(false)}
        product={selectedProduct}
      />
    </CContainer>
  );
};

export default TestingProfile;