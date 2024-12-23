package com.cmd.excel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmd.excel.model.MappingTable;
import com.cmd.excel.repository.MappingTableRepository;

import java.util.List;

@Service
public class MappingTableService {

	@Autowired
    private MappingTableRepository mappingTableRepository;

    public List<MappingTable> getAllMappings() {
        return mappingTableRepository.findAll();
    }
}
