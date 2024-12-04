package com.cmd.excel.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cmd.constants.CmdConstants;
import com.cmd.domain.TableInfo;
import com.cmd.domain.response.Response;
import com.cmd.excel.repository.CmdTableRepository;
import com.cmd.excel.service.UploadService;
import com.cmd.excel.service.UploadTemplatesService;
import com.cmd.excel.service.UserManagementService;
import com.cmd.excel.utils.CmdUtils;
import com.cmd.excel.utils.JwtTokenUtil;

/**
 * @author ISV7915
 *
 */
@CrossOrigin("*")
@RestController
@RequestMapping(value = "/api", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
public class ViewDataController {
	private static final Logger logger = LoggerFactory.getLogger(ViewDataController.class);

	@Autowired
	UploadService uploadService;

	@Autowired
	UploadTemplatesService uploadTemplatesService;

	@Autowired
	UserManagementService userManagementService;

	@Autowired
	CmdUtils cmdUtils;

	@Autowired
	JwtTokenUtil jwtTokenUtil;

	@Autowired
	CmdTableRepository dmaTableRepository;

	String message = "";
	HttpStatus httpStatus = HttpStatus.OK;

	private Response authResponse = new Response();

	/**
	 * For getting table data for view data screen
	 * 
	 * @param tableInfo
	 * @return List<Map<String, Object>>
	 */
	@PostMapping("/getTableData")
	public Object uploadData(@RequestHeader("token") String token, @RequestBody TableInfo tableInfo) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		List<Map<String, Object>> tableDataReturn = new ArrayList<>();

		if (tableInfo == null) {
			message = CmdConstants.TABLE_INFO_CANNOT_BE_NULL;
			cmdUtils.logInfoDebugMessage(logger, message);
			httpStatus = HttpStatus.BAD_REQUEST;
		} else {
			try {
				viewOrder(tableInfo, tableDataReturn);
				return ResponseEntity.status(HttpStatus.OK).body(tableDataReturn);
			} catch (Exception e) {
				message = CmdConstants.TABLE_DATA + CmdConstants.DOES_NOT_FOUND;
				cmdUtils.logInfoDebugMessage(logger, message);
				httpStatus = HttpStatus.EXPECTATION_FAILED;
			}
		}
		return ResponseEntity.status(httpStatus).body(tableDataReturn);
	}

	/**
	 * @param tableInfo
	 * @param tableDataReturn
	 */
	private void viewOrder(TableInfo tableInfo, List<Map<String, Object>> tableDataReturn) {
		List<Map<String, Object>> tableData = uploadTemplatesService.switchStatement2(tableInfo.getTableName());
		ArrayList<String> currenttableColumnasOrder = dmaTableRepository.getTableOrder(tableInfo.getTableName());
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
		String[] finalTableOrder = finalColumn;
		for (int i = 0; i < tableData.size(); i++) {
			Map<String, Object> mapValueReturn = new LinkedHashMap<>();
			Map<String, Object> mapValue = tableData.get(i);

			for (String valueObject : finalTableOrder) {
				for (Entry<String, Object> entry : mapValue.entrySet()) {
					if (entry.getKey().equals(valueObject)) {
						mapValueReturn.put(valueObject, entry.getValue());
						break;
					}
				}
			}

			tableDataReturn.add(mapValueReturn);
		}
		message = CmdConstants.TABLE_DATA + CmdConstants.FETCHED + CmdConstants.SUCCSSESSFULLY;
		cmdUtils.logInfoDebugMessage(logger, message);
	}

	private void authenticate(String token) {
		authResponse = (Response) jwtTokenUtil.validateUserToken(token);
	}
}
