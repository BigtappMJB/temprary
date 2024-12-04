
/**
 * 	Date,			Author,		Description
 * 
 * 	2021-15-10,		ISV7915,		LoginService  class 
 * 									Initial version
 *	2021-1-11,		ISV7915,		Logout service method added
 */
package com.cmd.excel.service;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.cmd.constants.CmdConstants;
import com.cmd.domain.IamGetToken;
import com.cmd.domain.request.User;
import com.cmd.domain.response.IamResponse;
import com.cmd.excel.model.IamUsers;
import com.cmd.excel.repository.IamUserRepository;
import com.cmd.excel.repository.UserTokenRepository;
import com.cmd.excel.utils.CmdUtils;
import com.cmd.excel.utils.JwtTokenUtil;

@Service
public class IamLoginService {
	private static final Logger logger = LoggerFactory.getLogger(IamLoginService.class);

	@Value("${password.expiry.cutoff.days}")
	private int pwdExpCutOffDays;

	@Value("${login.inactive.days}")
	private int inactiveDays;

	@Autowired
	IamUserRepository userRepository;

	@Autowired
	IamUserManagementService userManagementService;

	@Autowired
	UserTokenRepository userTokenRepository;

	@Autowired
	CmdUtils dmaUtils;
	
	@Autowired
	JwtTokenUtil jwtTokenUtil;

	IamGetToken tokenMessage = new IamGetToken();
	IamResponse iamResponse = new IamResponse();

	Calendar cal = Calendar.getInstance();
	Date today = cal.getTime();

	String message;
	String errorMessage;
	String status;
	int statusCode;
	int diffDays = 0;
	boolean isUserExists;
	HttpStatus httpStatus;

	/**
	 * For is user exists
	 * 
	 * @param userId
	 * @return isUderExists
	 */
	public boolean userExists(String userId) {
		isUserExists = false;
		int userCount = userRepository.findByUserId(userId);
		if (userCount > 0) {
			isUserExists = true;
		}
		return isUserExists;
	}

	/**
	 * For get user by Id
	 * 
	 * @param userId
	 * @return Users
	 */
	public IamUsers getUserById(String userName) {
		return userRepository.findUserByUserId(userName);
	}

	/**
	 * For Login user details
	 * 
	 * @param userId
	 * @return Users
	 */
	public Object loginUser(User user) {
		tokenMessage = new IamGetToken();
		iamResponse = new IamResponse();
		try {

			logger.info("Checking user exists");
			Boolean userExist = checkUser(user);
			if (Boolean.FALSE.equals(userExist))
				return new ResponseEntity<>(tokenMessage, httpStatus);

			logger.info("Getting User details from data base And checking user details");
			IamUsers dbUser = userRepository.findUserByUserId(user.getUserName());
			Boolean validUser = checkUserDetailsDb(user, dbUser);
			if (Boolean.FALSE.equals(validUser))
				return new ResponseEntity<>(tokenMessage, httpStatus);

			if (isUserExists) {
				Boolean validData = fetchingDetails(dbUser);
				if (Boolean.FALSE.equals(validData))
					return new ResponseEntity<>(tokenMessage, httpStatus);
			} else {
				logger.info("User doesnot exists");
				httpStatus = HttpStatus.NOT_FOUND;
				message = CmdConstants.MSG_USER_NOT_EXISTS;
				status = CmdConstants.FAILURE;
				statusCode = CmdConstants.STATUS_CODE_FAILURE;
				setResponse(message, status, statusCode);
				dmaUtils.logInfoErrorMessage(logger, message);
				return new ResponseEntity<>(tokenMessage, httpStatus);
			}
		} catch (Exception e) {
			logger.info("Exception while login");
			httpStatus = HttpStatus.EXPECTATION_FAILED;
			message = CmdConstants.MSG_USER_LOGIN_ERROR;
			status = CmdConstants.FAILURE;
			statusCode = CmdConstants.STATUS_CODE_FAILURE;
			setResponse(message, status, statusCode);
			dmaUtils.logInfoErrorMessage(logger, message);
			return new ResponseEntity<>(tokenMessage, httpStatus);
		}
		return new ResponseEntity<>(tokenMessage, httpStatus);
	}

	/**
	 * @param user
	 * @param dbUser
	 * @throws ParseException
	 */
	private Boolean fetchingDetails(IamUsers dbUser) throws ParseException {
		if (null != dbUser.getPassWordLastUpdatedDate()) {
			Date passwordLatUpdatedDate = new SimpleDateFormat("yyyy-M-dd").parse(dbUser.getPassWordLastUpdatedDate());
			long diff = today.getTime() - passwordLatUpdatedDate.getTime();
			diffDays = (int) (diff / (1000 * 60 * 60 * 24));
		}
		if (diffDays >= pwdExpCutOffDays) {
			httpStatus = HttpStatus.NOT_ACCEPTABLE;
			message = CmdConstants.EXPIRED;
			status = CmdConstants.FAILURE;
			statusCode = CmdConstants.STATUS_CODE_FAILURE;
			setResponse(message, status, statusCode);
			dmaUtils.logInfoErrorMessage(logger, message);
			return false;
		} else {
			String userToken = jwtTokenUtil.generateToken(dbUser.getUserName());
			
			dbUser.setLastLoggedInDate(new Timestamp(today.getTime()).toString());
			userManagementService.saveUser(dbUser);

			logger.info("Login successfull");
			httpStatus = HttpStatus.OK;
			message = CmdConstants.MSG_LOGIN_SUCCESSFUL;
			status = CmdConstants.SUCCESS;
			statusCode = CmdConstants.STATUS_CODE_SUCCESS;
			setResponse(message, status, statusCode);
			tokenMessage.setUserToken(userToken);
			dmaUtils.logInfoDebugMessage(logger, message);
			return true;
		}
	}

