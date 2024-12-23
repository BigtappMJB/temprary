/**
 * 	Date,			Author,		Description
 * 
 * 	2021-11-11,		ISV7915,	UploadService  class 
 * 								Initial version
 *	2021-12-11,		ISV7915,	Upload service changed done
 *	2021-19-11,		ISV7915,	Send invalid records email
 *	2021-19-11,		ISV7915,	Audit log related changes done
 */

package com.cmd.excel.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cmd.constants.CmdConstants;
import com.cmd.domain.TableData;
import com.cmd.domain.UploadDetails;
import com.cmd.domain.response.Response;
import com.cmd.domain.response.UploadResponse;
import com.cmd.excel.model.TableTemplateDetails;
import com.cmd.excel.repository.TableTemplatesRepository;
import com.cmd.excel.repository.templates.EntityTableRepository;
import com.cmd.excel.repository.templates.EntityXreferenceRepository;
import com.cmd.excel.utils.CmdUtils;

/**
 * @author srijaytech5
 *
 */

@Service
public class UploadService {
	private static final Logger logger = LoggerFactory.getLogger(UploadService.class);

	@Autowired
	CmdUtils dmaUtils;

	@Autowired
	AuditLogService auditLogService;

	@Autowired
	TemplateService templateSerice;

	@Autowired
	CmdEmailService dmaEmailService;

	@Autowired
	UploadTemplatesService uploadTemplatesService;

	@Autowired
	TableTemplatesRepository tableTemplatesRepository;

	@Autowired
	EntityTableRepository entityTableRepository;

	@Autowired
	EntityXreferenceRepository entityXreferenceRepository;


	String[] columnList = new String[2];
	Set<String> events = new HashSet<>();
	List<String> primaryKeyColumnList = new ArrayList<>();
	List<String> list = new ArrayList<>();
	List<Map<String, String>> invalidRecords = new ArrayList<>();
	UploadResponse uploadResponse = new UploadResponse();
	Response response = new Response();

	String[] defaultValueList = { "", null, "", null, "", null, "", "", null };
	int insertCount;
	int updateCount;
	int deleteCount;
	String operation;
	String userName;
	String userToken = "";
	String fundManager = "FUND_MANAGER";
	String entity = "ENTITY";

	/**
	 * @param tableData
	 * @return
	 */
	public UploadResponse uploadTableData(TableData tableData, UploadDetails uploadDetails) {
		try {
			userName = uploadDetails.getUserName();
			uploadResponse = uploadTableDataToDb(tableData);
		} catch (Exception e) {
			dmaUtils.logInfoErrorMessage(logger, e.getLocalizedMessage());
		}

		return uploadResponse;
	}

	/**
	 * For uploading tableData to Data
	 * 
	 * @param tableData
	 * @return UploadResponse
	 */
	private UploadResponse uploadTableDataToDb(TableData tableData) {
		columnList = tableData.getColumnList();
		StringBuilder referenceValues = new StringBuilder();
		String tableName = tableData.getTableName().toLowerCase();
		List<String[]> tableValues = tableData.getTableValues();
		List<String> pkColumn = new ArrayList<>();
		List<String> pkColumnValues = new ArrayList<>();
		uploadResponse = new UploadResponse();
		response = new Response();
		invalidRecords = tableData.getInvalidRecords() != null ? tableData.getInvalidRecords() : new ArrayList<>();
		events = new HashSet<>();
		int invalidRecIndex = invalidRecords.size();
		int validRecIndex = 0;
		String date = dmaUtils.getCurrentDateTime();

		if (tableValues.isEmpty()) {
			uploadResponse.setResponse(new Response("Valid rows can not be empty", HttpStatus.BAD_REQUEST.value(),
					"No valid rows to process"));
		}

		for (String[] eachRecordValues : tableValues) {
			try {
				validateEachRecord(tableData, referenceValues, tableName, pkColumn, pkColumnValues, date,
						eachRecordValues);

			} catch (Exception e) {
				list.clear();
				response.setStatusCode(HttpStatus.BAD_REQUEST.value());
				response.setMessage("Record Failed Executed due to " + e.getMessage());
				response.setErrorMessage(e.getMessage());
			}
			updateCount();
			events.add(operation);
			if (response.getErrorMessage() == null) {
				validRecIndex++;
			} else {
				Map<String, String> invalidRecordsMap = new HashMap<>();
				invalidRecIndex++;
				invalidRecordsMap.put(dmaUtils.arrayT0String(eachRecordValues, "||"), response.getErrorMessage());
				invalidRecords.add(invalidRecordsMap);
			}
			referenceValues.append("|");
			uploadResponse.setResponse(response);
			clearResponse(pkColumn, pkColumnValues);
		}
		populateUploadResponce(validRecIndex, invalidRecIndex, insertCount, updateCount, deleteCount);

		writeInvalidRecords(tableData);
		auditLogService.addLog(tableName, userName, events, uploadResponse, userToken, referenceValues.toString());

		clearCount();
		return uploadResponse;
	}

