import { Typography } from "@mui/material";

const TableErrorDisplay = () => {
  return (
    <Typography component={"h1"} textAlign={"center"} color={"red"}>
      You don't have access to view Data,Kindly contact system administrator.
    </Typography>
  );
};

export default TableErrorDisplay;
