package com.nbf.project.request;

import com.nbf.project.Model.ColumnInfo;

public class UpdateColumnRequest {

	private String tableName;
	private ColumnInfo columnInfo;

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public ColumnInfo getColumnInfo() {
		return columnInfo;
	}

	public void setColumnInfo(ColumnInfo columnInfo) {
		this.columnInfo = columnInfo;
	}

}
