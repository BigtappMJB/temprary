package com.nbf.project.Model;

import java.util.List;

public class TableMetadata {

	private String tableName;
	private List<ColumnInfo> columns;
	private boolean includeAuditColumns;

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public List<ColumnInfo> getColumns() {
		return columns;
	}

	public void setColumns(List<ColumnInfo> columns) {
		this.columns = columns;
	}

	public boolean isIncludeAuditColumns() {
		return includeAuditColumns;
	}

	public void setIncludeAuditColumns(boolean includeAuditColumns) {
		this.includeAuditColumns = includeAuditColumns;
	}

}
