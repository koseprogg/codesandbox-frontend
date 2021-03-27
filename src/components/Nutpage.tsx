/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState, useEffect } from "react";
import "./Nutpage.css";
import axios from "axios";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/neat.css";
import "codemirror/mode/javascript/javascript.js";
import { Task } from "../shared/types";
import { useFetch } from "../hooks/useFetch";
import { Alert, Button } from "react-bootstrap";
import { useRouteMatch } from "react-router-dom";

const backendUrl = "http://localhost:3000";

interface MatchParams {
  name: string;
  day: string;
}

const Nutpage: React.FC = () => {
  const [task, setTask] = useState<Task>();
  const [code, setCode] = useState("");
  const [score, setScore] = useState<number>();
  const [errorMsg, setErrorMsg] = useState("");

  const match = useRouteMatch<MatchParams>("/:name/day/:day");

  const { response, error } = match
    ? useFetch(
        `${backendUrl}/competitions/${match.params.name}/day/${match.params.day}`
      )
    : null;

  React.useEffect(() => {
    if (response != null && !error) {
      const task: Task = response.tasks[0];
      setTask(task);
    }
  });

  function handleCodeChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const inputValue = `${event.target.value}`;
    setCode(inputValue);
  }

  async function sendCode() {
    if (!match?.params.name || !match.params.day) {
      setErrorMsg("Could not parse competition name and/or day");
      return;
    }
    const url = `${backendUrl}/competitions/${match.params.name}/day/${match.params.day}`;
    const response = await axios.post(url, {
      code: code,
    });
    console.log(response);
    if (response.status != 200) {
      setErrorMsg(JSON.stringify(response.data?.msg));
      return;
    }
    setScore(Number.parseInt(JSON.stringify(response.data?.msg), 10));
  }

  const displayErrorMessage = () => {
    return errorMsg !== "" ? (
      <Alert variant="danger">Error message: {errorMsg}</Alert>
    ) : (
      <React.Fragment />
    );
  };

  console.log(task);

  return task && match ? (
    <div>
      <h1 className="main-heading">{`Dag ${match.params.day}: ${task.name}`}</h1>
      <div className="task-container">
        <div className="code-editor-container">
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
        <div className="task-description-container">
          <span className="task-description">{task.description}</span>
          <div className="subtask-container">
            <li>
              {task.subtasks.map((subtask: string, i: number) => (
                <ul key={i}>{subtask}</ul>
              ))}
            </li>
          </div>
        </div>
      </div>
      <div className="codeMirror-editor">
        {score && <Alert variant="primary">{`Score: ${score}%`}</Alert>}
        {displayErrorMessage()}
        <Button onClick={sendCode} variant="primary">
          Send kode
        </Button>
      </div>
    </div>
  ) : (
    <div>
      <p>Laster ...</p>
    </div>
  );
};

export default Nutpage;
