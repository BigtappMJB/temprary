package com.cmd.excel.model.embed;

import java.io.Serializable;

public class DervNvSectypeMapRequestEmbed implements Serializable {
	private static final long serialVersionUID = 1L;
	private String ntucSectype1LongDesc;
	private String sign;

	public DervNvSectypeMapRequestEmbed() {
		super();
	}

	public DervNvSectypeMapRequestEmbed(String ntucSectype1LongDesc, String sign) {
		super();
		this.ntucSectype1LongDesc = ntucSectype1LongDesc;
		this.sign = sign;
	}

	public String getNtucSectype1LongDesc() {
		return ntucSectype1LongDesc;
	}

	public void setNtucSectype1LongDesc(String ntucSectype1LongDesc) {
		this.ntucSectype1LongDesc = ntucSectype1LongDesc;
	}

	public String getSign() {
		return sign;
	}

	public void setSign(String sign) {
		this.sign = sign;
	}

}
