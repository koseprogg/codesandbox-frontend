/* eslint-disable prettier/prettier */
import React from "react";
import { Figure } from "react-bootstrap";
import { Competition } from "../shared/types";
import ImageCard from "./ImageCard/ImageCard";
import { useFetch } from '../hooks/useFetch';
import Axios from 'axios';
import "./Mainpage.scss";
import CustomTable from "./CustomTable";

const abakusLogo = require('../../public/images/abakus_logo_improved.png').default;

const backendUrl = 'http://localhost:3000';

const competitions = [
  {
    name: "Påskenøtter 2021",
    image: "https://thumbs.dreamstime.com/b/toy-easter-chickne-2102239.jpg",
    isActive: true
  },
  {
    name: "Julenøtter 2021",
    image: "https://image.forskning.no/122244.jpg?imageId=122244&width=480&height=274",
    isActive: true
  },
  {
    name: "Ballenøtter 2021",
    image: "https://lyngstadernaering.no/wp-content/uploads/2014/06/breads_flavored_with_onion_and_garlic_2.jpg",
    isActive: true
  }
];

const Mainpage: React.FC = () => {
  const [competitions, setCompetitions] = React.useState<Competition[]>([]);

  const { response, error } = useFetch(`${backendUrl}/competitions`);

  React.useEffect(() => {
    if (response != null && !error) {
      setCompetitions(response);
    }
    console.log("competitions is: ", competitions);
  })

  return (
    <div id="mainpage">
      <div className="main-header-container">
        <h1 className="main-heading">Kodenøtter</h1>
        <img height="50" src={abakusLogo} alt={'abakuslogo'} />
      </div>
      <div className="competition-container">
        {competitions.length > 0 ? competitions.map((competition, i: number) => {
          return <ImageCard
            key={i}
            name={competition.name}
            image={competition.image}
            isTask={false}
          // isActive={competition.isActive} 
          />
        })
          :
          <div>
            <CustomTable/>
          </div>
          }
      </div>
    </div>
  );
};

export default Mainpage;
