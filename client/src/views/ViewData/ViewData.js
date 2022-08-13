import React, { useEffect, useState, createRef } from 'react'
import "./ViewData.css";
import { Link, useParams } from "react-router-dom";
// import Editable from "./Editable";
import { useRef } from 'react'
import { FaSave } from 'react-icons/fa'
import {
  CCard,
  CAlert,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAvatar,
  CTable,
  CFormSelect,
  CFormLabel,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton

} from '@coreui/react'
import { Image } from 'cloudinary-react'
import jwt_decode from "jwt-decode";
import axios from "axios";
import Editable from "../../components/Editable";

const ViewData = () => {

  const [assignedSupList, setAssignedSupList] = useState([]);
  const [assignedBuddyList, setAssignedBuddyList] = useState([]);
  const [assignedMentorList, setAssignedMentorList] = useState([]);
  const [supervisorList, setSupervisorList] = useState([]);
  const [buddyList, setBuddyList] = useState([]);
  const [mentorList, setMentorList] = useState([]);
  const [edit, setEdit] = useState(true);
  const [supervisor, setSupervisor] = useState(false);
  const [buddy, setBuddy] = useState(false);
  const [mentor, setMentor] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedBuddy, setSelectedBuddy] = useState("");

  const inputRef = useRef();
  const [task, setTask] = useState("");
  const [inHover, setHover] = useState(false);
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [profilePicture, setprofilePicture] = useState("");
  const [contactNum, setcontactNum] = useState("");
 const [profilePic, setProfilePic] = useState(false);


  const onInputChange = e => {

    if (e.target.name == "supervisor") {
      console.log("supervisor is set ");
      setSelectedSupervisor(e.target.value);
      console.log(selectedSupervisor);
    }
    if (e.target.name == "buddy") {
      console.log("buddy is set ");
      setSelectedBuddy(e.target.value);
      console.log(setSelectedBuddy);
    }
    if (e.target.name == "mentor") {
      console.log("supervisor is set ");
      setSelectedMentor(e.target.value);
      console.log(setSelectedMentor);
    }
  };


  const setSupervisortrue = async () => {
    setSupervisor(true);
    setBuddy(false);
    setMentor(false);
    loadSupervisor();
  }

  const setBuddytrue = async () => {

    setSupervisor(false);
    setBuddy(true);
    setMentor(false);
    loadBuddy();
  }

  const setMentortrue = async () => {

    setSupervisor(false);
    setBuddy(false);
    setMentor(true);
    loadMentor();
  }


  const [user, setUser] = useState({
    empFirstName: "",
    empLastName: "",
    empEmail: "",
    empPosition: "",
    empTeam: "",
    empContactNum: "",
    role: "",
    gender: "",
    profilePicture: "",
    empPassword: "",
  });


  const { id } = useParams();
  useEffect(() => {
    console.log("useEffect working");
    loadUser();
    loadAssignedSupervisor();
    loadAssignedBuddy();
    loadAssignedMentor();
  }, []);



  let token_user;
  var employee;
  var token;

  const loadAssignedSupervisor = async () => {
    const resSupervisor = await axios.post(`http://localhost:3003/admin/getEmpSupervisor/${id}`);
    setAssignedSupList(resSupervisor.data);
    console.log("supervisorList", resSupervisor.data);
  };
  const loadAssignedBuddy = async () => {
    const resBuddy = await axios.post(`http://localhost:3003/admin/getEmpBuddy/${id}`);
    setAssignedBuddyList(resBuddy.data);
    console.log("Buddy List", resBuddy.data);
  };
  const loadAssignedMentor = async () => {
    const resMentor = await axios.post(`http://localhost:3003/admin/getEmpMentor/${id}`);
    setAssignedMentorList(resMentor.data);
    console.log("supervisorList", resMentor.data);
  };
  const saveDetails = async () => {
    token = localStorage.getItem("token");
    console.log("token ", token);
    if (token) {
      var decoded = jwt_decode(token);
      token_user = decoded.user_id;
      console.log("token id == ", token_user);
    }
    // user["empEmail"] = email;
    // user["empContactNum"] = contactNum;

    const data = {
      empFirstName: user.empFirstName,
      empLastName: user.empLastName,
      empEmail: email,
      gender: gender,
      empContactNum: contactNum,
      empPassword: user.empPassword,
    };
    console.log("user from save ", data);
    var config = {
      method: 'post',
      url: 'http://localhost:3003/employee/update',
      data: data,
      headers: {
        'Authorization': `${token}`
      }
    };
    axios(config)
      .then(function (response) {
        setUser(response.data);
        employee = response.data;
        console.log("= ", employee);
        alert("Your changes have been saved");
      })
      .catch(function (error) {
        console.log(error);
      });
    // const res = await axios.post("http://localhost:3003/employee/update");
  }

  const loadUser = async () => {
    console.log("loaduser");
    const res = await axios.post(`http://localhost:3003/admin/viewEmployee/${id}`);
    setUser(res.data);
    setEmail(res.data.empEmail);
    setcontactNum(res.data.empContactNum);
    setGender(res.data.gender);
    setprofilePicture(res.data.profilePicture);
    if(res.data.profilePicture){
      setProfilePic(true);
    }
    console.log("response", res.data);
    console.log("user", user);
  };

  const HoverEvent = () => {
    setHover(true);
  }

  return (
    <>
      <CCard>
        <div className="top">
          <div className="left">
            <div className="editButton">
              <CButton color="none" onClick={(e) => saveDetails(e)}><FaSave style={{ height: "auto", width: "2em" }} /></CButton></div>
            <h1 className="title">Information</h1>

            <div className="item">
              {profilePic ? 
              <Image cloudName="dw7junf8b" publicId={user.profilePicture} className="itemImg" onMouseEnter={() => HoverEvent()} onMouseLeave={() => setHover(false)} />
             :<img style={{ width: "200px", height: "200px"}}  src="https://events.powercommunity.com/wp-content/uploads/2020/07/profile-placeholder.jpg"/>} 
              <div className="details">
              </div>
              <div className="details">
                <h1 className="itemTitle">{user.empFirstName} {user.empLastName}</h1>

                <div className="detailItem">
                  <span className="itemKey">Email:</span>

                  <span className="itemValue">{user.empEmail}</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <Editable
                    text={contactNum}
                    placeholder="Enter contact number"
                    type="input"
                  >
                    <input className="itemValue"
                      type="text"
                      name="contactNum"
                      placeholder="Enter contact number"
                      value={contactNum}
                      onChange={e => setcontactNum(e.target.value)}
                    />
                  </Editable>

                </div>

                <div className="detailItem">
                  <span className="itemKey">Position:</span>
                  <span className="itemValue">
                    {user.empPosition}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Role:</span>
                  <span className="itemValue">{user.role}</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Gender:</span>
                  <Editable
                    text={gender}
                    placeholder="Enter your gender"
                    type="select"
                  >
                    <select
                      type="text"
                      name="gender"
                      placeholder="enter your gender"
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      defaultValue="Select gender"
                    >
                      <option defaultValue>select employee</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </Editable>
                </div>

              </div>

            </div>

          </div>
        </div>

      </CCard>
      <hr/>
      <CCard>
        <CCardBody>

          <CRow>

            <CCol className="d-grid gap-2">
              <CButton onClick={() => setSupervisortrue()} color="secondary" variant="outline" style={{ marginTop: "10px" }}>Supervisor</CButton>
            </CCol>
            <CCol className="d-grid gap-2">
              <CButton onClick={() => setBuddytrue()} color="secondary" variant="outline" style={{ marginTop: "10px" }}>Buddy</CButton>
            </CCol>
            <CCol className="d-grid gap-2">
              <CButton onClick={() => setMentortrue()} color="secondary" variant="outline" style={{ marginTop: "10px" }}>Mentor</CButton>
            </CCol>

          </CRow>
        </CCardBody>
        
        <CCardBody>
          <CCard>
         
            {
              supervisor ?
                <CCard style={{ marginTop: "0" }}>
                  <CRow>
                    <CCol>
                      <CFormLabel style={{ marginLeft: "43%", fontSize: "30px", fontWeight: "bold" }}>Supervisors</CFormLabel>

                    </CCol>

                  </CRow>
                  {/* </CCardBody> */}
                 
                  <CTable striped>
                    <CTableBody>

                      {assignedSupList.map((supervisor, index) => (

                        <CTableRow>
                          <CTableHeaderCell colSpan="1" scope="row">{index + 1}</CTableHeaderCell>
                          <CTableDataCell colSpan="2">{supervisor.supervisor}</CTableDataCell>
                          <CTableDataCell colSpan="2">{supervisor.date}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>

               

                </CCard>
                : null
            }
            {
              buddy ?
                <CCard>
                  {/* <CCardBody> */}
                  <CRow>
                    <CCol>
                      <CFormLabel style={{ marginLeft: "43%", fontSize: "30px", fontWeight: "bold" }}>Buddy</CFormLabel>
                    </CCol>

                  </CRow>
                
                  <CTable striped>
                    <CTableBody>
                      {assignedBuddyList.map((buddy, index) => (
                        <CTableRow>
                          <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                          <CTableDataCell colSpan="2">{buddy.buddy}</CTableDataCell>
                          <CTableDataCell colSpan="2">{buddy.date}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCard>
                : null
            }
            {
              mentor ?
                <CCard>
                  {/* <CCardBody> */}
                  <CRow>
                    <CCol>
                      <CFormLabel style={{ marginLeft: "43%", fontSize: "30px", fontWeight: "bold" }}>Mentors</CFormLabel>

                    </CCol>

                  </CRow>
                  {/* </CCardBody> */}
                  <br />
                  <CTable striped>
                    <CTableBody>
                      {assignedMentorList.map((mentor, index) => (
                        <CTableRow>
                          <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                          <CTableDataCell colSpan="2">{mentor.mentor}</CTableDataCell>
                          <CTableDataCell colSpan="2">{mentor.date}</CTableDataCell>

                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCard>
                : null
            }


          </CCard>
        </CCardBody>
      </CCard>
    </>
  );
}

export default ViewData 