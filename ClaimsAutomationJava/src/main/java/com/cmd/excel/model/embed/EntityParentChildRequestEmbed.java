package com.cmd.excel.model.embed;

import java.io.Serializable;

public class EntityParentChildRequestEmbed implements Serializable {

	private static final long serialVersionUID = 1L;
	private String parentEntityId;
	private String childEntityId;

	public EntityParentChildRequestEmbed() {
		super();
	}

	public EntityParentChildRequestEmbed(String parentEntityId, String childEntityId) {
		super();
		this.parentEntityId = parentEntityId;
		this.childEntityId = childEntityId;
	}

	public String getParentEntityId() {
		return parentEntityId;
	}

	public void setParentEntityId(String parentEntityId) {
		this.parentEntityId = parentEntityId;
	}

	public String getChildEntityId() {
		return childEntityId;
	}

	public void setChildEntityId(String childEntityId) {
		this.childEntityId = childEntityId;
	}

}
