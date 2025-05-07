
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
import com.cmd.domain.UserDetails;
import com.cmd.domain.request.User;
import com.cmd.domain.response.Response;
import com.cmd.excel.model.Users;
import com.cmd.excel.repository.UserRepository;
import com.cmd.excel.repository.UserTokenRepository;
import com.cmd.excel.utils.CmdUtils;
import com.cmd.excel.utils.JwtTokenUtil;

@Service
public class LoginService {
	private static final Logger logger = LoggerFactory.getLogger(LoginService.class);

	@Value("${password.expiry.cutoff.days}")
	private int pwdExpCutOffDays;

	@Value("${login.inactive.days}")
	private int inactiveDays;

	@Value("${dma.sso.enabled}")
	private boolean ssoEnable;

	@Autowired
	UserRepository userRepository;

	@Autowired
	UserManagementService userManagementService;

	@Autowired
	UserTokenRepository userTokenRepository;

	@Autowired
	CmdUtils dmaUtils;

	@Autowired
	JwtTokenUtil jwtTokenUtil;

	Response response = new Response();
	UserDetails userDetails = new UserDetails();

	Calendar cal = Calendar.getInstance();
	Date today = cal.getTime();

	String message;
	String errorMessage;
	String deCryptedPwd;
	HttpStatus httpStatus;
	boolean isUserExists;

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
	public Users getUserById(String userName) {
		return userRepository.findUserByUserId(userName);
	}

	/**
	 * For Login user details
	 * 
	 * @param userId
	 * @return Users
	 */
	public Object loginUser(User user) {
		response = new Response();
		userDetails = new UserDetails();
		clearMessages();

		try {
			Users dbUser = userRepository.findUserByUserId(user.getUserName());

			Boolean validUser = validatingUserDetails(user, dbUser);
			if (Boolean.FALSE.equals(validUser))
				return new ResponseEntity<>(userDetails, httpStatus);

			logger.info("Checking user exists");
			isUserExists = userExists(user.getUserName());
			if (isUserExists) {
				int diffDays = 0;
				diffDays = checkPasswordExpiry(dbUser, diffDays);
				if (diffDays >= pwdExpCutOffDays) {
					message = CmdConstants.EXPIRED;
					logger.info(errorMessage);
					errorMessage = message;
					dmaUtils.logInfoErrorMessage(logger, errorMessage);
					httpStatus = HttpStatus.NOT_ACCEPTABLE;
				} else {
					logger.info("Getting user details");
					// Get user details by user id
					userDetails = userManagementService.getUserDetails(user.getUserName());
					logger.info("Checking user details contains user id");
					if (!("").equals(userDetails.getUserId()) && null != userDetails.getUserId()) {
						dbUser.setLastLoggedInDate(new Timestamp(today.getTime()).toString());
						userManagementService.saveUser(dbUser);
						logger.info("Login successfull");
						message = user.getUserName() + " " + CmdConstants.MSG_LOGIN_SUCCESSFUL;
						logger.info(message);
						dmaUtils.logInfoDebugMessage(logger, message);
						httpStatus = HttpStatus.OK;
					} else if (userDetails.getPermissions() == null) {
						message = userDetails.getResponse().getMessage();
						httpStatus = HttpStatus.NOT_FOUND;
					} else {
						logger.info("Error in userdetails");
						message = CmdConstants.MSG_USER_DETAILS_ERROR;
						errorMessage = message;
						logger.info(errorMessage);
						dmaUtils.logInfoErrorMessage(logger, errorMessage);
						httpStatus = HttpStatus.EXPECTATION_FAILED;
					}
				}
			} else {
				logger.info("User doesnot exists");
				message = CmdConstants.MSG_USER_NOT_EXISTS;
				errorMessage = message;
				logger.info(message);
				dmaUtils.logInfoErrorMessage(logger, errorMessage);
				httpStatus = HttpStatus.NOT_FOUND;
			}
		} catch (Exception e) {
			logger.info("Exception while login");
			message = CmdConstants.MSG_USER_LOGIN_ERROR;
			httpStatus = HttpStatus.EXPECTATION_FAILED;
			errorMessage = e.getLocalizedMessage();
			logger.info(errorMessage);
			dmaUtils.logInfoErrorMessage(logger, errorMessage);
		}
		response.setMessage(message);
		response.setErrorMessage(errorMessage);
		response.setStatusCode(httpStatus.value());
		userDetails.setResponse(response);

		return new ResponseEntity<>(userDetails, httpStatus);
	}

