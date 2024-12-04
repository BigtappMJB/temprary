package com.cmd.constants;

/**
 * @author ISV7915
 *
 */
public final class CmdConstants {

	private CmdConstants() {
		throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
	}

//	JWT Secret
	public static final String CMD_SECRET = "Data Maintenance App";

	// Upload Excel Constants
	public static final String INSERT_PREFIX = "INSERT INTO ";
	public static final String UPDATE_PREFIX = "UPDATE ";
	public static final String DELETE_PREFIX = "DELETE";
	public static final String FROM_KEY = " FROM ";
	public static final String WHERE_KEY = " WHERE ";
	public static final String AND_KEY = " AND ";
	public static final String OR_KEY = " OR ";
	public static final String SET_KEY = " SET ";
	public static final String QUERY_INSERT_OPERATION = "NEW";
	public static final String QUERY_UPDATE_OPERATION = "UPD";
	public static final String QUERY_DELETE_OPERATION = "DEL";
	public static final String QUERY_SINGLE_SPACING = " ";
	public static final String QUERY_DOUBLE_SPACING = "  ";
	public static final String QUERY_BACK_TICK = "`";

	// Login Controller constants
	public static final String MSG_REDIRECT_TO_HOME = "Redirecting to Home page";
	public static final String MSG_ERROR_REDIRECT_TO_HOME = "Error redirecting to home!";
	public static final String MSG_BAD_REQUEST = "Bad Request";
	public static final String MSG_LOGIN_SUCCESSFUL = "User logged in successfully";
	public static final String MSG_USER_DETAILS_ERROR = "Error while fetching user details";
	public static final String MSG_USER_NOT_EXISTS = "User does not exists";
	public static final String MSG_USER_LOGIN_ERROR = "Unauthorized User, User ID does not exists, Contact Application Admin.";
	public static final String MSG_USER_LOGOUT_SUCCESSFULL = "Successfully logged out";
	public static final String MSG_USER_LOGOUT_ERROR = "Logout fiaild due to exception";
	public static final String MSG_COMMON_ERROR = "Error found hile doing the operation";

	// User Management Controller constants
	public static final String USER = "User ";
	public static final String ROLE = "Role ";
	public static final String MODULE = "Module";
	public static final String SUB_MODULE = "Submodule";
	public static final String PERMISSION = "Permission";
	public static final String SCHEDULAR = "Schedular";
	public static final String S = "s";
	public static final String UPDATE_SCHEDULER_ERROR = "Error in updating the %s value ";

	public static final String GETTING_ALL = "Getting all ";
	public static final String ADDED_SUCCESSFULLY = " added successfully";
	public static final String MSG_ERROR_GETTING_ALL = "Error getting all ";
	public static final String MSG_ERROR_ADDING = "Error occurred while adding ";
	public static final String MSG_SAVED_SUCCESSFULLY = " saved successfully";
	public static final String MSG_DELETED_SUCCESSFULLY = " deleted successfully";
	public static final String MSG_ERROR_SAVING = "Error while saving ";
	public static final String MSG_ERROR_DELETING = "Error while deleting ";
	public static final String DOES_NOT_FOUND = " does not exists";
	public static final String FOUND = " found";
	public static final String ALREADY_EXISTS = " already exists";
	public static final String ALREADY_DOESNOT_EXISTS = " Does not exists";
	public static final String ALREADY_DELETED = " already deleted";
	public static final String ALREADY_ASSIGNED = " already assigned";
	public static final String ROLE_PERMISSIONS_FETCHED_SUCCESSFULLY = "Role Permissions fetched successfully";
	public static final String ACCESS_PERMISSIONS = "Access Permissions";
	public static final String INVALID_TOKEN = "Invalid token found.";
	public static final String VALID_TOKEN = "Valid token";
	public static final String MSG_USER_AUTORIZATION_FAILED = " Authorization Failed.";
	public static final Object MSG_CANNOT_LOGIN = "Cannot login, please check your inputs";

	public static final String DELETED = "Deleted";

	public static final String TABLE = "Table";

	public static final String INVALID_PASSWORD = "Password not matched with user's Password";

	public static final String DEFAULT = "Default";

	public static final String TOKEN_EXPIRED = "Token Expired!";

	public static final String TEMPLATE_DETAILS = "template Details";

	public static final String INVALID_OLD_PASSWORD = "Old password does not match!";

	public static final String PASSWROD_CHANGED_SUCCESSFULLY = "Password changed successfully";

	public static final String MSG_ERROR_CHANGING_PWD = "Error while changing password";

	public static final String COLUMMN = "Column";

	public static final String UPLOADED_FILE = "File Uploaded ";

	public static final String SUCCSSESSFULLY = "Successfully";

	public static final String EXCEPTION_OCCURRED_WHILE_UPLOADING_FILE = "Exception while uploading file";

	public static final String TABLE_COLUMNS_FETCHED_SUCCESSFULLY = "Table Columns has been fetched successfully";

//	CSV generator constants
	public static final String SELECT_TABLE_QUERY_PREFIX = "SELECT * FROM `%s` where deleted_flag=0 and iscsvrequired=0 and schedulernumber=%s ";

