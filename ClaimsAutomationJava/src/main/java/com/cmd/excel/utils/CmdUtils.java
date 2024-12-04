/**
 * 	Date,			Author,		Description
 * 
 * 	2021-4-10,		ISV7915,		DmaUtils  class 
 * 									Initial version
 *	2021-1-11,		ISV7915,		Latest optimization logic added
 */

package com.cmd.excel.utils;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.cmd.constants.CmdConstants;
import com.cmd.domain.RoleDto;
import com.cmd.domain.RolePermissionsDto;
import com.cmd.domain.SubmodulePermissions;
import com.cmd.domain.TableTemplateDetailsDto;
import com.cmd.domain.UserDto;
import com.cmd.domain.response.Response;
import com.cmd.excel.helper.UserServiceHelper;
import com.cmd.excel.model.IamUsers;
import com.cmd.excel.model.Role;
import com.cmd.excel.model.RolePermissions;
import com.cmd.excel.model.TableTemplateDetails;
import com.cmd.excel.model.Users;
import com.cmd.excel.repository.PermissionRepository;
import com.github.f4b6a3.uuid.UuidCreator;
import com.github.f4b6a3.uuid.util.UuidValidator;

/**
 * @author sumukesh
 *
 */
@Component
public class CmdUtils {

	Response response = new Response();
	
	@Autowired
	PermissionRepository permissionRepository;

	@Autowired
	UserServiceHelper userServiceHelper;

	/**
	 * For generating random GUUID
	 * 
	 * @return
	 */
	public String generateRandomGuuid() {
		UUID uuid = UUID.randomUUID();
		return uuid.toString();
	}

	/**
	 * For generating GUUID from user name
	 * 
	 * @param userName
	 * @return String
	 */
	public String generateGuuid(String userName) {

		// Create a name based UUID (SHA1)
		UUID uuid = UuidCreator.getNameBasedSha1(userName);

		return uuid.toString();
	}

	/**
	 * For validating GUUID
	 * 
	 * @param guuid
	 * @return boolean
	 */
	public boolean validateGuuid(String guuid) {
		return UuidValidator.isValid(guuid);
	}

	/**
	 * For checking token
	 * 
	 * @param token
	 * @return Response
	 */
	public ResponseEntity<Response> validteToken(String token) {
		String message = "";

		HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
		if (null == token || "".equals(token)) {
			message = CmdConstants.MSG_BAD_REQUEST;
			response = new Response(message, httpStatus.value(), message);

		} else {
			if (!validateGuuid(token)) {
				message = CmdConstants.INVALID_TOKEN;
				httpStatus = HttpStatus.UNAUTHORIZED;
				response = new Response(message, httpStatus.value(), message);
			} else {
				message = CmdConstants.VALID_TOKEN;
				httpStatus = HttpStatus.OK;
				response = new Response(message, httpStatus.value(), message);
			}
		}
		return new ResponseEntity<>(response, httpStatus);

	}

	/**
	 * For checking token
	 * 
	 * @param token
	 * @return boolean
	 */
	public boolean checkToken(String token) {
		boolean isTokenValid = false;
		response = validteToken(token).getBody();
		if (response != null && response.getStatusCode() == 200)
			isTokenValid = true;
		return isTokenValid;
	}

	/**
	 * For de-crypting any encrypted string
	 * 
	 * @param strToDecode
	 * @return String
	 */
	public String deCrypt(String strToDecode) {
		byte[] decodedBytes = Base64.getDecoder().decode(strToDecode);
		return new String(decodedBytes);
	}

	/**
	 * For string exists
	 * 
	 * @param moduleSubmoduleList
	 * @param subModuleName
	 * @return boolean
	 */
	public boolean stringExists(List<SubmodulePermissions> moduleSubmoduleList, String subModuleName) {
		boolean isSubmoduleExists = false;
		for (SubmodulePermissions eachSmp : moduleSubmoduleList) {
			if (eachSmp.getSubModuleName().equals(subModuleName)) {
				isSubmoduleExists = true;
				return isSubmoduleExists;
			}
		}

		return isSubmoduleExists;
	}

	/**
	 * For logging info and Debug messages
	 * 
	 * @param logger
	 * @param message
	 */
	public void logInfoDebugMessage(Logger logger, String message) {
		logger.info(message);
		logger.debug(message);
	}

	/**
	 * For logging info and Error messages
	 * 
	 * @param logger
	 * @param message
	 */
	public void logInfoErrorMessage(Logger logger, String message) {
		logger.info(message);
		logger.error(message);
	}

	/**
	 * To convert the ResultSet to a List of Maps, where each Map represents a row
	 * with columnNames and columValues
	 * 
	 * @param rs
	 * @return
	 * @throws SQLException
	 */
	public List<Map<String, Object>> resultSetToList(ResultSet rs) throws SQLException {
		ResultSetMetaData md = rs.getMetaData();
		int columns = md.getColumnCount();
		List<Map<String, Object>> rows = new ArrayList<>();
		while (rs.next()) {
			Map<String, Object> row = new LinkedHashMap<>(columns);
			for (int i = 1; i <= columns; ++i) {
				row.put(md.getColumnName(i), rs.getObject(i));
			}
			rows.add(row);
		}
		return rows;
	}

