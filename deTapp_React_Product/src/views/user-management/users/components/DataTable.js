import React, { useState, useMemo, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
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
  backgroundColor: "#1e88e5",
  '& th': {
    color: "#fff",
    fontWeight: 600
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  background: "white",
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    }
  },
  '& .MuiInputBase-input': {
    padding: '8px 12px',
    fontSize: '0.875rem'
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  wordWrap: "break-word",
  whiteSpace: "normal",
  lineHeight: 1.5,
  textAlign: "left",
  padding: theme.spacing(1.5),
  '&:first-of-type': {
    paddingLeft: theme.spacing(3)
  },
  '&:last-of-type': {
    paddingRight: theme.spacing(3)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    fontSize: '0.875rem',
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  '& .MuiTable-root': {
    borderCollapse: 'separate',
    borderSpacing: '0 4px'
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100vw',
    overflowX: 'auto'
  }
}));

const DataTable = ({
  handleDelete,
  handleUpdateLogic,
  tableData,
  columns,
  permissionLevels,
  sendUpdatedPaginatedData,
}) => {
  const theme = useTheme();
  const [order, setOrder] = useState("original");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState({});

  // Add S.NO column to the columns definition
  const extendedColumns = useMemo(() => {
    if (!Array.isArray(columns)) {
      console.warn('Columns prop is not an array:', columns);
      return [{ field: 'sno', title: 'S.No' }];
    }
    return [{ field: 'sno', title: 'S.No' }, ...columns];
  }, [columns]);

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
      if (value === '') {
        setFilter((prev) => {
          const newFilter = { ...prev };
          delete newFilter[name];
          return newFilter;
        });
      } else {
        setFilter((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
      setPage(0);
    }, 300),
    []
  );

  return (
    <>
      <StyledTableContainer>
        <Table size="small" sx={{
          minWidth: 650,
          [theme.breakpoints.down('sm')]: {
            minWidth: 300,
          }
        }}>
          <StyledTableHead>
            <TableRow className="tablename-head">
              {extendedColumns.map((column) => (
                <StyledTableCell key={column.field}>
                  <TableSortLabel
                    active={orderBy === column.field}
                    direction={orderBy === column.field ? order : "asc"}
                    onClick={() => handleRequestSort(column.field)}
                    sx={{
                      fontWeight: "bold",
                      padding: "3px",
                    }}
                  >
                    {column.title}
                  </TableSortLabel>

                  <StyledTextField
                    className="tablename-search"
                    key={column.field}
                    name={column.field}
                    onChange={handleFilterChange}
                    variant="outlined"
                    placeholder={`Search ${column.title}`}
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
                key={row.ID || row.id || `row-${index}`}
                sx={{
                  backgroundColor: index % 2 !== 0 ? 'rgba(0, 0, 0, 0.02)' : 'inherit',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  },
                  transition: 'background-color 0.2s'
                }}
              >
                {extendedColumns.map((column) => (
                  <StyledTableCell
                    key={column.field}
                    style={{
                      textAlign: validationRegex.isNumbers.test(row[column.field])
                        ? "center"
                        : "left",
                    }}
                  >
                    {row[column.field]}
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
      </StyledTableContainer>
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
