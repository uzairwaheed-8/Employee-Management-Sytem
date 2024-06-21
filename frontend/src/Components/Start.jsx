import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/start.css"

const Start = () => {
  const navigate = useNavigate();
  const icon = "https://cdn-icons-png.flaticon.com/512/12245/12245175.png"
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3000/verify')
      .then(result => {
        if (result.data.Status) {
          if (result.data.role === "admin") {
            navigate('/dashboard');
          } else {
            navigate(`/employee_detail/${result.data.id}`);
          }
        }
      })
      .catch(err => console.log(err));
  }, [navigate]);

  return (
    // <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
    //   <div className="p-3 rounded w-25 border loginForm">
    //     <h2 className="text-center">Login As</h2>
    //     <div className="d-flex justify-content-between mt-5 mb-2">
    //       <button 
    //         type="button" 
    //         className="btn btn-primary" 
    //         onClick={() => navigate('/employee_login')}
    //       >
    //         Employee
    //       </button>
    //       <button 
    //         type="button" 
    //         className="btn btn-success" 
    //         onClick={() => navigate('/adminlogin')}
    //       >
    //         Admin
    //       </button>
    //     </div>
    //   </div>
    // </div>
      <div className='aboutCompanySection'>
        <div className='aboutCompanyTitle'>
          <span className='aboutCompanyIcon'><img className='aboutCompanyIcon'src={icon}/></span> {}<br/>
          EmployeeEase
        </div>
        <p className='aboutCompanyText'>
        EmployeeEase is a multi-faceted company with expertise spanning IT,<br/> business, and other fields. Their solutions cater to diverse industries,<br/> providing tailored services in HR management, IT solutions, and business consulting.
        </p>
        <button className='aboutCompanyButton bookCallButton'onClick={() => navigate('/adminlogin')}>Admin</button>
        <button className='aboutCompanyButton ourWorksButton'onClick={() => navigate('/employee_login')}>Employee</button>
        <div className='attributionText'>
        </div>
      </div>
    );
  };

export default Start;
