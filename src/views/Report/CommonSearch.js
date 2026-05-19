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

// const CommonSearch = ({ visible, onClose, onSearch, centers, products }) => {
//   const [searchData, setSearchData] = useState({
//     product: '',
//     center: '',
//     startDate: '',
//     endDate: ''
//   })

//   useEffect(() => {
//     if (!visible) {
//       setSearchData({ product: '', center: '', startDate: '', endDate: '' })
//     }
//   }, [visible])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setSearchData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleDateChange = (dateValue) => {
//     if (dateValue && dateValue.includes(' to ')) {
//       const [startDate, endDate] = dateValue.split(' to ');
//       setSearchData(prev => ({ 
//         ...prev, 
//         startDate: startDate,
//         endDate: endDate
//       }));
//     } else {
//       setSearchData(prev => ({ 
//         ...prev, 
//         startDate: '',
//         endDate: ''
//       }));
//     }
//   }

//   const handleSearch = () => {
//     const formattedSearchData = {
//       ...searchData,
//       date: searchData.startDate && searchData.endDate 
//         ? `${searchData.startDate} to ${searchData.endDate}`
//         : ''
//     };
//     onSearch(formattedSearchData)
//     onClose()
//   }

//   const handleReset = () => {
//     setSearchData({ product: '', center: '', startDate: '', endDate: '' })
//     onSearch({ product: '', center: '', startDate: '', endDate: '' })
//   }

//   const getDateDisplayValue = () => {
//     if (searchData.startDate && searchData.endDate) {
//       return `${searchData.startDate} to ${searchData.endDate}`;
//     }
//     return '';
//   }

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
//             <label className="form-label" htmlFor="product">
//               Product
//             </label>
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
//               value={getDateDisplayValue()}
//               onChange={handleDateChange}
//               placeholder="Select Date Range"
//               className="no-radius-input date-input"
//             />
//           </div>
//         </div>
//       </CModalBody>

//       <CModalFooter>
//         <CButton 
//           color="secondary" 
//           className="me-2" 
//           onClick={handleReset}
//         >
//           Reset
//         </CButton>
//         <CButton 
//           className='reset-button'
//           onClick={handleSearch}
//         >
//           Search
//         </CButton>
//       </CModalFooter>
//     </CModal>
//   )
// }

// CommonSearch.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
//   products: PropTypes.array.isRequired
// }

// export default CommonSearch










import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormLabel
} from '@coreui/react'
import PropTypes from 'prop-types'
import '../../css/form.css'
import Select from "react-select";
import axiosInstance from 'src/axiosInstance';

const CommonSearch = ({ visible, onClose, onSearch, centers, products }) => {
  const [searchData, setSearchData] = useState({
    product: '',
    center: '',
    reseller: '',
    startDate: '',
    endDate: ''
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
        reseller: '',
        startDate: '', 
        endDate: '' 
      });
      setResellerCenters([]);
    }
  }, [visible])

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchData(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = () => {
    // Format dates to ensure they are in YYYY-MM-DD format
    let formattedStartDate = searchData.startDate;
    let formattedEndDate = searchData.endDate;
    
    // If dates are in DD-MM-YYYY format, convert to YYYY-MM-DD
    if (formattedStartDate && formattedStartDate.includes('-')) {
      const parts = formattedStartDate.split('-');
      if (parts[0].length === 4) {
        // Already in YYYY-MM-DD format
        formattedStartDate = formattedStartDate;
      } else if (parts[2].length === 4) {
        // Assuming DD-MM-YYYY format
        formattedStartDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    
    if (formattedEndDate && formattedEndDate.includes('-')) {
      const parts = formattedEndDate.split('-');
      if (parts[0].length === 4) {
        // Already in YYYY-MM-DD format
        formattedEndDate = formattedEndDate;
      } else if (parts[2].length === 4) {
        // Assuming DD-MM-YYYY format
        formattedEndDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    
    const formattedSearchData = {
      ...searchData,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      date: searchData.startDate && searchData.endDate 
        ? `${formattedStartDate} to ${formattedEndDate}`
        : ''
    };
    onSearch(formattedSearchData)
    onClose()
  }

  const handleReset = () => {
    setSearchData({ 
      product: '', 
      center: '', 
      reseller: '',
      startDate: '', 
      endDate: '' 
    });
    setResellerCenters([]);
    onSearch({ product: '', center: '', reseller: '', startDate: '', endDate: '' })
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
          <div className="form-group"></div>
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
          className='reset-button'
          onClick={handleSearch}
        >
          Search
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

CommonSearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired
}

export default CommonSearch