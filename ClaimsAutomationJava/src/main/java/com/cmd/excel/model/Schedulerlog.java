package com.cmd.excel.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "schedulerlog")
public class Schedulerlog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "schedular_name")
    private String schedularName;

    @Column(name = "start_date_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date startDateTime;

    @Column(name = "end_date_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date endDateTime;

    @Column(name = "number_of_table")
    private int csvFileCount;
    
    @Column(name = "number_of_csv_files")
    private int numberOfCsvFiles;    

    @Column(name = "number_of_csv_failed")
    private int numberOfCsvFailed;
    
    @Column(name = "job_status")
    private String jobStatus;
    
    
    @Column(name = "error_message")
    private String errorMessage;
    
    @Column(name = "duration")
    private long duration;
    
    

	public long getDuration() {
		return duration;
	}

	public void setDuration(long duration) {
		this.duration = duration;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public Schedulerlog(){
    	
    }
    
    public String getJobStatus() {
		return jobStatus;
	}

	public void setJobStatus(String jobStatus2) {
		this.jobStatus = jobStatus2;
	}

	public Schedulerlog(String schedularName,Date startDateTime,Date endDateTime,int csvFileCount,
    		int numberOfCsvFiles,int numberOfCsvFailed) {
		this.schedularName = schedularName;
		this.startDateTime = startDateTime;
		this.endDateTime = endDateTime;
		this.csvFileCount = csvFileCount;
		this.numberOfCsvFiles = numberOfCsvFiles;
		this.numberOfCsvFailed = numberOfCsvFailed;
	}
    // Getters and Setters

    public int getId() {
        return id;
    }

    public int getNumberOfCsvFiles() {
		return numberOfCsvFiles;
	}

	public void setNumberOfCsvFiles(int numberOfCsvFiles) {
		this.numberOfCsvFiles = numberOfCsvFiles;
	}

	public int getNumberOfCsvFailed() {
		return numberOfCsvFailed;
	}

	public void setNumberOfCsvFailed(int numberOfCsvFailed) {
		this.numberOfCsvFailed = numberOfCsvFailed;
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

    public int getCsvFileCount() {
        return csvFileCount;
    }

    public void setCsvFileCount(int csvFileCount) {
        this.csvFileCount = csvFileCount;
    }
}
