import PropTypes from 'prop-types'
import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
// import "./task.css";
import {Link} from 'react-router-dom'
import {
  CCard,
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


const MyTeam = () => {

  const [tasks, setTasks] = useState([]);
  
    // console.log("in dashboard 2");
    let token_task;
    var employee;
    var token;
    useEffect(()=>{
      token = localStorage.getItem("token");
      console.log("token ",token);
      if(token){
        var decoded = jwt_decode(token);
        token_task = decoded.task_id;
        // console.log("token id == ", token_task);
      }
  
      var config = {
        method: 'post',
        url: 'http://localhost:3003/admin/getAllTasks',
        headers: { 
          'Authorization': `${token}`
        }
      };
      
      axios(config)
      .then(function (response) {
        setTasks(response.data);
        employee = response.data;
        console.log("= ", employee);
      })
      .catch(function (error) {
        console.log(error);
      });
      
    },[]);

	  const handleDelete = async (id) => {

      if((window.confirm("Delete the item?"))){
      await axios.post(`http://localhost:3003/admin/delete-employee/${id}`);
      await alert("task deleted ", id);
      await window.location.reload();
      }
      
    };
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
         All Tasks
        </CCardHeader>
        <CCardBody>
          <CRow>
          <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
          <Link to="/task/AddTask" style={{ textDecoration: "none" }} className="viewButton">
          <CButton color="secondary" style={{ float: "right" }}>Add task</CButton>
          </Link>
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
                {tasks.map((task, index) => (
                  <CTableRow>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell colSpan="2">{task.topic}</CTableDataCell>
                    <CTableDataCell colSpan="2">{task.objective}</CTableDataCell>
                    <CTableDataCell colSpan="2">{task.type}</CTableDataCell>
                    <CTableDataCell colSpan="2">{task.category}</CTableDataCell>
                    <CTableDataCell colSpan="2">{task.date}</CTableDataCell>
                    <CTableDataCell colSpan="2" className="cellAction">

                      <div className="cellAction">
                     
                      {/* to={`/theme/ViewData/${task._id}`} */}
                      {/* to="/theme/ViewData"  */}
                      <Link to={`/task/ViewTask/${task._id}`} style={{ textDecoration: "none" }} className="viewButton">
                      <CButton 
                      color="dark"
                      // variant="ghost"
                      className="viewButton">View  </CButton>
                        </Link>
                        <CButton
                        // variant="ghost"
                          color="danger"
                          className="deleteButton"
                          onClick={() => handleDelete(task._id)}
                        >
                          Delete
                        </CButton>
                      </div>

                    </CTableDataCell>
                  </CTableRow>
                 ))}
                  {/* <CTableRow>
                    <CTableHeaderCell scope="row">3</CTableHeaderCell>
                    <CTableDataCell colSpan="2">Larry the Bird</CTableDataCell>
                    <CTableDataCell>@twitter</CTableDataCell>
                  </CTableRow> */}
                </CTableBody>
              </CTable>
          </CCardBody>
        </CCard>
      </CCol>            
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default MyTeam
