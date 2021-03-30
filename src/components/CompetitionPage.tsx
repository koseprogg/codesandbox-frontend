import React from "react";
import ImageCard from "./ImageCard/ImageCard";
import { useRouteMatch } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { Task } from "../shared/types";
import config from "../config";
import LeaderBoard from "./LeaderBoard";

interface MatchParams {
  name: string;
}

interface Competition {
  tasks: Task[];
}

const CompetitionPage = (): JSX.Element => {
  const [tasks, setTasks] = React.useState<Task[]>();
  const match = useRouteMatch<MatchParams>("/:name");

  const { response, error } = match
    ? useFetch<Competition>(
        `${config.BACKEND_URL}/competitions/${match?.params.name}`
      )
    : { response: null, error: null };

  React.useEffect(() => {
    if (response != null && !error) {
      const tasks = response.tasks;
      setTasks(tasks);
    }
  });

  return (
    <div>
      <h1 className="main-heading">{match?.params.name}</h1>
      {match?.params.name && (
        <LeaderBoard
          name={match?.params.name}
          isCompetitionLeaderboard={true}
        />
      )}
      <div className="competition-container">
        {tasks &&
          tasks.map((task, i: number) => {
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
