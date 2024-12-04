/**
 * 	Date,			Author,		Description
 * 
 * 	2021-15-10,		ISV7915,		JwtTokenUtil  class 
 * 									Initial version
 *	2021-1-11,		ISV7915,		Latest optimization logic added
 */

package com.cmd.excel.utils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.cmd.constants.CmdConstants;
import com.cmd.domain.response.Response;
import com.cmd.excel.repository.IamUserRepository;
import com.cmd.excel.repository.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtTokenUtil {

	@Value("${jwt.token.validity.hours}")
	private int jwtTokenValidityHours;

	@Autowired
	UserRepository userRepository;

	@Autowired
	IamUserRepository iamUserRepository;

	@Autowired
	CmdUtils dmaUtils;

	private static String secret = CmdConstants.CMD_SECRET;

	/**
	 * Retrieve username from jwt token
	 * 
	 * @param token
	 * @return
	 */
	public String getUsernameFromToken(String token) {
		return getClaimFromToken(token, Claims::getSubject);
	}

	/**
	 * retrieve expiration date from jwt token
	 * 
	 * @param token
	 * @return
	 */
	public static Date getExpirationDateFromToken(String token) {
		return getClaimFromToken(token, Claims::getExpiration);
	}

	/**
	 * @param <T>
	 * @param token
	 * @param claimsResolver
	 * @return
	 */
	public static <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = getAllClaimsFromToken(token);
		return claimsResolver.apply(claims);
	}

	/**
	 * for retrieving any information from token we will need the secret key
	 * 
	 * @param token
	 * @return
	 */
	private static Claims getAllClaimsFromToken(String token) {
		return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
	}

	/**
	 * check if the token has expired
	 * 
	 * @param token
	 * @return
	 */
	public static Boolean isTokenExpired(String token) {
		final Date expiration = getExpirationDateFromToken(token);
		return expiration.before(new Date());
	}

	/**
	 * generate token for user
	 * 
	 * @param userName
	 * @return
	 */
	public String generateToken(String userName) {
		Map<String, Object> claims = new HashMap<>();
		return doGenerateToken(claims, userName);
	}

	/**
	 * while creating the token 1. Define claims of the token, like Issuer,
	 * Expiration, Subject, and the ID 2. Sign the JWT using the HS512 algorithm and
	 * secret key. 3. According to JWS Compact
	 * Serialization(https://tools.ietf.org/html/draft-ietf-jose-json-web-signature-41#section-3.1)
	 * compaction of the JWT to a URL-safe string
	 * 
	 * @param claims
	 * @param subject
	 * @return
	 */
	private String doGenerateToken(Map<String, Object> claims, String subject) {
		int jwttokenValidity = jwtTokenValidityHours * 60 * 60;
		return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + jwttokenValidity * 1000))
				.signWith(SignatureAlgorithm.HS512, secret).compact();
	}

	/**
	 * For getting user token object by token
	 * 
	 * @param token
	 * @return Object
	 */
	public Object validateUserToken(String token) {
		String message = "";
		HttpStatus httpStatus = HttpStatus.OK;
		String errorMessage = "";
		try {
			if (Boolean.TRUE.equals(isTokenExpired(token))) {
				message = CmdConstants.TOKEN_EXPIRED;
			} else {
				String userName = getUsernameFromToken(token);
				if (userName == null || userName.isEmpty()) {
					message = CmdConstants.INVALID_TOKEN;
				} else {
					message = CmdConstants.VALID_TOKEN;
				}
			}
		} catch (ExpiredJwtException eje) {
			message = CmdConstants.TOKEN_EXPIRED;
			httpStatus = HttpStatus.UNAUTHORIZED;
			errorMessage = eje.getMessage();
		} catch (Exception e) {
			message = CmdConstants.INVALID_TOKEN;
			httpStatus = HttpStatus.UNAUTHORIZED;
			errorMessage = e.getMessage();
		}
		return new Response(message, httpStatus.value(), errorMessage);
	}

	/**
	 * For new unauthorized response
	 * 
	 * @param message
	 * @return Response
	 */
	public static ResponseEntity<Response> unauthorisedResponse(String message) {
		return new ResponseEntity<>(new Response(message, HttpStatus.UNAUTHORIZED.value(),
				CmdConstants.USER + CmdConstants.MSG_USER_AUTORIZATION_FAILED), HttpStatus.UNAUTHORIZED);
	}
}