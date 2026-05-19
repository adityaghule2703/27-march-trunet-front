// import React, { useState, useEffect } from 'react'
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CFormSelect,
//   CButton
// } from '@coreui/react'
// import PropTypes from 'prop-types'
// import '../../css/form.css'
// import DatePicker from 'src/utils/DatePicker'
// import Select from "react-select";

// const SearchUsageDetail = ({ visible, onClose, onSearch, centers, products, customers }) => {
//   const [searchData, setSearchData] = useState({
//     product: '',
//     center: '',
//     usageType: '',
//     customer: '',
//     date: '',
//     startDate: '',
//     endDate: '',
//     connectionType:''
//   })

//   useEffect(() => {
//     if (!visible) {
//       setSearchData({ 
//         product: '', 
//         center: '', 
//         usageType: '', 
//         customer: '', 
//         date: '', 
//         startDate: '', 
//         endDate: '',
//         connectionType:''
//       })
//     }
//   }, [visible])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setSearchData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleSearch = () => {
//     onSearch(searchData)
//     onClose()
//   }

//   const handleReset = () => {
//     setSearchData({ 
//       product: '', 
//       center: '', 
//       usageType: '', 
//       customer: '', 
//       date: '', 
//       startDate: '', 
//       endDate: '',
//       connectionType:''
//     })
//     onSearch({ product: '', center: '' })
//   }

//   const handleDateChange = (dateValue) => {
//     if (dateValue && dateValue.includes(' to ')) {
//       const [startDate, endDate] = dateValue.split(' to ');
//       const formatDateForAPI = (dateStr) => {
//         const [day, month, year] = dateStr.split('-');
//         return `${year}-${month}-${day}`;
//       };
      
//       setSearchData(prev => ({ 
//         ...prev, 
//         date: dateValue,
//         dateFilter: 'Custom',
//         startDate: formatDateForAPI(startDate),
//         endDate: formatDateForAPI(endDate)
//       }));
//     } else {
//       setSearchData(prev => ({ 
//         ...prev, 
//         date: dateValue,
//         dateFilter: '',
//         startDate: '',
//         endDate: ''
//       }));
//     }
//   };

//   return (
//     <CModal size="lg" visible={visible} onClose={onClose}>
//       <CModalHeader>
//         <CModalTitle>Search</CModalTitle>
//       </CModalHeader>

//       <CModalBody>
//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label" htmlFor="center">
//               Branch
//             </label>
//             <Select
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
//           </div>
//           <div className="form-group">
//             <label className="form-label" htmlFor="usageType">
//               Type
//             </label>
//             <CFormSelect
//               id="usageType"
//               name="usageType"
//               value={searchData.usageType}
//               onChange={handleChange}
//               className="form-input no-radius-input"
//             >
//               <option value="">-SELECT-</option>
//               <option value="Customer">Customer</option>
//               <option value="Building">Building</option>
//               <option value="Building to Building">Building to Building</option>
//               <option value="Control Room">Control Room</option>
//               <option value="Damage">Damage</option>
//               <option value="Stolen from Center">Stolen from Center</option>
//               <option value="Stolen from Field">Stolen from Field</option>
//               <option value="Other">Other</option>
//             </CFormSelect>
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label" htmlFor="customer">
//               User
//             </label>
//             {/* <CFormSelect
//               id="customer"
//               name="customer"
//               value={searchData.customer}
//               onChange={handleChange}
//               className="form-input no-radius-input"
//             >
//               <option value="">-SELECT-</option>
//               {customers.map((customer) => (
//                 <option key={customer._id} value={customer._id}>
//                   {customer.username}-{customer.mobile}
//                 </option>
//               ))}
//             </CFormSelect> */}
//             <Select
//   id="customer"
//   name="customer"
//   value={
//     searchData.customer
//       ? {
//           value: searchData.customer,
//           label: customers.find((c) => c._id === searchData.customer)
//             ? `${customers.find((c) => c._id === searchData.customer).username} - ${customers.find((c) => c._id === searchData.customer).mobile}`
//             : ""
//         }
//       : null
//   }
//   onChange={(selected) =>
//     setSearchData((prev) => ({ ...prev, customer: selected ? selected.value : "" }))
//   }
//   options={customers.map((customer) => ({
//     value: customer._id,
//     label: `${customer.username} - ${customer.mobile}`,
//   }))}
//   isClearable
//   classNamePrefix="react-select"
//   className="no-radius-input"
// />

