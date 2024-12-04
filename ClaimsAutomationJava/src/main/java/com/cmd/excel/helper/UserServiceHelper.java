/**
 * 	Date,			Author,		Description
 * 
 * 	2021-15-10,		ISV7915,		UserServiceHelper  class 
 * 									Initial version
 *	2021-1-11,		ISV7915,		Latest optimization logic added
 */

package com.cmd.excel.helper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.cmd.constants.CmdConstants;
import com.cmd.domain.ModuleScreens;
import com.cmd.domain.ModuleSubmodules;
import com.cmd.domain.SubmodulePermissions;
import com.cmd.domain.UserDetails;
import com.cmd.domain.request.User;
import com.cmd.domain.response.Response;
import com.cmd.excel.model.CmdModule;
import com.cmd.excel.model.CmdTable;
import com.cmd.excel.model.Role;
import com.cmd.excel.model.RolePermissions;
import com.cmd.excel.model.SubModule;
import com.cmd.excel.model.UserToken;
import com.cmd.excel.model.Users;
import com.cmd.excel.repository.CmdTableRepository;
import com.cmd.excel.repository.SubModuleRepository;
import com.cmd.excel.repository.UserTokenRepository;
import com.cmd.excel.service.LoginService;
import com.cmd.excel.service.UserManagementService;
import com.cmd.excel.utils.CmdUtils;
import com.cmd.excel.utils.JwtTokenUtil;

/**
 * @author ISV7915
 *
 */
@Component
public class UserServiceHelper {

	@Autowired
	LoginService loginService;

	@Autowired
	UserManagementService umService;

	@Autowired
	UserTokenRepository userTokenRepository;

	@Autowired
	SubModuleRepository subModuleRepository;

	@Autowired
	CmdTableRepository dmaTableRepository;

	@Autowired
	JwtTokenUtil jwtTokenUtil;

	@Autowired
	CmdUtils dmaUtils;
	
	Response response = new Response();
	int roleId = 0;

	/**
	 * For getting user details
	 * 
	 * @param userName
	 * @return UserDetails
	 */
	public UserDetails getUserDetails(String userName) {
		UserDetails userDetails = new UserDetails();
		User userReq = new User();
		userReq.setUserName(userName);
		Users loginUser = loginService.getUserById(userName);
		Role userRole = umService.getRoleByRoleId(loginUser.getRoleId());
		if (userRole.getIsDeleted() == 1) {
			response = new Response(CmdConstants.ROLE + " " +  CmdConstants.NOT_MAPPED + ". " + CmdConstants.CONTACT_ADMINSTRATOR, HttpStatus.NOT_FOUND.value(),
					HttpStatus.NOT_FOUND.getReasonPhrase() );
			userDetails.setResponse(response);
			return userDetails;
		}
		// Check user is active or not
		if (loginUser.getStatus().equals("N")) {
			response = new Response(CmdConstants.INACTIVE_USER, HttpStatus.NOT_ACCEPTABLE.value(),
					HttpStatus.NOT_ACCEPTABLE.getReasonPhrase());
		} else if (loginUser.getStatus().equals("Y")) {
			// Get User details
			userDetails = new UserDetails();

			String userToken = jwtTokenUtil.generateToken(userName);
			// Check alreday user token exists
			if (userTokenRepository.findUserByUserId(userName) != null) {
				// Delete user token
				userTokenRepository.delete(userTokenRepository.findUserByUserId(userName));
			}
			// Insert new user token
			userTokenRepository.save(new UserToken(userName, userToken));
			userDetails.setUserToken(userToken);

			userDetails.setUserId(loginUser.getUserName());
			userDetails.setFirstName(loginUser.getFirstName());
			userDetails.setLastName(loginUser.getLastName());
			userDetails.setIsDefaultPasswordChanged(loginUser.getIsDefaultPasswordChanged());
			userDetails.setEmail(loginUser.getEmail());
			Role role = umService.getRoleByRoleId(loginUser.getRoleId());
			roleId = role.getRoleId();

			userDetails.setRoleId(role.getRoleId());
			userDetails.setUserRole(role.getRoleName());
			userDetails.setRoleStatus(role.getIsActive());
			userDetails.setActive(("Y").equals(loginUser.getStatus()));

			List<RolePermissions> rolePermissions = umService.getRolePermissionByRoleId(loginUser.getRoleId());
			userDetails.setPermissions(getModuleScreenMap(rolePermissions));

			response = new Response(CmdConstants.USER + CmdConstants.FOUND, HttpStatus.OK.value(),
					HttpStatus.OK.getReasonPhrase());

		}
		userDetails.setResponse(response);

		return userDetails;
	}

