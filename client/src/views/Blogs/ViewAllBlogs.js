import React, { useEffect, useState, createRef, Component } from 'react'
import LandingNav from '../pages/landing/LandingNav';
import "./Like.scss";
import "./Blog.css";
import "./post.css";
import "./posts.css";
import { Image } from 'cloudinary-react'
import {FaHeart, FaHeartBroken, FaHeartbeat,FaRegHeart,FaGrinHearts,FaThumbsDown, FaThumbsUp, FaThumbtack} from 'react-icons/fa'
// FaHeart, FaHeartBroken, FaHeartbeat,FaRegHeart,FaGrinHearts,FaThumbsDown, FaThumbsUp, FaThumbtack
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
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilThumbUp
} from '@coreui/icons'
import ReactImg from 'src/assets/images/react.jpg'

import jwt_decode from "jwt-decode";
import axios from "axios";

const particleList = Array.from(Array(10));
const ViewAllBlogs = () => {


  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(null);
  const [clicked, setClicked] = useState(false);

  const [count, setCount] = useState(0);
  console.log(count);
  var token = localStorage.getItem("token");
  const [posts, setpost] = useState([]);
  
  useEffect(()=>{
    var config = {
      method: 'post',
      url: 'http://localhost:3003/admin/fetchBlog',
    };
    
    axios(config)
    .then(function (response) {
      setpost(response.data.reverse());      
      console.log("response from blog = ", response);
    })
    .catch(function (error) {
      console.log(error);
    });
    
  },[]);

  // const submitLike = (id) =>{
  //   console.log("id ", id);
  //   var config = {
  //     method: 'post',
  //     url: `http://localhost:3003/employee/submitLike/${id}`,
  //     headers: { 
  //       'Authorization': `${token}`
  //     }
  //   };
    
  //   axios(config)
  //   .then(function (response) {
  //     console.log("response from blog = ", response.data.likes);
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
  // }

  return (
    <>
      <LandingNav/>       
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center bg-image" style={{ padding: "20px" }}>
        <CCard style={{ margin: "auto", width: "50%", padding: "10px" }}>
        {posts.length>0 ? posts.map((post, index) => (
          <CCard style={{ marginTop: "20px"}}>
            <CCardBody style={{padding: "20px"}}>
              <CCardHeader>
              {post.description}
              </CCardHeader>
              <small style={{float:"right"}}>Posted on: {post.postedAt}</small>
            </CCardBody>
            <CCardImage orientation="top"
              src={post.content} 
              style={{paddingLeft: "20px", paddingRight: "20px", paddingBottom: "20px"}}             
            />
            <CCardFooter>
                           
            </CCardFooter>
          </CCard>
        )):<p>Nothing to fetch!</p>} 
        </CCard>
      </div>
    </>
  )
}

export default ViewAllBlogs