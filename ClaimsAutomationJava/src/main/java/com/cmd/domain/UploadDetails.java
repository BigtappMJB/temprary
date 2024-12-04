package com.cmd.domain;

import java.util.List;

public class UploadDetails {
	private String userName;
	private String userToken;
	private List<String> primaryKeyColumnList;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserToken() {
		return userToken;
	}

	public void setUserToken(String userToken) {
		this.userToken = userToken;
	}

	public List<String> getPrimaryKeyColumnList() {
		return primaryKeyColumnList;
	}

	public void setPrimaryKeyColumnList(List<String> primaryKeyColumnList) {
		this.primaryKeyColumnList = primaryKeyColumnList;
	}
}
