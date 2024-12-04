/**
 * 	Date,			Author,		Description
 * 
 * 	2021-15-10,		ISV7915,		UserManagementService  class 
 * 									Initial version
 *	2021-1-11,		ISV7915,		Latest optimization logic added
 */

package com.cmd.excel.service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cmd.constants.CmdConstants;
import com.cmd.domain.RoleDto;
import com.cmd.domain.RolePermissionsDto;
import com.cmd.domain.SubmodulePermissions;
import com.cmd.domain.UserDetails;
import com.cmd.domain.UserDto;
import com.cmd.domain.response.IamResponse;
import com.cmd.domain.response.Response;
import com.cmd.excel.helper.UserServiceHelper;
import com.cmd.excel.model.AccessPermission;
import com.cmd.excel.model.CmdModule;
import com.cmd.excel.model.CmdTable;
import com.cmd.excel.model.IamUsers;
import com.cmd.excel.model.PermissionValue;
import com.cmd.excel.model.Role;
import com.cmd.excel.model.RolePermissions;
import com.cmd.excel.model.SubModule;
import com.cmd.excel.model.UserToken;
import com.cmd.excel.repository.AccessRepository;
import com.cmd.excel.repository.CmdTableRepository;
import com.cmd.excel.repository.IamUserRepository;
import com.cmd.excel.repository.ModuleRepository;
import com.cmd.excel.repository.PermissionRepository;
import com.cmd.excel.repository.PermissionValueRepository;
import com.cmd.excel.repository.RoleRepository;
import com.cmd.excel.repository.SubModuleRepository;
import com.cmd.excel.repository.UserTokenRepository;
import com.cmd.excel.utils.CmdUtils;

/**
 * Service for user management module
 * 
 * @author ISV7915
 *
 */
@Service
public class IamUserManagementService {
	private static final Logger logger = LoggerFactory.getLogger(IamUserManagementService.class);

	@Autowired
	CmdUtils dmaUtils;

	@Autowired
	IamUserRepository userRepository;

	@Autowired
	IamLoginService loginService;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	PermissionRepository permissionRepository;

	@Autowired
	UserServiceHelper userServiceHelper;

	@Autowired
	ModuleRepository moduleRepository;

	@Autowired
	SubModuleRepository subModuleRepository;

	@Autowired
	AccessRepository accessRepository;

	@Autowired
	PermissionValueRepository permissionValueRepository;

	@Autowired
	CmdTableRepository dmaTableRepository;

	@Autowired
	UserTokenRepository userTokenRepository;

	private HttpStatus httpStatus;
	private int statusCode;
	private String status;
	private String message;
	private Response response = new Response();
	private IamResponse iamResponse = new IamResponse();

