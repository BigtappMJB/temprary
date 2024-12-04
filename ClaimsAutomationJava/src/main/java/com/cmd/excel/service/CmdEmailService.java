/**
 * 	Date,			Author,		Description
 *	2021-19-11,		ISV7915,	Send invalid records email
 */

package com.cmd.excel.service;

import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.cmd.excel.helper.DmaEmailHelper;
import com.cmd.excel.utils.CmdUtils;

@Service
public class CmdEmailService {
	private static final Logger logger = LoggerFactory.getLogger(CmdEmailService.class);

	@Value("${email.username}")
	private String emailUsername;

	@Value("${email.password}")
	private String emailPassword;

	@Autowired
	DmaEmailHelper emailHelper;

	@Autowired
	CmdUtils dmaUtils;

	/**
	 * For Sending invalid records to email
	 * 
	 * @param userName
	 * @param tableName
	 * @param columnList
	 * @param invalidRecords
	 */
	@Async
	public void sendInvaildRecordsEmail(String userName, String templateName, String[] columnList,
			List<Map<String, String>> invalidRecords) {
		Properties prop = emailHelper.getEmailProperties();
		String successMsg = "";
		Session session = Session.getInstance(prop, new javax.mail.Authenticator() {
			@Override
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(emailUsername, emailPassword);
			}
		});
		try {
			Message message = new MimeMessage(session);
			message = emailHelper.generateEmailContent(userName, templateName, columnList, invalidRecords, message);
			Transport.send(message);
			successMsg = "Successfully sent email";
			logger.info(successMsg);
		} catch (MessagingException e) {
			dmaUtils.logInfoErrorMessage(logger, e.getLocalizedMessage());
		}
	}
}
