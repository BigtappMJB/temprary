package com.codegen.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.codegen.DTO.IncomingGeneratorDTO;
import com.codegen.service.DynamicPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.codegen.model.Role;
import com.codegen.exception.RapidControllerException;
import com.codegen.model.GeneratorInput;
import com.codegen.service.CodeGenService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import static freemarker.template.utility.StringUtil.capitalize;

@Slf4j
@RestController
@RequestMapping("/api/generator")
@CrossOrigin(origins = "http://localhost:3000")
public class CodeGenController {

    @Autowired
    private CodeGenService codeGenService;


    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DynamicPageService dynamicPageService;

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello from Spring Boot!";
    }

//    @PostMapping("/generateApp")
//    public ResponseEntity<Map<String, Object>> generateFullApp(@RequestBody @Valid IncomingGeneratorDTO input) {
//        String tableName = input.getTableName();
//
//        if (tableName == null || tableName.trim().isEmpty()) {
//            throw new RapidControllerException("Class name must not be null or empty");
//        }
//
//        // Build GeneratorInput from IncomingGeneratorRequest, ensuring no empty names
//        GeneratorInput generatorInput = new GeneratorInput();
//        generatorInput.setClassName("com.codegen.model." + tableName);
//
//        List<GeneratorInput.Field> fields = new ArrayList<>();
//        if (input.getFields() != null) {
//            for (IncomingGeneratorDTO.IncomingField incomingField : input.getFields()) {
//                String name = incomingField.getName();
//                if (name == null || name.trim().isEmpty()) {
//                    // Fallback to column value if name missing or empty
//                    if (incomingField.getColumn() != null) {
//                        name = incomingField.getColumn().getValue();
//                    }
//                }
//                if (name == null || name.trim().isEmpty()) {
//                    // Skip fields with no name, to avoid validation errors
//                    continue;
//                }
//                GeneratorInput.Field field = new GeneratorInput.Field();
//                field.setName(name);
//                field.setType(incomingField.getType() != null ? incomingField.getType() : "String"); // Default type if null
//                field.setPrimary(incomingField.getPrimary() != null && incomingField.getPrimary());
//
//                fields.add(field);
//            }
//        }
//
//        if (fields.isEmpty()) {
//            throw new RapidControllerException("At least one valid field with non-empty name is required");
//        }
//        generatorInput.setFields(fields);
//
////        Map<String, String> response = new HashMap<>();
////        response.put("message", codeGenService.generateFullSpringBootApp(generatorInput));
//////        response.put("status", "success");
////
////
////        log.info("Application generation response: {}", response);
//        Integer menuId = 39; // get actual menuId from your logic
//        Integer subMenuId = 109; // get actual subMenuId from your logic
//        String pageName = input.getPageName(); // or from input
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("success", true);
//
//        // Compose friendly message here:
//        String message = String.format(
//                "Page Created Successfully\nYour dynamic page \"%s\" has been created! Menu ID: %d, Sub-Menu ID: %d. The backend API endpoints have been created and the React component has been generated. Click \"Reload & View Page\" to automatically reload and navigate to your new page.",
//                pageName, menuId, subMenuId
//        );
////        response.put("message", message);
//        response.put("message", codeGenService.generateFullSpringBootApp(generatorInput));
//        // Include any other data you want to return
//        Map<String, Object> data = new HashMap<>();
//        data.put("menuId", menuId);
//        data.put("subMenuId", subMenuId);
//        // add more if needed
//        response.put("data", data);
//
//
//        return ResponseEntity.ok(response);
//    }