	/**
	 * For getting all items from db
	 * 
	 * @param itemType
	 * @return Object
	 */
	public Object getAll(String itemType) {
		try {
			httpStatus = HttpStatus.OK;
			if (itemType.equals("users")) {
				List<IamUsers> allUsers = getAllUsers();
				message = CmdConstants.ALL + CmdConstants.USER + CmdConstants.S + CmdConstants.FETCHED
						+ CmdConstants.SUCCSSESSFULLY;
				dmaUtils.logInfoDebugMessage(logger, message);
				return new ResponseEntity<>(allUsers, httpStatus);
			} else if (itemType.equals("modules")) {
				List<CmdModule> allModules = getAllModules();
				message = CmdConstants.ALL + CmdConstants.MODULE + CmdConstants.S + CmdConstants.FETCHED
						+ CmdConstants.SUCCSSESSFULLY;
				dmaUtils.logInfoDebugMessage(logger, message);
				return new ResponseEntity<>(allModules, httpStatus);
			} else if (itemType.equals("submodules")) {
				List<SubModule> allSubModules = getAllSubModules();
				message = CmdConstants.ALL + CmdConstants.SUB_MODULE + CmdConstants.S + CmdConstants.FETCHED
						+ CmdConstants.SUCCSSESSFULLY;
				dmaUtils.logInfoDebugMessage(logger, message);
				return new ResponseEntity<>(allSubModules, httpStatus);
			} else if (itemType.equals("roles")) {
				List<Role> allRoles = getAllRoles();
				message = CmdConstants.ALL + CmdConstants.ROLE + CmdConstants.S + CmdConstants.FETCHED
						+ CmdConstants.SUCCSSESSFULLY;
				dmaUtils.logInfoDebugMessage(logger, message);
				return new ResponseEntity<>(allRoles, httpStatus);
			} else if (itemType.equals("tables")) {
				List<CmdTable> allTables = getAllTables();
				message = CmdConstants.GETTING_ALL + CmdConstants.TABLE + CmdConstants.S;
				message = CmdConstants.ALL + CmdConstants.TABLE + CmdConstants.S + CmdConstants.FETCHED
						+ CmdConstants.SUCCSSESSFULLY;
				dmaUtils.logInfoDebugMessage(logger, message);
				return new ResponseEntity<>(allTables, httpStatus);
			} else if (itemType.equals("accessPemissions")) {
				List<AccessPermission> allAccessPermission = getAccessPermissions();
				message = CmdConstants.ALL + CmdConstants.ACCESS_PERMISSIONS + CmdConstants.S + CmdConstants.FETCHED
						+ CmdConstants.SUCCSSESSFULLY;
				dmaUtils.logInfoDebugMessage(logger, message);
				return new ResponseEntity<>(allAccessPermission, httpStatus);
			} else {
				message = CmdConstants.MSG_BAD_REQUEST;
				dmaUtils.logInfoErrorMessage(logger, message);
				httpStatus = HttpStatus.BAD_REQUEST;
				response = new Response(message, httpStatus.value(), httpStatus.getReasonPhrase());
				return new ResponseEntity<>(response, httpStatus);
			}
		} catch (Exception e) {
			message = CmdConstants.MSG_ERROR_GETTING_ALL + itemType;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
			return new ResponseEntity<>(response, httpStatus);
		}

	}

	/**
	 * For managing user operation like add save delete etc
	 * 
	 * @param operation
	 * @param user
	 * @return ResponseEntity<>(
	 */
	public ResponseEntity<IamResponse> manageUser(String operation, UserDto user) {
		this.httpStatus = HttpStatus.OK;
		Base64.Encoder encoder = Base64.getEncoder();
		IamUsers userReq = new IamUsers();
		userReq = dmaUtils.converDtoToEntity(user, userReq);

		try {
			IamUsers dbUser = loginService.getUserById(user.getUserName());
			if (operation.equals("add")) {
				Boolean validResult = validationUser(userReq);
				if (Boolean.FALSE.equals(validResult)) {
					return new ResponseEntity<>(iamResponse, httpStatus);
				}
				if (userReq.getPassword() != null) {
					String str = encoder.encodeToString(user.getPassword().getBytes());
					userReq.setPassword(str);
				}
				addUserDetails(userReq, dbUser);
			} else if (operation.equals("save")) {
				Boolean validResult = validationUser(userReq);
				if (Boolean.FALSE.equals(validResult)) {
					return new ResponseEntity<>(iamResponse, httpStatus);
				}
				if (userReq.getPassword() != null) {
					String str = encoder.encodeToString(user.getPassword().getBytes());
					userReq.setPassword(str);
				}
				updateUserDetails(userReq, dbUser);
			} else if (operation.equals("delete")) {
				deleteUserDetails(dbUser);
			} else if (operation.equals("statusChange")) {
				userStatusChange(user, dbUser);
			} else if (operation.equals("roleChange")) {
				userRoleChange(user, dbUser);
			}
			dmaUtils.logInfoDebugMessage(logger, message);
		} catch (Exception e) {
			statusCode = 1;
			status = CmdConstants.FAILURE;
			message = CmdConstants.MSG_ERROR_SAVING + CmdConstants.USER;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
			iamResponse = new IamResponse(statusCode, status, message);
		}
		return new ResponseEntity<>(iamResponse, httpStatus);
	}

