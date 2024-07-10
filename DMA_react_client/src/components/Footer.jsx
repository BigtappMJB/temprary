/**
 * Footer component
 *
 * A simple footer component that displays the copyright information
 *
 * @returns {React.ReactElement} The footer component
 *
 * @example
 * <Footer />
 */
import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * Footer component
 */
const Footer = () => (
  <Box component="footer" py={2} textAlign="center">
    <Typography variant="body2">
      @2022 BigTapp Proprietary & Confidential, All rights reserved.
    </Typography>
  </Box>
);

export default Footer;
