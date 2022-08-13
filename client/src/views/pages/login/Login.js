import React from 'react'
import './Login.css'
import axios from "axios";
import { Link , useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import jwt_decode from "jwt-decode";

const Login = () => {
  const [validated, setValidated] = useState(false);
  let [data, setData] = useState({ empEmail: "", empPassword: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    let position = ["Hr","supervisor"];
    useEffect(() => {
      console.log("useEffect working");
      var token = localStorage.getItem("token");
      if(token){
        var decoded = jwt_decode(token);
        console.log("token decoded == ", decoded);
        if(decoded.role=="employee"){
          if(position.includes(decoded.position)){
            navigate('/dashboardSup');
          }
          else{
            navigate('/dashboardEmp');
          }
        }else{
          navigate('/dashboard');
        }
      }
    },[]);

    const emailhandler = (event) => {
      setData({
          ...data,
          empEmail: event.target.value
      })
    }

      const passwordhandler = (event) => {
        setData({
            ...data,
            empPassword: event.target.value
        })
    }
    let details = null;
    

    const handleSubmit = async (e) => {
      const form = e.currentTarget
      if (form.checkValidity() === false) {
        e.preventDefault()
        e.stopPropagation()
        console.log("false validity");
      }
      else {
        e.preventDefault();
      e.preventDefault();
      var config = {
        method: 'post',
        url: `http://localhost:3003/login`,
        data: data
      };

  console.log("data ", data);
      axios(config)
        .then(function (response) {
          console.log("position from login ", response.data.position);
          console.log("token = ",response.data.token);
          localStorage.setItem("token", response.data.token);
          if(response.status === 200){
          console.log("success login ");
          if(response.data.role=="employee"){
            if(position.includes(response.data.position)){
              navigate('/dashboardSup');
            }
            else{
              navigate('/dashboardEmp');
            }
          }else{
            navigate('/dashboard');
          }
          }
        })
        .catch(function (error) {
          if(error.response){
          console.log(" = ", error.response);
          if(error.response.data == "undefined")
          alert("Restart the server "+error.response.data);
          }
          if(error.response){
            console.log(" = ", error.response);
            if(error.response.status == 401)
            alert(" "+error.response.data);
            }
            if(error.response){
              console.log(" = ", error.response);
              if(error.response.status == 404)
              alert(" "+error.response.data);
              }
          
        });
      }
      setValidated(true)
        // e.preventDefault();
    };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center bg-image">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm 
                   className="row g-3 needs-validation"
                   noValidate
                   validated={validated}
                   onSubmit={handleSubmit}
                   encType="multipart/form-data"
                  >
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput type="email" htmlFor="validationTooltip01" placeholder="Username" autoComplete="username" value={data.empEmail} required  onChange={emailhandler}  id="validationTooltip01"/>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        htmlFor="validationTooltip02"
                        id="validationTooltip02"
                        value={data.empPassword} 
                        required
                        onChange={passwordhandler}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={handleSubmit}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        {/* <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton> */}
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white py-5 brand-dark" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Welcome</h2>
                    <p>
                      Surround yourself with people who are only going to lift you higher! 
                    </p>
                    <Link to="/">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Home
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
