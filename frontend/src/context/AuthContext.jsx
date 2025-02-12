import { useAuth0 } from "@auth0/auth0-react";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(); // Ensure context is created before using it

export const AuthProvider = ({ children }) => {
  const { user, loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const saveUser = async () => {
      if (isAuthenticated && user) {  // Ensure user is authenticated before making API call
        try {
          const accessToken = await getAccessTokenSilently();
          const res = await axios.post(
            "http://localhost:5000/api/users",
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
  }, [isAuthenticated, user]); // Depend on `isAuthenticated` and `user`

  return (
    <AuthContext.Provider value={{ loginWithRedirect, logout, isAuthenticated, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider"); // Ensure it's used inside provider
  }
  return context;
};
