package com.cmd.excel.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cmd.constants.CmdConstants;
import com.cmd.domain.response.IamResponse;
import com.cmd.domain.response.Response;
import com.cmd.excel.model.SchedulerDetails;
import com.cmd.excel.model.SchedulerFileDetails;
import com.cmd.excel.model.Schedulerlog;

import com.cmd.excel.service.SchedulerFileDetailsService;
import com.cmd.excel.service.SchedulerService;
import com.cmd.excel.utils.JwtTokenUtil;
import com.cmd.excel.utils.CmdUtils;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/scheduler")
public class SchedulerController {

	private static final Logger logger = LoggerFactory.getLogger(SchedulerController.class);
	
	@Autowired
	private SchedulerService schedulerService;
	
	@Autowired
	private SchedulerFileDetailsService schedulerFileDetailsService;

	@Autowired
	JwtTokenUtil jwtTokenUtil;
	
	private HttpStatus httpStatus;

	private Response authResponse = new Response();
	
	private int statusCode;
	
	private String status;
	
	private String message;
	
	private IamResponse iamResponse = new IamResponse();
	
	String errorMessage;
	
	@Autowired
	CmdUtils dmaUtils;
	
	@PostMapping("/Scheduler")
	public Object scheduleFirstJob(@RequestHeader("token") String token, @RequestBody Map<String, Object> data) {

		this.httpStatus = HttpStatus.OK;
		try {
			authenticate(token);
			if (authResponse.getStatusCode() != 200) {
				return authResponse;
			}
			
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss"); // Adjust format based on input
	        Date startDateTime = dateFormat.parse(data.get("startDateTime").toString());
	        Date endDateTime = dateFormat.parse(data.get("endDateTime").toString());
	        
	        if (data.get("endDateTime") != null) {
	            endDateTime = dateFormat.parse(data.get("endDateTime").toString()); // Parse endDateTime only if it's not null
	        }
			schedulerService.scheduleJob(data,startDateTime,endDateTime);
			
			//updating the status
			schedulerService.updateStatus((int) data.get("schedulerId"), data.get("status").toString());
			
			status = CmdConstants.SUCCESS;
			message ="Job scheduled with cron expression: " + data.get("cronExpression");
			logger.info("Scheduler "+ data.get("schedulerName").toString() + " completed");
			iamResponse = new IamResponse(statusCode, status, message);
			dmaUtils.logInfoDebugMessage(logger, message);
			return iamResponse;
		} catch (Exception e) {
			status = CmdConstants.FAILURE;
			message ="Error scheduling job: " + e.getMessage();
			iamResponse = new IamResponse(statusCode, status, message);
			errorMessage =message;
			logger.info(errorMessage);
			dmaUtils.logInfoErrorMessage(logger, errorMessage);
			return iamResponse;

		}
	}

	// GET API to fetch all scheduler logs
	@GetMapping("/GetAllSchedulerLog")
	public Object getAllSchedulerLogs(@RequestHeader("token") String token) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		logger.info("fetching all scheduler logs details");
		List<Schedulerlog> logs = schedulerService.getAllSchedulerLogs();
		logger.info("fetched all scheduler logs details");
		return ResponseEntity.ok(logs);
	}

	// GET API to fetch a specific scheduler log by ID
	@GetMapping("/GetSchedulerLog/{id}")
	public ResponseEntity<Schedulerlog> getSchedulerLogById(@PathVariable int id) {
		Schedulerlog log = schedulerService.getSchedulerLogById(id);
		if (log != null) {
			return ResponseEntity.ok(log);
		} else {
			return ResponseEntity.notFound().build();
		}
	}
	
	 @DeleteMapping("/stop")
	    public Object stopJob(@RequestHeader("token") String token, 
	    		@RequestParam("schedulerId") int schedulerId, 
	    	    @RequestParam("schedulerName") String schedulerName) {
	        try {
	        	authenticate(token);
				if (authResponse.getStatusCode() != 200) {
					return authResponse;
				}
				Map<String, Object> data = new HashMap<>();
		        data.put("schedulerId", schedulerId);
		        data.put("schedulerName", schedulerName);

	            schedulerService.stopJob(data);
	            
	            status = CmdConstants.SUCCESS;
				message ="Scheduler " + data.get("schedulerName").toString() + " stopped successfully.";
				logger.info("Scheduler "+ data.get("schedulerName").toString() + " stopped");
				dmaUtils.logInfoDebugMessage(logger, message);
				iamResponse = new IamResponse(statusCode, status, message);
				return iamResponse;
	        } catch (Exception e) {
	        	status = CmdConstants.FAILURE;
				message ="Error stopping scheduler: " + e.getMessage();
				iamResponse = new IamResponse(statusCode, status, message);
				errorMessage =message;
				logger.info(errorMessage);
				dmaUtils.logInfoErrorMessage(logger, errorMessage);
				return iamResponse;
	        }
	    }

	
	//Scheduler details API's
	// Get all schedulers
	@GetMapping("/GetAllSchedulerDetails")
	public Object getAllSchedulers(@RequestHeader("token") String token) {
		this.httpStatus = HttpStatus.OK;
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		return new ResponseEntity<>(schedulerService.getAllSchedulers(), httpStatus);
	}

	// Get scheduler by ID
	@GetMapping("/schedulerDetails/{id}")
	public Object getSchedulerById(@PathVariable int id,@RequestHeader("token") String token) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		Optional<SchedulerDetails> scheduler = schedulerService.getSchedulerById(id);
		return scheduler.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	// Create new scheduler
	@PostMapping("/schedulerDetails")
	public Object createScheduler(@RequestHeader("token") String token,@RequestBody SchedulerDetails schedulerDetails) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}

		return schedulerService.createScheduler(schedulerDetails);
	}

	// Update existing scheduler
	@PutMapping("/schedulerDetails/{id}")
	public Object updateScheduler(@RequestHeader("token") String token,@PathVariable int id,
			@RequestBody SchedulerDetails schedulerDetails) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		
		return schedulerService.updateSchedulerDetails(id, schedulerDetails);
		
	}

	// Delete scheduler by ID
	@DeleteMapping("/schedulerDetails/{id}")
	public Object deleteScheduler(@RequestHeader("token") String token,@PathVariable int id) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		;
		return schedulerService.deleteScheduler(id);
	}
		

    @GetMapping("scheduler-file-details/{schedulerId}")
    public ResponseEntity<List<SchedulerFileDetails>> getSchedulerFileDetailById(@RequestHeader("token") String token,
    		@PathVariable int schedulerId) {
    	authenticate(token);
        List<SchedulerFileDetails> detail = schedulerFileDetailsService.findCSVFileNameBySchedulerId(schedulerId);
        return detail != null ? ResponseEntity.ok(detail) : ResponseEntity.notFound().build();
    }

    
	/**
	 * @param token
	 */
	private void authenticate(String token) {
		authResponse = (Response) jwtTokenUtil.validateUserToken(token);
	}
}
