import { NavLink, useHistory } from "react-router-dom"; // useHistory 사용
import "../App.css";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useState, React } from "react";
import { useAuth } from "../AuthContext"; // AuthContext 사용

function MainHeader() {
  const [show, setShow] = useState(false);
  const { token, removeToken } = useAuth(); // token과 removeToken 함수 가져오기
  const history = useHistory(); // useHistory 훅 사용

  const handleLogout2 = () => {
    removeToken(); // JWT 토큰 제거
    history.push("/login"); // 로그아웃 후 로그인 페이지로 리다이렉트
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    removeToken(); // JWT 토큰 제거
    setShow(false); // 오프캔버스 닫기
  };

  // write 버튼 클릭 핸들러
  const handleWriteClick = () => {
    if (token) {
      history.push("/write"); // 로그인 상태일 때 /write로 이동
    } else {
      alert("먼저 로그인 하세요~");
      history.push("/login"); // 로그인 안 되어 있을 때 /login으로 이동
    }
    setShow(false); // 오프캔버스 닫기
  };
  const handleBoardClick = () => {
    if (token) {
      history.push("/board"); // 로그인 상태일 때 /board로 이동
    } else {
      alert("먼저 로그인 하세요~");
      history.push("/login"); // 로그인 안 되어 있을 때 /login으로 이동
    }
    setShow(false); // 오프캔버스 닫기
  };

  return (
    <>
      <header className="top_nav">
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            variant="primary"
            onClick={handleShow}
            style={{ cursor: "pointer", fontSize: "24px" }}
          >
            ⬅️
          </span>
          <NavLink to="/" style={{ textDecoration: "none", color: "black" }}>
            <div
              style={{
                display: "flex",
              }}
            >
              <img
                type="button"
                src={`${process.env.PUBLIC_URL}/icon.png`}
                alt="Parrot Icon"
                style={{ marginLeft: "10px", width: "30px", height: "30px" }}
              />

              <h1 style={{ marginLeft: "10px", fontSize: "20px" }}>
                Jeandoldol Board
              </h1>
              <div className="welcome-links">
                {token ? (
                  <button className="nav-link" onClick={handleLogout2}>
                    Log Out
                  </button>
                ) : (
                  <NavLink className="nav-link" to="/login">
                    Log In
                  </NavLink>
                )}
              </div>
            </div>
          </NavLink>
        </div>
      </header>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Jeandoldol Board</Offcanvas.Title>
          <img
            src={`${process.env.PUBLIC_URL}/icon.png`}
            alt="Parrot Icon"
            style={{ marginLeft: "10px", width: "30px", height: "30px" }}
          />{" "}
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="buttons">
            {/* 토큰이 있으면 로그아웃 버튼, 없으면 로그인 버튼 */}
            {token ? (
              <button
                onClick={handleLogout}
                style={{ textDecoration: "none", color: "black" }}
              >
                Log Out
              </button>
            ) : (
              <button onClick={handleClose}>
                <NavLink
                  to="/login"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  Log In
                </NavLink>
              </button>
            )}
            <br />
            <button
              onClick={handleBoardClick}
              style={{ textDecoration: "none", color: "black" }}
            >
              go to articles
            </button>
            <br />
            <button
              onClick={handleWriteClick}
              style={{ textDecoration: "none", color: "black" }}
            >
              write
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default MainHeader;
