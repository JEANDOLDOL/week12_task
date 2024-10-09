import React, { useState } from "react";

function Example01() {
  const [state, setState] = useState({ text: "" });

  const handleChange = (e) => {
    setState({ [e.target.name]: e.target.value });
  };

  const onClick = () => {
    const textbox = {
      inText: state.text,
    };

    fetch("http://localhost:4000/text", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(textbox),
    });
  };

  return (
    <div>
      <input name="text" onChange={handleChange}></input>
      <button onClick={onClick}>전송</button>
      <h3>{state.text}</h3>
    </div>
  );
}
