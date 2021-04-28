import React, { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import "./Nutpage.css";
import axios, { AxiosError } from "axios";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/neat.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/clike/clike.js";
import { useAuth } from "../hooks/useAuth";
import { Alert, Button, Form, Row, Col, Modal } from "react-bootstrap";
import config from "../config";
import MarkdownComponent from "./MarkdownComponent";

import { codeMirrorModes } from "./Nutpage";

const fixtureTip = `
Her skriver du testene som skal kjøres. For java må su late en public klasse som bruker junit.
Du kan ha så mange testmetoder du vil.

Hver test kan gi en viss menge _poeng_.
i java kan man sette antall poeng med \`@Points()\` annotasjonen.
Et eksempel på en test er:
~~~java
import org.junit.Test;
import static org.junit.Assert.assertEquals;
import org.junit.runners.JUnit4;
public class PersonTest {

  // Denne testen gir 25 poeng
  @Test
  @Points(25)
  public void testGreet() {
    Person shoki = new Person("Jent");
    assertEquals("Hello! My name is Jens. It is nice to meet you, Ola!",
                 shoki.greet("Ola"));

  }
}
~~~

**OBS**: Du må manuelt sette total antall poeng det er mulig å oppnå.
`;

const LANGS = [
  //"javascript",
  "java",
];

type PostRes = { msg?: string };

const NutEditor = (): JSX.Element => {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fixture, setFixture] = useState("");
  const [possibleScore, setPossibleScore] = useState<number>();
  const [languages, setLanguages] = useState<string[]>(["javascript"]);

  const [showPreview, setShowPreview] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const match = useRouteMatch<{ name: string }>("/:name/new");

  const submit = async () => {
    const url = `${config.BACKEND_URL}/admin/competitions/${match?.params.name}/`;
    const axconfig = user
      ? { headers: { Authorization: `JWT ${user?.accessToken}` } }
      : undefined;
    const response = await axios
      .post<PostRes>(
        url,
        {
          name,
          description,
          languages,
          totalScore: possibleScore,
          fixture,
          day: 1,
        },
        axconfig
      )
      .then((response) => {
        if (response.status === 201 && response.data) {
          if (response.data.msg) {
            setErrorMsg(response.data.msg);
          }
        }
      })
      .catch((err: AxiosError) => {
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
      <h1 className="main-heading">Lag ny kodenøtt</h1>
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
