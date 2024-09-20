// import React, { useEffect, useRef, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useOutletContext } from 'react-router';
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import DOMPurify from 'dompurify';
// import {
//   Box,
//   Button,
//   Paper,
//   styled,
//   Typography,
//   TextField,
//   Grid,
//   Autocomplete,
// } from '@mui/material';

// import DataTable from '../user-management/users/components/DataTable';
// import { useLoading } from '../../components/Loading/loadingProvider';
// import { useDialog } from '../utilities/alerts/DialogContent';
// import {
//   generateCSV,
//   getCurrentPathName,
//   getSubmenuDetails,
//   ScrollToTopButton,
//   timeStampFileName,
//   titleCaseFirstWord,
// } from '../utilities/generals';
// import TableErrorDisplay from '../../components/tableErrorDisplay/TableErrorDisplay';
// import { getCookie } from '../../utilities/cookieServices/cookieServices';
// import { decodeData } from '../../utilities/securities/encodeDecode';
// import { get, post, remove, put } from '../../utilities/apiservices/apiServices';

// // Styled Components
// const Container = styled(Paper)(({ theme }) => ({
//   paddingBottom: theme.spacing(3),
//   marginBottom: theme.spacing(5),
//   borderRadius: theme.spacing(1),
//   boxShadow: theme.shadows[3],
//   [theme.breakpoints.down('sm')]: {
//     padding: theme.spacing(2),
//   },
// }));

// const Header = styled(Box)(({ theme }) => ({
//   backgroundColor: '#1e88e5',
//   color: '#fff',
//   padding: theme.spacing(2),
//   borderTopLeftRadius: theme.spacing(1),
//   borderTopRightRadius: theme.spacing(1),
//   marginBottom: theme.spacing(2),
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
// }));

// const SubHeader = styled(Box)(({ theme }) => ({
//   color: '#1e88e5',
//   padding: theme.spacing(2),
//   borderTopLeftRadius: theme.spacing(1),
//   borderTopRightRadius: theme.spacing(1),
//   marginBottom: theme.spacing(2),
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
// }));

// const FormButton = styled(Button)(({ theme }) => ({
//   [theme.breakpoints.down('sm')]: {
//     width: '100%',
//   },
// }));

// const FormContainer = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'row',
//   padding: theme.spacing(1),
//   gap: theme.spacing(1),
//   alignItems: 'center',
//   background:
//     'linear-gradient(to bottom, rgba(249, 251, 255, 1), rgba(249, 251, 255, 1), rgba(249, 250, 255, 1))',
// }));

// // Validation schema
// const schema = yup.object().shape({
//   client: yup
//     .object()
//     .nullable()
//     .transform((value, originalValue) => (originalValue === '' ? null : value))
//     .required('Client is required'),
//   projectType: yup
//     .object()
//     .nullable()
//     .transform((value, originalValue) => (originalValue === '' ? null : value))
//     .required('Project Type is required'),
//   projectCode: yup.string().required('Project Code is required'),
//   projectName: yup.string().required('Project Name is required'),
// });

// // Main component
// const ProjectManagement = () => {
//   const [selectedValue, setSelectedValue] = useState({});
//   const [tableData, setTableData] = useState([]);
//   const [projectType, setProjectTypeData] = useState([]);
//   const [clientInfo, setClientInfo] = useState([]);
//   const formRef = useRef();

//   const { startLoading, stopLoading } = useLoading();
//   const { openDialog } = useDialog();

//   const [formAction, setFormAction] = useState({
//     display: false,
//     action: 'update',
//   });

//   const [permissionLevels, setPermissionLevels] = useState({
//     create: null,
//     edit: null,
//     view: null,
//     delete: null,
//   });

//   const hasFetchedRoles = useRef(false);

//   const { reduxStore } = useOutletContext() || [];
//   const menuList = reduxStore?.menuDetails || [];

//   // Form setup
//   const {
//     control,
//     handleSubmit,
//     reset,
//     getValues,
//     formState: { errors },
//   } = useForm({
//     mode: 'onChange',
//     resolver: yupResolver(schema),
//   });

//   // API calls
//   const getTableData = async () => {
//     try {
//       startLoading();
//       const response = await get('master/AllProjectCreation', 'python');
//       setTableData(response);
//     } catch (error) {
//       console.error(error);
//       if (error.statusCode === 404) {
//         setTableData([]);
//       }
//     } finally {
//       stopLoading();
//     }
//   };

