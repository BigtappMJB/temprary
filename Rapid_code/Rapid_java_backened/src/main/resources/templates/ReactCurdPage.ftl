<#assign page = pageName>
<#assign cls = className?substring(className?last_index_of(".") + 1)>
<#assign clsLower = cls?uncap_first>
<#assign pk = primaryKey!'id'>
<#assign primaryKey = primaryKey!'id'>

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
margin: "${(theme.spacing(3))!16}px", // Default to 16px if theme.spacing(3) is null
padding: "${(theme.spacing(3))!24}px", // Default to 24px
borderRadius: "${(theme.spacing(2))!16}px", // Default to 16px
boxShadow: "${(theme.shadows[3])!'0 8px 24px rgba(0, 0, 0, 0.1)'}", // Use single quotes for JS string
backgroundColor: '#fff',
"@media (max-width: 600px)": { // Fallback for theme.breakpoints.down("sm")
margin: "${(theme.spacing(2))!12}px", // Default to 12px
padding: "${(theme.spacing(2))!16}px", // Default to 16px
},
}));

const HeaderBox = styled(Box)(({ theme }) => ({
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: "${(theme.spacing(3))!24}px", // Default to 24px
paddingBottom: "${(theme.spacing(2))!16}px", // Default to 16px
borderBottom: `1px solid ${(theme.palette.divider)!'#e0e0e0'}`, // Use single quotes
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
fontWeight: 700,
color: "${(theme.palette.primary.dark)!'#1565c0'}", // Default to a dark blue
fontSize: "1.75rem",
"@media (max-width: 600px)": {
fontSize: "1.5rem",
},
}));

const FormBox = styled(Box)(({ theme }) => ({
padding: "${(theme.spacing(3))!24}px", // Default to 24px
backgroundColor: "${(theme.palette.grey[50])!'#f5f5f5'}", // Default to light gray
borderRadius: "${(theme.spacing(1))!8}px", // Default to 8px
marginBottom: "${(theme.spacing(3))!24}px", // Default to 24px
boxShadow: "${(theme.shadows[2])!'0 4px 12px rgba(0, 0, 0, 0.05)'}", // Use single quotes
position: "relative",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
"& .MuiOutlinedInput-root": {
borderRadius: "${(theme.spacing(1))!8}px", // Default to 8px
backgroundColor: "#fff",
"&:hover fieldset": {
borderColor: "${(theme.palette.primary.main)!'#1976d2'}", // Default to Material-UI primary blue
},
"&.Mui-focused fieldset": {
borderColor: "${(theme.palette.primary.main)!'#1976d2'}",
},
},
"& .MuiInputLabel-root": {
color: "${(theme.palette.text.secondary)!'#616161'}", // Default to a gray color
fontWeight: 500,
},
}));

const ActionButton = styled(Button)(({ theme }) => ({
borderRadius: "${(theme.spacing(1))!8}px", // Default to 8px
padding: "${(theme.spacing(1))!8}px ${(theme.spacing(3))!24}px", // Default to 8px 24px
textTransform: "none",
fontWeight: 600,
"&:hover": {
boxShadow: "${(theme.shadows[2])!'0 4px 12px rgba(0, 0, 0, 0.1)'}", // Use single quotes
},
}));

const TableHeaderCell = styled(TableCell)(({ theme }) => ({
fontWeight: 600,
color: "${(theme.palette.text.primary)!'#212121'}", // Default to a dark gray
backgroundColor: "${(theme.palette.grey[100])!'#f5f5f5'}", // Default to light gray
borderBottom: `2px solid ${(theme.palette.divider)!'#e0e0e0'}`, // Use single quotes
padding: "${(theme.spacing(1.5))!12}px", // Default to 12px
fontSize: "1rem",
}));

const TableBodyCell = styled(TableCell)(({ theme }) => ({
padding: "${(theme.spacing(1.5))!12}px", // Default to 12px
fontSize: "0.95rem",
color: "${(theme.palette.text.secondary)!'#616161'}", // Default to gray
borderBottom: `1px solid ${(theme.palette.divider)!'#e0e0e0'}`, // Use single quotes
"&:last-child": {
paddingRight: "${(theme.spacing(2))!16}px", // Default to 16px
},
}));

const IconActionButton = styled(IconButton)(({ theme }) => ({
padding: "${(theme.spacing(1))!8}px", // Default to 8px
"&:hover": {
backgroundColor: "${(theme.palette.action.hover)!'rgba(0, 0, 0, 0.04)'}", // Use single quotes
},
}));

