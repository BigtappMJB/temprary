package com.cmd.domain;

import java.util.Date;

public class TableTemplateDetailsDto {
	private int tableFieldId;
	private Date lastUpdateDatetime;
	private String latUpdateUser;
	private int templateId;
	private int tableId;
	private String tableFieldName;
	private String templateAttribute;
	private String dataType;
	private int fieldLength;
	private String mandatoryOptional;
	private String defaultValue;
	private String isPrimaryKey;
	private String isFk;
	private int fkTableId;
	private String fkTableFieldName;
	private String errorDesc;
	
	public int getTableFieldId() {
		return tableFieldId;
	}
	public void setTableFieldId(int tableFieldId) {
		this.tableFieldId = tableFieldId;
	}
	public Date getLastUpdateDatetime() {
		return lastUpdateDatetime;
	}
	public void setLastUpdateDatetime(Date lastUpdateDatetime) {
		this.lastUpdateDatetime = lastUpdateDatetime;
	}
	public String getLatUpdateUser() {
		return latUpdateUser;
	}
	public void setLatUpdateUser(String latUpdateUser) {
		this.latUpdateUser = latUpdateUser;
	}
	public int getTemplateId() {
		return templateId;
	}
	public void setTemplateId(int templateId) {
		this.templateId = templateId;
	}
	public int getTableId() {
		return tableId;
	}
	public void setTableId(int tableId) {
		this.tableId = tableId;
	}
	public String getTableFieldName() {
		return tableFieldName;
	}
	public void setTableFieldName(String tableFieldName) {
		this.tableFieldName = tableFieldName;
	}
	public String getTemplateAttribute() {
		return templateAttribute;
	}
	public void setTemplateAttribute(String templateAttribute) {
		this.templateAttribute = templateAttribute;
	}
	public String getDataType() {
		return dataType;
	}
	public void setDataType(String dataType) {
		this.dataType = dataType;
	}
	public int getFieldLength() {
		return fieldLength;
	}
	public void setFieldLength(int fieldLength) {
		this.fieldLength = fieldLength;
	}
	public String getMandatoryOptional() {
		return mandatoryOptional;
	}
	public void setMandatoryOptional(String mandatoryOptional) {
		this.mandatoryOptional = mandatoryOptional;
	}
	public String getDefaultValue() {
		return defaultValue;
	}
	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}
	public String getIsPrimaryKey() {
		return isPrimaryKey;
	}
	public void setIsPrimaryKey(String isPrimaryKey) {
		this.isPrimaryKey = isPrimaryKey;
	}
	public String getIsFk() {
		return isFk;
	}
	public void setIsFk(String isFk) {
		this.isFk = isFk;
	}
	public int getFkTableId() {
		return fkTableId;
	}
	public void setFkTableId(int fkTableId) {
		this.fkTableId = fkTableId;
	}
	public String getFkTableFieldName() {
		return fkTableFieldName;
	}
	public void setFkTableFieldName(String fkTableFieldName) {
		this.fkTableFieldName = fkTableFieldName;
	}
	public String getErrorDesc() {
		return errorDesc;
	}
	public void setErrorDesc(String errorDesc) {
		this.errorDesc = errorDesc;
	}

	
}
