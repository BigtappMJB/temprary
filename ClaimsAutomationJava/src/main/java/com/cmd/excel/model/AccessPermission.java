package com.cmd.excel.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "permission")
public class AccessPermission {

	@Id
	@Column(name = "ID")
	private int id;

	@Column(name = "permission_id")
	private String permissionId;

	@Column(name = "permission_name")
	private String permissionName;

	@Column(name = "permission_value")
	private String permissionValue;
	
	public AccessPermission() {
	}

	public AccessPermission(String permissionId, String permissionName) {
		this.permissionId = permissionId;
		this.permissionName = permissionName;
	}

	public String getPermissionId() {
		return permissionId;
	}

	public void setPermissionId(String permissionId) {
		this.permissionId = permissionId;
	}

	public String getPermissionName() {
		return permissionName;
	}

	public void setPermissionName(String permissionName) {
		this.permissionName = permissionName;
	}

	public String getPermissionValue() {
		return permissionValue;
	}

	public void setPermissionValue(String permissionValue) {
		this.permissionValue = permissionValue;
	}
	
}
