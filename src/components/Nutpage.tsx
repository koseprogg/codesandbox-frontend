/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import "./Nutpage.css";
import axios from "axios";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/neat.css";
import "codemirror/mode/javascript/javascript.js";
import { Task } from "../shared/types";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";
import { Alert, Button } from "react-bootstrap";
import { useRouteMatch } from "react-router-dom";
import LeaderBoard from "./LeaderBoard";
import _ from "lodash";
import config from "../config";

interface MatchParams {
  name: string;
  day: string;
}

interface Day {
  tasks: Task[];
}
interface CodeRes {
  msg?: string;
}

const Nutpage: React.FC = () => {
  const [task, setTask] = useState<Task>();
  const [code, setCode] = useState("");
  const [score, setScore] = useState<number>();
  const [errorMsg, setErrorMsg] = useState("");

  const { user } = useAuth();

  const match = useRouteMatch<MatchParams>("/:name/day/:day");

  const { response, error } = match
    ? useFetch<Day>(
        `${config.BACKEND_URL}/competitions/${match.params.name}/day/${match.params.day}`
      )
    : { response: null, error: null };

  React.useEffect(() => {
    if (response != null && !error) {
      const task = response.tasks[0];
      setTask(task);
    }

    if (match?.params.day != null) {
      const { day, name } = match.params;
      const store = `code-${name}-${day}`;
      const localCode = localStorage.getItem(store);
      if (!code && localCode != null) {
        setCode(localCode);
      }
    }
  }, [response]);

  const saveCodeLocal = _.debounce(() => {
    if (match?.params == null) return;
    const { day, name } = match.params;
    const store = `code-${name}-${day}`;
    localStorage.setItem(store, code);
  }, 500);

  async function sendCode() {
    if (!match?.params.name || !match.params.day) {
      setErrorMsg("Could not parse competition name and/or day");
      return;
    }
    const url = `${config.BACKEND_URL}/competitions/${match.params.name}/day/${match.params.day}`;
    const axconfig = user
      ? { headers: { Authorization: `JWT ${user?.accessToken}` } }
      : undefined;
    const response = await axios.post<CodeRes>(
      url,
      {
        code: code,
      },
      axconfig
    );
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

  return task && match ? (
    <div>
      <h1 className="main-heading">{`Dag ${match.params.day}: ${task.name}`}</h1>
      <LeaderBoard
        day={match.params.day}
        name={match.params.name}
        task={task.name}
      />
      <div className="task-container">
        <div className="nutpage-middle">
          <CodeMirror
            value={code}
            options={{
              mode: "javascript",
              theme: "material",
              lineNumbers: true,
            }}
            onBeforeChange={(editor, data, value) => {
              setCode(value);
              saveCodeLocal();
            }}
          />
        </div>
        <div className="task-description-container">
          <span className="task-description nutpage-middle">
            {task.description}
          </span>
          <div className="subtask-container nutpage-middle">
            <ul>
              {task.subtasks.map((subtask: string, i: number) => (
                <li key={i}>{subtask}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="codeMirror-editor">
        <Button className="nutpage-middle" onClick={sendCode} variant="primary">
          Send kode
        </Button>
      </div>
      <div className="nutpage-middle">
        Output:
        {score && <Alert variant="primary">{`Score: ${score}%`}</Alert>}
        {displayErrorMessage()}
      </div>
    </div>
  ) : (
    <div>
      <p>Laster ...</p>
    </div>
  );
};

export default Nutpage;
