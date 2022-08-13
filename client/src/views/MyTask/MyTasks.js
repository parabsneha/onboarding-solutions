import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
// import "./MyTasks.css";
import {FaEye} from 'react-icons/fa'
import { Link, useParams } from "react-router-dom";
import {
  CNav,
  CNavItem,
  CNavLink,
  CCard,
  CTooltip,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton

} from '@coreui/react'
import jwt_decode from "jwt-decode";
import axios from "axios";
import { Tab,  Col, Row, ListGroup } from 'react-bootstrap';
import CurrentDayTask from '../../components/Tasks/CurrentDayTask'
import ComingWeekTask from '../../components/Tasks/ComingWeekTask'
import ComingMonthTask from '../../components/Tasks/ComingMonthTask'
const MyTasks = () => {
    const [allTasks, setAllTask] = useState([]);
    const [dayTasks, setDayTask] = useState([]);
    const [weekTasks, setWeekTask] = useState([]);
    const [monthTasks, setMonthTask] = useState([]);
    const [all, setAll] = useState(true);
    const [day, setDay] = useState(false);
    const [ComingWeek, setComingWeek] = useState(false);
    const [ComingMonth, setComingMonth] = useState(false);

    const setDaytrue = async () => {
        setDay(true);
        setAll(false);
        setComingWeek(false);
        setComingMonth(false);
    }
    const setAlltrue = async () => {
        setDay(false);
        setAll(true);
        setComingWeek(false);
        setComingMonth(false);
    }

    const setWeektrue = async () => {
        setDay(false);
        setAll(false);
        setComingWeek(true);
        setComingMonth(false);
    }

    const setMonthtrue = async () => {
        setDay(false);
        setAll(false);
        setComingWeek(false);
        setComingMonth(true);
    }

    let id;
    var details;
    var token;
    useEffect(()=>{
       token = localStorage.getItem("token");
      console.log("token ",token);
      if(token){
        var decoded = jwt_decode(token);
        console.log("decoded data",decoded.user_id);
        id = decoded.user_id;
      }
      
      var config = {
        method: 'post',
        url: 'http://localhost:3003/employee/getEditTask',
        headers: { 
          'Authorization': `${token}`
        }
      };
      
      axios(config)
      .then(function (response) {
        console.log("all task",JSON.stringify(response.data));
        setAllTask(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
           
      
    },[]);
    
    return (
      <>
      <CCard>
      <CCardBody>
      <CCard>
      <CRow>
        <CCol>
             {/* <div className="d-grid gap-2"> */}
             {/* style={{margin : '10px', padding:"10px"}}  */}
             <CRow>
             <CCol className="d-grid gap-2">
        <CButton onClick={() => setAlltrue()} color="secondary" variant="outline" style={{ marginTop: "10px", marginLeft:"10px" }}>All</CButton>
        </CCol>
        <CCol className="d-grid gap-2">
        <CButton onClick={() => setDaytrue()} color="secondary" variant="outline" style={{ marginTop: "10px" }}>Today</CButton>
        </CCol>
        <CCol className="d-grid gap-2">
        <CButton onClick={() => setWeektrue()} color="secondary" variant="outline" style={{ marginTop: "10px" }}>Coming Week</CButton>
        </CCol>
        <CCol className="d-grid gap-2">
        <CButton onClick={() => setMonthtrue()} color="secondary" variant="outline" style={{ marginTop: "10px" ,marginRight:"10px"}}>Coming Month</CButton>
        </CCol>
        </CRow>
        { ComingWeek ? <ComingWeekTask/>          
           : null }  
        { ComingMonth ? <ComingMonthTask/>      
           : null}  
        { day ?   <CurrentDayTask/>      
           : null}  
              { all ?             
             <CRow>
             <CCardBody>
               <CRow>
               <CCol xs={12}>
             <CCard className="mb-4">
               <CCardBody>
                   <CTable striped>
                     <CTableHead>
                       <CTableRow>
                         <CTableHeaderCell scope="col" colSpan="2">#</CTableHeaderCell>
                         <CTableHeaderCell scope="col" colSpan="2">Topic</CTableHeaderCell>
                         <CTableHeaderCell scope="col" colSpan="2">Objective</CTableHeaderCell>
                         <CTableHeaderCell scope="col" colSpan="2">Type</CTableHeaderCell>
                         <CTableHeaderCell scope="col" colSpan="2">Category</CTableHeaderCell>
                         <CTableHeaderCell scope="col" colSpan="2" >Date</CTableHeaderCell>
                         <CTableHeaderCell scope="col" colSpan="2" style={{ textAlign: 'center' }}>Action</CTableHeaderCell>
                       </CTableRow>
                     </CTableHead>
                     <CTableBody>
                     { allTasks.length>0 ? allTasks.map((task, index) => (
                       <CTableRow>
                         <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                         <CTableDataCell colSpan="2">{task.topic}</CTableDataCell>
                         <CTableDataCell colSpan="2">{task.objective}</CTableDataCell>
                         <CTableDataCell colSpan="2">{task.type}</CTableDataCell>
                         <CTableDataCell colSpan="2">{task.category}</CTableDataCell>
                         <CTableDataCell colSpan="2">{task.date}</CTableDataCell>
                         <CTableDataCell colSpan="2" className="cellAction">
     
                           <div className="cellAction">
                           <Link to={`/task/ViewMyTask/${task.task_id}`} style={{ textDecoration: "none" }} className="viewButton">

                           <CTooltip
                         content="View"
                          placement="top"
                      >
                      <CButton 
                           color="none"
                           className="viewButton"><FaEye/>  </CButton>
                      </CTooltip>
                           
                             </Link>
                           </div>
     
                         </CTableDataCell>
                       </CTableRow>
                      )): <p>nothing to fetch</p>}
                     </CTableBody>
                   </CTable>
               </CCardBody>
             </CCard>
           </CCol>            
               </CRow>
             </CCardBody>
             </CRow>
              : null}    
    </CCol>
    </CRow>
    </CCard>
    </CCardBody>
    </CCard>
      </>
    );
}

export default MyTasks