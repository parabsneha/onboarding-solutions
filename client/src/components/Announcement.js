import { FaStar } from "react-icons/fa";
import ReactDOM from "react-dom";
import React, { useState, useEffect } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CTableHeaderCell,
    CFormCheck,
    CFormInput,
    CFormFeedback,
    CFormLabel,
    CFormSelect,
    CContainer,
    CFormTextarea,
    CInputGroup,
    CInputGroupText,
    CTableRow,
    CModal,
    CTable,
    CTableBody,
    CModalHeader,
    CModalBody,
    CModalTitle,
    CRow,
} from '@coreui/react'
import axios from "axios";
import CIcon from '@coreui/icons-react'
import {
    cilImage, cilBullhorn
} from '@coreui/icons'
function Announcement() {
    const [announcement, setAnnouncement] = useState([]);
    useEffect(() => {
        var token = localStorage.getItem("token");
        console.log("token ", token);
        var config = {
            method: 'post',
            url: 'http://localhost:3003/employee/fetchAnnouncement',
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

    const [visibleLg, setVisibleLg] = useState(false)

    return (
        <>
            <div>
                <CCard>
                    <CCardHeader onClick={() => setVisibleLg(!visibleLg)} style={{ display: "flex", flexDirection: "row", background: "linear-gradient(to left, #D8D8D8 0%, #666699 100%)" }} >
                        <h3> Announcements</h3>
                        <br />
                        <CIcon icon={cilBullhorn} size="xxl" style={{ paddingTop: "8px", }} />
                        <CModal size="lg" visible={visibleLg} onClose={() => setVisibleLg(false)}>
                            <CModalHeader>
                                <CModalTitle>Announcements for the day</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                                <CTable striped>
                                    <CTableBody>
                                    {announcement.length>0 ? announcement.map((announcement, index) => (
                                        <CTableRow className="mb-4">
                                            <CTableHeaderCell scope="col" colSpan="10" >{index+1}.</CTableHeaderCell>
                                            <CTableHeaderCell scope="col" colSpan="10" >{announcement.description}</CTableHeaderCell>
                                        </CTableRow>
                                    )):<p>No announcements for the day. </p>}
                                    </CTableBody>
                                </CTable>
                            </CModalBody>
                        </CModal>
                    </CCardHeader>

                </CCard>
            </div>
        </>
    );
};

export default Announcement