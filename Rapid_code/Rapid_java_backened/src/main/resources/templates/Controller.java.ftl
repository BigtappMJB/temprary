<#assign cls = className?substring(className?last_index_of(".") + 1)>
<#assign clsLower = cls?uncap_first>
<#assign servicePackage = package + ".service">

package ${package}.controller;

import ${className};
import ${servicePackage}.${cls}Service;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/${clsLower}")
public class ${cls}Controller {

    private final ${cls}Service ${clsLower}Service;

    public ${cls}Controller(${cls}Service ${clsLower}Service) {
        this.${clsLower}Service = ${clsLower}Service;
    }

    @GetMapping("/all")
    public List<${cls}> getAll() {
        return ${clsLower}Service.getAll${cls}();
    }

    @PostMapping("/create")
    public ${cls} create(@RequestBody ${cls} ${clsLower}) {
        return ${clsLower}Service.save(${clsLower});
    }

    @GetMapping("/find/{id}")
    public Optional<${cls}> getById(@PathVariable Long id) {
        return ${clsLower}Service.findById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteById(@PathVariable Long id) {
        ${clsLower}Service.deleteById(id);
    }

    @DeleteMapping("/deleteAll")
    public void deleteAll() {
        ${clsLower}Service.deleteAll();
    }
}
