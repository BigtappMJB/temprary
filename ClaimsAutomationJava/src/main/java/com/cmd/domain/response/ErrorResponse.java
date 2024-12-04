package com.cmd.domain.response;

/**
 * @author ISV7915
 *
 */
public class ErrorResponse {
	private String rootCause;
	private int errorCode;
	private String errorMessage;
	
	public ErrorResponse() {
		super();
	}

	public String getRootCause() {
		return rootCause;
	}

	public void setRootCause(String rootCause) {
		this.rootCause = rootCause;
	}

	public int getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(int errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
}