//           </div>
//           <div className="form-group">
//             <label className="form-label" htmlFor="product">
//               Product
//             </label>
//             {/* <CFormSelect
//               id="product"
//               name="product"
//               value={searchData.product}
//               onChange={handleChange}
//               className="form-input no-radius-input"
//             >
//               <option value="">SELECT PRODUCT</option>
//               {products.map((product) => (
//                 <option key={product._id} value={product._id}>
//                   {product.productTitle}
//                 </option>
//               ))}
//             </CFormSelect> */}
//             <Select
//   id="product"
//   name="product"
//   placeholder="Search Product..."
//   value={
//     searchData.product
//       ? {
//           value: searchData.product,
//           label: products.find((p) => p._id === searchData.product)?.productTitle
//         }
//       : null
//   }
//   onChange={(selected) =>
//     setSearchData((prev) => ({ ...prev, product: selected ? selected.value : "" }))
//   }
//   options={products.map((product) => ({
//     value: product._id,
//     label: product.productTitle,
//   }))}
//   isClearable
//   classNamePrefix="react-select"
//   className="no-radius-input"
// />

//           </div>
//         </div>
        
//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label" htmlFor="date">
//               Date
//             </label>
//             <DatePicker
//               value={searchData.date}
//               onChange={handleDateChange}
//               placeholder="Select Date Range"
//               className="no-radius-input date-input"
//             />
//           </div>
//           <div className="form-group">
//             <label className="form-label" htmlFor="connectionType">
//               Connection Type
//             </label>
//             <CFormSelect
//               id="connectionType"
//               name="connectionType"
//               value={searchData.connectionType}
//               onChange={handleChange}
//               className="form-input no-radius-input"
//             >
//               <option value="">SELECT</option>
//               <option value="New">new</option>
//               <option value="Convert">convert</option>
//               <option value="Shifting">shifting</option>
//               <option value="Repair">Repair</option>
//             </CFormSelect>
//           </div>
//         </div>

//       </CModalBody>

//       <CModalFooter>
//         <CButton 
//           color="secondary" 
//           className="me-2" 
//           onClick={handleReset}
//         >
//           Close
//         </CButton>
//         <CButton 
//           className="reset-button" 
//           onClick={handleSearch}
//         >
//           Search
//         </CButton>
//       </CModalFooter>
//     </CModal>
//   )
// }

// SearchUsageDetail.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
//   products: PropTypes.array.isRequired,
//   customers: PropTypes.array.isRequired
// }

// export default SearchUsageDetail




import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CButton,
  CFormInput,
  CFormLabel
} from '@coreui/react'
import PropTypes from 'prop-types'
import '../../css/form.css'
import Select from "react-select";
import axiosInstance from 'src/axiosInstance';

