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
// import { CFormInput } from '@coreui/react-pro'
// import Select from 'react-select'

// const ProductSerialSearch = ({ visible, onClose, onSearch, products }) => {
//   const [searchData, setSearchData] = useState({
//     product: '',
//     status: '',
//     keyword: ''
//   })

//   useEffect(() => {
//     if (!visible) {
//       setSearchData({ product: '', status: '', keyword: '' })
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
//     setSearchData({ product: '', status: '', keyword: '' })
//     onSearch({ product: '', status: '', keyword: '' })
//     onClose()
//   }

//   return (
//     <CModal size="lg" visible={visible} onClose={onClose}>
//       <CModalHeader>
//         <CModalTitle>Search Product Serial Report</CModalTitle>
//       </CModalHeader>

//       <CModalBody>
//         <div className="form-row">
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
//               id="product"
//               name="product"
//               placeholder="Search Product..."
//               value={
//                 searchData.product
//                   ? {
//                       value: searchData.product,
//                       label: products.find((p) => p._id === searchData.product)?.productTitle || ''
//                     }
//                   : null
//               }
//               onChange={(selected) =>
//                 setSearchData((prev) => ({
//                   ...prev,
//                   product: selected ? selected.value : ''
//                 }))
//               }
//               options={products.map((product) => ({
//                 value: product._id,
//                 label: product.productTitle
//               }))}
//               isClearable
//               classNamePrefix="react-select"
//               className="no-radius-input"
//             />
//           </div>
//           <div className="form-group">
//             <label className="form-label" htmlFor="status">
//               Status
//             </label>
//             <CFormSelect
//               id="status"
//               name="status"
//               value={searchData.status}
//               onChange={handleChange}
//               className="form-input no-radius-input"
//             >
//               <option value="">All Status</option>
//               <option value="all">All</option>
//               <option value="consumed">In Use</option>
//               <option value="Not in Use">Not in Use</option>
//               <option value="damaged">Damage</option>
//               <option value="Own Product">Own Product</option>
//             </CFormSelect>
//           </div>
//         </div>
//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label" htmlFor="keyword">
//               Keyword
//             </label>
//             <CFormInput
//               type="text"
//               id="keyword"
//               name="keyword"
//               value={searchData.keyword}
//               onChange={handleChange}
//               className="form-input no-radius-input"
//             />
//           </div>
//           <div className="form-group"></div>
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
//           className="reset-button" 
//           onClick={handleSearch}
//         >
//           Search
//         </CButton>
//       </CModalFooter>
//     </CModal>
//   )
// }

// ProductSerialSearch.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   products: PropTypes.array.isRequired
// }

// export default ProductSerialSearch




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
import Select from 'react-select'
import axiosInstance from 'src/axiosInstance';

const ProductSerialSearch = ({ visible, onClose, onSearch, products }) => {
  const [searchData, setSearchData] = useState({
    product: '',
    status: '',
    keyword: '',
    reseller: '',
    center: '',
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
        status: '', 
        keyword: '',
        reseller: '',
        center: '',
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

  // Format date from YYYY-MM-DD to DD-MM-YYYY for API
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return '';
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    }
    return dateString;
  };

  const handleSearch = () => {
    const apiSearchData = {
      product: searchData.product,
      status: searchData.status,
      keyword: searchData.keyword,
      reseller: searchData.reseller,
      center: searchData.center,
      startDate: formatDateToDDMMYYYY(searchData.startDate),
      endDate: formatDateToDDMMYYYY(searchData.endDate)
    }
    onSearch(apiSearchData)
    onClose()
  }

  const handleReset = () => {
    setSearchData({ 
      product: '', 
      status: '', 
      keyword: '',
      reseller: '',
      center: '',
      startDate: '',
      endDate: ''
    });
    setResellerCenters([]);
    onSearch({ product: '', status: '', keyword: '', reseller: '', center: '', startDate: '', endDate: '' })
    onClose()
  }

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Search Product Serial Report</CModalTitle>
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
                      label: products.find((p) => p._id === searchData.product)?.productTitle || ''
                    }
                  : null
              }
              onChange={(selected) =>
                setSearchData((prev) => ({
                  ...prev,
                  product: selected ? selected.value : ''
                }))
              }
              options={products.map((product) => ({
                value: product._id,
                label: product.productTitle
              }))}
              isClearable
              classNamePrefix="react-select"
              className="no-radius-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">
              Status
            </label>
            <CFormSelect
              id="status"
              name="status"
              value={searchData.status}
              onChange={handleChange}
              className="form-input no-radius-input"
            >
              <option value="">All Status</option>
              <option value="all">All</option>
              <option value="consumed">In Use</option>
              <option value="Not in Use">Not in Use</option>
              <option value="damaged">Damage</option>
              <option value="Own Product">Own Product</option>
            </CFormSelect>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="keyword">
              Keyword
            </label>
            <CFormInput
              type="text"
              id="keyword"
              name="keyword"
              value={searchData.keyword}
              onChange={handleChange}
              className="form-input no-radius-input"
              placeholder="Search by serial number, IMEI, etc."
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
          className="reset-button" 
          onClick={handleSearch}
        >
          Search
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ProductSerialSearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired
}

export default ProductSerialSearch