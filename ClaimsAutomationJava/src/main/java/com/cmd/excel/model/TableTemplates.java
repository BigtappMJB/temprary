package com.cmd.excel.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
@Entity
@Table(name = "table_templates")
public class TableTemplates {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "template_id")
	private int templateId;
	
	@Column(name = "table_id")
	private int tableId;
	
	@Column(name = "template_name")
	private String templateName;

	@Column(name = "last_update_date_time")
	private Date lastUpdateDatetime;
	
	@Column(name = "last_update_user")
	private String lastUpdateUser;
	
	@Column(name = "action_id")
	private int actionId;
	
	@Column(name = "delete_flag")
	private int deleteFlag=0;

	public int getActionId() {
		return actionId;
	}

	public void setActionId(int actionId) {
		this.actionId = actionId;
	}

	public TableTemplates() {
		super();
	}

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

	public Date getLastUpdateDatetime() {
		return lastUpdateDatetime;
	}

	public void setLastUpdateDatetime(Date lastUpdateDatetime) {
		this.lastUpdateDatetime = lastUpdateDatetime;
	}

	public String getLastUpdateUser() {
		return lastUpdateUser;
	}

	public void setLastUpdateUser(String lastUpdateUser) {
		this.lastUpdateUser = lastUpdateUser;
	}
	
	public int getTableId() {
		return tableId;
	}

	public void setTableId(int tableId) {
		this.tableId = tableId;
	}
	
}
