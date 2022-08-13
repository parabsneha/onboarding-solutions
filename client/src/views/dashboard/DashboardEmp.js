import React, { useState , useEffect} from 'react'
import {
    cilPeople,
    cilUser,
    cilUserFemale,
    cilTask
  } from '@coreui/icons'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CWidgetStatsC,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CToast,
  CToastBody,
  CToastClose,
  CToastHeader,
  CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Announcement from '../../components/Announcement'
import jwt_decode from "jwt-decode";
import axios from "axios";

const DashboardEmp = () => {

  const [pendingCount, setPendingCount] = useState(0);
  const [assignedCount, setAssignedCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  var token;
  useEffect(()=>{
    token = localStorage.getItem("token");
    console.log("token ",token);
    if(token){
      var decoded = jwt_decode(token);    
    }
    var config = {
      method: 'post',
      url: `http://localhost:3003/employee/countByStatus`,
      headers: {
        'Authorization': `${token}`
      },
    };

    axios(config)
      .then(function (response) {
        console.log("data ", response.data);
        console.log("pending ", response.data[0].pending);
        setPendingCount(response.data[0].pending);
        setAssignedCount(response.data[0].assigned);
        setCompletedCount(response.data[0].completed);
      })
      .catch(function (error) {
        console.log(error);
      });
  },[]);

  return (
    <>
      {/* <WidgetsDropdown /> */}
      <Announcement/>
      <CCard>
      <CCardBody> 
        </CCardBody>
        </CCard>
     <CCard>
      <CCardBody>
        <CRow>
            <CCol sm={6} md={2}>
              <CWidgetStatsC
                icon={<CIcon icon={cilTask} height={36} />}
                value={pendingCount}
                title="Task Pending"
                progress={{ color: 'primary', value: 100 }}
                className="mb-4"
              />
            </CCol>
            <CCol sm={6} md={2}>
              <CWidgetStatsC
                icon={<CIcon icon={cilTask} height={36} />}
                value={assignedCount}
                title="Task Assigned"
                progress={{ color: 'warning', value: 100 }}
                className="mb-4"
              />
            </CCol>
            <CCol sm={6} md={2}>
              <CWidgetStatsC
                icon={<CIcon icon={cilTask} height={36}  />}
                value={completedCount}
                title="Task Completed"
                progress={{ color: 'success', value: 100 }}
                className="mb-4"
              />
            </CCol>
        </CRow>
      </CCardBody>
     </CCard>
    </>
  )
}

export default DashboardEmp
