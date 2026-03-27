

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'src/axiosInstance';
import '../../../css/form.css';
import { CAlert, CButton } from '@coreui/react';
import './permission.css';
import { AuthContext } from 'src/context/AuthContext';

const permissionModules = [
  {
    module: 'Adjustment',
    permissions: [
      { label: 'View stock Adjustment for own center', name: 'view_stock_adjustment_own_center', description: 'View stock Adjustment for own center' },
      { label: 'View stock Adjustment for all center', name: 'view_stock_adjustment_all_center', description: 'View stock Adjustment for all center' },
      { label: 'Manage stock Adjustment for own center', name: 'manage_stock_adjustment_own_center', description: 'Manage stock Adjustment for own center' },
      { label: 'Manage stock Adjustment for all center', name: 'manage_stock_adjustment_all_center', description: 'Manage stock Adjustment for all center' },
    ],
  },
  {
    module: 'Admin',
    permissions: [
      { label: 'Is Admin', name: 'is_admin', description: 'Is Admin' },
    ]
  },
  {
    module: 'Available Stock',
    permissions: [
      { label: 'View available stock of own center', name: 'available_stock_own_center', description: 'View available stock of own center' },
      { label: 'View available stock of all center', name: 'available_stock_all_center', description: 'View available stock of all center' },
    ]
  },
  {
    module: 'Center',
    permissions: [
      { label: 'View own center', name: 'view_own_center', description: 'View own center' },
      { label: 'View all center', name: 'view_all_center', description: 'View all center' },
      { label: 'Manage own center', name: 'manage_own_center', description: 'Manage own center' },
      { label: 'Manage all center', name: 'manage_all_center', description: 'Manage all center' },
    ],
  },
  {
    module: 'Closing',
    permissions: [
      { label: 'View closing stock of own center', name: 'view_closing_stock_own_center', description: 'View closing stock of own center' },
      { label: 'View closing stock of all center', name: 'view_closing_stock_all_center', description: 'View closing stock of all center' },
      { label: 'Manage closing stock of own center', name: 'manage_closing_stock_own_center', description: 'Manage closing stock of own center' },
      { label: 'Manage closing stock of all center', name: 'manage_closing_stock_all_center', description: 'Manage closing stock of all center' },
      { label: 'Can change closing stock qty', name: 'change_closing_qty', description: 'Can change closing stock qty' },
    ],
  },
  {
    module: 'Customer',
    permissions: [
      { label: 'View customer of own center', name: 'view_customer_own_center', description: 'View customer of own center' },
      { label: 'View customer of all center', name: 'view_customer_all_center', description: 'View customer of all center' },
      { label: 'Manage customer of all center', name: 'manage_customer_all_center', description: 'Manage customer of all center' },
      { label: 'Manage customer of own center', name: 'manage_customer_own_center', description: 'Manage customer of own center' },
    ],
  },
  {
    module: 'Indent',
    permissions: [
      { label: 'View indent for own center', name: 'indent_own_center', description: 'View indent for own center' },
      { label: ' View indent for all center', name: 'indent_all_center', description: ' View indent for all center' },
      { label: 'Manage indent', name: 'manage_indent', description: 'Manage indent' },
      { label: 'Complete Indent', name: 'complete_indent', description: 'Complete Indent' },
      { label: 'Stock Transfer Approve from Outlet', name: 'stock_transfer_approve_from_outlet', description: 'Stock Transfer Approve from Outlet' },
      { label: 'Delete indent for own center', name: 'delete_indent_own_center', description: 'Delete indent for own center' },
      { label: 'Delete indent for all center', name: 'delete_indent_all_center', description: 'Delete indent for all center' },
    ],
  },
  {
    module: 'Payment',
    permissions: [
      { label: 'View payment of own center', name: 'view_payment_own_center', description: 'View payment of own center' },
      { label: 'View payment of all center', name: 'view_payment_all_center', description: 'View payment of all center' },
      { label: 'Manage payment of own center', name: 'manage_payment_own_center', description: 'Manage payment of own center' },
      { label: 'Can approve received payments', name: 'approve_received_payments', description: 'Can approve received payments' }
    ]
  },
  {
    module: 'Purchase',
    permissions: [
      { label: 'Add Purchase stock', name: 'add_purchase_stock', description: 'Add Purchase stock' },
      { label: 'View own purchase stock', name: 'view_own_purchase_stock', description: 'View own purchase stock' },
      { label: 'View all purchase stock', name: 'view_all_purchase_stock', description: 'View all purchase stock' }
    ]
  },
  {
    module: 'Report',
    permissions: [
      { label: 'View Own Report', name: 'view_own_report', description: 'View Own Report' },
      { label: 'View All Report', name: 'view_all_report', description: 'View All Report' },
      { label: 'View Outlet Stock', name: 'view_outlet_stock', description: 'View Outlet Stock' }
    ]
  },
  {
    module: 'Sales',
    permissions: [
      { label: 'View sales of own center', name: 'view_sales_own_center', description: 'View sales of own center' },
      { label: 'View sales of all center', name: 'view_sales_all_center', description: 'View sales of all center' },
      { label: 'Manage sales of own center', name: 'manage_sales_own_center', description: 'Manage sales of own center' }
    ]
  },
  {
    module: 'Settings',
    permissions: [
      { label: 'Manage user', name: 'manage_user', description: 'Manage user' },
      { label: 'Manage masters data', name: 'manage_masters_data', description: 'Manage masters data' },
      { label: 'Manage vendors', name: 'manage_vendors', description: 'Manage vendors' },
      { label: 'View Building Own Center', name: 'view_building_own_center', description: 'View Building Own Center' },
      { label: 'View Building All Center', name: 'view_building_all_center', description: 'View Building All Center' },
      { label: 'Manage Building All Center', name: 'manage_building_all_center', description: 'Manage Building All Center' },
      { label: 'Manage Building Own Center', name: 'manage_building_own_center', description: 'Manage Building Own Center' },
      { label: 'View Control Room Own Center', name: 'view_control_room_own_center', description: 'View Control Room Own Center' },
      { label: 'View Control Room All Center', name: 'view_control_room_all_center', description: 'View Control Room All Center' },
      { label: 'Manage Control Room Own Center', name: 'manage_control_room_own_center', description: 'Manage Control Room Own Center' },
      { label: 'Manage Control Room All Center', name: 'manage_control_room_all_center', description: 'Manage Control Room All Center' }
    ]
  },
  // {
  //   module: 'Roles and Permissions',
  //   permissions: [
  //     { label: 'Create Role', name: 'create_role', description: 'Create Role' },
  //     { label: 'View Role', name: 'view_role', description: 'View Role' },
  //     { label: 'Update Role', name: 'update_role', description: 'Update Role' },
  //     { label: 'Delete Role', name: 'delete_role', description: 'Delete Role' },
  //   ]
  // },
  // {
  //   module: 'User',
  //   permissions: [
  //     { label: 'Create User', name: 'create_user', description: 'Create User' },
  //     { label: 'View User', name: 'view_user', description: 'View User' },
  //     { label: 'Update User', name: 'update_user', description: 'Update User' },
  //     { label: 'Delete User', name: 'delete_user', description: 'Delete User' },
  //   ]
  // },
  {
    module: 'Shifting',
    permissions: [
      { label: 'View Shifting Own Center', name: 'view_shifting_own_center', description: 'View Shifting Own Center' },

      { label: 'View Shifting All Center', name: 'view_shifting_all_center', description: 'View Shifting All Center' },

      { label: 'Manage Shifting Own Center', name: 'manage_shifting_own_center', description: 'Manage Shifting Own Center' },

      { label: 'Manage Shifting All Center', name: 'manage_shifting_all_center', description: 'Manage Shifting All Center' },

      { label: 'Accept Shifting All Center', name: 'accept_shifting_all_center', description: 'Accept Shifting All Center' },
      
      { label: 'Accept Shifting Own Center', name: 'accept_shifting_own_center', description: 'Accept Shifting Own Center' }
    ]
  },
  {
    module: 'Transfer',
    permissions: [
      { label: 'View stock transfer for own center', name: 'stock_transfer_own_center', description: 'View stock transfer for own center' },
      { label: 'View stock transfer for all center', name: 'stock_transfer_all_center', description: 'View stock transfer for all center' },

      { label: 'Manage stock transfer for own center', name: 'manage_stock_transfer_own_center', description: 'Manage stock transfer for own center' },

      { label: 'Manage stock transfer for all center', name: 'manage_stock_transfer_all_center', description: 'Manage stock transfer for all center' },

      { label: 'Approval of transfer to center', name: 'approval_transfer_center', description: 'Approval of transfer to center' },
      { label: 'Delete transfer for own center', name: 'delete_transfer_own_center', description: 'Delete transfer for own center' },
      { label: 'Delete transfer for all center', name: 'delete_transfer_all_center', description: 'Delete transfer for all center' },
    ],
  },
  {
    module: 'Usage',
    permissions: [
      { label: 'View internal Usage of own center', name: 'view_usage_own_center', description: 'View internal usage of own center' },

      { label: 'View internal Usage of all center', name: 'view_usage_all_center', description: 'View internal usage of all center' },

      { label: 'Manage usage of own center', name: 'manage_usage_own_center', description: 'Manage usage of own center' },

      { label: 'Manage usage of all center', name: 'manage_usage_all_center', description: 'Manage usage of all center' },

      { label: 'Accept damage return', name: 'accept_damage_return', description: 'Accept damage return' },

      { label: 'Manage import usage', name: 'manage_import_usage', description: 'Manage import usage' },

      { label: ' Allow Edit Usage', name: 'allow_edit_usage', description: 'Alllow Edit Usage' },
    ],
  },
  {
    module: 'Testing Material',
    permissions: [
      { label: 'Create Testing Request', name: 'create_testing_request', description: 'Create Testing Request' },
      { label: 'View Testing Request', name: 'view_testing_request', description: 'View Testing Request' },
      { label: 'Accept Testing Request', name: 'accept_testing_request', description: 'Accept Testing Request' },
    ]
  },
  {
    module: 'Audit Logs',
    permissions: [
      { label: 'View all audit logs', name: 'view_audit_logs_all', description: 'View all audit logs' },
      { label: 'View audit logs own center', name: 'view_audit_logs_own_center', description: 'View audit logs own center' },
      { label: 'View own audit logs', name: 'view_audit_logs_own', description: 'View own audit logs' },
    ]
  },
];

