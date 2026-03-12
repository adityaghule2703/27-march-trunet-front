
// import React from 'react'
// import CIcon from '@coreui/icons-react'
// import { cilDescription, cilMoney } from '@coreui/icons'
// import { CNavGroup, CNavItem } from '@coreui/react-pro'
// import { Translation } from 'react-i18next'


// export const hasPermission = (permissions, module, requiredPermissions = []) => {
//   const modulePermissions = permissions.find(p => p.module === module)
//   if (!modulePermissions) return false
//   return requiredPermissions.some(p => modulePermissions.permissions.includes(p))
// }

// const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
// const userCenterType = (userCenter.centerType || 'Outlet').toLowerCase();
// console.log(userCenterType);

// const getNav = (permissions = []) => {
//   const _nav = []

//   _nav.push({
//     component: CNavItem,
//     name: <Translation>{(t) => t('dashboard')}</Translation>,
//     to: '/dashboard',
//     icon: <i className="fa fa-dashboard nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
//   })


//   if (hasPermission(permissions, 'Indent', ['indent_own_center', 'indent_all_center'])) {
//     _nav.push({
//       component: CNavItem,
//       name: <Translation>{(t) => t('Stock Request')}</Translation>,
//       to: '/stock-request',
//       icon: <i className="fa fa-sticky-note nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
//     })
//   }


//   if (hasPermission(permissions, 'Usage', ['view_usage_own_center', 'manage_usage_own_center'])) {
//     _nav.push({
//       component: CNavItem,
//       name: <Translation>{(t) => t('Stock Usage')}</Translation>,
//       to: '/stock-usage',
//       icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
//     })
//   }

//   if (userCenterType == 'outlet') {
//     _nav.push({
//       component: CNavItem,
//       name: <Translation>{(t) => t('Raise PO')}</Translation>,
//       to: '/raise-po',
//       icon: <CIcon icon={cilMoney} customClassName="nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
//     })
//   }
  
//   if (userCenterType == 'outlet' && hasPermission(permissions, 'Purchase', ['add_purchase_stock', 'view_all_purchase_stock','view_own_purchase_stock'])) {
//     _nav.push({
//       component: CNavItem,
//       name: <Translation>{(t) => t('Stock Purchase')}</Translation>,
//       to: '/stock-purchase',
//       icon: <CIcon icon={cilMoney} customClassName="nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
//     })
//   }
  
//   if (hasPermission(permissions, 'Transfer', ['view_stock_transfer_own_center', 'manage_stock_transfer_own_center'])) {
//     _nav.push({
//       component: CNavItem,
//       name: <Translation>{(t) => t('Stock Transfer')}</Translation>,
//       to: '/stock-transfer',
//       icon: <i className="fa fa-exchange nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
//     })
//   }


//   // if (userCenterType == 'outlet') {
//     _nav.push({
//       component: CNavItem,
//       name: <Translation>{(t) => t('Return Stock')}</Translation>,
//       to: '/return-stock',
//       icon: <i className="fa fa-reply fa-margin nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
//     })
//   // }


//   if (hasPermission(permissions, 'Shifting', ['view_shifting_own_center', 'view_shifting_all_center'])) {
//     _nav.push({
//       component: CNavItem,
//       name: <Translation>{(t) => t('Shifting Request')}</Translation>,
//       to: '/shifting-request',
//       icon: <i className="fa fa-truck nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
//     })
//   }

//   if (userCenterType == 'outlet') {
//     _nav.push({
//       component: CNavItem,
//       name: <Translation>{(t) => t('Sale Invoices')}</Translation>,
//       to: '/sale-invoices',
//       icon: <i className="fa fa-file-invoice nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
//     })
//   }
  
//   if (hasPermission(permissions, 'Closing', ['view_closing_stock_own_center', 'view_closing_stock_all_center'])) {
//     _nav.push({
//       component: CNavItem,
//       name: <Translation>{(t) => t('Report Submission')}</Translation>,
//       to: '/report-submission',
//       icon: <i className="fa fa-check nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
//     })
//   }
//     _nav.push({
//       component: CNavItem,
//       name: <Translation>{(t) => t('Forward Testing')}</Translation>,
//       to: '/testing-stock',
//       icon: <i className="fa fa-file-invoice nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
//     })
  

