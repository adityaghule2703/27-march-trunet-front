import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../../css/form.css';
import { CAlert } from '@coreui/react';
import Select from 'react-select';
const AddBuilding = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    center: '',
    buildingName: '',
    displayName: '',
    address1: '',
    address2: '',
    landmark: '',
    pincode: '',
  });

  const [centers, setCenters] = useState([]);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' })

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await axiosInstance.get('/centers?centerType=Center');
        setCenters(res.data.data || []);
      } catch (error) {
        console.error('Error fetching centers:', error);
      }
    };
    fetchCenters();
  }, []);


  useEffect(() => {
    if (id) {
      fetchBuilding(id);
    }
  }, [id]);

  const fetchBuilding = async (buildingId) => {
    try {
      const res = await axiosInstance.get(`/buildings/${buildingId}`);
      const data = res.data.data;
  
      setFormData({
        center: data.center?._id || '',
        buildingName: data.buildingName || '',
        displayName: data.displayName || '',
        address1: data.address1 || '',
        address2: data.address2 || '',
        landmark: data.landmark || '',
        pincode: data.pincode || '',
      });
    } catch (error) {
      console.error('Error fetching building:', error);
    }
  };  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    ['center', 'buildingName', 'displayName', 'address1'].forEach((field) => {
      if (!formData[field]) newErrors[field] = 'This field is required';
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(`/buildings/${id}`, formData);
        setAlert({ type: 'success', message: 'Data updated successfully!' })
      } else {
        await axiosInstance.post('/buildings', formData);
        setAlert({ type: 'success', message: 'Data added successfully!' })
      }
      setTimeout(() => navigate('/building-list'),1500);
     
    }catch (error) {
        console.error('Error saving Data:', error);
      
        let message = 'Failed to save Data. Please try again!';
      
        if (error.response) {
          const data = error.response.data;
      
          if (data.errors && Array.isArray(data.errors)) {
            message = data.errors.join(", ");
          } else {
            message = data.message || data.error || message;
          }
      
        } else if (error.request) {
          message = 'No response from server. Please check your connection.';
        } else {
          message = error.message;
        }
      
        setAlert({ type: 'danger', message });
      }
  };

  const handleReset = () => {
    setFormData({
      center: '',
      buildingName: '',
      displayName: '',
      address1: '',
      address2: '',
      landmark: '',
      pincode: ''
    });
    setErrors({});
  };

  return (
    <div className="form-container">
      <div className="title">Building {id ? 'Edit' : 'Add'}</div>
      <div className="form-card">
        <div className="form-body">
        {alert.message && (
  <CAlert color={alert.type} dismissible onClose={() => setAlert({ type: '', message: '' })}>
    {alert.message}
  </CAlert>
)}
          <form onSubmit={handleSubmit}>
            <div className="form-row">

              <div className="form-group">
                <label className={`form-label 
                  ${errors.center ? 'error-label' : formData.center ? 'valid-label' : ''}`}
                  htmlFor="center">
                Branch <span className="required">*</span>
                </label>
             
                <Select
    id="center"
    name="center"
    value={
      centers.find(c => c._id === formData.center)
        ? {
            label: centers.find(c => c._id === formData.center).centerName,
            value: formData.center
          }
        : null
    }
    onChange={(selected) =>
      handleChange({
        target: { name: "center", value: selected ? selected.value : "" }
      })
    }
    options={centers.map((c) => ({
      label: c.centerName,
      value: c._id,
    }))}
    placeholder="Select Branch"
    classNamePrefix={`react-select ${
      errors.center ? "error-input" : formData.center ? "valid-input" : ""
    }`}
  />
                {errors.center && <span className="error-text">{errors.center}</span>}
            </div>

              <div className="form-group">
                <label 
               className={`form-label 
                ${errors.buildingName ? 'error-label' : formData.buildingName ? 'valid-label' : ''}`} 
                htmlFor="buildingName">
                  Building Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="buildingName"
                  name="buildingName"
                  className={`form-input 
                    ${errors.buildingName ? 'error-input' : formData.buildingName ? 'valid-input' : ''}`}
                  value={formData.buildingName}
                  onChange={handleChange}
                />
                {errors.buildingName && <span className="error">{errors.buildingName}</span>}
              </div>

              <div className="form-group">
                <label 
                className={`form-label 
                ${errors.displayName ? 'error-label' : formData.displayName ? 'valid-label' : ''}`} 
                htmlFor="displayName">
                  Display Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  className={`form-input 
                    ${errors.displayName ? 'error-input' : formData.displayName ? 'valid-input' : ''}`}
                  value={formData.displayName}
                  onChange={handleChange}
                />
                {errors.displayName && <span className="error">{errors.displayName}</span>}
              </div>
            </div>

            <div className="form-row">
             
            <div className="form-group">
                <label 
                className={`form-label 
                  ${errors.address1 ? 'error-label' : formData.address1 ? 'valid-label' : ''}`} 
                 htmlFor="address1">
                Address Line 1<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="address1"
                  name="address1"
                  className={`form-input 
                  ${errors.address1 ? 'error-input' : formData.address1 ? 'valid-input' : ''}`}
                  value={formData.address1}
                  onChange={handleChange}
                />
                 {errors.address1 && <span className="error">{errors.address1}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="address2">
                Address Line 2
                </label>
                <input
                  type="text"
                  id="address2"
                  name="address2"
                  className="form-input"
                  value={formData.address2}
                  onChange={handleChange}
                />
                {errors.address2 && <span className="error">{errors.address2}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="landmark">
                Landmark
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  className="form-input"
                  value={formData.landmark}
                  onChange={handleChange}
                />
                {errors.landmark && <span className="error">{errors.landmark}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{width:"310px"}}>
                <label className="form-label" htmlFor="pincode">
                  Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  className="form-input"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group"></div>
              <div className="form-group"></div>
            </div>

            <div className="form-footer">
              <button type="button" className="reset-button" onClick={handleReset}>
                Reset
              </button>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBuilding;
