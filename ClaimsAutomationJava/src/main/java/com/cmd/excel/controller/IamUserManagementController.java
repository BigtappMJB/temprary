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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cmd.constants.CmdConstants;
import com.cmd.domain.RoleDto;
import com.cmd.domain.UserDto;
import com.cmd.domain.response.Response;
import com.cmd.excel.service.IamUserManagementService;
import com.cmd.excel.utils.JwtTokenUtil;

/**
 * @author ISV7915
 *
 */
@CrossOrigin("*")
@RestController
@RequestMapping(value = "/rest/V1/Iam", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
public class IamUserManagementController {
	String operation;

	@Autowired
	IamUserManagementService userManagementService;
	
	@Autowired
	JwtTokenUtil jwtTokenUtil;
	
	private Response authResponse = new Response();

	/**
	 * @param token
	 * @param user
	 * @return
	 */
	@PostMapping("/createUser")
	public Object createUser(@RequestHeader("token") String token, @RequestBody UserDto user) {
		this.operation = "add";
		user.setRoleId(CmdConstants.IAM_DEFAULT_ROLEID);
		user.setStatus("N");
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.manageUser(this.operation, user);
	}
	
	/**
	 * @param token
	 * @param user
	 * @return
	 */
	@PostMapping("/deleteUser")
	public Object deleteUser(@RequestHeader("token") String token, @RequestBody UserDto user) {
		this.operation = "delete";
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.manageUser(this.operation, user);
	}

	/**
	 * @param token
	 * @param user
	 * @return
	 */
	@PostMapping("/updateUser")
	public Object updateUser(@RequestHeader("token") String token, @RequestBody UserDto user) {
		this.operation = "save";
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.manageUser(this.operation, user);
	}
	
	/**
	 * @param token
	 * @param user
	 * @return
	 */
	@PostMapping("/enableUser")
	public Object enableUser(@RequestHeader("token") String token, @RequestBody UserDto user) {
		this.operation = "statusChange";
		user.setStatus("Y");
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.manageUser(this.operation, user);
	}
	
	/**
	 * @param token
	 * @param user
	 * @return
	 */
	@PostMapping("/disableUser")
	public Object disableUser(@RequestHeader("token") String token, @RequestBody UserDto user) {
		this.operation = "statusChange";
		user.setStatus("N");
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.manageUser(this.operation, user);
	}
	
	/**
	 * @param token
	 * @param user
	 * @return
	 */
	@PostMapping("/addRoletoUser")
	public Object addRoletoUser(@RequestHeader("token") String token, @RequestBody UserDto user) {
		this.operation = "roleChange";
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.manageUser(this.operation, user);
	}
	/**
	 * @param token
	 * @param user
	 * @return
	 */
	@PostMapping("/removeRoletoUser")
	public Object removeRoletoUser(@RequestHeader("token") String token, @RequestBody UserDto user) {
		this.operation = "roleChange";
		user.setRoleId(5);
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.manageUser(this.operation, user);
	}
	
	/**
	 * @param token
	 * @param role
	 * @return
	 */
	@PostMapping("/addRole")
	public Object addRole(@RequestHeader("token") String token, @RequestBody RoleDto role) {
		this.operation = "add";
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.manageRole(this.operation, role);
	}

	/**
	 * @param token
	 * @param role
	 * @return
	 */
	@PostMapping("/deleteRole")
	public Object deleteRole(@RequestHeader("token") String token, @RequestBody RoleDto role) {
		this.operation = "delete";
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return userManagementService.manageRole(this.operation, role);
	}

	/**
	 * @param token
	 */
	private void authenticate(String token) {
		authResponse = (Response) jwtTokenUtil.validateUserToken(token);
	}
}
