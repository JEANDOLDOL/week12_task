import { NavLink, Route, Switch, Redirect, useHistory } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import "../App.css";

function Write() {
  const [title, setTitle] = useState(""); // 제목 입력 상태
  const [post, setPost] = useState(""); // 게시물 입력 상태
  const { token } = useAuth();
  const history = useHistory(); // useHistory 훅 사용

  const handleWriteClick = () => {
    if (token) {
      alert("작성 완료~");
      history.push("/board"); // 로그인 안 되어 있을 때 /login으로 이동
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // title과 post를 포함한 writeData 객체 생성
    const writeData = {
      title: title,
      post: post,
    };

    console.log("Post submitted:", writeData);

    // 서버로 글 작성 데이터 전송
    try {
      const response = await fetch("/write", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(writeData), // writeData를 JSON으로 변환하여 서버로 전송
      });
      const data = await response.json();
      console.log("Write response:", data);

      // 서버 응답의 메시지를 alert로 출력
      if (data.message) {
        alert(data.message);
      }
    } catch (error) {
      console.error("Write error:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      console.log("Post submitted:", title, post);
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="post-form-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="post-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your post title..."
        />
        <textarea
          className="post-textarea"
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="Write your post here..."
          onKeyDown={handleKeyDown} // 엔터키로 제출 가능
        />
        <div className="button-group">
          <button
            type="submit"
            className="submit-btn"
            onClick={handleWriteClick}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Write;
