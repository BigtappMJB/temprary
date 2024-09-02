package com.example.auto.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import jakarta.persistence.Column;

@Entity
@Table(name = "user_password")
public class UserModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_password_id")
	private int userPasswordId;

	@ManyToOne
	@JoinColumn(name = "registration_id", referencedColumnName = "registration_id")
	private RegistrationModel registrationId;

	@ManyToOne
	@JoinColumn(name = "role_id", referencedColumnName = "role_id")
	private RoleModel roleId;

	@Column(name = "password")
	private String password;

	@Column(name = "status")
	private String status;

	@Column(name = "change_password")
	private String changePassword;

	@Column(name = "last_logged_in_date")
	private String lastLoggedInDate;

	@Column(name = "last_password_updated_date")
	private String lastPasswordUpdatedDate;

	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "created_date")
	private String createdDate;

	@Column(name = "updated_by")
	private String updateBy;

	@Column(name = "updated_date")
	private String updateDate;

	@Column(name = "delete_flage")
	private String deleteFlage;

	public int getUserPasswordId() {
		return userPasswordId;
	}

	public void setUserPasswordId(int userPasswordId) {
		this.userPasswordId = userPasswordId;
	}

	public RegistrationModel getRegistrationId() {
		return registrationId;
	}

	public void setRegistrationId(RegistrationModel registrationId) {
		this.registrationId = registrationId;
	}

	public RoleModel getRoleId() {
		return roleId;
	}

	public void setRoleId(RoleModel roleId) {
		this.roleId = roleId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getChangePassword() {
		return changePassword;
	}

	public void setChangePassword(String changePassword) {
		this.changePassword = changePassword;
	}

	public String getLastLoggedInDate() {
		return lastLoggedInDate;
	}

	public void setLastLoggedInDate(String lastLoggedInDate) {
		this.lastLoggedInDate = lastLoggedInDate;
	}

	public String getLastPasswordUpdatedDate() {
		return lastPasswordUpdatedDate;
	}

	public void setLastPasswordUpdatedDate(String lastPasswordUpdatedDate) {
		this.lastPasswordUpdatedDate = lastPasswordUpdatedDate;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(String createdDate) {
		this.createdDate = createdDate;
	}

	public String getUpdateBy() {
		return updateBy;
	}

	public void setUpdateBy(String updateBy) {
		this.updateBy = updateBy;
	}

	public String getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(String updateDate) {
		this.updateDate = updateDate;
	}

	public String getDeleteFlage() {
		return deleteFlage;
	}

	public void setDeleteFlage(String deleteFlage) {
		this.deleteFlage = deleteFlage;
	}

}