@PostMapping("/generateApp")
public ResponseEntity<Map<String, Object>> generateFullApp(@RequestBody @Valid IncomingGeneratorDTO input) {
    // Validate required inputs upfront
    if (input.getTableName() == null || input.getTableName().trim().isEmpty()) {
        throw new RapidControllerException("Table name must not be null or empty");
    }
    if (input.getMenuName() == null || input.getMenuName().trim().isEmpty()) {
        throw new RapidControllerException("Menu name must not be null or empty");
    }
    if (input.getSubMenuName() == null || input.getSubMenuName().trim().isEmpty()) {
        throw new RapidControllerException("SubMenu name must not be null or empty");
    }
    if (input.getRoutePath() == null || input.getRoutePath().trim().isEmpty()) {
        throw new RapidControllerException("Route path must not be null or empty");
    }
    if (input.getPermissionLevels() == null || input.getPermissionLevels().isEmpty()) {
        throw new RapidControllerException("Permission levels list must not be empty");
    }

    // Here w can set createdBy from logged-in user or static for now
    String createdBy = "system";

    // 1. Get or create Menu, get menuId
    Long menuId = dynamicPageService.getOrCreateMenu(input.getMenuName(), createdBy);

    // 2. Create or update SubMenu, get subMenuId
    Long subMenuId = dynamicPageService.createOrUpdateSubMenu(menuId, input.getSubMenuName(),
            input.getDescription(), input.getRoutePath(), createdBy);

    // 3. Get permission level IDs map for given names
    Map<String, Long> permissionLevelIds = dynamicPageService.getPermissionLevelIdsByNames(input.getPermissionLevels());

    if (permissionLevelIds.isEmpty()) {
        throw new RapidControllerException("No valid permission levels found for given names");
    }

    // 4. Get all roles from DB
    List<Role> roles = dynamicPageService.getAllRoles();

    // 5. Create or update RolePermission entries for each role and permission level
    for (Role role : roles) {
        for (Long permLevelId : permissionLevelIds.values()) {
            dynamicPageService.createOrUpdateRolePermission(role.getId(), menuId, subMenuId, permLevelId, createdBy);
        }
    }


    GeneratorInput generatorInput = new GeneratorInput();
    generatorInput.setClassName("com.codegen.model." + capitalize(input.getTableName()));
    generatorInput.setMasterTable(input.getMasterTable()); // Will be null if not in JSON
    generatorInput.setRelationshipType(input.getRelationshipType()); // Will be null if not in JSON
    List<GeneratorInput.Field> fields = new ArrayList<>();
    if (input.getFields() != null) {
        for (IncomingGeneratorDTO.IncomingField incomingField : input.getFields()) {
            String name = incomingField.getName();
            if (name == null || name.trim().isEmpty()) {
                if (incomingField.getColumn() != null) {
                    name = incomingField.getColumn().getValue();
                }
            }
            if (name == null || name.trim().isEmpty()) {
                continue; // skip invalid fields
            }
            GeneratorInput.Field field = new GeneratorInput.Field();
            field.setName(name);
            field.setType(incomingField.getType() != null ? incomingField.getType() : "String");
            field.setPrimary(incomingField.getPrimary() != null && incomingField.getPrimary());
            fields.add(field);
        }
    }
    if (fields.isEmpty()) {
        throw new RapidControllerException("At least one valid field with non-empty name is required");
    }
    generatorInput.setFields(fields);

    // 7. Call codeGenService to generate app
    String generationMessage = codeGenService.generateFullSpringBootApp(generatorInput);

    // 8. Prepare response with success, message and data
    Map<String, Object> response = new HashMap<>();
    response.put("success", true);

    String message = String.format(
            "Page Created Successfully\nYour dynamic page \"%s\" has been created! Menu ID: %d, Sub-Menu ID: %d. Backend API endpoints and React component generated. Click \"Reload & View Page\" to navigate.",
            input.getPageName(), menuId, subMenuId
    );
    response.put("message", generationMessage != null ? generationMessage : message);

    Map<String, Object> data = new HashMap<>();
    data.put("menuId", menuId);
    data.put("subMenuId", subMenuId);
    response.put("data", data);

    return ResponseEntity.ok(response);
}


    @GetMapping("/download/{fileName}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String fileName) throws IOException {

        String filePath = "generated-app/target/" + fileName;
        File file = new File(filePath);


        log.info("Generated file path: {}", filePath);
        if (!file.exists()) {
            log.error("File not found: {}", filePath);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found".getBytes());
        }


        InputStream inputStream = new FileInputStream(file);
        byte[] fileContent = inputStream.readAllBytes();


        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + fileName);

        return ResponseEntity.ok()
                .headers(headers)
                .body(fileContent);
    }


}
