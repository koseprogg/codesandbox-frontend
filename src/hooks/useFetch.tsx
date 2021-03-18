/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState, useEffect } from "react";
import axios from "axios";

export const useFetch = (url: string): any => {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(url);
        setResponse(res.data);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [url]);
  return { response, error };
};
