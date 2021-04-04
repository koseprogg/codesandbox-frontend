/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import "./Nutpage.css";
import axios, { AxiosError } from "axios";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/neat.css";
import "codemirror/mode/javascript/javascript.js";
import { Task } from "../shared/types";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";
import { Alert, Button, Form } from "react-bootstrap";
import { useRouteMatch } from "react-router-dom";
import LeaderBoard from "./LeaderBoard";
import _ from "lodash";
import config from "../config";
import MarkdownComponent from "./MarkdownComponent";

interface MatchParams {
  name: string;
  day: string;
}

interface Day {
  tasks: Task[];
}
interface CodeRes {
  msg?: string;
  result?: {
    score: number;
    possibleScore: number;
    achievedScore: number;
    characterCount: number;
    elapsedTimeInMilis: number;
  };
}

const Nutpage: React.FC = () => {
  const [task, setTask] = useState<Task>();
  const [code, setCode] = useState("");
  const [score, setScore] = useState<number>();
  const [possibleScore, setPossibleScore] = useState<number>();
  const [achievedScore, setAchievedScore] = useState<number>();
  const [characterCount, setCharacterCount] = useState<number>();
  const [elapsedTimeInMilis, setElapsedTimeInMilis] = useState<number>();
  const [errorMsg, setErrorMsg] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const { user } = useAuth();

  const [sendSubmission, setSendSubmission] = useState(!!user);

  React.useEffect(() => {
    setSendSubmission(!!user);
  }, [user]);

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

  const saveCodeLocal = _.debounce((value) => {
    if (match?.params == null) return;
    const { day, name } = match.params;
    const store = `code-${name}-${day}`;
    localStorage.setItem(store, value);
  }, 500);

  async function sendCode() {
    setIsFetching(true);
    if (!match?.params.name || !match.params.day) {
      setErrorMsg("Could not parse competition name and/or day");
      return;
    }
    setErrorMsg("");
    const url = `${config.BACKEND_URL}/competitions/${match.params.name}/day/${match.params.day}`;
    const axconfig = user
      ? { headers: { Authorization: `JWT ${user?.accessToken}` } }
      : undefined;
    const response = await axios
      .post<CodeRes>(
        url,
        {
          code,
          sendSubmission,
        },
        axconfig
      )
      .then((response) => {
        setIsFetching(false);
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
            setCharacterCount(
              Number.parseInt(
                JSON.stringify(response.data.result.characterCount),
                10
              )
            );
            setElapsedTimeInMilis(response.data.result.elapsedTimeInMilis);
          }
        }
      })
      .catch((err: AxiosError) => {
        setIsFetching(false);
        if (err.response) {
          const { data, status } = err.response;
          if (status === 400 && data.msg) {
            setErrorMsg(JSON.stringify(data.msg));
          }
        }
      });
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
      <LeaderBoard
        day={match.params.day}
        name={match.params.name}
        task={task.name}
        isCompetitionLeaderboard={false}
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
              saveCodeLocal(value);
            }}
          />
        </div>
        <p className="nutpage-middle">(Oppgaven må løses i Javascript)</p>
        <div className="task-description-container">
          <MarkdownComponent
            classname="nutpage-middle"
            markdown={task.description}
          />
        </div>
      </div>
      <div className="codeMirror-editor">
        <div className="nutpage-middle">
          <Button onClick={sendCode} variant="primary">
            Send kode
          </Button>
          <Form.Check
            type="checkbox"
            id="sendSubmission-check"
            checked={sendSubmission}
            onChange={() => setSendSubmission(!sendSubmission)}
            label="Lagre besvarelse"
            aria-describedby="sendSubmissionHelp"
            disabled={!user}
          />
          <Form.Text id="sendSubmissionHelp">
            {!user
              ? "Logg inn for å lagre besvarelsen"
              : "Lagre besvarelsen. Du vil da havne på resultatlisten og andre brukere vil kunne se din score. Dersom skrudd av, vil du fortsatt få poeng for besvarelsen din, men den vil ikke lagres eller bidra til ditt resultat på ledertavlen."}
          </Form.Text>
        </div>
      </div>
      <div className="nutpage-middle">
        <h3>Din tilbakemelding</h3>
        <span>
          {isFetching ? (
            "Venter på svar ... "
          ) : score != undefined &&
            possibleScore != undefined &&
            achievedScore != undefined &&
            characterCount != undefined &&
            elapsedTimeInMilis != undefined ? (
            <>
              <Alert variant={score === 100 ? "success" : "primary"}>
                {score === 100
                  ? `Full pott! Svaret ditt ga ${achievedScore} av ${possibleScore} poeng!! 🎉`
                  : `Svaret ditt ga ${achievedScore} av ${possibleScore} poeng.`}
              </Alert>
              <Alert variant={"primary"}>
                {`Kjøretid: ${elapsedTimeInMilis} ms.`}
              </Alert>
              <Alert variant={"primary"}>
                {`Antall tegn: ${characterCount}.`}
              </Alert>
            </>
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
