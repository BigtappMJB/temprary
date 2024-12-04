package com.cmd.excel.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "user_token")
public class UserToken {
	@Id
	@Column(name = "ID")
	private int id;
	@Column(name = "user_name")
	private String userName;
	@Column(name = "user_token")
	private String usrToken;

	public UserToken() {
	}

	public UserToken(String userName, String userToken) {
		super();
		this.userName = userName;
		this.usrToken = userToken;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserToken() {
		return usrToken;
	}

	public void setUserToken(String userToken) {
		this.usrToken = userToken;
	}

}