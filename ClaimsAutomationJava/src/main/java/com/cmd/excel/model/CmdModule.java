package com.cmd.excel.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "module")
public class CmdModule {
	@Id
	@Column(name = "ID")
	private int id;

	@Column(name = "module_id")
	private int moduleId;
	
	@Column(name = "module_name")
	private String moduleName;

	public CmdModule() {
	}

	public CmdModule(int moduleId, String moduleName) {
		this.moduleId = moduleId;
		this.moduleName = moduleName;
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

	public String getModuleName() {
		return moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	@Override
	public String toString() {
		return "DmaModule [id=" + id + ", moduleName=" + moduleName + "]";
	}

}
