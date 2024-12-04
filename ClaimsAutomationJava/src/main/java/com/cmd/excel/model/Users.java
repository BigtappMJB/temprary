package com.cmd.excel.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "users")
public class Users {
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
	@Column(name = "status")
	private String status = "Y";
	
	@Column(name = "password_last_updated_date")
	private String passWordLastUpdatedDate;
	
	@Column(name = "last_logged_in_date")
	private String lastLoggedInDate;
	
	@Column(name = "delete_flag")
	private int isDeleted;
	
	@Column(name = "is_default_password_changed")
	private String isDefaultPasswordChanged;



	public Users() {
		super();
	}

	public Users(String userName, String mobileNumber, String firstName, String lastName, String email, Integer roleId,
			 String status) {
		this.userName = userName;
		this.mobileNumber = mobileNumber;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.roleId = roleId;
		this.status = status;
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
	
	public String getIsDefaultPasswordChanged() {
		return isDefaultPasswordChanged;
	}

	public void setIsDefaultPasswordChanged(String isDefaultPasswordChanged) {
		this.isDefaultPasswordChanged = isDefaultPasswordChanged;
	}

	@Override
	public String toString() {
		return "Users [userName=" + userName + ", passWord=" + password + ", firstName=" + firstName + ", lastName="
				+ lastName + ", email=" + email + ", mobileNumber=" + mobileNumber +", roleId=" + roleId + ", remark=" + remark + ", status=" + status
				+ "]";
	}

}