import React, { useState, useMemo, useCallback } from "react";
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
import { debounce } from "lodash";
import PropTypes from "prop-types";

// Styled components for the table
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "#f2f2f2",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  background: "white",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  wordWrap: "break-word",
  whiteSpace: "normal",
  lineHeight: 2,
  textAlign: "justify",
}));

const DataTable = ({
  handleDelete,
  handleUpdateLogic,
  tableData,
  columns,
  permissionLevels,
  sendUpdatedPaginatedData,
}) => {
  const [order, setOrder] = useState("original");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState({});

  // Add S.NO column to the columns definition
  const extendedColumns = { sno: "S.No", ...columns };

  // Add S.NO column to tableData
  const dataWithSno = useMemo(() => {
    return tableData.map((row, index) => ({
      ...row,
      sno: index + 1,
    }));
  }, [tableData]);

  // Memoize filtered data to optimize performance
  const filteredData = useMemo(() => {
    return dataWithSno.filter((row, index) => {
      const sno = page * rowsPerPage + index + 1;
      return Object.keys(filter).every((key) => {
        const valueToFilter = key === "sno" ? sno : row[key];
        return (valueToFilter || "")
          ?.toString()
          .toLowerCase()
          .includes(filter[key].toLowerCase());
      });
    });
  }, [dataWithSno, filter, page, rowsPerPage]);

  // Memoize sorted data based on the sorting criteria
  const sortedData = useMemo(() => {
    return filteredData.slice().sort((a, b) => {
      if (order === "original") {
        return dataWithSno.indexOf(a) - dataWithSno.indexOf(b);
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
  }, [filteredData, order, orderBy, dataWithSno]);

  const paginatedData = useMemo(() => {
    const sortedDataValue = sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    if (sendUpdatedPaginatedData) {
      sendUpdatedPaginatedData(sortedDataValue);
    }
    return sortedDataValue;
  }, [sortedData, page, rowsPerPage]);

  const setOrderValue = (isDesc, isAsc) => {
    if (isDesc) {
      return "original";
    }
    if (isAsc) {
      return "desc";
    }
    return "asc";
  };
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    const isDesc = orderBy === property && order === "desc";
    setOrder(setOrderValue(isDesc, isAsc));
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
      setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
      setPage(0);
    }, 300),
    []
  );

  return (
    <>
      <TableContainer>
        <Table>
          <StyledTableHead>
            <TableRow className="tablename-head">
              {Object.keys(extendedColumns).map((key) => (
                <StyledTableCell key={key}>
                  <TableSortLabel
                    active={orderBy === key}
                    direction={orderBy === key ? order : "asc"}
                    onClick={() => handleRequestSort(key)}
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      fontWeight: "bold",
                      padding: "3px",
                    }}
                  >
                    {extendedColumns[key]}
                  </TableSortLabel>

                  <StyledTextField
                    className="tablename-search"
                    key={key}
                    name={key}
                    onChange={handleFilterChange}
                    variant="outlined"
                    placeholder={`Search ${extendedColumns[key]}`}
                    fullWidth
                  />
                </StyledTableCell>
              ))}
              <StyledTableCell
                key={"Actions"}
                className={`${
                  permissionLevels?.edit || permissionLevels?.delete
                    ? ""
                    : "custom-disabled"
                }`}
              >
                <TableSortLabel
                  disabled
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    fontWeight: "bold",
                    padding: "3px",
                  }}
                >
                  {"Actions"}
                </TableSortLabel>
                <StyledTextField
                  sx={{
                    display: paginatedData?.length === 0 ? "none" : "block",
                    visibility: "hidden",
                  }}
                  variant="outlined"
                  disabled
                  fullWidth
                />
              </StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody className="tablename-body">
            {paginatedData.map((row, index) => (
              <TableRow
                key={row.id}
                style={{
                  backgroundColor: index % 2 !== 0 ? "#f2f2f2" : "inherit",
                }}
              >
                {Object.keys(extendedColumns).map((key) => (
                  <StyledTableCell
                    key={key}
                    style={{
                      textAlign: validationRegex.isNumbers.test(row[key])
                        ? "center"
                        : "left",
                    }}
                  >
                    {row[key]}
                  </StyledTableCell>
                ))}
                <StyledTableCell
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Tooltip
                    title="Edit"
                    arrow
                    className={`${
                      permissionLevels?.edit ? "" : "custom-disabled"
                    }`}
                  >
                    <IconButton
                      onClick={() => handleUpdateLogic(row)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title="Delete"
                    arrow
                    className={`${
                      permissionLevels?.delete ? "" : "custom-disabled"
                    }`}
                  >
                    <IconButton
                      onClick={() => handleDelete(row)}
                      sx={{ color: "#ff0000" }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{
          display: paginatedData?.length === 0 ? "none" : "block",
        }}
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        className="tablename-footer"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

DataTable.propTypes = {
  handleDelete: PropTypes.func.isRequired, // handleDelete should be a required function
  handleUpdateLogic: PropTypes.func.isRequired, // handleUpdateLogic should be a required function
  tableData: PropTypes.any.isRequired, // tableData is a required array of objects

  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.any.isRequired, // Column title should be a string
      field: PropTypes.any.isRequired, // Column field should be a string
      // Add other column properties if necessary
    })
  ).isRequired, // columns is a required array of objects

  permissionLevels: PropTypes.any.isRequired, // permissionLevels should be a required array of strings

  sendUpdatedPaginatedData: PropTypes.func, // sendUpdatedPaginatedData should be a required function
};

export default DataTable;
