package com.cmd.excel.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmd.excel.model.SchedulerFileDetails;
import com.cmd.excel.repository.SchedulerFileDetailsRepository;

import java.util.List;

@Service
public class SchedulerFileDetailsService {

    @Autowired
    private SchedulerFileDetailsRepository schedulerFileDetailsRepository;

    public List<SchedulerFileDetails> getAllFiles() {
        return schedulerFileDetailsRepository.findAll();
    }

    public SchedulerFileDetails getFileById(int id) {
        return schedulerFileDetailsRepository.findById(id).orElse(null);
    }

    public SchedulerFileDetails saveFile(SchedulerFileDetails fileDetails) {
        return schedulerFileDetailsRepository.save(fileDetails);
    }

    public void deleteFile(int id) {
    	schedulerFileDetailsRepository.deleteById(id);
    }

	public void insertTableName(String csvFileName, int scheduler_id, int status) {
		SchedulerFileDetails fileDetails= new SchedulerFileDetails();
		fileDetails.setFileName(csvFileName);
		fileDetails.setSchedulerId(scheduler_id);
		fileDetails.setStatus(status);
		schedulerFileDetailsRepository.save(fileDetails);
		
	}

	public List<SchedulerFileDetails> findCSVFileNameBySchedulerId(int schedulerId) {
		return schedulerFileDetailsRepository.findCSVFileNameBySchedulerId(schedulerId);
	}
}

