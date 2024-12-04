package com.cmd.domain;


public class UserDto {

	private int id;
	private String userName;
	private String password;
	private String firstName;
	private String lastName;
	private String email;
	private String mobileNumber;
	private Integer roleId;
	private String remark;
	private String status;
	private String passWordLastUpdatedDate;
	private String lastLoggedInDate;
	private int isDeleted;
	private String changeRequestName;
	private String changeRequestId;
	private String ipAddress;

	public UserDto() {
	}

	public UserDto(String userName, String mobileNumber, String firstName, String lastName, String email,
			Integer roleId, String status) {
		this.userName = userName;
		this.mobileNumber = mobileNumber;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.roleId = roleId;
		this.status = status;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public int getDeletFlag() {
		return isDeleted;
	}

	public void setDeletFlag(int isDeleted) {
		this.isDeleted = isDeleted;
	}

	public String getLastLoggedInDate() {
		return lastLoggedInDate;
	}

	public void setLastLoggedInDate(String lastLoggedInDate) {
		this.lastLoggedInDate = lastLoggedInDate;
	}

	public String getPassWordLastUpdatedDate() {
		return passWordLastUpdatedDate;
	}

	public void setPassWordLastUpdatedDate(String passWordLastUpdatedDate) {
		this.passWordLastUpdatedDate = passWordLastUpdatedDate;
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

	@Override
	public String toString() {
		return "Users [userName=" + userName + ", passWord=" + password + ", firstName=" + firstName + ", lastName="
				+ lastName + ", email=" + email + ", mobileNumber=" + mobileNumber + ", roleId=" + roleId + ", remark="
				+ remark + ", status=" + status + "]";
	}

}