import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class MyAppHttp {
  
  public static readonly ToastType = {
    ERROR: 'error',
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
  };

  public static readonly ToasterMessage = {
    tableName1: "Uploaded template ",
    tableName2: " is not matching with selected table name ",
    tableName3: ". Please select correct data upload template.",
    excelColumns: "Invalid data columns. Make sure data columns details present in Row-4 in data uploading template.",
    excelData: "Template column data type is not matching with table column data. Please make sure column data is valid.",
    templateSuccess: "Saved Successfully",
    actionInvalid1: "Invalid ACTION",
    actionInvalid2: "This record cannot be processed.",
    mandatory1: "Data is empty.",
    mandatory2: " data is mandatory. Please provide data.",
    fieldLength1: " data length more than defined length ",
    fieldLength2: ". Please provide valid data.",
    dataType1: "Invalid column data type. ",
    dataType2: " data type is ",
    dataType3: ". Please provide valid data type data.",
    number: "Make sure columns with numeric is valid",
    templateValidation: "Data field mapping is missing. Please complete the mapping using table configurator.",
    onlyExcel: "Invalid file type. Please upload files with XLS/XLSX type only.",
    userSaved: "User details are updated successfully.",
    noData: "No data found",
    activeOrNot: "User's role is Inactive. Contact Application Admin.",
    deleteAction: "Record does not exist with primary key(s). This record cannot be processed.",
    duplicateEntry: "Record already exist. This record cannot be processed.",
    invalidActionCol: " is a invalid action. Can not process this record.",
    columnsCount: "Template columns count does not match with table columns count. Please ensure only correct columns are present.",
    RecorddoesexistsPK: "Record does not exists.",
    UpdateAction: "Record does not exist with primary key(s). This record can not be processed.",
    Unauthorizedaction: "Invalid Action. User do not have  permission to delete records.",
    deleteRecord: "Record is already deleted. This record can not be processed.",
    uploadSuccess: "Loading successful/completed.",
    invalidActionPermission1: "Action values can only be ",
    invalidActionPermission2: ". Please check upload file.",
    NoRecords: "No data records found. Please upload with data records.",
    EmptyTemplate: "Not a standard upload template. Please upload valid upload template.",
    PrimaryKeyNotSetup: "Primary-key is not defined for this upload template. Would you like to proceed?",
    nullMessage: " should not be NULL"
  }

  public static readonly notificationTimeOut = 60000; //15 seconds

  public static readonly idleTimeOut = 3600; //30 mins

  public static readonly passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/
}