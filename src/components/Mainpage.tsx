/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import {Figure, Button, Card} from "react-bootstrap";
import "./mainpage.css";


const Mainpage: React.FC = () => {

  const dager = [{"day": "Dag 1", "img": "../components/easter.jpg", "caption": "Yoyoy lesssgo"},{"day": "Dag 2", "img": "./easter.jpg", "caption": "Yoyoy lesssgo"},{"day": "Dag 3", "img": "./easter.jpg", "caption": "Yoyoy lesssgo"}, {"day": "Dag 4", "img": "./easter.jpg", "caption": "Yoyoy lesssgo"}, {"day": "Dag 5", "img": "./easter.jpg", "caption": "Yoyoy lesssgo"}]
  const data = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Victor Wayne" },
    { id: 3, name: "Jane Doe" },
  ];
  data.map(d=>{console.log(d.name)});

  return (
    <div>
      <div id="main-bunny">
      <Figure>
      <Figure.Image
      width={171}
      height={180}
      alt="171x180"
      src= "../images/bunny.png"
      />
      </Figure>
      </div>
      <h1 id = "mainpage-title">Abakus påseknøtt 2021</h1>

      <ul id = "flex-parent">
        {dager.map(d => (
          <li className = "flex-child" key = {d.day}>
           <Card style={{ width: '19rem' }}>
           <Card.Img variant="top" src="../images/js.png" />
          </Card>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default Mainpage;
