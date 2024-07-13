import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  styled,
  TextField,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { validationRegex } from "../../../utilities/Validators";

// Styled components for the table
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "#f2f2f2",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  background: "white",
}));

/**
 * DataTable component displays a paginated, sortable, and filterable table.
 * It also provides actions for updating and deleting rows.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Function} props.handleDelete - Function to handle the deletion of a row.
 * @param {Function} props.handleUpdateLogic - Function to push and update the data into parent component.
 * @param {Array} props.tableData - Contains array of objects representing table data.
 * @param {Object} props.columns - Contains object of column definitions.
 * @example
 * // Sample usage
 * const columns = {
 *   id: "ID",
 *   name: "Name",
 *   age: "Age",
 * };
 * const data = [
 *   { id: 1, name: "John Doe", age: 28 },
 *   { id: 2, name: "Jane Smith", age: 34 },
 * ];
 *
 * <DataTable
 *   handleDelete={handleDeleteFunction}
 *   handleUpdateLogic={handleUpdateFunction}
 *   tableData={data}
 *   columns={columns}
 * />
 */
const DataTable = ({ handleDelete, handleUpdateLogic, tableData, columns }) => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("original");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState({});

  // Effect to update the data state when tableData changes
  useEffect(() => {
    setData(tableData);
  }, [tableData]);

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

  // Filter data based on the filter state
  const filteredData =
    data.length === 0
      ? []
      : data.filter((row) =>
          Object.keys(filter).every((key) =>
            row[key]
              ?.toString()
              .toLowerCase()
              .includes(filter[key].toLowerCase())
          )
        );

  // Sort data based on filtered rows
  const sortedData = filteredData.slice().sort((a, b) => {
    if (order === "original") return data.indexOf(a) - data.indexOf(b);
    const getIDKey = Object.keys(columns)[0];
    if (orderBy === getIDKey) {
      return order === "asc"
        ? a[getIDKey] - b[getIDKey]
        : b[getIDKey] - a[getIDKey];
    }
    if (validationRegex.isNumbers.test(a[orderBy])) {
      return order === "asc"
        ? a[orderBy] - b[orderBy]
        : b[orderBy] - a[orderBy];
    }
    return order === "asc"
      ? a[orderBy].localeCompare(b[orderBy])
      : b[orderBy].localeCompare(a[orderBy]);
  });

  // Paginate data based on the page and rowsPerPage state
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <TableContainer>
        <Table>
          <StyledTableHead>
            <TableRow>
              {Object.keys(columns).map((key) => (
                <TableCell key={key}>
                  <TableSortLabel
                    active={orderBy === key}
                    direction={orderBy === key ? order : "asc"}
                    onClick={() => handleRequestSort(key)}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {columns[key]}
                  </TableSortLabel>
                  <StyledTextField
                    key={key}
                    name={key}
                    onChange={handleFilterChange}
                    variant="outlined"
                    placeholder={`Search ${columns[key]}`}
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
                <StyledTextField variant="outlined" disabled fullWidth />
              </TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow
                key={row.id}
                style={{
                  backgroundColor: index % 2 !== 0 ? "#f2f2f2" : "inherit",
                }}
              >
                {Object.keys(columns).map((key) => (
                  <TableCell
                    key={key}
                    style={{
                      textAlign: validationRegex.isNumbers.test(row[key])
                        ? "center"
                        : "left",
                    }}
                  >
                    {row[key]}
                  </TableCell>
                ))}
                <TableCell
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Tooltip title="Edit" arrow>
                    <IconButton
                      onClick={() => handleUpdateLogic(row)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <IconButton
                      onClick={() => handleDelete(row)}
                      color="secondary"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
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
    </>
  );
};

export default DataTable;
