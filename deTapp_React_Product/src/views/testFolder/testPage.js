import React from 'react';
import { Grid, TextField, Checkbox, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { styled } from '@mui/system';

const schema = yup.object().shape({
  // Validation schema defined based on columnsData structure
  // Example: field1: yup.string().required('Field 1 is required'),
  // Add validation rules based on your columnsData
});

const DynamicForm = ({ columnsData }) => {
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    // Handle form submission using Axios or any other API library
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {columnsData.map((column) => (
          <Grid item key={column.columnName}>
            {column.dataType === 'varchar' && (
              <Controller
                name={column.columnName}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={column.columnLabel}
                    fullWidth
                    error={!!errors[column.columnName]}
                    helperText={errors[column.columnName]?.message}
                    inputProps={{ maxLength: column.maxLength }}
                  />
                )}
              />
            )}
            {column.dataType === 'checkbox' && (
              <Controller
                name={column.columnName}
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors[column.columnName]}
                  >
                    <InputLabel>{column.columnLabel}</InputLabel>
                    <Select
                      {...field}
                      multiple
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {column.options.map((option) => (
                        <MenuItem key={option} value={option}>
                          <Checkbox checked={field.value.includes(option)} />
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors[column.columnName]?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            )}
          </Grid>
        ))}
      </Grid>
      <Button type="submit" variant="contained" color="primary">Submit</Button>
    </form>
  );
};

export default DynamicForm;
