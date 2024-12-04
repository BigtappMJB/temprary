package com.cmd.excel.csv;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

public class FirstSchedular implements Job {
	
	@Value("${scheduler1}")
	private int schedularValue1;
		
	@Autowired
	private CsvGeneratorTasks csvGeneratorTasks;
	
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
    	String schedulerId = context.getJobDetail().getJobDataMap().getString("schedulerId");
    	 String schedulerName = context.getJobDetail().getJobDataMap().getString("schedulerName");
    	 
        
        System.out.println("Executing job at " + System.currentTimeMillis());
        csvGeneratorTasks.csvGenerator(schedularValue1,schedulerName,schedulerId);
    }
}
