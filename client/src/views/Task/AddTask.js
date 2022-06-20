
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


const CreateTask = () => {
  const [validated, setValidated] = useState(false);
//   const [file, setFile] = useState("");

  const navigate = useNavigate();

//   const [state, setState] = useState();
//   const [teamVisibility, setTeamVisibility] = useState();
//   const [image, setImage] = useState();
//   const [name, setName] = useState();
  const [task, setTask, ] = useState({
    type: '',
    topic: '',
    objective: '',
    category:'',
    personResponsible:'',
    estimatedTime:''
  });

  const { type, topic, objective, category, personResponsible, estimatedTime } = task;

  const onInputChange = e => { 
    setTask({ ...task, [e.target.name]: e.target.value })
  };
  

  const handleSubmit = async (event) => {
    // console.log("role= ", role);

    const form = event.currentTarget
    if (form.checkValidity() === false ) {
      event.preventDefault()
      event.stopPropagation()
      console.log("false validity");
    }
    else{
      event.preventDefault();
      console.log("task", task);
       const response = await axios.post("http://localhost:3003/admin/add-employee", task);
       console.log(response.data);
       await navigate("/task/viewAllTask");
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
      <CCol xs={12} >
        <CCard className="mb-4">
          <CCardBody>
            <CRow>
              <CCol md={4}>
                <CFormLabel htmlFor="validationTooltip01">Topic</CFormLabel>
                <CFormInput type="text" id="validationTooltip05" name="empFirstName" value={topic} required onChange={e => onInputChange(e)}/>
              </CCol>
              <CCol md={4}>
              <CFormLabel htmlFor="validationTooltip07">Type</CFormLabel>
              <CFormSelect 
              name="type"
              value={type}
              onChange={e => onInputChange(e)}
              >
              <option>Select Type</option>
              <option value="session">Session</option>
              <option value="assignment">Assignment</option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="validationTooltip07">Category</CFormLabel>
              <CFormSelect 
              name="category"
              value={category}
              onChange={e => onInputChange(e)}
              >
              <option>Select category</option>
              <option value="Hr">HR</option>
              <option value="IT">IT</option>
              <option value="General">General</option>
              </CFormSelect>
            </CCol>
            </CRow>
            <CRow>
              <CCol md={4}>
              <CFormLabel htmlFor="exampleFormControlTextarea1">Example textarea</CFormLabel>
                  <CFormTextarea id="exampleFormControlTextarea1" rows="3"></CFormTextarea>
              </CCol>
              <CCol md={4}  style={{ marginTop : "25px" }}>
                <CFormLabel htmlFor="validationTooltip01">Estimated time (in Hrs)</CFormLabel>
                <CFormInput type="number" id="validationTooltip05" name="estimatedTime" value={estimatedTime} required onChange={e => onInputChange(e)}/>
              </CCol>
              <CCol md={4}  style={{ marginTop : "25px" }}>
              <CFormLabel htmlFor="validationTooltip07">Person responsible</CFormLabel>
              <CFormSelect 
              name="personResponsible"
              value={personResponsible}
              onChange={e => onInputChange(e)}
              >
              <option>Select</option>
              <option value="session">Session</option>
              <option value="assignment">Assignment</option>
              </CFormSelect>
            </CCol>
            </CRow>
          </CCardBody>
        </CCard>
              <CCol xs={12} className="position-relative">
                  <CButton color="primary" type="submit">
                      Add task
                  </CButton>
              </CCol>
      </CCol>
    </CForm>
  )
}

const AddTask = () => {
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Add Task</CCardHeader>
        <CCardBody>
          <CCardHeader>
          </CCardHeader>
          <CCardBody>
            {/* <DocsExample>{Tooltips()}</DocsExample> */}
            {CreateTask()}
          </CCardBody>
        </CCardBody>
      </CCard>

    </>
  )
}

export default AddTask
