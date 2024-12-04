/**
 * 	Date,		Author,			Description: Initial version
 *	2021-19-10,	ISV7915,		CsvGenerator class
 *	2021-22-11, ISV7915,		Code modified for integrating into dmapp
 */
package com.cmd.excel.service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.cmd.constants.CmdConstants;
import com.cmd.excel.model.CmdTable;
import com.cmd.excel.model.SchedulerDetails;
import com.cmd.excel.model.Schedulerlog;
import com.cmd.excel.repository.CmdTableRepository;
import com.cmd.excel.utils.CmdUtils;

/**
 * @author sumukesh
 *
 */
@Service
public class CsvGenerator {
	private static final Logger logger = LoggerFactory.getLogger(CsvGenerator.class);
	
	@Value("${Scheduler3}")
	private int schedularValue3;

	@Autowired
	CmdTableRepository dmaTableRepository;

	@Autowired
	UploadTemplatesService uploadTemplatesService;

	@Autowired
	AuditLogService auditLogService;

	@Autowired
	SchedulerService schedulerService;

	@Autowired
	SchedulerFileDetailsService schedulerFileDetailsService;
	

	@Autowired
	CmdUtils dmaUtils;

	int numberOfCsvFiles = 0;
	int numberOfTables = 0;
	int numberOfCsvFailed = 0;
	String line = "";
	String lineHead = "";
	int deleteCount = 0;
	private BufferedWriter fileWriter;
	String[] finalTableOrder;

	/**
	 * @param filesLocation
	 * @param viewtable
	 * @param schedularValue
	 */
	public void export(String filesLocation, int schedularValue, String schedulerName,String schedulerId) {
		logger.info("Export Schedular {} csv files", schedularValue);
		generateCsvFiles(filesLocation, schedularValue,schedulerName,schedulerId);
	}

	/**
	 * @param filesLocation
	 * @param viewtable
	 * @param schedularValue
	 */
	public void generateCsvFiles(String filesLocation, int schedularValue,String schedulerName,String schedulerId) {
		List<CmdTable> tableNames = new ArrayList<>();
		long startTimeMillis = System.currentTimeMillis();
	    Date startDateTime = new Date(); //
		try {
			Schedulerlog sl =schedulerService.insertIntoSchedulerLog(schedulerName, startDateTime);

			tableNames = dmaTableRepository.getTableNameForCsv(schedularValue, schedularValue3);

			tableNames.forEach(table -> tableHeaderOrder(filesLocation, table, sl.getId()));

			numberOfCsvFailed = numberOfTables - numberOfCsvFiles;
			String logMessage = "SUMMERY OF CSV FILE : Total number of tables=" + numberOfTables
					+ ", Successfully generated cvc's= " + numberOfCsvFiles + ", Failed csv's= " + numberOfCsvFailed;
			logger.info(logMessage);
			// Log schedular activity
	        Date endDateTime = new Date();
	        Thread.sleep(1000);
	        
	         // Calculate duration in seconds

	        long endTimeMillis = System.currentTimeMillis(); // Capture end time in millis
	        long durationInSeconds = (endTimeMillis - startTimeMillis) / 1000;
	        
	        // Log the duration in seconds
	        logger.info("Duration: " + durationInSeconds + " seconds.");
	        Schedulerlog updateSch = new Schedulerlog();
	        updateSch.setSchedularName(schedulerName);
	        updateSch.setStartDateTime(startDateTime);
	        updateSch.setEndDateTime(endDateTime);
            updateSch.setCsvFileCount(numberOfTables);
            updateSch.setNumberOfCsvFiles(numberOfCsvFiles);
            updateSch.setNumberOfCsvFailed(numberOfCsvFailed);
            updateSch.setJobStatus("success");
            updateSch.setErrorMessage("");
            updateSch.setDuration(durationInSeconds);
	        
	        schedulerService.updateSchedulerLog(sl.getId(), updateSch);
	        setStatusofScheduler(schedulerId, "1");
			numberOfCsvFiles = 0;
			numberOfTables = 0;
			numberOfCsvFailed = 0;
			numberOfTables = 0;
			logMessage = "";
			
			

		} catch (Exception e) {
			Date endDateTime = new Date();
			long endTimeMillis = System.currentTimeMillis(); // Capture end time
	        long durationInSeconds = (endTimeMillis - startTimeMillis) / 1000; // Duration in seconds
	        
	        // Log the duration in seconds
	        logger.info("Duration: " + durationInSeconds + " seconds.");
	        String errorMessage = e.getLocalizedMessage();
	        if (errorMessage.length() > 255) { // Adjust based on your column size
	            errorMessage = errorMessage.substring(0, 255);
	        }
	        
	        logger.info("Duration: " + durationInSeconds + " seconds.");
	        schedulerService.logSchedular(schedulerName, startDateTime, endDateTime,
	                numberOfTables, numberOfCsvFiles, numberOfCsvFailed, "Failure", errorMessage, durationInSeconds);
	        	        setStatusofScheduler(schedulerId, "1");
			dmaUtils.logInfoErrorMessage(logger, e.getLocalizedMessage());
		} finally {
			try {
				logger.info(CmdConstants.DATABSE_CONNECTION_CLOSED);
			} catch (Exception e) {
				dmaUtils.logInfoErrorMessage(logger, e.getLocalizedMessage());
			}
		}
	}
	
	

