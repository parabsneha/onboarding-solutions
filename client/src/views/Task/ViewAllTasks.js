import React, { useEffect, useState, createRef } from 'react'
import "./task.css";
import {Link} from 'react-router-dom'
import {FaEye, FaTasks, FaList} from 'react-icons/fa'
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
import ReactPaginate from 'react-paginate';


const ViewAllTasks = () => {

  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
    let token_task;
    var employee;
    var token;
    useEffect(()=>{
      token = localStorage.getItem("token");
      console.log("token ",token);
      if(token){
        var decoded = jwt_decode(token);
        token_task = decoded.task_id;
      }
      const data = {
        "currentPage" : currentPage,
        "pageSize":4
    }
        
      var config = {
        method: 'post',
        url: 'http://localhost:3003/admin/getAllTasks',
        headers: { 
          'Authorization': `${token}`
        },
        data:data
      };
      
      axios(config)
      .then(function (response) {
        setTasks(response.data.reverse());
        employee = response;
        console.log("= ", employee);
      })
      .catch(function (error) {
        console.log(error.response.data);
        const errorMsg = error.response.data;
        alert(" " + errorMsg);
      });
      
    },[currentPage]);

    const handlePageClick = (event) => {
      // const newOffset = (event.selected * itemsPerPage) % items.length;
      // console.log(
      //   `User requested page number ${event.selected}, which is offset ${newOffset}`
      // );
      // setItemOffset(newOffset);
      console.log("selected ", event.selected + 1);
      setCurrentPage(event.selected + 1);
    };

	  const handleDelete = async (id) => {
      token = localStorage.getItem("token");
      // if((window.confirm("Delete the item?"))){
      // await axios.post(`http://localhost:3003/admin/deleteTask/${id}`);
      // await alert("task deleted ", id);
      // await window.location.reload();
      // }
      
      if((window.confirm("Delete the item?"))){
        // await axios.post(`http://localhost:3003/admin/deleteTask/${id}`);
        // await alert("task deleted ", id);
        // await window.location.reload();

        var config = {
          method: 'post',
          url: `http://localhost:3003/admin/deleteTask/${id}`,
          headers: { 
            'Authorization': `${token}`
          }
         
        };
        
        axios(config)
        .then(function (response) {
           alert("task deleted ", id);
           console.log("delete res ",response.data)
          window.location.reload();
         
        })
        .catch(function (error) {
          console.log(error.response.data);
          const errorMsg = error.response.data;
          alert(" " + errorMsg);
        });
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
          <CButton color="secondary" style={{ float: "right" }}><FaTasks/>  Add</CButton>
          </Link>
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col" colSpan="1">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="1">Topic</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="3">Objective</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="1">Type</CTableHeaderCell>
                    {/* <CTableHeaderCell scope="col" colSpan="1">Person Responsible</CTableHeaderCell> */}
                    <CTableHeaderCell scope="col" colSpan="2" style={{ textAlign: 'center' }}>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                {tasks.map((task, index) => (
                  <CTableRow>
                    <CTableHeaderCell scope="row" colSpan="1">{index + 1}</CTableHeaderCell>
                    <CTableDataCell colSpan="1">{task.topic}</CTableDataCell>
                    <CTableDataCell colSpan="3" style={{textOverflow:"ellipses"}}>{task.objective}</CTableDataCell>
                    <CTableDataCell colSpan="1">{task.type}</CTableDataCell>
                    
                    {/* <CTableDataCell colSpan="2">{task.personResponsible.empFirstName} {task.personResponsible.empLastName}</CTableDataCell> */}
                    <CTableDataCell colSpan="2" className="cellAction">

                      <div className="cellAction">

                      <Link to={`/task/ViewTaskAdmin/${task._id}`} style={{ textDecoration: "none" }} className="viewButton">
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
                 
                </CTableBody>
              </CTable>
              <ReactPaginate
              previousLabel={"<<"}
              nextLabel={">>"}
              pageCount={10}
              breakLabel="..."
              marginPagesDisplayed={3}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={'pagination justify-content-center'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
              breakClassName={'page-item'}
              breakLinkClassName={'page-link'}
              activeClassName={'active'}
              />
          </CCardBody>
        </CCard>
      </CCol>            
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default ViewAllTasks
