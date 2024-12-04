package com.cmd.domain;

import com.cmd.domain.response.IamResponse;

public class IamGetToken {
	private String userToken;
	private IamResponse response;
	
	public String getUserToken() {
		return userToken;
	}
	public void setUserToken(String userToken) {
		this.userToken = userToken;
	}
	public IamResponse getResponse() {
		return response;
	}
	public void setResponse(IamResponse response) {
		this.response = response;
	}	
}
