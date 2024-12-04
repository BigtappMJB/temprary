package com.cmd.excel.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "table_template_details")
public class TableTemplateDetails {
	@Id
	@Column(name = "TABLE_FIELD_ID")
	private int tableFieldId;

	@Column(name = "LAST_UPDATE_DATE_TIME")
	private Date lastUpdateDatetime;

	@Column(name = "LAST_UPDATE_USER")
	private String latUpdateUser;

	@Column(name = "TEMPLATE_ID")
	private int templateId;

	@Column(name = "TABLE_ID")
	private int tableId;
	
	@Column(name = "TABLE_FIELD_NAME")
	private String tableFieldName;

	@Column(name = "TEMPLATE_ATTRIBUTE")
	private String templateAttribute;

	@Column(name = "DATA_TYPE")
	private String dataType;

	@Column(name = "FIELD_LENGTH")
	private int fieldLength;

	@Column(name = "MANDATORY_OPTIONAL")
	private String mandatoryOptional;

	@Column(name = "DEFAULT_VALUE")
	private String defaultValue;

	@Column(name = "IS_PRIMARYKEY")
	private String isPrimaryKey;

	@Column(name = "IS_FK")
	private String isFk;

	@Column(name = "FK_TABLE_ID")
	private int fkTableId;

	@Column(name = "FK_TABLE_FIELD_NAME")
	private String fkTableFieldName;

	@Column(name = "ERROR_DESC")
	private String errorDesc;

	public TableTemplateDetails() {
		super();
	}

	/**
	 * @return the lastUpdateDatetime
	 */
	public Date getLastUpdateDatetime() {
		return lastUpdateDatetime;
	}

	/**
	 * @param lastUpdateDatetime the lastUpdateDatetime to set
	 */
	public void setLastUpdateDatetime(Date lastUpdateDatetime) {
		this.lastUpdateDatetime = lastUpdateDatetime;
	}

	/**
	 * @return the latUpdateUser
	 */
	public String getLatUpdateUser() {
		return latUpdateUser;
	}

	/**
	 * @param latUpdateUser the latUpdateUser to set
	 */
	public void setLatUpdateUser(String latUpdateUser) {
		this.latUpdateUser = latUpdateUser;
	}

	/**
	 * @return the templateId
	 */
	public int getTemplateId() {
		return templateId;
	}

	/**
	 * @param templateId the templateId to set
	 */
	public void setTemplateId(int templateId) {
		this.templateId = templateId;
	}

	/**
	 * @return the tableId
	 */
	public int getTableId() {
		return tableId;
	}

	/**
	 * @param tableId the tableId to set
	 */
	public void setTableId(int tableId) {
		this.tableId = tableId;
	}

	/**
	 * @return the tableFieldId
	 */
	public int getTableFieldId() {
		return tableFieldId;
	}

	/**
	 * @param tableFieldId the tableFieldId to set
	 */
	public void setTableFieldId(int tableFieldId) {
		this.tableFieldId = tableFieldId;
	}

	/**
	 * @return the tableFieldName
	 */
	public String getTableFieldName() {
		return tableFieldName;
	}

	/**
	 * @param tableFieldName the tableFieldName to set
	 */
	public void setTableFieldName(String tableFieldName) {
		this.tableFieldName = tableFieldName;
	}

	/**
	 * @return the templateAttribute
	 */
	public String getTemplateAttribute() {
		return templateAttribute;
	}

	/**
	 * @param templateAttribute the templateAttribute to set
	 */
	public void setTemplateAttribute(String templateAttribute) {
		this.templateAttribute = templateAttribute;
	}

	/**
	 * @return the dataType
	 */
	public String getDataType() {
		return dataType;
	}

	/**
	 * @param dataType the dataType to set
	 */
	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	/**
	 * @return the fieldLength
	 */
	public int getFieldLength() {
		return fieldLength;
	}

	/**
	 * @param fieldLength the fieldLength to set
	 */
	public void setFieldLength(int fieldLength) {
		this.fieldLength = fieldLength;
	}

	/**
	 * @return the mandatoryOptional
	 */
	public String getMandatoryOptional() {
		return mandatoryOptional;
	}

	/**
	 * @param mandatoryOptional the mandatoryOptional to set
	 */
	public void setMandatoryOptional(String mandatoryOptional) {
		this.mandatoryOptional = mandatoryOptional;
	}

	/**
	 * @return the defaultValue
	 */
	public String getDefaultValue() {
		return defaultValue;
	}

	/**
	 * @param defaultValue the defaultValue to set
	 */
	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}

	/**
	 * @return the isPrimaryKey
	 */
	public String getIsPrimaryKey() {
		return isPrimaryKey;
	}

	/**
	 * @param isPrimaryKey the isPrimaryKey to set
	 */
	public void setIsPrimaryKey(String isPrimaryKey) {
		this.isPrimaryKey = isPrimaryKey;
	}

	/**
	 * @return the isFk
	 */
	public String getIsFk() {
		return isFk;
	}

	/**
	 * @param isFk the isFk to set
	 */
	public void setIsFk(String isFk) {
		this.isFk = isFk;
	}

	/**
	 * @return the fkTableId
	 */
	public int getFkTableId() {
		return fkTableId;
	}

	/**
	 * @param fkTableId the fkTableId to set
	 */
	public void setFkTableId(int fkTableId) {
		this.fkTableId = fkTableId;
	}

	/**
	 * @return the fkTableFieldName
	 */
	public String getFkTableFieldName() {
		return fkTableFieldName;
	}

	/**
	 * @param fkTableFieldName the fkTableFieldName to set
	 */
	public void setFkTableFieldName(String fkTableFieldName) {
		this.fkTableFieldName = fkTableFieldName;
	}

	/**
	 * @return the errorDesc
	 */
	public String getErrorDesc() {
		return errorDesc;
	}

	/**
	 * @param errorDesc the errorDesc to set
	 */
	public void setErrorDesc(String errorDesc) {
		this.errorDesc = errorDesc;
	}

}
