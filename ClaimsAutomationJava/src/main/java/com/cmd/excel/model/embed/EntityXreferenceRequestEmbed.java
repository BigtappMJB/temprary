package com.cmd.excel.model.embed;

import java.io.Serializable;

public class EntityXreferenceRequestEmbed implements Serializable {

	private static final long serialVersionUID = 1L;
	private String xrefAccountId;
	private String xrefAccountIdType;
	private String entityId;

	public EntityXreferenceRequestEmbed() {
		super();
	}

	public EntityXreferenceRequestEmbed(String xrefAccountId, String xrefAccountIdType, String entityId) {
		super();
		this.entityId = entityId;
		this.xrefAccountId = xrefAccountId;
		this.xrefAccountIdType = xrefAccountIdType;
	}

	public String getXrefAccountId() {
		return xrefAccountId;
	}

	public void setXrefAccountId(String xrefAccountId) {
		this.xrefAccountId = xrefAccountId;
	}

	public String getXrefAccountIdType() {
		return xrefAccountIdType;
	}

	public void setXrefAccountIdType(String xrefAccountIdType) {
		this.xrefAccountIdType = xrefAccountIdType;
	}

	public String getEntityId() {
		return entityId;
	}

	public void setEntityId(String entityId) {
		this.entityId = entityId;
	}

}
