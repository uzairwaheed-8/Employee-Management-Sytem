import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/adm_login.css'; // Assuming the CSS file is named 'emp_login.css'

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/auth/adminlogin', values)
            .then(result => {
                if (result.data.loginStatus) {
                    localStorage.setItem("valid", true);
                    navigate('/dashboard');
                } else {
                    setError(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className='container'>
            <div className='centi'>
            <div className='screen'>
                <div className='screen__background'>
                    <div className='screen__background__shape screen__background__shape1'></div>
                    <div className='screen__background__shape screen__background__shape2'></div>
                    <div className='screen__background__shape screen__background__shape3'></div>
                    <div className='screen__background__shape screen__background__shape4'></div>
                </div>
                <div className='screen__content'>
                    <div className='login'>
                        <div className='text-warning'>
                            {error && error}
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className='login__field'>
                                <label htmlFor="email"></label>
                                <input
                                    type="email"
                                    name='email'
                                    autoComplete='off'
                                    placeholder='Enter Email'
                                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                                    className='login__input'
                                />
                            </div>
                            <div className='login__field'>
                                <label htmlFor="password"></label>
                                <input
                                    type="password"
                                    name='password'
                                    placeholder='Enter Password'
                                    onChange={(e) => setValues({ ...values, password: e.target.value })}
                                    className='login__input'
                                />
                            </div>
                            <button className='login__submit'>Log in</button>
                            <div className='mb-1 tckbox'>
                                <input type="checkbox" name="tick" id="tick" className='me-2' />
                                <label htmlFor="password">You are Agree with terms & conditions</label>
                            </div>
                        </form>
                    </div>
                    <div className='social-login'>
                        <div className='social-icons'>
                            {/* Add your social login icons here */}
                        </div>
                    </div>
                </div>
            </div>
            </div>
           
        </div>
    )
}

export default Login;