	/**
	 * @param user
	 * @param dbUser
	 * @throws ParseException
	 */
	private Boolean checkUserDetailsDb(User user, IamUsers dbUser) throws ParseException {
		logger.info("Decrypting the password");
		Date lastLogindate = new SimpleDateFormat("yyyy-M-dd").parse(dbUser.getLastLoggedInDate());
		long dayDiff = today.getTime() - lastLogindate.getTime();
		int daysDIff = (int) (dayDiff / (1000 * 60 * 60 * 24));
		String deCryptedPwd = dmaUtils.deCrypt(user.getPassWord());
		logger.info("Checking user exists");
		isUserExists = userExists(user.getUserName());
		logger.info("Check delete flag");

		if (null != dbUser.getLastLoggedInDate()) {
			if (daysDIff >= inactiveDays && (("Y").equalsIgnoreCase(dbUser.getStatus()))) {
				dbUser.setStatus("N");
				userManagementService.saveUser(dbUser);

				httpStatus = HttpStatus.UNAUTHORIZED;
				message = CmdConstants.USER_INACTIVE;
				status = CmdConstants.FAILURE;
				statusCode = CmdConstants.STATUS_CODE_FAILURE;
				setResponse(message, status, statusCode);
				return false;
			}
		} else if (dbUser.getDeletFlag() == 1) {
			httpStatus = HttpStatus.UNAUTHORIZED;
			message = CmdConstants.USER_DELETED;
			status = CmdConstants.FAILURE;
			statusCode = CmdConstants.STATUS_CODE_FAILURE;
			setResponse(message, status, statusCode);
			return false;
		} else if (("N").equals(dbUser.getStatus())) {
			httpStatus = HttpStatus.UNAUTHORIZED;
			message = CmdConstants.INACTIVE_USER;
			status = CmdConstants.FAILURE;
			statusCode = CmdConstants.STATUS_CODE_FAILURE;
			setResponse(message, status, statusCode);
			return false;
		} else if (!dmaUtils.deCrypt(dbUser.getPassword()).equals(deCryptedPwd)) {
			httpStatus = HttpStatus.UNAUTHORIZED;
			message = CmdConstants.MSG_USER_AUTORIZATION_FAILED + " " + CmdConstants.INVALID_PASSWORD;
			status = CmdConstants.FAILURE;
			statusCode = CmdConstants.STATUS_CODE_FAILURE;
			setResponse(message, status, statusCode);
			return false;
		}
		return true;
	}

	/**
	 * @param user
	 * @param iamResponse
	 * @return
	 */
	private Boolean checkUser(User user) {
		if (user.getUserName() == null || user.getPassWord() == null) {
			httpStatus = HttpStatus.NOT_ACCEPTABLE;
			message = CmdConstants.MSG_BAD_REQUEST;
			status = CmdConstants.FAILURE;
			statusCode = CmdConstants.STATUS_CODE_FAILURE;
			setResponse(message, status, statusCode);
			dmaUtils.logInfoErrorMessage(logger, message);
			return false;
		} else if (!user.getUserName().equals("IAMDMAppAdmin")) {
			httpStatus = HttpStatus.NOT_ACCEPTABLE;
			message = CmdConstants.MSG_IAM_UNAUTORIZED;
			status = CmdConstants.FAILURE;
			statusCode = CmdConstants.STATUS_CODE_FAILURE;
			logger.info(message);
			setResponse(message, status, statusCode);
			dmaUtils.logInfoErrorMessage(logger, message);
			return false;
		}
		return true;
	}

	/**
	 * @param userDetails
	 * @param tokenMessage
	 * @param message
	 * @param status
	 * @param statusCode
	 * @param iamResponse
	 */
	private void setResponse(String message, String status, int statusCode) {
		logger.info(message);
		iamResponse.setStatusCode(statusCode);
		iamResponse.setStatus(status);
		iamResponse.setStatusDescription(message);
		tokenMessage.setResponse(iamResponse);

	}

	/**
	 * For logging out user
	 * 
	 * @param userId
	 * @return boolean
	 */
	public boolean logOutUser(String userId) {
		if (userTokenRepository.findUserByUserId(userId) != null) {

			userTokenRepository.delete(userTokenRepository.findUserByUserId(userId));
			return true;
		}
		return false;
	}

}
