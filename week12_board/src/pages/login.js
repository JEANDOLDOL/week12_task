import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";

function Login() {
  const [open, setOpen] = useState(false);
  const { saveToken } = useAuth();

  // 로그인 및 회원가입 상태 관리
  const [loginData, setLoginData] = useState({ id: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    id: "",
    password: "",
    studentId: "",
    name: "", // 이름 필드 추가
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // 서버로 로그인 데이터 전송
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      console.log("Login response:", data);
      // 서버 응답의 메시지를 alert로 출력
      if (data.message) {
        alert(data.message);
      }
      if (data.token) {
        saveToken(data.token); // JWT 토큰 저장
        window.token = data.token;
        window.location.href = "/"; // 리다이렉트
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    // 서버로 회원가입 데이터 전송
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpData),
      });
      const data = await response.json();
      console.log("SignUp response:", data);

      // 서버 응답의 메시지를 alert로 출력
      if (data.message) {
        alert(data.message);
      }
    } catch (error) {
      console.error("SignUp error:", error);
    }
  };

  return (
    <div className="loginBody">
      <div className="loginDiv">
        {/* 로그인 */}
        <Form onSubmit={handleLoginSubmit}>
          <Form.Label htmlFor="inputId">ID</Form.Label>
          <Form.Control
            type="text"
            id="inputId"
            value={loginData.id}
            onChange={(e) => setLoginData({ ...loginData, id: e.target.value })}
            aria-describedby="idHelpBlock"
          />
          <Form.Label htmlFor="inputPassword">Password</Form.Label>
          <Form.Control
            type="password"
            id="inputPassword"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            aria-describedby="passwordHelpBlock"
          />
          <div className="button-container">
            <button type="submit" className="btn submit-btn">
              Login
            </button>
            <button
              type="button"
              className="btn signup-btn"
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
            >
              Sign up
            </button>
          </div>
        </Form>

        {/* 회원가입 */}
        <Collapse in={open}>
          <div id="example-collapse-text" style={{ marginTop: "10px" }}>
            <Form onSubmit={handleSignUpSubmit}>
              <Form.Label htmlFor="signUpId">ID</Form.Label>
              <Form.Control
                type="text"
                id="signUpId"
                value={signUpData.id}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, id: e.target.value })
                }
              />
              <Form.Label htmlFor="signUpPassword">Password</Form.Label>
              <Form.Control
                type="password"
                id="signUpPassword"
                value={signUpData.password}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, password: e.target.value })
                }
              />
              <Form.Label htmlFor="studentId">Student ID</Form.Label>
              <Form.Control
                type="text"
                id="studentId"
                value={signUpData.studentId}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, studentId: e.target.value })
                }
              />
              <Form.Label htmlFor="name">Name</Form.Label>{" "}
              {/* 이름 입력 필드 추가 */}
              <Form.Control
                type="text"
                id="name"
                value={signUpData.name}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, name: e.target.value })
                }
              />
              <div className="button-container">
                <button type="submit" className="btn submit-btn">
                  Sign Up
                </button>
              </div>
            </Form>
          </div>
        </Collapse>
      </div>
    </div>
  );
}

export default Login;
