import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SCPList from "./components/SCPList";
import SCPView from "./components/SCPView";
import SCPForm from "./components/SCPForm";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 12, background: "#0b1220" }}>
        <Link to="/" style={{ marginRight: 12, color: "#9ad0ff" }}>SCPs</Link>
        <Link to="/create" style={{ color: "#9ad0ff" }}>Add SCP</Link>
      </nav>
      <div style={{ maxWidth: 1000, margin: "2rem auto", padding: "0 1rem" }}>
        <Routes>
          <Route path="/" element={<SCPList />} />
          <Route path="/create" element={<SCPForm />} />
          <Route path="/edit/:id" element={<SCPForm />} />
          <Route path="/view/:id" element={<SCPView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
