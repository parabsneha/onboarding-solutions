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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Announcement from '../../components/Announcement'
import jwt_decode from "jwt-decode";
import axios from "axios";

const DashboardSup = () => {

  const [empCount, setEmpCount] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
 
  var token;
  useEffect(()=>{
    token = localStorage.getItem("token");
    console.log("token ",token);
    if(token){
      var decoded = jwt_decode(token);    
    }
    var config = {
      method: 'post',
      url: `http://localhost:3003/employee/getSupTeam`,
      headers: {
        'Authorization': `${token}`
      },
    };

    axios(config)
      .then(function (response) {
        console.log("data length ", response.data.length);
        setEmpCount(response.data.length);
      })
      .catch(function (error) {
        console.log(error);
      });
      MyTasks();
  },[]);

  const MyTasks = () =>{
    var config = {
        method: 'post',
        url: 'http://localhost:3003/employee/MyTasksSupervisor',
        headers: { 
          'Authorization': `${token}`
        }
      };
      
      axios(config)
      .then(function (response) {
        setTaskCount(response.data.length);
      })
      .catch(function (error) {
        console.log(error);
      });
      
  }

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
                icon={<CIcon icon={cilPeople} height={36} />}
                value={empCount}
                title="Employees"
                progress={{ color: 'primary', value: 100 }}
                className="mb-4"
              />
            </CCol>
            <CCol sm={6} md={2}>
              <CWidgetStatsC
                icon={<CIcon icon={cilTask} height={36} />}
                value={taskCount}
                title="My tasks"
                progress={{ color: 'warning', value: 100 }}
                className="mb-4"
              />
            </CCol>
            {/* <CCol sm={6} md={2}>
              <CWidgetStatsC
                icon={<CIcon icon={cilTask} height={36}  />}
                value="39098"
                title="Task Completed"
                progress={{ color: 'success', value: 100 }}
                className="mb-4"
              />
            </CCol> */}
         </CRow>
      </CCardBody>
     </CCard>
    </>
  )
}

export default DashboardSup
