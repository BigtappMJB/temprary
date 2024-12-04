package com.cmd.domain.request;

/**
 * @author ISV7915
 *
 */
public class CmdRequest {
	private Object inputObj;
	private String operation;

	public Object getInputObj() {
		return inputObj;
	}

	public void setUserName(Object inputObj) {
		this.inputObj = inputObj;
	}

	public String getOperation() {
		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;
	}

}
