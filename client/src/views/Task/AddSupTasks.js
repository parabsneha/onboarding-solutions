
import { Route, useNavigate } from "react-router-dom";
import React, { useState, useEffect} from 'react'
import axios from 'axios'
// import { Typeahead } from 'react-bootstrap-typeahead'; 
 
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
  const navigate = useNavigate();
  const [personRespList, setPersonRespList] =  useState([]);
  const [task, setTask, ] = useState({
    type: '',
    topic: '',
    objective: '',
    category:'',
    personResponsible:' ',
    estimatedTime:''
  });

  const { type, topic, objective, category, personResponsible, estimatedTime } = task;

  useEffect(()=>{
    loadPersonResponsible();
  },[]);
  
  const loadPersonResponsible = async () => {
    console.log("load person ");
    const result = await axios.post("http://localhost:3003/admin/getPersonResponsible");
    const list = [];
    // list = result.data;
    // list.push
    setPersonRespList(result.data);
    console.log("person resp List", result.data);
  };
  const onInputChange = e => { 
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false ) {
      event.preventDefault()
      event.stopPropagation()
      console.log("false validity");
    }
    else{
      event.preventDefault();
      console.log("task", task);
       const response = await axios.post("http://localhost:3003/admin/add-generaltask", task);
       console.log(response.data);
       navigate("/task/viewAllTask");
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
                <CFormInput type="text" id="validationTooltip05" name="topic" value={topic} required onChange={e => onInputChange(e)}/>
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
              <CFormLabel htmlFor="exampleFormControlTextarea1">Objective</CFormLabel>
                  <CFormTextarea id="exampleFormControlTextarea1" rows="3" name="objective" value={objective} onChange={e => onInputChange(e)}></CFormTextarea>
              </CCol>
              <CCol md={4}  style={{ marginTop : "25px" }}>
                <CFormLabel htmlFor="validationTooltip01">Estimated time (in Hrs)</CFormLabel>
                <CFormInput type="number" id="validationTooltip05" name="estimatedTime" value={estimatedTime} required onChange={e => onInputChange(e)}/>
              </CCol>
              <CCol md={4}  style={{ marginTop : "25px" }}>
              <CFormLabel htmlFor="validationTooltip07">Assigned to:</CFormLabel>
              <CFormSelect 
              name="personResponsible"
              value={personResponsible}
              onChange={e => onInputChange(e)}
              >
                 {/* <Typeahead > */}
              <option>Select employee</option>
              {personRespList &&  personRespList.map((personRespList, index) => (
                    <>
                   
                   <option value={personRespList.employeeId}>{personRespList.employeeName}</option>
                  
                   </>
                 ))}
                  {/* </Typeahead> */}
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

const AddSupTasks = () => {
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Add Task</CCardHeader>
        <CCardBody>
          <CCardHeader>
          </CCardHeader>
          <CCardBody>
            {CreateTask()}
          </CCardBody>
        </CCardBody>
      </CCard>

    </>
  )
}

export default AddSupTasks
