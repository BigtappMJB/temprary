package com.codegen.service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.*;
import com.codegen.exception.ServiceException;
import com.codegen.model.GeneratorInput;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;
import com.codegen.service.CodeGenService;

@Slf4j
@Service
public class DataBaseService {



    @Autowired
    private FreeMarkerConfigurer freemarkerConfig;
    // Main method to generate SQL script for a table based on fields and primary key
    public  void generateDatabaseScript(String basePath, String tableName, @Valid @NotEmpty(message = "At least one field is required") List<GeneratorInput.Field> fields, String primaryKey) throws ServiceException {
        List<Map<String, String>> sqlFields = new ArrayList<>();

        for (GeneratorInput.Field f : fields) {
            Map<String, String> fieldMap = new HashMap<>();
            fieldMap.put("name", f.getName());
            // Pass the class simple name to mapToSqlType
            fieldMap.put("sqlType", mapToSqlType(f.getType()));
            sqlFields.add(fieldMap);
        }

        Map<String, Object> model = new HashMap<>();
        model.put("tableName", tableName);
        model.put("fields", sqlFields);
        model.put("primaryKey", primaryKey);

        String outputPath = basePath + "/src/db/generated_schema.sql";

        writeTemplateToFile("DatabaseScript.sql.ftl", model, outputPath);
    }


    private static String mapToSqlType(String javaType) {
        switch (javaType.toLowerCase()) {
            case "string": return "VARCHAR(255)";
            case "int":
            case "integer": return "INT";
            case "long": return "BIGINT";
            case "boolean": return "BOOLEAN";
            case "date": return "DATE";
            case "timestamp": return "TIMESTAMP";
            case "double": return "DOUBLE";
            case "float": return "FLOAT";
            default: return "VARCHAR(255)";
        }
    }


    private void writeTemplateToFile(String templateName, Map<String, Object> dataModel, String outputPath)
            throws ServiceException {
        try {
            Template template = freemarkerConfig.getConfiguration().getTemplate(templateName);


            File outputFile = new File(outputPath);
            File parentDir = outputFile.getParentFile();
            if (parentDir != null && !parentDir.exists()) {
                parentDir.mkdirs();
            }

            try (FileWriter out = new FileWriter(outputFile)) {
                template.process(dataModel, out);
            }
        } catch (IOException | TemplateException e) {
            throw new ServiceException("Failed to process template: " + templateName, e);
        }
    }

}