//   const getProjectTypeData = async () => {
//     try {
//       startLoading();
//       const response = await get('master/AllProjects', 'python');
//       setProjectTypeData(response);
//     } catch (error) {
//       console.error(error);
//       if (error.statusCode === 404) {
//         setProjectTypeData([]);
//       }
//     } finally {
//       stopLoading();
//     }
//   };

//   const getClientInfo = async () => {
//     try {
//       startLoading();
//       const response = await get('master/AllClients', 'python');
//       setClientInfo(response);
//     } catch (error) {
//       console.error(error);
//       if (error.statusCode === 404) {
//         setClientInfo([]);
//       }
//     } finally {
//       stopLoading();
//     }
//   };

//   // Effects
//   useEffect(() => {
//     const submenuDetails = getSubmenuDetails(
//       menuList,
//       getCurrentPathName(),
//       'path'
//     );
//     const permissionList = submenuDetails?.permission_level
//       .split(',')
//       .map((ele) => ele.trim().toLowerCase());

//     setPermissionLevels({
//       create: permissionList?.includes('create'),
//       edit: permissionList?.includes('edit'),
//       view: permissionList?.includes('view'),
//       delete: permissionList?.includes('delete'),
//     });

//     if (!hasFetchedRoles.current) {
//       getProjectTypeData();
//       getTableData();
//       getClientInfo();
//       hasFetchedRoles.current = true;
//     }
//   }, [menuList]);

//   useEffect(() => {
//     if (selectedValue) {
//       reset({
//         client:
//           clientInfo?.filter(
//             (ele) => ele.id === selectedValue.CLIENT_ID
//           )[0] ?? null,
//         projectType:
//           projectType.filter(
//             (ele) => ele.id === selectedValue.PROJECT_TYPE_CODE
//           )[0] ?? null,
//         projectName: selectedValue?.PROJECT_NAME ?? null,
//         projectCode: selectedValue?.PROJECT_NAME_CODE ?? null,
//       });
//     }
//   }, [selectedValue, clientInfo, reset, projectType, formAction]);

//   // Handlers
//   const addProject = () => {
//     if (permissionLevels?.create) {
//       setFormAction({
//         display: true,
//         action: 'add',
//       });
//     } else {
//       openDialog(
//         'critical',
//         'Access Denied',
//         'Your access is denied. Kindly contact system administrator.',
//         {
//           confirm: {
//             name: 'Ok',
//             isNeed: true,
//           },
//           cancel: {
//             name: 'Cancel',
//             isNeed: false,
//           },
//         },
//         () => {}
//       );
//     }
//   };

//   const onFormSubmit = async (formData) => {
//     try {
//       startLoading();
//       let response = null;
//       const isAdd = formAction.action === 'add';
//       const email = decodeData(getCookie('isUserIdCookieName'));

//       const body = {
//         projectName: titleCaseFirstWord(formData?.projectName),
//         clientId: formData.client.id,
//         projectCode: formData?.projectCode,
//         projectTypeCode: formData?.projectType.id,
//         createdby: email,
//         isActive: 1,
//       };

//       if (isAdd) {
//         response = await post('master/AllProjectCreation', body, 'python');
//       } else {
//         body.ID = selectedValue.PROJECT_NAME_CODE;
//         response = await put(
//           `master/AllProjectCreation?id=${body.ID}`,
//           body,
//           'python'
//         );
//       }

//       if (response.message) {
//         getTableData();
//         formRef.current.resetForm();
//         if (!isAdd) {
//           onFormReset();
//         }
//         openDialog(
//           'success',
//           `Project ${isAdd ? 'Addition' : 'Update'} Success`,
//           response.message ||
//             `Project has been ${isAdd ? 'added' : 'updated'} successfully`,
//           {
//             confirm: {
//               name: 'Ok',
//               isNeed: true,
//             },
//             cancel: {
//               name: 'Cancel',
//               isNeed: false,
//             },
//           },
//           () => {}
//         );
//       }
//     } catch (error) {
//       console.error(error);
//       const isAdd = formAction.action === 'add';
//       openDialog(
//         'warning',
//         'Warning',
//         error.errorMessage ||
//           `Project ${isAdd ? 'Addition' : 'Update'} failed`,
//         {
//           confirm: {
//             name: 'Ok',
//             isNeed: true,
//           },
//           cancel: {
//             name: 'Cancel',
//             isNeed: false,
//           },
//         },
//         () => {}
//       );
//     } finally {
//       stopLoading();
//     }
//   };

//   const onFormReset = () => {
//     setFormAction({
//       display: false,
//       action: null,
//     });
//     reset({
//       client: null,
//       projectType: null,
//       projectName: '',
//       projectCode: '',
//     });
//   };

