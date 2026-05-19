import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CButton,
  CFormLabel
} from '@coreui/react'
import PropTypes from 'prop-types'
import '../../css/form.css'

const ExportStockPurchase = ({ visible, onClose, onExport }) => {
  const [exportData, setExportData] = useState({
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    if (!visible) {
      setExportData({ 
        startDate: '', 
        endDate: '' 
      })
    }
  }, [visible])

  const handleChange = (e) => {
    const { name, value } = e.target
    setExportData(prev => ({ ...prev, [name]: value }))
  }

  // Format date from YYYY-MM-DD to DD-MM-YYYY for API
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return '';
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    }
    return dateString;
  };

  const handleExport = () => {
    if (exportData.startDate && exportData.endDate) {
      const start = new Date(exportData.startDate);
      const end = new Date(exportData.endDate);
      if (start > end) {
        alert('Start date cannot be after end date');
        return;
      }
    }
    
    const apiExportData = {
      startDate: formatDateToDDMMYYYY(exportData.startDate),
      endDate: formatDateToDDMMYYYY(exportData.endDate)
    }
    onExport(apiExportData)
    onClose()
  }

  const handleReset = () => {
    setExportData({ 
      startDate: '', 
      endDate: '' 
    })
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <CModal size="lg" visible={visible} onClose={handleClose}>
      <CModalHeader>
        <CModalTitle>Export Stock Purchase Report</CModalTitle>
      </CModalHeader>

      <CModalBody>
        {/* Date Range Filters */}
        <div className="form-row">
          <div className="form-group">
            <CFormLabel htmlFor="startDate">Start Date</CFormLabel>
            <CFormInput
              type="date"
              id="startDate"
              name="startDate"
              value={exportData.startDate}
              onChange={handleChange}
              placeholder="Select start date"
            />
            <small className="text-muted">Optional</small>
          </div>
          <div className="form-group">
            <CFormLabel htmlFor="endDate">End Date</CFormLabel>
            <CFormInput
              type="date"
              id="endDate"
              name="endDate"
              value={exportData.endDate}
              onChange={handleChange}
              placeholder="Select end date"
            />
            <small className="text-muted">Optional</small>
          </div>
        </div>
      </CModalBody>

      <CModalFooter>
        <CButton 
          color="secondary" 
          className="me-2" 
          onClick={handleReset}
        >
          Reset
        </CButton>
        <CButton 
          color="secondary" 
          className="me-2" 
          onClick={handleClose}
        >
          Cancel
        </CButton>
        <CButton 
          className='reset-button'
          onClick={handleExport}
        >
          Export
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ExportStockPurchase.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired
}

export default ExportStockPurchase