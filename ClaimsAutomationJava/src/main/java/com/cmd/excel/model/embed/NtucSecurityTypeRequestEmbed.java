package com.cmd.excel.model.embed;

import java.io.Serializable;

public class NtucSecurityTypeRequestEmbed implements Serializable {
	private static final long serialVersionUID = 1L;
	private String ntucSectype1;
	private String ntucSectype2;

	public NtucSecurityTypeRequestEmbed() {
		super();
	}

	public NtucSecurityTypeRequestEmbed(String ntucSectype1, String ntucSectype2) {
		super();
		this.ntucSectype1 = ntucSectype1;
		this.ntucSectype2 = ntucSectype2;
	}

	public String getNtucSectype1() {
		return ntucSectype1;
	}

	public void setNtucSectype1(String ntucSectype1) {
		this.ntucSectype1 = ntucSectype1;
	}

	public String getNtucSectype2() {
		return ntucSectype2;
	}

	public void setNtucSectype2(String ntucSectype2) {
		this.ntucSectype2 = ntucSectype2;
	}

}