	/**
	 * For getting current date time
	 * 
	 * @return String
	 */
	public String getCurrentDateTime() {
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		LocalDateTime now = LocalDateTime.now();
		return dtf.format(now);
	}

	/**
	 * To Convert array to string
	 * 
	 * @param array
	 * @param delimiter
	 * @return String
	 */
	public String arrayT0String(String[] array, String delimiter) {
		String result = "";
		if (array.length > 0) {
			StringBuilder sb = new StringBuilder();
			for (String s : array) {
				sb.append(s).append(delimiter);
			}
			result = sb.deleteCharAt(sb.length() - 2).toString();
		}
		return result.substring(0, result.length() - 1);
	}

	/**
	 * @param userDto
	 * @param userReq
	 * @return IamUsers
	 */
	public IamUsers converDtoToEntity(UserDto userDto, IamUsers userReq) {
		userReq.setUserName(userDto.getUserName());
		userReq.setPassword(userDto.getPassword());
		userReq.setEmail(userDto.getEmail());
		userReq.setFirstName(userDto.getFirstName());
		userReq.setLastName(userDto.getLastName());
		userReq.setMobileNumber(userDto.getMobileNumber());
		userReq.setRoleId(userDto.getRoleId());
		userReq.setRemark(userDto.getRemark());
		userReq.setChangeRequestId(userDto.getChangeRequestId());
		userReq.setChangeRequestName(userDto.getChangeRequestName());
		userReq.setIpAddress(userDto.getIpAddress());
		userReq.setDeletFlag(userDto.getDeletFlag());
		userReq.setPassWordLastUpdatedDate(getCurrentDateTime());
		userReq.setLastLoggedInDate(userDto.getLastLoggedInDate());
		userReq.setStatus(userDto.getStatus());
		return userReq;
	}

	/**
	 * @param userDto
	 * @param userReq
	 * @return
	 */
	public Users userDtoToEntity(UserDto userDto, Users userReq) {
		userReq.setUserName(userDto.getUserName());
		userReq.setPassword(userDto.getPassword());
		userReq.setEmail(userDto.getEmail());
		userReq.setFirstName(userDto.getFirstName());
		userReq.setLastName(userDto.getLastName());
		userReq.setMobileNumber(userDto.getMobileNumber());
		userReq.setRoleId(userDto.getRoleId());
		userReq.setRemark(userDto.getRemark());
		userReq.setDeletFlag(userDto.getDeletFlag());
		userReq.setPassWordLastUpdatedDate(getCurrentDateTime());
		userReq.setLastLoggedInDate(userDto.getLastLoggedInDate());
		return userReq;
	}

	/**
	 * @param roleDto
	 * @param newRole
	 * @return
	 */
	public Role roleDtoToEntity(RoleDto roleDto, Role newRole) {
		newRole.setRoleId(roleDto.getRoleId());
		newRole.setRoleName(roleDto.getRoleName());
		newRole.setIsActive(roleDto.getIsActive());
		newRole.setIsDeleted(roleDto.getIsDeleted());
		newRole.setChangeRequestId(roleDto.getChangeRequestId());
		newRole.setChangeRequestName(roleDto.getChangeRequestName());
		newRole.setIpAddress(roleDto.getIpAddress());
		return newRole;
	}

	/**
	 * @param roleDto
	 * @param newRole
	 * @return
	 */
	public RolePermissions rolePermissionsDtoToEntity(RolePermissionsDto roleDto, RolePermissions newRole) {
		newRole.setId(roleDto.getId());
		newRole.setRoleId(roleDto.getRoleId());
		newRole.setModuleId(roleDto.getModuleId());
		newRole.setSubModuleId(roleDto.getSubModuleId());
		newRole.setTableId(roleDto.getTableId());
		newRole.setPermissionId(roleDto.getPermissionId());
		return newRole;
	}

	/**
	 * @param tableTemplateDetails
	 * @param tmp
	 * @return
	 */
	public TableTemplateDetails tableTemplateDetailsDtoToEntity(TableTemplateDetailsDto tableTemplateDetails,
			TableTemplateDetails tmp) {
		tmp.setTableFieldId(tableTemplateDetails.getTableFieldId());
		tmp.setLastUpdateDatetime(tableTemplateDetails.getLastUpdateDatetime());
		tmp.setFkTableFieldName(tableTemplateDetails.getFkTableFieldName());
		tmp.setLatUpdateUser(tableTemplateDetails.getLatUpdateUser());
		tmp.setTemplateId(tableTemplateDetails.getTemplateId());
		tmp.setTableId(tableTemplateDetails.getTableId());
		tmp.setTableFieldName(tableTemplateDetails.getTableFieldName());
		tmp.setTemplateAttribute(tableTemplateDetails.getTemplateAttribute());
		tmp.setDataType(tableTemplateDetails.getDataType());
		tmp.setFieldLength(tableTemplateDetails.getFieldLength());
		tmp.setMandatoryOptional(tableTemplateDetails.getMandatoryOptional());
		tmp.setDefaultValue(tableTemplateDetails.getDefaultValue());
		tmp.setIsPrimaryKey(tableTemplateDetails.getIsPrimaryKey());
		tmp.setIsFk(tableTemplateDetails.getIsFk());
		tmp.setFkTableId(tableTemplateDetails.getFkTableId());
		tmp.setErrorDesc(tableTemplateDetails.getErrorDesc());
		return tmp;
	}

}