	/**
	 * @param user
	 * @param dbUser
	 */
	private void userRoleChange(UserDto user, IamUsers dbUser) {
		statusCode = 0;
		status = CmdConstants.SUCCESS;
		message = CmdConstants.USER + CmdConstants.ROLE_ID + CmdConstants.MSG_SAVED_SUCCESSFULLY;
		if (null == dbUser) {
			statusCode = 1;
			status = CmdConstants.FAILURE;
			message = CmdConstants.USER + CmdConstants.ALREADY_DOESNOT_EXISTS;
		} else if (dbUser.getRoleId().equals(user.getRoleId())) {
			statusCode = 1;
			status = CmdConstants.FAILURE;
			message = CmdConstants.USER + CmdConstants.ROLE_ID + CmdConstants.ALREADY_ASSIGNED;
		} else {
			dbUser.setRoleId(user.getRoleId());
			saveUser(dbUser);
		}
		iamResponse = new IamResponse(statusCode, status, message);
	}

	/**
	 * @param user
	 * @param dbUser
	 */
	private void userStatusChange(UserDto user, IamUsers dbUser) {
		statusCode = 0;
		status = CmdConstants.SUCCESS;
		message = CmdConstants.USER + CmdConstants.STATUS + CmdConstants.MSG_SAVED_SUCCESSFULLY;
		if (null == dbUser) {
			statusCode = 1;
			status = CmdConstants.FAILURE;
			message = CmdConstants.USER + CmdConstants.ALREADY_DOESNOT_EXISTS;
		} else if (dbUser.getStatus().equals(user.getStatus())) {
			statusCode = 1;
			status = CmdConstants.FAILURE;
			message = CmdConstants.USER + CmdConstants.STATUS + CmdConstants.ALREADY_ASSIGNED;
		} else {
			dbUser.setStatus(user.getStatus());
			saveUser(dbUser);
		}
		iamResponse = new IamResponse(statusCode, status, message);
	}

	/**
	 * @param dbUser
	 */
	private void deleteUserDetails(IamUsers dbUser) {
		statusCode = 0;
		status = CmdConstants.SUCCESS;
		message = CmdConstants.USER + CmdConstants.MSG_DELETED_SUCCESSFULLY;
		if (null == dbUser) {
			statusCode = 1;
			status = CmdConstants.FAILURE;
			message = CmdConstants.USER + CmdConstants.ALREADY_DOESNOT_EXISTS;
		} else if (dbUser.getDeletFlag() == 1) {
			statusCode = 1;
			status = CmdConstants.FAILURE;
			message = CmdConstants.USER + CmdConstants.ALREADY_DELETED;
		} else {
			dbUser.setDeletFlag(1);
			saveUser(dbUser);
		}
		iamResponse = new IamResponse(statusCode, status, message);
	}

	/**
	 * @param userReq
	 * @param dbUser
	 */
	private void updateUserDetails(IamUsers userReq, IamUsers dbUser) {
		statusCode = 0;
		status = CmdConstants.SUCCESS;
		message = CmdConstants.USER + CmdConstants.MSG_SAVED_SUCCESSFULLY;
		if (null == dbUser) {
			statusCode = 1;
			status = CmdConstants.FAILURE;
			message = CmdConstants.USER + CmdConstants.ALREADY_DOESNOT_EXISTS;
		} else {
			userReq.setId(dbUser.getId());
			userReq.setStatus(dbUser.getStatus());
			saveUser(userReq);
		}
		iamResponse = new IamResponse(statusCode, status, message);
	}

	/**
	 * @param userReq
	 * @param dbUser
	 */
	private void addUserDetails(IamUsers userReq, IamUsers dbUser) {
		if (null == dbUser) {
			saveUser(userReq);
			statusCode = 0;
			status = CmdConstants.SUCCESS;
			message = CmdConstants.USER + CmdConstants.ADDED_SUCCESSFULLY;
			iamResponse = new IamResponse(statusCode, status, message);
		} else {
			statusCode = 1;
			status = CmdConstants.FAILURE;
			message = CmdConstants.USER + CmdConstants.ALREADY_EXISTS;
			httpStatus = HttpStatus.NOT_ACCEPTABLE;
			iamResponse = new IamResponse(statusCode, status, message);
		}
	}