function ${cls}Crud() {
const [formData, setFormData] = useState({
<#list fields as field>
    ${field.name}: <#if field.uiType == "Checkbox">"[]"<#else>""</#if>,
</#list>
});

const [list, setList] = useState([]);
const [showForm, setShowForm] = useState(false);

const apiBaseUrl = "${apiBaseUrl}";

useEffect(() => {
fetchList();
}, []);

const fetchList = async () => {
try {
const response = await axios.get(`${apiBaseUrl}/all`);
setList(response.data);
} catch (error) {
console.error("Failed to fetch ${cls} list:", error);
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
<#list fields as field>
    <#if field.uiType == "Checkbox">
        submitData.${field.name} = formData.${field.name} ? JSON.parse(formData.${field.name}) : [];
    </#if>
</#list>
await axios.post(`${apiBaseUrl}/create`, submitData);
setFormData({
<#list fields as field>
    ${field.name}: <#if field.uiType == "Checkbox">"[]"<#else>""</#if>,
</#list>
});
setShowForm(false);
fetchList();
} catch (error) {
console.error("Failed to save ${cls}:", error);
}
};

const handleEdit = (item) => {
const editData = { ...item };
<#list fields as field>
    <#if field.uiType == "Checkbox">
        editData.${field.name} = item.${field.name} ? JSON.stringify(item.${field.name}) : "[]";
    </#if>
</#list>
setFormData(editData);
setShowForm(true);
};

const handleDelete = async (primaryKey) => {
try {
await axios.delete(`${apiBaseUrl}/delete/${primaryKey}`);
fetchList();
} catch (error) {
console.error("Failed to delete ${cls}:", error);
}
};

const handleDeleteAll = async () => {
try {
await axios.delete(`${apiBaseUrl}/deleteAll`);
fetchList();
} catch (error) {
console.error("Failed to delete all ${cls}:", error);
}
};

const handleCloseForm = () => {
setShowForm(false);
setFormData({
<#list fields as field>
    ${field.name}: <#if field.uiType == "Checkbox">"[]"<#else>""</#if>,
</#list>
});
};

return (
<ContainerCard>

    <HeaderBox>
        <TitleTypography variant="h5">
            ${cls} Management
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
                <#list fields as field>
                    <Grid item xs={12} sm={6} md={4}>
                        <#if field.uiType == "textbox" || field.uiType == "email" || field.uiType == "date">
                            <StyledTextField
                                    label="${field.name?cap_first}"
                                    name="${field.name}"
                                    type="${field.uiType}"
                                    value={formData.${field.name}}
                                    onChange={handleChange}
                                    margin="normal"
                                    fullWidth
                                    disabled={ <#if field.name == primaryKey>"true"<#else>"false"</#if> === "true" }
                            />
                        <#elseif field.uiType == "dropdown">
                            <FormControl fullWidth margin="normal">
                                <InputLabel>${field.name?cap_first}</InputLabel>
                                <Select
                                        name="${field.name}"
                                        value={formData.${field.name}}
                                        onChange={handleChange}
                                        label="${field.name?cap_first}"
                                        disabled={ <#if field.name == primaryKey>"true"<#else>"false"</#if> === "true" }
                                >
                                <#if field.optionValues?size == 1 && field.optionValues[0] == "">
                                    <MenuItem value="">None</MenuItem>
                                <#else>
                                    <#list field.optionValues as option>
                                        <MenuItem value="${option}">${option}</MenuItem>
                                    </#list>
                                </#if>
                                </Select>
                            </FormControl>
                        <#elseif field.uiType == "Checkbox">
                            <FormControl component="fieldset" margin="normal">
                                <Typography variant="subtitle1" color="textSecondary">
                                    ${field.name?cap_first}
                                </Typography>
                                <FormGroup row>
                                    <#list field.optionValues as option>
                                        <FormControlLabel
                                                control={
                                        <Checkbox
                                                name="${field.name}"
                                                value="${option}"
                                                checked={formData.${field.name} && JSON.parse(formData.${field.name}).includes("${option}")}
                                        onChange={handleChange}
                                        disabled={ <#if field.name == primaryKey>"true"<#else>"false"</#if> === "true" }
                                        />
                                        }
                                        label="${option}"
                                        />
                                    </#list>
                                </FormGroup>
                            </FormControl>
                        <#elseif field.uiType == "radio-button">
                            <FormControl component="fieldset" margin="normal">
                                <Typography variant="subtitle1" color="textSecondary">
                                    ${field.name?cap_first}
                                </Typography>
                                <RadioGroup
                                        row
                                        name="${field.name}"
                                        value={formData.${field.name} || ""}
                                onChange={handleChange}
                                >
                                <#list field.optionValues as option>
                                    <FormControlLabel
                                            value="${option}"
                                            control={<Radio />}
                                    label="${option}"
                                    disabled={ <#if field.name == primaryKey>"true"<#else>"false"</#if> === "true" }
                                    />
                                </#list>
                                </RadioGroup>
                            </FormControl>
                        <#elseif field.uiType == "hidden">
                            {/* Hidden field: ${field.name} */}
                        <#else>
                            <StyledTextField
                                    label="${field.name?cap_first} (Unsupported Type)"
                                    name="${field.name}"
                                    value={formData.${field.name}}
                                    onChange={handleChange}
                                    margin="normal"
                                    fullWidth
                                    disabled={true}
                            />
                        </#if>
                    </Grid>
                </#list>
            </Grid>
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <ActionButton
                    variant="contained"
                    color="primary"
                    type="submit"
            >
                {formData["${primaryKey}"] ? "Update" : "Create"}
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
                <#list fields as field>
                    <#if field.uiType != "hidden">
                        <TableHeaderCell>${field.name?cap_first}</TableHeaderCell>
                    </#if>
                </#list>
                <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {list.map((item) => (
            <TableRow
                    key={item["${pk}"]}
                    sx={{
            "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            transition: "background-color 0.2s",
            },
            }}
            >
            <#list fields as field>
                <#if field.uiType != "hidden">
                    <TableBodyCell>
                        <#if field.uiType == "Checkbox">
                            {item["${field.name}"] ? item["${field.name}"].join(", ") : ""}
                        <#else>
                            {item["${field.name}"]}
                        </#if>
                    </TableBodyCell>
                </#if>
            </#list>
            <TableBodyCell>
                <IconActionButton onClick={() => handleEdit(item)}>
                <EditIcon fontSize="small" color="primary" />
                </IconActionButton>
                <IconActionButton onClick={() => handleDelete(item["${pk}"])}>
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

export default ${cls}Crud;
