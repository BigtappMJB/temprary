/**
 * 	Date,			Author,		Description
 * 
 * 	2021-15-10,		ISV7915,		UserManagementService  class 
 * 									Initial version
 *	2021-1-11,		ISV7915,		Latest optimization logic added
 */

package com.cmd.excel.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cmd.constants.CmdConstants;
import com.cmd.domain.RoleDto;
import com.cmd.domain.RolePermissionsDto;
import com.cmd.domain.SchedularDto;
import com.cmd.domain.SubmodulePermissions;
import com.cmd.domain.UserDetails;
import com.cmd.domain.UserDto;
import com.cmd.domain.request.User;
import com.cmd.domain.response.Response;
import com.cmd.excel.helper.UserServiceHelper;
import com.cmd.excel.model.AccessPermission;
import com.cmd.excel.model.CmdModule;
import com.cmd.excel.model.CmdTable;
import com.cmd.excel.model.PermissionValue;
import com.cmd.excel.model.Role;
import com.cmd.excel.model.RolePermissions;
import com.cmd.excel.model.SchedularMaster;
import com.cmd.excel.model.SubModule;
import com.cmd.excel.model.UserToken;
import com.cmd.excel.model.Users;
import com.cmd.excel.repository.AccessRepository;
import com.cmd.excel.repository.CmdTableRepository;
import com.cmd.excel.repository.ModuleRepository;
import com.cmd.excel.repository.PermissionRepository;
import com.cmd.excel.repository.PermissionValueRepository;
import com.cmd.excel.repository.RoleRepository;
import com.cmd.excel.repository.SchedularMasterRepository;
import com.cmd.excel.repository.SubModuleRepository;
import com.cmd.excel.repository.UserRepository;
import com.cmd.excel.repository.UserTokenRepository;
import com.cmd.excel.utils.CmdUtils;

/**
 * Service for user management module
 * 
 * @author ISV7915
 *
 */
@Service
public class UserManagementService {
	private static final Logger logger = LoggerFactory.getLogger(UserManagementService.class);

	@Autowired
	CmdUtils dmaUtils;

	@Autowired
	UserRepository userRepository;

	@Autowired
	LoginService loginService;

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
	SchedularMasterRepository schedularMasterRepository;

	@Autowired
	UserTokenRepository userTokenRepository;

	private HttpStatus httpStatus;
	private String message;
	private Response response = new Response();

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
				List<Users> allUsers = getAllUsers();
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
	public ResponseEntity<Response> manageUser(String operation, UserDto user) {
		this.httpStatus = HttpStatus.OK;
		Users userReqMain = new Users();
		User userReq = new User();
		userReq.setUserName(user.getUserName());
		userReq.setPassWord(user.getPassword());
		try {
			Users dbUser = loginService.getUserById(user.getUserName());
			if (operation.equals("add")) {
				if (null == dbUser) {
					userReqMain = dmaUtils.userDtoToEntity(user, userReqMain);
					saveUser(userReqMain);
					message = CmdConstants.USER + CmdConstants.ADDED_SUCCESSFULLY;
				} else {
					message = CmdConstants.USER + CmdConstants.ALREADY_EXISTS;
					httpStatus = HttpStatus.NOT_ACCEPTABLE;
				}
			} else if (operation.equals("save")) {
				userReqMain = dmaUtils.userDtoToEntity(user, userReqMain);
				userReqMain.setId(dbUser.getId());
				userReqMain.setStatus(user.getStatus());
				saveUser(userReqMain);
				message = CmdConstants.USER + CmdConstants.MSG_SAVED_SUCCESSFULLY;
			} else if (operation.equals("delete")) {
				dbUser.setDeletFlag(1);
				saveUser(dbUser);
				message = CmdConstants.USER + CmdConstants.MSG_DELETED_SUCCESSFULLY;
			}
			dmaUtils.logInfoDebugMessage(logger, message);
			response = new Response(message, httpStatus.value(), message);
		} catch (Exception e) {
			message = CmdConstants.MSG_ERROR_SAVING + CmdConstants.USER;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
			response = new Response(message, httpStatus.value(), e.getLocalizedMessage());
		}
		return new ResponseEntity<>(response, httpStatus);
	}

	/**
	 * For get user by user Id
	 * 
	 * @param userId
	 * @return Users
	 */
	public Users getUserById(String userId) {
		return userRepository.findUserByUserId(userId);
	}