	public Boolean validationUser(IamUsers userReq) {
		String passPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$";
		String emailPattern = "^[a-zA-Z0-9.]+@[a-z0-9-]+(.[a-z]{2,4})$";
		String mobilePattern = "^(\\+\\d{1,3}[- ]?)?\\d{8}$";
		String ipPattern = "^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\\.(?!$)|$)){4}$";

		String pwd = userReq.getPassword();
		String email = userReq.getEmail();
		String mobile = userReq.getMobileNumber();
		String ip = userReq.getIpAddress();
		String userName = userReq.getUserName();

		if (userName == null || userName.isEmpty()) {
			statusCode = 1;
			status = CmdConstants.FAILURE;
			message = "User Details Should not be Null";
			httpStatus = HttpStatus.NOT_ACCEPTABLE;
			iamResponse = new IamResponse(statusCode, status, message);
			return false;
		}
		if (pwd != null) {
			message = "Checking Valid Password";
			if (!Pattern.matches(passPattern, pwd)) {
				statusCode = 1;
				status = CmdConstants.FAILURE;
				message = "Provide Valid Password";
				httpStatus = HttpStatus.NOT_ACCEPTABLE;
				iamResponse = new IamResponse(statusCode, status, message);
				return false;
			}
		}
		if (email != null) {
			message = "Checking Valid Email";
			if (!Pattern.matches(emailPattern, email)) {
				statusCode = 1;
				status = CmdConstants.FAILURE;
				message = "Provide Valid Email";
				httpStatus = HttpStatus.NOT_ACCEPTABLE;
				iamResponse = new IamResponse(statusCode, status, message);
				return false;
			}
		}
		if (mobile != null) {
			message = "Checking Valid Mobile Number";
			if (!Pattern.matches(mobilePattern, mobile)) {
				statusCode = 1;
				status = CmdConstants.FAILURE;
				message = "Provide Valid Mobile Number";
				httpStatus = HttpStatus.NOT_ACCEPTABLE;
				iamResponse = new IamResponse(statusCode, status, message);
				return false;
			}
		}
		if (ip != null) {
			message = "Checking Valid IP Address";
			if (!Pattern.matches(ipPattern, ip)) {
				statusCode = 1;
				status = CmdConstants.FAILURE;
				message = "Provide Valid IP Address";
				httpStatus = HttpStatus.NOT_ACCEPTABLE;
				iamResponse = new IamResponse(statusCode, status, message);
				return false;
			}
		}
		return true;
	}

	/**
	 * For get user by user Id
	 * 
	 * @param userId
	 * @return Users
	 */
	public IamUsers getUserById(String userId) {
		return userRepository.findUserByUserId(userId);
	}

	/**
	 * For get user by Id
	 * 
	 * @param id
	 * @return Users
	 */
	public Object getUserById(int id) {
		IamUsers user = new IamUsers();
		try {
			user = userRepository.findUserById(id);
			if (null == user) {
				message = CmdConstants.ROLE + CmdConstants.DOES_NOT_FOUND;
				dmaUtils.logInfoDebugMessage(logger, message);
				httpStatus = HttpStatus.NOT_FOUND;
				return new ResponseEntity<>(new Response(message, httpStatus.value(), message), httpStatus);
			} else {
				message = CmdConstants.USER + CmdConstants.FOUND;
				dmaUtils.logInfoDebugMessage(logger, message);
				httpStatus = HttpStatus.OK;
				return new ResponseEntity<>(user, httpStatus);
			}
		} catch (Exception e) {
			message = CmdConstants.ROLE + CmdConstants.DOES_NOT_FOUND;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
			return new ResponseEntity<>(new Response(message, httpStatus.value(), e.getLocalizedMessage()), httpStatus);
		}
	}

	/**
	 * For is user exists
	 * 
	 * @param userId
	 * @return isUderExists
	 */
	public boolean userExists(String userId) {
		boolean isUserExists = false;
		int userCount = userRepository.findByUserId(userId);
		if (userCount > 0) {
			isUserExists = true;
		}
		return isUserExists;
	}

	/**
	 * For fetching all users
	 * 
	 * @return List<Users>
	 */
	public List<IamUsers> getAllUsers() {
		return userRepository.getAllUsers();
	}

	/**
	 * For fetching all Roles
	 * 
	 * @return List<Role>
	 */
	public List<Role> getAllRoles() {
		return roleRepository.getAllRoles();
	}

