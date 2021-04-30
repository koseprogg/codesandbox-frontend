import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import "./Nutpage.css";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/neat.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/clike/clike.js";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { Alert, Button, Form, Row, Col, Modal } from "react-bootstrap";
import config from "../config";
import { Task } from "../shared/types";
import MarkdownComponent from "./MarkdownComponent";

import { codeMirrorModes } from "./Nutpage";

const fixtureTip = `
Her skriver du testene som skal kjøres. For java må du lage en public klasse som bruker junit.
Du kan ha så mange testmetoder du vil.

Hver test kan gi en viss mengde _poeng_.
For java kan man sette antall poeng med \`@Points()\` annotasjonen.
Et eksempel på en testklasse er:
~~~java
import org.junit.Test;
import static org.junit.Assert.assertEquals;
import org.junit.runners.JUnit4;
public class PersonTest {

  // Denne testen gir 25 poeng
  @Test
  @Points(25)
  public void testGreet() {
    Person jens = new Person("Jens");
    assertEquals("Hello! My name is Jens. It is nice to meet you, Ola!",
                 jens.greet("Ola"));

  }
}
~~~

**OBS**: Du må manuelt sette total antall poeng det er mulig å oppnå i feltet under.
`;

const LANGS = [
  //"javascript",
  "java",
];

type AdminTask = Task & {
  fixture: string;
  totalScore: number;
};

type PostRes = { msg?: string };
type Props = {
  edit?: boolean;
};

const NutEditor = ({ edit }: Props): JSX.Element => {
  const { user } = useAuth();
  const history = useHistory();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [fixture, setFixture] = useState("");
  const [possibleScore, setPossibleScore] = useState<number>(0);
  const [languages, setLanguages] = useState<string[]>([LANGS[0]]);

  const [showPreview, setShowPreview] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const match = useRouteMatch<{ name: string }>("/:name/new");
  const editMatch = useRouteMatch<{ name: string; taskname: string }>(
    "/:name/:taskname/edit"
  );

  const { response, error } =
    edit && editMatch
      ? useFetch<AdminTask>(
          `${config.BACKEND_URL}/admin/competitions/${editMatch.params.name}/${editMatch.params.taskname}`
        )
      : { response: null, error: null };

  useEffect(() => {
    if (response != null && !error) {
      const task = response;
      setName(task.name);
      setDescription(task.description);
      setImage(task.image);
      setFixture(task.fixture);
      setPossibleScore(task.totalScore);
      setLanguages(task.languages);
    }
  }, [response]);

  const submit = async () => {
    const compName = match?.params.name || editMatch?.params.name || "";
    const url =
      edit && editMatch
        ? `${config.BACKEND_URL}/admin/competitions/${compName}/${editMatch.params.taskname}`
        : `${config.BACKEND_URL}/admin/competitions/${compName}/`;
    const axconfig = user
      ? { headers: { Authorization: `JWT ${user?.accessToken}` } }
      : undefined;
    await axios({
      method: edit ? "PUT" : "POST",
      url,
      data: {
        name,
        image,
        description,
        languages,
        totalScore: possibleScore,
        fixture,
        day: 1,
      },
      ...axconfig,
    })
      .then((response: AxiosResponse<PostRes>) => {
        if (
          response.status === 201 ||
          (response.status === 200 && response.data)
        ) {
          if (response.data.msg) {
            setErrorMsg(response.data.msg);
          }
          compName && history.push({ pathname: `/${compName}/${name}` });
        }
      })
      .catch((err: AxiosError<PostRes>) => {
        if (err.response) {
          const { data, status } = err.response;
          if (status != 201 && data.msg) {
            setErrorMsg(data.msg);
          }
        }
      });
  };

  return (
    <div>
      <h1 className="main-heading">
        {edit ? "Endre kodenøtt" : "Lag ny kodenøtt"}
      </h1>
      <div className="task-container">
        <div className="nutpage-middle">
          <Form.Group>
            <Form.Label>Navn</Form.Label>
            <Form.Control
              placeholder="En kjempekul kodenøtt"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Bilde</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Beskrivelse (støtter markdown)</Form.Label>
            <Form.Control
              as="textarea"
              className="monospace"
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <div className="main-heading">
            <Button variant="primary" onClick={() => setShowPreview(true)}>
              Vis preview
            </Button>
          </div>

          <Modal show={showPreview} onHide={() => setShowPreview(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <MarkdownComponent
                classname="nutpage-middle"
                markdown={description}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowPreview(false)}>
                Lukk
              </Button>
            </Modal.Footer>
          </Modal>

          <Form.Group as={Row}>
            <Col sm="3">
              <Form.Control
                as="select"
                value={languages[0]}
                onChange={(e) => setLanguages([e.target.value])}
              >
                {LANGS.map((lang) => (
                  <option key={lang}>{lang}</option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>

          <MarkdownComponent markdown={fixtureTip} />
          <h5>Testkode</h5>
          <CodeMirror
            value={fixture}
            options={{
              mode: codeMirrorModes[languages[0]] || "javascript",
              theme: "material",
              lineNumbers: true,
              smartIndent: true,
              cursorHeight: 0.8,
            }}
            onBeforeChange={(editor, data, value) => {
              setFixture(value);
            }}
          />

          <Form.Group>
            <Form.Label>Max poeng</Form.Label>
            <Form.Control
              value={possibleScore}
              type="number"
              onChange={(e) => setPossibleScore(Number(e.target.value))}
            />
          </Form.Group>

          <div className="main-heading">
            <Button variant="primary" onClick={submit}>
              Lagre
            </Button>
          </div>

          {
            //TODO: Allow running the testcode agains a known solution
          }

          {errorMsg && (
            <Alert variant="danger">
              OBS! Det oppsto en feil:
              <pre>{errorMsg}</pre>
            </Alert>
          )}
          <div style={{ height: "50px" }} />
        </div>
      </div>
    </div>
  );
};

export default NutEditor;
