// utils/checkReportStatus.js
import axiosInstance from 'src/axiosInstance'

export const checkReportSubmissionStatus = async () => {
  try {
    // Get current user info
    const meResponse = await axiosInstance.get('/auth/me')
    
    if (!meResponse.data.success || !meResponse.data.data.user.center) {
      console.log('No center found for user')
      localStorage.setItem('hasMissedReportSubmission', 'false')
      return false
    }
    
    const userCenterName = meResponse.data.data.user.center.centerName
    console.log('User center name:', userCenterName)
    
    // Get report submission status for the month
    const reportResponse = await axiosInstance.get('/reportsubmission/monthly-submission-status')
    
    if (!reportResponse.data.success || !reportResponse.data.data.centers) {
      console.log('No report data found')
      localStorage.setItem('hasMissedReportSubmission', 'false')
      return false
    }
    
    // Find the user's center in the centers array
    const userCenterData = reportResponse.data.data.centers.find(
      center => center.centerName === userCenterName
    )
    
    const hasMissed = userCenterData && userCenterData.submissionStatus === 'missed'
    localStorage.setItem('hasMissedReportSubmission', hasMissed ? 'true' : 'false')
    
    console.log(`Report submission status for ${userCenterName}:`, hasMissed ? 'MISSED - Restricting menu items' : 'SUBMITTED - Full access granted')
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('reportStatusChanged', { detail: { hasMissed } }))
    
    return hasMissed
  } catch (error) {
    console.error('Error checking report submission status:', error)
    localStorage.setItem('hasMissedReportSubmission', 'false')
    return false
  }
}