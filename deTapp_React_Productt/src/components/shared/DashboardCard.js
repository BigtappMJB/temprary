import React from "react";
import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import PropTypes from "prop-types";

const DashboardCard = ({
  title,
  subtitle,
  children,
  action,
  footer,
  cardheading,
  headtitle,
  headsubtitle,
  middlecontent,
}) => {
  return (
    <Card sx={{ padding: 0 }} elevation={9} variant={undefined}>
      {cardheading ? (
        <CardContent>
          <Typography variant="h5">{headtitle}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {headsubtitle}
          </Typography>
        </CardContent>
      ) : (
        <CardContent sx={{ p: "30px" }}>
          {title ? (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems={"center"}
              mb={3}
            >
              <Box>
                {title ? <Typography variant="h5">{title}</Typography> : ""}

                {subtitle ? (
                  <Typography variant="subtitle2" color="textSecondary">
                    {subtitle}
                  </Typography>
                ) : (
                  ""
                )}
              </Box>
              {action}
            </Stack>
          ) : null}

          {children}
        </CardContent>
      )}

      {middlecontent}
      {footer}
    </Card>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string, // Title should be a string
  subtitle: PropTypes.string, // Subtitle should be a string
  children: PropTypes.node, // Children can be any renderable content
  action: PropTypes.func, // Action should be a function
  footer: PropTypes.node, // Footer can be any renderable content
  cardheading: PropTypes.string, // Card heading should be a string
  headtitle: PropTypes.string, // Head title should be a string
  headsubtitle: PropTypes.string, // Head subtitle should be a string
  middlecontent: PropTypes.node, // Middle content can be any renderable content
};

export default DashboardCard;
