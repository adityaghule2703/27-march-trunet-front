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





// import React, { useState, useEffect } from 'react'
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
// import Select from 'react-select';

// const SearchStockModel = ({ visible, onClose, onSearch, centers, resellers }) => {
//   const [searchData, setSearchData] = useState({
//     center: '',
//     statusChanged: 'Any Status',
//     dateFilter: '',
//     indentNo: '',
//     currentStatus: 'Any Status',
//     indentDate: '',
//     startDate: '',
//     endDate: '',
//     indentStartDate: '',
//     indentEndDate: '',
//     reseller: ''
//   });

//   const [filteredCenters, setFilteredCenters] = useState([]);

//   // Filter centers based on selected reseller
//   useEffect(() => {
//     if (searchData.reseller) {
//       const filtered = centers.filter(center => 
//         center.reseller?._id === searchData.reseller
//       );
//       setFilteredCenters(filtered);
//     } else {
//       setFilteredCenters(centers);
//     }
//     // Reset center selection when reseller changes
//     setSearchData(prev => ({ ...prev, center: '' }));
//   }, [searchData.reseller, centers]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSearchData(prev => ({ ...prev, [name]: value }));
//   }

//   const handleDateChange = (e) => {
//     const { name, value } = e.target;
//     setSearchData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSearch = () => {
//     const apiSearchData = {
//       keyword: searchData.indentNo,
//       center: searchData.center,
//       status: searchData.currentStatus !== 'Any Status' ? searchData.currentStatus : '',
//       reseller: searchData.reseller
//     };
    
//     if (searchData.startDate && searchData.endDate) {
//       apiSearchData.startDate = searchData.startDate;
//       apiSearchData.endDate = searchData.endDate;
//     }

//     console.log('Search Data:', apiSearchData);
//     onSearch(apiSearchData);
//     onClose();
//   }

//   const handleReset = () => {
//     setSearchData({
//       center: '',
//       statusChanged: 'Any Status',
//       dateFilter: '',
//       indentNo: '',
//       currentStatus: 'Any Status',
//       indentDate: '',
//       startDate: '',
//       endDate: '',
//       indentStartDate: '',
//       indentEndDate: '',
//       reseller: ''
//     });
//     setFilteredCenters(centers);
//   }

//   // Get unique resellers for the dropdown
//   const uniqueResellers = resellers && resellers.length > 0 ? resellers : 
//     Array.from(new Map(centers.map(center => [center.reseller?._id, center.reseller])).values())
//       .filter(r => r && r._id);

//   return (
//     <>
//       <CModal size="lg" visible={visible} onClose={onClose}>
//         <CModalHeader>
//           <CModalTitle>Search Stock Requests</CModalTitle>
//         </CModalHeader>

//         <CModalBody>
//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">Reseller</label>
//               <Select
//                 id="reseller"
//                 name="reseller"
//                 placeholder="Select Reseller..."
//                 value={
//                   searchData.reseller
//                     ? {
//                         value: searchData.reseller,
//                         label: uniqueResellers.find((r) => r._id === searchData.reseller)
//                           ? uniqueResellers.find((r) => r._id === searchData.reseller).businessName
//                           : "",
//                       }
//                     : null
//                 }
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     reseller: selected ? selected.value : "",
//                   }))
//                 }
//                 options={uniqueResellers.map((reseller) => ({
//                   value: reseller._id,
//                   label: reseller.businessName,
//                 }))}
//                 isClearable
//                 classNamePrefix="react-select"
//                 className="no-radius-input"
//               />
//             </div>
//             <div className="form-group">
//               <label className="form-label">Branch</label>
//               <Select
//                 id="center"
//                 name="center"
//                 placeholder={searchData.reseller ? "Select Branch..." : "Select Reseller First"}
//                 value={
//                   searchData.center
//                     ? {
//                         value: searchData.center,
//                         label: filteredCenters.find((c) => c._id === searchData.center)
//                           ? filteredCenters.find((c) => c._id === searchData.center).centerName
//                           : "",
//                       }
//                     : null
//                 }
//                 onChange={(selected) =>
//                   setSearchData((prev) => ({
//                     ...prev,
//                     center: selected ? selected.value : "",
//                   }))
//                 }
//                 options={filteredCenters.map((center) => ({
//                   value: center._id,
//                   label: center.centerName,
//                 }))}
//                 isClearable
//                 isDisabled={!searchData.reseller}
//                 classNamePrefix="react-select"
//                 className="no-radius-input"
//               />
//               {searchData.reseller && filteredCenters.length === 0 && (
//                 <small className="text-muted" style={{ color: '#dc3545' }}>
//                   No branches found for this reseller
//                 </small>
//               )}
//             </div>
//           </div>
          
