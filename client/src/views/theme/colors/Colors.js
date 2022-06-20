import PropTypes from 'prop-types'
import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import "./user.css";
import {Link} from 'react-router-dom'
// import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
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
import { DocsCallout, DocsExample } from 'src/components'
import { rgbToHex } from '@coreui/utils'
import { DocsLink } from 'src/components'

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
  
    console.log("in dashboard 2");
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
  
      var config = {
        method: 'post',
        url: 'http://localhost:3003/admin/employees',
        headers: { 
          'Authorization': `${token}`
        }
      };
      
      axios(config)
      .then(function (response) {
        setUsers(response.data);
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
      // await alert("user deleted ", id);
      await window.location.reload();
      }
      
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
          <CButton color="secondary" style={{ float: "right" }}>Add User</CButton>
          </Link>
              <CTable striped>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col" colSpan="2">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="2">Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="2">Email id</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="2">Position</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="2">Team</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="2" >Role</CTableHeaderCell>
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
                    <CTableDataCell colSpan="2">{user.empTeam}</CTableDataCell>
                    <CTableDataCell colSpan="2" data-role='{{user.role}}' className="role">{user.role}</CTableDataCell>
                    <CTableDataCell colSpan="2" className="cellAction">

                      <div className="cellAction">
                      <Link to={`/theme/ViewData/${user._id}`} style={{ textDecoration: "none" }} className="viewButton">
                      <CButton 
                      color="dark"
                      className="viewButton">View  </CButton>
                        </Link>
                        <Link to={`/theme/ViewData/${user._id}`} style={{ textDecoration: "none" }} className="viewButton">
                      <CButton 
                      color="dark"
                      className="viewButton">Edit  </CButton>
                        </Link>
                        <CButton
                          color="danger"
                          className="deleteButton"
                          onClick={() => handleDelete(user._id)}
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

export default Colors
