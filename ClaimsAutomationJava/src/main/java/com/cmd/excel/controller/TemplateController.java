/**
 * 	Date,			Author,		Description
 * 
 * 	2021-27-11,		ISV7915,		TemplateController  class 
 * 									Initial version
 *	2021-18-11,		ISV7915,		Template details api changes added
 */

package com.cmd.excel.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cmd.constants.CmdConstants;
import com.cmd.domain.CmdColumn;
import com.cmd.domain.TableInfo;
import com.cmd.domain.TableTemplateDetailsDto;
import com.cmd.domain.response.Response;
import com.cmd.excel.model.TableTemplateDetails;
import com.cmd.excel.model.TableTemplates;
import com.cmd.excel.service.TemplateService;
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
public class TemplateController {
	private static final Logger logger = LoggerFactory.getLogger(TemplateController.class);
	
	@Autowired
	TemplateService templateService;
	
	@Autowired
	UserManagementService userManagementService;
	
	@Autowired
	CmdUtils cmdUtils;
	
	@Autowired
	JwtTokenUtil jwtTokenUtil;
	
	Response response = new Response();
	String message = "";
	HttpStatus httpStatus = HttpStatus.OK;

	private Response authResponse;

	/**
	 * For getting all columnsased on table Name
	 * 
	 * @param token
	 * @param tableInfo
	 * @return Object
	 */
	@PostMapping("/getTableColumns")
	public Object getTableColumns(@RequestHeader("token") String token, @RequestBody TableInfo tableInfo) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		List<CmdColumn> tableColumnsMain = new ArrayList<>();
		if (tableInfo == null) {
			message = CmdConstants.MSG_BAD_REQUEST;
			cmdUtils.logInfoDebugMessage(logger, message);
			httpStatus = HttpStatus.BAD_REQUEST;
		} else {
			try {
				List<String> tableColumns = templateService.getTableColumns(tableInfo.getTableName());
				tableColumns.forEach(eachRecord -> tableColumnsMain.add(new CmdColumn(eachRecord)));
				message = CmdConstants.TABLE_COLUMNS_FETCHED_SUCCESSFULLY;
				cmdUtils.logInfoDebugMessage(logger, message);
				response.setMessage("Table columns fetched");
				response.setStatusCode(HttpStatus.OK.value());
				return ResponseEntity.status(HttpStatus.OK).body(tableColumnsMain);
			} catch (Exception e) {
				message = "Could not retrive table Columns!";
				cmdUtils.logInfoErrorMessage(logger, message);
				httpStatus = HttpStatus.EXPECTATION_FAILED;
			}
		}
		return ResponseEntity.status(httpStatus).body(tableColumnsMain);
	}

	/**
	 * For getting all Templates
	 * 
	 * @param token
	 * @return List<TableTemplates>
	 */
	@GetMapping("/getAllTemplates")
	public Object getAlltemplaes(@RequestHeader("token") String token) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		List<TableTemplates> allTableTemplates = new ArrayList<>();
		try {
			allTableTemplates = templateService.getAllTableTemplates();
			message = "All templates fetcned successfully";
			cmdUtils.logInfoDebugMessage(logger, message);
			httpStatus = HttpStatus.OK;
		} catch (Exception e) {
			message = "Error while fetching All templates";
			cmdUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
		}
		return new ResponseEntity<>(allTableTemplates, httpStatus);
	}

	/**
	 * For getting template for the table Id
	 * 
	 * @param token
	 * @param tableId
	 * @return TableTemplates
	 */
	@GetMapping("/getTableTemplate")
	public Object getTemplateByTeable(@RequestHeader("token") String token, @RequestParam("tableId") int tableId) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		TableTemplates tableTemplate = new TableTemplates();
		try {
			tableTemplate = templateService.getTemplateByTable(tableId);
			message = CmdConstants.TEMPLATE_RETRIVED_SUCCESSFULLY;
			cmdUtils.logInfoDebugMessage(logger, message);
			httpStatus = HttpStatus.OK;
		} catch (Exception e) {
			message = CmdConstants.ERROR_WHILE_FETCHING_TEMPLATE;
			cmdUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
		}
		return new ResponseEntity<>(tableTemplate, httpStatus);
	}

	/**
	 * For getting template details for table id and template Id
	 * 
	 * @param token
	 * @param tableId
	 * @param templateId
	 * @return List<TableTemplateDetails>
	 */
	@GetMapping("/getTemplateDetails")
	public Object getTemplateDetails(@RequestHeader("token") String token, @RequestParam("tableId") int tableId,
			@RequestParam("templateId") int templateId) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		List<TableTemplateDetails> templateDetails = new ArrayList<>();
		try {
			templateDetails = templateService.getTemplateDetails(tableId, templateId);

			if (templateDetails.isEmpty()) {
				message = CmdConstants.TEMPLATE_DETAILS + " " + CmdConstants.DOES_NOT_FOUND;
				response.setMessage(message);
				response.setStatusCode(httpStatus.value());
				return new ResponseEntity<>(response, httpStatus);
			} else {
				message = CmdConstants.TEMPLATE_DETAILS + " " + CmdConstants.FETCHED + CmdConstants.SUCCSSESSFULLY;
				cmdUtils.logInfoDebugMessage(logger, message);
				httpStatus = HttpStatus.OK;
				return new ResponseEntity<>(templateDetails, httpStatus);
			}

		} catch (Exception e) {
			message = CmdConstants.ERROR + CmdConstants.WHILE + CmdConstants.FETCHING + CmdConstants.TEMPLATE_DETAILS;
			cmdUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
			response.setMessage(message);
			response.setErrorMessage(e.getLocalizedMessage());
			response.setStatusCode(httpStatus.value());
			return new ResponseEntity<>(response, httpStatus);
		}
	}

	/**
	 * Fort saving template details
	 * 
	 * @param token
	 * @param tableTemplateDetails
	 * @return Response
	 */
	@PostMapping("/saveTemplateDetails")
	public Object saveUpdateTemplateDetails(@RequestHeader("token") String token,
			@RequestBody TableTemplateDetailsDto tableTemplateDetails) {
		authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		this.httpStatus = HttpStatus.OK;
		String errorMessage = "";
		try {
			if (tableTemplateDetails.getTableFieldId() == 0) {
				int maxTableFieldId = templateService.getMaxTableFieldId() + 1;
				tableTemplateDetails.setTableFieldId(maxTableFieldId);
			}
			templateService.saveTemplateDetails(tableTemplateDetails);
			message = CmdConstants.TEMPLATE_DETAILS + " " + CmdConstants.MSG_SAVED_SUCCESSFULLY;
			cmdUtils.logInfoDebugMessage(logger, message);
			TableTemplateDetails savedTemplateDetails = templateService.getTableTemplateDetails(
					tableTemplateDetails.getTableFieldName(), tableTemplateDetails.getTableId(),
					tableTemplateDetails.getTemplateId());
			return new ResponseEntity<>(savedTemplateDetails, httpStatus);

		} catch (Exception e) {
			message = CmdConstants.MSG_ERROR_SAVING + CmdConstants.TEMPLATE_DETAILS;
			cmdUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
			errorMessage = e.getLocalizedMessage();
		}
		response.setMessage(message);
		response.setStatusCode(httpStatus.value());
		response.setErrorMessage(errorMessage);
		return new ResponseEntity<>(response, httpStatus);
	}
	
	
