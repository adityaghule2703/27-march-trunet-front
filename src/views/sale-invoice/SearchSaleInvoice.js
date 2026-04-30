// import React, { useState } from 'react'
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CButton
// } from '@coreui/react'
// import PropTypes from 'prop-types'
// import '../../css/search.css';
// import DatePicker from 'src/utils/DatePicker';
// import Select from 'react-select';

// const SearchSaleInvoice = ({ visible, onClose, onSearch, centers, resellers }) => {
//   const [searchData, setSearchData] = useState({
//     center: '',
//     reseller: '',
//     startDate: '',
//     endDate: ''
//   });

//   const handleDateChange = (dateValue) => {
//     if (dateValue && dateValue.includes(' to ')) {
//       const [startDate, endDate] = dateValue.split(' to ');
//       const formatDateForAPI = (dateStr) => {
//         const [day, month, year] = dateStr.split('-');
//         return `${year}-${month}-${day}`;
//       };
      
//       setSearchData(prev => ({ 
//         ...prev, 
//         startDate: formatDateForAPI(startDate),
//         endDate: formatDateForAPI(endDate)
//       }));
//     } else {
//       setSearchData(prev => ({ 
//         ...prev, 
//         startDate: '',
//         endDate: ''
//       }));
//     }
//   };

//   const handleSearch = () => {
//     const apiSearchData = {
//       center: searchData.center,
//       reseller: searchData.reseller
//     };
//     if (searchData.startDate && searchData.endDate) {
//       apiSearchData.startDate = searchData.startDate;
//       apiSearchData.endDate = searchData.endDate;
//     }

//     console.log('Search Data for API:', apiSearchData);
//     onSearch(apiSearchData);
//     onClose();
//   }

//   const handleReset = () => {
//     setSearchData({
//       center: '',
//       reseller: '',
//       startDate: '',
//       endDate: ''
//     });
//   }

//   return (
//     <>
//       <CModal size="lg" visible={visible} onClose={onClose}>
//         <CModalHeader>
//           <CModalTitle>Search Sale Invoices</CModalTitle>
//         </CModalHeader>

//         <CModalBody>
//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">Reseller</label>
//               <Select
//     id="reseller"
//     name="reseller"
//     placeholder="Select Reseller..."
//     value={
//       searchData.reseller
//         ? {
//             value: searchData.reseller,
//             label: resellers.find((r) => r._id === searchData.reseller)
//               ? resellers.find((r) => r._id === searchData.reseller).businessName
//               : "",
//           }
//         : null
//     }
//     onChange={(selected) =>
//       setSearchData((prev) => ({
//         ...prev,
//         reseller: selected ? selected.value : "",
//       }))
//     }
//     options={resellers.map((reseller) => ({
//       value: reseller._id,
//       label: reseller.businessName,
//     }))}
//     isClearable
//     classNamePrefix="react-select"
//     className="no-radius-input"
//   />
//             </div>
//             <div className="form-group">
//               <label className="form-label">Branch</label>
//               <Select
//     id="center"
//     name="center"
//     placeholder="Select Branch..."
//     value={
//       searchData.center
//         ? {
//             value: searchData.center,
//             label: centers.find((c) => c._id === searchData.center)
//               ? centers.find((c) => c._id === searchData.center).centerName
//               : "",
//           }
//         : null
//     }
//     onChange={(selected) =>
//       setSearchData((prev) => ({
//         ...prev,
//         center: selected ? selected.value : "",
//       }))
//     }
//     options={centers.map((center) => ({
//       value: center._id,
//       label: center.centerName,
//     }))}
//     isClearable
//     classNamePrefix="react-select"
//     className="no-radius-input"
//   />
//             </div>
//           </div>
        
//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">Date Range</label>
//               <DatePicker
//                 value={searchData.startDate && searchData.endDate 
//                   ? `${searchData.startDate.split('-').reverse().join('-')} to ${searchData.endDate.split('-').reverse().join('-')}`
//                   : ''}
//                 onChange={handleDateChange}
//                 placeholder="Select date range"
//                 className="no-radius-input date-input"
//               />
//             </div>
//           </div>
//         </CModalBody>

//         <CModalFooter>
//           <CButton color="secondary" onClick={handleReset}>
//             Reset
//           </CButton>
//           <CButton className='reset-button' onClick={handleSearch}>
//             Search
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </>
//   );
// };

// SearchSaleInvoice.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
//   resellers: PropTypes.array.isRequired
// }

// export default SearchSaleInvoice;



import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput
} from '@coreui/react'
import PropTypes from 'prop-types'
import '../../css/search.css';
import Select from 'react-select';

const SearchSaleInvoice = ({ visible, onClose, onSearch, centers, resellers }) => {
  const [searchData, setSearchData] = useState({
    center: '',
    reseller: '',
    startDate: '',
    endDate: ''
  });

  const [filteredCenters, setFilteredCenters] = useState([]);

  // Filter centers based on selected reseller
  useEffect(() => {
    if (searchData.reseller) {
      const filtered = centers.filter(center => 
        center.reseller?._id === searchData.reseller
      );
      setFilteredCenters(filtered);
    } else {
      setFilteredCenters(centers);
    }
    // Reset center selection when reseller changes
    setSearchData(prev => ({ ...prev, center: '' }));
  }, [searchData.reseller, centers]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const apiSearchData = {
      center: searchData.center,
      reseller: searchData.reseller
    };
    if (searchData.startDate && searchData.endDate) {
      apiSearchData.startDate = searchData.startDate;
      apiSearchData.endDate = searchData.endDate;
    } else if (searchData.startDate) {
      apiSearchData.startDate = searchData.startDate;
    } else if (searchData.endDate) {
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
    setFilteredCenters(centers);
  }

  // Get unique resellers for the dropdown
  const uniqueResellers = resellers.length > 0 ? resellers : 
    Array.from(new Map(centers.map(center => [center.reseller?._id, center.reseller])).values())
      .filter(r => r && r._id);

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
                        label: uniqueResellers.find((r) => r._id === searchData.reseller)
                          ? uniqueResellers.find((r) => r._id === searchData.reseller).businessName
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
                options={uniqueResellers.map((reseller) => ({
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
                placeholder={searchData.reseller ? "Select Branch..." : "Select Reseller First"}
                value={
                  searchData.center
                    ? {
                        value: searchData.center,
                        label: filteredCenters.find((c) => c._id === searchData.center)
                          ? filteredCenters.find((c) => c._id === searchData.center).centerName
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
                options={filteredCenters.map((center) => ({
                  value: center._id,
                  label: center.centerName,
                }))}
                isClearable
                isDisabled={!searchData.reseller}
                classNamePrefix="react-select"
                className="no-radius-input"
              />
              {searchData.reseller && filteredCenters.length === 0 && (
                <small className="text-muted" style={{ color: '#dc3545' }}>
                  No branches found for this reseller
                </small>
              )}
            </div>
          </div>
        
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <CFormInput
                type="date"
                name="startDate"
                value={searchData.startDate}
                onChange={handleDateChange}
                className="no-radius-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <CFormInput
                type="date"
                name="endDate"
                value={searchData.endDate}
                onChange={handleDateChange}
                className="no-radius-input"
                min={searchData.startDate}
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