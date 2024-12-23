package com.cmd.excel.model.templates;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "temp_vidal_claims")
public class TempVidalClaims {
	
    private String empTpaid;
    private String claimInsId;
    private String clmHospital;
    private String clmDoa;
    private String clmDod;
    private String claimDt;
    private String clmType;
    private String claimAmount;
    private String claimDescription;
    private String claimStatus;
    private String clmPreAuthId;
    private String clmSettNo;
    private String clmSettAmt;
    private String clmSettDate;
    private String clmDisAmt;
    private String clmSettChqBnk;
    private String clmSettChqDt;

    private String clmBillDetails;
    private String clmAllowedAmt;
    @Id
    private String clmAllowedId;

    // Getters and Setters

    public String getEmpTpaid() {
        return empTpaid;
    }

    public void setEmpTpaid(String empTpaid) {
        this.empTpaid = empTpaid;
    }

    public String getClaimInsId() {
        return claimInsId;
    }

    public void setClaimInsId(String claimInsId) {
        this.claimInsId = claimInsId;
    }

    public String getClmHospital() {
        return clmHospital;
    }

    public void setClmHospital(String clmHospital) {
        this.clmHospital = clmHospital;
    }

    public String getClmDoa() {
        return clmDoa;
    }

    public void setClmDoa(String clmDoa) {
        this.clmDoa = clmDoa;
    }

    public String getClmDod() {
        return clmDod;
    }

    public void setClmDod(String clmDod) {
        this.clmDod = clmDod;
    }

    public String getClaimDt() {
        return claimDt;
    }

    public void setClaimDt(String claimDt) {
        this.claimDt = claimDt;
    }

    public String getClmType() {
        return clmType;
    }

    public void setClmType(String clmType) {
        this.clmType = clmType;
    }

    public String getClaimAmount() {
        return claimAmount;
    }

    public void setClaimAmount(String claimAmount) {
        this.claimAmount = claimAmount;
    }

    public String getClaimDescription() {
        return claimDescription;
    }

    public void setClaimDescription(String claimDescription) {
        this.claimDescription = claimDescription;
    }

    public String getClaimStatus() {
        return claimStatus;
    }

    public void setClaimStatus(String claimStatus) {
        this.claimStatus = claimStatus;
    }

    public String getClmPreAuthId() {
        return clmPreAuthId;
    }

    public void setClmPreAuthId(String clmPreAuthId) {
        this.clmPreAuthId = clmPreAuthId;
    }

    public String getClmSettNo() {
        return clmSettNo;
    }

    public void setClmSettNo(String clmSettNo) {
        this.clmSettNo = clmSettNo;
    }

    public String getClmSettAmt() {
        return clmSettAmt;
    }

    public void setClmSettAmt(String clmSettAmt) {
        this.clmSettAmt = clmSettAmt;
    }

    public String getClmSettDate() {
        return clmSettDate;
    }

    public void setClmSettDate(String clmSettDate) {
        this.clmSettDate = clmSettDate;
    }

    public String getClmDisAmt() {
        return clmDisAmt;
    }

    public void setClmDisAmt(String clmDisAmt) {
        this.clmDisAmt = clmDisAmt;
    }

    public String getClmSettChqBnk() {
        return clmSettChqBnk;
    }

    public void setClmSettChqBnk(String clmSettChqBnk) {
        this.clmSettChqBnk = clmSettChqBnk;
    }

    public String getClmSettChqDt() {
        return clmSettChqDt;
    }

    public void setClmSettChqDt(String clmSettChqDt) {
        this.clmSettChqDt = clmSettChqDt;
    }



    public String getClmBillDetails() {
        return clmBillDetails;
    }

    public void setClmBillDetails(String clmBillDetails) {
        this.clmBillDetails = clmBillDetails;
    }

    public String getClmAllowedAmt() {
        return clmAllowedAmt;
    }

    public void setClmAllowedAmt(String clmAllowedAmt) {
        this.clmAllowedAmt = clmAllowedAmt;
    }



    public String getClmAllowedId() {
        return clmAllowedId;
    }

    public void setClmAllowedId(String clmAllowedId) {
        this.clmAllowedId = clmAllowedId;
    }
}

