import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { cilUser, cilBell, cilEnvelopeOpen, cilList, cilMenu ,cilBadge} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { FaAward } from 'react-icons/fa'

import navA from '../_nav'
import navE from '../_navE'
import navSup from '../_navSup'

// var bgColors={
//   "Yellow": "#F6BV42"
// }

const AppSidebar = ({ data }) => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [navigation, setNavigation] = useState("");
  const [userRole, setUserRole] = useState(false);
  // var userRole;
  console.log("data in sidebar ", data.role);

  useEffect(() => {
    console.log("use effect runs");
    setNav();
  },[data.role]);
  
  const setNav = async () => {
    const positions = ["supervisor", "Hr"];
    console.log("data role ",data.role)
    if (data.role == "employee") {
      if (positions.includes(data.empPosition)) {
        setNavigation(navSup);
        setUserRole(true);
        console.log("navigation in sup", navigation );
      } else {
        setNavigation(navE);
        console.log("navigation in dev/tester", navigation );
        // console.log("employee user ");
        // userRole = true;
        // console.log("userRole", userRole);
      }
    }else{
      if (data.role == "admin") {
        setNavigation(navA);
        console.log("navigation in admin", navigation );
        // userRole = false;
        // console.log("admin user");
      }
    }
    console.log("setNavigation ", navigation);
  }

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">

        <h4> Onboarding Solutions </h4>
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand>
      {/* cilBadge */}
      <CSidebarNav>
        <SimpleBar>
          {userRole ? 
         <><CIcon icon={cilBadge} size="lg" style={{ marginLeft: '23px', marginTop: '20px', marginRight: '20px',color:"yellow" }} /><b style={{ fontSize: '19px' }}>{data.role}</b></>
          : <><CIcon icon={cilUser} size="lg" style={{ marginLeft: '23px', marginTop: '20px', marginRight: '20px' }} /><b style={{ fontSize: '19px' }}>{data.role}</b></>
          }
        
          {/* <CIcon icon={cilUser} size="lg" style={{ marginLeft: '23px', marginTop: '20px', marginRight: '20px' }} /><b style={{ fontSize: '19px' }}>{data.role}</b> */}
          {/* <p><FaAward style={{ height: "auto", width: "1.9em" , marginLeft:"20px", marginTop:"15px"}} /><b style={{ fontSize: '19px' , marginTop:"13px"}}>{data.role}</b></p> */}
          <AppSidebarNav items={navigation} />
          {/* {userRole  ? 
          <AppSidebarNav items={navE}/>
          :  <AppSidebarNav items={navigation}/> } */}
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
