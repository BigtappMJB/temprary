package com.cmd.domain.response;

import java.io.Serializable;

/**
 * @author ISV7915
 *
 */
public class IamResponse implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int statusCode;
	private String status;
	private String statusDescription;
	
	public IamResponse() {
	}

	public IamResponse(int statusCode, String status, String statusDescription) {
		super();
		this.statusCode = statusCode;
		this.status = status;
		this.statusDescription = statusDescription;
	}

	public int getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getStatusDescription() {
		return statusDescription;
	}

	public void setStatusDescription(String statusDescription) {
		this.statusDescription = statusDescription;
	}
	
	
	

}
