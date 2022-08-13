import React, { useEffect, useState, createRef } from 'react'
// import "./task.css";
// import {Link} from 'react-router-dom'
import {FaEye, FaTasks, FaList} from 'react-icons/fa'
import { Link, useParams } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTooltip,
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
import {
  cilPencil,
  cilTrash,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import jwt_decode from "jwt-decode";
import axios from "axios";


const ViewDataSup = () => {

  const [tasks, setTasks] = useState([]);
  const { id } = useParams();
  const [employee, setEmployee] = useState();
  
    // console.log("in dashboard 2");
    let token_task;
    // var employee;
    var token;
    useEffect(()=>{
      token = localStorage.getItem("token");
      console.log("token ",token);
      if(token){
        var decoded = jwt_decode(token);
        token_task = decoded.task_id;
        // console.log("token id == ", token_task);
      }     
      var data = {
        user_id: id
      };
      console.log("user id ", id);
      var config = {
        method: 'post',
        url: 'http://localhost:3003/hr/editTask',
        headers: { 
          'Authorization': `${token}`
        },
        data:data
      };
      
      axios(config)
      .then(function (response) {
        console.log("response = ", response.data);
        setTasks(response.data);
        setEmployee(response.data.user);
        console.log("response = ", response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
      
    },[]);

	  const handleDelete = async (id) => {

      if((window.confirm("Delete the item?"))){
      await axios.post(`http://localhost:3003/admin/deleteTask/${id}`);
       alert("task deleted ", id);
       window.location.reload();
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
          <Link to="/task/AddSupTasks" style={{ textDecoration: "none" }} className="viewButton">
          <CButton color="secondary" style={{ float: "right" }}><FaTasks/>  Add</CButton>
          </Link>
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col" colSpan="1">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="1">Topic</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="3">Objective</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="1">Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="1">Category</CTableHeaderCell>
                    {/* <CTableHeaderCell scope="col" colSpan="1" >Date</CTableHeaderCell> */}
                    {/* <CTableHeaderCell scope="col" colSpan="2" >Person Resp.</CTableHeaderCell> */}
                    <CTableHeaderCell scope="col" colSpan="2" style={{ textAlign: 'center' }}>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                {tasks && tasks.map((task, index) => (
                  <CTableRow>
                    <CTableHeaderCell scope="row" colSpan="1">{index + 1}</CTableHeaderCell>
                    <CTableDataCell colSpan="1">{task.topic}</CTableDataCell>
                    <CTableDataCell colSpan="3" style={{textOverflow:"ellipses"}}>{task.objective}</CTableDataCell>
                    <CTableDataCell colSpan="1">{task.type}</CTableDataCell>
                    <CTableDataCell colSpan="1">{task.category}</CTableDataCell>
                    {/* <CTableDataCell colSpan="1">{task.date}</CTableDataCell> */}
                    {/* <CTableDataCell colSpan="2">{task.personResponsible.empFirstName} {task.personResponsible.empLastName}</CTableDataCell> */}
                    <CTableDataCell colSpan="2" className="cellAction">

                      <div className="cellAction">

                      <Link to={`/task/ViewEmpTask/${task.task_id}/${task.user_id}`} style={{ textDecoration: "none" }} className="viewButton">
                      <CTooltip
                         content="View"
                          placement="top"
                      >
                      <CButton 
                      color="none"
                      className="viewButton"><FaEye/>  </CButton>
                      </CTooltip>
                        </Link>
                        <CTooltip
                         content="Delete"
                          placement="top"
                      >
                        <CButton
                          color="none"
                          className="deleteButton"
                          onClick={() => handleDelete(task._id)}
                        >
                          <CIcon icon={cilTrash} className="me-2" />
                        </CButton>
                        </CTooltip>
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

export default ViewDataSup