	/**
	 * For transforming module Screen Map
	 * 
	 * @param rolePermissions
	 * @return List<ModuleSubmodules>
	 */
	public List<ModuleSubmodules> getModuleScreenMap(List<RolePermissions> rolePermissions) {
		List<ModuleScreens> moduleScreensMapList = new ArrayList<>();
		for (RolePermissions eachPermission : rolePermissions) {
			if (eachPermission.getTableId() != 0) {
				ModuleScreens moduleScreens = new ModuleScreens(
						umService.getModuleByModuleId(eachPermission.getModuleId()).getModuleName(),
						eachPermission.getSubModuleId(),
						umService.getSubModule(eachPermission.getSubModuleId()).getSubModuleName(),
						eachPermission.getPermissionId(),
						umService.getPermissionById(eachPermission.getPermissionId()).getPermissionName(),
						umService.getPermissionValueById(eachPermission.getPermissionId()).getPermissionValueName());
				if (!moduleScreensMapList.contains(moduleScreens)) {
					moduleScreensMapList.add(moduleScreens);
				}
			} else {
				ModuleScreens moduleScreens = new ModuleScreens(
						umService.getModuleByModuleId(eachPermission.getModuleId()).getModuleName(),
						eachPermission.getSubModuleId(),
						umService.getSubModule(eachPermission.getSubModuleId()).getSubModuleName(),
						eachPermission.getPermissionId(),
						umService.getPermissionById(eachPermission.getPermissionId()).getPermissionName(),
						umService.getPermissionValueById(eachPermission.getPermissionId()).getPermissionValueName());
				moduleScreensMapList.add(moduleScreens);
			}
		}
		HashMap<String, List<SubmodulePermissions>> moduleSubmoduleMap = constructModuleSubmoduleMap(
				moduleScreensMapList);
		List<ModuleSubmodules> moduleSubModulesList = new ArrayList<>();
		for (Entry<String, List<SubmodulePermissions>> eachKey : moduleSubmoduleMap.entrySet()) {
			ModuleSubmodules moduleSubmodules = new ModuleSubmodules();
			moduleSubmodules.setModuleName(eachKey.getKey());
			moduleSubmodules.setSubmodules(moduleSubmoduleMap.get(eachKey.getKey()));
			if (!moduleSubModulesList.contains(moduleSubmodules)) {
				moduleSubModulesList.add(moduleSubmodules);
			}
		}
		return moduleSubModulesList;
	}

	/**
	 * For constructing module submodule map
	 * 
	 * @param moduleScreensList
	 * @return HashMap<String, List<SubmodulePermissions>>
	 */
	private HashMap<String, List<SubmodulePermissions>> constructModuleSubmoduleMap(
			List<ModuleScreens> moduleScreensList) {
		HashMap<String, List<SubmodulePermissions>> moduleSubmoduleMap = new HashMap<>();
		List<SubmodulePermissions> subModulePermissiosnsList;
		for (ModuleScreens eachModuleScreen : moduleScreensList) {

			if (!moduleSubmoduleMap.containsKey(eachModuleScreen.getModuleName())) {
				SubmodulePermissions submodulePermissions = new SubmodulePermissions();
				submodulePermissions.setSubModuleId(eachModuleScreen.getSubModuleId());
				submodulePermissions.setSubModuleName(eachModuleScreen.getScreenName());
				submodulePermissions.setPermissionId(eachModuleScreen.getPermissionId());
				submodulePermissions.setPermissionName(eachModuleScreen.getPermissionName());
				submodulePermissions.setPrimissionValue(eachModuleScreen.getPermissionValue());
				int smpc = umService.subModulePermissionsCount(roleId, eachModuleScreen.getSubModuleId());
				if (smpc > 0) {
					subModulePermissiosnsList = new ArrayList<>();
					subModulePermissiosnsList.add(submodulePermissions);
					moduleSubmoduleMap.put(eachModuleScreen.getModuleName(), subModulePermissiosnsList);
				}
			} else {
				SubmodulePermissions submodulePermissions = new SubmodulePermissions();
				submodulePermissions.setSubModuleName(eachModuleScreen.getScreenName());
				submodulePermissions.setSubModuleId(eachModuleScreen.getSubModuleId());
				submodulePermissions.setPermissionId(eachModuleScreen.getPermissionId());
				submodulePermissions.setPermissionName(eachModuleScreen.getPermissionName());
				submodulePermissions.setPrimissionValue(eachModuleScreen.getPermissionValue());
				List<SubmodulePermissions> moduleSubmoduleList = moduleSubmoduleMap
						.get(eachModuleScreen.getModuleName());
				int smpc = umService.subModulePermissionsCount(roleId, eachModuleScreen.getSubModuleId());
				if (!dmaUtils.stringExists(moduleSubmoduleList, submodulePermissions.getSubModuleName()) && smpc > 0) {
					moduleSubmoduleList.add(submodulePermissions);
				}
			}
		}
		return moduleSubmoduleMap;
	}

