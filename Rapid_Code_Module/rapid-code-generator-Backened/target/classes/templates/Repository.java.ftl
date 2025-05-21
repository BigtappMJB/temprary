<#assign entityPackage = className?substring(0, className?last_index_of(".")) >
<#assign cls = className?substring( className?last_index_of(".") +1) >
<#assign jpaPackage  = entityPackage?replace(".model", ".repository") >


package ${jpaPackage};

import ${className};

import org.springframework.data.jpa.repository.JpaRepository;

public interface ${cls}Repository extends JpaRepository <${cls}, Long>{

};
