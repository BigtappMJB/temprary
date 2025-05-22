import { useRef, useState } from "react";
import api from "../api/globalApi";
import "./styles/GenerateApp.css";
import React from "react";

type Field = {
  name: string;
  type: string;
  primary: boolean;
};

function GenerateApp() {
  const [className, setClassName] = useState("");
  const [fields, setFields] = useState<Field[]>([
    { name: "", type: "String", primary: false },
  ]);
  const [primaryCount, setPrimaryCount] = useState(0);
  const [responseMsg, setResponseMsg] = useState("");

  const handleFieldChange = (
    index: number,
    key: keyof Field,
    value: string | boolean
  ) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value as never;
    setFields(updatedFields);
    // console.log("Updadsvdsvsvsds:" + index);
    if (key === "primary") {
      if (value === true) {
        // When checkbox is checked, set primaryCount to 1 (means primary selected)
        setPrimaryCount(1);
      } else {
        // When checkbox is unchecked, reset primaryCount to 0
        setPrimaryCount(0);
      }
    }
  };

  const showMessage = (message: string, time = 5000) => {
    setResponseMsg(message);

    // Clear the message after the specified duration
    setTimeout(() => {
      setResponseMsg(""); // Clear the message
    }, time);
  };

  const removeField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
    // console.log(primaryCount, "indexxxxxxxxxx", index);
    if (primaryCount === index || index === 0) {
      setPrimaryCount(0); // reset primaryCount because primary field is removed
    }
  };

  const addField = () => {
    setFields([...fields, { name: "", type: "String", primary: false }]);
  };

  const handleGenerate = async () => {
    try {
      const payload = {
        className: className.startsWith("com.codegen.model.")
          ? className
          : `com.codegen.model.${className}`,
        fields,
      };
      const response = await api.post("/generateApp", payload);
      // setResponseMsg(response.data.message);
      showMessage("Application generated successfully!");
    } catch (err) {
      // console.error("Error generating app:", err);
      showMessage(
        "Application generation failed due to missing constraints. Please check the input details and try again. If the problem persists, contact the admin team for assistance."
      );
    }
  };

  return (
    <div className="container my-5 p-4 border rounded shadow-sm bg-light">
      <h2 className="mb-4 text-primary">Generate Spring Boot App </h2>
      <input
        type="text"
        className="form-control mb-2"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        placeholder="Enter Entity name (e.g., User)"
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <small className="text-muted mb-3 d-block" style={{ color: "#888" }}>
        Will be generated as <strong>{className} applciation</strong>
      </small>

      <h3 className="mb-3">Fields</h3>
      {fields.map((field, index) => (
        <div key={index} className="d-flex align-items-center gap-3 mb-3">
          <input
            type="text"
            placeholder="Name"
            value={field.name}
            className="form-control"
            onChange={(e) => handleFieldChange(index, "name", e.target.value)}
          />
          <label htmlFor={`field-type-${index}`}>Field Type</label>
          <select
            id={`field-type-${index}`}
            value={field.type}
            className="form-select"
            onChange={(e) => handleFieldChange(index, "type", e.target.value)}
          >
            <option value="String">String</option>
            <option value="Long">Long</option>
            <option value="Integer">Integer</option>
            <option value="Double">Double</option>
            <option value="Boolean">Boolean</option>
            <option value="LocalDateTime">LocalDateTime</option>
            <option value="Date">Date</option>
            <option value="BigDecimal">BigDecimal</option>
            <option value="Float">Float</option>
            <option value="Character">Character</option>
            <option value="Byte">Byte</option>
            <option value="Short">Short</option>
            <option value="UUID">UUID</option>
            <option value="List">List</option>
            <option value="Set">Set</option>

            <option value="Optional">Optional</option>
            <option value="Time">Time</option>
            <option value="Timestamp">Timestamp</option>
          </select>

          {primaryCount === 0 ? (
            <input
              type="checkbox"
              checked={field.primary}
              onChange={(e) =>
                handleFieldChange(index, "primary", e.target.checked)
              }
              className="checkbox-enabled form-check-input"
            />
          ) : (
            <input
              type="checkbox"
              checked={field.primary}
              onChange={(e) =>
                handleFieldChange(index, "primary", e.target.checked)
              }
              disabled
              className="checkbox-disabled form-check-input"
            />
          )}

          <label className="form-check-label">Primary</label>

          <button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to remove this field?")
              ) {
                removeField(index);
              }
            }}
            className="btn btn-danger btn-sm"
          >
            Remove
          </button>
        </div>
      ))}

      <button className="btn btn-secondary me-2" onClick={addField}>
        Add Field
      </button>
      <br />
      <br />
      <button className="btn btn-primary" onClick={handleGenerate}>
        Generate
      </button>

      {responseMsg && (
        <div
          style={{
            backgroundColor: responseMsg.includes("failed")
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

export default GenerateApp;
