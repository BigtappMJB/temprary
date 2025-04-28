<#assign pkg = className?substring(0, className?last_index_of("."))>
<#assign cls = className?substring(className?last_index_of(".") + 1)>

package ${pkg};


import jakarta.persistence.*;
import java.io.Serializable;


<#list fields as field>
<#if field.type?contains("List")>
import java.util.List;
</#if>
<#if field.type == "BigDecimal">
import java.math.BigDecimal;
</#if>
<#if field.type == "LocalDate">
import java.time.LocalDate;
</#if>
<#if field.type == "LocalDateTime">
import java.time.LocalDateTime;
</#if>
</#list>

@Entity
@Table(name = "${cls?lower_case}")
public class ${cls} implements Serializable {

    private static final long serialVersionUID = 1L;

   <#list fields as field>
    <#if field.primary?? && field.primary == true>
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    </#if>
    @Column(name = "${field.name}")
    private ${field.type} ${field.name};
</#list>


    public ${cls}() {
    }

    public ${cls}(
        <#list fields as field>
        ${field.type} ${field.name}<#if field_has_next>, </#if>
        </#list>
    ) {
        <#list fields as field>
        this.${field.name} = ${field.name};
        </#list>
    }

    <#list fields as field>
    public ${field.type} get${field.name?cap_first}() {
        return ${field.name};
    }

    public void set${field.name?cap_first}(${field.type} ${field.name}) {
        this.${field.name} = ${field.name};
    }
    </#list>

    @Override
    public String toString() {
        return "${cls}{" +
        <#list fields as field>
        "${field.name}=" + ${field.name}<#if field_has_next> + ", " <#else> + "" </#if> +
        </#list>
        '}';
    }
}