//   // ===== MASTERS =====
//   const masterItems = []

//   if (hasPermission(permissions, 'Customer', ['view_customer_all_center','view_customer_own_center','manage_customer_all_center'])) {
//     masterItems.push({ component: CNavItem, name: 'Customer', to: '/customers-list' })
//   }

//   if (hasPermission(permissions, 'Settings', ['view_building_all_center','view_building_own_center', 'manage_building_all_center'])) {
//     masterItems.push({ component: CNavItem, name: 'Building', to: '/building-list' })
//   }

//   if (hasPermission(permissions, 'Settings', ['view_control_room_all_center','view_control_room_own_center','manage_control_room_all_center'])) {
//     masterItems.push({ component: CNavItem, name: 'Control Room', to: '/controlRoom-list' })
//   }

//   if (hasPermission(permissions, 'Center', ['view_all_center','view_own_center', 'manage_all_center'])) {
//     masterItems.push({ component: CNavItem, name: 'Branch', to: '/center-list' })
//   }
  

//   // if (hasPermission(permissions, 'Indent', ['view_own_center', 'manage_indent'])) {
//   //   masterItems.push({ component: CNavItem, name: 'Challan', to: '/base/challan' })
//   // }


//   if (masterItems.length > 0) {
//     _nav.push({
//       component: CNavGroup,
//       name: <Translation>{(t) => t('Master')}</Translation>,
//       to: '/base',
//       icon: <CIcon icon={cilDescription} customClassName="nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'10px'}} />,
//       items: masterItems,
//     })
//   }

//   // ===== REPORT =====
//   const reportItems = []

//   if (hasPermission(permissions, 'Report', ['view_outlet_stock','view_all_report','view_own_report'])) {
//     // reportItems.push({ component: CNavItem, name: 'Branch Stock', to: '/center-stock' })
//     reportItems.push({ component: CNavItem, name: 'Available Stock', to: '/available-stock' })
//     reportItems.push({ component: CNavItem, name: 'Reseller Stock', to: '/reseller-stock' })
//     reportItems.push({ component: CNavItem, name: 'Field Stock', to: '/filled-stock' })
//     reportItems.push({ component: CNavItem, name: 'Transaction Report', to: '/transaction-report' })
//     reportItems.push({ component: CNavItem, name: 'Purchase Detail', to: '/purchase-detail' })
//     reportItems.push({ component: CNavItem, name: 'Indent Summary', to: '/indent-summary' })
//     reportItems.push({ component: CNavItem, name: 'Indent Detail', to: '/indent-detail' })
//     reportItems.push({ component: CNavItem, name: 'Transfer Summary', to: '/transfer-summary' })
//     reportItems.push({ component: CNavItem, name: 'Transfer Detail', to: '/transfer-detail' })
//     reportItems.push({ component: CNavItem, name: 'Usage Summary', to: '/usage-summary' })
//     reportItems.push({ component: CNavItem, name: 'Usage Detail', to: '/usage-detail' })
//     reportItems.push({ component: CNavItem, name: 'Usage Replace', to: '/usage-replace' })
//     reportItems.push({ component: CNavItem, name: 'Stolen Report', to: '/stolen-report' })
//     reportItems.push({ component: CNavItem, name: 'Indent/Usage Summary', to: '/indentUsageSummary' })

//     // reportItems.push({ component: CNavItem, name: 'Purchase Analysis', to: '/base/purchaseAnalysis' })

//     reportItems.push({ component: CNavItem, name: 'Product Serial Track', to: '/product-serial-track' })
//     reportItems.push({ component: CNavItem, name: 'ONU Track Report', to: '/onu-report' })
//   }

//   if (reportItems.length > 0) {
//     _nav.push({
//       component: CNavGroup,
//       name: <Translation>{(t) => t('Report')}</Translation>,
//       to: '/',
//       icon: <CIcon icon={cilDescription} customClassName="nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'10px'}} />,
//       items: reportItems,
//     })
//   }

