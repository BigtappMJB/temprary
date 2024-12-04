package com.cmd.excel.model.embed;

import java.io.Serializable;

public class SecurityXreferenceRequestEmbed implements Serializable {

	private static final long serialVersionUID = 1L;
	private int securityalias;
	private String xrefSecurityId;
	private String xrefType;

	public SecurityXreferenceRequestEmbed() {
		super();
	}

	public SecurityXreferenceRequestEmbed(int securityalias, String xrefSecurityId, String xrefType) {
		super();
		this.securityalias = securityalias;
		this.xrefSecurityId = xrefSecurityId;
		this.xrefType = xrefType;
	}

	

	public int getSecurityalias() {
		return securityalias;
	}

	public void setSecurityalias(int i) {
		this.securityalias = i;
	}

	public String getXrefSecurityId() {
		return xrefSecurityId;
	}

	public void setXrefSecurityId(String xrefSecurityId) {
		this.xrefSecurityId = xrefSecurityId;
	}

	public String getXrefType() {
		return xrefType;
	}

	public void setXrefType(String xrefType) {
		this.xrefType = xrefType;
	}

}
