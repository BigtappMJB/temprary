import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import { Edit, Delete, Add, Save, Cancel } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../../../utilities/alerts/DialogContent";

/**
 * DataTable component displays a paginated, sortable, and filterable table.
 * It also provides actions for updating and deleting rows.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Function} props.handleDelete - Function to handle the deletion of a row.
 * @param {boolean} props.rowAddAction - Flag to determine whether the add row form is displayed.
 * @param {boolean} props.cancelAdd - Function to remove the  add form
 * @param {boolean} props.handleAddLogic- Function to push and insert the data into parent component
 * @param {boolean} props.handleUpdateLogic- Function to push and update the data into parent component
 * @param {boolean} props.tableData- Contains Array of Object of table data
 */
const DataTable = ({
  handleDelete,
  handleUpdateLogic,
  rowAddAction,
  cancelAdd,
  handleAddLogic,
  tableData,
}) => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("original");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState({});
  const [editRowId, setEditRowId] = useState(null);
  const [newRow, setNewRow] = useState({
    target: "",
    subTarget: "",
    incorporationCity: "",
    sectorClassification: "",
  });
  const [editRowData, setEditRowData] = useState({
    target: "",
    subTarget: "",
    incorporationCity: "",
    sectorClassification: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { openDialog } = useDialog();

  useEffect(() => {
    setData(tableData);
    setEditRowId(null);
  }, [tableData]);

  useEffect(() => {
    if (!rowAddAction) {
      setNewRow({
        target: "",
        subTarget: "",
        incorporationCity: "",
        sectorClassification: "",
      });
    }
  }, [rowAddAction]);

  /**
   * Handles sorting request when a table header is clicked.
   * @param {string} property - The column property to sort by.
   */
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "original" : isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  /**
   * Handles the change of the page in the table pagination.
   * @param {object} event - The event object.
   * @param {number} newPage - The new page number.
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  /**
   * Handles the change of rows per page in the table pagination.
   * @param {object} event - The event object.
   */
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * Handles the change in the filter input fields.
   * @param {object} event - The event object.
   */
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter({ ...filter, [name]: value });
    setPage(0);
  };

  /**
   * Handles editing a row.
   * @param {object} row - The row data to be edited.
   */
  const handleEditRow = (row) => {
    localStorage.setItem(row.id, JSON.stringify(row));
    navigate(`/cmdUpdateForm/${row.id}`);

    // setEditRowId(row.id);
    // setEditRowData({
    //   target: row.target,
    //   subTarget: row.subTarget,
    //   incorporationCity: row.incorporationCity,
    //   sectorClassification: row.sectorClassification,
    // });
  };

  /**
   * Handles saving the edited row.
   */
  const handleSaveEditRow = () => {
    handleUpdateLogic({
      id: editRowId,
      ...editRowData,
    });
    setEditRowId(null);
  };

  /**
   * Handles canceling the edit operation.
   */
  const handleCancelEdit = () => {
    setEditRowId(null);
    setEditRowData({
      target: "",
      subTarget: "",
      incorporationCity: "",
      sectorClassification: "",
    });
  };

  /**
   * Handles the change in the edit row input fields.
   * @param {object} event - The event object.
   */
  const handleEditRowChange = (event) => {
    const { name, value } = event.target;
    setEditRowData({ ...editRowData, [name]: value });
  };

  /**
   * Handles the opening of the delete confirmation dialog.
   * @param {object} id - The row data.
   */
  const openDeleteDialog = (row) => {
    openDialog(
      "warning",
      "Delete confirmation",
      "Are you sure you want to delete this data?",
      {
        confirm: {
          name: "Yes",
          isNeed: true,
        },
        cancel: {
          name: "No",
          isNeed: true,
        },
      },
      (confirmed) => {
        if (confirmed) {
          handleDelete(row);
        } else {
          console.log("Component A: User clicked No");
        }
      }
    );
  };

  // Filter data based on the filter state.
  const filteredData = data.filter((row) =>
    Object.keys(filter).every((key) =>
      row[key]?.toString().toLowerCase().includes(filter[key].toLowerCase())
    )
  );

  // Sort based on filtered rows
  const sortedData = filteredData.slice().sort((a, b) => {
    if (order === "original") return data.indexOf(a) - data.indexOf(b);
    if (orderBy === "id") {
      return order === "asc" ? a.id - b.id : b.id - a.id;
    }
    if (order === "asc") {
      return a[orderBy].localeCompare(b[orderBy]);
    } else {
      return b[orderBy].localeCompare(a[orderBy]);
    }
  });

  // Paginate data based on the page and rowsPerPage state.
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /**
   * Handles the change in the new row input fields.
   * @param {object} event - The event object.
   */
  const handleNewRowChange = (event) => {
    const { name, value } = event.target;
    setNewRow({ ...newRow, [name]: value });
  };

  /**
   * Validates the new row fields.
   * @returns {boolean} - True if the new row is valid, false otherwise.
   */
  const validateNewRow = () => {
    const newErrors = {};
    if (!newRow.target) newErrors.target = "Target is required.";
    if (!newRow.subTarget) newErrors.subTarget = "Subtarget is required.";
    if (!newRow.incorporationCity)
      newErrors.incorporationCity = "Incorporation City is required.";
    if (!newRow.sectorClassification)
      newErrors.sectorClassification = "Sector Classification is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles the addition of a new row.
   */
  const handleAddRow = () => {
    if (validateNewRow()) {
      handleAddLogic(newRow);
      if (!rowAddAction) {
        setNewRow({
          target: "",
          subTarget: "",
          incorporationCity: "",
          sectorClassification: "",
        });
        setErrors({});
      }
    }
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { label: "ID", id: "id" },
                { label: "Target", id: "target" },
                { label: "Subtarget", id: "subTarget" },
                { label: "Incorporation City", id: "incorporationCity" },
                { label: "Sector Classification", id: "sectorClassification" },
              ].map((column) => (
                <TableCell key={column.id}>
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => handleRequestSort(column.id)}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                  <TextField
                    key={column.id}
                    name={column.id}
                    onChange={handleFilterChange}
                    variant="outlined"
                    placeholder={`Search ${column.label}`}
                    fullWidth
                  />
                </TableCell>
              ))}
              <TableCell key={"Actions"}>
                <TableSortLabel
                  disabled
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  {"Actions"}
                </TableSortLabel>
                <TextField variant="outlined" disabled fullWidth />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowAddAction && (
              <TableRow>
                <TableCell>
                  {Number(data.length > 0 ? data[data.length - 1]["id"] : 0) +
                    1}
                </TableCell>
                <TableCell>
                  <TextField
                    name="target"
                    value={newRow.target}
                    onChange={handleNewRowChange}
                    variant="outlined"
                    fullWidth
                    label={"Target"}
                    error={!!errors.target}
                    helperText={errors.target}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="subTarget"
                    label={"Sub Target"}
                    value={newRow.subTarget}
                    onChange={handleNewRowChange}
                    variant="outlined"
                    fullWidth
                    error={!!errors.subTarget}
                    helperText={errors.subTarget}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="incorporationCity"
                    label={"Incorporation City"}
                    value={newRow.incorporationCity}
                    onChange={handleNewRowChange}
                    variant="outlined"
                    fullWidth
                    error={!!errors.incorporationCity}
                    helperText={errors.incorporationCity}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="sectorClassification"
                    label={"Sector Classification"}
                    value={newRow.sectorClassification}
                    onChange={handleNewRowChange}
                    variant="outlined"
                    fullWidth
                    error={!!errors.sectorClassification}
                    helperText={errors.sectorClassification}
                  />
                </TableCell>
                <TableCell
                  style={{
                    flex: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleAddRow}
                  >
                    Add
                  </Button>

                  <Button variant="text" color="error" onClick={cancelAdd}>
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            )}
            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ textAlign: "center" }}>{row.id}</TableCell>
                <TableCell>
                  {editRowId === row.id ? (
                    <TextField
                      name="target"
                      value={editRowData.target}
                      onChange={handleEditRowChange}
                      variant="outlined"
                      fullWidth
                    />
                  ) : (
                    row.target
                  )}
                </TableCell>

                <TableCell>
                  {editRowId === row.id ? (
                    <TextField
                      name="subTarget"
                      value={editRowData.subTarget}
                      onChange={handleEditRowChange}
                      variant="outlined"
                      fullWidth
                    />
                  ) : (
                    row.subTarget
                  )}
                </TableCell>

                <TableCell>
                  {editRowId === row.id ? (
                    <TextField
                      name="incorporationCity"
                      value={editRowData.incorporationCity}
                      onChange={handleEditRowChange}
                      variant="outlined"
                      fullWidth
                    />
                  ) : (
                    row.incorporationCity
                  )}
                </TableCell>
                <TableCell>
                  {editRowId === row.id ? (
                    <TextField
                      name="sectorClassification"
                      value={editRowData.sectorClassification}
                      onChange={handleEditRowChange}
                      variant="outlined"
                      fullWidth
                    />
                  ) : (
                    row.sectorClassification
                  )}
                </TableCell>
                <TableCell
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {editRowId === row.id ? (
                    <>
                      <IconButton onClick={handleSaveEditRow} color="primary">
                        <Save />
                      </IconButton>
                      <IconButton onClick={handleCancelEdit} color="secondary">
                        <Cancel />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        onClick={() => handleEditRow(row)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => openDeleteDialog(row)}
                        color="secondary"
                      >
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTable;
