-- Auto-generated SQL schema for table ${tableName}
-- Run this script in your MySQL or compatible database to create the table

CREATE TABLE IF NOT EXISTS `${tableName}` (
<#list fields as field>
    `${field.name}` ${field.sqlType}<#if field_has_next>,</#if>
</#list>
<#if primaryKey?? && primaryKey?length != 0>
    <#if fields?size != 0>,</#if> PRIMARY KEY (`${primaryKey}`)
</#if>
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- End of script
