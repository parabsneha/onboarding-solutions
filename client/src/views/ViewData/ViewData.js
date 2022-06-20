import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import "./ViewData.css";
import { Link, useParams } from "react-router-dom";
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
import {Image} from 'cloudinary-react'
import jwt_decode from "jwt-decode";
import axios from "axios";


const ViewData = () => {

    const [user, setUser] = useState({
        empFirstName: "",
        empLastName: "",
        empEmail: "",
        empPosition: "",
        empTeam: "",
        empContactNum: "",
        role: ""
      });      

    const { id } = useParams();
    useEffect(() => {
      console.log("useEffect working");
        loadUser();
      }, []);
      const loadUser = async () => {
        console.log("loaduser");
        const res = await axios.post(`http://localhost:3003/admin/viewEmployee/${id}`);
        setUser(res.data);
        console.log("response",res.data);
        console.log("user",user);
      };
    
    return (
      <>
      <CCard>
      
          <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>

            <div className="item">
             {/* <h6>{user.profilePicture}</h6> */}
             <Image cloudName="dw7junf8b" publicId={user.profilePicture} className="itemImg"/>

              <div className="details">
                <h1 className="itemTitle">{user.empFirstName} {user.empLastName}</h1>

                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{user.empEmail}</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{user.empContactNum}</span>
                </div>
                
                <div className="detailItem">
                  <span className="itemKey">Position:</span>
                  <span className="itemValue">
                  {user.empPosition}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Role:</span>
                  <span className="itemValue">{user.role}</span>
                </div>

              </div> 

            </div>

          </div>
        </div>
        
      </CCard>
      </>
    );
}

export default ViewData