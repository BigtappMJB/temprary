package com.nbf.project.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class ScheduledTaskService {

	private static final Logger LOG = LoggerFactory.getLogger(ScheduledTaskService.class);

     @Autowired
	private JdbcTemplate jdbcTemplate;

	
	    @Value("${log.directory}")
	    private String logDirectory;

	    @Value("${log.archive.directory}")
	    private String archiveDirectory;

	    @Value("${scheduling.task.cron.expression}")
	    private String cronExpression;

	    @Scheduled(cron = "${scheduling.task.cron.expression}")
	    public void performTask() {
	        LOG.info("Executing scheduled task to archive logs every hour.");

	        try {
	            // Get current date formatted as DDMMYYYY
	            String currentDateFolder = LocalDateTime.now().format(DateTimeFormatter.ofPattern("ddMMyyyy"));

	            // Create paths
	            Path sourcePath = Paths.get(logDirectory);
	            Path targetPath = Paths.get(archiveDirectory, currentDateFolder);

	            // Create target directory if it doesn't exist
	            if (!Files.exists(targetPath)) {
	                Files.createDirectories(targetPath);
	                LOG.info("Created directory: {}", targetPath);
	            }

	            // Example logic to move or archive logs
	            // Path logFile = Paths.get(logDirectory, "example.log");
	            // Files.move(logFile, targetPath.resolve(logFile.getFileName()));

	        } catch (Exception e) {
	            LOG.error("Error archiving logs: {}", e.getMessage());
	        }
	    }

	    
	 // In DatabaseService.java

	    public List<Map<String, Object>> getData(String tableName, Map<String, Object> conditions) {
	        StringBuilder sql = new StringBuilder("SELECT * FROM " + tableName);
	        if (conditions != null && !conditions.isEmpty()) {
	            sql.append(" WHERE ");
	            conditions.forEach((key, value) -> sql.append(key + " = '" + value + "' AND "));
	            sql.delete(sql.length() - 5, sql.length()); // Remove the last " AND "
	        }
	        return jdbcTemplate.queryForList(sql.toString());
	    }

	    public void addData(String tableName, Map<String, Object> data) {
	        StringBuilder columns = new StringBuilder();
	        StringBuilder values = new StringBuilder();
	        data.forEach((key, value) -> {
	            columns.append(key).append(", ");
	            values.append("'").append(value).append("', ");
	        });
	        columns.setLength(columns.length() - 2); // Remove the trailing comma and space
	        values.setLength(values.length() - 2);    // Remove the trailing comma and space
	        String sql = "INSERT INTO " + tableName + " (" + columns.toString() + ") VALUES (" + values.toString() + ")";
	        jdbcTemplate.execute(sql);
	    }

	    public void updateData(String tableName, Map<String, Object> data, Map<String, Object> conditions) {
	        StringBuilder sql = new StringBuilder("UPDATE " + tableName + " SET ");
	        data.forEach((key, value) -> sql.append(key + " = '" + value + "', "));
	        sql.delete(sql.length() - 2, sql.length()); // Remove the last comma and space
	        sql.append(" WHERE ");
	        conditions.forEach((key, value) -> sql.append(key + " = '" + value + "' AND "));
	        sql.delete(sql.length() - 5, sql.length()); // Remove the last " AND "
	        jdbcTemplate.execute(sql.toString());
	    }

	    public void deleteData(String tableName, Map<String, Object> conditions) {
	        StringBuilder sql = new StringBuilder("DELETE FROM " + tableName + " WHERE ");
	        conditions.forEach((key, value) -> sql.append(key + " = '" + value + "' AND "));
	        sql.delete(sql.length() - 5, sql.length()); // Remove the last " AND "
	        jdbcTemplate.execute(sql.toString());
	    }

}
