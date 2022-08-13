import React, { useEffect, useState, createRef } from 'react'
import "./ViewData.css";
import "./styles.css";
import { Link, useParams } from "react-router-dom";
import { useRef } from 'react'
import { FaSave } from 'react-icons/fa'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTooltip,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CForm,
  CFormCheck,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import {
  cilPencil,
  cilTrash,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { Image } from 'cloudinary-react'
import jwt_decode from "jwt-decode";
import axios from "axios";
import Editable from "../../components/Editable";

const ViewDataAdmin = () => {

  const inputRef = useRef();
  const [task, setTask] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [team, setTeam] = useState("");
  const [user, setUser] = useState({
    empFirstName: "",
    empLastName: "",
    empEmail: "",
    empPosition: "",
    empTeam: "",
    empContactNum: "",
    role: ""
  });

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
  const [adminUser, setAdminUser] = useState(false);
  const [editTeam, setEditTeam] = useState(true);
  const positions = ["Hr", "supervisor"];


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

  const setEdittrue = async () => {
    setEdit(true);
    setSupervisor(false);
    setBuddy(false);
    setMentor(false);
  }
  const setSupervisortrue = async () => {
    setEdit(false);
    setSupervisor(true);
    setBuddy(false);
    setMentor(false);
    loadSupervisor();
  }

  const setBuddytrue = async () => {
    setEdit(false);
    setSupervisor(false);
    setBuddy(true);
    setMentor(false);
    loadBuddy();
  }

  const setMentortrue = async () => {
    setEdit(false);
    setSupervisor(false);
    setBuddy(false);
    setMentor(true);
    loadMentor();
  }

  const saveDetails = async () => {
    // token = localStorage.getItem("token");
    // console.log("token ", token);
    // if (token) {
    //   var decoded = jwt_decode(token);
    //   token_user = decoded.user_id;
    //   console.log("token id == ", token_user);
    // }
    var data = {
      _id: user._id,
      empPosition: position,
      empTeam: team,
    };
    console.log("user from save ", data);
    var config = {
      method: 'post',
      url: 'http://localhost:3003/admin/update-employee',
      data: data,
      // headers: {
      //   'Authorization': `${token}`
      // }
    };
    axios(config)
      .then(function (response) {
        alert("Your changes have been saved");
        setUser(response.data);
        const employee = response.data;
        console.log("= ", employee);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const { id } = useParams();
  useEffect(() => {
    console.log("useEffect working");
    loadUser();
    loadAssignedSupervisor();
    loadAssignedBuddy();
    loadAssignedMentor();
  }, []);
  const loadUser = async () => {
    console.log("loaduser");
    const res = await axios.post(`http://localhost:3003/admin/viewEmployee/${id}`);

    if (res.data.role != "admin") {
      setAdminUser(true);

    }
    if (positions.includes(res.data.position)) {
      setEditTeam(false);

    }
    setUser(res.data);
    setPosition(res.data.empPosition);
    setTeam(res.data.empTeam);

  };
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
  const loadSupervisor = async () => {
    const supervisorResult = await axios.post(`http://localhost:3003/admin/getSupervisorList/${id}`);
    setSupervisorList(supervisorResult.data);
    console.log("supervisorList", supervisorResult.data);
  };
  const loadBuddy = async () => {
    const buddyResult = await axios.post(`http://localhost:3003/admin/getSupervisorList/${id}`);
    setBuddyList(buddyResult.data);
    console.log("buddy List", buddyResult.data);
  };
  const loadMentor = async () => {
    const mentorResult = await axios.post(`http://localhost:3003/admin/getSupervisorList/${id}`);
    setMentorList(mentorResult.data);
    console.log("mentor List", mentorResult.data);
  };

  const deleteSupervisor = async (supervisorid) => {
    console.log("id to delete", supervisorid);
    const data = {
      empId: user._id,
      supervisorId: supervisorid
    }
    console.log("data to send", data);
    const config = {
      method: 'post',
      url: 'http://localhost:3003/admin/delete-supervisor',
      data: data,
      // headers: {
      //   'Authorization': `${token}`
      // }
    };
    axios(config)
      .then(function (response) {
        alert("Supervisor has been deleted");
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const assignSupervisor = async () => {
    const data = {
      empId: user._id,
      supervisorId: selectedSupervisor
    }
    console.log("data to send", data);
    const config = {
      method: 'post',
      url: 'http://localhost:3003/admin/assign-supervisor',
      data: data,
      // headers: {
      //   'Authorization': `${token}`
      // }
    };
    axios(config)
      .then(function (response) {
        alert("Supervisor has been assigned");
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };



  const assignBuddy = async () => {
    const data = {
      empId: user._id,
      buddyId: selectedBuddy
    }
    console.log("data to send", data);
    const config = {
      method: 'post',
      url: 'http://localhost:3003/admin/assign-buddy',
      data: data,
      // headers: {
      //   'Authorization': `${token}`
      // }
    };
    axios(config)
      .then(function (response) {
        alert("Buddy has been assigned");
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const assignMentor = async () => {
    const data = {
      empId: user._id,
      mentorId: selectedMentor
    }
    console.log("data to send", data);
    const config = {
      method: 'post',
      url: 'http://localhost:3003/admin/assign-mentor',
      data: data,
      // headers: {
      //   'Authorization': `${token}`
      // }
    };
    axios(config)
      .then(function (response) {
        alert("Mentor has been assigned");
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <div>
        <CCard>
          <div className="editButton"><CButton color="none" onClick={(e) => saveDetails(e)}><FaSave style={{ height: "auto", width: "2em" }} /></CButton></div>
          <h1 className="title">Information</h1>
          <CRow>
            <CCol xs={12} sm={6} lg={4}>
              <CCard>
                <Image cloudName="dw7junf8b" publicId={user.profilePicture} className="itemImg" />
                <div className="details">
                  <h3 className="itemTitle">{user.empFirstName} {user.empLastName}</h3>

                  <div className="detailItem">
                    <span className="itemKey" style={{ flexWrap: 'wrap' }}>Email:</span>
                    <span className="itemValue">{user.empEmail}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Phone:</span>
                    <span className="itemValue">{user.empContactNum}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Gender:</span>
                    <span className="itemValue">{user.gender}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Role:</span>
                    <span className="itemValue">{user.role}</span>
                  </div>
                </div>
              </CCard>
            </CCol>
            <CCol xs={12} sm={6} lg={8}>
              <CCard>
                {adminUser ?
                  <CRow>
                    <CCol className="d-grid gap-2">
                      <CButton onClick={() => setEdittrue()} color="secondary" variant="outline" style={{ marginTop: "10px", marginLeft: "10px" }}>Edit</CButton>
                    </CCol>

                 
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
                  : null}
                <CCardBody>
                  {edit ?
                    <CCard>
                      {adminUser ?
                        <div>

                          <div className="detailItem">
                            <span className="itemKey" style={{ fontSize: "16px" }}>Position:</span>
                            <Editable
                              text={position}
                              placeholder="select position"
                              type="select"
                            >
                              <select
                                type="text"
                                name="task"
                                placeholder="select position"
                                value={position}
                                onChange={e => setPosition(e.target.value)}
                                defaultValue="Select position"
                              >
                                <option defaultValue>select position</option>
                                <option value="Developer">Developer</option>
                                <option value="QA">QA</option>
                                <option value="Hr">HR</option>
                                <option value="supervisor">Supervisor</option>
                              </select>
                            </Editable>
                          </div>
                          {editTeam ?
                            <div className="detailItem">
                              <div className="itemKey" style={{ fontSize: "16px" }}>Team: </div>
                              <Editable
                                text={team}
                                placeholder="select a team"
                                type="select"
                              >
                                <select
                                  type="text"
                                  name="team"
                                  placeholder="select a team"
                                  value={team}
                                  onChange={e => setTeam(e.target.value)}
                                  defaultValue="Select team"
                                >
                                  <option defaultValue>select team</option>
                                  <option value="TeamA">TeamA</option>
                                  <option value="TeamB">TeamB</option>
                                  <option value="TeamC">TeamC</option>
                                </select>
                              </Editable>
                            </div>
                            : null}
                        </div>
                        : null}
                    </CCard>
                    : null
                  }
                  {
                    supervisor ?
                      <CCard style={{ marginTop: "0" }}>
                        <CRow>
                          <CCol>
                            <CFormLabel htmlFor="validationTooltip08"><b>Supervisor</b></CFormLabel>
                            <CFormSelect
                              name="supervisor"
                              value={selectedSupervisor}
                              onChange={e => onInputChange(e)}
                            >
                              <option>Select employee</option>
                              {supervisorList.map((supervisorList, index) => (
                                <>
                                  <option value={supervisorList.supervisorId}>{supervisorList.supervisorName}</option>
                                </>
                              ))}

                            </CFormSelect>
                          </CCol>
                          <CCol>
                            <CButton onClick={() => assignSupervisor()} color="secondary" variant="outline" style={{ marginTop: "32px" }}>Assign</CButton>
                          </CCol>
                        </CRow>
                        {/* </CCardBody> */}
                        <br />
                        <CTable striped>
                          <CTableBody>
                            {assignedSupList.map((supervisor, index) => (
                              <CTableRow>
                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                <CTableDataCell colSpan="2">{supervisor.supervisor}</CTableDataCell>
                                <CTableDataCell colSpan="2">{supervisor.date}</CTableDataCell>
                                <CTableDataCell colSpan="2" className="cellAction">
                                  <div className="cellAction">
                                    <CTooltip
                                      content="Delete"
                                      placement="top"
                                    >
                                      <CButton
                                        color="none"
                                        className="deleteButton"
                                        onClick={() => deleteSupervisor(supervisor.supervisor_id)}
                                      >
                                        <CIcon icon={cilTrash} className="me-2" />
                                      </CButton>
                                    </CTooltip>
                                  </div>

                                </CTableDataCell>
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
                            <CFormLabel htmlFor="validationTooltip08"><b>Buddy</b></CFormLabel>
                            <CFormSelect
                              name="buddy"
                              value={selectedBuddy}
                              onChange={e => onInputChange(e)}
                            >
                              <option>Select Buddy</option>
                              {supervisorList.map((supervisorList, index) => (
                                <>
                                  <option value={supervisorList.supervisorId}>{supervisorList.supervisorName}</option>
                                </>
                              ))}
                            </CFormSelect>
                          </CCol>
                          <CCol>
                            <CButton onClick={() => assignBuddy()} color="secondary" variant="outline" style={{ marginTop: "32px" }}>Assign</CButton>
                          </CCol>
                        </CRow>
                        {/* </CCardBody> */}
                        <br />
                        <CTable striped>
                          <CTableBody>
                            {assignedBuddyList.map((buddy, index) => (
                              <CTableRow>
                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                <CTableDataCell colSpan="2">{buddy.buddy}</CTableDataCell>
                                <CTableDataCell colSpan="2">{buddy.date}</CTableDataCell>
                                <CTableDataCell colSpan="2" className="cellAction">
                                  <div className="cellAction">
                                    <CTooltip
                                      content="Delete"
                                      placement="top"
                                    >
                                      <CButton
                                        color="none"
                                        className="deleteButton"
                                      // onClick={() => handleDelete(user._id)}
                                      >
                                        <CIcon icon={cilTrash} className="me-2" />
                                      </CButton>
                                    </CTooltip>
                                  </div>

                                </CTableDataCell>
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
                            <CFormLabel htmlFor="validationTooltip08"><b>Mentor</b></CFormLabel>
                            <CFormSelect
                              name="mentor"
                              value={selectedMentor}
                              onChange={e => onInputChange(e)}
                            >
                              <option>Select Mentor</option>
                              {supervisorList.map((supervisorList, index) => (
                                <>
                                  <option value={supervisorList.supervisorId}>{supervisorList.supervisorName}</option>
                                </>
                              ))}
                            </CFormSelect>
                          </CCol>
                          <CCol>
                            <CButton onClick={() => assignMentor()} color="secondary" variant="outline" style={{ marginTop: "32px" }}>Assign</CButton>
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
                                <CTableDataCell colSpan="2" className="cellAction">
                                  <div className="cellAction">
                                    <CTooltip
                                      content="Delete"
                                      placement="top"
                                    >
                                      <CButton
                                        color="none"
                                        className="deleteButton"
                                      // onClick={() => handleDelete(user._id)}
                                      >
                                        <CIcon icon={cilTrash} className="me-2" />
                                      </CButton>
                                    </CTooltip>
                                  </div>

                                </CTableDataCell>
                              </CTableRow>
                            ))}
                          </CTableBody>
                        </CTable>
                      </CCard>
                      : null
                  }
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCard>
      </div>

    </>
  );
}

export default ViewDataAdmin