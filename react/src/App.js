import { BrowserRouter, Route, Routes  } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/LoggedInNavbar";
import PublicNavbar from "./components/PublicNavbar";
import Register from "./components/Register";
import Homepage from "./components/Homepage";
import CreateQuizz from "./components/CreateQuizz";
import TakeQuizz from "./components/TakeQuizz";

import { useSelector } from 'react-redux'

function App() {
  
  const refreshToken = useSelector(state => state.auth.refreshToken)

  return (

    <>

    

    <BrowserRouter>

      
        { refreshToken.length > 0 ? 
          <Navbar />
          :
          <PublicNavbar />
        }


      <Routes>

        <Route exact path="/" element={<><Homepage /></>} />
        <Route path="/login"  element={<><Login /></>} />
        <Route path="/register"  element={<><Register /></>} />
        <Route path="/dashboard"  element={<><Dashboard /></>} />
        <Route path="/create-quizz"  element={<><CreateQuizz /></>} />
        <Route path="/quizz/:slug" element={<><TakeQuizz /></>} />
      </Routes>
    </BrowserRouter>

    </>
  );
}
 
export default App;