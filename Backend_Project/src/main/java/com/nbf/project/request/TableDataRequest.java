package com.nbf.project.request;

import java.util.Map;

public class TableDataRequest {

	private String tableName;
	private Map<String, Object> conditions;

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public Map<String, Object> getConditions() {
		return conditions;
	}

	public void setConditions(Map<String, Object> conditions) {
		this.conditions = conditions;
	}

}
