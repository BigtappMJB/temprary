package com.cmd.excel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cmd.excel.model.MappingTable;

public interface MappingTableRepository extends JpaRepository<MappingTable, Integer> {
}