	/**
	 * @param pkColumn
	 * @param pkColumnValues
	 */
	private void clearResponse(List<String> pkColumn, List<String> pkColumnValues) {
		pkColumn.clear();
		pkColumnValues.clear();
		response.setErrorMessage(null);
		response.setMessage(null);
		response.setStatusCode(0);
		list.clear();
		Arrays.fill(defaultValueList, null);
	}

	/**
	 *  
	 */
	private void clearCount() {
		insertCount = 0;
		updateCount = 0;
		deleteCount = 0;
	}

	/**
	 * 
	 */
	private void updateCount() {
		if (response.getStatusCode() == 200) {
			Boolean insert = insertCheck();
			if (Boolean.TRUE.equals(insert)) {
				insertCount++;
			} else if (operation.equals(CmdConstants.QUERY_UPDATE_OPERATION)) {
				updateCount++;
			} else if (operation.equals(CmdConstants.QUERY_DELETE_OPERATION)) {
				deleteCount++;
			}
		}
	}

	/**
	 * @param tableData
	 * @param referenceValues
	 * @param tableName
	 * @param pkColumn
	 * @param pkColumnValues
	 * @param date
	 * @param eachRecordValues
	 */
	private void validateEachRecord(TableData tableData, StringBuilder referenceValues, String tableName,
			List<String> pkColumn, List<String> pkColumnValues, String date, String[] eachRecordValues) {

		validatingAllColumn(tableData, referenceValues, pkColumn, pkColumnValues, eachRecordValues);

		if (response.getStatusCode() == 200 || response.getStatusCode() == 0) {
			setDefaultValues(date, eachRecordValues);
			try {
				uploadTemplatesService.switchStatement(eachRecordValues, tableName, list, defaultValueList);

				response.setStatusCode(200);
				response.setMessage("Record Executed Successfully");
			} catch (Exception e) {
				list.clear();
				response.setStatusCode(HttpStatus.BAD_REQUEST.value());
				response.setMessage("Record Failed Executed due to " + e.getMessage());
				response.setErrorMessage(e.getMessage());
			}
		}
	}

	/**
	 * @param date
	 * @param eachRecordValues
	 */
	private void setDefaultValues(String date, String[] eachRecordValues) {
		if (eachRecordValues[0].equals("NEW")) {
			defaultValueList[0] = userName;
			defaultValueList[1] = date;
			defaultValueList[6] = "N";
			defaultValueList[7] = userName;
			defaultValueList[8] = date;
		}
		if (eachRecordValues[0].equals("UPD")) {
			defaultValueList[0] = userName;
			defaultValueList[1] = date;
			defaultValueList[2] = userName;
			defaultValueList[3] = date;
			defaultValueList[6] = "N";
			defaultValueList[7] = userName;
			defaultValueList[8] = date;
		}
		if (eachRecordValues[0].equals("DEL")) {
			defaultValueList[0] = userName;
			defaultValueList[1] = date;
			defaultValueList[4] = userName;
			defaultValueList[5] = date;
			defaultValueList[6] = "Y";
			defaultValueList[7] = userName;
			defaultValueList[8] = date;
		}
	}

	/**
	 * @return
	 */
	private Boolean insertCheck() {
		return operation.equals(CmdConstants.QUERY_INSERT_OPERATION) || operation.equals(CmdConstants.REUPD);
	}

	/**
	 * @param tableData
	 * @param referenceValues
	 * @param tableName
	 * @param pkColumn
	 * @param pkColumnValues
	 * @param eachRecordValues
	 * @return
	 */
	private Response validatingAllColumn(TableData tableData, StringBuilder referenceValues, List<String> pkColumn,
			List<String> pkColumnValues, String[] eachRecordValues) {
		operation = eachRecordValues[0];
		Boolean checkInsert = operation.equals(CmdConstants.QUERY_INSERT_OPERATION);
		Boolean checkDelete = operation.equals(CmdConstants.QUERY_DELETE_OPERATION);
		List<TableTemplateDetails> templateDetails = templateSerice
				.getTemplateDetailsPrimaryKey(tableData.getTableId());
		int templateColumnCount = columnList.length - 2;
		checkPrimaryColumn(referenceValues, eachRecordValues, templateDetails, pkColumn, pkColumnValues,
				templateColumnCount);

		if (Boolean.TRUE.equals(checkInsert)) {
			logger.debug("Checking Primary key");
		} else if (Boolean.TRUE.equals(checkDelete)) {
			checkDeleteEntity(tableData, eachRecordValues);
		}
		return response;
	}