	/**
	 * For get user by Id
	 * 
	 * @param id
	 * @return Users
	 */
	public Object getUserById(int id) {
		Users user = new Users();
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
	public List<Users> getAllUsers() {
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
	public void saveUser(Users user) {
		userRepository.save(user);
	}

	/**
	 * For saving role
	 * 
	 * @param role
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
	 * @param roleDto
	 * @return Response
	 */
	public Object manageRole(String operation, RoleDto roleDto) {
		try {
			Role dbRole = roleRepository.getByRoleId(roleDto.getRoleId());
			if (operation.equals("add")) {
				if (!roleExists(roleDto.getRoleName())) {
					roleDto.setId(roleRepository.findMaxId() + 1);
					roleDto.setRoleId(roleRepository.findMaxId() + 1);
					roleDto.setIsActive("N");
					Role newRole = new Role();
					newRole = dmaUtils.roleDtoToEntity(roleDto, newRole);
					saveRole(newRole);
					message = CmdConstants.ROLE + CmdConstants.ADDED_SUCCESSFULLY;
					if (addDefaultPermissions(roleDto.getId(), permissionRepository.findMaxId())) {
						logger.info("Default Permission Added");
					} else {
						message = CmdConstants.MSG_ERROR_ADDING + CmdConstants.DEFAULT + " " + CmdConstants.PERMISSION
								+ CmdConstants.S;
					}
				} else {
					message = CmdConstants.ROLE + CmdConstants.ALREADY_EXISTS;
					httpStatus = HttpStatus.CONFLICT;
				}
			} else if (operation.equals("save")) {
				if (dbRole != null) {
					dbRole.setRoleName(roleDto.getRoleName());
					dbRole.setIsActive(roleDto.getIsActive());
					dbRole.setIsDeleted(roleDto.getIsDeleted());
					dbRole.setRoleId(roleDto.getRoleId());
					dbRole.setId(roleDto.getId());
					saveRole(dbRole);
					message = CmdConstants.ROLE + CmdConstants.MSG_SAVED_SUCCESSFULLY;
					httpStatus = HttpStatus.OK;
				}
			} else if (operation.equals("delete") && dbRole != null) {
				dbRole.setIsDeleted(1);
				saveRole(dbRole);
				message = CmdConstants.ROLE + CmdConstants.MSG_DELETED_SUCCESSFULLY;
				httpStatus = HttpStatus.OK;
			}
			dmaUtils.logInfoDebugMessage(logger, message);
			response = new Response(message, httpStatus.value(), message);
		} catch (Exception e) {
			message = CmdConstants.MSG_ERROR_SAVING + CmdConstants.USER;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
			response = new Response(message, httpStatus.value(), e.getLocalizedMessage());
		}
		return new ResponseEntity<>(response, httpStatus);
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
		return permissionRepository.findPermissionsByRoleIdlogin(roleId);
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
	 * @return
	 */
	public Object getAllTableNames() {
		this.httpStatus = HttpStatus.OK;
		List<CmdTable> subModulePermissions = new ArrayList<>();
		try {
			subModulePermissions = dmaTableRepository.getAllTables();
			message = CmdConstants.ROLE_PERMISSIONS_FETCHED_SUCCESSFULLY;
		} catch (Exception e) {
			message = CmdConstants.MSG_ERROR_GETTING_ALL + CmdConstants.ROLE + " " + CmdConstants.PERMISSION
					+ CmdConstants.S;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;

		}
		return new ResponseEntity<>(subModulePermissions, httpStatus);
	}
	
	/**
	 * @return
	 */
	public Object getAllCsvTableNames() {
		this.httpStatus = HttpStatus.OK;
		List<CmdTable> subModulePermissions = new ArrayList<>();
		try {
			subModulePermissions = dmaTableRepository.getAllCsvTables();
			message = CmdConstants.ROLE_PERMISSIONS_FETCHED_SUCCESSFULLY;
		} catch (Exception e) {
			message = CmdConstants.MSG_ERROR_GETTING_ALL + CmdConstants.ROLE + " " + CmdConstants.PERMISSION
					+ CmdConstants.S;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;

		}
		return new ResponseEntity<>(subModulePermissions, httpStatus);
	}

	/**
	 * @return
	 */
	public Object getSchedularData() {
		this.httpStatus = HttpStatus.OK;
		List<SchedularMaster> schedularData = new ArrayList<>();
		try {
			schedularData = schedularMasterRepository.getSchedularMasterData();
			message = CmdConstants.ROLE_PERMISSIONS_FETCHED_SUCCESSFULLY;
		} catch (Exception e) {
			message = CmdConstants.MSG_ERROR_GETTING_ALL + CmdConstants.SCHEDULAR + " " + CmdConstants.PERMISSION
					+ CmdConstants.S;
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
		}
		return new ResponseEntity<>(schedularData, httpStatus);
	}

	/**
	 * @param schedularDto
	 * @return
	 */
	public Object updateSchedularData(SchedularDto schedularDto) {
		this.httpStatus = HttpStatus.OK;
		try {
			CmdTable updateSchedular = dmaTableRepository.getTableById(schedularDto.getTableId());
			updateSchedular.setSchedulerNumber(schedularDto.getSchedulerNumber());
			dmaTableRepository.save(updateSchedular);
			message = String.format(CmdConstants.ADDED_SUCCESSFULLY);
		} catch (Exception e) {
			message = String.format(CmdConstants.UPDATE_SCHEDULER_ERROR, CmdConstants.SCHEDULAR);
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
		}
		response.setMessage(message);
		response.setStatusCode(httpStatus.value());
		return new ResponseEntity<>(response, httpStatus);
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
