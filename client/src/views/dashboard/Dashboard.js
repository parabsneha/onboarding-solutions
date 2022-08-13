import React, { useState , useEffect} from 'react'
import ReactDOM from 'react-dom';
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CWidgetStatsC,
  CCardFooter,
  CCardHeader,
  CFormInput,
  CCol,
  CProgress,
  CRow,
  CForm,
  CContainer,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cilBullhorn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import jwt_decode from "jwt-decode";
import axios from "axios";

const Dashboard = () => {

  const [blog, setBlog,] = useState({
    description: ''
  });
  const { Announcement} = blog;

  const [empCount, setEmpCount] = useState(0);
  const onInputChange = e => {
    setBlog({ ...blog, [e.target.name]: e.target.value })
  };

  var token;

  useEffect(()=>{
    token = localStorage.getItem("token");
    console.log("token ",token);
    if(token){
      var decoded = jwt_decode(token);    
    }
    var config = {
      method: 'post',
      url: `http://localhost:3003/admin/employeeCount`,
      headers: {
        'Authorization': `${token}`
      },
    };

    axios(config)
      .then(function (response) {
        console.log("data ", response.data[0]);
        setEmpCount( response.data[0]);
      })
      .catch(function (error) {
        console.log(error);
      });
  },[]);

  const handleSubmit = async (event) => {
    token = localStorage.getItem("token");
    const data = {
      description: Announcement
  };
  var config = {
    method: 'post',
    url: `http://localhost:3003/admin/makeAnnouncement`,
    headers: {
      'Authorization': `${token}`
    },
    data:data
  };

  axios(config)
    .then(function (response) {
      console.log("response ", response);
      alert("Announcement added!");
    })
    .catch(function (error) {
      console.log(error);
    });
  // event.preventDefault();
  
  }

  return (
    <>
    
      <CForm onSubmit={handleSubmit}>
      <div>
  <CContainer style={{ backgroundColor: '#D8D8D8', padding: 15 ,paddingTop:"0px", paddingLeft:"0px", borderRadius:"10px"}}>
    <CCardHeader style={{ display: "flex", flexDirection: "row",  background: "linear-gradient(to left, #D8D8D8 0%, #666699 100%)"}} >
 <h3> Announcements</h3>
 <br/>
 
 <CIcon icon={cilBullhorn}  size="xxl" style={{paddingTop:"8px",}}/>
 </CCardHeader>
 <CCardBody>
 
  <CCol>
   
 <CFormInput type="text"  name="Announcement" value={Announcement} onChange={e => onInputChange(e)} placeholder="Announcement"/>
 </CCol><br/>
 <CRow>
 {/* <CCol md={3}>
 <CFormInput type="date"  name="Date" value={Date}  onChange={e => onInputChange(e)} />
 </CCol> */}
 <CCol md={4} >
                <CButton color="secondary" type="submit">
                  Post
                </CButton>
      
               
              </CCol>
 </CRow>
 </CCardBody>
</CContainer>
  </div>
  </CForm><br/>
       
     <CCard>
      <CCardBody>
        <CRow>
            <CCol sm={6} md={2}>
              <CWidgetStatsC
                icon={<CIcon icon={cilPeople} height={36} />}
                value={empCount}
                title="Employee"
                progress={{ color: 'info', value: 100 }}
                className="mb-4"
              />
            </CCol>
        </CRow>
      </CCardBody>
     </CCard>
    </>
  )
}

export default Dashboard


// import React, { useState , useEffect} from 'react'

// import {
//   CAvatar,
//   CButton,
//   CButtonGroup,
//   CCard,
//   CCardBody,
//   CWidgetStatsC,
//   CCardFooter,
//   CCardHeader,
//   CCol,
//   CProgress,
//   CRow,
//   CTable,
//   CTableBody,
//   CTableDataCell,
//   CTableHead,
//   CTableHeaderCell,
//   CTableRow,
// } from '@coreui/react'
// import { CChartLine } from '@coreui/react-chartjs'
// import { getStyle, hexToRgba } from '@coreui/utils'
// import CIcon from '@coreui/icons-react'
// import {
//   cibCcAmex,
//   cibCcApplePay,
//   cibCcMastercard,
//   cibCcPaypal,
//   cibCcStripe,
//   cibCcVisa,
//   cibGoogle,
//   cibFacebook,
//   cibLinkedin,
//   cifBr,
//   cifEs,
//   cifFr,
//   cifIn,
//   cifPl,
//   cifUs,
//   cibTwitter,
//   cilCloudDownload,
//   cilPeople,
//   cilUser,
//   cilUserFemale,
// } from '@coreui/icons'

// import avatar1 from 'src/assets/images/avatars/1.jpg'
// import avatar2 from 'src/assets/images/avatars/2.jpg'
// import avatar3 from 'src/assets/images/avatars/3.jpg'
// import avatar4 from 'src/assets/images/avatars/4.jpg'
// import avatar5 from 'src/assets/images/avatars/5.jpg'
// import avatar6 from 'src/assets/images/avatars/6.jpg'

