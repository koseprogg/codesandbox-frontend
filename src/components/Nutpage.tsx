/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import "./nutpage.css";
import "sanitize.css";
import axios from "axios";
import { Controlled as CodeMirror } from "react-codemirror2";
import codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/neat.css";
import "codemirror/mode/javascript/javascript.js";
import { Alert, Button, Row, Col, Container } from "react-bootstrap";

const Nutpage: React.FC = () => {
  const [code, setCode] = useState("const a = 0;");
  const [response, setResponse] = useState("");

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
    <div>
    <h1 id = "header" style = {{textAlign: "center"}}>Påske nøtt dag 1</h1>
    <div className="page-wrapper">
      
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
        <Alert variant="warning">
          Output: {response} 
        </Alert>
        <Button onClick={sendCode} variant="primary">Send kode</Button>  
      </div>
        
        <div>
        <h1 id= "opp-header">Oppgavetekst</h1>
        <ul>
        <li>1. Lag to variabler kalt a og b, 1 og 2</li>
        <li>2. Lag en funksjon tar i mot to tall</li>
        <li>3. Funksjonen over skal returnere de to tallene modulus a*b</li>
        <li>4. Kjør funksjonen med argument 4 og 5</li>
        </ul>
      </div>
        
      
      
    </div>
    </div>
  );
};

export default Nutpage;