	/**
	 * @param tableData
	 * @param eachRecordValues
	 * @param querySb
	 */
	private Response checkDeleteEntity(TableData tableData, String[] eachRecordValues) {
		String columnValue = eachRecordValues[1];
		if (tableData.getTableName().equals(fundManager)) {
			try {
				List<String> recordValue = entityTableRepository.getEntityFk(columnValue);

				if (!recordValue.isEmpty()) {
					response.setErrorMessage("(1)Record cannot be deleted as it still exists in ENTITY;");
					response.setMessage("(1)Record cannot be deleted as it still exists in ENTITY;");
					response.setStatusCode(HttpStatus.NOT_ACCEPTABLE.value());
					return response;
				}
			} catch (Exception e) {
				list.clear();
				response.setStatusCode(HttpStatus.BAD_REQUEST.value());
				response.setMessage("Record Failed Executed due to" + e.getMessage());
				response.setErrorMessage(e.getMessage());
			}
		} else if (tableData.getTableName().equals(entity)) {
			try {
				List<String> record1 = entityXreferenceRepository.getEntityXreferenceFk(columnValue);
				
				Boolean statusXreference = !record1.isEmpty();
				

				if (Boolean.TRUE.equals(statusXreference)) {
					response.setErrorMessage(
							"(1)Record cannot be deleted as it still exists in ENTITY_XREFERENCE; (2)Record cannot be deleted as it still exists in  ENTITY_PARENT_CHILD;");
					response.setMessage(
							"(1)Record cannot be deleted as it still exists in ENTITY_XREFERENCE; (2)Record cannot be deleted as it still exists in  ENTITY_PARENT_CHILD;");
					response.setStatusCode(HttpStatus.NOT_ACCEPTABLE.value());
					return response;
				} else if (Boolean.TRUE.equals(statusXreference)) {
					response.setErrorMessage("(1)Record cannot be deleted as it still exists in ENTITY_XREFERENCE;");
					response.setMessage("(1)Record cannot be deleted as it still exists in ENTITY_XREFERENCE;");
					response.setStatusCode(HttpStatus.NOT_ACCEPTABLE.value());
					return response;
				} 
			} catch (Exception e) {
				list.clear();
				response.setStatusCode(HttpStatus.BAD_REQUEST.value());
				response.setMessage("Record Failed Executed due to" + e.getMessage());
			}
		}
		return response;
	}

	/**
	 * @param referenceValues
	 * @param eachRecordValues
	 * @param templateDetails
	 * @param pkColumn
	 * @param pkColumnValues
	 * @param templateColumnCount
	 */
	private void checkPrimaryColumn(StringBuilder referenceValues, String[] eachRecordValues,
			List<TableTemplateDetails> templateDetails, List<String> pkColumn, List<String> pkColumnValues,
			int templateColumnCount) {
		for (int i = 0; i <= templateColumnCount; i++) {
			String checkPk = templateDetails.get(i).getIsPrimaryKey();
			String checkColumnName = templateDetails.get(i).getTableFieldName();
			if (checkPk.equals("Y")) {
				pkColumn.add(checkColumnName);
			}
		}

		for (String t : columnList) {
			Collections.addAll(list, t);
		}
		List<Integer> pkColumnIndex = new ArrayList<>();
		for (String indexLoop : pkColumn) {
			int index = list.indexOf("TPA Claim Number");
			pkColumnIndex.add(index);
		}
		for (int i = 0; i < pkColumnIndex.size(); i++) {
			pkColumnValues.add(eachRecordValues[pkColumnIndex.get(i)]);
			referenceValues.append(eachRecordValues[pkColumnIndex.get(i)] + "|");
		}
	}

	/**
	 * @param validRecIndex
	 * @param invalidRecIndex
	 * @param insertCount
	 * @param updateCount
	 * @param deleteCount
	 */
	private void populateUploadResponce(int validRecIndex, int invalidRecIndex, int insertCount, int updateCount,
			int deleteCount) {
		uploadResponse.setValidUploadCount(validRecIndex);
		uploadResponse.setInvalidCount(invalidRecIndex);
		uploadResponse.setInvalidRecords(invalidRecords);
		uploadResponse.setTotalCount(validRecIndex + invalidRecIndex);
		uploadResponse.setInsertedCount(insertCount);
		uploadResponse.setUpdatedCount(updateCount);
		uploadResponse.setDeletedCount(deleteCount);
	}

	/**
	 * @param tableData
	 */
	private void writeInvalidRecords(TableData tableData) {
		String templateName = templateSerice.getTemplateByTable(tableData.getTableId()).getTemplateName();
		if (!invalidRecords.isEmpty()) {
			dmaEmailService.sendInvaildRecordsEmail(userName, templateName, columnList, invalidRecords);
		}
	}
}
