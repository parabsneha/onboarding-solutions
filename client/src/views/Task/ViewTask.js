import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import "../ViewData/ViewData.css";
import { Link, useParams } from "react-router-dom";
import ScrollArea from 'react-scrollbar';
import Moment from 'react-moment'
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
    estimatedTime: '',
    personResponsible: ''
  });
  const [ratingAvg, setRatingAvg] = useState([]);
  const [sessionInfo, setSessionInfo] = useState([]);
  const [currentValue, setCurrentValue] = useState(3);
  const [taskType, setTaskType] = useState(false);
  const stars = Array(5).fill(0);
  const [currentPage, setCurrentPage] = useState(1);

  var token;
  var i;
  let ratingArray = [];
  const { id } = useParams();
  useEffect(() => {
    token = localStorage.getItem("token");
    console.log("useEffect working");
    loadtask();
  }, []);

  useEffect(() => {
    loadSessionInfo();
  }, [currentPage]);

  let taskData;
  const loadtask = async () => {
    console.log("loadtask");
    token = localStorage.getItem("token");
    var config = {
      method: 'post',
      url: `http://localhost:3003/employee/getTaskById/${id}`,
      headers: {
        'Authorization': `${token}`
      }
      
    };
    axios(config)
    .then(function (response) {
      taskData = response;
      console.log("taskData",taskData)
      setTask(response.data);
      if (response.data.type == "session") {
        setTaskType(true);
      }
      console.log("response", response.data);
      console.log("task", task);
    }).catch(function (error) {
      console.log(error);
    });
    // const res = await axios.post(`http://localhost:3003/employee/getTaskById/${id}`);
    // taskData = res.data;
    // console.log("taskData",taskData)
    // setTask(res.data);
    // if (res.data.type == "session") {
    //   setTaskType(true);
    // }
    // console.log("response", res.data);
    // console.log("task", task);

   
  };
 

  const loadSessionInfo = async () => {
    const data = {
      "currentPage": currentPage,
      "pageSize": 2
    }
    token = localStorage.getItem("token");
    console.log("token in sess ", token);
    var config = {
      method: 'post',
      url: `http://localhost:3003/employee/getSessionInfo/${id}`,
      headers: {
        'Authorization': `${token}`
      },
      data: data
    };
    console.log("print config ", config);
    axios(config)
      .then(function (response) {
        console.log("save response ", response);
        setSessionInfo(response.data);
        var dataLength = response.data.length;
        setRatingAvg(response.data[dataLength - 1].ratingAvg);

      }).catch(function (error) {
        console.log(error);
      });

  }
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
              <h1 className="title">Information</h1>

              <div className="item">
                <div className="details">
                  <h5 className="itemTitle">{task.type}</h5>

                  <div className="detailItem">
                    <span className="itemKey">Date:</span>
                    {/* <span className="itemValue">{task.date} </span> */}
                    <span className="itemValue"> <Moment format="DD/MM/YYYY">{task.date}</Moment> </span>

                  </div>
                  

                  <div className="detailItem">
                    <span className="itemKey">Topic:</span>
                    <span className="itemValue">{task.topic}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Objective:</span>
                    <span className="itemValue">{task.objective}</span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Category:</span>
                    <span className="itemValue">{task.category} </span>
                  </div>

                  <div className="detailItem">
                    <span className="itemKey">Estimated time:</span>
                    <span className="itemValue">{task.estimatedTime} Hrs</span>
                  </div>
                  {
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
                  }

                </div>

              </div>

            </div>
          </div>
        </CCardBody>
        <CCardBody>
          <div style={{ height: "120px", overflow: "auto" }}>
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