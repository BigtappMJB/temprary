package com.cmd.excel.repository.templates;


import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cmd.excel.model.templates.Currency;

@Repository
public interface CurrencyRepository extends JpaRepository<Currency, String> {
	@Query(value = "select * from currency where SRC_RECORD_DELETE_IND = 'N' ORDER BY last_update_date_time DESC", nativeQuery = true)
	List<Map<String, Object>> getCurrencyRepositoryRequest();

	@Query(value = "select * from currency where SRC_RECORD_DELETE_IND = 'Y'", nativeQuery = true)
	Currency getCurrencyRepositoryRequestDeleted();
	
}
