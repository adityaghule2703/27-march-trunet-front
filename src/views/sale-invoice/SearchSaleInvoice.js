import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/react'
import PropTypes from 'prop-types'
import '../../css/search.css';
import DatePicker from 'src/utils/DatePicker';
import Select from 'react-select';

const SearchSaleInvoice = ({ visible, onClose, onSearch, centers, resellers }) => {
  const [searchData, setSearchData] = useState({
    center: '',
    reseller: '',
    startDate: '',
    endDate: ''
  });

  const handleDateChange = (dateValue) => {
    if (dateValue && dateValue.includes(' to ')) {
      const [startDate, endDate] = dateValue.split(' to ');
      const formatDateForAPI = (dateStr) => {
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month}-${day}`;
      };
      
      setSearchData(prev => ({ 
        ...prev, 
        startDate: formatDateForAPI(startDate),
        endDate: formatDateForAPI(endDate)
      }));
    } else {
      setSearchData(prev => ({ 
        ...prev, 
        startDate: '',
        endDate: ''
      }));
    }
  };

  const handleSearch = () => {
    const apiSearchData = {
      center: searchData.center,
      reseller: searchData.reseller
    };
    if (searchData.startDate && searchData.endDate) {
      apiSearchData.startDate = searchData.startDate;
      apiSearchData.endDate = searchData.endDate;
    }

    console.log('Search Data for API:', apiSearchData);
    onSearch(apiSearchData);
    onClose();
  }

  const handleReset = () => {
    setSearchData({
      center: '',
      reseller: '',
      startDate: '',
      endDate: ''
    });
  }

  return (
    <>
      <CModal size="lg" visible={visible} onClose={onClose}>
        <CModalHeader>
          <CModalTitle>Search Sale Invoices</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Reseller</label>
              <Select
    id="reseller"
    name="reseller"
    placeholder="Select Reseller..."
    value={
      searchData.reseller
        ? {
            value: searchData.reseller,
            label: resellers.find((r) => r._id === searchData.reseller)
              ? resellers.find((r) => r._id === searchData.reseller).businessName
              : "",
          }
        : null
    }
    onChange={(selected) =>
      setSearchData((prev) => ({
        ...prev,
        reseller: selected ? selected.value : "",
      }))
    }
    options={resellers.map((reseller) => ({
      value: reseller._id,
      label: reseller.businessName,
    }))}
    isClearable
    classNamePrefix="react-select"
    className="no-radius-input"
  />
            </div>
            <div className="form-group">
              <label className="form-label">Branch</label>
              <Select
    id="center"
    name="center"
    placeholder="Select Branch..."
    value={
      searchData.center
        ? {
            value: searchData.center,
            label: centers.find((c) => c._id === searchData.center)
              ? centers.find((c) => c._id === searchData.center).centerName
              : "",
          }
        : null
    }
    onChange={(selected) =>
      setSearchData((prev) => ({
        ...prev,
        center: selected ? selected.value : "",
      }))
    }
    options={centers.map((center) => ({
      value: center._id,
      label: center.centerName,
    }))}
    isClearable
    classNamePrefix="react-select"
    className="no-radius-input"
  />
            </div>
          </div>
        
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date Range</label>
              <DatePicker
                value={searchData.startDate && searchData.endDate 
                  ? `${searchData.startDate.split('-').reverse().join('-')} to ${searchData.endDate.split('-').reverse().join('-')}`
                  : ''}
                onChange={handleDateChange}
                placeholder="Select date range"
                className="no-radius-input date-input"
              />
            </div>
          </div>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={handleReset}>
            Reset
          </CButton>
          <CButton className='reset-button' onClick={handleSearch}>
            Search
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

SearchSaleInvoice.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  resellers: PropTypes.array.isRequired
}

export default SearchSaleInvoice;