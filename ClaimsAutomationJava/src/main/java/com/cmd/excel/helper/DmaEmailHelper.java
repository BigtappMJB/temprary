/**
 * 	Date,			Author,		Description
 * 
 * 	2021-19-11,		ISV7915,		DmaEmailHelper  class 
 * 									Initial version
 */

package com.cmd.excel.helper;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMultipart;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;

import com.cmd.constants.CmdConstants;
import com.cmd.excel.model.Users;
import com.cmd.excel.service.UserManagementService;
import com.cmd.excel.utils.CmdUtils;
import com.opencsv.CSVWriter;

@Component
@RefreshScope
public class DmaEmailHelper {
	private static final Logger logger = LoggerFactory.getLogger(DmaEmailHelper.class);

	@Value("${email.host}")
	private String emailHost;

	@Value("${email.port}")
	private String emailPort;



	@Value("${email.from}")
	private String emailFrom;

	@Value("${email.text}")
	private String emailText;

	@Value("${file.location}")
	private String fileLocation;

	@Autowired
	CmdUtils dmaUtils;

	@Autowired
	UserManagementService userManagementService;

	/**
	 * Get email properties
	 */
	public Properties getEmailProperties() {
		Properties prop = new Properties();
		prop.setProperty("mail.smtp.host", emailHost);
		 prop.put("mail.smtp.auth", "true");
		prop.put("mail.smtp.port", emailPort);
		prop.put("mail.smtp.starttls.enable", "true"); 
		prop.put("mail.smtp.socketFactory.port", emailPort);
		prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
		prop.put("mail.smtp.ssl.checkserveridentity", true);
		return prop;
	}

	/**
	 * Generation email content
	 * 
	 * @param userName
	 * @param templateName
	 * @param columnList
	 * @param invalidRecords
	 * @param message
	 */
	public Message generateEmailContent(String userName, String templateName, String[] columnList,
			List<Map<String, String>> invalidRecords, Message message) throws MessagingException {
		Users user = userManagementService.getUserById(userName);
		String userEmail = user.getEmail();
		message.setFrom(new InternetAddress(emailFrom));
		message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(userEmail));
		message.setSubject(CmdConstants.INVALID_RECORDS + templateName);

		// Create the message part
		BodyPart messageBodyPart = new MimeBodyPart();

		messageBodyPart.setText("Hi User" + emailText);
		// Now set the actual message

		writeCsvFile(templateName, columnList, invalidRecords);
		// Create a multipar message
		Multipart multipart = new MimeMultipart();

		// Set text message part
		multipart.addBodyPart(messageBodyPart);

		String fileName = getFileName(templateName);
		// Part two is attachment
		javax.activation.DataSource source = new FileDataSource(fileLocation + fileName);
		messageBodyPart = new MimeBodyPart();
		messageBodyPart.setDataHandler(new DataHandler(source));
		messageBodyPart.setFileName(fileName);
		multipart.addBodyPart(messageBodyPart);

		// Send the complete message parts
		message.setContent(multipart);
		return message;
	}

	/**
	 * Write csv file
	 * 
	 * @param templateName
	 * @param columnList
	 * @param invalidRecords
	 */
	public void writeCsvFile(String templateName, String[] columnList, List<Map<String, String>> invalidRecords) {
		File file = new File(fileLocation + getFileName(templateName));
		try {
			FileWriter outputfile = new FileWriter(file);
			CSVWriter writer = new CSVWriter(outputfile);

			List<String> columnsList = new LinkedList<>(Arrays.asList(columnList));
			columnsList.add(CmdConstants.REASON);
			String[] header = columnsList.toArray(new String[columnsList.size()]);

			writer.writeNext(header);
			List<String[]> data = new ArrayList<>();
			invalidRecords.forEach(entry -> entry.entrySet().forEach(entryMap -> {
				String invalidRecord = entryMap.getKey().replace("||", "~").replace("NULL", "") + "~"
						+ entryMap.getValue();
				data.add(invalidRecord.split("~"));
			}));
			writer.writeAll(data);
			writer.close();
			logger.info(CmdConstants.INVALID_REC_CSV_CREATED_SUCCESSFULLY);
		} catch (IOException e) {
			dmaUtils.logInfoErrorMessage(logger, e.getLocalizedMessage());
		}
	}

	/**
	 * Get file name
	 * 
	 * @param templateName
	 */
	private String getFileName(String templateName) {
		DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
		String dateTimeInfo = dateFormat.format(new Date());
		return templateName.concat(String.format("_%s.csv", dateTimeInfo));
	}
}
