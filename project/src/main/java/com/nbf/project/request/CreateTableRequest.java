package com.nbf.project.request;

import com.nbf.project.Model.TableMetadata;

public class CreateTableRequest {

	private TableMetadata tableMetadata;

	public TableMetadata getTableMetadata() {
		return tableMetadata;
	}

	public void setTableMetadata(TableMetadata tableMetadata) {
		this.tableMetadata = tableMetadata;
	}

}
