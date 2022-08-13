
import { Route, useNavigate } from "react-router-dom";
import React, { useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilImage,
} from '@coreui/icons'
import { Image } from 'cloudinary-react'

const Tooltips = () => {
  const [validated, setValidated] = useState(false);
  const [file, setFile] = useState("");

  const navigate = useNavigate();

  const [state, setState] = useState();
  const [teamVisibility, setTeamVisibility] = useState();
  // const [image, setImage] = useState();
  const [name, setName] = useState();
  const [imageSelected, setImageSelected] = useState("");
  const formData = new FormData();
  const [user, setUser,] = useState({
    empFirstName: '',
    empLastName: '',
    empEmail: '',
    role: '',
    empPosition: '',
    empTeam: '',
    gender: '',
    empContactNum: '',
    empPassword: '',
    empConfirmPass: '',
    profilePicture: ''
  });
  var imageurl;
  const { empFirstName, empLastName, empEmail, role, empPosition, profilePicture, empTeam, gender, empContactNum, empPassword, empConfirmPass } = user;

  const onInputChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value })
    console.log("position ", user);
    if (e.target.name == "role" && e.target.value == "employee") {
      console.log("user is employee ", role);
      setState(true);
      console.log(state);
    }
    if (e.target.name == "role" && e.target.value == "admin") {
      setState(false);
      console.log(state);
    }
    if (e.target.name == "empPosition" && e.target.value != "Hr" && e.target.value != "supervisor") {
      setTeamVisibility(true);
    } else {
      setTeamVisibility(false);
    }
    if (e.target.name == "empTeam") {
      setTeamVisibility(true);
      setState(true);
    }

  };

  const uploadImage = async () => {
    // const formData = new FormData();
    formData.append("file", imageSelected);
    formData.append("upload_preset", "o4vgyinu");

    // const result = await axios.post("https://api.cloudinary.com/v1_1/dw7junf8b/image/upload",formData);
    // console.log("url",result.data.secure_url);
    // console.log(result);
    // imageurl = result.data.secure_url;
    // console.log("variable imageurl", imageurl);
    // setName(result.data.secure_url);

  }
  const handleSubmit = async (event) => {
    uploadImage();
    console.log("role= ", role);

    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
      console.log("false validity");
    }
    else {
      event.preventDefault();
      console.log("user", user);
      console.log("image url", name);
      // const data = {
      //   empFirstName: empFirstName,
      //   empLastName: empLastName,
      //   empEmail: empEmail,
      //   role: role,
      //   empPosition: empPosition,
      //   empTeam: empTeam,
      //   gender: gender,
      //   empContactNum: empContactNum,
      //   empPassword: empPassword,
      //   empConfirmPass: empConfirmPass,
      //   profilePicture: imageurl
      // }
     
      if (user.empPassword === user.empConfirmPass) {
        const result = await axios.post("https://api.cloudinary.com/v1_1/dw7junf8b/image/upload", formData);
        console.log("url", result.data.secure_url);
        console.log(result);
        imageurl = result.data.secure_url;
        console.log("variable imageurl", imageurl);
        setName(result.data.secure_url);

        const data = {
          empFirstName: empFirstName,
          empLastName: empLastName,
          empEmail: empEmail,
          role: role,
          empPosition: empPosition,
          empTeam: empTeam,
          gender: gender,
          empContactNum: empContactNum,
          empPassword: empPassword,
          empConfirmPass: empConfirmPass,
          profilePicture: imageurl
        };
         console.log("data json", data);
        const serverResponse = await axios.post("http://localhost:3003/admin/add-employee", data);
        console.log(serverResponse.data);
         await navigate("/allUsers/user");
      }
      else {
        alert("passwords dont match");
      }
    }

    setValidated(true)
  }


  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <CCol md={4} style={{ marginTop: "16px" }}>
                <CFormLabel htmlFor="validationTooltip01">First Name</CFormLabel>
                <CFormInput type="text" id="validationTooltip01" name="empFirstName" value={empFirstName} required onChange={e => onInputChange(e)} />
              </CCol>
              <CCol md={4} style={{ marginTop: "16px" }}>
                <CFormLabel htmlFor="validationTooltip02">Last Name</CFormLabel>
                <CFormInput type="text" id="validationTooltip02" name="empLastName" value={empLastName} required onChange={e => onInputChange(e)} />
              </CCol>
              <CCol>
                <img
                  style={{ height: "120px", width: "120px" }}
                  src={
                    imageSelected
                      ? URL.createObjectURL(imageSelected)
                      : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt=""
                />
              </CCol>
              <CCol>
                <CFormLabel htmlFor="file" style={{ marginTop: "50px" }}>
                  Upload Image
                  <input
                    type="file"
                    name="profilePicture"
                    id="file"
                    onChange={(e) => setImageSelected(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </CFormLabel>

              </CCol>
            </CRow>
            <CRow>
              <CCol md={8}>
                <CFormLabel htmlFor="validationTooltip03">Email</CFormLabel>
                <CInputGroup className="mb-3 has-validation">
                  <CFormInput type="email" id="validationTooltip03" name="empEmail" value={empEmail} required onChange={e => onInputChange(e)} />
                  <CInputGroupText id="basic-addon2">@example.com</CInputGroupText>
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow>
              <CCol md={4} className="position-relative">
                <CFormLabel htmlFor="validationTooltip04">Password</CFormLabel>
                <CFormInput type="password" id="validationTooltip04" name="empPassword" value={empPassword} required onChange={e => onInputChange(e)} />
              </CCol>
              <CCol md={4} className="position-relative">
                <CFormLabel htmlFor="validationTooltip05">Confirm Password</CFormLabel>
                <CFormInput type="password" id="validationTooltip05" name="empConfirmPass" value={empConfirmPass} required onChange={e => onInputChange(e)} />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={4} className="position-relative">
                <CFormLabel htmlFor="validationTooltip06">Contact No.</CFormLabel>
                <CFormInput type="text" id="validationTooltip06" name="empContactNum" value={empContactNum} required onChange={e => onInputChange(e)} />
              </CCol>
            </CRow>
            <br />
            <CRow>
              <CCol>
                <CFormLabel>Gender</CFormLabel>
                <CFormCheck style={{ marginLeft: "10px" }}
                  type="radio"
                  name="gender"
                  value="female"
                  id="flexRadioDefault1"
                  label="Female"
                  // defaultChecked
                  onChange={e => onInputChange(e)}
                />
                <CFormCheck style={{ marginLeft: "10px" }}
                  type="radio"
                  name="gender"
                  value="male"
                  id="flexRadioDefault2"
                  label="Male"
                  onChange={e => onInputChange(e)}
                />
              </CCol>
              {/* </CRow>
          <br/>
          <CRow> */}
              <CCol>
                <CFormLabel >Role</CFormLabel>
                <CFormCheck style={{ marginLeft: "10px" }}
                  type="radio"
                  name="role"
                  value="admin"
                  id="flexRadioDefault1"
                  label="admin"
                  // defaultChecked
                  onChange={e => onInputChange(e)}
                />
                <CFormCheck style={{ marginLeft: "10px" }}
                  type="radio"
                  name="role"
                  value="employee"
                  id="flexRadioDefault2"
                  label="employee"
                  onChange={e => onInputChange(e)}
                />
              </CCol>
            </CRow>
            {state ?
              <CRow>
                <CCol md={4}>
                  <CFormLabel htmlFor="validationTooltip07">Position</CFormLabel>
                  <CFormSelect
                    name="empPosition"
                    value={empPosition}
                    onChange={e => onInputChange(e)}
                  >
                    <option>Select Position</option>
                    <option value="Developer">Developer</option>
                    <option value="QA">QA</option>
                    <option value="Hr">HR</option>
                    <option value="supervisor">Supervisor</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              : null}
            <br />
            {teamVisibility ?
              <CRow>
                <CCol md={4}>
                  <CFormLabel htmlFor="validationTooltip08">Team</CFormLabel>
                  <CFormSelect
                    name="empTeam"
                    value={empTeam}
                    onChange={e => onInputChange(e)}
                  >
                    <option>Select Team</option>
                    <option value="TeamA">TeamA</option>
                    <option value="TeamB">TeamB</option>
                    <option value="TeamC">TeamC</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              : null}
            <br />
            <CRow>
              <CCol xs={12} className="position-relative">
                <CButton color="primary" type="submit">
                  Add user
                </CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      </CForm>
  )
}

const Typography = () => {
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Add User</CCardHeader>
        <CCardBody>
          <CCardHeader>
          </CCardHeader>
          <CCardBody>
            {Tooltips()}
          </CCardBody>
        </CCardBody>
      </CCard>

    </>
  )
}

export default Typography