	/**
	 * For fetching all role permissions
	 * 
	 * @return List<RolePermissions>
	 */
	public List<RolePermissions> getAllPermissions() {
		return permissionRepository.findAll();
	}

	/**
	 * For fetching all modules
	 * 
	 * @return List<DmaModule>
	 */
	public List<CmdModule> getAllModules() {
		return moduleRepository.findAll();
	}

	/**
	 * For fetching all Sub modules
	 * 
	 * @return List<SubModule>
	 */
	public List<SubModule> getAllSubModules() {
		return subModuleRepository.findAll();
	}

	/**
	 * For fetching module Sub modules
	 * 
	 * @return List<SubModule>
	 */
	public List<SubModule> getModuleSubModules(int moduleId) {
		return subModuleRepository.getModuleSubModules(moduleId);
	}

	/**
	 * For saving user
	 * 
	 * @param user
	 */
	public void saveUser(IamUsers user) {
		userRepository.save(user);
	}

	/**
	 * For saving role
	 * 
	 * @param roleDto
	 * @return boolean
	 */
	public boolean saveRole(Role role) {
		return roleRepository.save(role) != null;
	}

	/**
	 * For role edists or not
	 * 
	 * @param roleName
	 * @return boolean
	 */
	public boolean roleExists(String roleName) {
		int roleCount = roleRepository.findByRoleName(roleName);
		return roleCount > 0;
	}

	/**
	 * Api for manage role
	 * 
	 * @param operation
	 * @param role
	 * @return Response
	 */
	public Object manageRole(String operation, RoleDto roleDto) {
		String role = null == roleDto.getRoleName() ? roleDto.getRoleName() : roleDto.getRoleName().trim();

		if (StringUtils.isEmpty(role)) {
			httpStatus = HttpStatus.NOT_ACCEPTABLE;
			statusCode = 1;
			status = CmdConstants.FAILURE;
			message = "Role Should not be Empty or Null";
			logger.error(message);
			iamResponse = new IamResponse(statusCode, status, message);
			return new ResponseEntity<>(iamResponse, httpStatus);
		}

		try {
			logger.info("Checking Role Exists");
			Boolean roleExists = roleExists(roleDto.getRoleName());
			if (operation.equals("add")) {
				if (Boolean.FALSE.equals(roleExists)) {
					roleAdd(roleDto);
				} else {
					statusCode = 1;
					status = CmdConstants.FAILURE;
					message = CmdConstants.ROLE + CmdConstants.ALREADY_EXISTS;
					httpStatus = HttpStatus.CONFLICT;
					logger.error(message);
				}
			} else if (operation.equals("delete")) {
				if (Boolean.TRUE.equals(roleExists)) {
					roleDelete(roleDto);
				} else {
					statusCode = 1;
					status = CmdConstants.FAILURE;
					message = CmdConstants.ROLE + " Does not Exsits";
					httpStatus = HttpStatus.CONFLICT;
					logger.error(message);
				}
			} else {
				statusCode = 1;
				status = CmdConstants.FAILURE;
				message = "Invaid Action, Please Contact Application Admin";
				httpStatus = HttpStatus.CONFLICT;
				logger.error(message);
			}
			response = new Response(message, httpStatus.value(), message);
		} catch (Exception e) {
			message = CmdConstants.MSG_ERROR_SAVING + CmdConstants.USER;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
			statusCode = 1;
			status = CmdConstants.FAILURE;
			response = new Response(message, httpStatus.value(), e.getLocalizedMessage());
		}
		iamResponse = new IamResponse(statusCode, status, message);
		return new ResponseEntity<>(iamResponse, httpStatus);
	}

