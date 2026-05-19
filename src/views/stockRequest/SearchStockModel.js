// import React, { useState} from 'react'
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormInput,
//   CFormSelect,
//   CButton
// } from '@coreui/react'
// import PropTypes from 'prop-types'
// import '../../css/search.css';
// import DatePicker from 'src/utils/DatePicker';
// import Select from 'react-select';
// const SearchStockModel = ({ visible, onClose, onSearch, centers, outlets }) => {
//   const [searchData, setSearchData] = useState({
//     center: '',
//     outlet: '',
//     statusChanged: 'Any Status',
//     dateFilter: '',
//     indentNo: '',
//     currentStatus: 'Any Status',
//     indentDate: '',
//     startDate: '',
//     endDate: '',
//     indentStartDate: '',
//     indentEndDate: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setSearchData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleIndentDateChange = (dateValue) => {
//     if (dateValue && dateValue.includes(' to ')) {
//       const [startDate, endDate] = dateValue.split(' to ');
//       const formatDateForAPI = (dateStr) => {
//         const [day, month, year] = dateStr.split('-');
//         return `${year}-${month}-${day}`;
//       };
      
//       setSearchData(prev => ({ 
//         ...prev, 
//         indentStartDate: formatDateForAPI(startDate),
//         indentEndDate: formatDateForAPI(endDate)
//       }));
//     } else {
//       setSearchData(prev => ({ 
//         ...prev, 
//         indentStartDate: '',
//         indentEndDate: ''
//       }));
//     }
//   };

//   const handleSearch = () => {
//     const apiSearchData = {
//       keyword: searchData.indentNo,
//       center: searchData.center,
//       outlet: searchData.outlet,
//       status: searchData.currentStatus !== 'Any Status' ? searchData.currentStatus : ''
//     };
//     if (searchData.startDate && searchData.endDate) {
//       apiSearchData.startDate = searchData.startDate;
//       apiSearchData.endDate = searchData.endDate;
//     }
//     if (searchData.indentStartDate && searchData.indentEndDate) {
//       apiSearchData.startDate = searchData.indentStartDate;
//       apiSearchData.endDate = searchData.indentEndDate;
//     }

//     console.log('Search Data:', apiSearchData);
//     onSearch(apiSearchData);
//     onClose();
//   }
//   return (
//     <>
//       <CModal size="lg" visible={visible} onClose={onClose}>
//         <CModalHeader>
//           <CModalTitle>Search Stock Requests</CModalTitle>
//         </CModalHeader>

//         <CModalBody>
//           <div className="form-row">
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
//             <div className="form-group">
//               {/* <label className="form-label">Outlet</label>
//               <CFormSelect
//                 name="outlet"
//                 value={searchData.outlet}
//                 onChange={handleChange}
//                 className="form-input no-radius-input"
//               >
//                 <option value="">SELECT</option>
//                 {outlets.map((outlet) => (
//                   <option key={outlet._id} value={outlet._id}>
//                     {outlet.centerName}
//                   </option>
//                 ))}
//               </CFormSelect> */}
//             </div>
//           </div>
          
//           <h5>Date Filter based on status change</h5>
          
//           <div className="form-row">
//           <div className="form-group">
//               <label className="form-label">Status Changed</label>
//               <CFormSelect
//                 name="currentStatus"
//                 value={searchData.currentStatus}
//                 onChange={handleChange}
//                 className="form-input no-radius-input"
//               >
//                 <option value='Any Status'>Any Status</option>
//                 <option value='Submitted'>Submitted</option>
//                 <option value='Confirmed'>Confirmed</option>
//                 <option value='Shipped'>Shipped</option>
//                 <option value='Completed'>Completed</option>
//               </CFormSelect>
//             </div>
//             <div className="form-group">
//               <label className="form-label">Date</label>
//               <DatePicker
//                 value={searchData.indentStartDate && searchData.indentEndDate 
//                   ? `${searchData.indentStartDate.split('-').reverse().join('-')} to ${searchData.indentEndDate.split('-').reverse().join('-')}`
//                   : ''}
//                 onChange={handleIndentDateChange}
//                 placeholder="Date"
//                 className="no-radius-input date-input"
//               />
//             </div>
//           </div>
          
