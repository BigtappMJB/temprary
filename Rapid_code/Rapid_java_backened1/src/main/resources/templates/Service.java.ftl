<#assign entityPackage = className?substring(0, className?last_index_of("."))>
<#assign servicePackage = entityPackage?replace(".model", ".service")>
<#assign entity = className?substring(className?last_index_of(".")+1)>
<#assign jpaPackage = entityPackage?replace(".model", ".repository")>
package ${servicePackage};

import ${className};
import java.util.Optional;
import java.util.List;
import org.springframework.stereotype.Service;
import ${jpaPackage}.${entity}Repository;

@Service
public class ${entity}Service {

    private final ${entity}Repository ${entity?uncap_first}Repository;

    public ${entity}Service(${entity}Repository ${entity?uncap_first}Repository) {
        this.${entity?uncap_first}Repository = ${entity?uncap_first}Repository;
    }

    public List<${entity}> getAll${entity}() {
        return ${entity?uncap_first}Repository.findAll();
    }

    public ${entity} save(${entity} ${entity?uncap_first}) {
        return ${entity?uncap_first}Repository.save(${entity?uncap_first});
    }

    public void deleteById(Long id) {
        ${entity?uncap_first}Repository.deleteById(id);
    }

    public Optional<${entity}> findById(Long id) {
        return ${entity?uncap_first}Repository.findById(id);
    }

    public void deleteAll() {
        ${entity?uncap_first}Repository.deleteAll();
    }
}
