package com.cmd.domain;

public class RolePermissionsDto {
	private long id;
	private int roleId;
	private int moduleId;
	private int subModuleId;
	private int tableId;
	private int permissionId;
	private String changeRequestName;
	private String changeRequestId;
	private String ipAddress;
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public int getRoleId() {
		return roleId;
	}
	public void setRoleId(int roleId) {
		this.roleId = roleId;
	}
	public int getModuleId() {
		return moduleId;
	}
	public void setModuleId(int moduleId) {
		this.moduleId = moduleId;
	}
	public int getSubModuleId() {
		return subModuleId;
	}
	public void setSubModuleId(int subModuleId) {
		this.subModuleId = subModuleId;
	}
	public int getTableId() {
		return tableId;
	}
	public void setTableId(int tableId) {
		this.tableId = tableId;
	}
	public int getPermissionId() {
		return permissionId;
	}
	public void setPermissionId(int permissionId) {
		this.permissionId = permissionId;
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
}
