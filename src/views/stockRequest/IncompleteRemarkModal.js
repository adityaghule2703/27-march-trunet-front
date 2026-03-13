import React, { useState, useEffect } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormTextarea } from '@coreui/react';
import PropTypes from 'prop-types';

const IncompleteRemarkModal = ({ visible, onClose, onSubmit, initialRemark = '' }) => {
  const [remark, setRemark] = useState('');

  useEffect(() => {
    if (initialRemark) setRemark(initialRemark);
    else setRemark('');
  }, [initialRemark, visible]);

  const handleSubmit = () => {
    if (!remark.trim()) return;
    onSubmit(remark);
  };

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Add Incomplete Remark</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormTextarea
          rows={4}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Enter remark..."
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Cancel</CButton>
        <CButton className='reset-button' onClick={handleSubmit}>Submit</CButton>
      </CModalFooter>
    </CModal>
  );
};

IncompleteRemarkModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialRemark: PropTypes.string,
  };
  
export default IncompleteRemarkModal;
