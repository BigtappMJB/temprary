package com.cmd.excel.model.embed;

import java.io.Serializable;

public class ProxyAssetWeightRequestEmbed implements Serializable {

	private static final long serialVersionUID = 1L;
	private String effectivedate;
	private String proxyAdjustment;

	public ProxyAssetWeightRequestEmbed() {
		super();
	}

	public ProxyAssetWeightRequestEmbed(String effectivedate, String proxyAdjustment) {
		super();
		this.effectivedate = effectivedate;
		this.proxyAdjustment = proxyAdjustment;
	}

	public String getEffectivedate() {
		return effectivedate;
	}

	public void setEffectivedate(String effectivedate) {
		this.effectivedate = effectivedate;
	}

	public String getProxyAdjustment() {
		return proxyAdjustment;
	}

	public void setProxyAdjustment(String proxyAdjustment) {
		this.proxyAdjustment = proxyAdjustment;
	}

}
