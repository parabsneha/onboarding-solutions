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
const MyTasks = () => {
    const [tasks, setTask] = useState([]);

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
        url: 'http://localhost:3003/employee/coming-week-task',
        headers: { 
          'Authorization': `${token}`
        }
      };
      
      axios(config)
      .then(function (response) {
        console.log("all task",JSON.stringify(response.data));
        setTask(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
           
      
    },[]);
    
    return (
      <>
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
                     {tasks.length>0 ? tasks.map((task, index) => (
                       <CTableRow>
                         <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                         <CTableDataCell colSpan="2">{task.topic}</CTableDataCell>
                         <CTableDataCell colSpan="2">{task.objective}</CTableDataCell>
                         <CTableDataCell colSpan="2">{task.type}</CTableDataCell>
                         <CTableDataCell colSpan="2">{task.category}</CTableDataCell>
                         <CTableDataCell colSpan="2">{task.date}</CTableDataCell>
                         <CTableDataCell colSpan="2" className="cellAction">
     
                           <div className="cellAction">
                           <Link to={`/task/ViewMyTask/${task.taskid}`} style={{ textDecoration: "none" }} className="viewButton">

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
      </>
    );
}

export default MyTasks