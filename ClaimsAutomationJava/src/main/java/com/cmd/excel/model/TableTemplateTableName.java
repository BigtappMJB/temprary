package com.cmd.excel.model;

import javax.persistence.Column;

public class TableTemplateTableName {
	
	@Column(name = "template_id")
	private int templateId;
	
	@Column(name = "template_name")
	private String templateName;
	
	@Column(name = "TABLE_ID")
	private int tableId;
	
	@Column(name = "table_name")
	private String tebleName;
	

	public int getTemplateId() {
		return templateId;
	}

	public void setTemplateId(int templateId) {
		this.templateId = templateId;
	}

	public String getTemplateName() {
		return templateName;
	}

	public void setTemplateName(String templateName) {
		this.templateName = templateName;
	}

	public int getTableId() {
		return tableId;
	}

	public void setTableId(int tableId) {
		this.tableId = tableId;
	}

	public String getTebleName() {
		return tebleName;
	}

	public void setTebleName(String tebleName) {
		this.tebleName = tebleName;
	}
	
	

}
