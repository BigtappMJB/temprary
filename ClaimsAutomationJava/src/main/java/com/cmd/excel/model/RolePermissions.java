package com.cmd.excel.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "rolepermissions")
public class RolePermissions {
	@Id
	@Column(name = "ID")
	private long id;
	@Column(name = "role_id")
	private int roleId;
	@Column(name = "module_id")
	private int moduleId;
	@Column(name = "subModule_id")
	private int subModuleId;
	@Column(name = "table_id")
	private int tableId;
	@Column(name = "permission_id")
	private int permissionId;
	
	public RolePermissions() {

	}

	public RolePermissions(int roleId, int moduleId, int subModuleId, int tableId, int permissionId) {
		this.roleId = roleId;
		this.moduleId = moduleId;
		this.subModuleId = subModuleId;
		this.tableId = tableId;
		this.permissionId = permissionId;
	}

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

	
	public int getPermissionId() {
		return permissionId;
	}

	public void setPermissionId(int permissionId) {
		this.permissionId = permissionId;
	}

	 
	public int getTableId() {
		return tableId;
	}

	public void setTableId(int tableId) {
		this.tableId = tableId;
	}

	@Override
	public String toString() {
		return "RolePermissions [roleId=" + roleId + ", moduleId=" + moduleId + ", subModuleId=" + subModuleId
				+ ", tableId=" + tableId + ", permissionId=" + permissionId + "]";
	}

}
