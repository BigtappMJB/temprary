
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

function eveCrud() {
const [formData, setFormData] = useState({
    wrvwdv: "",
    dv: "",
});

const [list, setList] = useState([]);

const apiBaseUrl = "/api/eve";

useEffect(() => {
fetchList();
}, []);

const fetchList = async () => {
try {
const response = await axios.get(`/api/eve/all`);
setList(response.data);
} catch (error) {
console.error("Failed to fetch eve list:", error);
}
};

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
// Create or update via POST to /create
await axios.post(`/api/eve/create`, formData);
setFormData({
    wrvwdv: "",
    dv: "",
});
fetchList();
} catch (error) {
console.error("Failed to save eve:", error);
}
};

const handleEdit = (item) => {
setFormData(item);
};

const handleDelete = async (primaryKey) => {
try {
await axios.delete(`/api/eve/delete/wrvwdv`);
fetchList();
} catch (error) {
console.error("Failed to delete eve:", error);
}
};

const handleDeleteAll = async () => {
try {
await axios.delete(`/api/eve/deleteAll`);
fetchList();
} catch (error) {
console.error("Failed to delete all eve:", error);
}
};

return (
<div>
    <h2>eve Management</h2>

    <form onSubmit={handleSubmit}>
            <TextField
                    label="Wrvwdv"
                    name="wrvwdv"
                    value={formData.wrvwdv}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    disabled={false}
            />
            <TextField
                    label="Dv"
                    name="dv"
                    value={formData.dv}
                    onChange={handleChange}
                    margin="normal"
                    fullWidth
                    disabled={false}
            />

        <Button
                variant="contained"
                color="primary"

                type="submit"
        >
            {formData.primaryKey ? "Update" : "Create"}
        </Button>
        <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteAll}

        >
            Delete All
        </Button>
    </form>

    <Table >
        <TableHead>
            <TableRow>
                    <TableCell>Wrvwdv</TableCell>
                    <TableCell>Dv</TableCell>
                <TableCell>Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {list.map((item) => (
            <TableRow key={item[wrvwdv]}>
                    <TableCell>{item.wrvwdv}</TableCell>
                    <TableCell>{item.dv}</TableCell>
                <TableCell>
                    <Button onClick={() => handleEdit(item)}>Edit</Button>
                    <Button color="error" onClick={() => handleDelete(item[wrvwdv])} style={{ marginLeft: 8 }}>
                    Delete
                    </Button>
                </TableCell>
            </TableRow>

            )
            )}
        </TableBody>
    </Table>
</div>
);
}

export default eveCrud;
