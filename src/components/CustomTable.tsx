import React, { useState, useEffect } from "react";

import { Task } from "../shared/types";
import {Table} from "react-bootstrap";


const hardCodedListWithScores = [{name: "Marius", value: 100}, {name: "Mithu", value: 50}, {name: "Åsmund", value: 1}];
const CustomTable: React.FC = () => {
  const [task, setTask] = useState<Task>();
  const [errorMsg, setErrorMsg] = useState("");

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
