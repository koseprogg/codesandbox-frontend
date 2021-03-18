import React from "react";
import ImageCard from "./ImageCard";
import { useRouteMatch } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

const backendUrl = "http://localhost:3000";

const CompetitionPage = () => {
  const [tasks, setTasks] = React.useState();
  const match = useRouteMatch();

  const { response, error } = useFetch(
    `${backendUrl}/competitions/${match.params.name}`
  );

  React.useEffect(() => {
    if (response != null && !error) {
      setTasks(response.tasks);
    }
  });

  return (
    <div>
      <h1 className="main-heading">{match.params.name}</h1>
      <div className="competition-container">
        {tasks &&
          tasks.map((task, i: number) => {
            console.log(tasks);
            return (
              <ImageCard
                key={i}
                name={task.name}
                image={task.image}
                isActive={true}
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
