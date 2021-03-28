import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

type User = {
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  profilePicture: string;
  accessToken: string;
};

export const useAuth = (): { user: User | null; logOut: () => void | null } => {
  const [user, setUser] = useState<User | null>(null);

  const logOut = () => {
    Cookies.remove("auth");
    setUser(null);
  };

  useEffect(() => {
    const token = Cookies.get("auth");
    if (token) {
      const userData: { data: User; exp: number } | null = jwt_decode(token);
      if (userData?.exp && Date.now() >= userData.exp * 1000) {
        logOut();
        return;
      }
      userData && setUser({ ...userData.data, accessToken: token });
    }
  }, []);

  return { user, logOut };
};
