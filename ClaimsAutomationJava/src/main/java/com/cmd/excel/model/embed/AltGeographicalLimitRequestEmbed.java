package com.cmd.excel.model.embed;

import java.io.Serializable;

public class AltGeographicalLimitRequestEmbed implements Serializable   {
	
	private static final long serialVersionUID = 1L;
	private String geographicalFocus;
	private String effectiveDate;

	public  AltGeographicalLimitRequestEmbed() {
		super();
	}
	
	public String getGeographicalFocus() {
		return geographicalFocus;
	}

	public void setGeographicalFocus(String geographicalFocus) {
		this.geographicalFocus = geographicalFocus;
	}

	public String getEffectiveDate() {
		return effectiveDate;
	}

	public void setEffectiveDate(String effectiveDate) {
		this.effectiveDate = effectiveDate;
	}

	public AltGeographicalLimitRequestEmbed(String geographicalFocus, String effectiveDate) {
		super();
		this.geographicalFocus = geographicalFocus;
		this.effectiveDate = effectiveDate;
	}
}
