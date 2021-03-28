import React, { useState } from "react";

import { Task } from "../shared/types";
import { Table, Alert } from "react-bootstrap";
import { useFetch } from "../hooks/useFetch";

const backendUrl = "http://localhost:3000";

type Props = {
  name?: string;
  day?: string;
};

type PlayerScore = {
  _id: string;
  score: number;
};

const CustomTable: React.FC<Props> = ({ name, day }: Props) => {
  const url =
    day && name
      ? `${backendUrl}/competitions/${name}/day/${day}/leaderboard`
      : `${backendUrl}/competitions/leaderboard`;
  const { response, error } = useFetch(url);

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {response ? (
          response.map((player: PlayerScore) => (
            <tr key={player._id}>
              <td>{player._id}</td>
              <td>{player.score}</td>
            </tr>
          ))
        ) : (
          <Alert variant="danger">{error}</Alert>
        )}
      </tbody>
    </Table>
  );
};

export default CustomTable;
