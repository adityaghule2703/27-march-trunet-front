import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  CContainer,
  CForm,
  CFormInput,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CInputGroup,
  useColorModes,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import {
  cilContrast,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'
 
import {
  AppHeaderDropdown,
  AppHeaderDropdownNotif,
} from './header/index'
import axiosInstance from 'src/axiosInstance'

const AppHeader = () => {
  const headerRef = useRef()
  const searchDropdownRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-pro-react-admin-template-theme-bright')
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
 
  const dispatch = useDispatch()
  const asideShow = useSelector((state) => state.asideShow)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)

  
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fix: Separate handler for mobile menu (toggles sidebar visibility)
  const handleSidebarToggle = () => {
    dispatch({ type: 'set', sidebarShow: !sidebarShow })
  }

  // Handler for desktop unfoldable menu
  const handleMenuClick = () => {
    dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })
  }

  const handleUsernameClick = (customerId) => {
    navigate(`/customer-profile/${customerId}`)
    setSearchDropdownOpen(false)
    setSearchTerm('')
  }

  const handleBuildingClick = (buildingId) => {
    navigate(`/building-profile/${buildingId}`)
    setSearchDropdownOpen(false)
    setSearchTerm('')
  }

  const handleCenterClick = (centerId) => {
    navigate(`/center-profile/${centerId}`)
    setSearchDropdownOpen(false)
    setSearchTerm('')
  }

 
  const fetchAllData = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/all-data')
      if (response.data.success) {
        return response.data.data
      }
      return null
    } catch (error) {
      console.error('Error fetching search data:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

 
  const handleSearch = async (term) => {
    setSearchTerm(term)
    
    if (!term.trim()) {
      setSearchResults(null)
      setSearchDropdownOpen(false)
      return
    }

    const allData = await fetchAllData()
    if (!allData) return

    const searchTermLower = term.toLowerCase()
    
 
    const buildingMatches = allData.buildings.filter(building => 
      building.name.toLowerCase().includes(searchTermLower)
    )
    
   
    const customerMatches = allData.customers.filter(customer => 
      customer.username.toLowerCase().includes(searchTermLower)
    )
    
   
    const centerMatches = allData.centers.filter(center => 
      center.name.toLowerCase().includes(searchTermLower)
    )

    const results = {
      buildings: buildingMatches,
      customers: customerMatches,
      centers: centerMatches
    }

    setSearchResults(results)
    setSearchDropdownOpen(true)
  }

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setSearchDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])
 
 
  const renderSearchResults = () => {
    if (!searchResults) return null

    const hasBuildings = searchResults.buildings.length > 0
    const hasCustomers = searchResults.customers.length > 0
    const hasCenters = searchResults.centers.length > 0

    if (!hasBuildings && !hasCustomers && !hasCenters) {
      return (
        <div className="search-section">
          <div className="search-header p-2">None</div>
          <div className="search-item p-2 text-muted">No data found</div>
        </div>
      )
    }

    return (
      <>
        {hasBuildings && (
          <div className="search-section">
            <div className="search-header p-2">Buildings</div>
            {searchResults.buildings.map(building => (
              <div 
                key={`building-${building.id}`} 
                className="search-item p-2 clickable"
                onClick={() => handleBuildingClick(building.id)}
              >
                {building.name}
              </div>
            ))}
          </div>
        )}
        
        {hasCustomers && (
          <div className="search-section">
            <div className="search-header p-2">Customers</div>
            {searchResults.customers.map(customer => (
              <div 
                key={`customer-${customer.id}`} 
                className="search-item p-2 clickable"
                onClick={() => handleUsernameClick(customer.id)}
              >
                {customer.username}
              </div>
            ))}
          </div>
        )}
        
        {hasCenters && (
          <div className="search-section">
            <div className="search-header p-2">Centers</div>
            {searchResults.centers.map(center => (
              <div 
                key={`center-${center.id}`} 
                className="search-item p-2 clickable"
                onClick={() => handleCenterClick(center.id)}
              >
                {center.name}
              </div>
            ))}
          </div>
        )}
      </>
    )
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef} style={{backgroundColor:'#2759a2'}}>
      <CContainer className="px-4" fluid>
        
        {/* Mobile menu button - toggles sidebar visibility */}
        <CHeaderToggler 
          onClick={handleSidebarToggle} 
          style={{marginLeft:'-40px'}}
          className="d-lg-none"  // Only show on mobile/tablet
        >
          <CIcon icon={cilMenu} size="lg" 
          style={{color:'#fff', verticalAlign: 'middle',
            position:'relative',filter:'brightness(150%)',
          }}/>
        </CHeaderToggler>

        {/* Desktop unfoldable button - optional, you might want to hide on mobile */}
        <CHeaderToggler 
          onClick={handleMenuClick} 
          style={{marginLeft:'-40px'}}
          className="d-none d-lg-flex"  // Only show on desktop
        >
          <CIcon icon={cilMenu} size="lg" 
          style={{color:'#fff', verticalAlign: 'middle',
            position:'relative',filter:'brightness(150%)',
          }}/>
        </CHeaderToggler>

        <CHeaderNav className="d-none d-md-flex ms-auto align-items-center">
          <CForm className="d-none d-sm-flex me-3">
            <>
              <style>
                {`
                  .placeholder-black::placeholder {
                    color: #555;
                  }
                  .search-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #d8dbe0;
                    border-radius: 0;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    max-height: 400px;
                    overflow-y: auto;
                  }
                  .search-section {
                    border-bottom: 1px solid #d8dbe0;
                  }
                  .search-section:last-child {
                    border-bottom: none;
                  }
                  .search-header {
                    padding: 0.5rem 1rem;
                    font-weight: 600;
                    color: #4f5d73;
                    font-size: 0.875rem;
                  }
                  .search-item {
                    padding: 0.5rem 1rem;
                    border-bottom: 1px solid #f0f0f0;
                    font-size: 0.875rem;
                    color: #4f5d73;
                  }
                  .search-item:last-child {
                    border-bottom: none;
                  }
                  .search-container {
                    position: relative;
                  }
                  .clickable {
                    cursor: pointer;
                  }
                  .clickable:hover {
                    background-color: #f8f9fa;
                  }
                  .search-item.text-muted {
                    color: #8a93a2 !important;
                  }
                `}
              </style>

              <div className="search-container" ref={searchDropdownRef}>
                <CInputGroup className="bg-white text-black">
                  <CFormInput
                    placeholder="Search"
                    aria-label="Search"
                    className="bg-white text-black placeholder-black"
                    style={{
                      border: 'none',
                      boxShadow: 'none',
                    }}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchTerm.trim() && setSearchDropdownOpen(true)}
                  />
                </CInputGroup>
                
                {searchDropdownOpen && (
                  <div className="search-dropdown">
                    {loading ? (
                      <div className="p-3 text-center text-muted">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Searching...
                      </div>
                    ) : (
                      renderSearchResults()
                    )}
                  </div>
                )}
              </div>
            </>
          </CForm>
 
          <AppHeaderDropdownNotif />
        </CHeaderNav>
 
        <CHeaderNav className="ms-auto ms-md-0">
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> {t('light')}
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> {t('dark')}
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}
 
export default AppHeader