import { cilLockLocked, cilUser } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import React, { useContext, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";

const Register = () => {
  const { registerContext } = useContext(AuthContext);

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [alert, setAlert] = useState(null);

  const { username, email, password, password2 } = user;

  const handleUser = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const registerUser = async (event) => {
    event.preventDefault();
    if (password !== password2) {
      setAlert({ type: "danger", message: "password not match" });
      setTimeout(() => setAlert(null), 5000);
      return;
    }

    try {
      console.log("here");
      const registerData = await registerContext(user);
      if (!registerData.success) {
        console.log(registerData);
        setAlert({ type: "danger", message: registerData.message });
        setTimeout(() => {
          setAlert(null);
        }, 5000);
      } else {
        console.log(registerData);
        setAlert({ type: "success", message: "Created user successfully" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={registerUser}>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">
                    Click here to <Link to="/login"> login </Link>{" "}
                  </p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autoComplete="username"
                      name="username"
                      value={username}
                      onChange={handleUser}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      name="email"
                      value={email}
                      onChange={handleUser}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      name="password"
                      value={password}
                      onChange={handleUser}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      name="password2"
                      value={password2}
                      onChange={handleUser}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type="submit">
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