//	@GetMapping("/{id}")
//    public Object getTemplateById(@RequestHeader("token") String token,@PathVariable Integer id) {
//        return templateService.getTemplateByTable(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
    @PostMapping("/saveTemplateName")
    public Object createTemplate(@RequestHeader("token") String token,@RequestBody TableTemplates template) {
    	authenticate(token);
		if (authResponse.getStatusCode() != 200) {
			return authResponse;
		}
		this.httpStatus = HttpStatus.OK;
		String errorMessage = "";
    	try {
    		message = CmdConstants.TEMPLATE_DETAILS + " " + CmdConstants.ADDED_SUCCESSFULLY;
			cmdUtils.logInfoDebugMessage(logger, message);
        
        return new ResponseEntity<>(templateService.createTemplate(template), httpStatus);
    	}
    	catch(Exception e) {
    		message = CmdConstants.MSG_ERROR_SAVING + CmdConstants.TEMPLATE_DETAILS;
			cmdUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.EXPECTATION_FAILED;
			errorMessage = e.getLocalizedMessage();
		}
		response.setMessage(message);
		response.setStatusCode(httpStatus.value());
		response.setErrorMessage(errorMessage);
		return new ResponseEntity<>(response, httpStatus);
    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<TableTemplate> updateTemplate(@PathVariable Integer id, @RequestBody TableTemplate templateDetails) {
//        try {
//            TableTemplate updatedTemplate = service.updateTemplate(id, templateDetails);
//            return ResponseEntity.ok(updatedTemplate);
//        } catch (RuntimeException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteTemplate(@PathVariable Integer id) {
//        service.deleteTemplate(id);
//        return ResponseEntity.noContent().build();
//    }
//	
//	
//	
//
	private void authenticate(String token) {
		authResponse = (Response) jwtTokenUtil.validateUserToken(token);
	}
}
