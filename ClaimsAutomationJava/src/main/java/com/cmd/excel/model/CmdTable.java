package com.cmd.excel.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "dma_tables")
public class CmdTable {
	@Id
	@Column(name = "table_id")
	private int tableId;

	@Column(name = "sub_module_id")
	private int subModuleId;

	@Column(name = "table_name")
	private String tableName;

	@Column(name = "deleted_flag")
	private int deletedFlag;

	@Column(name = "schedulernumber")
	private int schedulerNumber;

	@Column(name = "iscsvrequired")
	private int isCsvRequired;

	public CmdTable() {
		super();
	}

	public int getTableId() {
		return tableId;
	}

	public void setTableId(int tableId) {
		this.tableId = tableId;
	}

	public int getSubModuleId() {
		return subModuleId;
	}

	public void setSubModuleId(int subModuleId) {
		this.subModuleId = subModuleId;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public int getDeletedFlag() {
		return deletedFlag;
	}

	public void setDeletedFlag(int deletedFlag) {
		this.deletedFlag = deletedFlag;
	}

	public int getSchedulerNumber() {
		return schedulerNumber;
	}

	public void setSchedulerNumber(int schedulerNumber) {
		this.schedulerNumber = schedulerNumber;
	}

	public int getIsCsvRequired() {
		return isCsvRequired;
	}

	public void setIsCsvRequired(int isCsvRequired) {
		this.isCsvRequired = isCsvRequired;
	}

	@Override
	public String toString() {
		return "DmaTable [tableId=" + tableId + ", subModuleId=" + subModuleId + ", tableName=" + tableName
				+ ", deletedFlag=" + deletedFlag + ", schedulerNumber=" + schedulerNumber + ", isCsvRequired="
				+ isCsvRequired + "]";
	}

}
