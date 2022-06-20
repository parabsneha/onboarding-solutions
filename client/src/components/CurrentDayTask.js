

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

const CurrentDayTask = () => {
  const [tasks, setTask] = useState([]);

  // useEffect(() => {
  //   loadTasks();
  // }, []);

  // const loadTasks = async () => {
  //   const result = await axios.post("http://localhost:3003/admin/getAllTasks");
  //   setTask(result.data.reverse());
  // };


  // const [task, setTask] = useState([]);
  let id;
  var details;
  var token;
  useEffect(()=>{
     token = localStorage.getItem("token");
    console.log("token ",token);
    if(token){
      var decoded = jwt_decode(token);
      console.log("decoded data",decoded.user_id);
      id = decoded.user_id;
    }

    var config = {
      method: 'post',
      url: 'http://localhost:3003/employee/current-day-task',
      headers: { 
        'Authorization': `${token}`
      }
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      // details = JSON.stringify(response.data);
      setTask(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
    
  },[]);



//   const deleteUser = async id => {
//     await axios.delete(`http://localhost:3003/tasks/${id}`);
//     loadUsers();
//   };
  
  return (
      
       
    <div className="container6">
       {/* <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
     <Link  className="btn btn-outline-light" to="/adduser" >Add User </Link>
     </nav> */}
      <div className="py-4">
        <h3>My Tasks </h3>
        <table className="table table-dark ">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Topic</th>
              <th scope="col">Objective</th>
              <th scope="col">Category</th>
              <th scope="col">Date</th>
              {/* <th scope="col">Person responsible</th> */}
              <th scope="col">Est. time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>   
            {tasks.length>0 ? tasks.map((task, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                
                <td>{task.topic}</td>
                <td>{task.objective}</td>
                <td>{task.category}</td>
                <td>{task.date}</td>
                <td>{task.estimatedTime}</td>
                <td>
                   <Link key="{task.id}" class="btn btn-primary me-4" to={`/viewemptask/${task._id}`}>
                    View
                  </Link> 
                   <Link
                  key="{task.id}"
                    class="btn btn-outline-primary me-4"
                    to={`/editemptask/${task._id}`}
                  >
                    Edit
                  </Link>
                   {/* <div 
                   
                  key="{task.id}"
                    class="btn btn-danger "
                     onClick={() => deleteUser(task.id)}
                  >
                    Delete
                  </div>    */}
                </td>
              </tr>
            )): <p>nothing to fetch</p>}
            
          </tbody>
        </table>
      </div>
    </div>
    
  );
};

export default CurrentDayTask