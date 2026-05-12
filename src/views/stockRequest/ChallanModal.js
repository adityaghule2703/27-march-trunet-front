// // import React, { useRef } from 'react';
// // import { CModal, CModalHeader, CModalTitle, CModalBody, CButton } from '@coreui/react';
// // import PropTypes from 'prop-types';
// // import '../../css/challan.css';
// // import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
// // import html2canvas from 'html2canvas';
// // import jsPDF from 'jspdf';
// // import CIcon from '@coreui/icons-react';
// // import { cilArrowBottom, cilDelete } from '@coreui/icons';

// // const ChallanModal = ({ visible, onClose, data }) => {
// //   const challanRef = useRef();

// //   if (!data) return null;

// //   const companyInfo = {
// //     name: data.warehouse?.centerName || "SSV TELECOM PVT LTD",
// //     branch: data.center?.reseller?.businessName || "SSV ALPAH - Anand Nagar",
// //     address: data.center?.centerName || "Anand Nagar",
// //     area: data.center?.area?.areaName || "Anand Nagar",
// //     contactPerson: data.center?.reseller?.name || "Sameer Kodlikar",
// //     handoverTo: data.center?.centerName || "Satish",
// //     contactNo: data.center?.reseller?.contactNumber || ""
// //   };

// //   const challanInfo = {
// //     challanNo: data.challanNo || "N/A",
// //     challanDate: data.challanDate ? formatDate(data.challanDate, 'dateOnly') : "N/A",
// //     dispatchedFrom: data.warehouse?.centerName || "SSV TELECOM PVT LTD"
// //   };


// //   const warehouseChallanApprovedAt = data.approvalInfo?.warehouseChallanApprovedAt;
// //   const warehouseChallanApprovedBy = data.approvalInfo?.warehouseChallanApprovedBy;


// //   const downloadPDF = async () => {
// //     if (!challanRef.current) return;

// //     try {
// //       const canvas = await html2canvas(challanRef.current, {
// //         scale: 2,
// //         useCORS: true,
// //         logging: false
// //       });

// //       const imgData = canvas.toDataURL('image/png');
// //       const pdf = new jsPDF('p', 'mm', 'a4');
// //       const imgWidth = 210; 
// //       const pageHeight = 295; 
// //       const imgHeight = (canvas.height * imgWidth) / canvas.width;
// //       let heightLeft = imgHeight;

// //       let position = 0;

// //       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
// //       heightLeft -= pageHeight;

// //       while (heightLeft >= 0) {
// //         position = heightLeft - imgHeight;
// //         pdf.addPage();
// //         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
// //         heightLeft -= pageHeight;
// //       }

// //       pdf.save(`challan-${challanInfo.challanNo}.pdf`);
// //     } catch (error) {
// //       console.error('Error generating PDF:', error);
// //       alert('Error generating PDF. Please try again.');
// //     }
// //   };

