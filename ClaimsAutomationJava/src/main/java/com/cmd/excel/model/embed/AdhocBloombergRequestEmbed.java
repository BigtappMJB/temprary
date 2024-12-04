package com.cmd.excel.model.embed;

import java.io.Serializable;

import javax.persistence.Embeddable;

@Embeddable
public class AdhocBloombergRequestEmbed implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String securityId;
	private String securityType;
	
	public AdhocBloombergRequestEmbed() {
		super();
	}

	public AdhocBloombergRequestEmbed(String securityId, String securityType) {
		super();
		this.securityId = securityId;
		this.securityType = securityType;
	}

	public String getSecurityId() {
		return securityId;
	}

	public void setSecurityId(String securityId) {
		this.securityId = securityId;
	}

	public String getSecurityType() {
		return securityType;
	}

	public void setSecurityType(String securityType) {
		this.securityType = securityType;
	}

}