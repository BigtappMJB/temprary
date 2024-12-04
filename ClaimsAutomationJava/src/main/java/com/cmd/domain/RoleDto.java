package com.cmd.domain;

public class RoleDto {
	
	private int id;
	private int roleId;
	private String roleName;
	private String isActive;
	private int isDeleted;
	private String changeRequestName;
	private String changeRequestId;
	private String ipAddress;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getRoleId() {
		return roleId;
	}
	public void setRoleId(int roleId) {
		this.roleId = roleId;
	}
	public String getRoleName() {
		return roleName;
	}
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	public String getIsActive() {
		return isActive;
	}
	public void setIsActive(String isActive) {
		this.isActive = isActive;
	}
	public int getIsDeleted() {
		return isDeleted;
	}
	public void setIsDeleted(int isDeleted) 
	{
		this.isDeleted = isDeleted;
	}
	public String getChangeRequestName() {
		return changeRequestName;
	}
	public void setChangeRequestName(String changeRequestName) {
		this.changeRequestName = changeRequestName;
	}
	public String getChangeRequestId() {
		return changeRequestId;
	}
	public void setChangeRequestId(String changeRequestId) {
		this.changeRequestId = changeRequestId;
	}
	public String getIpAddress() {
		return ipAddress;
	}
	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}
	@Override
	public String toString() {
		return "Role [id=" + id + ", roleId=" + roleId + ", roleName=" + roleName + ", isActive="
				+ isActive + ", isDeleted=" + isDeleted + ", mobileNumber=" + "]";
	
	}
}
