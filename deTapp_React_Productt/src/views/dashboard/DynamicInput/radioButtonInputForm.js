import React, { useState } from "react";
import { Grid, TextField, IconButton, Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const RadioButtonInputForm = ({ onChange }) => {
  const [radioValues, setRadioValues] = useState([""]);

  const handleRadioValueChange = (index, value) => {
    const updatedValues = [...radioValues];
    updatedValues[index] = value;
    setRadioValues(updatedValues);
    onChange(updatedValues); // Pass values back to parent component
  };

  const addRadioField = () => {
    setRadioValues([...radioValues, ""]);
  };

  const removeRadioField = (index) => {
    const updatedValues = [...radioValues];
    updatedValues.splice(index, 1);
    setRadioValues(updatedValues);
    onChange(updatedValues); // Pass updated values back to parent component
  };

  return (
    <Grid container spacing={2}>
      {radioValues.map((value, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <TextField
            label={`Radio Button ${index + 1} Value`}
            value={value}
            onChange={(e) => handleRadioValueChange(index, e.target.value)}
            fullWidth
          />
          {radioValues.length > 1 && (
            <IconButton
              color="error"
              onClick={() => removeRadioField(index)}
              size="small"
              sx={{ mt: 1 }}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          )}
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button onClick={addRadioField} variant="outlined">
          Add Radio Button
        </Button>
      </Grid>
    </Grid>
  );
};

export default RadioButtonInputForm;
