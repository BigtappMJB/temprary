package com.cmd.excel.model.embed;

import java.io.Serializable;

public class EfmNavExclRequestEmbed implements Serializable {

	private static final long serialVersionUID = 1L;
	private String exclusionType;
	private String exclusionValue;

	public EfmNavExclRequestEmbed() {
		super();
	}

	public EfmNavExclRequestEmbed(String exclusionType, String exclusionValue) {
		super();
		this.exclusionType = exclusionType;
		this.exclusionValue = exclusionValue;
	}

	public String getExclusionType() {
		return exclusionType;
	}

	public void setExclusionType(String exclusionType) {
		this.exclusionType = exclusionType;
	}

	public String getExclusionValue() {
		return exclusionValue;
	}

	public void setExclusionValue(String exclusionValue) {
		this.exclusionValue = exclusionValue;
	}

}
