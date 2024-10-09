import { NavLink, useHistory } from "react-router-dom";
import { useAuth } from "../AuthContext";
import React from "react";
import "../App.css"; // CSS 파일

function Welcome() {
  const { token, removeToken } = useAuth(); // Context에서 토큰과 토큰 제거 함수 가져오기
  const history = useHistory();

  const handleLogout = () => {
    removeToken(); // JWT 토큰 제거
    history.push("/login"); // 로그아웃 후 로그인 페이지로 리다이렉트
  };

  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <h1 className="welcome-title" style={{ paddingTop: "100px" }}>
          Welcome to DolDol board
        </h1>
        <p className="welcome-subtitle"></p>
        {token ? <p>당신의 토큰입니다~: {token}</p> : <p>로그인 해주세요~</p>}
      </header>

      <div className="welcome-content">
        <div className="welcome-animation">
          <img
            src={process.env.PUBLIC_URL + "/huh.png"}
            alt="Animated"
            className="animated-image"
          />
        </div>

        <div className="welcome-links">
          {token ? (
            <button className="nav-link" onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            <NavLink className="nav-link" to="/login">
              Log In
            </NavLink>
          )}
        </div>
      </div>
      <footer className="welcome-footer"></footer>
    </div>
  );
}

export default Welcome;
