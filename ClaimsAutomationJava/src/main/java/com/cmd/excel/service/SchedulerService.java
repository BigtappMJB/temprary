package com.cmd.excel.service;

import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.JobBuilder;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.concurrent.locks.ReentrantLock;

import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import com.cmd.constants.CmdConstants;
import com.cmd.domain.response.IamResponse;
import com.cmd.excel.csv.FirstSchedular;
import com.cmd.excel.model.SchedulerDetails;
import com.cmd.excel.model.Schedulerlog;
import com.cmd.excel.repository.SchedularLogRepository;
import com.cmd.excel.repository.SchedulerDetailsRepository;
import org.springframework.data.domain.Sort;
import com.cmd.excel.utils.CmdUtils;

@Service
public class SchedulerService {
	private static final Logger logger = LoggerFactory.getLogger(SchedulerService.class);
	
	private final ReentrantLock lock = new ReentrantLock();

	@Autowired
	private Scheduler scheduler;
	
	@Autowired
    private SchedularLogRepository schedularLogRepository;
	
	@Autowired
    private SchedulerDetailsRepository schedulerDetailsRepository;
	
	@Autowired
    private CsvGenerator csvGenerator;
	
	@Autowired
	CmdUtils dmaUtils;
	
	private HttpStatus httpStatus;
	
	private int statusCode;
	
	private String status;
	
	private String message;
	
	private IamResponse iamResponse = new IamResponse();


	public void scheduleJob(Map<String, Object> data, Date startDate, Date endDate) throws Exception {
		logger.info("Scheduler "+ data.get("schedulerName").toString() + " started");
		if (lock.tryLock()) {
			try {
				JobDataMap jobDataMap = new JobDataMap();
				 jobDataMap.put("schedulerId", data.get("schedulerId").toString());
	            jobDataMap.put("schedulerName", data.get("schedulerName").toString());
				JobDetail jobDetail = JobBuilder.newJob(FirstSchedular.class)
						.withIdentity(data.get("schedulerName").toString())
						.usingJobData(jobDataMap)
						.build();

				 // Build Trigger with start date and conditional end date
			    TriggerBuilder<CronTrigger> triggerBuilder = TriggerBuilder.newTrigger()
			            .withIdentity(data.get("schedulerName").toString())
			            .withSchedule(CronScheduleBuilder.cronSchedule(data.get("cronExpression").toString()))
			            .startAt(startDate); // Start date is mandatory

			    // Only set end date if provided
			    if (endDate != null) {
			        triggerBuilder.endAt(endDate); // Set end date only if it exists
			    }

			    // Build the trigger
			    Trigger trigger = triggerBuilder.build();

				scheduler.scheduleJob(jobDetail, trigger);
				
				
			}  finally {

				lock.unlock(); // Always unlock in a finally block
			}
		} else {
			throw new IllegalStateException("Job is already running. Try again later.");
		}
	}
	
    public void stopJob(Map<String, Object> data) throws SchedulerException {
    	logger.info("Scheduler "+ data.get("schedulerName").toString() + " stopping");
        // Use the scheduler's ability to delete a job by its identity
        JobKey jobKey = new JobKey(data.get("schedulerName").toString());
        if (scheduler.checkExists(jobKey)) {
            scheduler.deleteJob(jobKey); 
            csvGenerator.setStatusofScheduler(data.get("schedulerId").toString(), "0");
            
        } else {
            throw new SchedulerException("Job with name " + data.get("schedulerName").toString() + " does not exist.");
        }
    }
    
    public void logSchedular(String schedularName, Date startDateTime, Date endDateTime, 
    		int numberOfTables, int numberOfCsvFiles, int numberOfCsvFailed,String jobStatus, String errorMessage,long duration) {
    	Schedulerlog schedularLog = new Schedulerlog();
        schedularLog.setSchedularName(schedularName);
        schedularLog.setStartDateTime(startDateTime);
        schedularLog.setEndDateTime(endDateTime);
        schedularLog.setNumberOfCsvFiles(numberOfTables);
        schedularLog.setCsvFileCount(numberOfCsvFiles);
        schedularLog.setNumberOfCsvFailed(numberOfCsvFailed);
        schedularLog.setJobStatus(jobStatus);
        schedularLog.setErrorMessage(errorMessage);
        schedularLog.setDuration(duration);
        schedularLogRepository.save(schedularLog);
    }
	
