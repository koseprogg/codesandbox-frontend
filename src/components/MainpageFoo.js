import React, { useState } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import app from "../firebase"
import { useAuth } from "../contexts/AuthContext"

export default function Mainpage() {
  const [error, setError] = useState("")
  const history = useHistory()
  const { currentUser} = useAuth()
  const [fileUrl, setFileUrl] = useState("")

  const onFileChange = async (e) => {
    const file = e.target.files[0]
    const upload = app.storage().ref(`/images/${file.name}`).put(file);
    
    upload.on("state_changed", console.log, console.error, () => {
      app.storage()
        .ref("images")
        .child(file.name)
        .getDownloadURL()
        .then((url) => {
          setFileUrl(url);
        });
    });

      const db = app.firestore();

      // Add a new document with a generated id.
      db.collection("users").add({
        userid: currentUser.uid,
        file: file.name,
        url: fileUrl
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }

  const onSubmit = (e) => {
      e.preventdefault()
  }

  async function handleDashboard() {
    setError("")

    try {
      history.push("/dashboard")
    } catch {
      setError("Failed to push to dashboard")
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Send in en novelle</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <form onSubmit={onSubmit}>
              <input type = "file" onChange = {onFileChange}/>
              <Link to="/" className="btn btn-primary w-100 mt-3">
                Send inn
              </Link>
          </form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleDashboard}>
          Min profil/ Logg ut
        </Button>
      </div>
    </>
  )
}