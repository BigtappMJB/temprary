/**
 * 	Date,			Author,		Description
 * 
 * 	2021-25-10,		ISV7915,	UserManagementController  class 
 * 								Initial version
 *	2021-04-11,		ISV7915,	Optimization changes
 *	2021-27-11,		ISV7915,	Code optimization changes and issue resolution
 */
package com.cmd.excel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cmd.domain.RoleDto;
import com.cmd.domain.RolePermissionsDto;
import com.cmd.domain.SchedularDto;
import com.cmd.domain.UserDto;
import com.cmd.domain.response.Response;
import com.cmd.excel.service.UserManagementService;
import com.cmd.excel.utils.JwtTokenUtil;

/**
 * @author ISV7915
 *
 */
@CrossOrigin("*")
@RestController
@RequestMapping(value = "/um", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
public class UserManagementController {

	@Autowired
	UserManagementService userManagementService;

	@Autowired
	JwtTokenUtil jwtTokenUtil;

	private Response authResponse = new Response();

	/**
	 * For getting all common method for all objects
	 * 
	 * @param token
	 * @param operation
	 * @return
	 */
	@GetMapping("/getAll")
	public Object getAllObjects(@RequestHeader("token") String token, @RequestParam("operation") String operation) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.getAll(operation);
	}

	/**
	 * Get Role by Id
	 * 
	 * @param token
	 * @param id
	 * @return
	 */
	@GetMapping("/getUserById")
	public Object getUserById(@RequestHeader("token") String token, @RequestParam("id") int id) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.getUserById(id);
	}

	/**
	 * For manage user
	 * 
	 * @param token
	 * @param userDto
	 * @param operation
	 * @return
	 */
	@PostMapping("/user")
	public Object manageUser(@RequestHeader("token") String token, @RequestBody UserDto userDto,
			@RequestParam("operation") String operation) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.manageUser(operation, userDto);
	}

	/**
	 *  Get Role by Id
	 *  
	 * @param token
	 * @param roleId
	 * @return
	 */
	@GetMapping("/getRoleById")
	public Object getRoleById(@RequestHeader("token") String token, @RequestParam("roleId") int roleId) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.getRoleById(roleId);
	}

	/**
	 * For manage role
	 * 
	 * @param token
	 * @param roleDto
	 * @param operation
	 * @return
	 */
	@PostMapping("/role")
	public Object manageRole(@RequestHeader("token") String token, @RequestBody RoleDto roleDto,
			@RequestParam("operation") String operation) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.manageRole(operation, roleDto);
	}

	/**
	 * For getting RolePermissions
	 * 
	 * @param token
	 * @param roleId
	 * @return
	 */
	@GetMapping("/rolePermissions")
	public Object getPermissionsByRoleId(@RequestHeader("token") String token, @RequestParam("roleId") int roleId) {
		return userManagementService.getPermissionsByRole(roleId);
	}

	/**
	 * For getting subModulePermissions
	 * 
	 * @param token
	 * @param roleId
	 * @return List<RolePermissions>
	 */
	@GetMapping("/subModulePermissions")
	public Object getPermissionsBySubModule(@RequestHeader("token") String token, @RequestParam("roleId") int roleId,
			@RequestParam("subModuleId") int subModuleId) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.getPermissionsBySubmodule(roleId, subModuleId);
	}

	/**
	 * For Saving Role permission
	 * 
	 * @param token
	 * @param rolePermisson
	 * @return Response
	 */
	@PostMapping("/saveRolePermission")
	public Object saveUpdateRolePermission(@RequestHeader("token") String token,
			@RequestBody RolePermissionsDto rolePermissions) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.saveRolePermission(rolePermissions);
	}

	/**
	 * Getting Module By Id`
	 * 
	 * @param token
	 * @param moduleId
	 * @return DmaModule
	 */
	@GetMapping("/getModule")
	public Object getModule(@RequestHeader("token") String token, @RequestParam("moduleId") int moduleId) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.getModuleById(moduleId);
	}

	/**
	 * For getting submodule by Id
	 * 
	 * @param token
	 * @param subModuleId
	 * @return subModuleId
	 */
	@GetMapping("/getSubModule")
	public Object getSubModule(@RequestHeader("token") String token, @RequestParam("subModuleId") int subModuleId) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.getSubModuleById(subModuleId);
	}

	/**
	 * For getting submodule tables
	 * 
	 * @param token
	 * @param suMmoduleId
	 * @return List<DmaTable>
	 */
	@GetMapping("/getSubModuleTables")
	public Object getSubModuleTables(@RequestHeader("token") String token,
			@RequestParam("submoduleId") int suMmoduleId) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.getSubModuleTables(suMmoduleId);
	}

	/**
	 * @param token
	 * @return
	 */
	@GetMapping("/getAllTables")
	public Object getAllTables(@RequestHeader("token") String token) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.getAllTableNames();
	}
	
	/**
	 * @param token
	 * @return
	 */
	@GetMapping("/getAllCsvTables")
	public Object getAllCsvTables(@RequestHeader("token") String token) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.getAllCsvTableNames();
	}

	/**
	 * @param token
	 * @return
	 */
	@GetMapping("/getSchedulerMaster")
	public Object getSchedulerMaster(@RequestHeader("token") String token) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.getSchedularData();
	}

	/**
	 * @param token
	 * @param schedularDto
	 * @return
	 */
	@PostMapping("/updateSchedulerMaster")
	public Object updateSchedulerMaster(@RequestHeader("token") String token, @RequestBody SchedularDto schedularDto) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.updateSchedularData(schedularDto);
	}

	/**
	 * @param token
	 */
	private void authenticate(String token) {
		authResponse = (Response) jwtTokenUtil.validateUserToken(token);
	}

}
