package com.cmd.domain;
/**
 * @author ISV7915
 *
 */
public class RolePermissionModal {
	private int roleId;
	private int moduleId;
	private int subModuleId;
	private int rPermissionID;
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
	public int getrPermissionID() {
		return rPermissionID;
	}
	public void setrPermissionID(int rPermissionID) {
		this.rPermissionID = rPermissionID;
	}
	
}
