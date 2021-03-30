import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import { useFetch } from "../hooks/useFetch";
import { User } from "../shared/types";
import CustomTable from "./CustomTable";
import config from "../config";

type Props = {
  name: string;
  day?: string;
  task?: string;
  isCompetitionLeaderboard: boolean;
};

type PlayerScore = {
  _id: string;
  score: number;
  users: User;
  executionTime?: number;
  characterCount?: number;
};

const LeaderBoard = (props: Props): JSX.Element => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { name, day, task, isCompetitionLeaderboard } = props;

  const url =
    day && name
      ? `${config.BACKEND_URL}/competitions/${name}/day/${day}/leaderboard`
      : `${config.BACKEND_URL}/competitions/${name}/leaderboard`;
  const { response, error } = useFetch<PlayerScore[]>(url);

  return (
    <>
      <div className="main-heading">
        <Button variant="primary" onClick={handleShow}>
          Se ledertavle
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {day ? `Dag ${day}: ${task || ""}` : "Samlet ledertavle"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomTable
            data={
              response &&
              response.map((player: PlayerScore) => (
                <tr key={player._id}>
                  <td>{player.users.username}</td>
                  <td>{player.score}</td>
                  {isCompetitionLeaderboard ? (
                    <> </>
                  ) : (
                    <>
                      <td>
                        {player.executionTime
                          ? `${player.executionTime} ms`
                          : "-"}
                      </td>
                      <td>
                        {player.characterCount
                          ? `${player.characterCount} tegn`
                          : "-"}
                      </td>
                    </>
                  )}
                </tr>
              ))
            }
            isCompetitionLeaderboard={isCompetitionLeaderboard}
            error={error?.toString()}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Lukk
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaderBoard;
