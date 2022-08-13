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
import { rgbToHex } from '@coreui/utils'
import ReactPaginate from 'react-paginate';

import jwt_decode from "jwt-decode";
// import {useEffect, useState} from "react";
import axios from "axios";

const ThemeView = () => {
  const [color, setColor] = useState('rgb(255, 255, 255)')
  const ref = createRef()

  useEffect(() => {
    const el = ref.current.parentNode.firstChild
    const varColor = window.getComputedStyle(el).getPropertyValue('background-color')
    setColor(varColor)
  }, [ref])

  return (
    <table className="table w-100" ref={ref}>
      <tbody>
        <tr>
          <td className="text-medium-emphasis">HEX:</td>
          <td className="font-weight-bold">{rgbToHex(color)}</td>
        </tr>
        <tr>
          <td className="text-medium-emphasis">RGB:</td>
          <td className="font-weight-bold">{color}</td>
        </tr>
      </tbody>
    </table>
  )
}

const ThemeColor = ({ className, children }) => {
  const classes = classNames(className, 'theme-color w-75 rounded mb-3')
  return (
    <CCol xs={12} sm={6} md={4} xl={2} className="mb-4">
      <div className={classes} style={{ paddingTop: '75%' }}></div>
      {children}
      <ThemeView />
    </CCol>
  )
}

ThemeColor.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

const Colors = () => {

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
        "pageSize":10
    }
  
      var config = {
        method: 'post',
        url: 'http://localhost:3003/admin/employees',
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
      if((window.confirm("Delete the item?"))){
      var config = {
        method: 'post',
        url: `http://localhost:3003/admin/delete-employee/${id}`,
        headers: { 
          'Authorization': `${token}`
        }
        
      };
      
      axios(config)
      .then(function (response) {
        alert("user deleted ");
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
    }
      // if((window.confirm("Delete the item?"))){
      // await axios.post(`http://localhost:3003/admin/delete-employee/${id}`);
      // alert("user deleted ");
      // window.location.reload();
      // }
      
    };
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
         All Users
        </CCardHeader>
        <CCardBody>
          <CRow>
          <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
          <Link to="/theme/typography" style={{ textDecoration: "none" }} className="viewButton">
          <CButton color="secondary" style={{ float: "right" }}><FaUserPlus/>  Add</CButton>
          </Link>
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col" colSpan="2">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="2">Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="2">Email id</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="2">Position</CTableHeaderCell>
                    {/* <CTableHeaderCell scope="col" colSpan="2">Team</CTableHeaderCell> */}
                    <CTableHeaderCell scope="col" colSpan="2" >Role</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="2" style={{paddingLeft:"60px"}} >Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                {users.map((user, index) => (
                  <CTableRow>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell colSpan="2">{user.empFirstName} {user.empLastName}</CTableDataCell>
                    <CTableDataCell colSpan="2">{user.empEmail}</CTableDataCell>
                    <CTableDataCell colSpan="2">{user.empPosition}</CTableDataCell>
                    {/* <CTableDataCell colSpan="2">{user.empTeam}</CTableDataCell> */}
                    <CTableDataCell colSpan="2" data-role='{{user.role}}' className="role">{user.role}</CTableDataCell>
                    <CTableDataCell scope="col" colSpan="2" className="cellAction">

                      <div className="cellAction">
                      <Link to={`/allUsers/ViewDataAdmin/${user._id}`} style={{ textDecoration: "none" }} className="viewButton">
                      <CTooltip
                         content="View"
                          placement="top"
                      >
                      <CButton 
                      color="none"
                      className="viewButton"><FaEye/></CButton>
                      </CTooltip>
                        </Link>
                        <CTooltip
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

export default Colors