//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">Indent No.</label>
//               <CFormInput
//                 type="text"
//                 name="indentNo"
//                 value={searchData.indentNo}
//                 onChange={handleChange}
//                 className="form-input no-radius-input"
//                 placeholder="Indent Number"
//               />
//             </div>
//             <div className="form-group">
//               <label className="form-label">Current Status</label>
//               <CFormSelect
//                 name="currentStatus"
//                 value={searchData.currentStatus}
//                 onChange={handleChange}
//                 className="form-input no-radius-input"
//               >
//                 <option value='Any Status'>Any Status</option>
//                 <option value='Submitted'>Submitted</option>
//                 <option value='Confirmed'>Confirmed</option>
//                 <option value='Rejected'>Rejected</option>
//                 <option value='Shipped'>Shipped</option>
//                 <option value='Completed'>Completed</option>
//                 <option value='Incompleted'>Incompleted</option>
//                 <option value='Draft'>Draft</option>
//               </CFormSelect>
//             </div>
//           </div>
          
//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">Indent Date</label>
//               <DatePicker
//                 value={searchData.indentStartDate && searchData.indentEndDate 
//                   ? `${searchData.indentStartDate.split('-').reverse().join('-')} to ${searchData.indentEndDate.split('-').reverse().join('-')}`
//                   : ''}
//                 onChange={handleIndentDateChange}
//                 placeholder="Indent Date"
//                 className="no-radius-input date-input"
//               />
//             </div>
//             <div className="form-group">

//             </div>
//           </div>
//         </CModalBody>

//         <CModalFooter>
//           <CButton color="secondary" onClick={onClose}>
//             Close
//           </CButton>
//           <CButton className='reset-button' onClick={handleSearch}>
//             Search
//           </CButton>
//         </CModalFooter>
//       </CModal>
//     </>
//   );
// };

// SearchStockModel.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
//   outlets: PropTypes.array.isRequired
// }

// export default SearchStockModel;





import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CButton
} from '@coreui/react'
import PropTypes from 'prop-types'
import '../../css/search.css';
import Select from 'react-select';

const SearchStockModel = ({ visible, onClose, onSearch, centers, resellers }) => {
  const [searchData, setSearchData] = useState({
    center: '',
    statusChanged: 'Any Status',
    dateFilter: '',
    indentNo: '',
    currentStatus: 'Any Status',
    indentDate: '',
    startDate: '',
    endDate: '',
    indentStartDate: '',
    indentEndDate: '',
    reseller: ''
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  }

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const apiSearchData = {
      keyword: searchData.indentNo,
      center: searchData.center,
      status: searchData.currentStatus !== 'Any Status' ? searchData.currentStatus : '',
      reseller: searchData.reseller
    };
    
    if (searchData.startDate && searchData.endDate) {
      apiSearchData.startDate = searchData.startDate;
      apiSearchData.endDate = searchData.endDate;
    }

    console.log('Search Data:', apiSearchData);
    onSearch(apiSearchData);
    onClose();
  }

  const handleReset = () => {
    setSearchData({
      center: '',
      statusChanged: 'Any Status',
      dateFilter: '',
      indentNo: '',
      currentStatus: 'Any Status',
      indentDate: '',
      startDate: '',
      endDate: '',
      indentStartDate: '',
      indentEndDate: '',
      reseller: ''
    });
    setFilteredCenters(centers);
  }

  // Get unique resellers for the dropdown
  const uniqueResellers = resellers && resellers.length > 0 ? resellers : 
    Array.from(new Map(centers.map(center => [center.reseller?._id, center.reseller])).values())
      .filter(r => r && r._id);

  return (
    <>
      <CModal size="lg" visible={visible} onClose={onClose}>
        <CModalHeader>
          <CModalTitle>Search Stock Requests</CModalTitle>
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
          
          <h5>Date Filter based on status change</h5>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status Changed</label>
              <CFormSelect
                name="currentStatus"
                value={searchData.currentStatus}
                onChange={handleChange}
                className="form-input no-radius-input"
              >
                <option value='Any Status'>Any Status</option>
                <option value='Submitted'>Submitted</option>
                <option value='Confirmed'>Confirmed</option>
                <option value='Shipped'>Shipped</option>
                <option value='Completed'>Completed</option>
              </CFormSelect>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Indent No.</label>
              <CFormInput
                type="text"
                name="indentNo"
                value={searchData.indentNo}
                onChange={handleChange}
                className="form-input no-radius-input"
                placeholder="Indent Number"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Current Status</label>
              <CFormSelect
                name="currentStatus"
                value={searchData.currentStatus}
                onChange={handleChange}
                className="form-input no-radius-input"
              >
                <option value='Any Status'>Any Status</option>
                <option value='Submitted'>Submitted</option>
                <option value='Confirmed'>Confirmed</option>
                <option value='Rejected'>Rejected</option>
                <option value='Shipped'>Shipped</option>
                <option value='Completed'>Completed</option>
                <option value='Incompleted'>Incompleted</option>
                <option value='Draft'>Draft</option>
              </CFormSelect>
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

SearchStockModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  resellers: PropTypes.array.isRequired
}

export default SearchStockModel;