	/**
	 * For adding default role permissions while adding new role
	 * 
	 * @param roleId
	 * @return List<RolePermissions>
	 */
	public List<RolePermissions> constructDefaultpermissios(int roleId) {
		List<RolePermissions> rolePermissionsList = new ArrayList<>();
		List<CmdModule> moduleList = umService.getAllModules();
		List<SubModule> moduleSubModuleList;
		List<CmdTable> subModuleTables;
		RolePermissions rolePermissions;

		int moduleId = 0;
		int subModuleId = 0;
		int tableId = 0;
		for (CmdModule eachModule : moduleList) {
			moduleId = eachModule.getModuleId();
			moduleSubModuleList = umService.getModuleSubModules(moduleId);
			for (SubModule eachSubModule : moduleSubModuleList) {
				subModuleId = eachSubModule.getSubModuleId();
				subModuleTables = umService.getSubModuleTables(subModuleId);
				if (!subModuleTables.isEmpty()) {
					for (CmdTable eachSubModuleTable : subModuleTables) {
						rolePermissions = new RolePermissions();
						rolePermissions.setPermissionId(6);
						rolePermissions.setModuleId(moduleId);
						rolePermissions.setRoleId(roleId);
						rolePermissions.setSubModuleId(subModuleId);
						tableId = eachSubModuleTable.getTableId();
						rolePermissions.setTableId(tableId);
						rolePermissionsList.add(rolePermissions);
					}
				}
			}
		}

		return rolePermissionsList;
	}

	/**
	 * For getting transformed submodule permissions
	 * 
	 * @param rolePermissions
	 * @return List<SubmodulePermissions>
	 */
	public List<SubmodulePermissions> transformSubModulePermissions(List<RolePermissions> rolePermissions) {
		List<SubmodulePermissions> trSubModulePermissions = new ArrayList<>();
		SubmodulePermissions submodulePermission;
		for (RolePermissions eachPermission : rolePermissions) {
			if (umService.getTableById(eachPermission.getTableId()) != null) {
				submodulePermission = new SubmodulePermissions();
				submodulePermission.setSubModuleId(eachPermission.getSubModuleId());
				submodulePermission.setSubModuleName(
						subModuleRepository.getSubModule(eachPermission.getSubModuleId()).getSubModuleName());
				submodulePermission.setTableId(eachPermission.getTableId());

				submodulePermission.setTableName(
						dmaTableRepository.getTableById(eachPermission.getTableId()).getTableName().trim());

				submodulePermission.setPermissionId(eachPermission.getPermissionId());
				submodulePermission.setPermissionName(
						umService.getPermissionById(eachPermission.getPermissionId()).getPermissionName());
				submodulePermission.setPrimissionValue(
						umService.getPermissionValueById(eachPermission.getPermissionId()).getPermissionValueName());
				trSubModulePermissions.add(submodulePermission);
			}
		}

		return trSubModulePermissions;
	}
}
