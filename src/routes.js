
import React from 'react'
import { Translation } from 'react-i18next'

// Masters ..
const StockRequest = React.lazy(() => import('./views/stockRequest/StockRequest'))
const AddStockRequest = React.lazy(() => import('./views/stockRequest/AddStockRequest'))
const StockRequestProfile = React.lazy(() => import('./views/stockRequest/StockProfile'))

const StockPurchase = React.lazy(() => import('./views/stockPurchase/StockPurchase'))
const AddStockPurchase = React.lazy(() => import('./views/stockPurchase/AddStockPurchase'))

const StockTransfer = React.lazy(() => import('./views/stockTransfer/StockTransfer'))
const AddStockTransfer = React.lazy(() => import('./views/stockTransfer/AddStockTransfer'))
const StockTransferDetails = React.lazy(() => import('./views/stockTransfer/StockTransferDetails'))

const ShiftingRequest = React.lazy(() => import('./views/shiftingRequest/ShiftingRequestList'))
const AddShiftingRequest = React.lazy(() => import('./views/shiftingRequest/AddShiftingRequest'))

const ReportSubmissionList = React.lazy(() => import('./views/reportSubmission/ReportSubmissionList'))
const AddReportSubmission = React.lazy(() => import('./views/reportSubmission/AddReportSubmission'))

const CustomersList = React.lazy(() => import('./views/Master/customer/CustomersList'))
const AddCustomer = React.lazy(() => import('./views/Master/customer/AddCustomer'))
const CustomerProfile = React.lazy(() => import('./views/Master/customer/CustomerProfile'))

const BuildingList = React.lazy(() => import('./views/Master/building/BuildingList'))
const AddBuilding = React.lazy(() => import('./views/Master/building/AddBuilding'))
const BuildingProfile = React.lazy(() => import('./views/Master/building/BuildingProfile'))

const AddControlRoom = React.lazy(() => import('./views/Master/control-room/AddControlRoom'))
const ControlRoomList = React.lazy(() => import('./views/Master/control-room/ControlRoomList'))
const ControlRoomProfile = React.lazy(() => import('./views/Master/control-room/ControlRoomProfile'));

const CenterList = React.lazy(() => import('./views/Master/center/CenterList'));
const WarehouseList = React.lazy(() => import('./views/Master/center/WarehouseList'));
const AddCenter = React.lazy(() => import('./views/Master/center/AddCenter'));

const ProductCategoryList = React.lazy(() => import('./views/Settings/product-category/ProductCategoryList'))

const AddProduct = React.lazy(() => import('./views/Settings/products/AddProducts'));
const ProductList = React.lazy(() => import('./views/Settings/products/ProductsList'));

const AddVendor = React.lazy(() => import('./views/Settings/vendor/AddVendor'));
const VendorList = React.lazy(() => import('./views/Settings/vendor/VendorList'));

const AddReseller = React.lazy(() => import('./views/Settings/reseller/AddReseller'));
const ResellerList = React.lazy(() => import('./views/Settings/reseller/ResellerList'))

const AddArea = React.lazy(() => import('./views/Settings/area/AddArea'));
const AreaList = React.lazy(() => import('./views/Settings/area/AreaList'));

const UserList = React.lazy(() => import('./views/Settings/user/UserList'));
const AddUser = React.lazy(() => import('./views/Settings/user/AddUser'));

const PackageDurationList = React.lazy(() => import('./views/Settings/package-duration/PackageDurationList'))

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const StockUsage = React.lazy(() => import('./views/stockUsage/StockUsage'))
const AddStockUsage = React.lazy(() => import('./views/stockUsage/AddStockUsage'))

const AddRole = React.lazy(() => import('./views/Settings/role/AddRole'))
const RoleList = React.lazy(() => import('./views/Settings/role/RoleList'))

//REPORT

const CenterStock = React.lazy(() => import('./views/Report/CentersStock'))
const AvailableStock = React.lazy(() => import('./views/Report/AvailableStock'))
const TransactionReport = React.lazy(() => import('./views/Report/TransactionReport'))
const PurchaseDetail = React.lazy(() => import('./views/Report/PurchaseDetail'))
const IndentSummary = React.lazy(() => import('./views/Report/IndentSummary'))
const IndentDetail = React.lazy(() => import('./views/Report/IndentDetail'))
const TransferDetail = React.lazy(() => import('./views/Report/TransferDetail'))
const TransferSummary = React.lazy(() => import('./views/Report/TransferSummary'))
const UsageDetail = React.lazy(() => import('./views/Report/UsageDetail'))
const UsageSummary = React.lazy(() => import('./views/Report/UsageSummary'))
const StolenReport = React.lazy(() => import('./views/Report/StolenReport'))
const ProductSerialTrack = React.lazy(() => import('./views/Report/ProductSerialTrack'))
const UsageReplace = React.lazy(() => import('./views/Report/UsageReplace'))
const OnuTrackReport = React.lazy(() => import('./views/Report/OnuTrackReport'))
const IndentUsageSummary = React.lazy(() => import('./views/Report/IndentUsageSummary'))