	/**
	 * @param dbUser
	 * @param diffDays
	 * @return
	 * @throws ParseException
	 */
	private int checkPasswordExpiry(Users dbUser, int diffDays) throws ParseException {
		if (null != dbUser.getPassWordLastUpdatedDate()) {
			Date passwordLatUpdatedDate = new SimpleDateFormat("yyyy-M-dd").parse(dbUser.getPassWordLastUpdatedDate());
			long diff = today.getTime() - passwordLatUpdatedDate.getTime();
			diffDays = (int) (diff / (1000 * 60 * 60 * 24));
		} else {
			dbUser.setPassWordLastUpdatedDate(dmaUtils.getCurrentDateTime());
			userManagementService.saveUser(dbUser);
		}
		return diffDays;
	}

	/**
	 * 
	 */
	private void clearMessages() {
		message = "";
		errorMessage = "";
	}

	/**
	 * @param user
	 * @param pwdStatus
	 * @param dbUser
	 * @return
	 * @throws ParseException
	 */
	private Boolean validatingUserDetails(User user, Users dbUser) throws ParseException {
		boolean pwdStatus = user.getPassWord() == null;
		logger.info("Checking bad request");
		if (user.getUserName() == null) {
			message = CmdConstants.MSG_BAD_REQUEST;
			logger.info(message);
			dmaUtils.logInfoErrorMessage(logger, message);
			httpStatus = HttpStatus.UNAUTHORIZED;
			response = new Response(message, httpStatus.value(), httpStatus.getReasonPhrase());
			userDetails.setResponse(response);
			return false;
		}

		logger.info("Getting User from db after checking user exists");
		if (null != dbUser.getLastLoggedInDate()) {
			Date lastLogindate = new SimpleDateFormat("yyyy-M-dd").parse(dbUser.getLastLoggedInDate());
			long dayDiff = today.getTime() - lastLogindate.getTime();
			int daysDIff = (int) (dayDiff / (1000 * 60 * 60 * 24));

			if (daysDIff >= inactiveDays && (("Y").equalsIgnoreCase(dbUser.getStatus()))) {
				dbUser.setStatus("N");
				userManagementService.saveUser(dbUser);
				httpStatus = HttpStatus.UNAUTHORIZED;
				message = CmdConstants.USER_INACTIVE;
				logger.info(message);
				response = new Response(message, httpStatus.value(), httpStatus.getReasonPhrase());
				userDetails.setResponse(response);
				return false;
			}
		}
		Boolean checkSsoEnable = checkSSO(user, pwdStatus, dbUser);
		if (Boolean.FALSE.equals(checkSsoEnable))
			return false;

		logger.info("Check delete flag");
		if (dbUser.getDeletFlag() == 1) {
			httpStatus = HttpStatus.NOT_ACCEPTABLE;
			response = new Response(CmdConstants.USER_DELETED, HttpStatus.NOT_ACCEPTABLE.value(),
					HttpStatus.NOT_ACCEPTABLE.getReasonPhrase());
			userDetails.setResponse(response);
			return false;
		}
//		if (("N").equals(dbUser.getStatus())) {
//			httpStatus = HttpStatus.NOT_ACCEPTABLE;
//			response = new Response(CmdConstants.INACTIVE_USER, HttpStatus.NOT_ACCEPTABLE.value(),
//					HttpStatus.NOT_ACCEPTABLE.getReasonPhrase());
//			userDetails.setResponse(response);
//			return false;
//		}
		return true;
	}

	/**
	 * @param user
	 * @param pwdStatus
	 * @param dbUser
	 * @return Boolean
	 */
	private Boolean checkSSO(User user, boolean pwdStatus, Users dbUser) {
		if (ssoEnable) {
			logger.info("SSO is : {} ", ssoEnable);
			if (!pwdStatus) {
				httpStatus = HttpStatus.UNAUTHORIZED;
				message = "SSO is enable password is not accepted";
				response = new Response(message, httpStatus.value(), httpStatus.getReasonPhrase());
				userDetails.setResponse(response);
				return false;
			}
		} else {
			logger.info("SSO is : {} ", ssoEnable);
			if (pwdStatus) {
				httpStatus = HttpStatus.UNAUTHORIZED;
				message = "password should not be NULL";
				response = new Response(message, httpStatus.value(), httpStatus.getReasonPhrase());
				userDetails.setResponse(response);
				return false;
			} else {
				logger.info("Decrypting pwd");
				deCryptedPwd = dmaUtils.deCrypt(user.getPassWord());
				if (!dmaUtils.deCrypt(dbUser.getPassword()).equals(deCryptedPwd)) {
					response = new Response(
							CmdConstants.MSG_USER_AUTORIZATION_FAILED + " " + CmdConstants.INVALID_PASSWORD,
							HttpStatus.UNAUTHORIZED.value(), CmdConstants.INVALID_PASSWORD);
					httpStatus = HttpStatus.UNAUTHORIZED;
					userDetails.setResponse(response);
					return false;
				}
			}
		}
		return true;
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
