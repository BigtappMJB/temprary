import React, { useState } from "react";
import { Grid, TextField, IconButton, Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const DropdownInputForm = ({ onChange }) => {
  const [dropdownValues, setDropdownValues] = useState([""]);

  const handleDropdownValueChange = (index, value) => {
    const updatedValues = [...dropdownValues];
    updatedValues[index] = value;
    setDropdownValues(updatedValues);
    onChange(updatedValues); // Pass values back to parent component
  };

  const addDropdownField = () => {
    setDropdownValues([...dropdownValues, ""]);
  };

  const removeDropdownField = (index) => {
    const updatedValues = [...dropdownValues];
    updatedValues.splice(index, 1);
    setDropdownValues(updatedValues);
    onChange(updatedValues); // Pass updated values back to parent component
  };

  return (
    <Grid container spacing={2}>
      {dropdownValues.map((value, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <TextField
            label={`Dropdown Option ${index + 1}`}
            value={value}
            onChange={(e) => handleDropdownValueChange(index, e.target.value)}
            fullWidth
          />
          {dropdownValues.length > 1 && (
            <IconButton
              color="error"
              onClick={() => removeDropdownField(index)}
              size="small"
              sx={{ mt: 1 }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          )}
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button onClick={addDropdownField} variant="outlined">
          Add Dropdown Option
        </Button>
      </Grid>
    </Grid>
  );
};

export default DropdownInputForm;
