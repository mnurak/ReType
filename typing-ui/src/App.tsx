import Header from "./components/layout/Headder";
import Footer from "./components/layout/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/auth/Auth";
import AuthState from "./context/auth/AuthState";

function App() {
  return (
    <>
      <div className="min-h-screen p-6 flex flex-col ">
        {/* added auth State as it is needed for the headder and the pdf component and page  */}
        <AuthState>
          <Header />
          <div className="flex-1 flex" id="body">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        </AuthState>
        <Footer />
      </div>
    </>
  );
}

export default App;
