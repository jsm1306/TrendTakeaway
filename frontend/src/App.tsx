import Navbar from "./components/NavBar"; 
import { Button } from "./components/ui/button"; 
import Home from "./components/Home"; 
const App = () => {
  return (
    <>
      <Navbar />
      <Home size={64} />
     <h1>HELLO WORLD</h1>
      </>
  );
};

export default App;
