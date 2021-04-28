import React from "react";
import { Link } from "react-router-dom";
import ImageCard from "./ImageCard/ImageCard";
import { useRouteMatch } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { Task } from "../shared/types";
import config from "../config";
import LeaderBoard from "./LeaderBoard";
import { Button } from "react-bootstrap";

interface MatchParams {
  name: string;
}

interface Competition {
  tasks: Task[];
  canEdit: boolean;
}

const CompetitionPage = (): JSX.Element => {
  const [comp, setComp] = React.useState<Competition>();
  const match = useRouteMatch<MatchParams>("/:name");

  const { response, error } = match
    ? useFetch<Competition>(
        `${config.BACKEND_URL}/competitions/${match?.params.name}`
      )
    : { response: null, error: null };

  React.useEffect(() => {
    if (response != null && !error) {
      setComp(response);
    }
  });

  return (
    <div>
      <h1 className="main-heading">{match?.params.name}</h1>
      {comp?.canEdit && (
        <div className="center">
          <Link
            to={`/${match?.params.name || ""}/new`}
            className="header-main-link"
          >
            <Button variant="secondary">Ny kodenøtt</Button>
          </Link>
        </div>
      )}
      {match?.params.name && (
        <LeaderBoard
          name={match?.params.name}
          isCompetitionLeaderboard={true}
        />
      )}
      <div className="competition-container">
        {comp?.tasks?.map((task, i: number) => {
          return (
            <ImageCard
              key={i}
              name={task.name}
              image={task.image}
              // isActive={true}
              isTask={true}
              day={task.day}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CompetitionPage;
