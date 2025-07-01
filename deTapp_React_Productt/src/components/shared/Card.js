import React from 'react';
import { Paper, Box, Typography, Divider } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Reusable Card component with consistent styling
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.action - Action component to display in header
 * @param {Object} props.sx - Additional styles
 * @param {boolean} props.noPadding - Whether to remove padding
 * @param {boolean} props.noHeader - Whether to hide the header
 * @returns {JSX.Element} Card component
 */
const Card = ({ 
  children, 
  title, 
  action, 
  sx = {}, 
  noPadding = false,
  noHeader = false
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.08)',
        ...sx
      }}
    >
      {!noHeader && (title || action) && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              pb: 1.5
            }}
          >
            {title && (
              <Typography variant="subtitle1" fontWeight={600}>
                {title}
              </Typography>
            )}
            {action && (
              <Box>{action}</Box>
            )}
          </Box>
          <Divider sx={{ opacity: 0.1 }} />
        </>
      )}
      <Box sx={{ p: noPadding ? 0 : 2 }}>
        {children}
      </Box>
    </Paper>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  action: PropTypes.node,
  sx: PropTypes.object,
  noPadding: PropTypes.bool,
  noHeader: PropTypes.bool
};

export default Card;