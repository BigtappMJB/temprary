package com.cmd.excel.repository.templates;


import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cmd.excel.model.templates.CountryRegion;

@Repository
public interface CountryRegionRepository extends JpaRepository<CountryRegion, String> {
	@Query(value = "select * from country_region where SRC_RECORD_DELETE_IND = 'N' ORDER BY last_update_date_time DESC", nativeQuery = true)
	List<Map<String, Object>> getCountryRegionRepositoryRequest();

	@Query(value = "select * from country_region where SRC_RECORD_DELETE_IND = 'Y'", nativeQuery = true)
	CountryRegion getCountryRegionRepositoryRequestDeleted();
}
