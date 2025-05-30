import React from "react";
import { BrowserRouter as Router, Routes, Route,  } from "react-router-dom";
import Page404 from "../PageComponents/404";
import TitleBar from "@/components/TitleBar";
import About from "@/PageComponents/About";
import Users from "@/PageComponents/Users";
import Cars from "@/PageComponents/Cars";


export default function App() {
  return (
    <Router>
      <TitleBar />
      <main className="h-[calc(100vh-4.5rem)] flex flex-col">
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>
    </Router>
  );
}
