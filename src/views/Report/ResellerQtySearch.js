
// import React, { useState, useEffect } from 'react'
// import {
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CButton
// } from '@coreui/react'
// import PropTypes from 'prop-types'
// import '../../css/form.css'
// import Select from "react-select";
// import axiosInstance from 'src/axiosInstance';
// import DatePicker from 'src/utils/DatePicker';

// const ResellerQtySearch = ({ visible, onClose, onSearch, resellers, products }) => {
//   const [searchData, setSearchData] = useState({
//     product: '',
//     reseller: '',
//     center: ''
//   });
  
//   const [centers, setCenters] = useState([]);
//   const [loadingCenters, setLoadingCenters] = useState(false);

//   useEffect(() => {
//     if (!visible) {
//       setSearchData({ product: '', reseller: '', center: '' });
//       setCenters([]);
//     }
//   }, [visible]);

//   useEffect(() => {
//     const fetchCenters = async () => {
//       if (searchData.reseller) {
//         setLoadingCenters(true);
//         try {
//           const response = await axiosInstance.get(`/centers/reseller/${searchData.reseller}`);
//           if (response.data.success) {
//             setCenters(response.data.data);
//           } else {
//             setCenters([]);
//           }
//         } catch (error) {
//           console.error('Error fetching centers:', error);
//           setCenters([]);
//         } finally {
//           setLoadingCenters(false);
//         }
//       } else {
//         setCenters([]);
//         setSearchData(prev => ({ ...prev, center: '' }));
//       }
//     };

//     fetchCenters();
//   }, [searchData.reseller]);


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
//     onSearch(searchData);
//     onClose();
//   };

//   const handleReset = () => {
//     setSearchData({ product: '', reseller: '', center: '' });
//     setCenters([]);
//     onSearch({ product: '', reseller: '', center: '' });
//     onClose();
//   };

//   const getDateDisplayValue = () => {
//     if (searchData.startDate && searchData.endDate) {
//       return `${searchData.startDate} to ${searchData.endDate}`;
//     }
//     return '';
//   }
//   return (
//     <CModal size="lg" visible={visible} onClose={onClose}>
//       <CModalHeader>
//         <CModalTitle>Search Reseller Stock</CModalTitle>
//       </CModalHeader>

//       <CModalBody>
//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label" htmlFor="reseller">
//               Reseller <span className='required'>*</span>
//             </label>
//             <Select
//               id="reseller"
//               name="reseller"
//               placeholder="Select Reseller..."
//               value={
//                 searchData.reseller
//                   ? {
//                       value: searchData.reseller,
//                       label: resellers.find((c) => c._id === searchData.reseller)
//                         ? resellers.find((c) => c._id === searchData.reseller).businessName
//                         : "",
//                     }
//                   : null
//               }
//               onChange={(selected) =>
//                 setSearchData((prev) => ({
//                   ...prev,
//                   reseller: selected ? selected.value : "",
//                   center: "" 
//                 }))
//               }
//               options={resellers.map((reseller) => ({
//                 value: reseller._id,
//                 label: `${reseller.businessName}`,
//               }))}
//               isClearable
//               classNamePrefix="react-select"
//               className="no-radius-input"
//             />
//           </div>
//           <div className="form-group">
//             <label className="form-label" htmlFor="center">
//               Center
//             </label>
//             <Select
//               id="center"
//               name="center"
//               placeholder={
//                 loadingCenters 
//                   ? "Loading centers..." 
//                   : searchData.reseller 
//                     ? "Select Center..." 
//                     : "Select a reseller first"
//               }
//               value={
//                 searchData.center
//                   ? {
//                       value: searchData.center,
//                       label: centers.find((c) => c._id === searchData.center)
//                         ? `${centers.find((c) => c._id === searchData.center).centerName} (${centers.find((c) => c._id === searchData.center).centerCode || 'N/A'})`
//                         : "",
//                     }
//                   : null
//               }
//               onChange={(selected) =>
//                 setSearchData((prev) => ({
//                   ...prev,
//                   center: selected ? selected.value : "",
//                 }))
//               }
//               options={centers.map((center) => ({
//                 value: center._id,
//                 label: `${center.centerName}`,
//               }))}
//               isClearable
//               isDisabled={!searchData.reseller || loadingCenters}
//               isLoading={loadingCenters}
//               classNamePrefix="react-select"
//               className="no-radius-input"
//             />
//             {searchData.reseller && !loadingCenters && centers.length === 0 && (
//               <small className="text-muted">No centers found for this reseller</small>
//             )}
//           </div>
//           </div>
//           <div className="form-row">
//           <div className="form-group">
//             <label className="form-label" htmlFor="product">
//               Product
//             </label>
//             <Select
//               id="product"
//               name="product"
//               placeholder="Search Product..."
//               value={
//                 searchData.product
//                   ? {
//                       value: searchData.product,
//                       label: products.find((p) => p._id === searchData.product)?.productTitle
//                     }
//                   : null
//               }
//               onChange={(selected) =>
//                 setSearchData((prev) => ({ ...prev, product: selected ? selected.value : "" }))
//               }
//               options={products.map((product) => ({
//                 value: product._id,
//                 label: `${product.productTitle} (${product.productCode || 'N/A'})`,
//               }))}
//               isClearable
//               classNamePrefix="react-select"
//             />
//           </div>
//           {/* <div className="form-group"></div> */}
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
//         </div>
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
//   );
// };

