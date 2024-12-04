package com.cmd.domain;

import java.util.List;
/**
 * @author ISV7915
 *
 */
public class ModuleSubmodules {
	private String moduleName;
	private List<SubmodulePermissions> submodules;

	public String getModuleName() {
		return moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public List<SubmodulePermissions> getSubmodules() {
		return submodules;
	}

	public void setSubmodules(List<SubmodulePermissions> submodules) {
		this.submodules = submodules;
	}

}
