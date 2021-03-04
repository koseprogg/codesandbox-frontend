import React, { useState, useEffect } from "react";
import "./App.css";
import "sanitize.css";
import axios from "axios";

const App: React.FC = () => {
  const [code, setCode] = useState("");
  const [response, setResponse] = useState("Ikke mottatt noen respons:(");

  function handleCodeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = `${event.target.value}`;
    setCode(inputValue);
  }

  async function sendCode() {
    const url = "http://localhost:3000";
    const response = await axios.post(url, {
      code: code,
    });
    console.log(response);
    setResponse(response.data.result);
  }

  return (
    <div className="page-wrapper">
      <div className="text-editor">
        <p>Kode under</p>
        <input
          className="code-field"
          type="text"
          placeholder="Code"
          spellCheck="false"
          value={code}
          onChange={(event) => handleCodeChange(event)}
        />
        <button onClick={sendCode} className="code-submit">
          Send kode!
        </button>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default App;
