import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Chatbot from "./components/Chatbot";


function App() {


  return (
    <main>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chatbot />} />
      </Routes>
    </main>
  );
}

export default App;