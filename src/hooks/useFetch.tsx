import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

type Fetch<ResType> = { response: ResType | null; error: string | null };

export const useFetch = <ResType extends unknown>(
  url: string
): Fetch<ResType> => {
  const [response, setResponse] = useState<ResType | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("auth");
        const config = token
          ? { headers: { Authorization: `JWT ${token}` } }
          : undefined;
        const res = await axios.get(url, config);
        setResponse(res.data);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [url]);
  return { response, error };
};
