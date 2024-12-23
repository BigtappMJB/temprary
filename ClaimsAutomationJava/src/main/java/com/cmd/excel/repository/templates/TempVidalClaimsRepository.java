package com.cmd.excel.repository.templates;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cmd.excel.model.templates.TempVidalClaims;

@Repository
public interface TempVidalClaimsRepository extends JpaRepository<TempVidalClaims, String> {

	@Query(value = "select * from `temp_vidal_claims`", nativeQuery = true)
	List<Map<String, Object>> getTempVidalClaims();

}
