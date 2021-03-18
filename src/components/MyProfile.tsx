import React, { useState, useEffect } from "react"
import { Card, Button, Alert, Badge } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import app from "../firebase"
import { useAuth } from "../contexts/AuthContext"

const MyProfile: React.FC = () => {
  const [error, setError] = useState("")
  const history = useHistory()
  const { currentUser} = useAuth()
  const [data, setData] = useState([])
  
  async function getPicture(fileName){

      // Create a reference to the file we want to download
      const storageRef = app.storage().ref(`/images/${fileName}`);

      // Get the download URL
      storageRef.getDownloadURL()
      .then((url) => {
        return(
          <img src={url} alt="img"></img>
        )
      })
      .catch((error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
        default:
          break;
  }
});


  }

  useEffect(() => {
    console.log(currentUser)
    const db = app.firestore();
    db.collection("users")
    .where("userid", "==", currentUser.uid)
    .get()
    .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        setData(Array.from(data))
        
    console.log(data); // array of users objects
    });

  });

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
        <Card.Title>
        <h2 className="text-center mb-4">Min profil</h2>
        </Card.Title>
        <Card.Body>
        
        { 
          data.map((file) => {

            const url = getPicture(file.file)
            return(
              <li>
                <img alt ="hei" src ={url}></img>
              </li>
            )
          })
        }  

        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleDashboard}>
          Oppdater profil/Loggut
        </Button>
      </div>
      <Button className= "w-100 text-center mt-2" variant="link" onClick={() => history.push("/")}>
          Hovedside
        </Button>
    </>
  )
}

export default MyProfile;