	private void roleAdd(RoleDto roleDto) {
		roleDto.setId(roleRepository.findMaxId() + 1);
		roleDto.setRoleId(roleRepository.findMaxId() + 1);
		roleDto.setIsActive("N");
		Role newRole = new Role();
		newRole = dmaUtils.roleDtoToEntity(roleDto, newRole);
		saveRole(newRole);
		message = CmdConstants.ROLE + CmdConstants.ADDED_SUCCESSFULLY;

		statusCode = 0;
		status = CmdConstants.SUCCESS;
		message = CmdConstants.ROLE + CmdConstants.ADDED_SUCCESSFULLY;
		iamResponse = new IamResponse(statusCode, status, message);

		if (addDefaultPermissions(roleDto.getId(), permissionRepository.findMaxId())) {
			logger.info("Default permissions added");
		} else {
			message = CmdConstants.MSG_ERROR_ADDING + CmdConstants.DEFAULT + " " + CmdConstants.PERMISSION
					+ CmdConstants.S;
		}
	}

	
	/**
	 * @param dbRole
	 */
	private void roleDelete(RoleDto roleDto) {
		Role dbRole = roleRepository.getByRoleName(roleDto.getRoleName());
		if (null == dbRole) {
			statusCode = 1;
			status = CmdConstants.FAILURE;
			message = "Role was Conflicted contact Appication Admin";
			httpStatus = HttpStatus.CONFLICT;
			logger.error(message);
		} else if (dbRole.getIsDeleted() == 1) {
			statusCode = 1;
			status = CmdConstants.FAILURE;
			message = CmdConstants.ROLE + CmdConstants.ALREADY_DELETED;
			httpStatus = HttpStatus.UNAUTHORIZED;
			logger.warn(message);
		} else {
			dbRole.setIsDeleted(1);
			saveRole(dbRole);
			statusCode = 0;
			status = CmdConstants.SUCCESS;
			message = CmdConstants.ROLE + CmdConstants.MSG_DELETED_SUCCESSFULLY;
			httpStatus = HttpStatus.OK;
			logger.info(message);
		}
		iamResponse = new IamResponse(statusCode, status, message);
	}

	/**
	 * Get role by role Id
	 * 
	 * @param roleId
	 * @return Role
	 */
	public Role getRoleByRoleId(int roleId) {
		return roleRepository.getByRoleId(roleId);
	}

	/**
	 * For fetching role by role Id
	 * 
	 * @param roleId
	 * @return Role
	 */
	public Object getRoleById(int roleId) {
		this.httpStatus = HttpStatus.OK;
		Role role = new Role();
		try {
			role = roleRepository.getByRoleId(roleId);
			if (null == role) {
				message = CmdConstants.ROLE + CmdConstants.DOES_NOT_FOUND;
				dmaUtils.logInfoDebugMessage(logger, message);
				httpStatus = HttpStatus.NOT_FOUND;
				return new ResponseEntity<>(new Response(message, httpStatus.value(), message), httpStatus);
			} else {
				message = CmdConstants.ROLE + CmdConstants.FOUND;
				dmaUtils.logInfoDebugMessage(logger, message);
				return new ResponseEntity<>(role, httpStatus);
			}
		} catch (Exception e) {
			message = CmdConstants.ROLE + CmdConstants.DOES_NOT_FOUND;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
			return new ResponseEntity<>(new Response(message, httpStatus.value(), e.getLocalizedMessage()), httpStatus);
		}
	}

	/**
	 * For fetching role by Id
	 * 
	 * @param id
	 * @return Role
	 */
	public Role getRole(int id) {
		return roleRepository.getById(id);
	}

	/**
	 * For getting role permissions by roleId
	 * 
	 * @param roleId
	 * @return rolePermissions
	 */
	public List<RolePermissions> getRolePermissionByRoleId(int roleId) {
		return permissionRepository.findPermissionsByRoleId(roleId);
	}

	/**
	 * For fetching permissions for role id
	 * 
	 * @param roleId
	 * @return List<RolePermissions>
	 */
	public Object getPermissionsByRole(int roleId) {
		this.httpStatus = HttpStatus.OK;
		List<RolePermissions> rolePermissions = new ArrayList<>();
		try {
			rolePermissions = permissionRepository.findPermissionsByRoleId(roleId);
			message = CmdConstants.ROLE_PERMISSIONS_FETCHED_SUCCESSFULLY;
			dmaUtils.logInfoDebugMessage(logger, message);
		} catch (Exception e) {
			message = CmdConstants.MSG_ERROR_GETTING_ALL + CmdConstants.ROLE + " " + CmdConstants.PERMISSION
					+ CmdConstants.S;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;

		}
		return new ResponseEntity<>(rolePermissions, httpStatus);
	}

