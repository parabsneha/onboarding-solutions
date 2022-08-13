import PropTypes from 'prop-types'
import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
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
function allAnnouncements() {

    const [announcement, setAnnouncement] = useState([]);
    useEffect(() => {
        var token = localStorage.getItem("token");
        console.log("token ", token);
        var config = {
            method: 'post',
            url: 'http://localhost:3003/admin/fetchAnnouncement',
            headers: {
                'Authorization': `${token}`
            }
        };

        axios(config)
            .then(function (response) {
                setAnnouncement(response.data.reverse());
                console.log("= ", announcement);
            })
            .catch(function (error) {
                console.log(error.response.data);
                const errorMsg = error.response.data;
                alert(" " + errorMsg);
            });

    }, []);

  return (
    <CCard className="mb-4">
         <CCardHeader>
         All Announcements
        </CCardHeader>
        <CCardBody>
        <CTable striped>
        <CTableHead>
                  <CTableRow>
                  <CTableHeaderCell scope="col" colSpan="2" >#</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="7">Title</CTableHeaderCell>
                    <CTableHeaderCell scope="col" colSpan="3">Posted on </CTableHeaderCell>
                </CTableRow>
                {announcement.map((announcement, index) => (
                                        <CTableRow className="mb-4">
                                            <CTableHeaderCell scope="col" colSpan="2" >{index+1}.</CTableHeaderCell>
                                            <CTableHeaderCell scope="col" colSpan="7" >{announcement.description}</CTableHeaderCell>
                                            <CTableHeaderCell scope="col" colSpan="3" >{announcement.date}</CTableHeaderCell>
                                        </CTableRow>
                ))}
                </CTableHead>
                </CTable>
        </CCardBody>
       
        </CCard>
  )
}

export default allAnnouncements