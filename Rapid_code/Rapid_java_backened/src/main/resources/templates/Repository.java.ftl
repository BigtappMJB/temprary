<#assign entityPackage = className?substring(0, className?last_index_of(".")) >
<#assign cls = className?substring( className?last_index_of(".") +1) >
<#assign jpaPackage  = entityPackage?replace(".model", ".repository") >


package ${package}.repository;
import java.util.List;
import ${package}.model.${className?substring(className?last_index_of(".") + 1)};
<#if relationshipType?? && masterTable??>
    import ${package}.model.${masterTable?capitalize};
</#if>
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ${className?substring(className?last_index_of(".") + 1)}Repository extends JpaRepository<${className?substring(className?last_index_of(".") + 1)}, Long> {
<#if relationshipType?? && masterTable??>
    List<${className?substring(className?last_index_of(".") + 1)}> findBy${masterTable?capitalize}(${masterTable?capitalize} ${masterTable?uncap_first});
</#if>
}
