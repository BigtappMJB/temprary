package com.cmd.excel.model.templates;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "entity")
public class EntityTable {
	@Id
	@Column(name = "ENTITY_ID")
	private String entityId;

	@Column(name = "ENTITY_NAME")
	private String entityName;
	@Column(name = "ENTITY_TYPE")
	private String entityType;
	@Column(name = "MANAGER_CODE")
	private String managerCode;
	@Column(name = "SUB_ACCOUNT")
	private String subAccount;
	@Column(name = "INVESTMENT_DISCRETION")
	private String investmentDiscretion;
	@Column(name = "STRATEGY_GROUP")
	private String strategyGroup;
	@Column(name = "COMPOSITE_HIERARCHY")
	private String compositeHierachy;
	@Column(name = "FX_AGG_LEVEL")
	private String fxAggLevel;
	@Column(name = "ASSET_CLASS")
	private String assetclass;
	@Column(name = "BUSINESS_SECTOR")
	private String businessSector;
	@Column(name = "INACTIVE_FLAG")
	private String inactiveFlag;
	@Column(name = "FUND_INCEPTION_DATE")
	private String fundInceptionDate;
	@Column(name = "FUND_TERMINATE_DATE")
	private String fundTerminateDate;

	@Column(name = "SRC_RECORD_INSERT_DTTM")
	private String srcRecordInsertDttm;
	@Column(name = "SRC_RECORD_INSERT_BY")
	private String srcRecordInsertBy;
	@Column(name = "SRC_RECORD_UPDATE_DTTM")
	private String srcRecordUpdateDttm;
	@Column(name = "SRC_RECORD_UPDATE_BY")
	private String srcRecordUpdateBy;
	@Column(name = "SRC_RECORD_DELETE_DTTM")
	private String srcRecordDeleteDttm;
	@Column(name = "SRC_RECORD_DELETE_By")
	private String srcRecordDeleteBy;
	@Column(name = "SRC_RECORD_DELETE_IND")
	private String srcRecordDeleteInd;
	@Column(name = "LAST_UPDATE_DATE_TIME")
	private String lastUpdateDateTime;
	@Column(name = "LAST_UPDATE_USER")
	private String lastUpdateUser;

	public String getSrcRecordInsertDttm() {
		return srcRecordInsertDttm;
	}

	public void setSrcRecordInsertDttm(String srcRecordInsertDttm) {
		this.srcRecordInsertDttm = srcRecordInsertDttm;
	}

	public String getSrcRecordInsertBy() {
		return srcRecordInsertBy;
	}

	public void setSrcRecordInsertBy(String srcRecordInsertBy) {
		this.srcRecordInsertBy = srcRecordInsertBy;
	}

	public String getSrcRecordUpdateDttm() {
		return srcRecordUpdateDttm;
	}

	public void setSrcRecordUpdateDttm(String srcRecordUpdateDttm) {
		this.srcRecordUpdateDttm = srcRecordUpdateDttm;
	}

	public String getSrcRecordUpdateBy() {
		return srcRecordUpdateBy;
	}

	public void setSrcRecordUpdateBy(String srcRecordUpdateBy) {
		this.srcRecordUpdateBy = srcRecordUpdateBy;
	}

	public String getSrcRecordDeleteDttm() {
		return srcRecordDeleteDttm;
	}

	public void setSrcRecordDeleteDttm(String srcRecordDeleteDttm) {
		this.srcRecordDeleteDttm = srcRecordDeleteDttm;
	}

	public String getSrcRecordDeleteBy() {
		return srcRecordDeleteBy;
	}

	public void setSrcRecordDeleteBy(String srcRecordDeleteBy) {
		this.srcRecordDeleteBy = srcRecordDeleteBy;
	}

	public String getSrcRecordDeleteInd() {
		return srcRecordDeleteInd;
	}

	public void setSrcRecordDeleteInd(String srcRecordDeleteInd) {
		this.srcRecordDeleteInd = srcRecordDeleteInd;
	}

	public String getLastUpdateDateTime() {
		return lastUpdateDateTime;
	}

	public void setLastUpdateDateTime(String lastUpdateDateTime) {
		this.lastUpdateDateTime = lastUpdateDateTime;
	}

	public String getLastUpdateUser() {
		return lastUpdateUser;
	}

	public void setLastUpdateUser(String lastUpdateUser) {
		this.lastUpdateUser = lastUpdateUser;
	}

	public String getEntityId() {
		return entityId;
	}

	public void setEntityId(String entityId) {
		this.entityId = entityId;
	}

	public String getEntityName() {
		return entityName;
	}

	public void setEntityName(String entityName) {
		this.entityName = entityName;
	}

	public String getEntityType() {
		return entityType;
	}

	public void setEntityType(String entityType) {
		this.entityType = entityType;
	}

	public String getManagerCode() {
		return managerCode;
	}

	public void setManagerCode(String managerCode) {
		this.managerCode = managerCode;
	}

	public String getSubAccount() {
		return subAccount;
	}

	public void setSubAccount(String subAccount) {
		this.subAccount = subAccount;
	}

	public String getInvestmentDiscretion() {
		return investmentDiscretion;
	}

	public void setInvestmentDiscretion(String investmentDiscretion) {
		this.investmentDiscretion = investmentDiscretion;
	}

	public String getStrategyGroup() {
		return strategyGroup;
	}

	public void setStrategyGroup(String strategyGroup) {
		this.strategyGroup = strategyGroup;
	}

	public String getCompositeHierachy() {
		return compositeHierachy;
	}

	public void setCompositeHierachy(String compositeHierachy) {
		this.compositeHierachy = compositeHierachy;
	}

	public String getFxAggLevel() {
		return fxAggLevel;
	}

	public void setFxAggLevel(String fxAggLevel) {
		this.fxAggLevel = fxAggLevel;
	}

	public String getAssetclass() {
		return assetclass;
	}

	public void setAssetclass(String assetclass) {
		this.assetclass = assetclass;
	}

	public String getBusinessSector() {
		return businessSector;
	}

	public void setBusinessSector(String businessSector) {
		this.businessSector = businessSector;
	}

	public String getInactiveFlag() {
		return inactiveFlag;
	}

	public void setInactiveFlag(String inactiveFlag) {
		this.inactiveFlag = inactiveFlag;
	}

	public String getFundInceptionDate() {
		return fundInceptionDate;
	}

	public void setFundInceptionDate(String fundInceptionDate) {
		this.fundInceptionDate = fundInceptionDate;
	}

	public String getFundTerminateDate() {
		return fundTerminateDate;
	}

	public void setFundTerminateDate(String fundTerminateDate) {
		this.fundTerminateDate = fundTerminateDate;
	}

}
