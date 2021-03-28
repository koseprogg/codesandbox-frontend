import React from "react";

import { Table, Alert } from "react-bootstrap";

type Props = {
  data?: React.ReactNode;
  error?: string;
};

const CustomTable: React.FC<Props> = ({ data, error }: Props) => {
  return (
    <>
      {!error && data ? (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
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
