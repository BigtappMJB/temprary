
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

function employeeCrud() {
const [formData, setFormData] = useState({
    updated_at: "",
    employee_id: "",
});

const [list, setList] = useState([]);

const apiBaseUrl = "/api/employee";

useEffect(() => {
fetchList();
}, []);

const fetchList = async () => {
try {
const response = await axios.get(`/api/employee/all`);
setList(response.data);
} catch (error) {
console.error("Failed to fetch employee list:", error);
}
};

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
// Create or update via POST to /create
await axios.post(`/api/employee/create`, formData);
setFormData({
    updated_at: "",
    employee_id: "",
});
fetchList();
} catch (error) {
console.error("Failed to save employee:", error);
}
};

const handleEdit = (item) => {
setFormData(item);
};

const handleDelete = async (primaryKey) => {
try {
await axios.delete(`/api/employee/delete/id`);
fetchList();
} catch (error) {
console.error("Failed to delete employee:", error);
}
};

const handleDeleteAll = async () => {
try {
await axios.delete(`/api/employee/deleteAll`);
fetchList();
} catch (error) {
console.error("Failed to delete all employee:", error);
}
};

return (
<div>
    <h2>employee Management</h2>

    <form onSubmit={handleSubmit}>
            <TextField
                    label="Updated_at"
                    name="updated_at"
                    value={formData.updated_at}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    disabled={ "false" === "true" }
            />
            <TextField
                    label="Employee_id"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    disabled={ "false" === "true" }
            />

        <Button
                variant="contained"
                color="primary"
                type="submit"
        >
            {formData["id"] ? "Update" : "Create"}
        </Button>
        <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteAll}

                type="button"

        >
            Delete All
        </Button>
    </form>

    <Table>
        <TableHead>
            <TableRow>
                    <TableCell>Updated_at</TableCell>
                    <TableCell>Employee_id</TableCell>
                <TableCell>Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {list.map((item) => (
            <TableRow key={item["id"]}>
                    <TableCell>{item["updated_at"]}</TableCell>
                    <TableCell>{item["employee_id"]}</TableCell>
                <TableCell>
                    <Button onClick={() => handleEdit(item)}>Edit</Button>
                    <Button
                            color="error"
                            onClick={() => handleDelete(item["id"])}
                    style={{ marginLeft: 8 }}
                    >
                    Delete
                    </Button>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
    </Table>
</div>
);
}

export default employeeCrud;
