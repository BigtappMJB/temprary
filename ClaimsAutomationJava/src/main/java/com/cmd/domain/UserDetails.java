package com.cmd.domain;

import java.util.List;

import com.cmd.domain.response.Response;

/**
 * @author ISV7915
 *
 */
public class UserDetails {
	private String userId;
	private int roleId;
	private String userRole;
	private String roleStatus;
	private List<ModuleSubmodules> permissions;
	private String userType = "";
	private String firstName;
	private String lastName;
	private boolean isActive;
	private Response response;
	private String userToken;
	private String  isDefaultPasswordChanged;
	private String email;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserRole() {
		return userRole;
	}

	public void setUserRole(String userRole) {
		this.userRole = userRole;
	}

	public List<ModuleSubmodules> getPermissions() {
		return permissions;
	}

	public void setPermissions(List<ModuleSubmodules> permissions) {
		this.permissions = permissions;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public Response getResponse() {
		return response;
	}

	public void setResponse(Response response) {
		this.response = response;
	}

	public boolean isActive() {
		return isActive;
	}

	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}

	public String getUserToken() {
		return userToken;
	}

	public void setUserToken(String userToken) {
		this.userToken = userToken;
	}
	
	public String getRoleStatus() {
		return roleStatus;
	}

	public void setRoleStatus(String roleStatus) {
		this.roleStatus = roleStatus;
	}

	public int getRoleId() {
		return roleId;
	}

	public void setRoleId(int roleId) {
		this.roleId = roleId;
	}

	public String getIsDefaultPasswordChanged() {
		return isDefaultPasswordChanged;
	}

	public void setIsDefaultPasswordChanged(String isDefaultPasswordChanged) {
		this.isDefaultPasswordChanged = isDefaultPasswordChanged;
	}
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	@Override
	public String toString() {
		return "UserDetails [userId=" + userId + ", userRole=" + userRole + ", permissions=" + permissions
				+ ", userType=" + userType + ", firstName=" + firstName + ", lastName=" + lastName + ", activeFlag="
				+ isActive + "]";
	}
}
