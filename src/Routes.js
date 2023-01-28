// React
import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./containers/Home";
import Profile from "./containers/Profile";
import NotFound from "./containers/NotFound";

export default function ContainersRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
