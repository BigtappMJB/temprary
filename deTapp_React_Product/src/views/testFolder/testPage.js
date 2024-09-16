import React, { useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { Grid, TextField, Checkbox, FormControlLabel, RadioGroup, FormControl, FormLabel, Radio, Select, MenuItem, Button, FormHelperText, Box } from '@mui/material';
import { css } from '@emotion/react';

/**
 * DynamicForm Component: Renders a dynamic form based on input data
 * @param {Object} props - Component properties
 * @param {Object} props.columnsData - Data defining the form fields
 */
const DynamicForm = ({ columnsData }) => {
  // Create validation schema and default values dynamically based on columnsData
  const validationSchema = useMemo(() => {
    const schema = {};
    for (const key in columnsData) {
      const column = columnsData[key];
      if (column.IS_NULLABLE === 'NO' && column.DATA_TYPE === 'varchar') {
        schema[column.COLUMN_NAME.COLUMN_NAME] = yup
          .string()
          .required('This field is required')
          .max(column.CHARACTER_MAXIMUM_LENGTH, `Maximum ${column.CHARACTER_MAXIMUM_LENGTH} characters`);
      } else if (column.DATA_TYPE === 'date') {
        schema[column.COLUMN_NAME.COLUMN_NAME] = yup.date().required('This field is required');
      } else if (column.inputType.NAME === 'CHECKBOX') {
        schema[column.COLUMN_NAME.COLUMN_NAME] = yup
          .array()
          .min(1, 'Select at least one option');
      } else if (column.inputType.NAME === 'RADIO') {
        schema[column.COLUMN_NAME.COLUMN_NAME] = yup.string().required('This field is required');
      }
    }
    return yup.object().shape(schema);
  }, [columnsData]);

  const defaultValues = useMemo(() => {
    const values = {};
    for (const key in columnsData) {
      const column = columnsData[key];
      values[column.COLUMN_NAME.COLUMN_NAME] = column.inputType.NAME === 'CHECKBOX' ? [] : '';
    }
    return values;
  }, [columnsData]);

  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const onSubmit = useCallback(async (data) => {
    try {
      const response = await axios.post('/api/submit', data);
      console.log(response.data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, []);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: '100%', padding: 2 }}
      noValidate
    >
      <Grid container spacing={3}>
        {Object.values(columnsData).map((column) => (
          <Grid item xs={12} sm={6} md={4} key={column.COLUMN_NAME.COLUMN_NAME}>
            <Controller
              name={column.COLUMN_NAME.COLUMN_NAME}
              control={control}
              render={({ field }) => {
                switch (column.inputType.NAME) {
                  case 'TEXT':
                    return (
                      <TextField
                        {...field}
                        label={column.COLUMN_NAME.COLUMN_NAME}
                        variant="outlined"
                        fullWidth
                        error={!!errors[column.COLUMN_NAME.COLUMN_NAME]}
                        helperText={errors[column.COLUMN_NAME.COLUMN_NAME]?.message}
                      />
                    );

                  case 'DATE':
                    return (
                      <TextField
                        {...field}
                        label={column.COLUMN_NAME.COLUMN_NAME}
                        variant="outlined"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!errors[column.COLUMN_NAME.COLUMN_NAME]}
                        helperText={errors[column.COLUMN_NAME.COLUMN_NAME]?.message}
                      />
                    );

                  case 'RADIO':
                    return (
                      <FormControl component="fieldset" error={!!errors[column.COLUMN_NAME.COLUMN_NAME]}>
                        <FormLabel component="legend">{column.COLUMN_NAME.COLUMN_NAME}</FormLabel>
                        <RadioGroup {...field} row>
                          {Object.values(column.optionsList).map((option, index) => (
                            <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                          ))}
                        </RadioGroup>
                        <FormHelperText>{errors[column.COLUMN_NAME.COLUMN_NAME]?.message}</FormHelperText>
                      </FormControl>
                    );

                  case 'DROPDOWN':
                    return (
                      <FormControl fullWidth error={!!errors[column.COLUMN_NAME.COLUMN_NAME]}>
                        <Select
                          {...field}
                          label={column.COLUMN_NAME.COLUMN_NAME}
                          variant="outlined"
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {Object.values(column.optionsList).map((option, index) => (
                            <MenuItem key={index} value={option}>{option}</MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors[column.COLUMN_NAME.COLUMN_NAME]?.message}</FormHelperText>
                      </FormControl>
                    );

                  case 'CHECKBOX':
                    return (
                      <FormControl component="fieldset" error={!!errors[column.COLUMN_NAME.COLUMN_NAME]}>
                        <FormLabel component="legend">{column.COLUMN_NAME.COLUMN_NAME}</FormLabel>
                        {Object.values(column.optionsList).map((option, index) => (
                          <FormControlLabel
                            key={index}
                            control={
                              <Checkbox
                                {...field}
                                value={option}
                                checked={field.value.includes(option)}
                                onChange={(e) => {
                                  const value = [...field.value];
                                  if (e.target.checked) {
                                    value.push(option);
                                  } else {
                                    value.splice(value.indexOf(option), 1);
                                  }
                                  field.onChange(value);
                                }}
                              />
                            }
                            label={option}
                          />
                        ))}
                        <FormHelperText>{errors[column.COLUMN_NAME.COLUMN_NAME]?.message}</FormHelperText>
                      </FormControl>
                    );

                  default:
                    return null;
                }
              }}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DynamicForm;
