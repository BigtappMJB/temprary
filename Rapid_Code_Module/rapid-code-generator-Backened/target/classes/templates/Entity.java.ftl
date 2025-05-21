<#assign pkg = className?substring(0, className?last_index_of("."))>
<#assign cls = className?substring(className?last_index_of(".") + 1)>

package ${pkg};


import jakarta.persistence.*;
import java.io.Serializable;

<#list fields as field>
      <#if field.type == "BigDecimal">
        import java.math.BigDecimal;
    </#if>
    <#if field.type == "LocalDate">
        import java.time.LocalDate;
    </#if>
    <#if field.type == "LocalDateTime">
        import java.time.LocalDateTime;
    </#if>
    <#if field.type == "Date">
        import java.sql.Date;
    </#if>
    <#if field.type == "UUID">
        import java.util.UUID;
    </#if>
    <#if field.type == "List">
        import java.util.List;
    </#if>
    <#if field.type == "Set">
        import java.util.Set;
    </#if>
    <#if field.type == "Map">
        import java.util.Map;
    </#if>
    <#if field.type == "Optional">
        import java.util.Optional;
    </#if>
<#if field.type == "Time">

    import java.sql.Time;

</#if>
    <#if field.type == "Timestamp">
        import java.sql.Timestamp;
    </#if>
    <#if field.type == "String">
        // No need for import, as String is already available
    </#if>
    <#if field.type == "Long">
        // No need for import, as Long is already available
    </#if>
    <#if field.type == "Integer">
        // No need for import, as Integer is already available
    </#if>
    <#if field.type == "Double">
        // No need for import, as Double is already available
    </#if>
    <#if field.type == "Float">
        // No need for import, as Float is already available
    </#if>
    <#if field.type == "Boolean">
        // No need for import, as Boolean is already available
    </#if>
    <#if field.type == "Character">
        // No need for import, as Character is already available
    </#if>
    <#if field.type == "Byte">
        // No need for import, as Byte is already available
    </#if>
    <#if field.type == "Short">
        // No need for import, as Short is already available
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
