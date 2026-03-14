

import React, { useState, useEffect } from 'react';
import { 
  CModal, 
  CModalHeader, 
  CModalTitle, 
  CModalBody, 
  CModalFooter, 
  CButton, 
  CTable, 
  CTableHead, 
  CTableRow, 
  CTableHeaderCell, 
  CTableBody, 
  CTableDataCell,
  CSpinner,
  CAlert
} from '@coreui/react';
import PropTypes from 'prop-types';
import axiosInstance from 'src/axiosInstance';

const TestingSerialNumber = ({ 
  visible, 
  onClose, 
  product, 
  usageQty,
  onSerialNumbersUpdate 
}) => {
  const [availableSerials, setAvailableSerials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSerials, setSelectedSerials] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [showDropdowns, setShowDropdowns] = useState({});
  const [userCenterId, setUserCenterId] = useState(null);

  const srNumbers = Array.from({ length: usageQty }, (_, i) => i + 1);

  useEffect(() => {
    const getUserCenter = async () => {
      try {
        const response = await axiosInstance.get('/auth/me');
        if (response.data.success && response.data.data?.user?.center?._id) {
          setUserCenterId(response.data.data.user.center._id);
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    
    getUserCenter();
  }, []);

  useEffect(() => {
    if (visible && product?._id && usageQty > 0 && userCenterId) {
      fetchAvailableSerials();
      const initialSelectedSerials = {};
      setSelectedSerials(initialSelectedSerials);
    }
  }, [visible, product, usageQty, userCenterId]);

  useEffect(() => {
    if (!visible) {
      setSelectedSerials({});
      setSearchTerms({});
      setShowDropdowns({});
      setError(null);
    }
  }, [visible]);

  const fetchAvailableSerials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!product?._id) {
        throw new Error('Product ID is required');
      }

      if (!userCenterId) {
        throw new Error('User center information not available');
      }

      const response = await axiosInstance.get(
        `/stockpurchase/serial-numbers/product/${userCenterId}/${product._id}`
      );
      
      if (response.data.success) {
        setAvailableSerials(response.data.data?.availableSerials || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch serial numbers');
      }
    } catch (err) {
      console.error('Error fetching serial numbers:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch serial numbers');
    } finally {
      setLoading(false);
    }
  };

  const handleSerialSelect = (srNumber, serialNumber) => {
    setSelectedSerials(prev => ({
      ...prev,
      [srNumber]: serialNumber
    }));
    setSearchTerms(prev => ({
      ...prev,
      [srNumber]: ''
    }));
    setShowDropdowns(prev => ({
      ...prev,
      [srNumber]: false
    }));
  };

  const handleDeleteSerial = (srNumber) => {
    setSelectedSerials(prev => {
      const newSelected = { ...prev };
      delete newSelected[srNumber];
      return newSelected;
    });
    setSearchTerms(prev => ({
      ...prev,
      [srNumber]: ''
    }));
  };

  const handleSearchChange = (srNumber, value) => {
    setSearchTerms(prev => ({
      ...prev,
      [srNumber]: value
    }));
  };

  const handleSearchFocus = (srNumber) => {
    setShowDropdowns(prev => ({
      ...prev,
      [srNumber]: true
    }));
  };

  const handleSearchBlur = (srNumber) => {
    setTimeout(() => {
      setShowDropdowns(prev => ({
        ...prev,
        [srNumber]: false
      }));
    }, 200);
  };

  const getFilteredOptions = (srNumber) => {
    const searchTerm = searchTerms[srNumber] || '';
    const currentlySelected = Object.values(selectedSerials);
    
    return availableSerials.filter(serial => {
      const matchesSearch = serial.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const isAvailable = !currentlySelected.includes(serial.serialNumber) || selectedSerials[srNumber] === serial.serialNumber;
      return matchesSearch && isAvailable;
    });
  };

  const handleSave = () => {
    const missingSerials = srNumbers.filter(srNum => !selectedSerials[srNum]);
    
    if (missingSerials.length > 0) {
      setError(`Please select serial numbers for all items (SR ${missingSerials.join(', ')})`);
      return;
    }
    const serialsArray = Object.entries(selectedSerials)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([srNumber, serialNumber]) => serialNumber);
  
    if (onSerialNumbersUpdate && product?._id) {
      onSerialNumbersUpdate(product._id, serialsArray);
    }
    
    onClose();
  };

  if (usageQty <= 0) {
    return null;
  }

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>
          Serial Numbers for {product?.productTitle}
          {userCenterId && (
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
              (Center: {userCenterId.substring(0, 8)}...)
            </span>
          )}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}

        {loading ? (
          <div className="text-center py-4">
            <CSpinner color="primary" />
            <div className="mt-2">Loading available serial numbers...</div>
          </div>
        ) : availableSerials.length === 0 ? (
          <div className="text-center py-4">
            <CAlert color="warning">
              No serial numbers available for this product in your outlet.
            </CAlert>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <small className="text-muted">
                Available serial numbers: {availableSerials.length}
              </small>
            </div>
            
            <CTable bordered striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell width="15%">SR.</CTableHeaderCell>
                  <CTableHeaderCell width="85%">Serial Number</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {srNumbers.map(srNumber => {
                  const selectedSerial = selectedSerials[srNumber];
                  const filteredOptions = getFilteredOptions(srNumber);
                  const showDropdown = showDropdowns[srNumber];
                  
                  return (
                    <CTableRow key={srNumber}>
                      <CTableDataCell>
                        <strong>{srNumber}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="select-dropdown-container" style={{ position: 'relative' }}>
                          {selectedSerial ? (
                            <div className="d-flex align-items-center gap-2">
                              <div className="flex-grow-1 p-2 border rounded bg-light">
                                <strong>{selectedSerial}</strong>
                              </div>
                              <CButton
                                color="danger"
                                size="sm"
                                onClick={() => handleDeleteSerial(srNumber)}
                                style={{ minWidth: '40px' }}
                              >
                                ×
                              </CButton>
                            </div>
                          ) : (
                            <div>
                              <div className="select-input-wrapper">
                                <input
                                  type="text"
                                  className="form-input"
                                  value={searchTerms[srNumber] || ''}
                                  onChange={(e) => handleSearchChange(srNumber, e.target.value)}
                                  onFocus={() => handleSearchFocus(srNumber)}
                                  onBlur={() => handleSearchBlur(srNumber)}
                                  placeholder="Search serial number"
                                  style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #d1d7dc',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                  }}
                                />
                              </div>
                              
                              {showDropdown && (
                                <div 
                                  className="select-dropdown"
                                  style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    backgroundColor: 'white',
                                    border: '1px solid #d1d7dc',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    zIndex: 1000,
                                    maxHeight: '200px',
                                    overflowY: 'auto'
                                  }}
                                >
                                  <div 
                                    className="select-dropdown-header"
                                    style={{
                                      padding: '8px 12px',
                                      backgroundColor: '#f8f9fa',
                                      borderBottom: '1px solid #d1d7dc',
                                      fontWeight: 'bold',
                                      fontSize: '14px'
                                    }}
                                  >
                                    <span>Select Serial Number</span>
                                  </div>
                                  <div className="select-list">
                                    {filteredOptions.length > 0 ? (
                                      filteredOptions.map((serial) => (
                                        <div
                                          key={serial.serialNumber}
                                          className="select-item1"
                                          onClick={() => handleSerialSelect(srNumber, serial.serialNumber)}
                                          style={{
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #f0f0f0',
                                            fontSize: '14px'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#f8f9fa';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'white';
                                          }}
                                        >
                                          <div className="select-name">
                                            {serial.serialNumber}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div 
                                        className="no-select"
                                        style={{
                                          padding: '8px 12px',
                                          color: '#6c757d',
                                          fontSize: '14px',
                                          textAlign: 'center'
                                        }}
                                      >
                                        No serial numbers found
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  );
                })}
              </CTableBody>
            </CTable>
          </>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <button 
          className='reset-button'
          onClick={handleSave}
          disabled={Object.keys(selectedSerials).length !== usageQty}
        >
          Save Changes
        </button>
      </CModalFooter>
    </CModal>
  );
};

TestingSerialNumber.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    _id: PropTypes.string,
    productTitle: PropTypes.string,
    trackSerialNumber: PropTypes.string
  }),
  usageQty: PropTypes.number.isRequired,
  onSerialNumbersUpdate: PropTypes.func.isRequired
};

TestingSerialNumber.defaultProps = {
  product: {
    _id: '',
    productTitle: ''
  },
  usageQty: 0
};

export default TestingSerialNumber;