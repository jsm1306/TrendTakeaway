
// import Home from "./components/Home"; 
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import MyComponent from "./components/MyComponent";
import Home from "./components/Home";
const App: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <><><Home /></><div>
      
        <>
          
          <MyComponent />
        </>
      
    </div></>
  );
};

export default App;