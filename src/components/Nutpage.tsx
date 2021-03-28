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
import { Alert, Button, Modal } from "react-bootstrap";
import { useRouteMatch } from "react-router-dom";
import CustomTable from "./CustomTable";
import _ from "lodash";
import config from "../config";

interface MatchParams {
  name: string;
  day: string;
}

const Nutpage: React.FC = () => {
  const [task, setTask] = useState<Task>();
  const [code, setCode] = useState("");
  const [score, setScore] = useState<number>();
  const [possibleScore, setPossibleScore] = useState<number>();
  const [achievedScore, setAchievedScore] = useState<number>();
  const [errorMsg, setErrorMsg] = useState("");
  const [show, setShow] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const match = useRouteMatch<MatchParams>("/:name/day/:day");

  const { response, error } = match
    ? useFetch(
        `${config.BACKEND_URL}/competitions/${match.params.name}/day/${match.params.day}`
      )
    : null;

  React.useEffect(() => {
    if (response != null && !error) {
      const task: Task = response.tasks[0];
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
    setIsFetching(true);
    if (!match?.params.name || !match.params.day) {
      setErrorMsg("Could not parse competition name and/or day");
      return;
    }
    setErrorMsg("");
    const url = `${config.BACKEND_URL}/competitions/${match.params.name}/day/${match.params.day}`;
    const response = await axios.post(url, {
      code: code,
    });
    setIsFetching(false);
    console.log(response.data);
    if (response.status === 200 && response.data) {
      if (response.data.msg) {
        setErrorMsg(JSON.stringify(response.data.msg));
      }
      if (response.data.result) {
        setScore(
          Number.parseInt(JSON.stringify(response.data.result.score), 10)
        );
        setPossibleScore(
          Number.parseInt(
            JSON.stringify(response.data.result.possibleScore),
            10
          )
        );
        setAchievedScore(
          Number.parseInt(
            JSON.stringify(response.data.result.achievedScore),
            10
          )
        );
      }
    }
  }

  const displayErrorMessage = () => {
    return errorMsg !== "" ? (
      <Alert variant="danger">
        Koden din krasjet med denne feilen: {errorMsg}
      </Alert>
    ) : (
      <React.Fragment />
    );
  };

  return task && match ? (
    <div>
      <h1 className="main-heading">{`Dag ${match.params.day}: ${task.name}`}</h1>
      <>
        <div className="main-heading">
          <Button variant="primary" onClick={handleShow}>
            Se ledertavle
          </Button>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{`Dag ${match.params.day}: ${task.name}`}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CustomTable />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Lukk
            </Button>
          </Modal.Footer>
        </Modal>
      </>
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
        <h3>Din tilbakemelding</h3>
        <span>
          {isFetching ? (
            "Venter på svar ... "
          ) : score && possibleScore && achievedScore ? (
            <Alert variant={score === 100 ? "success" : "primary"}>
              {score === 100
                ? `Full pott! Svaret ditt ga ${achievedScore} av ${possibleScore} poeng!! 🎉`
                : `Svaret ditt ga ${achievedScore} av ${possibleScore} poeng.`}
            </Alert>
          ) : errorMsg ? (
            ""
          ) : (
            "Svar på oppgaven over for å få tilbakemelding."
          )}
          {displayErrorMessage()}
        </span>
      </div>
    </div>
  ) : (
    <div>
      <p>Laster ...</p>
    </div>
  );
};

export default Nutpage;