	public static final String SELECT_QUERY_PREFIX = "SELECT * FROM `";
	public static final String SELECT_QUERY_PREFIX2 = "SELECT * FROM `%s`";
	public static final String SELECT_QUERY_AUDIT_LOG = "INSERT INTO `audit_log` VALUES ('%s', 'CSV Scheduler', 'DEL', '%s', 'Backend Process', 0, 0, %s, DEFAULT, '%s');";
	public static final String ADHOC_BLOOMBERG_REQUEST = "adhoc_bloomberg_request";

	public static final String REASON = "REASON";

	public static final String CSV_GENERATED_FOR_TABLE = "CSV generated for table: {}";
	public static final String CSV_GENERATED_FOR_TABLE_COUNT = "SUMMERY OF CSV FILE : Total number of tables= {}, Successfully generated cvc's= {}, Failed csv's= {}";

	public static final String DATABASE_ERROR = "Database Error: {}";

	public static final String FILE_IOERROR = "File IO Error: {}";

	public static final String DATABSE_CONNECTION_CLOSED = "Database connection closed";

	public static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

	public static final String TIMESTAMP_FORMAT = "yyyyMMddHHmmss";

	public static final String CSV_SCHEDULAR_ENABLED = "Csv Schedular ended";

	public static final String CSV_SCHEDULER_STARTED = "Csv Schedular Started";

	public static final String CANNOTT_CREATE_CONNECTION = "Can not create connection..!";

	public static final String TEMPLATE_RETRIVED_SUCCESSFULLY = "Template retrived successlully";

	public static final String ERROR_WHILE_FETCHING_TEMPLATE = "Error while fetching table Template";

	public static final String FETCHED = " Fetched ";

	public static final String FETCHING = " fetching ";

	public static final String WHILE = " while ";

	public static final String ERROR = "Error";

	public static final String TRUE = "true";

	public static final String TABLE_INFO_CANNOT_BE_NULL = "Table Infor can not be null";

	public static final String TABLE_DATA = "Table data";

	public static final String ALL = "ALL ";

	public static final String INVALID_REC_CSV_CREATED_SUCCESSFULLY = "Successfully created invalied records csv file";

	public static final String INVALID_RECORDS = "Upload Failed: ";

	public static final String SENDING_EMAIL = "Sending email ";

	public static final String CALLING_RETURN_FUNCTION = "Calling return function.";

	public static final String RETURNED_UPLOAD_RESPONSE = " Returned upload response";

	public static final String ENTERING = "Entering {}";

	public static final String LEAVING = "Leaving {}";

	public static final String EXPIRED = "Passowrd Expired";

	public static final String USER_INACTIVE = "User inactive since long time. Please contact super admin";

	public static final String INACTIVE_USER = "User is no longer active. Contact Application Admin.";

	public static final String CONTACT_ADMINSTRATOR = "Contact application admin";

	public static final String NOT_MAPPED = " Not mapped";

	public static final String USER_DELETED = " Authentication Failed, User is a deleted User, Contact Application Admin.";

	public static final String SUCCESS = "success";
	public static final String FAILURE = "failure";
	public static final String TOKEN_MESSEAGE = "failure";

	public static final String MSG_IAM_UNAUTORIZED = "UnAuthorized User";

	public static final int IAM_DEFAULT_ROLEID = 5;
	public static final int STATUS_CODE_SUCCESS = 0;
	public static final int STATUS_CODE_FAILURE = 1;
	public static final String STATUS = "status";
	public static final String ROLE_ID = "Role id";

	public static final String REUPD = "REUPD";

//	DMA Tables Column Names

	public static final String SECURITY_DES2 = "SECURITY_DES2";
	public static final String SECURITY_DES = "SECURITY_DES";
	public static final String PRIMARY_ASSET_ID_TYPE = "PRIMARY_ASSET_ID_TYPE";
	public static final String PRIMARY_ASSET_ID = "PRIMARY_ASSET_ID";
	public static final String NTUC_SECTYPE_2 = "NTUC_SECTYPE_2";
	public static final String NTUC_SECTYPE_1 = "NTUC_SECTYPE_1";
	public static final String NTUC_SECTYPE1_LONGDESC = "NTUC_SECTYPE1_LONGDESC";
	public static final String MAX_LIMIT = "MAX_LIMIT";
	public static final String INACTIVE_FLAG = "INACTIVE_FLAG";
	public static final String FUND_NAME = "FUND_NAME";
	public static final String ENTITY_ID = "ENTITY_ID";
	public static final String ENTITY_NAME = "ENTITY_NAME";
	public static final String EFFECTIVE_DATE = "EFFECTIVE_DATE";
	public static final String CRNCY = "CRNCY";
	public static final String CNTRY_ISSUE_ISO = "CNTRY_ISSUE_ISO";
	public static final String BUSINESS_SECTOR = "BUSINESS_SECTOR";

}
