import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Spacing component for consistent vertical spacing
 * 
 * @param {Object} props - Component props
 * @param {number} props.size - Spacing size (1-10)
 * @returns {JSX.Element} Spacing component
 */
const Spacing = ({ size = 2 }) => {
  // Convert size to spacing units (1 = 8px in MUI)
  const spacingValue = size * 8;
  
  return <Box sx={{ height: spacingValue }} />;
};

Spacing.propTypes = {
  size: PropTypes.number
};

export default Spacing;