// //   return (
// //     <CModal 
// //       visible={visible} 
// //       onClose={onClose} 
// //       size="lg"
// //       backdrop="static"
// //       className="challan-modal"
// //     >
// //       <CModalHeader className="challan-modal-header">
// //         <CModalTitle>Challan Preview</CModalTitle>
// //           <CButton onClick={downloadPDF} className="reset-button me-2">
// //             {/* <CIcon icon={cilArrowBottom} className="me-2" /> */}
// //             Download
// //           </CButton>
// //       </CModalHeader>
// //       <CModalBody className="challan-modal-body">
// //         <div  ref={challanRef} className="challan-container">
// //           <div className="challan-header">
// //             <h2 className="company-name">{companyInfo.name}</h2>
// //             <h3 className="branch-name">{companyInfo.branch}</h3>
// //           </div>
// //           <table className="challan-details-table">
// //             <tbody>
// //               <tr className="table-row">
// //                 <td className="details-label">Branch:</td>
// //                 <td className="details-value">{companyInfo.address}</td>
// //                 <td className="details-label">Challan No:</td>
// //                 <td className="details-value">{challanInfo.challanNo}</td>
// //               </tr>
// //               <tr className="table-row">
// //                 <td className="details-label"></td>
// //                 <td className="details-value"></td>
// //                 <td className="details-label">Challan Date:</td>
// //                 <td className="details-value">{challanInfo.challanDate}</td>
// //               </tr>
// //               <tr className="table-row">
// //                 <td className="details-label">Area:</td>
// //                 <td className="details-value">{companyInfo.area}</td>
// //                 <td className="details-label"></td>
// //                 <td className="details-value"></td>
// //               </tr>
// //               <tr className="table-row">
// //                 <td className="details-label">Contact Person:</td>
// //                 <td className="details-value">{companyInfo.contactPerson}</td>
// //                 <td className="details-label">Handover To:</td>
// //                 <td className="details-value">Driver/Manager/Zonal</td>
// //               </tr>
// //               <tr className="table-row">
// //                 <td className="details-label">Contact No:</td>
// //                 <td className="details-value">{companyInfo.contactNo}</td>
// //                 <td className="details-label">Dispatched from:</td>
// //                 <td className="details-value">{challanInfo.dispatchedFrom}</td>
// //               </tr>
// //             </tbody>
// //           </table>
// //           <table className="products-table">
// //             <thead>
// //               <tr className="table-header-row">
// //                 <th className="product-header">Product</th>
// //                 <th className="quantity-header">Quantity</th>
// //                 <th className="serial-header">Serial No.</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {data.products?.map((item, index) => (
// //                 <tr key={item._id || index} className="product-row">
// //                   <td className="product-cell">{item.product?.productTitle || 'N/A'}</td>
// //                   <td className="quantity-cell">{item.approvedQuantity || item.quantity || 0} Pcs</td>
// //                   <td className="serial-cell">
// //                     {item.approvedSerials?.length > 0 
// //                       ? item.approvedSerials.join(', ')
// //                       : item.product?.trackSerialNumber === "Yes" 
// //                         ? 'Serial numbers required'
// //                         : ''
// //                     }
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>

// //           <div className="signatures-section">
// //             <div className="signature-box">
// //             {data.completionInfo?.completedBy ? (
// //                 <div className="approval-info">
// //                   <div className="approval-name">
// //                     <strong>{data.completionInfo.completedBy.fullName}</strong>
// //                   </div>
// //                   {data.completionInfo.completedOn && (
// //                     <div className="approval-date">
// //                       Date: {formatDateTime(data.completionInfo.completedOn)}
// //                     </div>
// //                   )}
// //                 </div>
// // ):(<div className="approval-info">
// //      <div className="approval-name">
// // </div>
// // </div>
// //               )}
// //               <div className="signature-line"></div>
// //               <strong>Receivers Name & Signature</strong>
// //             </div>
// //             <div className="signature-box">
// //               {warehouseChallanApprovedBy && (
// //                 <div className="approval-info">
// //                   <div className="approval-name">
// //                     <strong>{warehouseChallanApprovedBy.fullName}</strong>
// //                   </div>
// //                   {warehouseChallanApprovedAt && (
// //                     <div className="approval-date">
// //                       Date: {formatDateTime(warehouseChallanApprovedAt)}
// //                     </div>
// //                   )}
// //                 </div>
// //               )}
// //                <div className="signature-line"></div>
// //               <strong>Authorised Sign</strong>
    
// //             </div>
// //           </div>

// //         </div>
// //       </CModalBody>
// //     </CModal>
// //   );
// // };

