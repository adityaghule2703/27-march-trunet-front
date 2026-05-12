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
// import Select from "react-select";

// const SearchCenterStock = ({ visible, onClose, onSearch, centers,products }) => {
//   const [searchData, setSearchData] = useState({
//     product: '',
//     center: ''
//   })

//   useEffect(() => {
//     if (!visible) {
//       setSearchData({ product: '', center: '' })
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
//     setSearchData({ product: '', center: '' })
//     onSearch({ product: '', center: '' })
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

// <div className="form-group">
//   <label className="form-label" htmlFor="product">
//     Product
//   </label>

//   <Select
//     id="product"
//     name="product"
//     placeholder="Search Product..."
//     value={
//       searchData.product
//         ? {
//             value: searchData.product,
//             label: products.find((p) => p._id === searchData.product)?.productTitle
//           }
//         : null
//     }
    
//     onChange={(selected) =>
//       setSearchData((prev) => ({ ...prev, product: selected ? selected.value : "" }))
//     }
//     options={products.map((product) => ({
//       value: product._id,
//       label: product.productTitle,
//     }))}
//     isClearable
//     classNamePrefix="react-select"
//   />
// </div>

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

// SearchCenterStock.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   centers: PropTypes.array.isRequired,
//   products:PropTypes.array.isRequired
// }

// export default SearchCenterStock




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
import '../../css/form.css'
import Select from "react-select";
import axiosInstance from 'src/axiosInstance';

const SearchCenterStock = ({ visible, onClose, onSearch, centers, products, resellers }) => {
  const [searchData, setSearchData] = useState({
    product: '',
    center: '',
    resellerId: '',
    startDate: '',
    endDate: ''
  });
  
  const [filteredCenters, setFilteredCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSearchData({ 
        product: '', 
        center: '', 
        resellerId: '', 
        startDate: '', 
        endDate: '' 
      });
      setFilteredCenters([]);
    }
  }, [visible]);

  // Fetch centers when reseller changes
  useEffect(() => {
    const fetchCentersByReseller = async () => {
      if (searchData.resellerId) {
        setLoadingCenters(true);
        try {
          const response = await axiosInstance.get(`/centers/reseller/${searchData.resellerId}`);
          if (response.data.success) {
            setFilteredCenters(response.data.data);
          } else {
            setFilteredCenters([]);
          }
        } catch (error) {
          console.error('Error fetching centers:', error);
          setFilteredCenters([]);
        } finally {
          setLoadingCenters(false);
        }
      } else {
        // If no reseller selected, show all centers from props
        setFilteredCenters(centers);
        setSearchData(prev => ({ ...prev, center: '' }));
      }
    };

    fetchCentersByReseller();
  }, [searchData.resellerId, centers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    onSearch(searchData);
    onClose();
  };

  const handleReset = () => {
    setSearchData({ 
      product: '', 
      center: '', 
      resellerId: '', 
      startDate: '', 
      endDate: '' 
    });
    setFilteredCenters([]);
    onSearch({ 
      product: '', 
      center: '', 
      resellerId: '', 
      startDate: '', 
      endDate: '' 
    });
    onClose();
  };

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Search Available Stock</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="resellerId">
              Reseller
            </label>
            <Select
              id="resellerId"
              name="resellerId"
              placeholder="Select Reseller..."
              value={
                searchData.resellerId
                  ? {
                      value: searchData.resellerId,
                      label: resellers.find((r) => r._id === searchData.resellerId)
                        ? resellers.find((r) => r._id === searchData.resellerId).businessName
                        : "",
                    }
                  : null
              }
              onChange={(selected) =>
                setSearchData((prev) => ({
                  ...prev,
                  resellerId: selected ? selected.value : "",
                  center: "" // Reset center when reseller changes
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
            <label className="form-label" htmlFor="center">
              Center / Branch
            </label>
            <Select
              id="center"
              name="center"
              placeholder={
                loadingCenters 
                  ? "Loading centers..." 
                  : searchData.resellerId 
                    ? "Select Center..." 
                    : "Select a reseller first or browse all centers"
              }
              value={
                searchData.center
                  ? {
                      value: searchData.center,
                      label: filteredCenters.find((c) => c._id === searchData.center)
                        ? `${filteredCenters.find((c) => c._id === searchData.center).centerName}`
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
                label: `${center.centerName}`,
              }))}
              isClearable
              isDisabled={loadingCenters}
              isLoading={loadingCenters}
              classNamePrefix="react-select"
              className="no-radius-input"
            />
            {searchData.resellerId && !loadingCenters && filteredCenters.length === 0 && (
              <small className="text-muted">No centers found for this reseller</small>
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
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="startDate">
              Start Date
            </label>
            <CFormInput
              type="date"
              id="startDate"
              name="startDate"
              value={searchData.startDate}
              onChange={handleChange}
              placeholder="Select start date"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="endDate">
              End Date
            </label>
            <CFormInput
              type="date"
              id="endDate"
              name="endDate"
              value={searchData.endDate}
              onChange={handleChange}
              placeholder="Select end date"
            />
          </div>
        </div>
      </CModalBody>

      <CModalFooter>
        <CButton 
          color="secondary" 
          className="me-2" 
          onClick={handleReset}
        >
          Reset All
        </CButton>
        <CButton 
          className="reset-button" 
          onClick={handleSearch}
        >
          Search
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

SearchCenterStock.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  centers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  resellers: PropTypes.array.isRequired
};

export default SearchCenterStock;