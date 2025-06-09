<#assign cls = className?substring(className?last_index_of(".") + 1)>
<#assign clsLower = cls?uncap_first>
<#assign pk = primaryKey!'id'>
<#assign pkFormatted = primaryKey?string("true", "false")> <!-- Explicitly format the boolean -->

import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

function ${cls}Page() {
const [formData, setFormData] = useState({
<#list fields as field>
    ${field.name}: "",
</#list>
});

const [list, setList] = useState([]);
const apiBaseUrl = "/api/${clsLower}";

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
setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
await axios.post(`${apiBaseUrl}/create`, formData);
setFormData({
<#list fields as field>
    ${field.name}: "",
</#list>
});
fetchList();
} catch (error) {
console.error("Failed to save ${cls}:", error);
}
};

const handleEdit = (item) => {
setFormData(item);
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

return (
<div>
    <h2>${cls} Management</h2>

    <form onSubmit={handleSubmit}>
        <#list fields as field>
            <TextField
                    label="${field.name?cap_first}"
                    name="${field.name}"
                    value={formData.${field.name}}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    disabled="${field.name == pkFormatted ? 'true' : 'false'}"  <!-- Fix this for disabled -->
            />
        </#list>

        <Button variant="contained" color="primary" type="submit">
            {formData["${pk}"] ? "Update" : "Create"}
        </Button>
        <Button variant="outlined" color="error" onClick={handleDeleteAll} type="button">
            Delete All
        </Button>
    </form>

    <Table>
        <TableHead>
            <TableRow>
                <#list fields as field>
                    <TableCell>${field.name?cap_first}</TableCell>
                </#list>
                <TableCell>Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            <#list list as item>
                <TableRow key="${item[pk]}">
                    <#list fields as field>
                        <TableCell>{item["${field.name}"]}</TableCell>
                    </#list>
                    <TableCell>
                        <Button onClick={() => handleEdit(item)}>Edit</Button>
                        <Button
                                color="error"
                                onClick={() => handleDelete(item["${pk}"])}
                        style="margin-left: 8px"
                        >
                        Delete
                        </Button>
                    </TableCell>
                </TableRow>
            </#list>
        </TableBody>
    </Table>
</div>
);
}

export default ${cls}Page;