//           <h5>Date Filter based on status change</h5>
          
//           <div className="form-row">
//             <div className="form-group">
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
//               <label className="form-label">Start Date</label>
//               <CFormInput
//                 type="date"
//                 name="startDate"
//                 value={searchData.startDate}
//                 onChange={handleDateChange}
//                 className="no-radius-input"
//               />
//             </div>
//             <div className="form-group">
//               <label className="form-label">End Date</label>
//               <CFormInput
//                 type="date"
//                 name="endDate"
//                 value={searchData.endDate}
//                 onChange={handleDateChange}
//                 className="no-radius-input"
//                 min={searchData.startDate}
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

// SearchStockModel.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
//   resellers: PropTypes.array.isRequired
// }

// export default SearchStockModel;



// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; 
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CRow,
  CCol
} from '@coreui/react';
import axiosInstance from 'src/axiosInstance';

const SearchStockModel = ({ visible, onClose, onSearch, centers, outlets, resellers }) => {
  const [keyword, setKeyword] = useState('');
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [indentStartDate, setIndentStartDate] = useState('');
  const [indentEndDate, setIndentEndDate] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState([]);

  // Fetch products when modal opens
  useEffect(() => {
    if (visible) {
      fetchProducts();
    }
  }, [visible]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/all');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleReset = () => {
    setKeyword('');
    setSelectedCenter('');
    setSelectedOutlet('');
    setSelectedStatus('');
    setStartDate('');
    setEndDate('');
    setIndentStartDate('');
    setIndentEndDate('');
    setSelectedProduct('');
  };

  const handleSearch = () => {
    const searchData = {
      keyword,
      center: selectedCenter,
      outlet: selectedOutlet,
      status: selectedStatus,
      startDate,
      endDate,
      indentStartDate,
      indentEndDate,
      product: selectedProduct
    };
    onSearch(searchData);
    onClose();
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <CModal visible={visible} onClose={handleClose} size="lg">
      <CModalHeader closeButton>
        <CModalTitle>Advanced Search</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Keyword / Order Number</CFormLabel>
              <CFormInput
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by order number..."
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Status</CFormLabel>
              <CFormSelect
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Completed">Completed</option>
                <option value="Incompleted">Incompleted</option>
                <option value="Rejected">Rejected</option>
              </CFormSelect>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Center</CFormLabel>
              <CFormSelect
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
              >
                <option value="">All Centers</option>
                {centers && centers.map(center => (
                  <option key={center._id} value={center._id}>
                    {center.centerName} ({center.centerCode})
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormLabel>Outlet / Warehouse</CFormLabel>
              <CFormSelect
                value={selectedOutlet}
                onChange={(e) => setSelectedOutlet(e.target.value)}
              >
                <option value="">All Outlets</option>
                {outlets && outlets.map(outlet => (
                  <option key={outlet._id} value={outlet._id}>
                    {outlet.centerName} ({outlet.centerCode})
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          {/* Product filter */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Product</CFormLabel>
              <CFormSelect
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">All Products</option>
                {products && products.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.productTitle || product.productCode}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              {/* Empty column for alignment */}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Indent Date From</CFormLabel>
              <CFormInput
                type="date"
                value={indentStartDate}
                onChange={(e) => setIndentStartDate(e.target.value)}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Indent Date To</CFormLabel>
              <CFormInput
                type="date"
                value={indentEndDate}
                onChange={(e) => setIndentEndDate(e.target.value)}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Order Date From</CFormLabel>
              <CFormInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Order Date To</CFormLabel>
              <CFormInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={handleClose}>
          Cancel
        </CButton>
        <CButton color="secondary" onClick={handleReset}>
          Reset
        </CButton>
        <CButton color="primary" onClick={handleSearch}>
          Search
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

// ✅ ADD PropTypes validation
SearchStockModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array,
  outlets: PropTypes.array,
  resellers: PropTypes.array
};

SearchStockModel.defaultProps = {
  centers: [],
  outlets: [],
  resellers: []
};

export default SearchStockModel;