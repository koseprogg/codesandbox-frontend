import React from "react";
import ImageCard from "./ImageCard/ImageCard";
import { useRouteMatch } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { Task } from "../shared/types";
import config from "../config";

interface MatchParams {
  name: string;
}

const CompetitionPage = () => {
  const [tasks, setTasks] = React.useState<Task[]>();
  const match = useRouteMatch<MatchParams>("/:name");

  const { response, error } = match
    ? useFetch(`${config.BACKEND_URL}/competitions/${match?.params.name}`)
    : undefined;

  React.useEffect(() => {
    if (response != null && !error) {
      const tasks: Task[] = response.tasks;
      setTasks(tasks);
    }
  });

  return (
    <div>
      <h1 className="main-heading">{match?.params.name}</h1>
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
