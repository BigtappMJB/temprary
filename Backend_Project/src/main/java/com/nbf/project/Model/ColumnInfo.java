package com.nbf.project.Model;

public class ColumnInfo {

	private String name;
	private String dataType;
	private boolean nullable;
	private int length;
	private String defaultValue;
	private boolean primaryKey;
	private boolean createdBy;
	private boolean createdDate;
	private boolean updatedBy;
	private boolean updatedDate;
	private boolean deletedBy;
	private boolean deletedDate;
	private boolean isActive;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public boolean isNullable() {
		return nullable;
	}

	public void setNullable(boolean nullable) {
		this.nullable = nullable;
	}

	public int getLength() {
		return length;
	}

	public void setLength(int length) {
		this.length = length;
	}

	public String getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}

	public boolean isPrimaryKey() {
		return primaryKey;
	}

	public void setPrimaryKey(boolean primaryKey) {
		this.primaryKey = primaryKey;
	}

	public boolean isCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(boolean createdBy) {
		this.createdBy = createdBy;
	}

	public boolean isCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(boolean createdDate) {
		this.createdDate = createdDate;
	}

	public boolean isUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(boolean updatedBy) {
		this.updatedBy = updatedBy;
	}

	public boolean isUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(boolean updatedDate) {
		this.updatedDate = updatedDate;
	}

	public boolean isDeletedBy() {
		return deletedBy;
	}

	public void setDeletedBy(boolean deletedBy) {
		this.deletedBy = deletedBy;
	}

	public boolean isDeletedDate() {
		return deletedDate;
	}

	public void setDeletedDate(boolean deletedDate) {
		this.deletedDate = deletedDate;
	}

	public boolean isActive() {
		return isActive;
	}

	public void setActive(boolean isActive) {
		this.isActive = isActive;
	}

}
