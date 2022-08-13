import PropTypes from 'prop-types'
import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import "./user.css";
import {Link} from 'react-router-dom'
import {FaEye, FaUserPlus} from 'react-icons/fa'
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


const Employees = () => {

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

    let token_user;
    var employee;
    var token;
    
    useEffect(()=>{
      token = localStorage.getItem("token");
      console.log("token ",token);
      if(token){
        var decoded = jwt_decode(token);
        token_user = decoded.user_id;
        console.log("token id == ", token_user);
      }
      const data = {
        "currentPage" : currentPage,
        "pageSize":4
      }
      var config = {
        method: 'post',
        url: 'http://localhost:3003/employee/getSupTeam',
        headers: { 
          'Authorization': `${token}`
        },
        data:data
      };
      
      axios(config)
      .then(function (response) {
        setUsers(response.data.reverse());
        employee = response.data;
        console.log("= ", employee);
      })
      .catch(function (error) {
        console.log(error);
      });
      
    },[currentPage]);

    const handlePageClick = (event) => {
      console.log("selected ", event.selected + 1);
      setCurrentPage(event.selected + 1);
    };

	  const handleDelete = async (id) => {

      if((window.confirm("Delete the item?"))){
      await axios.post(`http://localhost:3003/admin/delete-employee/${id}`);
      await alert("user deleted ");
      await window.location.reload();
      }
      
    };
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
         All Employees
        </CCardHeader>
        <CCardBody>
          <CRow>
          <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
          <Link to="/theme/typography" style={{ textDecoration: "none" }} className="viewButton">
          {/* <CButton color="secondary" style={{ float: "right" }}><FaUserPlus/>  Add</CButton> */}
          </Link>
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col" colSpan="2">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="2">Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="2">Email id</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="2">Position</CTableHeaderCell>
                    {/* <CTableHeaderCell scope="col" colSpan="2">Team</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="2" >Role</CTableHeaderCell> */}
                    <CTableHeaderCell scope="col" colSpan="2" style={{ textAlign: 'center' }}>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                {users.map((user, index) => (
                  <CTableRow>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell colSpan="2">{user.empFirstName} {user.empLastName}</CTableDataCell>
                    <CTableDataCell colSpan="2">{user.empEmail}</CTableDataCell>
                    <CTableDataCell colSpan="2">{user.empPosition}</CTableDataCell>
                    <CTableDataCell colSpan="2" className="cellAction">

                      <div className="cellAction">
                      <Link to={`/task/ViewDataSup/${user._id}`} style={{ textDecoration: "none" }} className="viewButton">
                      <CTooltip
                         content="View"
                          placement="top"
                      >
                      <CButton 
                      color="none"
                      className="viewButton"><FaEye/></CButton>
                      </CTooltip>
                        </Link>
                        {/* <CTooltip
                         content="Delete"
                          placement="top"
                      >
                        <CButton
                          color="none"
                          className="deleteButton"
                          onClick={() => handleDelete(user._id)}
                        >
                          <CIcon icon={cilTrash} className="me-2" />
                        </CButton>
                        </CTooltip> */}
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

export default Employees
