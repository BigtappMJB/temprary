<#assign cls = className?substring(className?last_index_of(".") + 1)>
<#assign clsLower = cls?uncap_first>

import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";

function ${cls}Form({ formAction, defaultValues, onSubmit, onReset, rolesList }) {
const [formData, setFormData] = useState(defaultValues);

useEffect(() => {
setFormData(defaultValues);
}, [defaultValues]);

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = (e) => {
e.preventDefault();
onSubmit(formData);
};

return (
<form onSubmit={handleSubmit}>
    <#list fields as field>
        <TextField
                label="${field.name?cap_first}"
                name="${field.name}"
                value={formData.${field.name}}
                onChange={handleChange}
                margin="normal"
                fullWidth
                disabled="${field.name == primaryKey ? 'true' : 'false'}"
        />
    </#list>

    <Button variant="contained" color="primary" type="submit">
        {formAction.action === "add" ? "Add" : "Update"}
    </Button>
    <Button variant="outlined" color="secondary" onClick={onReset} type="button">
        Cancel
    </Button>
</form>
);
}

export default ${cls}Form;
