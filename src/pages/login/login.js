import React, { useState } from "react";
import { Link } from 'react-router-dom'
import './login.css'
import bg from './images/bg.jpg'
const Login = () => {

    const [checked, setChecked] = useState(true)

    return (
        <div className="img js-fullheight"
            style={{ backgroundImage: `${bg}`, height: 937 }}
        >
            <section className="ftco-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 text-center mb-5">
                            <h3 className="heading-section">BME</h3>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-4">
                            <div className="login-wrap p-0">
                                <h3 className="mb-4 text-center">Administrator Manager</h3>
                                <form action="#" className="signin-form">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Username"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            id="password-field"
                                            type="password"
                                            className="form-control"
                                            placeholder="Password"
                                            required
                                        />
                                        <span
                                            toggle="#password-field"
                                            className="fa fa-fw field-icon toggle-password"
                                        ></span>
                                    </div>
                                    <div className="form-group">
                                        <button
                                            type="submit"
                                            className="form-control btn btn-primary submit px-3"
                                        >
                                            Sign In
                                        </button>
                                    </div>
                                    <div className="form-group d-md-flex">
                                        <div className="w-50">
                                            <label className="checkbox-wrap checkbox-primary">
                                                Remember Me
                                                <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                        <div className="w-50 text-md-right">
                                            <Link to="#" style={{ color: '#fff' }}>
                                                Forgot Password
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                                <p className="w-100 text-center">
                                    &mdash; Please input your username and password &mdash;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;
