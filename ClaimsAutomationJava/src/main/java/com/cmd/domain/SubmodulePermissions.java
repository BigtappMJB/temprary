package com.cmd.domain;
/**
 * @author ISV7915
 *
 */
public class SubmodulePermissions {
	private int subModuleId;
	private String subModuleName;
	private int tableId;
	private String tableName;
	private int permissionId;
	private String permissionName;
	private String primissionValue;

	public SubmodulePermissions() {
	}

	public SubmodulePermissions(int subModuleId, String subModuleName, int tableId, String tableName, int permissionId, String permissionName, String primissionValue) {
		this.subModuleId = subModuleId;
		this.subModuleName = subModuleName;
		this.tableId = tableId;
		this.tableName = tableName;
		this.permissionId = permissionId;
		this.permissionName = permissionName;
		this.primissionValue = primissionValue;
	}

	public String getSubModuleName() {
		return subModuleName;
	}

	public void setSubModuleName(String subModuleName) {
		this.subModuleName = subModuleName;
	}

	public int getPermissionId() {
		return permissionId;
	}

	public void setPermissionId(int permissionId) {
		this.permissionId = permissionId;
	}

	public String getPermissionName() {
		return permissionName;
	}

	public void setPermissionName(String permissionName) {
		this.permissionName = permissionName;
	}

	public String getPrimissionValue() {
		return primissionValue;
	}

	public void setPrimissionValue(String primissionValue) {
		this.primissionValue = primissionValue;
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

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	@Override
	public String toString() {
		return "SubmodulePermissions [subModuleName=" + subModuleName + ", permissionId=" + permissionId
				+ ", permissionName=" + permissionName + ", primissionValue=" + primissionValue + "]";
	}
	
}
