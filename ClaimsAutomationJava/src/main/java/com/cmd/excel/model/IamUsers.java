package com.cmd.excel.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "users")
public class IamUsers {
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@Id
	@Column(name = "ID")
	private int id;
	@Column(name = "user_name")
	private String userName;
	@Column(name = "password")
	private String password;
	@Column(name = "first_name")
	private String firstName;
	@Column(name = "last_name")
	private String lastName;
	@Column(name = "email")
	private String email;
	@Column(name = "mobile_number")
	private String mobileNumber;
	@Column(name = "role_id")
	private Integer roleId;
	@Column(name = "remark")
	private String remark;
	@Column(name = "change_request_name")
	private String changeRequestName;
	@Column(name = "change_request_id")
	private String changeRequestId;
	@Column(name = "ip_address")
	private String ipAddress;

	@Column(name = "status")
	private String status = "Y";
	@Column(name = "password_last_updated_date")
	private String passWordLastUpdatedDate;

	@Column(name = "last_logged_in_date")
	private String lastLoggedInDate;

	@Column(name = "delete_flag")
	private int isDeleted;

	public IamUsers() {
		super();
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public Integer getRoleId() {
		return roleId;
	}

	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getChangeRequestName() {
		return changeRequestName;
	}

	public void setChangeRequestName(String changeRequestName) {
		this.changeRequestName = changeRequestName;
	}

	public String getChangeRequestId() {
		return changeRequestId;
	}

	public void setChangeRequestId(String changeRequestId) {
		this.changeRequestId = changeRequestId;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getPassWordLastUpdatedDate() {
		return passWordLastUpdatedDate;
	}

	public void setPassWordLastUpdatedDate(String passWordLastUpdatedDate) {
		this.passWordLastUpdatedDate = passWordLastUpdatedDate;
	}

	public String getLastLoggedInDate() {
		return lastLoggedInDate;
	}

	public void setLastLoggedInDate(String lastLoggedInDate) {
		this.lastLoggedInDate = lastLoggedInDate;
	}

	public int getDeletFlag() {
		return isDeleted;
	}

	public void setDeletFlag(int isDeleted) {
		this.isDeleted = isDeleted;
	}

	@Override
	public String toString() {
		return "IamUsers [id=" + id + ", userName=" + userName + ", password=" + password + ", firstName=" + firstName
				+ ", lastName=" + lastName + ", email=" + email + ", roleId=" + roleId + ", remark=" + remark
				+ ", changeRequestName=" + changeRequestName + ", changeRequestId=" + changeRequestId + ", ipAddress="
				+ ipAddress + ", status=" + status + "]";
	}

}