package com.cmd.domain;
/**
 * @author ISV7915
 *
 */
public class ModuleScreens {
	private String moduleName;
	private String screenName;
	private int subModuleId;
	private int permissionId;
	private String permissionName;
	private String permissionValue;

	public ModuleScreens(String moduleName, int subModuleId, String screenName, int permissionId, String permissionName, String permissionValue) {	
		this.moduleName = moduleName;
		this.screenName = screenName;
		this.subModuleId = subModuleId;
		this.permissionId = permissionId;
		this.permissionName = permissionName;
		this.permissionValue = permissionValue;
	}

	public String getModuleName() {
		return moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public String getScreenName() {
		return screenName;
	}

	public void setScreenName(String screenName) {
		this.screenName = screenName;
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

	public String getPermissionValue() {
		return permissionValue;
	}

	public void setPermissionValue(String permissionValue) {
		this.permissionValue = permissionValue;
	}

	public int getSubModuleId() {
		return subModuleId;
	}

	public void setSubModuleId(int subModuleId) {
		this.subModuleId = subModuleId;
	}
}