	/**
	 * For fetching permissions for role id and submoduleId
	 * 
	 * @param roleId
	 * @param subModuleId
	 * @return List<RolePermissions>
	 */
	public Object getPermissionsBySubmodule(int roleId, int subModuleId) {
		List<RolePermissions> rolePermissionsList = new ArrayList<>();
		this.httpStatus = HttpStatus.OK;
		List<SubmodulePermissions> subModulePermissions = new ArrayList<>();
		try {
			rolePermissionsList = permissionRepository.findPermissionsBySubmodule(roleId, subModuleId);
			message = CmdConstants.ROLE_PERMISSIONS_FETCHED_SUCCESSFULLY;
			dmaUtils.logInfoDebugMessage(logger, message);
			subModulePermissions = userServiceHelper.transformSubModulePermissions(rolePermissionsList);
		} catch (Exception e) {
			message = CmdConstants.MSG_ERROR_GETTING_ALL + CmdConstants.ROLE + " " + CmdConstants.PERMISSION
					+ CmdConstants.S;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;

		}
		return new ResponseEntity<>(subModulePermissions, httpStatus);
	}

	/**
	 * For no of submodule with permissions
	 * 
	 * @param roleId
	 * @param subModuleId
	 * @return Integer
	 */
	public int subModulePermissionsCount(int roleId, int subModuleId) {
		return permissionRepository.findCountOfSubModulesPermissions(roleId, subModuleId);
	}

	/**
	 * For role permission exists or not
	 * 
	 * @param rolePermission
	 * @return boolean
	 */
	public boolean rolePermissionExists(RolePermissions rolePermission) {
		int permissionCount = permissionRepository.findPermissioCount(rolePermission.getRoleId(),
				rolePermission.getModuleId(), rolePermission.getSubModuleId(), rolePermission.getTableId());
		return permissionCount > 0;
	}

	/**
	 * For save role Permission
	 * 
	 * @param rolePermission
	 */
	public Object saveRolePermission(RolePermissionsDto rolePermission) {
		RolePermissions rpd = new RolePermissions();
		rpd = dmaUtils.rolePermissionsDtoToEntity(rolePermission, rpd);
		permissionRepository.save(rpd);
		this.httpStatus = HttpStatus.OK;
		try {
			permissionRepository.save(rpd);
			dmaUtils.logInfoDebugMessage(logger, message);
			message = CmdConstants.ROLE + " " + CmdConstants.PERMISSION + CmdConstants.MSG_SAVED_SUCCESSFULLY;
		} catch (Exception e) {
			message = CmdConstants.MSG_ERROR_SAVING + CmdConstants.ROLE + " " + CmdConstants.PERMISSION
					+ CmdConstants.S;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
		}
		response.setMessage(message);
		response.setStatusCode(httpStatus.value());
		return new ResponseEntity<>(response, httpStatus);
	}

	/**
	 * for fetching user roles by user id
	 * 
	 * @param userName
	 * @return UserDetails
	 */
	public UserDetails getUserDetails(String userName) {
		return userServiceHelper.getUserDetails(userName);
	}

	/**
	 * For getting module by module Id
	 * 
	 * @param moduleId
	 * @return DmaModule
	 */
	public CmdModule getModuleByModuleId(int moduleId) {
		return moduleRepository.getModule(moduleId);
	}

	/**
	 * For fetching module by Module Id
	 * 
	 * @param moduleId
	 * @return DmaModule
	 */
	public Object getModuleById(int moduleId) {
		CmdModule module = new CmdModule();
		try {
			module = moduleRepository.getModule(moduleId);
			dmaUtils.logInfoDebugMessage(logger, message);
			message = CmdConstants.MODULE + " " + CmdConstants.FOUND;
			return new ResponseEntity<>(module, httpStatus);
		} catch (Exception e) {
			message = CmdConstants.MODULE + CmdConstants.DOES_NOT_FOUND;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
			response = new Response(message, httpStatus.value(), e.getLocalizedMessage());
			return new ResponseEntity<>(response, httpStatus);
		}
	}

	/**
	 * For getting sub module by submodule Id
	 * 
	 * @param subModuleId
	 * @return Submodule
	 */
	public SubModule getSubModule(int subModuleId) {
		return subModuleRepository.getSubModule(subModuleId);
	}

