package com.cmd.excel.model.templates;

import javax.persistence.AttributeOverride;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.cmd.excel.model.embed.EntityXreferenceRequestEmbed;

@Entity
@Table(name = "entity_xreference")
public class EntityXreference {
	@EmbeddedId
	@AttributeOverride(name = "xrefAccountId", column = @Column(name = "XREF_ACCOUNT_ID"))
	@AttributeOverride(name = "xrefAccountIdType", column = @Column(name = "XREF_ACCOUNT_ID_TYPE"))
	@AttributeOverride(name = "entityId", column = @Column(name = "ENTITY_ID"))
	private EntityXreferenceRequestEmbed entityXreferenceRequestEmbed;

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

	public EntityXreferenceRequestEmbed getEntityXreferenceRequestEmbed() {
		return entityXreferenceRequestEmbed;
	}

	public void setEntityXreferenceRequestEmbed(EntityXreferenceRequestEmbed entityXreferenceRequestEmbed) {
		this.entityXreferenceRequestEmbed = entityXreferenceRequestEmbed;
	}

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

}
