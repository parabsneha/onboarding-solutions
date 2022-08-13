import React from 'react'
// import { Link, useParams } from "react-router-dom";
import { useEffect, useState, createRef } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { Link, useNavigate } from "react-router-dom";
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { FaSignOutAlt } from 'react-icons/fa'

import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = ({ data }) => {
  // const [profilePic, setProfilePic] = useState(false);
  // if (data.profilePicture != null) {
  //   console.log("profile", data.profilePicture);
  //   setProfilePic(true);
  // }
  const navigate = useNavigate();
  const logOut = async (event) => {
    localStorage.clear();
    alert("You have been logged out");
    navigate('/login');
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        {/* {profilePic ?
          <CAvatar size="md" src={data.profilePicture} />
          : <CAvatar size="md" src="https://events.powercommunity.com/wp-content/uploads/2020/07/profile-placeholder.jpg" />
        } */}
 <CAvatar size="md" src={data.profilePicture} />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        {/* <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        {/* <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        {/* <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        {/* <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader> */}
        <CDropdownItem href={`/theme/ViewData/${data._id}`}>
          <CIcon icon={cilUser} className="me-2" />
          {/* <Link to={`/theme/ViewData/${data._id}`} style={{ textDecoration: "none" }} className="viewButton"> */}
          Profile
          {/* </Link> */}
        </CDropdownItem>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem> */}
        {/* <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        {/* <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownDivider />
        <CDropdownItem href="#" onClick={(e) => logOut(e)} >
          {/* <CIcon icon={cilLockLocked} className="me-2" /> */}
          <FaSignOutAlt className="me-2" />Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