const AddRole = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    roleTitle: '',
    permissions: [],
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' });
  const { refreshPermissions } = useContext(AuthContext)
  useEffect(() => {
    if (id) {
      fetchRole(id);
    }
  }, [id]);

  const fetchRole = async (itemId) => {
    try {
      const res = await axiosInstance.get(`/role/${itemId}`);
      const data = res.data.data;
      
      const selectedPermissions = data.permissions?.flatMap(modulePerm => 
        modulePerm.permissions || []
      ) || [];
      
      setFormData({
        roleTitle: data.roleTitle || '',
        permissions: selectedPermissions,
      });
    } catch (error) {
      console.log("Error fetching role data:", error);
    }
  };

  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const togglePermission = (permName) => {
    setFormData((prev) => {
      const newPermissions = prev.permissions.includes(permName)
        ? prev.permissions.filter((p) => p !== permName)
        : [...prev.permissions, permName];
      return { ...prev, permissions: newPermissions };
    });
  };

  const toggleModuleAll = (module) => {
    const modulePermissions = module.permissions.map((p) => p.name);
    const allSelected = modulePermissions.every((p) => formData.permissions.includes(p));
    setFormData((prev) => {
      let updatedPermissions;
      if (allSelected) {
        updatedPermissions = prev.permissions.filter((p) => !modulePermissions.includes(p));
      } else {
        updatedPermissions = Array.from(new Set([...prev.permissions, ...modulePermissions]));
      }
      return { ...prev, permissions: updatedPermissions };
    });
  };
  const toggleSelectAll = () => {
    const allPermissions = permissionModules.flatMap(module => 
      module.permissions.map(perm => perm.name)
    );
    
    const allSelected = allPermissions.every(perm => 
      formData.permissions.includes(perm)
    );

    setFormData(prev => ({
      ...prev,
      permissions: allSelected ? [] : allPermissions
    }));
  };
  const isAllSelected = () => {
    const allPermissions = permissionModules.flatMap(module => 
      module.permissions.map(perm => perm.name)
    );
    return allPermissions.length > 0 && 
           allPermissions.every(perm => formData.permissions.includes(perm));
  };

  const isSomeSelected = () => {
    const allPermissions = permissionModules.flatMap(module => 
      module.permissions.map(perm => perm.name)
    );
    return formData.permissions.length > 0 && 
           !isAllSelected();
  };

  const transformFormDataForAPI = (formData) => {
    const permissionsByModule = permissionModules.map(module => {
      const modulePermissions = module.permissions
        .filter(perm => formData.permissions.includes(perm.name))
        .map(perm => perm.name);
      
      return {
        module: module.module,
        permissions: modulePermissions
      };
    }).filter(module => module.permissions.length > 0); 
    return {
      roleTitle: formData.roleTitle,
      permissions: permissionsByModule
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.roleTitle) newErrors.roleTitle = 'This is a required field';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const apiData = transformFormDataForAPI(formData);
      
      if (id) {
        await axiosInstance.put(`/role/${id}`, apiData);
        await refreshPermissions()
        setAlert({ type: 'success', message: 'Role updated successfully!' });
      } else {
        await axiosInstance.post('/role', apiData);
        setAlert({ type: 'success', message: 'Role added successfully!' });
      }
      setTimeout(() => navigate('/role-list'), 1500);
    } catch (error) {
      console.error('Error saving Data:', error)
    
      let message = 'Failed to save Data. Please try again!'
    
      if (error.response) {
        message = error.response.data?.message || error.response.data?.error || message
      } else if (error.request) {
        message = 'No response from server. Please check your connection.'
      } else {
        message = error.message
      }
    
      setAlert({ type: 'danger', message })
    }    
  };

  const handleBack = () => navigate('/role-list');

  return (
    <div className="form-container">
      <div className="title">
        <CButton size="sm" className="back-button me-3" onClick={handleBack}>
          <i className="fa fa-fw fa-arrow-left"></i>Back
        </CButton>
        {id ? 'Edit Role' : 'Add Role'}
      </div>

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
                <label
                  className={`form-label ${errors.roleTitle ? 'error-label' : formData.roleTitle ? 'valid-label' : ''}`}
                  htmlFor="roleTitle"
                >
                  Role Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="roleTitle"
                  name="roleTitle"
                  className={`form-input ${errors.roleTitle ? 'error-input' : formData.roleTitle ? 'valid-input' : ''}`}
                  value={formData.roleTitle}
                  onChange={handleRoleChange}
                />
                {errors.roleTitle && <span className="error">{errors.roleTitle}</span>}
              </div>
            </div>

            <div className="permission-section">
            <div className="table-fixed-header-container">
              <table className="table table-bordered mt-4">
                <thead>
                  <tr className="bg-light">
                    <th style={{ width: '5%' }}>
                      <input
                        type="checkbox"
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = isSomeSelected();
                          }
                        }}
                        checked={isAllSelected()}
                        onChange={toggleSelectAll}
                        title="Select All Permissions"
                      />
                    </th>
                    <th style={{ width: '30%' }}>Permission</th>
                    <th style={{ width: '30%' }}>Machine Name</th>
                    <th style={{ width: '35%' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {permissionModules.map((module, mIndex) => (
                    <React.Fragment key={mIndex}>
                      <tr className="table-warning">
                        <td colSpan="4">
                          <input
                            type="checkbox"
                            checked={module.permissions.every((p) => formData.permissions.includes(p.name))}
                            onChange={() => toggleModuleAll(module)}
                            style={{ marginRight: '8px' }}
                          />
                          <strong>{module.module}</strong>
                        </td>
                      </tr>
                      {module.permissions.map((perm, pIndex) => (
                        <tr key={pIndex}>
                          <td>
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(perm.name)}
                              onChange={() => togglePermission(perm.name)}
                            />
                          </td>
                          <td>{perm.label}</td>
                          <td>{perm.name}</td>
                          <td>{perm.description}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" className="reset-button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRole;