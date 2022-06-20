import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import "../ViewData/ViewData.css";
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

import jwt_decode from "jwt-decode";
import axios from "axios";


const ViewTask = () => {

    const [task, setTask] = useState({
        date: '',
        type: '',
        topic: '',
        objective: '',
        category: '',
        personResponsible: '',
        estimatedTime: ''
      });

      

    const { id } = useParams();
    useEffect(() => {
      console.log("useEffect working");
        loadtask();
      }, []);
      const loadtask = async () => {
        console.log("loadtask");
        const res = await axios.post(`http://localhost:3003/admin/getTaskById/${id}`);
        setTask(res.data);
        console.log("response",res.data);
        console.log("task",task);
      };
    
    return (
      <>
      <CCard>
      
          <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>

             <div className="item">
             {/* <img
                src={task.profilePicture}
                // src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                alt=""
                className="itemImg"
              /> */}

              <div className="details">
                <h5 className="itemTitle">{task.type}</h5>

                <div className="detailItem">
                  <span className="itemKey">Topic:</span>
                  <span className="itemValue">{task.topic}</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Objective:</span>
                  <span className="itemValue">{task.objective}</span>
                </div>
                
                <div className="detailItem">
                  <span className="itemKey">Person Responsible:</span>
                  <span className="itemValue">
                  {task.personResponsible}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Estimated time:</span>
                  <span className="itemValue">{task.estimatedTime} Hrs</span>
                </div>

              </div> 

            </div>

          </div>
        </div>
        
      </CCard>
      </>
    );
}

export default ViewTask