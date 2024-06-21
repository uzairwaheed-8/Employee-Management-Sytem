import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./css/emp_login.css"

const EmployeeLogin = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/employee/employee_login', values)
            .then(result => {
                if (result.data.loginStatus) {
                    localStorage.setItem("valid", true);
                    navigate('/employee_detail/' + result.data.id);
                } else {
                    setError(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="container">
            <div className='cent'>
            <div className="screen">
                <div className="screen__background">
                    <div className="screen__background__shape screen__background__shape1"></div>
                    <div className="screen__background__shape screen__background__shape2"></div>
                    <div className="screen__background__shape screen__background__shape3"></div>
                    <div className="screen__background__shape screen__background__shape4"></div>
                </div>
                <div className="screen__content">
                    <div className="login">
                        <form onSubmit={handleSubmit}>
                            <div className="login__field">
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    placeholder="Enter Email"
                                    value={values.email}
                                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                                    className="login__input"
                                />
                            </div>
                            <div className="login__field">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter Password"
                                    value={values.password}
                                    onChange={(e) => setValues({ ...values, password: e.target.value })}
                                    className="login__input"
                                />
                            </div>
                            <button type="submit" className="login__submit">Log in</button>
                        </form>
                        <div className="text-warning">
                            {error && error}
                        </div>
                    </div>
                </div>
            </div>
            </div>
            
        </div>
    );
};

export default EmployeeLogin;
