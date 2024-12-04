package com.cmd.excel.model.embed;

import java.io.Serializable;

public class AssectMixEffsaMappingRequestEmbed implements Serializable {

	private static final long serialVersionUID = 1L;
	private String fund;
	private String effectiveDate;
	private String bussinessSector;
	
	public AssectMixEffsaMappingRequestEmbed() {
		super();
	}

	public AssectMixEffsaMappingRequestEmbed(String fund, String effectiveDate,String bussinessSector) {
		super();
		this.fund = fund;
		this.effectiveDate = effectiveDate;
		this.bussinessSector = bussinessSector;
	}

	public String getFund() {
		return fund;
	}

	public void setFund(String fund) {
		this.fund = fund;
	}

	public String getEffectiveDate() {
		return effectiveDate;
	}

	public void setEffectiveDate(String effectiveDate) {
		this.effectiveDate = effectiveDate;
	}

	public String getBussinessSector() {
		return bussinessSector;
	}

	public void setBussinessSector(String bussinessSector) {
		this.bussinessSector = bussinessSector;
	}

}
