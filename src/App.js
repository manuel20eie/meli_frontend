// React
import React, { useState } from "react";
// Context
import { AppContext } from "./libs/contextLib";
// Routes
import ContainersRoutes from "./Routes";
// Styles
import "./sass/app.scss";

function App() {
  const [userData, setUserData] = useState(null);
  return (
    <div className="App">
      <AppContext.Provider value={{ userData, setUserData }}>
        <ContainersRoutes />
      </AppContext.Provider>
    </div>
  );
}

export default App;