// // ChallanModal.propTypes = {
// //   visible: PropTypes.bool.isRequired,
// //   onClose: PropTypes.func.isRequired,
// //   data: PropTypes.shape({
// //     _id: PropTypes.string,
// //     warehouse: PropTypes.shape({
// //       _id: PropTypes.string,
// //       centerName: PropTypes.string,
// //       centerCode: PropTypes.string,
// //       centerType: PropTypes.string
// //     }),
// //     center: PropTypes.shape({
// //       _id: PropTypes.string,
// //       centerName: PropTypes.string,
// //       centerCode: PropTypes.string,
// //       centerType: PropTypes.string,
// //       reseller: PropTypes.shape({
// //         businessName: PropTypes.string,
// //         name:PropTypes.string,
// //         contactNumber:PropTypes.string,
// //       }),
// //       area: PropTypes.shape({
// //         areaName: PropTypes.string,
// //       }),
// //     }),
// //     date: PropTypes.string,
// //     orderNumber: PropTypes.string,
// //     challanNo: PropTypes.string,
// //     challanDate: PropTypes.string,
// //     status: PropTypes.string,
// //     remark: PropTypes.string,
// //     products: PropTypes.arrayOf(
// //       PropTypes.shape({
// //         _id: PropTypes.string,
// //         product: PropTypes.shape({
// //           productTitle: PropTypes.string,
// //           productCode: PropTypes.string,
// //           trackSerialNumber: PropTypes.string
// //         }),
// //         quantity: PropTypes.number,
// //         approvedQuantity: PropTypes.number,
// //         approvedSerials: PropTypes.arrayOf(PropTypes.string)
// //       })
// //     ),
// //     approvalInfo: PropTypes.shape({
// //       approvedAt: PropTypes.string,
// //       approvedBy: PropTypes.shape({
// //         _id: PropTypes.string,
// //         fullName: PropTypes.string,
// //         email: PropTypes.string
// //       }),
// //       warehouseChallanApprovedAt: PropTypes.string,
// //       warehouseChallanApprovedBy: PropTypes.shape({
// //         _id: PropTypes.string,
// //         fullName: PropTypes.string,
// //         email: PropTypes.string
// //       })
// //     }),
// //     completionInfo:PropTypes.shape({
// //      completedOn: PropTypes.string,
// // completedBy: PropTypes.shape({
// // _id:PropTypes.string,
// // fullName:PropTypes.string,
// // email:PropTypes.string
// // })
// // }),
// //     createdBy: PropTypes.shape({
// //       _id: PropTypes.string,
// //       fullName: PropTypes.string,
// //       email: PropTypes.string
// //     })
// //   })
// // };


// // export default ChallanModal;



// import React, { useRef } from 'react';
// import { CModal, CModalHeader, CModalTitle, CModalBody, CButton } from '@coreui/react';
// import PropTypes from 'prop-types';
// import '../../css/challan.css';
// import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// const ChallanModal = ({ visible, onClose, data }) => {
//   const challanRef = useRef();

//   if (!data) return null;

//   const companyInfo = {
//     name: data.warehouse?.centerName || "SSV TELECOM PVT LTD",
//     // branch: data.center?.reseller?.businessName || "SSV ALPAH - Anand Nagar",
//     branch: data.center?.reseller?.businessName || "",
//     address: data.center?.centerName || "Anand Nagar",
//     area: data.center?.area?.areaName || "Anand Nagar",
//     contactPerson: data.center?.reseller?.name || "Sameer Kodlikar",
//     handoverTo: data.center?.centerName || "Satish",
//     contactNo: data.center?.reseller?.contactNumber || ""
//   };

//   const challanInfo = {
//     challanNo: data.challanNo || "N/A",
//     challanDate: data.challanDate ? formatDate(data.challanDate, 'dateOnly') : "N/A",
//     dispatchedFrom: data.warehouse?.centerName || "SSV TELECOM PVT LTD"
//   };

//   const warehouseChallanApprovedAt = data.approvalInfo?.warehouseChallanApprovedAt;
//   const warehouseChallanApprovedBy = data.approvalInfo?.warehouseChallanApprovedBy;

//   // Check if incomplete info exists
//   const hasIncompleteInfo = data.incompleteInfo && 
//     (data.incompleteInfo.incompleteBy || data.incompleteInfo.incompleteOn);

//   const downloadPDF = async () => {
//     if (!challanRef.current) return;

//     try {
//       const canvas = await html2canvas(challanRef.current, {
//         scale: 2,
//         useCORS: true,
//         logging: false
//       });

//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const imgWidth = 210; 
//       const pageHeight = 295; 
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;

//       let position = 0;

//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;

//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }

//       pdf.save(`challan-${challanInfo.challanNo}.pdf`);
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       alert('Error generating PDF. Please try again.');
//     }
//   };

