package com.cmd.domain.response;

import java.util.List;
import java.util.Map;

public class UploadResponse {
	private List<Map<String,String>> invalidRecords;
	
	private int totalCount;
	private int insertedCount;
	private int updatedCount;
	private int deletedCount;
	private int validUploadCount;
	private int invalidCount;
	private Response response;

	public Response getResponse() {
		return response;
	}

	public void setResponse(Response response) {
		this.response = response;
	}

	public List<Map<String,String>> getInvalidRecords() {
		return invalidRecords;
	}

	public void setInvalidRecords(List<Map<String,String>> invalidRecords) {
		this.invalidRecords = invalidRecords;
	}

	public int getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
	}

	public int getInsertedCount() {
		return insertedCount;
	}

	public void setInsertedCount(int insertedCount) {
		this.insertedCount = insertedCount;
	}

	public int getUpdatedCount() {
		return updatedCount;
	}

	public void setUpdatedCount(int updatedCount) {
		this.updatedCount = updatedCount;
	}

	public int getDeletedCount() {
		return deletedCount;
	}

	public void setDeletedCount(int deletedCount) {
		this.deletedCount = deletedCount;
	}

	public int getInvalidCount() {
		return invalidCount;
	}

	public void setInvalidCount(int invalidCount) {
		this.invalidCount = invalidCount;
	}

	public int getValidUploadCount() {
		return validUploadCount;
	}

	public void setValidUploadCount(int validUploadCount) {
		this.validUploadCount = validUploadCount;
	}

}
