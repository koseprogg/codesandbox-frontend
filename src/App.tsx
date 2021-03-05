import React, { useState, useEffect } from "react";
import "./App.css";
import "sanitize.css";
import axios from "axios";
import { Controlled as CodeMirror } from "react-codemirror2";
import codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/neat.css";
import "codemirror/mode/javascript/javascript.js";

const App: React.FC = () => {
  const [code, setCode] = useState("const a = 0;");
  const [response, setResponse] = useState("Ikke mottatt noen respons:(");

  function handleCodeChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const inputValue = `${event.target.value}`;
    setCode(inputValue);
  }

  async function sendCode() {
    const url = "http://localhost:3000";
    const response = await axios.post(url, {
      code: code,
    });
    console.log(response);
    setResponse(JSON.stringify(response.data.result));
  }

  return (
    <div className="page-wrapper">
      <div className="text-editor">
        <p>Kode under</p>
        <textarea
          className="code-field"
          // type="text"
          rows={20}
          cols={60}
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
      <div className="codeMirror-editor">
        <CodeMirror
          value={code}
          options={{
            mode: "javascript",
            theme: "material",
            lineNumbers: true,
          }}
          onBeforeChange={(editor, data, value) => {
            setCode(value);
          }}
          onChange={(editor, data, value) => {
            setCode(value);
          }}
        />
      </div>
    </div>
  );
};

export default App;