	/**
	 * For fetching SubModule by Submodule Id
	 * 
	 * @param subModuleId
	 * @return SubModule
	 */
	public Object getSubModuleById(int subModuleId) {
		SubModule subModule = new SubModule();
		try {
			subModule = subModuleRepository.getSubModule(subModuleId);
			dmaUtils.logInfoDebugMessage(logger, message);
			message = CmdConstants.SUB_MODULE + " " + CmdConstants.FOUND;
			return new ResponseEntity<>(subModule, httpStatus);
		} catch (Exception e) {
			message = CmdConstants.SUB_MODULE + CmdConstants.DOES_NOT_FOUND;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
			return new ResponseEntity<>(new Response(message, httpStatus.value(), e.getLocalizedMessage()), httpStatus);
		}
	}

	/**
	 * For module Exists or not
	 * 
	 * @param module
	 * @return boolean
	 */
	public boolean moduleExists(CmdModule module) {
		int moduleCount = moduleRepository.moduleCount(module.getModuleName());
		return moduleCount > 0;
	}

	/**
	 * For save module
	 * 
	 * @param module
	 */
	public void saveModule(CmdModule module) {
		moduleRepository.save(module);
	}

	/**
	 * For subModule exists or not
	 * 
	 * @param subModule
	 * @return boolean
	 */
	public boolean subModuleExists(SubModule subModule) {
		int subModuleCount = subModuleRepository.subModuleCount(subModule.getSubModuleName());
		return subModuleCount > 0;
	}

	/**
	 * For save Sub module
	 * 
	 * @param subModule
	 * @return boolean
	 */
	public boolean saveSubModule(SubModule subModule) {
		return subModuleRepository.save(subModule) != null;
	}

	/**
	 * For fetching all Access Permissions
	 * 
	 * @return List<AccessPermission>
	 */
	public List<AccessPermission> getAccessPermissions() {
		return accessRepository.findAll();
	}

	/**
	 * For fetching AccessPermission by Permission Id
	 * 
	 * @param permissionId
	 * @return AccessPermission
	 */
	public AccessPermission getPermissionById(int permissionId) {
		return accessRepository.getAccessPermissionById(permissionId);
	}

	/**
	 * For fetching PermissionValue by Id
	 * 
	 * @param permissionValueId
	 * @return PermissionValue
	 */
	public PermissionValue getPermissionValueById(int permissionValueId) {
		return permissionValueRepository.getPermissionValueById(permissionValueId);
	}

	/**
	 * For fetching all Tables
	 * 
	 * @return List<DmaTable>
	 */
	public List<CmdTable> getAllTables() {
		return dmaTableRepository.findAll();
	}

	/**
	 * For fetching Table by id
	 * 
	 * @return DmaTable
	 */
	public CmdTable getTableById(int id) {
		return dmaTableRepository.getTableById(id);
	}

	/**
	 * For fetching Submodule Tables
	 * 
	 * @return List<DmaTable>
	 */
	public List<CmdTable> getSubModuleTables(int subModuleId) {
		List<CmdTable> subModuleTables = new ArrayList<>();
		try {
			subModuleTables = dmaTableRepository.getSubModuleTables(subModuleId);

		} catch (Exception e) {
			message = CmdConstants.MSG_ERROR_GETTING_ALL + CmdConstants.SUB_MODULE + " " + CmdConstants.TABLE
					+ CmdConstants.S;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
		}
		return subModuleTables;
	}

	public boolean addDefaultPermissions(int roleId, int maxRpId) {
		boolean idDefautltPermissionsSaved = false;
		List<RolePermissions> roleDefatultRolePermissions = userServiceHelper.constructDefaultpermissios(roleId);
		int counter = maxRpId + 1;
		for (RolePermissions eachRolePermissions : roleDefatultRolePermissions) {
			eachRolePermissions.setId(counter);
			permissionRepository.save(eachRolePermissions);
			counter++;
		}
		idDefautltPermissionsSaved = true;
		return idDefautltPermissionsSaved;
	}

	public UserToken getUserTokenByName(String userName) {
		return userTokenRepository.findUserByUserId(userName);
	}
}