const SearchUsageDetail = ({ visible, onClose, onSearch, centers, products, customers }) => {
  const [searchData, setSearchData] = useState({
    product: '',
    center: '',
    usageType: '',
    customer: '',
    reseller: '',
    startDate: '',
    endDate: '',
    connectionType: ''
  })
  
  const [resellers, setResellers] = useState([]);
  const [loadingResellers, setLoadingResellers] = useState(false);
  const [resellerCenters, setResellerCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(false);

  // Fetch all resellers on component mount
  useEffect(() => {
    const fetchResellers = async () => {
      setLoadingResellers(true);
      try {
        const response = await axiosInstance.get('/resellers');
        if (response.data.success) {
          setResellers(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching resellers:', error);
        setResellers([]);
      } finally {
        setLoadingResellers(false);
      }
    };

    fetchResellers();
  }, []);

  // Fetch centers based on selected reseller
  useEffect(() => {
    const fetchCentersByReseller = async () => {
      if (searchData.reseller) {
        setLoadingCenters(true);
        try {
          const response = await axiosInstance.get(`/centers/reseller/${searchData.reseller}`);
          if (response.data.success) {
            setResellerCenters(response.data.data);
          } else {
            setResellerCenters([]);
          }
        } catch (error) {
          console.error('Error fetching centers for reseller:', error);
          setResellerCenters([]);
        } finally {
          setLoadingCenters(false);
        }
      } else {
        setResellerCenters([]);
        // Clear center selection when reseller is cleared
        setSearchData(prev => ({ ...prev, center: '' }));
      }
    };

    fetchCentersByReseller();
  }, [searchData.reseller]);

  useEffect(() => {
    if (!visible) {
      setSearchData({ 
        product: '', 
        center: '', 
        usageType: '', 
        customer: '', 
        reseller: '',
        startDate: '', 
        endDate: '',
        connectionType: ''
      });
      setResellerCenters([]);
    }
  }, [visible])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchData(prev => ({ ...prev, [name]: value }))
  }

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return '';
    // If date is in YYYY-MM-DD format, convert to DD-MM-YYYY
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    }
    return dateString;
  };

  const handleSearch = () => {
    const apiSearchData = {
      product: searchData.product,
      center: searchData.center,
      usageType: searchData.usageType,
      customer: searchData.customer,
      reseller: searchData.reseller,
      startDate: formatDateToDDMMYYYY(searchData.startDate),
      endDate: formatDateToDDMMYYYY(searchData.endDate),
      connectionType: searchData.connectionType
    }
    onSearch(apiSearchData)
    onClose()
  }

  const handleReset = () => {
    setSearchData({ 
      product: '', 
      center: '', 
      usageType: '', 
      customer: '', 
      reseller: '',
      startDate: '', 
      endDate: '',
      connectionType: ''
    });
    setResellerCenters([]);
    onSearch({ product: '', center: '', usageType: '', customer: '', reseller: '', startDate: '', endDate: '', connectionType: '' })
    onClose()
  }

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Search</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="reseller">
              Reseller
            </label>
            <Select
              id="reseller"
              name="reseller"
              placeholder={loadingResellers ? "Loading resellers..." : "Select Reseller..."}
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
                  center: "" // Clear center when reseller changes
                }))
              }
              options={resellers.map((reseller) => ({
                value: reseller._id,
                label: reseller.businessName,
              }))}
              isClearable
              isLoading={loadingResellers}
              classNamePrefix="react-select"
              className="no-radius-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="center">
              Branch
            </label>
            <Select
              id="center"
              name="center"
              placeholder={
                loadingCenters 
                  ? "Loading branches..." 
                  : searchData.reseller 
                    ? "Select Branch..." 
                    : "Select a reseller first"
              }
              value={
                searchData.center
                  ? {
                      value: searchData.center,
                      label: resellerCenters.find((c) => c._id === searchData.center)
                        ? `${resellerCenters.find((c) => c._id === searchData.center).centerName} (${resellerCenters.find((c) => c._id === searchData.center).centerCode || 'N/A'})`
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
              options={resellerCenters.map((center) => ({
                value: center._id,
                label: `${center.centerName}`,
              }))}
              isClearable
              isDisabled={!searchData.reseller || loadingCenters}
              isLoading={loadingCenters}
              classNamePrefix="react-select"
              className="no-radius-input"
            />
            {searchData.reseller && !loadingCenters && resellerCenters.length === 0 && (
              <small className="text-muted">No branches found for this reseller</small>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="usageType">
              Type
            </label>
            <CFormSelect
              id="usageType"
              name="usageType"
              value={searchData.usageType}
              onChange={handleChange}
              className="form-input no-radius-input"
            >
              <option value="">-SELECT-</option>
              <option value="Customer">Customer</option>
              <option value="Building">Building</option>
              <option value="Building to Building">Building to Building</option>
              <option value="Control Room">Control Room</option>
              <option value="Damage">Damage</option>
              <option value="Stolen from Center">Stolen from Center</option>
              <option value="Stolen from Field">Stolen from Field</option>
              <option value="Other">Other</option>
            </CFormSelect>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="customer">
              User
            </label>
            <Select
              id="customer"
              name="customer"
              placeholder="Select User..."
              value={
                searchData.customer
                  ? {
                      value: searchData.customer,
                      label: customers.find((c) => c._id === searchData.customer)
                        ? `${customers.find((c) => c._id === searchData.customer).username} - ${customers.find((c) => c._id === searchData.customer).mobile}`
                        : ""
                    }
                  : null
              }
              onChange={(selected) =>
                setSearchData((prev) => ({ ...prev, customer: selected ? selected.value : "" }))
              }
              options={customers.map((customer) => ({
                value: customer._id,
                label: `${customer.username} - ${customer.mobile}`,
              }))}
              isClearable
              classNamePrefix="react-select"
              className="no-radius-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="product">
              Product
            </label>
            <Select
              id="product"
              name="product"
              placeholder="Search Product..."
              value={
                searchData.product
                  ? {
                      value: searchData.product,
                      label: products.find((p) => p._id === searchData.product)?.productTitle
                    }
                  : null
              }
              onChange={(selected) =>
                setSearchData((prev) => ({ ...prev, product: selected ? selected.value : "" }))
              }
              options={products.map((product) => ({
                value: product._id,
                label: product.productTitle,
              }))}
              isClearable
              classNamePrefix="react-select"
              className="no-radius-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="connectionType">
              Connection Type
            </label>
            <CFormSelect
              id="connectionType"
              name="connectionType"
              value={searchData.connectionType}
              onChange={handleChange}
              className="form-input no-radius-input"
            >
              <option value="">SELECT</option>
              <option value="New">new</option>
              <option value="Convert">convert</option>
              <option value="Shifting">shifting</option>
              <option value="Repair">Repair</option>
            </CFormSelect>
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="form-row">
          <div className="form-group">
            <CFormLabel htmlFor="startDate">Start Date</CFormLabel>
            <CFormInput
              type="date"
              id="startDate"
              name="startDate"
              value={searchData.startDate}
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
              value={searchData.endDate}
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
          className="reset-button" 
          onClick={handleSearch}
        >
          Search
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

SearchUsageDetail.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  customers: PropTypes.array.isRequired
}

export default SearchUsageDetail