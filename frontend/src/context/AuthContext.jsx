import { useAuth0 } from "@auth0/auth0-react";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const {
    user,
    loginWithRedirect,
    logout,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const saveUser = async () => {
      if (isAuthenticated && user) {
        try {
          const accessToken = await getAccessTokenSilently();
          // console.log("Access Token:", accessToken);
          const res = await axios.post(
            `${baseUrl}/users`,
            {
              sub: user.sub,
              name: user.name,
              email: user.email,
              picture: user.picture,
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );

          setCurrentUser(res.data);
        } catch (error) {
          console.error("Error storing user:", error);
        }
      }
    };

    saveUser();
  }, [isAuthenticated, user]);

  return (
    <AuthContext.Provider
      value={{ loginWithRedirect, logout, isAuthenticated, currentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
