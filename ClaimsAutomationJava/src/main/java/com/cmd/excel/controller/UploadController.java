/**
 * 	Date,			Author,		Description
 * 
 * 	2021-10-11,		ISV7915,		UploadController  class 
 * 									Initial version
 *	2021-12-11,		ISV7915,		Upload service changed done
 */

package com.cmd.excel.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cmd.constants.CmdConstants;
import com.cmd.domain.TableData;
import com.cmd.domain.UploadDetails;
import com.cmd.domain.response.Response;
import com.cmd.domain.response.UploadResponse;
import com.cmd.excel.service.TemplateService;
import com.cmd.excel.service.UploadService;
import com.cmd.excel.service.UserManagementService;
import com.cmd.excel.utils.CmdUtils;
import com.cmd.excel.utils.JwtTokenUtil;

/**
 * @author ISV7915
 *
 */
@CrossOrigin("*")
@RestController
@RequestMapping("/api/excel")
public class UploadController {
	private static final Logger logger = LoggerFactory.getLogger(UploadController.class);

	@Autowired
	TemplateService templateService;

	@Autowired
	UserManagementService userManagementService;

	@Autowired
	UploadService uploadService;

	@Autowired
	CmdUtils cmdUtils;

	@Autowired
	JwtTokenUtil jwtTokenUtil;

	UploadResponse uploadResponse = new UploadResponse();
	Response authResponse = new Response();

	/**
	 * For uploading excel input table data
	 * 
	 * @param tableData
	 * @return UploadService
	 */
	@PostMapping("/upload")
	public Object uploadData(@RequestHeader("token") String token, @RequestBody TableData tableData) {
		authenticate(token);
		UploadDetails uploadDetails = new UploadDetails();
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		String userName = jwtTokenUtil.getUsernameFromToken(token);
		String message = "";
		HttpStatus httpStatus;
		if (tableData == null) {
			message = CmdConstants.MSG_BAD_REQUEST;
			cmdUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.BAD_REQUEST;
			uploadResponse.setResponse(new Response(message, httpStatus.value(), ""));
		} else {
			try {
				List<String> primaryKeyColumn = templateService.getTablePrimaryKeyColumns(tableData.getTableId());
				uploadDetails.setUserName(userName);
				uploadDetails.setUserToken(token);
				uploadDetails.setPrimaryKeyColumnList(primaryKeyColumn);
				
				uploadResponse = uploadService.uploadTableData(tableData, uploadDetails);
				
				message = CmdConstants.UPLOADED_FILE + CmdConstants.SUCCSSESSFULLY;
				cmdUtils.logInfoDebugMessage(logger, message);
				httpStatus = HttpStatus.OK;
				
				return ResponseEntity.status(httpStatus).body(uploadResponse);
			} catch (Exception e) {
				message = CmdConstants.EXCEPTION_OCCURRED_WHILE_UPLOADING_FILE;
				cmdUtils.logInfoErrorMessage(logger, message);
				httpStatus = HttpStatus.EXPECTATION_FAILED;
				uploadResponse.setResponse(new Response(message, httpStatus.value(), ""));
			}
		}
		return ResponseEntity.status(httpStatus).body(uploadResponse);
	}

	private void authenticate(String token) {
		authResponse = (Response) jwtTokenUtil.validateUserToken(token);
	}
}
