import React, { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { useRouteMatch } from "react-router-dom";
import { Task } from "../shared/types";
import {Table} from "react-bootstrap";

const backendUrl = "http://localhost:3000";

const hardCodedListWithScores = [{name: "Marius", value: 100}, {name: "Mithu", value: 50}, {name: "Åsmund", value: 1}];

interface MatchParams {
  name: string;
  day: string;
}

const CustomTable: React.FC = () => {
  const [task, setTask] = useState<Task>();
  const [errorMsg, setErrorMsg] = useState("");

  const match = useRouteMatch<MatchParams>("/:name/day/:day");

  const { response, error } = match
    ? useFetch(
        `${backendUrl}/competitions/${match.params.name}/day/${match.params.day}`
      )
    : null;

  React.useEffect(() => {
    if (response != null && !error) {
      const task: Task = response.tasks[0];
      setTask(task);
    }
  });

  return (
<Table striped bordered hover size="sm">
<thead>
    <tr>
      <th>Name</th>
      <th>Score</th>
    </tr>
  </thead>
  <tbody>
  {hardCodedListWithScores.map(player => (
    <tr>
    <td>{player.name}</td>
    <td>{player.value}</td>
    </tr>
  ))}
  </tbody>

</Table>
  )
};

export default CustomTable;
