package com.cmd.excel.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "permission_value")
public class PermissionValue {

	@Id
	@Column(name = "ID")
	private int id;

	@Column(name = "permission_value_id")
	private String permissionValueId;

	@Column(name = "permission_value_name")
	private String permissionValueName;

	public PermissionValue() {
	}

	public PermissionValue(String permissionValueId, String permissionValueName) {
		this.permissionValueId = permissionValueId;
		this.permissionValueName = permissionValueName;
	}

	public String getPermissionValueId() {
		return permissionValueId;
	}

	public void setPermissionValueId(String permissionValueId) {
		this.permissionValueId = permissionValueId;
	}

	public String getPermissionValueName() {
		return permissionValueName;
	}

	public void setPermissionValueName(String permissionValueName) {
		this.permissionValueName = permissionValueName;
	}

}
