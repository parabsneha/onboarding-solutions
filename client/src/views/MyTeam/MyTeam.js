import PropTypes from 'prop-types'
import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import "./Info.css";
import {Link} from 'react-router-dom'
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
import { Image } from 'cloudinary-react'
import jwt_decode from "jwt-decode";
import axios from "axios";


const MyTeam = () => {

  const [team, setTeam] = useState([]);
 const [teamName, setTeamName] = useState('');
    let token_task;
    var employee;
    var token;
    useEffect(()=>{
      console.log("my team useeffect running");
      token = localStorage.getItem("token");
      console.log("token ",token);
      if(token){
        var decoded = jwt_decode(token);
        token_task = decoded.task_id;
      }
  
      var config = {
        method: 'post',
        url: 'http://localhost:3003/employee/getMyTeam',
        headers: { 
          'Authorization': `${token}`
        }
      };
      
      axios(config)
      .then(function (response) {
        setTeam(response.data);
        console.log("team",team[0].empTeam)
        setTeamName(response.data[0].empTeam);
        employee = response.data;
        console.log("response from team = ",  response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
      
    },[]);


  return (
    <>
    
    <CCard>
      <CCardHeader >
       My Team {teamName}
      </CCardHeader>
      <CRow>
      {team.map((team, index) => (
        <CCol  style={{display:"flex"}}>
        <CCard style={{width:"280px", height:"300px", alignItems:"center"}}>
        <div  >
        <Image className="avatar" cloudName="dw7junf8b" publicId={team.profilePicture}  style={{width:"140px", height:"140px",  borderRadius:"50%", marginTop:"25px"}}/>
         </div>
          <p style={{fontWeight:"bold", marginTop:"10px"}}>{team.empName}</p>
          <p>{team.empPosition}</p>
          <p>{team.empEmail}</p>
          
          
        </CCard>
        </CCol>
      ))}
      </CRow>
    </CCard>
    </>

  )
}

export default MyTeam

// import PropTypes from 'prop-types'
// import React, { useEffect, useState, createRef } from 'react'
// import classNames from 'classnames'
// // import "./task.css";
// import {Link} from 'react-router-dom'
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CCol,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableCaption,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
//   CButton

// } from '@coreui/react'
// import { Image } from 'cloudinary-react'
// import jwt_decode from "jwt-decode";
// import axios from "axios";


// const MyTeam = () => {

//   const [team, setTeam] = useState([]);
  
//     let token_task;
//     var employee;
//     var token;
//     useEffect(()=>{
//       console.log("my team useeffect running");
//       token = localStorage.getItem("token");
//       console.log("token ",token);
//       if(token){
//         var decoded = jwt_decode(token);
//         token_task = decoded.task_id;
//       }
  
//       var config = {
//         method: 'post',
//         url: 'http://localhost:3003/employee/getMyTeam',
//         headers: { 
//           'Authorization': `${token}`
//         }
//       };
      
//       axios(config)
//       .then(function (response) {
//         setTeam(response.data);
//         employee = response.data;
//         console.log("response from team = ", response);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
      
//     },[]);


//   return (
//     <>
//     <CCard>
//       <CCardHeader>
//         My Team
//       </CCardHeader>
//       <CRow>
//       {team.map((team, index) => (
//         <CCol>
//         <CCard>
//         <Image cloudName="dw7junf8b" publicId={team.profilePicture} className="itemImg" style={{width:"140px", height:"140px"}}/>
//           <p>{team.empName}</p>
//           <p>{team.empPosition}</p>
//         </CCard>
//         </CCol>
//       ))}
//       </CRow>
//     </CCard>
//     </>

//   )
// }

// export default MyTeam
