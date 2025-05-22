import React from "react";
import logo from "./logo.svg";
import "./App.css";
import UserGet from "./components/UserGet";
import GenerateApp from "./components/GenerateApp";
import DownloadFile from "./components/DownloadFile";

function App() {
  return (
    <div>
      <UserGet />
      <GenerateApp />
      <DownloadFile />
    </div>
  );
}

export default App;
