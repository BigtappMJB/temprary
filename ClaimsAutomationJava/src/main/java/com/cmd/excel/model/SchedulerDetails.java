package com.cmd.excel.model;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "scheduler_details")
public class SchedulerDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "schedular_name", nullable = false)
    private String schedularName;

    @Column(name = "start_date_time", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date startDateTime;

    @Column(name = "end_date_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date endDateTime;

    @Column(name = "cron_expression", nullable = false)
    private String cronExpression;
    
    @Column(name = "status", nullable = false)
    private String status="0";
    
    @Column(name = "target_table")
    private String targetTable;
    
	@Column(name = "process_logic")
    private String processLogc;

    public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	// Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSchedularName() {
        return schedularName;
    }

    public void setSchedularName(String schedularName) {
        this.schedularName = schedularName;
    }

    public Date getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(Date startDateTime) {
        this.startDateTime = startDateTime;
    }

    public Date getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(Date endDateTime) {
        this.endDateTime = endDateTime;
    }

    public String getCronExpression() {
        return cronExpression;
    }

    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }
    
    public String getTargetTable() {
		return targetTable;
	}

	public void setTargetTable(String targetTable) {
		this.targetTable = targetTable;
	}

	public String getProcessLogc() {
		return processLogc;
	}

	public void setProcessLogc(String processLogc) {
		this.processLogc = processLogc;
	}


}

