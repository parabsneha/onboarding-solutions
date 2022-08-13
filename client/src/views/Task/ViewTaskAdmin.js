import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import "../ViewData/ViewData.css";
import { Link, useParams } from "react-router-dom";
import ScrollArea from 'react-scrollbar';
import { FaSave } from 'react-icons/fa'
import Moment from 'react-moment';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton

} from '@coreui/react'
import ReactPaginate from 'react-paginate';
import jwt_decode from "jwt-decode";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import Editable from "../../components/Editable";
const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9"

};

const ViewTask = () => {

  const [task, setTask] = useState({
    date: '',
    type: '',
    topic: '',
    objective: '',
    category: '',
    estimatedTime: '',
    personResponsible:''
  });
  const [topic, setTopic] = useState("");
  const [objective, setObjective] = useState("");
  const [category, setCategory] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [personResponsible, setPersonResponsible] = useState("");

  const [personRespList, setPersonRespList] =  useState([]);
  const [ratingAvg, setRatingAvg] = useState([]);
  const [sessionInfo, setSessionInfo] = useState([]);
  const [currentValue, setCurrentValue] = useState(3);
  const [taskType, setTaskType] = useState(false);
  const stars = Array(5).fill(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState({
    empFirstName: "",
    empLastName: "",
    empEmail: "",
    empPosition: "",
    empTeam: "",
    empContactNum: "",
    role: ""
  });
  const list = [];
  var token;
  var i;
  let ratingArray = [];
  const { id } = useParams();
  useEffect(() => {
    token = localStorage.getItem("token");
    console.log("useEffect working");
    loadtask();
    loadPersonResponsible();
  }, []);

  const saveDetails = async () => {
    token = localStorage.getItem("token");
    // console.log("token ", token);
    // if (token) {
    //   var decoded = jwt_decode(token);
    //   token_user = decoded.user_id;
    //   console.log("token id == ", token_user);
    // }
    var data = {
      _id:id,
     topic: topic,
      type: type,
      date: date,
      objective: objective,
      category: category,
      personResponsible: personResponsible,
      estimatedTime: estimatedTime,

    };
    console.log("task from save ", data);
    var config = {
      method: 'post',
      url: `http://localhost:3003/admin/updateTask/${id}`,
      data: data,
      headers: {
        'Authorization': `${token}`
      }
    };
    axios(config)
      .then(function (response) {
        console.log("res.status",response.status);
        alert("Your changes have been saved");
        setUser(response.data);
        const employee = response.data;
        console.log("= ", employee);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  var i=0;
  const loadPersonResponsible = async () => {
    var config = {
      method: 'post',
      url:"http://localhost:3003/admin/getPersonResponsible",
   
      headers: {
        'Authorization': `${token}`
      }
    };
    axios(config)
      .then(function (response) {
         
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
        console.log(error);
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
  let taskData;
    const loadtask = async () => {
    console.log("loadtask");
    const res = await axios.post(`http://localhost:3003/admin/getTaskById/${id}`);
    // taskData = res.data;
   
    setTask(res.data);
    setTopic(res.data.topic);
    setDate(res.data.date);
    setType(res.data.type);
    setObjective(res.data.objective);
    setEstimatedTime(res.data.estimatedTime);
    setCategory(res.data.category);


    if (res.data.type == "session") {
      setTaskType(true);
    }
    console.log("response", res.data);
    console.log("task", task);

    const person = res.data.personResponsible;
    console.log("person ",person);
    const resp = await axios.post(`http://localhost:3003/admin/viewEmployee/${person}`);
    setUser(resp.data);
    const userName = resp.data.empFirstName + " " +  resp.data.empLastName;
    setPersonResponsible(userName);
    console.log("USER ",user);
  };


  const handlePageClick = (event) => {
    console.log("selected ", event.selected + 1);
    setCurrentPage(event.selected + 1);
  };

  return (
    <>
      <CCard>
     

        <CCardBody>
          <div className="top">
            <div className="left">
              <h1 className="title">Admin Information</h1>

              <div className="item">
                <div className="details">
                  <h5 className="itemTitle">{task.type}</h5>
                 

                  <div className="detailItem">
                    <span className="itemKey">Date:</span>
                    <span className="itemValue">{<Moment format="DD/MM/YYYY">{task.date}</Moment>}</span>
                    {/* <Editable
          text= {<Moment format="DD/MM/YYYY">{task.date}</Moment> }

          placeholder="Enter Date"
          type="input"
        >
          <input
            type="date"
            name="date"
            placeholder="Enter Date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </Editable> */}
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Topic:</span>
                    {/* <span className="itemValue">{task.topic}</span> */}
                    <Editable
          text={topic}
          placeholder="Enter Topic"
          type="input"
        >
          <input
            type="text"
            name="topic"
            placeholder="Enter Topic"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
        </Editable>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Objective:</span>
                    {/* <span className="itemValue">{task.objective}</span> */}
                    <Editable
          text={objective}
          placeholder="Enter Objective"
          type="input"
        >
          <textarea
          cols="45"
            type="text"
            name="objective"
            placeholder="Enter Objective"
            value={objective}
            onChange={e => setObjective(e.target.value)}
          />
        </Editable>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Category:</span>
                    {/* <span className="itemValue">{task.category} </span> */}
                    <Editable
                      text={category}
                      placeholder="select category"
                      type="select"
                    >
                      <select
                        type="text"
                        name="category"
                        placeholder="select category"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        defaultValue="Select category"
                      >
                        <option defaultValue>select category</option>
                        <option value="Hr">HR</option>
                        <option value="IT">IT</option>
                        <option value="General">General</option>
                      </select>
                    </Editable>
                  </div>

                 
                  <div className="detailItem">
                    <span className="itemKey">Person Responsible:</span>
                    <span className="itemValue">{user.empFirstName} {user.empLastName}</span>
                    {/* <Editable
                      text={personResponsible}
                      placeholder="select person responsible"
                      type="select"
                    >
                      <select
                        type="text"
                        name="category"
                        placeholder="select person responsible"
                        value={personResponsible}
                        onChange={e => setPersonResponsible(e.target.value)}
                        defaultValue="Select employee"
                      >
                        <option defaultValue>select employee</option>
                        {personRespList &&  personRespList.map((personRespList, index) => (
                    <>
                   <option value={personRespList.employeeId}>{personRespList.employeeName}</option>
                   </>
                 ))}
                       </select>
                    </Editable> */}
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Estimated time:</span>
                    {/* <span className="itemValue">{task.estimatedTime} Hrs</span> */}
                    <Editable
          text={estimatedTime}
          placeholder="Enter Estimated Time"
          type="input"
        >
          <input
            type="number"
            name="estimatedTime"
            placeholder="Enter Estimated Time"
            value={estimatedTime}
            onChange={e => setEstimatedTime(e.target.value)}
          />
        </Editable>
                  </div>
                  {/* {
                    taskType ?
                      <div className="detailItem">
                        <div style={styles.stars}>
                          <span className="itemKey">Average Rating:</span>
                          {stars.map((_, index) => {
                            return (
                              <FaStar
                                key={index}
                                size={28}
                                color={(ratingAvg) > index ? colors.orange : colors.grey}
                                style={{
                                  marginRight: 10,
                                  cursor: "pointer"
                                }}
                              />
                            )
                          })}
                        </div>
                      </div>
                      : null
                  } */}

                </div>

              </div>

            </div>
          </div>
        </CCardBody>
        <CCardBody>
          <div style={{height:"120px", overflow:"auto"}}>
          <CTable striped >
            <CTableBody>
         
              {sessionInfo.map((session, index) => (
                <CTableRow>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell colSpan="2">{session.empName}</CTableDataCell>
                  <CTableDataCell colSpan="2">{session.sessionFeedbackComments}</CTableDataCell>
                  <CTableDataCell colSpan="2">
                    <div style={styles.stars}>
                      {stars.map((_, index) => {
                        return (
                          <FaStar
                            key={index}
                            size={24}
                            color={(session.sessionRating) > index ? colors.orange : colors.grey}
                            style={{
                              marginRight: 10,
                              cursor: "pointer"
                            }}
                          />
                        )
                      })}
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}              
            </CTableBody>
          </CTable>
          </div>
        </CCardBody>
      </CCard>
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  stars: {
    display: "flex",
    flexDirection: "row",
  },
  textarea: {
    border: "1px solid #a9a9a9",
    borderRadius: 5,
    padding: 10,
    margin: "20px 0",
    minHeight: 100,
    width: 300
  },
  button: {
    border: "1px solid #a9a9a9",
    borderRadius: 5,
    width: 300,
    padding: 10,
  }

};


export default ViewTask