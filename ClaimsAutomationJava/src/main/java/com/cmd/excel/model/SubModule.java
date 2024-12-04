package com.cmd.excel.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
@Entity
@Table(name = "submodule")
public class SubModule {
	@Id
	@Column(name = "ID")
	private int id;
	
	@Column(name = "module_id")
	private int moduleId;
	
	@Column(name = "sub_module_id")
	private int subModuleId;

	@Column(name = "sub_module_name")
	private String subModuleName;

	public SubModule() {
	}

	public SubModule(int id, String subModuleName) {
		this.id = id;
		this.subModuleName = subModuleName;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
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

	public String getSubModuleName() {
		return subModuleName;
	}

	public void setSubModuleName(String subModuleName) {
		this.subModuleName = subModuleName;
	}

	@Override
	public String toString() {
		return "SubModules [id=" + id + ", subModuleName=" + subModuleName + "]";
	}
}
