import React from 'react'
import './Login.css'
import axios from "axios";
import { Link , useNavigate } from "react-router-dom";
import { useState } from "react";
// import { Link } from 'react-router-dom'
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

const Login = () => {

  let [data, setData] = useState({ empEmail: "", empPassword: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
        
        e.preventDefault();
         try {
             data = await axios.post('http://localhost:3003/login', data);
             console.log("token = ",data.data.token);
             await localStorage.setItem("token", data.data.token);
             if(data.status === 200){
                navigate('/dashboard');
             }
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        }
        e.preventDefault();
    };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center bg-image">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" autoComplete="username" value={data.empEmail}  onChange={emailhandler}/>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={data.empPassword} 
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
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
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
                    <Link to="/landing">
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