	void setStatusofScheduler(String schedulerId, String status) {
	    try {
	        // Convert schedulerId from String to Integer
	        int id = Integer.parseInt(schedulerId);

	        // Fetch the scheduler detail using the id
	        Optional<SchedulerDetails> schedulerDetailOptional = schedulerService.getSchedulerById(id);

	        // Check if schedulerDetail is present
	        if (schedulerDetailOptional.isPresent()) {
	            SchedulerDetails schedulerDetail = schedulerDetailOptional.get();
	            
	            // Set the status to "0"
	            schedulerDetail.setStatus(status);

	            // Update the scheduler detail in the service
	            schedulerService.updateSchedulerDetails(id, schedulerDetail);
	        } else {
	            System.out.println("Scheduler with ID " + schedulerId + " not found.");
	        }
	    } catch (NumberFormatException e) {
	        System.out.println("Invalid scheduler ID format: " + schedulerId);
	        e.printStackTrace();
	    } catch (Exception e) {
	        System.out.println("An error occurred while updating the scheduler status: " + e.getMessage());
	        e.printStackTrace();
	    }
	}


	/**
	 * @param filesLocation
	 * @param table
	 */
	private void tableHeaderOrder(String filesLocation, CmdTable table, int scheduler_id) {
		String tableName = table.getTableName().replaceAll("\\r\\n|\\r|\\n", "");
		ArrayList<String> currenttableColumnasOrder = dmaTableRepository.getTableOrder(tableName);
		String[] columnsAsArrayString = new String[currenttableColumnasOrder.size()];
		for (int j = 0; j < currenttableColumnasOrder.size(); j++) {
			columnsAsArrayString[j] = currenttableColumnasOrder.get(j);
		}
		int totalLength = columnsAsArrayString.length;
		String[] finalColumn = new String[totalLength];
		int pos = 0;
		for (String tableColumn2 : columnsAsArrayString) {
			finalColumn[pos] = tableColumn2;
			pos++;
		}
		finalTableOrder = finalColumn;
		if (!tableName.isEmpty()) {
			numberOfCsvFiles = writeTableFile(filesLocation, numberOfCsvFiles, tableName.toLowerCase(), scheduler_id);
			
			truncateTable(tableName);
		}
		numberOfTables++;
	}

	

	/**
	 * @param table
	 */
	private void truncateTable(String table) {
		String tableName = table.toLowerCase();
		if (tableName.equals(CmdConstants.ADHOC_BLOOMBERG_REQUEST)) {
			try {
				dmaTableRepository.truncateAdhocBloombergRequest();
			} catch (Exception e) {
				dmaUtils.logInfoErrorMessage(logger, e.getLocalizedMessage());
			}
		}
	}

	/**
	 * @param filesLocation
	 * @param numberOfCsvFiles
	 * @param table
	 * @return
	 */
	private int writeTableFile(String filesLocation, int numberOfCsvFiles, String table, int scheduler_id) {
		String tableName = table.toUpperCase();
		String csvFileName = getFileName(tableName);
		try {
			List<Map<String, Object>> tableData = uploadTemplatesService.switchStatement2(table);
			File drc = new File(filesLocation);
			drc.mkdir();
			if (drc.exists()) {
				fileWriter = new BufferedWriter(new FileWriter(drc.getAbsolutePath() + "/" + csvFileName));
				writeHeader();
				if (!tableData.isEmpty()) {
					preparCsvFile(numberOfCsvFiles, tableData);
				}
				// insert tableName into table with id of scheduler
				schedulerFileDetailsService.insertTableName(csvFileName, scheduler_id, 1);
				
				fileWriter.close();
				numberOfCsvFiles++;
				logger.info(CmdConstants.CSV_GENERATED_FOR_TABLE, tableName);
			}
		} catch (Exception e) {
			schedulerFileDetailsService.insertTableName(csvFileName, scheduler_id, 0);
			dmaUtils.logInfoErrorMessage(logger, e.getLocalizedMessage());
		}
		return numberOfCsvFiles;
	}

	/**
	 * @param numberOfCsvFiles
	 * @param lst
	 * @return
	 * @throws IOException
	 */
	private int preparCsvFile(int numberOfCsvFiles, List<Map<String, Object>> lst) throws IOException {

		for (int i = 0; i < lst.size(); i++) {
			Map<String, Object> mapValue = lst.get(i);
			validateValues(mapValue);

			fileWriter.newLine();
			fileWriter.write(line);
			line = "";
		}
		fileWriter.close();

		return numberOfCsvFiles;
	}

	/**
	 * @param mapValue
	 */
	private void validateValues(Map<String, Object> mapValue) {
		for (Object valueObject : mapValue.values()) {
			String valueString = "";
			if (valueObject != null) {
				valueString = valueObject.toString().trim().replaceAll(" +", " ");
			}
			if (valueObject instanceof String) {
				valueString = "\"" + escapeDoubleQuotes(valueString) + "\"";
			} else if (valueObject instanceof LocalDateTime) {
				valueString = valueObject.toString().trim().replace("T", " ");
			} else if (valueObject instanceof BigDecimal) {
				Boolean bd = ((BigDecimal) valueObject).signum() == 0;
				if (Boolean.TRUE.equals(bd))
					valueString = "0";
			}
			line = line.concat(valueString);
			line = line.concat(",");
		}
	}

	/**
	 * @param l
	 * @throws IOException
	 */
	private void writeHeader() throws IOException {
		for (String col : finalTableOrder) {
			lineHead = lineHead.concat(col);
			lineHead = lineHead.concat(",");
		}
		fileWriter.write(lineHead);
		lineHead = "";
	}

	/**
	 * @param baseName
	 * @return String
	 */
	private String getFileName(String baseName) {
		DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
		String dateTimeInfo = dateFormat.format(new Date());
		return "DM_" + baseName.concat(String.format("_%s.csv", dateTimeInfo));
	}

	/**
	 * @param value
	 * @return String
	 */
	private String escapeDoubleQuotes(String value) {
		return value.replace("\"", "\"\"");
	}

}
