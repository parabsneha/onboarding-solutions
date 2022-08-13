import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import "../ViewData/ViewData.css";
import { Link, useParams } from "react-router-dom";
import { FaSave } from 'react-icons/fa'
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
import Editable from "../../components/Editable";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { FaStar } from "react-icons/fa";

const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9"

};


const ViewEmpTask = () => {

  const [task, setTask] = useState({
    task_id: '',
    date: '',
    type: '',
    topic: '',
    objective: '',
    category: '',
    personResponsible: '',
    estimatedTime: '',
    status: '',
    date: '',
    supervisorFeedbackComments: '',
  });

  const [assignmentTask, setAssignmentTask] = useState(false);
  const [sessionTask, setSessionTask] = useState(false);
  const [supFeedback, setSupFeedback] = useState("");
  const { id, userId } = useParams();
  const stars = Array(5).fill(0);

  console.log("task id", id);
  console.log("user from params", userId);
  var token;
  useEffect(() => {
    token = localStorage.getItem("token");
    console.log("token ", token);
    if (token) {
      var decoded = jwt_decode(token);
    }
    console.log("useEffect working");
    loadtask();
  }, []);

  const loadtask = async () => {
    const data = {
      user_id: userId,
      task_id: id
    }
    console.log("data in load task ", data);
    var config = {
      method: 'post',
      url: 'http://localhost:3003/hr/viewUserTask',
      headers: {
        'Authorization': `${token}`
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        setTask(response.data[0]);
        console.log("loadtask response ", response.data[0]);

        if (response.data[0].status == "completed") {
          if (response.data[0].type == "assignment") {
            setAssignmentTask(true);
            setSupFeedback(response.data[0].supervisorFeedbackComments);
          } else {
            setSessionTask(true);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const saveDetails = async () => {
    console.log("in save details ")
    const data1 = {
      user_id: userId,
      task_id: id,
      supervisorFeedbackComments: supFeedback
    };
    var config = {
      method: 'post',
      url: 'http://localhost:3003/employee/supervisorFeedback',
      headers: {
        'Authorization': `${token}`
      },
      data: data1
    };
    
    axios(config)
      .then(function (response) {
        console.log("save response ", response);       
        alert("Your changes have been saved");
        console.log("from save response feedbACK ", response.data.task.supervisorFeedbackComments);
        window.location.reload();
        // setSupFeedback(response.data.task.supervisorFeedbackComments);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <>
      <CCard>

        <div className="top">
          <div className="left">
            <div className="editButton">
              <CButton color="none" onClick={(e) => saveDetails(e)}><FaSave style={{ height: "auto", width: "2em" }} /></CButton>
              </div>
            <h1 className="title">Information</h1>

            <div className="item">


              <div className="details">
                <h5 className="itemTitle">{task.type}</h5>

                <div className="detailItem">
                  <span className="itemKey">Topic:</span>
                  <span className="itemValue">{task.topic}</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Objective:</span>
                  <span className="itemValue">{task.objective}</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Status:</span>
                  <span className="itemValue">{task.status}</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Date:</span>
                  <span className="itemValue">{task.date}</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Estimated time:</span>
                  <span className="itemValue">{task.estimatedTime}</span>
                </div>

                {assignmentTask ?
                  <div className="detailItem">
                    <span className="itemKey">Supervisor feedback: </span>
                    <span className="itemValue">
                      {/* {task.supervisorFeedbackComments} */}
                      <Editable
                        text={supFeedback}
                        placeholder="Write a Feedback"
                        type="textarea"
                      >
                        <textarea
                          className="itemValue"
                          type="textarea"
                          name="supervisorFeedbackComments"
                          placeholder="Write a feedback"
                          value={supFeedback}
                          onChange={e => setSupFeedback(e.target.value)}
                        ></textarea>
                        
                      </Editable>
                    </span>
                  </div> : null
                }

                {sessionTask ?
                  <>
                    {/* <div className="detailItem">
                      <span className="itemKey">Ratings:</span> */}
                      {/* <span className="itemValue">{task.sessionRating} </span> */}

                  
                      <div className="detailItem">
                        <div style={styles.stars}>
                          <span className="itemKey">Rating:</span>
                          {stars.map((_, index) => {
                            return (
                              <FaStar
                                key={index}
                                size={28}
                                color={(task.sessionRating) > index ? colors.orange : colors.grey}
                                style={{
                                  marginRight: 10,
                                  cursor: "pointer"
                                }}
                              />
                            )
                          })}
                        </div>
                      </div>
                     

                    {/* </div> */}
                    <div className="detailItem">
                      <span className="itemKey">Session Feedback</span>
                      <span className="itemValue">{task.sessionFeedbackComments} </span>
                    </div>
                  </>
                  : null
                }
               
              </div>

            </div>

          </div>
        </div>

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

export default ViewEmpTask