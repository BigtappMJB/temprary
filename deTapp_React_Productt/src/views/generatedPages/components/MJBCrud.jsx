
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
Box,
Button,
Card,
Collapse,
Grid,
IconButton,
Paper,
Table,
TableBody,
TableCell,
TableContainer,
TableHead,
TableRow,
TextField,
Typography,
Select,
MenuItem,
FormGroup,
Checkbox,
RadioGroup,
Radio,
FormControlLabel,
FormControl,
InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

// Styled Components with default values to handle null theme
const ContainerCard = styled(Card)(({ theme }) => ({
margin: "16px", // Default to 16px if theme.spacing(3) is null
padding: "24px", // Default to 24px
borderRadius: "16px", // Default to 16px
boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)", // Use single quotes for JS string
backgroundColor: '#fff',
"@media (max-width: 600px)": { // Fallback for theme.breakpoints.down("sm")
margin: "12px", // Default to 12px
padding: "16px", // Default to 16px
},
}));

const HeaderBox = styled(Box)(({ theme }) => ({
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: "24px", // Default to 24px
paddingBottom: "16px", // Default to 16px
borderBottom: `1px solid #e0e0e0`, // Use single quotes
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
fontWeight: 700,
color: "#1565c0", // Default to a dark blue
fontSize: "1.75rem",
"@media (max-width: 600px)": {
fontSize: "1.5rem",
},
}));

const FormBox = styled(Box)(({ theme }) => ({
padding: "24px", // Default to 24px
backgroundColor: "#f5f5f5", // Default to light gray
borderRadius: "8px", // Default to 8px
marginBottom: "24px", // Default to 24px
boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", // Use single quotes
position: "relative",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
"& .MuiOutlinedInput-root": {
borderRadius: "8px", // Default to 8px
backgroundColor: "#fff",
"&:hover fieldset": {
borderColor: "#1976d2", // Default to Material-UI primary blue
},
"&.Mui-focused fieldset": {
borderColor: "#1976d2",
},
},
"& .MuiInputLabel-root": {
color: "#616161", // Default to a gray color
fontWeight: 500,
},
}));

const ActionButton = styled(Button)(({ theme }) => ({
borderRadius: "8px", // Default to 8px
padding: "8px 24px", // Default to 8px 24px
textTransform: "none",
fontWeight: 600,
"&:hover": {
boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Use single quotes
},
}));

const TableHeaderCell = styled(TableCell)(({ theme }) => ({
fontWeight: 600,
color: "#212121", // Default to a dark gray
backgroundColor: "#f5f5f5", // Default to light gray
borderBottom: `2px solid #e0e0e0`, // Use single quotes
padding: "12px", // Default to 12px
fontSize: "1rem",
}));

const TableBodyCell = styled(TableCell)(({ theme }) => ({
padding: "12px", // Default to 12px
fontSize: "0.95rem",
color: "#616161", // Default to gray
borderBottom: `1px solid #e0e0e0`, // Use single quotes
"&:last-child": {
paddingRight: "16px", // Default to 16px
},
}));

const IconActionButton = styled(IconButton)(({ theme }) => ({
padding: "8px", // Default to 8px
"&:hover": {
backgroundColor: "rgba(0, 0, 0, 0.04)", // Use single quotes
},
}));

function Dynamic_page_creationCrud() {
const [formData, setFormData] = useState({
    id: "",
    routePath: "",
});

const [list, setList] = useState([]);
const [showForm, setShowForm] = useState(false);

const apiBaseUrl = "/api/dynamic_page_creation";

useEffect(() => {
fetchList();
}, []);

const fetchList = async () => {
try {
const response = await axios.get(`/api/dynamic_page_creation/all`);
setList(response.data);
} catch (error) {
console.error("Failed to fetch Dynamic_page_creation list:", error);
}
};

const handleChange = (e) => {
const { name, value, type, checked } = e.target;
if (type === "checkbox") {
const currentValues = formData[name] ? JSON.parse(formData[name]) : [];
if (checked) {
currentValues.push(value);
} else {
const index = currentValues.indexOf(value);
if (index > -1) {
currentValues.splice(index, 1);
}
}
setFormData({ ...formData, [name]: JSON.stringify(currentValues) });
} else {
setFormData({ ...formData, [name]: value });
}
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
// Create or update via POST to /create
const submitData = { ...formData };
await axios.post(`/api/dynamic_page_creation/create`, submitData);
setFormData({
    id: "",
    routePath: "",
});
setShowForm(false);
fetchList();
} catch (error) {
console.error("Failed to save Dynamic_page_creation:", error);
}
};

const handleEdit = (item) => {
const editData = { ...item };
setFormData(editData);
setShowForm(true);
};

const handleDelete = async (primaryKey) => {
try {
await axios.delete(`/api/dynamic_page_creation/delete/id`);
fetchList();
} catch (error) {
console.error("Failed to delete Dynamic_page_creation:", error);
}
};

const handleDeleteAll = async () => {
try {
await axios.delete(`/api/dynamic_page_creation/deleteAll`);
fetchList();
} catch (error) {
console.error("Failed to delete all Dynamic_page_creation:", error);
}
};

const handleCloseForm = () => {
setShowForm(false);
setFormData({
    id: "",
    routePath: "",
});
};

return (
<ContainerCard>

    <HeaderBox>
        <TitleTypography variant="h5">
            Dynamic_page_creation Management
        </TitleTypography>
        <ActionButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
        onClick={() => setShowForm(!showForm)}
        >
        Add Entry
        </ActionButton>
    </HeaderBox>

    <Collapse in={showForm}>
        <FormBox component="form" onSubmit={handleSubmit}>
            <IconActionButton
                    onClick={handleCloseForm}
                    sx={{ position: "absolute", top: 16, right: 16 }}
            >
            <CloseIcon />
            </IconActionButton>
            <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                            {/* Hidden field: id */}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>RoutePath</InputLabel>
                                <Select
                                        name="routePath"
                                        value={formData.routePath}
                                        onChange={handleChange}
                                        label="RoutePath"
                                        disabled={ "false" === "true" }
                                >
                                    <MenuItem value="">None</MenuItem>
                                </Select>
                            </FormControl>
                    </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <ActionButton
                    variant="contained"
                    color="primary"
                    type="submit"
            >
                {formData["id"] ? "Update" : "Create"}
            </ActionButton>
            <ActionButton
                    variant="outlined"
                    color="error"
                    onClick={handleDeleteAll}
                    type="button"
            >
                Delete All
            </ActionButton>
            </Box>
        </FormBox>
    </Collapse>

    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
    <Table>
        <TableHead>
            <TableRow>
                        <TableHeaderCell>RoutePath</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {list.map((item) => (
            <TableRow
                    key={item["id"]}
                    sx={{
            "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            transition: "background-color 0.2s",
            },
            }}
            >
                    <TableBodyCell>
                            {item["routePath"]}
                    </TableBodyCell>
            <TableBodyCell>
                <IconActionButton onClick={() => handleEdit(item)}>
                <EditIcon fontSize="small" color="primary" />
                </IconActionButton>
                <IconActionButton onClick={() => handleDelete(item["id"])}>
                <DeleteIcon fontSize="small" color="error" />
                </IconActionButton>
            </TableBodyCell>
            </TableRow>
            ))}
        </TableBody>
    </Table>
    </TableContainer>
</ContainerCard>
);
}

export default Dynamic_page_creationCrud;