// ResellerQtySearch.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   resellers: PropTypes.array.isRequired,
//   products: PropTypes.array.isRequired
// };

// export default ResellerQtySearch;







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

const ResellerQtySearch = ({ visible, onClose, onSearch, resellers, products }) => {
  const [searchData, setSearchData] = useState({
    product: '',
    reseller: '',
    center: '',
    startDate: '',
    endDate: ''
  });
  
  const [centers, setCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSearchData({ product: '', reseller: '', center: '', startDate: '', endDate: '' });
      setCenters([]);
    }
  }, [visible]);

  useEffect(() => {
    const fetchCenters = async () => {
      if (searchData.reseller) {
        setLoadingCenters(true);
        try {
          const response = await axiosInstance.get(`/centers/reseller/${searchData.reseller}`);
          if (response.data.success) {
            setCenters(response.data.data);
          } else {
            setCenters([]);
          }
        } catch (error) {
          console.error('Error fetching centers:', error);
          setCenters([]);
        } finally {
          setLoadingCenters(false);
        }
      } else {
        setCenters([]);
        setSearchData(prev => ({ ...prev, center: '' }));
      }
    };

    fetchCenters();
  }, [searchData.reseller]);

  const handleSearch = () => {
    onSearch(searchData);
    onClose();
  };

  const handleReset = () => {
    setSearchData({ product: '', reseller: '', center: '', startDate: '', endDate: '' });
    setCenters([]);
    onSearch({ product: '', reseller: '', center: '', startDate: '', endDate: '' });
    onClose();
  };

  return (
    <CModal size="lg" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Search Reseller Stock</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="reseller">
              Reseller <span className='required'>*</span>
            </label>
            <Select
              id="reseller"
              name="reseller"
              placeholder="Select Reseller..."
              value={
                searchData.reseller
                  ? {
                      value: searchData.reseller,
                      label: resellers.find((c) => c._id === searchData.reseller)
                        ? resellers.find((c) => c._id === searchData.reseller).businessName
                        : "",
                    }
                  : null
              }
              onChange={(selected) =>
                setSearchData((prev) => ({
                  ...prev,
                  reseller: selected ? selected.value : "",
                  center: "" 
                }))
              }
              options={resellers.map((reseller) => ({
                value: reseller._id,
                label: `${reseller.businessName}`,
              }))}
              isClearable
              classNamePrefix="react-select"
              className="no-radius-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="center">
              Center
            </label>
            <Select
              id="center"
              name="center"
              placeholder={
                loadingCenters 
                  ? "Loading centers..." 
                  : searchData.reseller 
                    ? "Select Center..." 
                    : "Select a reseller first"
              }
              value={
                searchData.center
                  ? {
                      value: searchData.center,
                      label: centers.find((c) => c._id === searchData.center)
                        ? `${centers.find((c) => c._id === searchData.center).centerName} (${centers.find((c) => c._id === searchData.center).centerCode || 'N/A'})`
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
                label: `${center.centerName}`,
              }))}
              isClearable
              isDisabled={!searchData.reseller || loadingCenters}
              isLoading={loadingCenters}
              classNamePrefix="react-select"
              className="no-radius-input"
            />
            {searchData.reseller && !loadingCenters && centers.length === 0 && (
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
                label: `${product.productTitle} (${product.productCode || 'N/A'})`,
              }))}
              isClearable
              classNamePrefix="react-select"
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
              value={searchData.startDate}
              onChange={(e) => setSearchData((prev) => ({ ...prev, startDate: e.target.value }))}
              placeholder="Select start date"
            />
            <small className="text-muted">Optional</small>
          </div>
          <div className="form-group">
            <CFormLabel htmlFor="endDate">End Date</CFormLabel>
            <CFormInput
              type="date"
              id="endDate"
              value={searchData.endDate}
              onChange={(e) => setSearchData((prev) => ({ ...prev, endDate: e.target.value }))}
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
  );
};

ResellerQtySearch.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  resellers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired
};

export default ResellerQtySearch;