//   return (
//     <CModal 
//       visible={visible} 
//       onClose={onClose} 
//       size="lg"
//       backdrop="static"
//       className="challan-modal"
//     >
//       <CModalHeader className="challan-modal-header">
//         <CModalTitle>Challan Preview</CModalTitle>
//         <CButton onClick={downloadPDF} className="reset-button me-2">
//           Download
//         </CButton>
//       </CModalHeader>
//       <CModalBody className="challan-modal-body">
//         <div ref={challanRef} className="challan-container">
//           <div className="challan-header">
//             <h2 className="company-name">{companyInfo.name}</h2>
//             <h3 className="branch-name">{companyInfo.branch}</h3>
//           </div>
          
//           <table className="challan-details-table">
//             <tbody>
//               <tr className="table-row">
//                 <td className="details-label">Branch:</td>
//                 <td className="details-value">{companyInfo.address}</td>
//                 <td className="details-label">Challan No:</td>
//                 <td className="details-value">{challanInfo.challanNo}</td>
//               </tr>
//               <tr className="table-row">
//                 <td className="details-label"></td>
//                 <td className="details-value"></td>
//                 <td className="details-label">Challan Date:</td>
//                 <td className="details-value">{challanInfo.challanDate}</td>
//               </tr>
//               <tr className="table-row">
//                 <td className="details-label">Area:</td>
//                 <td className="details-value">{companyInfo.area}</td>
//                 <td className="details-label"></td>
//                 <td className="details-value"></td>
//               </tr>
//               <tr className="table-row">
//                 <td className="details-label">Contact Person:</td>
//                 <td className="details-value">{companyInfo.contactPerson}</td>
//                 <td className="details-label">Handover To:</td>
//                 <td className="details-value">Driver/Manager/Zonal</td>
//               </tr>
//               <tr className="table-row">
//                 <td className="details-label">Contact No:</td>
//                 <td className="details-value">{companyInfo.contactNo}</td>
//                 <td className="details-label">Dispatched from:</td>
//                 <td className="details-value">{challanInfo.dispatchedFrom}</td>
//               </tr>
//             </tbody>
//           </table>
          
//           <table className="products-table">
//             <thead>
//               <tr className="table-header-row">
//                 <th className="product-header">Product</th>
//                 <th className="quantity-header">Quantity</th>
//                 <th className="serial-header">Serial No.</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.products?.map((item, index) => (
//                 <tr key={item._id || index} className="product-row">
//                   <td className="product-cell">{item.product?.productTitle || 'N/A'}</td>
//                   <td className="quantity-cell">{item.approvedQuantity || item.quantity || 0} Pcs</td>
//                   <td className="serial-cell">
//                     {item.approvedSerials?.length > 0 
//                       ? item.approvedSerials.join(', ')
//                       : item.product?.trackSerialNumber === "Yes" 
//                         ? 'Serial numbers required'
//                         : ''
//                     }
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="signatures-section">
//             {/* Left Signature Box - Receivers/Completion info */}
//             <div className="signature-box">
//               {data.completionInfo?.completedBy ? (
//                 <div className="approval-info">
//                   <div className="approval-name">
//                     <strong>{data.completionInfo.completedBy.fullName}</strong>
//                   </div>
//                   {data.completionInfo.completedOn && (
//                     <div className="approval-date">
//                       Date: {formatDateTime(data.completionInfo.completedOn)}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="approval-info">
//                   <div className="approval-name"></div>
//                 </div>
//               )}
//               <div className="signature-line"></div>
//               <strong>Receivers Name & Signature</strong>
//             </div>

//             {/* Middle Signature Box - Incomplete info (show only if exists) */}
//             {hasIncompleteInfo && (
//               <div className="signature-box">
//                 <div className="approval-info">
//                   {data.incompleteInfo.incompleteBy && (
//                     <div className="approval-name">
//                       <strong>{data.incompleteInfo.incompleteBy.fullName}</strong>
//                     </div>
//                   )}
//                   {data.incompleteInfo.incompleteOn && (
//                     <div className="approval-date">
//                       Date: {formatDateTime(data.incompleteInfo.incompleteOn)}
//                     </div>
//                   )}
//                   {/* {data.incompleteInfo.incompleteRemark && (
//                     <div className="approval-remark">
//                       Remark: {data.incompleteInfo.incompleteRemark}
//                     </div>
//                   )} */}
//                 </div>
//                 <div className="signature-line"></div>
//                 <strong>Incompleted by</strong>
//               </div>
//             )}

