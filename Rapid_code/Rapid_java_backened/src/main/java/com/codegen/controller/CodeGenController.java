package com.codegen.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codegen.exception.RapidControllerException;
import com.codegen.model.GeneratorInput;
import com.codegen.service.CodeGenService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/generator")
//@CrossOrigin(origins = "http://localhost:3000")
public class CodeGenController {

    @Autowired
    private CodeGenService codeGenService;

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello from Spring Boot!";
    }
    
    @PostMapping("/generateApp")
    public ResponseEntity<Map<String, String>> generateFullApp(@RequestBody @Valid GeneratorInput input) {
        log.info("Received request to generate Spring Boot app for class: {}", input.getClassName());
        if (input.getClassName() == null || input.getClassName().isEmpty()) {
            log.warn("Invalid input: input or className is null");
            throw new RapidControllerException("Class name must not be null or empty");
        }
        Map<String, String> response = new HashMap<>();

        response.put("message", codeGenService.generateFullSpringBootApp(input));

        log.info("Application generation response: {}", response);
        return ResponseEntity.ok(  response);
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
