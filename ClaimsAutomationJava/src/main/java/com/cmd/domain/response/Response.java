package com.cmd.domain.response;

import java.io.Serializable;

/**
 * @author ISV7915
 *
 */
public class Response implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 5531051070754463291L;
	private String message;
	private int statusCode;
	private String errorMessage;
	
	public Response() {
	}

	public Response(String message, int statusCode, String errorMessage) {
		super();
		this.message = message;
		this.statusCode = statusCode;
		this.errorMessage = errorMessage;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public int getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

}