//             {/* Right Signature Box - Authorized Sign */}
//             <div className="signature-box">
//               {warehouseChallanApprovedBy ? (
//                 <div className="approval-info">
//                   <div className="approval-name">
//                     <strong>{warehouseChallanApprovedBy.fullName}</strong>
//                   </div>
//                   {warehouseChallanApprovedAt && (
//                     <div className="approval-date">
//                       Date: {formatDateTime(warehouseChallanApprovedAt)}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="approval-info">
//                   <div className="approval-name"></div>
//                 </div>
//               )}
//               <div className="signature-line"></div>
//               <strong>Authorised Sign</strong>
//             </div>
//           </div>
//         </div>
//       </CModalBody>
//     </CModal>
//   );
// };

// ChallanModal.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   data: PropTypes.shape({
//     _id: PropTypes.string,
//     status: PropTypes.string,
//     warehouse: PropTypes.shape({
//       _id: PropTypes.string,
//       centerName: PropTypes.string,
//       centerCode: PropTypes.string,
//       centerType: PropTypes.string
//     }),
//     center: PropTypes.shape({
//       _id: PropTypes.string,
//       centerName: PropTypes.string,
//       centerCode: PropTypes.string,
//       centerType: PropTypes.string,
//       reseller: PropTypes.shape({
//         businessName: PropTypes.string,
//         name: PropTypes.string,
//         contactNumber: PropTypes.string,
//       }),
//       area: PropTypes.shape({
//         areaName: PropTypes.string,
//       }),
//     }),
//     date: PropTypes.string,
//     orderNumber: PropTypes.string,
//     challanNo: PropTypes.string,
//     challanDate: PropTypes.string,
//     remark: PropTypes.string,
//     products: PropTypes.arrayOf(
//       PropTypes.shape({
//         _id: PropTypes.string,
//         product: PropTypes.shape({
//           productTitle: PropTypes.string,
//           productCode: PropTypes.string,
//           trackSerialNumber: PropTypes.string
//         }),
//         quantity: PropTypes.number,
//         approvedQuantity: PropTypes.number,
//         approvedSerials: PropTypes.arrayOf(PropTypes.string)
//       })
//     ),
//     approvalInfo: PropTypes.shape({
//       approvedAt: PropTypes.string,
//       approvedBy: PropTypes.shape({
//         _id: PropTypes.string,
//         fullName: PropTypes.string,
//         email: PropTypes.string
//       }),
//       warehouseChallanApprovedAt: PropTypes.string,
//       warehouseChallanApprovedBy: PropTypes.shape({
//         _id: PropTypes.string,
//         fullName: PropTypes.string,
//         email: PropTypes.string
//       })
//     }),
//     completionInfo: PropTypes.shape({
//       completedOn: PropTypes.string,
//       completedBy: PropTypes.shape({
//         _id: PropTypes.string,
//         fullName: PropTypes.string,
//         email: PropTypes.string
//       })
//     }),
//     incompleteInfo: PropTypes.shape({
//       incompleteOn: PropTypes.string,
//       incompleteBy: PropTypes.shape({
//         _id: PropTypes.string,
//         fullName: PropTypes.string,
//         email: PropTypes.string
//       }),
//       incompleteRemark: PropTypes.string
//     }),
//     createdBy: PropTypes.shape({
//       _id: PropTypes.string,
//       fullName: PropTypes.string,
//       email: PropTypes.string
//     })
//   })
// };

// export default ChallanModal;







