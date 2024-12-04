package com.cmd.excel.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "scheduler_master")
public class SchedularMaster {

	@Id
	@Column(name = "ID")
	private int id;

	@Column(name = "SCHEDULER_ID")
	private int schedulerId;

	@Column(name = "SCHEDULER_TYPE")
	private String schedulerType;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getSchedulerId() {
		return schedulerId;
	}

	public void setSchedulerId(int schedulerId) {
		this.schedulerId = schedulerId;
	}

	public String getSchedulerType() {
		return schedulerType;
	}

	public void setSchedulerType(String schedulerType) {
		this.schedulerType = schedulerType;
	}
}
