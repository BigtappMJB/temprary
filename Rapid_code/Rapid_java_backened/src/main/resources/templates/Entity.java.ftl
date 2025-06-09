<#assign pkg = className?substring(0, className?last_index_of("."))>
<#assign cls = className?substring(className?last_index_of(".") + 1)>
<#if masterTable??>
    <#assign masterCls = masterTable?capitalize>
    <#assign masterFieldName = masterTable?uncap_first>
</#if>

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
</#list>
<#if masterTable?? && relationshipType??>
    import ${pkg}.${masterCls};
</#if>

@Entity
@Table(name = "${cls?lower_case}")
public class ${cls} implements Serializable {

private static final long serialVersionUID = 1L;

<#list fields as field>
    <#if field.primary?? && field.primary>
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
    </#if>
    @Column(name = "${field.name}")
    private ${field.type} ${field.name};
</#list>

<#if masterTable?? && relationshipType??>
    <#if relationshipType == "OneToOne">
        @OneToOne
        @JoinColumn(name = "${masterFieldName}_id")
        private ${masterCls} ${masterFieldName};
    <#elseif relationshipType == "ManyToOne">
        @ManyToOne
        @JoinColumn(name = "${masterFieldName}_id")
        private ${masterCls} ${masterFieldName};
    <#elseif relationshipType == "OneToMany">
        @OneToMany(mappedBy = "${cls?uncap_first}")
        private List<${masterCls}> ${masterFieldName}s;
    <#elseif relationshipType == "ManyToMany">
        @ManyToMany
        @JoinTable(
        name = "${cls?lower_case}_${masterFieldName?lower_case}",
        joinColumns = @JoinColumn(name = "${cls?lower_case}_id"),
        inverseJoinColumns = @JoinColumn(name = "${masterFieldName}_id")
        )
        private List<${masterCls}> ${masterFieldName}s;
    </#if>
</#if>

public ${cls}() {
}

public ${cls}(
<#if fields?has_content || (masterTable?? && relationshipType??)>
    <#list fields as field>
        ${field.type} ${field.name}<#if field_has_next || (masterTable?? && relationshipType??)>, </#if>
    </#list>
    <#if masterTable?? && relationshipType??>
        <#if relationshipType == "OneToOne" || relationshipType == "ManyToOne">
            ${masterCls} ${masterFieldName}
        <#elseif relationshipType == "OneToMany" || relationshipType == "ManyToMany">
            List<${masterCls}> ${masterFieldName}s
        </#if>
    </#if>
</#if>
) {
<#list fields as field>
    this.${field.name} = ${field.name};
</#list>
<#if masterTable?? && relationshipType??>
    <#if relationshipType == "OneToOne" || relationshipType == "ManyToOne">
        this.${masterFieldName} = ${masterFieldName};
    <#elseif relationshipType == "OneToMany" || relationshipType == "ManyToMany">
        this.${masterFieldName}s = ${masterFieldName}s;
    </#if>
</#if>
}

<#list fields as field>
    public ${field.type} get${field.name?cap_first}() {
    return ${field.name};
    }

    public void set${field.name?cap_first}(${field.type} ${field.name}) {
    this.${field.name} = ${field.name};
    }
</#list>

<#if masterTable?? && relationshipType??>
    <#if relationshipType == "OneToOne" || relationshipType == "ManyToOne">
        public ${masterCls} get${masterFieldName?cap_first}() {
        return ${masterFieldName};
        }

        public void set${masterFieldName?cap_first}(${masterCls} ${masterFieldName}) {
        this.${masterFieldName} = ${masterFieldName};
        }
    <#elseif relationshipType == "OneToMany" || relationshipType == "ManyToMany">
        public List<${masterCls}> get${masterFieldName?cap_first}s() {
        return ${masterFieldName}s;
        }

        public void set${masterFieldName?cap_first}s(List<${masterCls}> ${masterFieldName}s) {
        this.${masterFieldName}s = ${masterFieldName}s;
        }
    </#if>
</#if>
@Override
public String toString() {
StringBuilder sb = new StringBuilder("${cls}[");
<#list fields as field>
    sb.append("${field.name}=").append(${field.name}).append(", ");
</#list>
<#if masterTable?? && relationshipType??>
    <#if relationshipType == "OneToOne" || relationshipType == "ManyToOne">
        sb.append("${masterFieldName}=").append(${masterFieldName});
    <#elseif relationshipType == "OneToMany" || relationshipType == "ManyToMany">
        sb.append("${masterFieldName}s=").append(${masterFieldName}s);
    </#if>
<#else>
<#-- Remove trailing comma and space if no master table or last field -->
    if (sb.length() > ${cls?length + 1}) {
    sb.setLength(sb.length() - 2);
    }
</#if>
sb.append("]");
return sb.toString();



}
}