import React, { useRef } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CButton } from '@coreui/react';
import PropTypes from 'prop-types';
import '../../css/challan.css';
import { formatDate, formatDateTime } from 'src/utils/FormatDateTime';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ChallanModal = ({ visible, onClose, data }) => {
  const challanRef = useRef();

  if (!data) return null;

  const companyInfo = {
    name: data.warehouse?.centerName || "SSV TELECOM PVT LTD",
    // branch: data.center?.reseller?.businessName || "SSV ALPAH - Anand Nagar",
    branch: data.center?.reseller?.businessName || "",
    address: data.center?.centerName || "Anand Nagar",
    area: data.center?.area?.areaName || "Anand Nagar",
    contactPerson: data.center?.reseller?.name || "Sameer Kodlikar",
    handoverTo: data.center?.centerName || "Satish",
    contactNo: data.center?.reseller?.contactNumber || ""
  };

  const challanInfo = {
    challanNo: data.challanNo || "N/A",
    challanDate: data.challanDate ? formatDate(data.challanDate, 'dateOnly') : "N/A",
    dispatchedFrom: data.warehouse?.centerName || "SSV TELECOM PVT LTD"
  };

  const warehouseChallanApprovedAt = data.approvalInfo?.warehouseChallanApprovedAt;
  const warehouseChallanApprovedBy = data.approvalInfo?.warehouseChallanApprovedBy;

  // Check if incomplete info exists
  const hasIncompleteInfo = data.incompleteInfo && 
    (data.incompleteInfo.incompleteBy || data.incompleteInfo.incompleteOn);

  const downloadPDF = async () => {
    if (!challanRef.current) return;

    try {
      const canvas = await html2canvas(challanRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; 
      const pageHeight = 295; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`challan-${challanInfo.challanNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <CModal 
      visible={visible} 
      onClose={onClose} 
      size="lg"
      backdrop="static"
      className="challan-modal"
    >
      <CModalHeader className="challan-modal-header">
        <CModalTitle>Challan Preview</CModalTitle>
        <CButton onClick={downloadPDF} className="reset-button me-2">
          Download
        </CButton>
      </CModalHeader>
      <CModalBody className="challan-modal-body">
        <div ref={challanRef} className="challan-container">
          <div className="challan-header">
            <h2 className="company-name">{companyInfo.name}</h2>
            <h3 className="branch-name">{companyInfo.branch}</h3>
          </div>
          
          <table className="challan-details-table">
            <tbody>
              <tr className="table-row">
                <td className="details-label">Branch:</td>
                <td className="details-value">{companyInfo.address}</td>
                <td className="details-label">Challan No:</td>
                <td className="details-value">{challanInfo.challanNo}</td>
              </tr>
              <tr className="table-row">
                <td className="details-label"></td>
                <td className="details-value"></td>
                <td className="details-label">Challan Date:</td>
                <td className="details-value">{challanInfo.challanDate}</td>
              </tr>
              <tr className="table-row">
                <td className="details-label">Area:</td>
                <td className="details-value">{companyInfo.area}</td>
                <td className="details-label"></td>
                <td className="details-value"></td>
              </tr>
              <tr className="table-row">
                <td className="details-label">Contact Person:</td>
                <td className="details-value">{companyInfo.contactPerson}</td>
                <td className="details-label">Handover To:</td>
                <td className="details-value">Driver/Manager/Zonal</td>
              </tr>
              <tr className="table-row">
                <td className="details-label">Contact No:</td>
                <td className="details-value">{companyInfo.contactNo}</td>
                <td className="details-label">Dispatched from:</td>
                <td className="details-value">{challanInfo.dispatchedFrom}</td>
              </tr>
            </tbody>
          </table>
          
          <table className="products-table">
  <thead>
    <tr className="table-header-row">
      <th className="product-header">Product</th>
      <th className="quantity-header">Quantity</th>
      <th className="serial-header">Serial No.</th>
    </tr>
  </thead>
  <tbody>
    {data.products?.map((item, index) => (
      <tr key={item._id || index} className="product-row">
        <td className="product-cell">{item.product?.productTitle || 'N/A'}</td>
        <td className="quantity-cell">
          {item.receivedQuantity !== undefined && item.receivedQuantity !== null 
            ? `${item.receivedQuantity} Pcs` 
            : `${item.approvedQuantity || item.quantity || 0} Pcs`}
        </td>
        <td className="serial-cell">
          {item.approvedSerials?.length > 0 
            ? item.approvedSerials.join(', ')
            : item.product?.trackSerialNumber === "Yes" 
              ? 'Serial numbers required'
              : ''}
        </td>
      </tr>
    ))}
  </tbody>
</table>

          <div className="signatures-section">
            {/* Left Signature Box - Receivers/Completion info */}
            <div className="signature-box">
              {data.completionInfo?.completedBy ? (
                <div className="approval-info">
                  <div className="approval-name">
                    <strong>{data.completionInfo.completedBy.fullName}</strong>
                  </div>
                  {data.completionInfo.completedOn && (
                    <div className="approval-date">
                      Date: {formatDateTime(data.completionInfo.completedOn)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="approval-info">
                  <div className="approval-name"></div>
                </div>
              )}
              <div className="signature-line"></div>
              <strong>Receivers Name & Signature</strong>
            </div>

            {/* Middle Signature Box - Incomplete info (show only if exists) */}
            {hasIncompleteInfo && (
              <div className="signature-box">
                <div className="approval-info">
                  {data.incompleteInfo.incompleteBy && (
                    <div className="approval-name">
                      <strong>{data.incompleteInfo.incompleteBy.fullName}</strong>
                    </div>
                  )}
                  {data.incompleteInfo.incompleteOn && (
                    <div className="approval-date">
                      Date: {formatDateTime(data.incompleteInfo.incompleteOn)}
                    </div>
                  )}
                  {/* {data.incompleteInfo.incompleteRemark && (
                    <div className="approval-remark">
                      Remark: {data.incompleteInfo.incompleteRemark}
                    </div>
                  )} */}
                </div>
                <div className="signature-line"></div>
                <strong>Incompleted by</strong>
              </div>
            )}

            {/* Right Signature Box - Authorized Sign */}
            <div className="signature-box">
              {warehouseChallanApprovedBy ? (
                <div className="approval-info">
                  <div className="approval-name">
                    <strong>{warehouseChallanApprovedBy.fullName}</strong>
                  </div>
                  {warehouseChallanApprovedAt && (
                    <div className="approval-date">
                      Date: {formatDateTime(warehouseChallanApprovedAt)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="approval-info">
                  <div className="approval-name"></div>
                </div>
              )}
              <div className="signature-line"></div>
              <strong>Authorised Sign</strong>
            </div>
          </div>
        </div>
      </CModalBody>
    </CModal>
  );
};

ChallanModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    _id: PropTypes.string,
    status: PropTypes.string,
    warehouse: PropTypes.shape({
      _id: PropTypes.string,
      centerName: PropTypes.string,
      centerCode: PropTypes.string,
      centerType: PropTypes.string
    }),
    center: PropTypes.shape({
      _id: PropTypes.string,
      centerName: PropTypes.string,
      centerCode: PropTypes.string,
      centerType: PropTypes.string,
      reseller: PropTypes.shape({
        businessName: PropTypes.string,
        name: PropTypes.string,
        contactNumber: PropTypes.string,
      }),
      area: PropTypes.shape({
        areaName: PropTypes.string,
      }),
    }),
    date: PropTypes.string,
    orderNumber: PropTypes.string,
    challanNo: PropTypes.string,
    challanDate: PropTypes.string,
    remark: PropTypes.string,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        product: PropTypes.shape({
          productTitle: PropTypes.string,
          productCode: PropTypes.string,
          trackSerialNumber: PropTypes.string
        }),
        quantity: PropTypes.number,
        approvedQuantity: PropTypes.number,
        approvedSerials: PropTypes.arrayOf(PropTypes.string)
      })
    ),
    approvalInfo: PropTypes.shape({
      approvedAt: PropTypes.string,
      approvedBy: PropTypes.shape({
        _id: PropTypes.string,
        fullName: PropTypes.string,
        email: PropTypes.string
      }),
      warehouseChallanApprovedAt: PropTypes.string,
      warehouseChallanApprovedBy: PropTypes.shape({
        _id: PropTypes.string,
        fullName: PropTypes.string,
        email: PropTypes.string
      })
    }),
    completionInfo: PropTypes.shape({
      completedOn: PropTypes.string,
      completedBy: PropTypes.shape({
        _id: PropTypes.string,
        fullName: PropTypes.string,
        email: PropTypes.string
      })
    }),
    incompleteInfo: PropTypes.shape({
      incompleteOn: PropTypes.string,
      incompleteBy: PropTypes.shape({
        _id: PropTypes.string,
        fullName: PropTypes.string,
        email: PropTypes.string
      }),
      incompleteRemark: PropTypes.string
    }),
    createdBy: PropTypes.shape({
      _id: PropTypes.string,
      fullName: PropTypes.string,
      email: PropTypes.string
    })
  })
};

export default ChallanModal;