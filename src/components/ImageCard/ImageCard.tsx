import React from "react";
import { ImageCardProps } from "../../shared/types";
import { useHistory } from "react-router-dom";
import { useRouteMatch } from "react-router-dom";

// type ImageCardProps = TaskCardProps | CompetitionCardProps;

const ImageCard = (props: ImageCardProps) => {
  const history = useHistory();
  const match = useRouteMatch();

  return (
    <div
      className="competition-card"
      tabIndex={0}
      role="button"
      onClick={() => {
        props.isTask
          ? history.push({ pathname: `${match.url}/${props.name}` })
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
