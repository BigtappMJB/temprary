<#assign cls = className?substring(className?last_index_of(".") + 1)>
<#assign clsLower = cls?uncap_first>

import React, { useState, useMemo, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TablePagination, TableSortLabel, IconButton, TextField, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { debounce } from "lodash";
import PropTypes from "prop-types";

function ${cls}DataTable({ handleDelete, handleUpdateLogic, tableData, columns, permissionLevels }) {
const [order, setOrder] = useState("asc");
const [orderBy, setOrderBy] = useState("");
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);
const [filter, setFilter] = useState({});

const handleRequestSort = (property) => {
const isAsc = orderBy === property && order === "asc";
const isDesc = orderBy === property && order === "desc";
setOrder(isDesc ? "asc" : "desc");
setOrderBy(property);
};

const handleChangePage = (event, newPage) => {
setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
setRowsPerPage(parseInt(event.target.value, 10));
setPage(0);
};

const handleFilterChange = useCallback(
debounce((event) => {
const { name, value } = event.target;
setFilter((prev) => ({
...prev,
[name]: value,
}));
}, 300),
[]
);

const filteredData = useMemo(() => {
return tableData.filter((row) => {
return Object.keys(filter).every((key) => {
const value = row[key];
return value ? value.toString().toLowerCase().includes(filter[key].toLowerCase()) : true;
});
});
}, [tableData, filter]);

return (
<Table>
    <TableHead>
        <TableRow>
            <#list columns as column>
                <TableCell>
                    <TableSortLabel
                            active={orderBy === column.field}
                    direction={orderBy === column.field ? order : "asc"}
                    onClick={() => handleRequestSort(column.field)}
                    >
                    ${column.title}
                    </TableSortLabel>
                    <TextField
                            name="${column.field}"
                            onChange={handleFilterChange}
                            variant="outlined"
                            placeholder="Search"
                    />
                </TableCell>
            </#list>
            <TableCell>Actions</TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        <#list filteredData as row>
            <TableRow key="${row[primaryKey]}">
                <#list columns as column>
                    <TableCell>{row[column.field]}</TableCell>
                </#list>
                <TableCell>
                    <Tooltip title="Edit">
                        <IconButton onClick={() => handleUpdateLogic(row)}>
                        <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(row[primaryKey])} color="error">
                        <Delete />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
        </#list>
    </TableBody>
    <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}></TablePagination>
</Table>
);
}

${cls}DataTable.propTypes = {
handleDelete: PropTypes.func.isRequired,
handleUpdateLogic: PropTypes.func.isRequired,
tableData: PropTypes.array.isRequired,
columns: PropTypes.array.isRequired,
permissionLevels: PropTypes.object.isRequired,
};

export default ${cls}DataTable;
