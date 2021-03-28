import React from "react";
import { Competition } from "../shared/types";
import ImageCard from "./ImageCard/ImageCard";
import { useFetch } from "../hooks/useFetch";
import "./Mainpage.scss";
import config from "../config";

const Mainpage: React.FC = () => {
  const [competitions, setCompetitions] = React.useState<Competition[]>([]);

  const { response, error } = useFetch(`${config.backendUrl}/competitions`);

  React.useEffect(() => {
    if (response != null && !error) {
      setCompetitions(response);
    }
    console.log("competitions is: ", competitions);
  });

  return (
    <div className="competition-container">
      {competitions.length > 0 ? (
        competitions.map((competition, i: number) => {
          return (
            <ImageCard
              key={i}
              name={competition.name}
              image={competition.image}
              isTask={false}
              // isActive={competition.isActive}
            />
          );
        })
      ) : (
        <div>Ingen nøtt å finne.</div>
      )}
    </div>
  );
};

export default Mainpage;
