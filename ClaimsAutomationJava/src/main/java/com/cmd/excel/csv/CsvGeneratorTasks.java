/**
 * 	Date,			Author,			Description
 * 
 *	2021-19-10,		ISV7915,		CsvGeneratorTasks class
 *	2021-22-11,		ISV7915			Schedule expression added
 *	2021-27-11,		ISV7915			Views related logic added
 */
package com.cmd.excel.csv;

import java.text.MessageFormat;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;

import com.cmd.constants.CmdConstants;
import com.cmd.excel.service.CsvGenerator;


@Component
@RefreshScope
public class CsvGeneratorTasks {
	private static final Logger logger = LoggerFactory.getLogger(CsvGeneratorTasks.class);
	
	@Value("${csv.files.location}")
	private String csvFilesLocation;
	
	@Autowired
	CsvGenerator csvGenerator;

	/**
	 * @param schedularValue
	 */
	public void csvGenerator(int schedularValue, String schedulerName,String schedulerId) {
		logger.info(CmdConstants.CSV_SCHEDULER_STARTED);
		String filesLocation = MessageFormat.format(csvFilesLocation, new Date());
		csvGenerator.export(filesLocation, schedularValue, schedulerName, schedulerId);
		logger.info(CmdConstants.CSV_SCHEDULAR_ENABLED);
	}
}
