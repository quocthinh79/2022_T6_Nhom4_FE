import logo from "./logo.svg";
import "./App.css";
import { HashRouter as Router, Link, Route, Routes } from "react-router-dom";
import { publicRoutes } from "./routes";
import React, { Suspense } from "react";

function App() {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <Router>
        <div className="App">
          <Routes>
            {publicRoutes.map((route, index) => {
              const Page = route.page;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}
          </Routes>
        </div>
      </Router>
    </Suspense>
  );
}

export default App;