//   // ==== FAULTY STOCK === 


//   if (userCenterType == 'outlet'){
//     _nav.push({
//       component: CNavItem,
//       name: <Translation>{(t) => t('Faulty Stock')}</Translation>,
//       to: '/faulty-stock',
//       icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
//     })
//   }

//   if (userCenterType == 'outlet'){
//     _nav.push({
//       component: CNavItem,
//       name: <Translation>{(t) => t('Transfer to Reseller')}</Translation>,
//       to: '/transfer-reseller',
//       icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
//     })
//   }
  
//   if (userCenterType == 'center'){
//     _nav.push({
//       component: CNavItem,
//       name: <Translation>{(t) => t('Repaired Faulty Stock')}</Translation>,
//       to: '/repair-faulty-stock',
//       icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
//     })
// }


//     // ===== SETTINGS =====
//   const settingsItems = []

//   if (hasPermission(permissions, 'Settings', ['manage_user', 'manage_masters_data', 'manage_vendors'])) {
//     settingsItems.push({ component: CNavItem, name: 'Branch', to: '/center-list' })
//     settingsItems.push({ component: CNavItem, name: 'Products', to: '/product-list' })
//     settingsItems.push({ component: CNavItem, name: 'Product Categories', to: '/product-category' })
//     settingsItems.push({ component: CNavItem, name: 'Repaired Cost', to: '/repaired-cost' })
//     settingsItems.push({ component: CNavItem, name: 'Tax', to: '/tax' })
//     settingsItems.push({ component: CNavItem, name: 'Vendor', to: '/vendor-list' })
//     settingsItems.push({ component: CNavItem, name: 'Package Duration', to: '/package-duration-list' })
//     settingsItems.push({ component: CNavItem, name: 'Reseller', to: '/reseller-list' })
//     settingsItems.push({ component: CNavItem, name: 'Area', to: '/area-list' })
//     settingsItems.push({ component: CNavItem, name: 'Users', to: '/user-list' })
//     settingsItems.push({ component: CNavItem, name: 'Role', to: '/role-list' })
  
//   }

//   if (settingsItems.length > 0) {
//     _nav.push({
//       component: CNavGroup,
//       name: <Translation>{(t) => t('Settings')}</Translation>,
//       to: '/base',
//       icon: <i className="fa fa-cogs nav-icon"  style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}}/>,
//       items: settingsItems,
//     })
//   }


//   // ===== IMPORT =====
//   if (hasPermission(permissions, 'Usage', ['manage_import_usage'])) {
//     _nav.push({
//       component: CNavGroup,
//       name: <Translation>{(t) => t('Import')}</Translation>,
//       to: '/base',
//       icon: <i className="fa fa-cogs nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
//       items: [
//         { component: CNavItem, name: 'Import Usage', to:'/base/imageUsage' },
//       ],
//     })
//   }

//   return _nav
// }

// export default getNav





import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilDescription, cilMoney } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react-pro'
import { Translation } from 'react-i18next'

export const hasPermission = (permissions, module, requiredPermissions = []) => {
  const modulePermissions = permissions.find(p => p.module === module)
  if (!modulePermissions) return false
  return requiredPermissions.some(p => modulePermissions.permissions.includes(p))
}

const userCenter = JSON.parse(localStorage.getItem('userCenter')) || {};
const userCenterType = (userCenter.centerType || 'Outlet').toLowerCase();

const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
const isSuperAdmin = userInfo.isSuperAdmin || false;

