package com.cmd.excel.model.embed;

import java.io.Serializable;

public class EfmNavBizsecSectypeExclRequestEmbed implements Serializable {
	private static final long serialVersionUID = 1L;
	private String businessSector;
	private String ntucSectype2LongDesc;
	
	public EfmNavBizsecSectypeExclRequestEmbed() {
		super();
	}

	public EfmNavBizsecSectypeExclRequestEmbed(String businessSector, String ntucSectype2LongDesc) {
		super();
		this.businessSector = businessSector;
		this.ntucSectype2LongDesc = ntucSectype2LongDesc;
	}

	public String getBusinessSector() {
		return businessSector;
	}

	public void setBusinessSector(String businessSector) {
		this.businessSector = businessSector;
	}

	public String getNtucSectype2LongDesc() {
		return ntucSectype2LongDesc;
	}

	public void setNtucSectype2LongDesc(String ntucSectype2LongDesc) {
		this.ntucSectype2LongDesc = ntucSectype2LongDesc;
	}


}
