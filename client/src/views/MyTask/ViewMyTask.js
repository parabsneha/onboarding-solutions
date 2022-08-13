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

import jwt_decode from "jwt-decode";
import axios from "axios";
import Editable from "../../components/Editable";

import { FaStar } from "react-icons/fa";

const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9"

};

const ViewMyTask = () => {

  const [task, setTask] = useState({
    date: '',
    type: '',
    topic: '',
    objective: '',
    category: '',
    personResponsible: '',
    estimatedTime: ''
  });

  var token;
  const [assignmentTask, setAssignmentTask] = useState(false);
  const [sessionTask, setSessionTask] = useState(false);
  const [sessionFeedback, setSessionFeedback] = useState("");
  const [sessionRating, setSessionRating] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const { id } = useParams();

  const [currentValue, setCurrentValue] = useState();
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(5).fill(0)

  const handleClick = value => {
    setCurrentValue(value)
    console.log("CurrentValue", currentValue);
  }

  const handleMouseOver = newHoverValue => {
    setHoverValue(newHoverValue)
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined)
  };

  var user_id;

  useEffect(() => {
    console.log("useEffect working");
    token = localStorage.getItem("token");
    setSessionRating(token);
    console.log("token ", token);
    if (token) {
      var decoded = jwt_decode(token);
      console.log("decoded data", decoded.user_id);
      user_id = decoded.user_id;
    }
    console.log("useEffect working");
    loadtask();
  }, []);
  const loadtask = async () => {
    console.log("token in load fnction", token);
    var config = {
      method: 'post',
      url: `http://localhost:3003/employee/getTaskByIdEmp/${id}`,
      headers: {
        'Authorization': `${token}`
      },
    };

    axios(config)
      .then(function (response) {
        setTask(response.data[0]);
        console.log("loadtask response ", response.data[0]);
        setTaskStatus(response.data[0].status);
        if (response.data[0].status == "completed") {
          if (response.data[0].type == "assignment") {
            setAssignmentTask(true);
          } else {
            setSessionFeedback(response.data[0].sessionFeedbackComments);
            setCurrentValue(response.data[0].sessionRating);
            setSessionTask(true);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const saveDetails = async () => {
    console.log("token in save function ", sessionRating);
    console.log("status in savedetails ", taskStatus);
    const data1 = {
      user_id: user_id,
      task_id: id,
      sessionFeedbackComments: sessionFeedback,
      status: taskStatus,
      sessionRating: currentValue
    };

    var config = {
      method: 'post',
      url: 'http://localhost:3003/employee/editTask',
      headers: {
        'Authorization': sessionRating
      },
      data: data1
    };

    axios(config)
      .then(function (response) {
        console.log("save response ", response);
        alert("Your changes have been saved");
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
                  <span className="itemKey">Person Responsible:</span>
                  <span className="itemValue">
                    {task.personResponsible}
                  </span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Estimated time:</span>
                  <span className="itemValue">{task.estimatedTime} Hrs</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Status:</span>
                  <span className="itemValue">
                    <Editable
                      text={taskStatus}
                      placeholder="select status"
                      type="select"
                    >
                      <select
                        type="text"
                        name="status"
                        placeholder="select status"
                        value={taskStatus}
                        onChange={e => setTaskStatus(e.target.value)}
                        defaultValue="Select status"
                      >
                        <option defaultValue>select status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </Editable>
                  </span>
                </div>

                {assignmentTask ?
                  <div className="detailItem">
                    <span className="itemKey">Supervisor Feedback Comments:</span>
                    <span className="itemValue">{task.supervisorFeedbackComments} </span>
                  </div>
                  : null
                }

                {sessionTask ?
                  <>
                    <div className="detailItem">
                      <span className="itemKey">Session Feedback:</span>
                      <span className="itemValue">
                        <Editable
                          text={sessionFeedback}
                          placeholder="Write a Feedback"
                          type="textarea"
                        >
                          <textarea
                            className="itemValue"
                            type="textarea"
                            name="sessionFeedbackComments"
                            placeholder="Write a feedback"
                            value={sessionFeedback}
                            onChange={e => setSessionFeedback(e.target.value)}
                          ></textarea>
                        </Editable>
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Ratings:</span>
                      <div style={styles.stars}>
                        {stars.map((_, index) => {
                          return (
                            <FaStar
                              key={index}
                              size={24}
                              onClick={() => handleClick(index + 1)}
                              onMouseOver={() => handleMouseOver(index + 1)}
                              onMouseLeave={handleMouseLeave}
                              color={(hoverValue || currentValue) > index ? colors.orange : colors.grey}
                              style={{
                                marginRight: 10,
                                cursor: "pointer"
                              }}
                            />
                          )
                        })}
                      </div>


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

export default ViewMyTask