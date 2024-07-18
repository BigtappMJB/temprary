import React from "react";
import { Box, Card } from "@mui/material";
import PageContainer from "../../../components/container/PageContainer";

/**
 * AuthCardComponent renders a styled card component for authentication pages.
 *
 * This component centers its children within a styled card, providing a consistent look and feel
 * for authentication pages such as login and registration.
 *
 * Example:
 * ```jsx
 * import React from 'react';
 * import AuthCardComponent from './path-to-authCardComponent';
 * import RegisterFormComponent from './path-to-registerFormComponent';
 *
 * function RegisterPage() {
 *   return (
 *     <AuthCardComponent title="Register" description="for registration">
 *       <RegisterFormComponent />
 *     </AuthCardComponent>
 *   );
 * }
 *
 * export default RegisterPage;
 * ```
 *
 * @param {Object} props - Component properties.
 * @param {string} props.title - Title for the page container.
 * @param {string} props.description - Description for the page container.
 * @param {JSX.Element} props.children - Children components to be rendered inside the card.
 * @returns {JSX.Element} The rendered auth card component.
 */
const AuthCardComponent = ({ title, description, children }) => {
  return (
    <PageContainer title={title} description={description}>
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Card
          elevation={9}
          sx={{
            p: 4,
            zIndex: 1,
            maxWidth: "500px",
            mx: 2,
          }}
        >
          {children}
        </Card>
      </Box>
    </PageContainer>
  );
};

export default AuthCardComponent;