//   const handleUpdateLogic = (selectedRow) => {
//     if (permissionLevels?.edit) {
//       setSelectedValue(selectedRow);
//       ScrollToTopButton();
//       setFormAction({
//         display: true,
//         action: 'update',
//       });
//     } else {
//       openDialog(
//         'critical',
//         'Access Denied',
//         'Your access is denied. Kindly contact system administrator.',
//         {
//           confirm: {
//             name: 'Ok',
//             isNeed: true,
//           },
//           cancel: {
//             name: 'Cancel',
//             isNeed: false,
//           },
//         },
//         () => {}
//       );
//     }
//   };

//   const handleDelete = (selectedRow) => {
//     if (permissionLevels?.delete) {
//       openDialog(
//         'warning',
//         'Delete confirmation',
//         'Are you sure you want to delete this project?',
//         {
//           confirm: {
//             name: 'Yes',
//             isNeed: true,
//           },
//           cancel: {
//             name: 'No',
//             isNeed: true,
//           },
//         },
//         (confirmed) => {
//           if (confirmed) {
//             removeDataFromTable(selectedRow);
//           }
//         }
//       );
//     } else {
//       openDialog(
//         'critical',
//         'Access Denied',
//         'Your access is denied. Kindly contact system administrator.',
//         {
//           confirm: {
//             name: 'Ok',
//             isNeed: true,
//           },
//           cancel: {
//             name: 'Cancel',
//             isNeed: false,
//           },
//         },
//         () => {}
//       );
//     }
//   };

//   const removeDataFromTable = async (selectedRow) => {
//     try {
//       startLoading();
//       setFormAction({
//         display: false,
//         action: null,
//       });
//       const response = await remove(
//         `master/AllProjectCreation?id=${selectedRow.PROJECT_NAME_CODE}`,
//         'python'
//       );
//       if (response) {
//         getTableData();
//         openDialog(
//           'success',
//           'Project Deletion Success',
//           response.message || 'Project has been deleted successfully',
//           {
//             confirm: {
//               name: 'Ok',
//               isNeed: true,
//             },
//             cancel: {
//               name: 'Cancel',
//               isNeed: false,
//             },
//           },
//           () => {}
//         );
//       }
//     } catch (error) {
//       openDialog(
//         'warning',
//         'Warning',
//         error.errorMessage || 'Project Deletion failed',
//         {
//           confirm: {
//             name: 'Ok',
//             isNeed: true,
//           },
//           cancel: {
//             name: 'Cancel',
//             isNeed: false,
//           },
//         },
//         () => {}
//       );
//     } finally {
//       stopLoading();
//     }
//   };

//   const handleExport = () => {
//     const columnOrder = [
//       'PROJECT_NAME_CODE',
//       'PROJECT_NAME',
//       'CLIENT_ID',
//       'CLIENT_NAME',
//       'PROJECT_TYPE_CODE',
//       'PROJECT_TYPE_NAME',
//     ];
//     generateCSV(
//       tableData,
//       `project_creation_${timeStampFileName(new Date())}`,
//       columnOrder
//     );
//   };

//   // Form component
//   const ProjectCreationForm = () => {
//     const [readOnly, setReadOnly] = useState(false);
//     const [isFocused, setIsFocused] = useState(false);

//     useEffect(() => {
//       setReadOnly(formAction?.action === 'read');
//       if (formAction.action === 'add') {
//         reset({
//           client: '',
//           projectType: '',
//           projectCode: '',
//           projectName: '',
//         });
//       }
//     }, [formAction, reset]);

//     useEffect(() => {
//       const sanitizeInputs = () => {
//         const inputs = document.querySelectorAll('input');
//         inputs.forEach((input) => {
//           input.value = DOMPurify.sanitize(input.value);
//         });
//       };
//       sanitizeInputs();
//     }, []);

//     return (
//       <FormContainer component="form" className="panel-bg" onSubmit={handleSubmit(onFormSubmit)}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <Controller
//               name="client"
//               control={control}
//               render={({ field }) => (
//                 <Autocomplete
//                   {...field}
//                   options={clientInfo}
//                   getOptionLabel={(option) => option.name}
//                   isOptionEqualToValue={(option, value) =>
//                     option.id === value.id
//                   }
//                   value={field.value || null}
//                   onChange={(_, data) => field.onChange(data)}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       label="Select client"
//                       fullWidth
//                       error={!!errors.client}
//                       helperText={errors.client?.message}
//                       InputLabelProps={{
//                         shrink: Boolean(field.value || isFocused.client),
//                       }}
//                       InputProps={{
//                         ...params.InputProps,