import React from "react";
import ReactDOM from "react-dom";
import {Row} from 'react-bootstrap'
// import Header from "./components/header";
import UserCard from "../../components/UseCards";
// import Footer from "./components/footer";

// import "./Info.css";

// const rootElement = document.getElementById("root");
// ReactDOM.render(<Info />, rootElement)

function Info() {
  
  return (
    
    <div className="App">
      <div className="container">
       <Row>
        <UserCard />
       
        </Row>
       </div> 
    </div>
    
  )
}

export default Info;