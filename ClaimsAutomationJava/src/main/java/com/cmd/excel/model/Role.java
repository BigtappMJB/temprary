package com.cmd.excel.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "role")
public class Role {
	@Id
	@Column(name = "ID")
	private int id;
	
	@Column(name = "role_id")
	private int roleId;
	
	@Column(name = "role_name")
	private String roleName;
	
	@Column(name = "active")
	private String isActive;
	
	@Column(name = "delete_flag")
	private int isDeleted;
	
	@Column(name="change_request_name")
	private String changeRequestName;
	
	@Column(name="change_request_id")
	private String changeRequestId;
	
	@Column(name="ip_address")
	private String ipAddress;
	

	public Role() {
		super();
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

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
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

	public void setIsDeleted(int isDeleted) {
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

}
