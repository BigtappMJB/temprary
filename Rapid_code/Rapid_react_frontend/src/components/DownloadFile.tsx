import { useState } from "react";
import api from "../api/globalApi";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

function DownloadFile() {
  const [fileName, setFileName] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  const handleDownload = async () => {
    try {
      const response = await api.get(`/download/${fileName}`, {
        responseType: "blob",
      });

      // Check if the file is not found
      if (response.status === 404 || response.data === "File not found") {
        setResponseMsg("Error: File not found");
      } else {
        // File found, start the download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Success message after download
        setResponseMsg("File downloaded successfully!");
      }
    } catch (err) {
      // In case of other errors
      console.error("Error downloading file:", err);
      setResponseMsg(
        "Either the file name is incorrect or the file is unavailable. Please check the file name and try again. If the problem persists, contact the admin team for assistance."
      );
    }
  };

  return (
    <div>
      <h2>Download Generated Application</h2>
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        placeholder="Enter filename (e.g., app.jar)"
      />
      <button onClick={handleDownload}>Download</button>
      {responseMsg && (
        <div
          style={{
            backgroundColor: responseMsg.includes("unavailable")
              ? "#f44336"
              : "#4CAF50",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            marginTop: "10px",
            fontWeight: "bold",
          }}
        >
          {responseMsg}
        </div>
      )}
    </div>
  );
}

export default DownloadFile;
