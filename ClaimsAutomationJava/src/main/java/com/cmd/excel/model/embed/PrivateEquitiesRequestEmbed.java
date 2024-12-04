package com.cmd.excel.model.embed;

import java.io.Serializable;

public class PrivateEquitiesRequestEmbed implements Serializable {

	private static final long serialVersionUID = 1L;
	private String primaryAssetId;
	private String primaryAssetIdType;

	public PrivateEquitiesRequestEmbed() {
		super();
	}

	public PrivateEquitiesRequestEmbed(String primaryAssetId, String primaryAssetIdType) {
		super();
		this.primaryAssetId = primaryAssetId;
		this.primaryAssetIdType = primaryAssetIdType;
	}

	public String getPrimaryAssetId() {
		return primaryAssetId;
	}

	public void setPrimaryAssetId(String primaryAssetId) {
		this.primaryAssetId = primaryAssetId;
	}

	public String getPrimaryAssetIdType() {
		return primaryAssetIdType;
	}

	public void setPrimaryAssetIdType(String primaryAssetIdType) {
		this.primaryAssetIdType = primaryAssetIdType;
	}

}
