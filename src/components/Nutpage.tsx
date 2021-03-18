/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import "./Nutpage.css";
import axios from "axios";
import { Controlled as CodeMirror } from "react-codemirror2";
import codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/neat.css";
import "codemirror/mode/javascript/javascript.js";
import { Alert, Button, Row, Col, Container } from "react-bootstrap";

const Nutpage: React.FC = () => {
  const [code, setCode] = useState(`const fibo = (n) => {
    const numbers = [];
    
    while (numbers.length < n) {
      numbers.push(numbers.length === 0 ? 0 : numbers.length === 1 ? 1 : (numbers[numbers.length - 1] + numbers[numbers.length - 2]))
    }
    
    return numbers;
  }
  
  fibo(n);
  `);
  const [response, setResponse] = useState("");
  const [score, setScore] = useState<number>();

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
    setScore(parseInt(JSON.stringify(response.data.msg)));
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
        {score && <Alert variant="warning">
          {`Score: ${score}%`}
        </Alert>}
        <Button onClick={sendCode} variant="primary">Send kode</Button>  
      </div>
        
        <div>
        <h1 id= "opp-header">Oppgavetekst</h1>
        <p style={{color: 'black'}}> Skriv og kjør en funksjon som tar inn ett argument som heter n. Funksjonen skal returnere en liste med
          tallene i Fibonacci-rekken til og med det n-te tallet. For eksempel, ved n = 10 skal
          funksjonen returnere [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]. 
        </p>
      </div>
        
      
      
    </div>
    </div>
  );
};

export default Nutpage;
