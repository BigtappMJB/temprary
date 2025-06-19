import React, { useState } from "react";
import { Grid, TextField, IconButton, Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const CheckboxInputForm = ({ onChange }) => {
  const [checkboxValues, setCheckboxValues] = useState([""]);

  const handleCheckboxValueChange = (index, value) => {
    const updatedValues = [...checkboxValues];
    updatedValues[index] = value;
    setCheckboxValues(updatedValues);
    onChange(updatedValues); // Pass values back to parent component
  };

  const addCheckboxField = () => {
    setCheckboxValues([...checkboxValues, ""]);
  };

  const removeCheckboxField = (index) => {
    const updatedValues = [...checkboxValues];
    updatedValues.splice(index, 1);
    setCheckboxValues(updatedValues);
    onChange(updatedValues); // Pass updated values back to parent component
  };

  return (
    <Grid container spacing={2}>
      {checkboxValues.map((value, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <TextField
            label={`Checkbox ${index + 1} Value`}
            value={value}
            onChange={(e) => handleCheckboxValueChange(index, e.target.value)}
            fullWidth
          />
          {checkboxValues.length > 1 && (
            <IconButton
              color="error"
              onClick={() => removeCheckboxField(index)}
              size="small"
              sx={{ mt: 1 }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          )}
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button onClick={addCheckboxField} variant="outlined">
          Add Checkbox
        </Button>
      </Grid>
    </Grid>
  );
};

export default CheckboxInputForm;