const TaxList = React.lazy(() => import('./views/Settings/tax/TaxList'))

const AddRaisePO = React.lazy(() => import('./views/raisePO/AddRaisePO'))
const RaisePOList = React.lazy(() => import('./views/raisePO/RaisePOList'))

const SaleInvoice = React.lazy(() => import('./views/sale-invoice/SaleInvoice'))
const FilledStock = React.lazy(() => import('./views/Report/FilledStock'))
const CenterProfile = React.lazy(() => import('./views/Master/center/CenterProfile'))

const FaultyStock = React.lazy(() => import('./views/faultyStock/FaultyStock'))
const TransferFaultyStock = React.lazy(() => import('./views/faultyStock/TransferFaultyStock'))
const ReturnFromRepair = React.lazy(() => import('./views/faultyStock/RepairFaultyStock'))
const RepairedStock = React.lazy(() => import('./views/faultyStock/RepairedStock'))

const TransferRepairedStock = React.lazy(() => import('./views/faultyStock/TransferRepairedStock'))
const TransferToReseller = React.lazy(() => import('./views/faultyStock/TransferToReseller'))

const ReturnStock = React.lazy(() => import('./views/return-stock/ReturnStock'))
const RepairedCost = React.lazy(() => import('./views/Settings/repair-cost/RepairCostList'))
const ResellerStock = React.lazy(() => import('./views/Report/ResellerStock'))
const TransferToTesting = React.lazy(() => import('./views/testing-material/TransferToTesting'))
const TestingStock = React.lazy(() => import('./views/testing-material/TestingStock'))
const TestingProfile = React.lazy(() => import('./views/testing-material/TestingProfile'))
const TestMaterial = React.lazy(() => import('./views/testing-material/TestMaterial'))
const AuditLogs = React.lazy(() => import('./views/auditLogs/AuditLogs'))
const ResellerQty = React.lazy(() => import('./views/Report/ResellerForwardedQty'))
const RevertDamage = React.lazy(() => import('./views/revert-damage/RevertDamage'))
const routes = [

  { path: '/', exact: true, name: <Translation>{(t) => t('home')}</Translation> },
  {
    path: '/dashboard',
    name: <Translation>{(t) => t('dashboard')}</Translation>,
    element: Dashboard,
  },

  //MASTERS
{ 
    path:'/add-customer', 
    exact:true, 
    name:<Translation>{(t) => t('Add customer')}</Translation>,
    element: AddCustomer,
  },
  { 
    path:'/customers-list', 
    exact:true, 
    name:<Translation>{(t) => t('Customers List')}</Translation>,
    element: CustomersList,
  },

  { 
    path:'/edit-customer/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Edit customer')}</Translation>,
    element: AddCustomer,
  },
  { 
    path:'/customer-profile/:id', 
    exact:true, 
    name:<Translation>{(t) => t('customer profile')}</Translation>,
    element: CustomerProfile,
  },
  { 
    path:'/add-building', 
    exact:true, 
    name:<Translation>{(t) => t('Add Building')}</Translation>,
    element: AddBuilding,
  },
  { 
    path:'/building-list', 
    exact:true, 
    name:<Translation>{(t) => t('Building List')}</Translation>,
    element: BuildingList,
  },

  { 
    path:'/edit-building/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Edit Building')}</Translation>,
    element: AddBuilding,
  },
  { 
    path:'/building-profile/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Building Profile')}</Translation>,
    element: BuildingProfile,
  },
  { 
    path:'/add-controlRoom', 
    exact:true, 
    name:<Translation>{(t) => t('Add Control Room')}</Translation>,
    element: AddControlRoom,
  },
  { 
    path:'/controlRoom-list', 
    exact:true, 
    name:<Translation>{(t) => t('Control Room List')}</Translation>,
    element: ControlRoomList,
  },
  { 
    path:'/edit-controlRoom/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Edit Control Room')}</Translation>,
    element: AddControlRoom,
  },
  { 
    path:'/controlRoom-profile/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Control Room Profile')}</Translation>,
    element: ControlRoomProfile,
  },
  { 
    path:'/add-center', 
    exact:true, 
    name:<Translation>{(t) => t('Add Center')}</Translation>,
    element: AddCenter,
  },
  { 
    path:'/center-list', 
    exact:true, 
    name:<Translation>{(t) => t('Center List')}</Translation>,
    element: CenterList,
  },
  { 
    path:'/warehouse-list', 
    exact:true, 
    name:<Translation>{(t) => t('Warehouse List')}</Translation>,
    element: WarehouseList,
  },
  { 
    path:'/edit-center/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Edit Center')}</Translation>,
    element: AddCenter,
  },

  //***********************   SETTINGS    **********************************//
  { 
    path:'/product-category', 
    exact:true, 
    name:<Translation>{(t) => t('Product Category')}</Translation>,
    element: ProductCategoryList,
  },
  { 
    path:'/add-product', 
    exact:true, 
    name:<Translation>{(t) => t('Add Product')}</Translation>,
    element: AddProduct,
  },
  { 
    path:'/product-list', 
    exact:true, 
    name:<Translation>{(t) => t('Product List')}</Translation>,
    element: ProductList,
  },
  { 
    path:'/edit-product/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Edit Product')}</Translation>,
    element: AddProduct,
  },
  { 
    path:'/add-vendor', 
    exact:true, 
    name:<Translation>{(t) => t('Add Vendor')}</Translation>,
    element: AddVendor,
  },
  { 
    path:'/vendor-list', 
    exact:true, 
    name:<Translation>{(t) => t('Vendor List')}</Translation>,
    element: VendorList,
  },
  { 
    path:'/edit-vendor/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Update Vendor')}</Translation>,
    element: AddVendor,
  },
  { 
    path:'/add-reseller', 
    exact:true, 
    name:<Translation>{(t) => t('Add Reseller')}</Translation>,
    element: AddReseller,
  },
  { 
    path:'/reseller-list', 
    exact:true, 
    name:<Translation>{(t) => t('reseller List')}</Translation>,
    element: ResellerList,
  },
  { 
    path:'/update-reseller/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Update reseller')}</Translation>,
    element: AddReseller,
  },
  { 
    path:'/add-area', 
    exact:true, 
    name:<Translation>{(t) => t('Add Area')}</Translation>,
    element: AddArea,
  },
  { 
    path:'/area-list', 
    exact:true, 
    name:<Translation>{(t) => t('Area List')}</Translation>,
    element: AreaList,
  },
  { 
    path:'/add-user', 
    exact:true, 
    name:<Translation>{(t) => t('Edit User')}</Translation>,
    element: AddUser,
  },
  { 
    path:'/edit-user/:id', 
    exact:true, 
    name:<Translation>{(t) => t('Edit User')}</Translation>,
    element: AddUser,
  },
  { 
    path:'/user-list', 
    exact:true, 
    name:<Translation>{(t) => t('User List')}</Translation>,
    element: UserList,
  },
  { 
    path:'/tax', 
    exact:true, 
    name:<Translation>{(t) => t('Tax List')}</Translation>,
    element: TaxList,
  },
  { 
    path:'/package-duration-list', 
    exact:true, 
    name:<Translation>{(t) => t('Package Duration List')}</Translation>,
    element: PackageDurationList,
  },

  {
    path: '/add-stockRequest',
    name: <Translation>{(t) => t('Add Stock Request')}</Translation>,
    element: AddStockRequest,
    exact: true,
  },
  {
    path: '/stock-request',
     name: <Translation>{(t) => t('Stock Request List')}</Translation>,
    element: StockRequest,
    exact: true,
  },
  {
    path: '/edit-stockRequest/:id',
    name: <Translation>{(t) => t('Edit Stock Request')}</Translation>,
    element: AddStockRequest,
    exact: true,
  },
  {
    path: '/stockRequest-profile/:id',
     name: <Translation>{(t) => t('Stock Request Profile')}</Translation>,
    element: StockRequestProfile,
    exact: true,
  },

  {
    path:'/stock-usage',
    name: <Translation>{(t) => t('Stock Usage')}</Translation>,
    element:StockUsage,
    exact: true,
  },
  {
    path:'/add-stockUsage',
    name: <Translation>{(t) => t('Add Stock Usage')}</Translation>,
    element:AddStockUsage,
    exact: true,
  },

  {
    path:'/edit-stockUsage/:id',
    name: <Translation>{(t) => t('Edit Stock Usage')}</Translation>,
    element:AddStockUsage,
    exact: true,
  },

  {
    path: '/stock-purchase',
    name: <Translation>{(t) => t('Stock Purchase')}</Translation>,
    element: StockPurchase,
    exact: true,
  },
  {
    path: '/add-stockPurchase',
    name: <Translation>{(t) => t('Add Stock Purchase')}</Translation>,
    element: AddStockPurchase,
    exact: true,
  },
  {
    path: '/edit-stockPurchase/:id',
    name: <Translation>{(t) => t('Edit Stock Purchase')}</Translation>,
    element: AddStockPurchase,
    exact: true,
  },

 {
    path: '/stock-transfer',
    name: <Translation>{(t) => t('Stock Transfer Request List')}</Translation>,
    element: StockTransfer,
    exact: true,
  },
  {
    path: '/add-stockTransfer',
    name: <Translation>{(t) => t('Stock Transfer Request')}</Translation>,
    element: AddStockTransfer,
    exact: true,
  },
  {
    path: '/stockTransfer-details/:id',
    name: <Translation>{(t) => t('Stock Transfer Request Details')}</Translation>,
    element: StockTransferDetails,
    exact: true,
  },
  {
    path: '/edit-stockTransfer/:id',
    name: <Translation>{(t) => t('Stock Transfer Request')}</Translation>,
    element: AddStockTransfer,
    exact: true,
  },

   {
    path: '/shifting-request',
    name: <Translation>{(t) => t('Shifting Request List')}</Translation>,
    element: ShiftingRequest,
    exact: true,
  },
  {
    path: '/add-shiftingRequest',
    name: <Translation>{(t) => t('Shifting Request List')}</Translation>,
    element: AddShiftingRequest,
    exact: true,
  },
  {
    path: '/edit-shiftingRequest/:id',
    name: <Translation>{(t) => t('Shifting Request List')}</Translation>,
    element: AddShiftingRequest,
    exact: true,
  },

 {
    path: '/report-submission',
    name: <Translation>{(t) => t('Closing Stock Logs')}</Translation>,
    element: ReportSubmissionList,
    exact: true,
  },
  {
    path: '/add-reportSubmission',
    name: <Translation>{(t) => t('Closing Stock Logs')}</Translation>,
    element: AddReportSubmission,
    exact: true,
  },
  {
    path: '/edit-reportSubmission/:id',
    name: <Translation>{(t) => t('Closing Stock Logs')}</Translation>,
    element: AddReportSubmission,
    exact: true,
  },
  {
    path: '/add-role',
    name: <Translation>{(t) => t('Add Role')}</Translation>,
    element: AddRole,
    exact: true,
  },
  {
    path: '/edit-role/:id',
    name: <Translation>{(t) => t('Add Role')}</Translation>,
    element: AddRole,
    exact: true,
  },
  {
    path:'/role-list',
    name: <Translation>{(t) => t('Role List')}</Translation>,
    element: RoleList,
    exact: true,
  },

  //REPORT

  {
    path:'/center-stock',
    name: <Translation>{(t) => t('Center Stock')}</Translation>,
    element: CenterStock,
    exact: true,
  },
  {
    path:'/available-stock',
    name: <Translation>{(t) => t('Available Stock')}</Translation>,
    element: AvailableStock,
    exact: true,
  },
  {
    path:'transaction-report',
    name: <Translation>{(t) => t('Transaction Report')}</Translation>,
    element: TransactionReport,
    exact: true,
  },
  {
    path:'purchase-detail',
    name: <Translation>{(t) => t('Purchase Detail')}</Translation>,
    element: PurchaseDetail,
    exact: true,
  },
  {
    path:'indent-summary',
    name: <Translation>{(t) => t('Indent Summary')}</Translation>,
    element: IndentSummary,
    exact: true,
  },
  {
    path:'indent-detail',
    name: <Translation>{(t) => t('Indent Detail')}</Translation>,
    element: IndentDetail,
    exact: true,
  },
  {
    path:'transfer-detail',
    name: <Translation>{(t) => t('Transfer Detail')}</Translation>,
    element: TransferDetail,
    exact: true,
  },
  {
    path:'transfer-summary',
    name: <Translation>{(t) => t('Transfer Summary')}</Translation>,
    element: TransferSummary,
    exact: true,
  },
  {
    path:'usage-detail',
    name: <Translation>{(t) => t('Usage Details')}</Translation>,
    element:UsageDetail,
    exact: true,
  },
  {
    path:'usage-summary',
    name: <Translation>{(t) => t('Usage Summary')}</Translation>,
    element: UsageSummary,
    exact: true,
  },
  {
    path:'stolen-report',
    name: <Translation>{(t) => t('Stolen Report')}</Translation>,
    element: StolenReport,
    exact: true,
  },
  {
    path:'product-serial-track',
    name: <Translation>{(t) => t('Product Serial Track')}</Translation>,
    element: ProductSerialTrack,
    exact: true,
  },
  {
    path:'/usage-replace',
    name: <Translation>{(t) => t('Usage Replace')}</Translation>,
    element: UsageReplace,
    exact: true,
  },
  {
    path:'/onu-report',
    name:<Translation>{(t) => t('Onu Report')}</Translation>,
    element: OnuTrackReport,
    exact: true,
  },
  {
    path:'/indentUsageSummary',
    name:<Translation>{(t) => t('Indent Usage Summary Report')}</Translation>,
    element: IndentUsageSummary,
    exact: true
  },
  {
    path: '/raise-po',
    name: <Translation>{(t) => t('Raise PO')}</Translation>,
    element: RaisePOList,
    exact: true,
  },
  {
    path: '/add-po',
    name: <Translation>{(t) => t('Add Raise PO')}</Translation>,
    element: AddRaisePO,
    exact: true,
  },
  {
    path: '/sale-invoices',
    name: <Translation>{(t) => t('Sale Invoice')}</Translation>,
    element: SaleInvoice,
    exact: true,
  },
  {
    path: '/filled-stock',
    name: <Translation>{(t) => t('Filled Stock')}</Translation>,
    element: FilledStock,
    exact: true,
  },
  {
    path: '/center-profile',
    name: <Translation>{(t) => t('Center Profile')}</Translation>,
    element: CenterProfile,
    exact: true,
  },
  {
    path:'/center-profile/:id',
    exact:true,
    name:<Translation>{(t) => t('Center Profile')}</Translation>,
    element: CenterProfile,
  },
  {
    path:'/faulty-stock',
    exact:true,
    name:<Translation>{(t) => t('Faulty Stock')}</Translation>,
    element: FaultyStock,
  },
  {
    path:'/transfer-faulty-stock',
    exact:true,
    name:<Translation>{(t) => t('Transfer Faulty Stock')}</Translation>,
    element: TransferFaultyStock,
  },
  {
    path:'/repair-faulty-stock',
    exact:true,
    name:<Translation>{(t) => t('Repair Faulty Stock')}</Translation>,
    element: ReturnFromRepair 
  },
  {
    path:'/repaired-stock',
    exact:true,
    name:<Translation>{(t) => t('Repair Faulty Stock')}</Translation>,
    element: RepairedStock 
  },
  {
    path:'/transfer-repaired-stock',
    exact:true,
    name:<Translation>{(t) => t('Transfer Repair Stock')}</Translation>,
    element: TransferRepairedStock 
  },
  {
    path:'/transfer-reseller',
    exact:true,
    name:<Translation>{(t) => t('Transfer to Reseller')}</Translation>,
    element: TransferToReseller 
  },
  {
    path:'/return-stock',
    exact:true,
    name:<Translation>{(t) => t('Return Stock')}</Translation>,
    element: ReturnStock 
  },
  {
    path:'/repaired-cost',
    exact:true,
    name:<Translation>{(t) => t('Repaired Cost')}</Translation>,
    element: RepairedCost 
  },
  {
    path:'/reseller-stock',
    exact:true,
    name:<Translation>{(t) => t('Reseller Stock')}</Translation>,
    element: ResellerStock 
  },
  {
    path:'/testing-stock',
    exact:true,
    name:<Translation>{(t) => t('Testing Stock')}</Translation>,
    element: TestingStock 
  },
  {
    path:'/transfer-to-testing',
    exact:true,
    name:<Translation>{(t) => t('Transfer To Testing')}</Translation>,
    element: TransferToTesting 
  },
  {
    path:'/testing-profile/:id',
    exact:true,
    name:<Translation>{(t) => t('Testing Material')}</Translation>,
    element: TestingProfile 
  },
  {
    path:'/test-material',
    exact:true,
    name:<Translation>{(t) => t('Test Material')}</Translation>,
    element: TestMaterial 
  },
  {
    path:'/auditLogs',
    exact:true,
    name:<Translation>{(t) => t('Audit Logs')}</Translation>,
    element: AuditLogs 
  },
  {
    path:'/reseller-qty',
    exact:true,
    name:<Translation>{(t) => t('Reseller Forwarded Qty')}</Translation>,
    element: ResellerQty
  },
  {
    path:'/revert-damage',
    exact:true,
    name:<Translation>{(t) => t('Revert Damage')}</Translation>,
    element: RevertDamage
  }
]

export default routes
