import PropTypes from 'prop-types'
import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
// import "./task.css";
import {Link} from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardGroup,
  CCardHeader,
  CCardImage,
  CCardLink,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CListGroup,
  CListGroupItem,
  CNav,
  CNavItem,
  CNavLink,
  CCol,
  CRow,
} from '@coreui/react'
import ReactImg from 'src/assets/images/react.jpg'

import jwt_decode from "jwt-decode";
import axios from "axios";


const ViewAllBlogs = () => {

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
          {/* <DocsExample href="components/card/#grid-cards"> */}
              <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 3 }}>
                <CCol xs>
                  <CCard>
                    <CCardImage orientation="top" src={ReactImg} />
                    <CCardBody>
                      <CCardTitle>Card title</CCardTitle>
                      <CCardText>
                        This is a wider card with supporting text below as a natural lead-in to
                        additional content. This content is a little bit longer.
                      </CCardText>
                    </CCardBody>
                    <CCardFooter>
                      <small className="text-medium-emphasis">Last updated 3 mins ago</small>
                    </CCardFooter>
                  </CCard>
                </CCol>
                <CCol xs>
                  <CCard>
                    <CCardImage orientation="top" src={ReactImg} />
                    <CCardBody>
                      <CCardTitle>Card title</CCardTitle>
                      <CCardText>
                        This is a wider card with supporting text below as a natural lead-in to
                        additional content. This content is a little bit longer.
                      </CCardText>
                    </CCardBody>
                    <CCardFooter>
                      <small className="text-medium-emphasis">Last updated 3 mins ago</small>
                    </CCardFooter>
                  </CCard>
                </CCol>
                <CCol xs>
                  <CCard>
                    <CCardImage orientation="top" src={ReactImg} />
                    <CCardBody>
                      <CCardTitle>Card title</CCardTitle>
                      <CCardText>
                        This is a wider card with supporting text below as a natural lead-in to
                        additional content. This content is a little bit longer.
                      </CCardText>
                    </CCardBody>
                    <CCardFooter>
                      <small className="text-medium-emphasis">Last updated 3 mins ago</small>
                    </CCardFooter>
                  </CCard>
                </CCol>
                <CCol xs>
                  <CCard>
                    <CCardImage orientation="top" src={ReactImg} />
                    <CCardBody>
                      <CCardTitle>Card title</CCardTitle>
                      <CCardText>
                        This is a wider card with supporting text below as a natural lead-in to
                        additional content. This content is a little bit longer.
                      </CCardText>
                    </CCardBody>
                    <CCardFooter>
                      <small className="text-medium-emphasis">Last updated 3 mins ago</small>
                    </CCardFooter>
                  </CCard>
                </CCol>
              </CRow>
            {/* </DocsExample> */}
              




          </CCardBody>
        </CCard>
      </CCol>            
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default ViewAllBlogs
