import { cilLockLocked, cilUser } from "@coreui/icons";
import { toast, ToastContainer } from "react-toastify";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";
import { useStore, actions } from "../../../../context";
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from "../../../../context/constant";
import { loadUser } from "../../../../context/Reducer";

const Login = () => {
  let navigate = useNavigate();
  let location = useLocation();

  let from = location.state?.from?.pathname || "/roomStyle";

  const [state, dispatch] = useStore();
  // console.log(state);

  const [alertString, setAlertString] = useState();

  // context call api

  // state login
  const [userLogin, setUserLogin] = useState({
    username: "",
    password: "",
  });

  const { username, password } = userLogin;

  useEffect(() => {
    toast(alertString);
  }, [alertString]);

  useEffect(() => {
    setAlertString(null);
  }, [username, password]);

  const handleLogin = (e) => {
    setUserLogin({
      ...userLogin,
      [e.target.name]: e.target.value,
    });
  };

  const loginSubmit = async (event) => {
    event.preventDefault();
    try {
      //const loginData = await loginContext(userLogin);
      const response = await axios.post(`${apiUrl}/auth/login`, userLogin);

      if (response.data.success) {
        toast.success("dang nhap thanh cong");
        localStorage.setItem(
          LOCAL_STORAGE_TOKEN_NAME,
          response.data.accessToken
        );
        dispatch(actions.login(response.data));
      }
      await loadUser();
      navigate(from, { replace: true });
    } catch (err) {
      console.log("error: ", err);
      if (!err?.response) {
        setAlertString("No Server Response");
      } else if (err.response?.status === 400) {
        setAlertString("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setAlertString("Incorrect username and/or password");
      } else {
        setAlertString("Login Failed");
      }
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={loginSubmit}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">
                      Sign In to your account
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        name="username"
                        value={username}
                        onChange={handleLogin}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        name="password"
                        value={password}
                        onChange={handleLogin}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          type="submit"
                          disabled={password && username ? false : true}
                        >
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard
                className="text-white bg-primary py-5"
                style={{ width: "44%" }}
              >
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <Link to="/register">
                      <CButton
                        color="primary"
                        className="mt-3"
                        active
                        tabIndex={-1}
                      >
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>

      <ToastContainer />
    </div>
  );
};

export default Login;
