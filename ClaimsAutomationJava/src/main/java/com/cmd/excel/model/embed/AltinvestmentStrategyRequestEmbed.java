package com.cmd.excel.model.embed;

import java.io.Serializable;

public class AltinvestmentStrategyRequestEmbed implements Serializable {
	
	private static final long serialVersionUID = 1L;
	private String strategy;
	private String effectiveDate;
	
	public AltinvestmentStrategyRequestEmbed() {
		super();
	}

	public AltinvestmentStrategyRequestEmbed(String  strategy, String effectiveDate) {
		super();
		this.strategy = strategy;
		this.effectiveDate = effectiveDate;
	}

	public String getStrategy() {
		return strategy;
	}

	public void setStrategy(String strategy) {
		this.strategy = strategy;
	}

	public String getEffectiveDate() {
		return effectiveDate;
	}

	public void setEffectiveDate(String effectiveDate) {
		this.effectiveDate = effectiveDate;
	}

}
