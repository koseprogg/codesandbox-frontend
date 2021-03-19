import React from "react";
import { ImageCardProps } from "../shared/types";
import { useHistory } from "react-router-dom";
import { useRouteMatch } from "react-router-dom";

const ImageCard = (props: ImageCardProps) => {
  const history = useHistory();
  const match = useRouteMatch();

  return (
    <div
      className="competition-card"
      onClick={() => {
        props.isTask
          ? history.push({ pathname: `${match.url}/day/${props.day}` })
          : history.push({
              pathname: props.name,
            });
      }}
    >
      <img
        className="competition-card-image"
        src={props.image}
        alt={props.name}
      ></img>
      <p>{props.name}</p>
    </div>
  );
};

export default ImageCard;