// import WidgetsBrand from '../widgets/WidgetsBrand'
// import WidgetsDropdown from '../widgets/WidgetsDropdown'
// import jwt_decode from "jwt-decode";
// import axios from "axios";

// const Dashboard = () => {

//   const [empCount, setEmpCount] = useState(0);
//   var token;
//   useEffect(()=>{
//     token = localStorage.getItem("token");
//     console.log("token ",token);
//     if(token){
//       var decoded = jwt_decode(token);    
//     }
//     var config = {
//       method: 'post',
//       url: `http://localhost:3003/admin/employeeCount`,
//       headers: {
//         'Authorization': `${token}`
//       },
//     };

//     axios(config)
//       .then(function (response) {
//         console.log("data ", response.data[0]);
//         setEmpCount( response.data[0]);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   },[]);

//   const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

//   const progressExample = [
//     { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
//     { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
//     { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
//     { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
//     { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
//   ]

//   const progressGroupExample1 = [
//     { title: 'Monday', value1: 34, value2: 78 },
//     { title: 'Tuesday', value1: 56, value2: 94 },
//     { title: 'Wednesday', value1: 12, value2: 67 },
//     { title: 'Thursday', value1: 43, value2: 91 },
//     { title: 'Friday', value1: 22, value2: 73 },
//     { title: 'Saturday', value1: 53, value2: 82 },
//     { title: 'Sunday', value1: 9, value2: 69 },
//   ]

//   const progressGroupExample2 = [
//     { title: 'Male', icon: cilUser, value: 53 },
//     { title: 'Female', icon: cilUserFemale, value: 43 },
//   ]

//   const progressGroupExample3 = [
//     { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
//     { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
//     { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
//     { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
//   ]

//   const tableExample = [
//     {
//       avatar: { src: avatar1, status: 'success' },
//       user: {
//         name: 'Yiorgos Avraamu',
//         new: true,
//         registered: 'Jan 1, 2021',
//       },
//       country: { name: 'USA', flag: cifUs },
//       usage: {
//         value: 50,
//         period: 'Jun 11, 2021 - Jul 10, 2021',
//         color: 'success',
//       },
//       payment: { name: 'Mastercard', icon: cibCcMastercard },
//       activity: '10 sec ago',
//     },
//     {
//       avatar: { src: avatar2, status: 'danger' },
//       user: {
//         name: 'Avram Tarasios',
//         new: false,
//         registered: 'Jan 1, 2021',
//       },
//       country: { name: 'Brazil', flag: cifBr },
//       usage: {
//         value: 22,
//         period: 'Jun 11, 2021 - Jul 10, 2021',
//         color: 'info',
//       },
//       payment: { name: 'Visa', icon: cibCcVisa },
//       activity: '5 minutes ago',
//     },
//     {
//       avatar: { src: avatar3, status: 'warning' },
//       user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2021' },
//       country: { name: 'India', flag: cifIn },
//       usage: {
//         value: 74,
//         period: 'Jun 11, 2021 - Jul 10, 2021',
//         color: 'warning',
//       },
//       payment: { name: 'Stripe', icon: cibCcStripe },
//       activity: '1 hour ago',
//     },
//     {
//       avatar: { src: avatar4, status: 'secondary' },
//       user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2021' },
//       country: { name: 'France', flag: cifFr },
//       usage: {
//         value: 98,
//         period: 'Jun 11, 2021 - Jul 10, 2021',
//         color: 'danger',
//       },
//       payment: { name: 'PayPal', icon: cibCcPaypal },
//       activity: 'Last month',
//     },
//     {
//       avatar: { src: avatar5, status: 'success' },
//       user: {
//         name: 'Agapetus Tadeáš',
//         new: true,
//         registered: 'Jan 1, 2021',
//       },
//       country: { name: 'Spain', flag: cifEs },
//       usage: {
//         value: 22,
//         period: 'Jun 11, 2021 - Jul 10, 2021',
//         color: 'primary',
//       },
//       payment: { name: 'Google Wallet', icon: cibCcApplePay },
//       activity: 'Last week',
//     },
//     {
//       avatar: { src: avatar6, status: 'danger' },
//       user: {
//         name: 'Friderik Dávid',
//         new: true,
//         registered: 'Jan 1, 2021',
//       },
//       country: { name: 'Poland', flag: cifPl },
//       usage: {
//         value: 43,
//         period: 'Jun 11, 2021 - Jul 10, 2021',
//         color: 'success',
//       },
//       payment: { name: 'Amex', icon: cibCcAmex },
//       activity: 'Last week',
//     },
//   ]

//   return (
//     <>
//       {/* <WidgetsDropdown /> */}
//       <CCard>
//       <CCardBody>
//         Announcements
//         </CCardBody>
//         </CCard>
//      <CCard>
//       <CCardBody>
//         <CRow>
//             <CCol sm={6} md={2}>
//               <CWidgetStatsC
//                 icon={<CIcon icon={cilPeople} height={36} />}
//                 value={empCount}
//                 title="Employee"
//                 progress={{ color: 'info', value: 100 }}
//                 className="mb-4"
//               />
//             </CCol>
//         </CRow>
//       </CCardBody>
//      </CCard>
//     </>
//   )
// }

// export default Dashboard