    public List<Schedulerlog> getAllSchedulerLogs() {
        return schedularLogRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public Schedulerlog getSchedulerLogById(int id) {
        return schedularLogRepository.findById(id).orElse(null);
    }
    
    
    public List<SchedulerDetails> getAllSchedulers() {
        return schedulerDetailsRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public Optional<SchedulerDetails> getSchedulerById(int id) {
        return schedulerDetailsRepository.findById(id);
    }

    public Object createScheduler(SchedulerDetails schedulerDetails) {
    	logger.info("saving scheduler details");
    	this.httpStatus = HttpStatus.OK;
    	if (schedulerDetailsRepository.save(schedulerDetails) != null) {
    		logger.info("scheduler details saved successfully");
			statusCode = 0;
			status = CmdConstants.SUCCESS;
			message = CmdConstants.SCHEDULAR + CmdConstants.ADDED_SUCCESSFULLY;
			iamResponse = new IamResponse(statusCode, status, message);
			dmaUtils.logInfoDebugMessage(logger, message);
		} else {
			logger.info("error while saving scheduler details");
			statusCode = 1;
			status = CmdConstants.FAILURE;
			message = CmdConstants.SCHEDULAR + CmdConstants.ALREADY_EXISTS;
			httpStatus = HttpStatus.NOT_ACCEPTABLE;
			iamResponse = new IamResponse(statusCode, status, message);
			dmaUtils.logInfoErrorMessage(logger, message);
		}
        return iamResponse;
    }

    public Object updateSchedulerDetails(int id, SchedulerDetails schedulerDetails) {
    	logger.info("updating scheduler details");
    	this.httpStatus = HttpStatus.OK;
        Optional<SchedulerDetails> existingScheduler = schedulerDetailsRepository.findById(id);
        if (existingScheduler.isPresent()) {
            SchedulerDetails updatedScheduler = existingScheduler.get();
            updatedScheduler.setSchedularName(schedulerDetails.getSchedularName());
            updatedScheduler.setStartDateTime(schedulerDetails.getStartDateTime());
            updatedScheduler.setEndDateTime(schedulerDetails.getEndDateTime());
            updatedScheduler.setCronExpression(schedulerDetails.getCronExpression());
            updatedScheduler.setStatus(schedulerDetails.getStatus());
            schedulerDetailsRepository.save(updatedScheduler);
            logger.info("updated scheduler details successfully");
            statusCode = 0;
            status = CmdConstants.SUCCESS;
			message = CmdConstants.SCHEDULAR + CmdConstants.MSG_SAVED_SUCCESSFULLY;;
			iamResponse = new IamResponse(statusCode, status, message);
			dmaUtils.logInfoDebugMessage(logger, message);
	        return iamResponse;
        }else {
        	logger.info("error in updating scheduler details");
        	statusCode = 1;
			status = CmdConstants.FAILURE;
			message = CmdConstants.SCHEDULAR + CmdConstants.ALREADY_DOESNOT_EXISTS;
			iamResponse = new IamResponse(statusCode, status, message);
			dmaUtils.logInfoErrorMessage(logger, message);
	        return iamResponse;
        }
        
        
    }

    public Object deleteScheduler(int id) {
    	logger.info("deleting scheduler details");
        try {
            // Attempt to delete the scheduler by ID
            schedulerDetailsRepository.deleteById(id);
            
            // If delete is successful, set the status and message
            int statusCode = 0;
            String status = CmdConstants.SUCCESS;
            String message = CmdConstants.SCHEDULAR + CmdConstants.MSG_DELETED_SUCCESSFULLY ;

            dmaUtils.logInfoDebugMessage(logger, message);
            return new IamResponse(statusCode, status, message);

        } catch (Exception e) {
        	logger.info("error in deleting scheduler details");
            // In case of any error, return a failure response with an appropriate message
            int statusCode = 1;
            String status = CmdConstants.FAILURE;
            String message = CmdConstants.MSG_ERROR_DELETING + CmdConstants.SCHEDULAR ;
            dmaUtils.logInfoErrorMessage(logger, message);
            return new IamResponse(statusCode, status, message);
        }
    }


	public Schedulerlog insertIntoSchedulerLog(String schedularName, Date startDateTime) {
    	Schedulerlog schedularLog = new Schedulerlog();
        schedularLog.setSchedularName(schedularName);
        schedularLog.setStartDateTime(startDateTime);
       return schedularLogRepository.save(schedularLog);
    }
	
	
	 public Object updateSchedulerLog(int id, Schedulerlog schedulerlog) {
	    	this.httpStatus = HttpStatus.OK;
	        Optional<Schedulerlog> existingScheduler = schedularLogRepository.findById(id);
	        if (existingScheduler.isPresent()) {
	            Schedulerlog updatedScheduler = existingScheduler.get();
	            updatedScheduler.setSchedularName(schedulerlog.getSchedularName());
	            updatedScheduler.setStartDateTime(schedulerlog.getStartDateTime());
	            updatedScheduler.setEndDateTime(schedulerlog.getEndDateTime());
	            updatedScheduler.setCsvFileCount(schedulerlog.getCsvFileCount());
	            updatedScheduler.setNumberOfCsvFiles(schedulerlog.getNumberOfCsvFiles());
	            updatedScheduler.setNumberOfCsvFailed(schedulerlog.getNumberOfCsvFailed());
	            updatedScheduler.setJobStatus(schedulerlog.getJobStatus());
	            updatedScheduler.setErrorMessage("");
	            updatedScheduler.setDuration(schedulerlog.getDuration());
	            schedularLogRepository.save(updatedScheduler);
	            statusCode = 0;
	            status = CmdConstants.SUCCESS;
				message = CmdConstants.SCHEDULAR +" log "+ CmdConstants.MSG_SAVED_SUCCESSFULLY;;
				iamResponse = new IamResponse(statusCode, status, message);
		        return iamResponse;
	        }else {
	        	statusCode = 1;
				status = CmdConstants.FAILURE;
				message = CmdConstants.SCHEDULAR + " log " + CmdConstants.ALREADY_DOESNOT_EXISTS;
				iamResponse = new IamResponse(statusCode, status, message);
		        return iamResponse;
	        }
	        
	        
	    }
	 
	 @Transactional
	 public Object updateStatus(int id,String status) {
		   int rowsUpdated =  schedulerDetailsRepository.udpateStatus(id, status);
		    return rowsUpdated > 0 ? "Status updated successfully" : "No rows updated";
	 }
}
