
import { Route, useNavigate } from "react-router-dom";
import React, { useState, useEffect} from 'react'
import axios from 'axios'
import TypeAheadDropDown from '../../components/TypeAheadDropDown';
// import Cities from './Cities.js'
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
import DatePicker from 'react-datepicker';

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
    estimatedTime:'',
    date:''
  });

var token;
  const { type, topic, objective, category, personResponsible, estimatedTime, date } = task;
  const list = [];
  useEffect(()=>{
    loadPersonResponsible();
  },[]);
  var i=0;
  const loadPersonResponsible = async () => {
    token = localStorage.getItem("token");

    var config = {
      method: 'post',
      url: "http://localhost:3003/admin/getPersonResponsible",
      headers: { 
        'Authorization': `${token}`
      }
     
    };
    
    axios(config)
    .then(function (result) {
      console.log("person resp List", result.data[0]);
    for (i=0;i<3;i++){
      list.push(
        result.data[i].employeeName
      );
    }
    console.log("the list",list);

    setPersonRespList(result.data);
    console.log("person resp List", result.data);
     
    })
    .catch(function (error) {
      console.log(error.response.data);
      const errorMsg = error.response.data;
      alert(" " + errorMsg);
    });
    // console.log("load person ");
    // const result = await axios.post("http://localhost:3003/admin/getPersonResponsible");
    // console.log("person resp List", result.data[0]);
    // for (i=0;i<3;i++){
    //   list.push(
    //     result.data[i].employeeName
    //   );
    // }
    // console.log("the list",list);

    // setPersonRespList(result.data);
    // console.log("person resp List", result.data);
  };
  const onInputChange = e => { 
    setTask({ ...task, [e.target.name]: e.target.value });
    if(e.target.name =="date"){
      console.log("the date", e.target.value);
    }
  };
  
  const handleSubmit = async (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false ) {
      event.preventDefault()
      event.stopPropagation()
      console.log("false validity");
    }
    else{
      token = localStorage.getItem("token");
      event.preventDefault();
      var config = {
        method: 'post',
        url: "http://localhost:3003/admin/add-generaltask",
        headers: { 
          'Authorization': `${token}`
        },
        data:task
       
      };
      
      axios(config)
      .then(function (response) {
        navigate("/task/viewAllTask");

      });

      // event.preventDefault();
      // console.log("task", task);
      //  const response = await axios.post("http://localhost:3003/admin/add-generaltask", task);
      //  console.log(response.data);
      //  navigate("/task/viewAllTask");
    }

    setValidated(true)
  }
  return (
    <>
   
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
                <CFormLabel htmlFor="validationTooltip01">Date</CFormLabel>
                <CFormInput type="date" id="validationTooltip13" name="date" value={date} required onChange={e => onInputChange(e)}/>
              </CCol>
          </CRow>
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
              <CFormLabel htmlFor="validationTooltip07">Person responsible</CFormLabel>
              <CFormSelect 
             
              name="personResponsible"
              value={personResponsible}
              onChange={e => onInputChange(e)}
              >
              <option>Select employee</option>
              {personRespList &&  personRespList.map((personRespList, index) => (
                    <>
                   <option value={personRespList.employeeId}>{personRespList.employeeName}</option>
                   </>
                 ))}
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
    </>
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
            {CreateTask()}
          </CCardBody>
        </CCardBody>
      </CCard>

    </>
  )
}

export default AddTask
