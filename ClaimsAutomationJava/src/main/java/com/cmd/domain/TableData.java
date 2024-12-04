package com.cmd.domain;

import java.util.List;
import java.util.Map;
/**
 * @author ISV7915
 *
 */
public class TableData {
	String[] columnList;
	int tableId;
	String tableName;
	String templateName;
	List<String[]> tableValues;
	List<Map<String, String>> invalidRecords;
	
	public String[] getColumnList() {
		return columnList;
	}

	public void setColumnList(String[] columList) {
		this.columnList = columList;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getTemplateName() {
		return templateName;
	}

	public void setTemplateName(String templateName) {
		this.templateName = templateName;
	}

	public List<String[]> getTableValues() {
		return tableValues;
	}

	public void setTableValues(List<String[]> tableValues) {
		this.tableValues = tableValues;
	}

	public int getTableId() {
		return tableId;
	}

	public void setTableId(int tableId) {
		this.tableId = tableId;
	}

	public List<Map<String, String>> getInvalidRecords() {
		return invalidRecords;
	}

	public void setInvalidRecords(List<Map<String, String>> invalidRecords) {
		this.invalidRecords = invalidRecords;
	}
}