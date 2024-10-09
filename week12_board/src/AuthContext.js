import React, { createContext, useState, useContext, useEffect } from "react";

// Context 생성
export const AuthContext = createContext();

// Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // 앱이 로드될 때 localStorage에서 JWT 토큰 불러오기
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      setToken(storedToken); // 토큰을 state에 저장
      setIsLoggedIn(true); // 로그인 상태로 설정
    }
  }, []); // 컴포넌트가 처음 로드될 때 한 번만 실행

  const saveToken = (userToken) => {
    setToken(userToken);
    setIsLoggedIn(true); // 로그인 상태로 설정
    localStorage.setItem("jwtToken", userToken); // 토큰을 localStorage에 저장
  };

  const removeToken = () => {
    setToken(null);
    setIsLoggedIn(false); // 로그아웃 상태로 설정
    localStorage.removeItem("jwtToken"); // 토큰을 localStorage에서 제거
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, saveToken, removeToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// AuthContext 사용을 위한 훅
export const useAuth = () => useContext(AuthContext);
