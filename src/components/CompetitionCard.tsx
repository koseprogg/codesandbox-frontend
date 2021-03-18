import React from "react";
import { CompetitionCardProps } from "../shared/types";

const CompetitionCard = (props: CompetitionCardProps) => {
  return (
    <div className="competition-card">
      <img
        className="competition-card-image"
        src={props.image}
        alt={props.name}
      ></img>
      <p>{props.name}</p>
    </div>
  );
};

export default CompetitionCard;