const getNav = (permissions = []) => {
  const _nav = []

  _nav.push({
    component: CNavItem,
    name: <Translation>{(t) => t('dashboard')}</Translation>,
    to: '/dashboard',
    icon: <i className="fa fa-dashboard nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
  })

  // If user is superadmin, show all menu items
  if (isSuperAdmin) {
    _nav.push({
      component: CNavItem,
      name: <Translation>{(t) => t('Stock Request')}</Translation>,
      to: '/stock-request',
      icon: <i className="fa fa-sticky-note nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
    })

    _nav.push({
      component: CNavItem,
      name: <Translation>{(t) => t('Stock Usage')}</Translation>,
      to: '/stock-usage',
      icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
    })
    _nav.push({
      component: CNavItem,
      name: <Translation>{(t) => t('Revert Damage')}</Translation>,
      to: '/revert-damage',
      icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
    })
    if (userCenterType == 'outlet') {
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Raise PO')}</Translation>,
        to: '/raise-po',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
      })
    }

    if (userCenterType == 'outlet') {
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Stock Purchase')}</Translation>,
        to: '/stock-purchase',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
      })
    }

    _nav.push({
      component: CNavItem,
      name: <Translation>{(t) => t('Stock Transfer')}</Translation>,
      to: '/stock-transfer',
      icon: <i className="fa fa-exchange nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
    })

    _nav.push({
      component: CNavItem,
      name: <Translation>{(t) => t('Return Stock')}</Translation>,
      to: '/return-stock',
      icon: <i className="fa fa-reply fa-margin nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
    })

    _nav.push({
      component: CNavItem,
      name: <Translation>{(t) => t('Shifting Request')}</Translation>,
      to: '/shifting-request',
      icon: <i className="fa fa-truck nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
    })

    if (userCenterType == 'outlet') {
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Sale Invoices')}</Translation>,
        to: '/sale-invoices',
        icon: <i className="fa fa-file-invoice nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
      })
    }

    _nav.push({
      component: CNavItem,
      name: <Translation>{(t) => t('Report Submission')}</Translation>,
      to: '/report-submission',
      icon: <i className="fa fa-check nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
    })

    _nav.push({
      component: CNavItem,
      name: <Translation>{(t) => t('Forward Testing')}</Translation>,
      to: '/testing-stock',
      icon: <i className="fa fa-file-invoice nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
    })

    // ===== MASTERS =====
    const masterItems = []
    masterItems.push({ component: CNavItem, name: 'Customer', to: '/customers-list' })
    masterItems.push({ component: CNavItem, name: 'Building', to: '/building-list' })
    masterItems.push({ component: CNavItem, name: 'Control Room', to: '/controlRoom-list' })
    masterItems.push({ component: CNavItem, name: 'Branch', to: '/center-list' })

    if (masterItems.length > 0) {
      _nav.push({
        component: CNavGroup,
        name: <Translation>{(t) => t('Master')}</Translation>,
        to: '/base',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'10px'}} />,
        items: masterItems,
      })
    }

    // ===== REPORT =====
    const reportItems = []
    reportItems.push({ component: CNavItem, name: 'Available Stock', to: '/available-stock' })
    reportItems.push({ component: CNavItem, name: 'Reseller Stock', to: '/reseller-stock' })
    reportItems.push({ component: CNavItem, name: 'Reseller QTY', to: '/reseller-qty' })
    reportItems.push({ component: CNavItem, name: 'Field Stock', to: '/filled-stock' })
    reportItems.push({ component: CNavItem, name: 'Transaction Report', to: '/transaction-report' })
    reportItems.push({ component: CNavItem, name: 'Purchase Detail', to: '/purchase-detail' })
    reportItems.push({ component: CNavItem, name: 'Indent Summary', to: '/indent-summary' })
    reportItems.push({ component: CNavItem, name: 'Indent Detail', to: '/indent-detail' })
    reportItems.push({ component: CNavItem, name: 'Transfer Summary', to: '/transfer-summary' })
    reportItems.push({ component: CNavItem, name: 'Transfer Detail', to: '/transfer-detail' })
    reportItems.push({ component: CNavItem, name: 'Usage Summary', to: '/usage-summary' })
    reportItems.push({ component: CNavItem, name: 'Usage Detail', to: '/usage-detail' })
    reportItems.push({ component: CNavItem, name: 'Usage Replace', to: '/usage-replace' })
    reportItems.push({ component: CNavItem, name: 'Stolen Report', to: '/stolen-report' })
    reportItems.push({ component: CNavItem, name: 'Indent/Usage Summary', to: '/indentUsageSummary' })
    reportItems.push({ component: CNavItem, name: 'Product Serial Track', to: '/product-serial-track' })
    reportItems.push({ component: CNavItem, name: 'ONU Track Report', to: '/onu-report' })

    if (reportItems.length > 0) {
      _nav.push({
        component: CNavGroup,
        name: <Translation>{(t) => t('Report')}</Translation>,
        to: '/',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'10px'}} />,
        items: reportItems,
      })
    }

    // ==== FAULTY STOCK === 
    if (userCenterType == 'outlet'){
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Faulty Stock')}</Translation>,
        to: '/faulty-stock',
        icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
      })
    }

    if (userCenterType == 'outlet'){
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Transfer to Reseller')}</Translation>,
        to: '/transfer-reseller',
        icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
      })
    }
    
    if (userCenterType == 'center'){
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Repaired Faulty Stock')}</Translation>,
        to: '/repair-faulty-stock',
        icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
      })
    }

    // ===== SETTINGS =====
    const settingsItems = []
    settingsItems.push({ component: CNavItem, name: 'Branch', to: '/center-list' })
    settingsItems.push({ component: CNavItem, name: 'Products', to: '/product-list' })
    settingsItems.push({ component: CNavItem, name: 'Product Categories', to: '/product-category' })
    settingsItems.push({ component: CNavItem, name: 'Repaired Cost', to: '/repaired-cost' })
    settingsItems.push({ component: CNavItem, name: 'Tax', to: '/tax' })
    settingsItems.push({ component: CNavItem, name: 'Vendor', to: '/vendor-list' })
    settingsItems.push({ component: CNavItem, name: 'Package Duration', to: '/package-duration-list' })
    settingsItems.push({ component: CNavItem, name: 'Reseller', to: '/reseller-list' })
    settingsItems.push({ component: CNavItem, name: 'Area', to: '/area-list' })
    settingsItems.push({ component: CNavItem, name: 'Users', to: '/user-list' })
    settingsItems.push({ component: CNavItem, name: 'Role', to: '/role-list' })

    if (settingsItems.length > 0) {
      _nav.push({
        component: CNavGroup,
        name: <Translation>{(t) => t('Settings')}</Translation>,
        to: '/base',
        icon: <i className="fa fa-cogs nav-icon"  style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}}/>,
        items: settingsItems,
      })
    }

    // ===== IMPORT =====
    _nav.push({
      component: CNavGroup,
      name: <Translation>{(t) => t('Import')}</Translation>,
      to: '/base',
      icon: <i className="fa fa-cogs nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
      items: [
        { component: CNavItem, name: 'Import Usage', to:'/base/imageUsage' },
      ],
    })

    _nav.push({
      component: CNavItem,
      name: <Translation>{(t) => t('Audit Logs')}</Translation>,
      to: '/auditLogs',
      icon: <i className="fa fa-history nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
    })

  } else {
    if (hasPermission(permissions, 'Indent', ['indent_own_center', 'indent_all_center'])) {
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Stock Request')}</Translation>,
        to: '/stock-request',
        icon: <i className="fa fa-sticky-note nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
      })
    }

    if (hasPermission(permissions, 'Usage', ['view_usage_own_center', 'manage_usage_own_center'])) {
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Stock Usage')}</Translation>,
        to: '/stock-usage',
        icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
      })
    }
    if (hasPermission(permissions, 'Usage', ['view_usage_own_center', 'manage_usage_own_center'])) {
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Revert Damage')}</Translation>,
        to: '/revert-damage',
        icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
      })
    }
    if (userCenterType == 'outlet') {
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Raise PO')}</Translation>,
        to: '/raise-po',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
      })
    }
    
    if (userCenterType == 'outlet' && hasPermission(permissions, 'Purchase', ['add_purchase_stock', 'view_all_purchase_stock','view_own_purchase_stock'])) {
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Stock Purchase')}</Translation>,
        to: '/stock-purchase',
        icon: <CIcon icon={cilMoney} customClassName="nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
      })
    }
    
    if (hasPermission(permissions, 'Transfer', ['view_stock_transfer_own_center', 'manage_stock_transfer_own_center'])) {
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Stock Transfer')}</Translation>,
        to: '/stock-transfer',
        icon: <i className="fa fa-exchange nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
      })
    }

    // if (userCenterType == 'outlet') {
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Return Stock')}</Translation>,
        to: '/return-stock',
        icon: <i className="fa fa-reply fa-margin nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
      })
    // }

    if (hasPermission(permissions, 'Shifting', ['view_shifting_own_center', 'view_shifting_all_center'])) {
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Shifting Request')}</Translation>,
        to: '/shifting-request',
        icon: <i className="fa fa-truck nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
      })
    }

    if (userCenterType == 'outlet') {
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Sale Invoices')}</Translation>,
        to: '/sale-invoices',
        icon: <i className="fa fa-file-invoice nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
      })
    }
    
    if (hasPermission(permissions, 'Closing', ['view_closing_stock_own_center', 'view_closing_stock_all_center'])) {
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Report Submission')}</Translation>,
        to: '/report-submission',
        icon: <i className="fa fa-check nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
      })
    }
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Forward Testing')}</Translation>,
        to: '/testing-stock',
        icon: <i className="fa fa-file-invoice nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px'}} />,
      })

    // ===== MASTERS =====
    const masterItems = []

    if (hasPermission(permissions, 'Customer', ['view_customer_all_center','view_customer_own_center','manage_customer_all_center'])) {
      masterItems.push({ component: CNavItem, name: 'Customer', to: '/customers-list' })
    }

    if (hasPermission(permissions, 'Settings', ['view_building_all_center','view_building_own_center', 'manage_building_all_center'])) {
      masterItems.push({ component: CNavItem, name: 'Building', to: '/building-list' })
    }

    if (hasPermission(permissions, 'Settings', ['view_control_room_all_center','view_control_room_own_center','manage_control_room_all_center'])) {
      masterItems.push({ component: CNavItem, name: 'Control Room', to: '/controlRoom-list' })
    }

    if (hasPermission(permissions, 'Center', ['view_all_center','view_own_center', 'manage_all_center'])) {
      masterItems.push({ component: CNavItem, name: 'Branch', to: '/center-list' })
    }

    if (masterItems.length > 0) {
      _nav.push({
        component: CNavGroup,
        name: <Translation>{(t) => t('Master')}</Translation>,
        to: '/base',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'10px'}} />,
        items: masterItems,
      })
    }

    // ===== REPORT =====
    const reportItems = []

    if (hasPermission(permissions, 'Report', ['view_outlet_stock','view_all_report','view_own_report'])) {
      reportItems.push({ component: CNavItem, name: 'Available Stock', to: '/available-stock' })
      if (userCenterType === 'outlet') {
        reportItems.push({ component: CNavItem, name: 'Reseller Stock', to: '/reseller-stock' })
      }
      if (userCenterType === 'outlet') {
        reportItems.push({ component: CNavItem, name: 'Reseller QTY', to: '/reseller-qty' })
      }
      reportItems.push({ component: CNavItem, name: 'Field Stock', to: '/filled-stock' })
      reportItems.push({ component: CNavItem, name: 'Transaction Report', to: '/transaction-report' })
      reportItems.push({ component: CNavItem, name: 'Purchase Detail', to: '/purchase-detail' })
      reportItems.push({ component: CNavItem, name: 'Indent Summary', to: '/indent-summary' })
      reportItems.push({ component: CNavItem, name: 'Indent Detail', to: '/indent-detail' })
      reportItems.push({ component: CNavItem, name: 'Transfer Summary', to: '/transfer-summary' })
      reportItems.push({ component: CNavItem, name: 'Transfer Detail', to: '/transfer-detail' })
      reportItems.push({ component: CNavItem, name: 'Usage Summary', to: '/usage-summary' })
      reportItems.push({ component: CNavItem, name: 'Usage Detail', to: '/usage-detail' })
      reportItems.push({ component: CNavItem, name: 'Usage Replace', to: '/usage-replace' })
      reportItems.push({ component: CNavItem, name: 'Stolen Report', to: '/stolen-report' })
      reportItems.push({ component: CNavItem, name: 'Indent/Usage Summary', to: '/indentUsageSummary' })

      // reportItems.push({ component: CNavItem, name: 'Purchase Analysis', to: '/base/purchaseAnalysis' })

      reportItems.push({ component: CNavItem, name: 'Product Serial Track', to: '/product-serial-track' })
      reportItems.push({ component: CNavItem, name: 'ONU Track Report', to: '/onu-report' })
    }

    if (reportItems.length > 0) {
      _nav.push({
        component: CNavGroup,
        name: <Translation>{(t) => t('Report')}</Translation>,
        to: '/',
        icon: <CIcon icon={cilDescription} customClassName="nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'10px'}} />,
        items: reportItems,
      })
    }

    // ==== FAULTY STOCK === 
    if (userCenterType == 'outlet'){
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Faulty Stock')}</Translation>,
        to: '/faulty-stock',
        icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
      })
    }

    if (userCenterType == 'outlet'){
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Transfer to Reseller')}</Translation>,
        to: '/transfer-reseller',
        icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
      })
    }
    
    if (userCenterType == 'center'){
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Repaired Faulty Stock')}</Translation>,
        to: '/repair-faulty-stock',
        icon: <i className="fa fa-shopping-cart nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
      })
    }

    // ===== SETTINGS =====
    const settingsItems = []

    if (hasPermission(permissions, 'Settings', ['manage_user', 'manage_masters_data', 'manage_vendors'])) {
      settingsItems.push({ component: CNavItem, name: 'Branch', to: '/center-list' })
      settingsItems.push({ component: CNavItem, name: 'Products', to: '/product-list' })
      settingsItems.push({ component: CNavItem, name: 'Product Categories', to: '/product-category' })
      settingsItems.push({ component: CNavItem, name: 'Repaired Cost', to: '/repaired-cost' })
      settingsItems.push({ component: CNavItem, name: 'Tax', to: '/tax' })
      settingsItems.push({ component: CNavItem, name: 'Vendor', to: '/vendor-list' })
      settingsItems.push({ component: CNavItem, name: 'Package Duration', to: '/package-duration-list' })
      settingsItems.push({ component: CNavItem, name: 'Reseller', to: '/reseller-list' })
      settingsItems.push({ component: CNavItem, name: 'Area', to: '/area-list' })
      settingsItems.push({ component: CNavItem, name: 'Users', to: '/user-list' })
      settingsItems.push({ component: CNavItem, name: 'Role', to: '/role-list' })
    }

    if (settingsItems.length > 0) {
      _nav.push({
        component: CNavGroup,
        name: <Translation>{(t) => t('Settings')}</Translation>,
        to: '/base',
        icon: <i className="fa fa-cogs nav-icon"  style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}}/>,
        items: settingsItems,
      })
    }

    // ===== IMPORT =====
    if (hasPermission(permissions, 'Usage', ['manage_import_usage'])) {
      _nav.push({
        component: CNavGroup,
        name: <Translation>{(t) => t('Import')}</Translation>,
        to: '/base',
        icon: <i className="fa fa-cogs nav-icon" style={{ width: '20px',color:'#b8c7ce',fontSize:'14px'}} />,
        items: [
          { component: CNavItem, name: 'Import Usage', to:'/base/imageUsage' },
        ],
      })
    }


    if (hasPermission(permissions, 'AuditLogs', ['view_audit_logs_all','view_audit_logs_own_center','view_audit_logs_own'])) {
      _nav.push({
        component: CNavItem,
        name: <Translation>{(t) => t('Audit Logs')}</Translation>,
        to: '/auditLogs',
        icon: <i className="fa fa-history nav-icon" style={{ width: '20px', color:'#b8c7ce', fontSize:'14px' }} />,
      })
    }
  }

  return _nav
}

export default getNav