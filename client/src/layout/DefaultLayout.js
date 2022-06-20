import React from 'react'
import jwt_decode from "jwt-decode";
import {useEffect, useState} from "react";
import axios from "axios";
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {

  const [emp, setEmp] = useState([]);

    let id;
    var employee;
    var token;
    useEffect(()=>{
       token = localStorage.getItem("token");
      console.log("token ",token);
      if(token){
        var decoded = jwt_decode(token);
        id = decoded.user_id;
      }
  
      var config = {
        method: 'post',
        url: 'http://localhost:3003/employee/mydetails',
        headers: { 
          'Authorization': `${token}`
        }
      };
      
      axios(config)
      .then(function (response) {
        console.log(response.data);
        setEmp(response.data);
        employee = response.data;
        console.log("= ", employee);
      })
      .catch(function (error) {
        console.log(error);
      });
      
    },[]);
  

  return (
    <div>
      <AppSidebar data={emp}/>
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader data={emp}/>
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
