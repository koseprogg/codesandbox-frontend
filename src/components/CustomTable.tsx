import React from "react";

import { Table, Alert } from "react-bootstrap";

type Props = {
  data?: React.ReactNode;
  error?: string;
  isCompetitionLeaderboard: boolean;
};

const CustomTable: React.FC<Props> = ({
  data,
  error,
  isCompetitionLeaderboard,
}: Props) => {
  return (
    <>
      {!error && data ? (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
              {isCompetitionLeaderboard ? (
                <></>
              ) : (
                <>
                  <th>Kjøretid</th>
                  <th>Tegn brukt</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>{data}</tbody>
        </Table>
      ) : (
        <Alert variant="danger">{error}</Alert>
      )}
    </>
  );
};

export default CustomTable;
