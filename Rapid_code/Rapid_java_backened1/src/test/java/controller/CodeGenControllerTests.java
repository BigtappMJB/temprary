package controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.codegen.controller.CodeGenController;
import com.codegen.exception.RapidControllerException;
import com.codegen.exception.ServiceException;
import com.codegen.model.GeneratorInput;
import com.codegen.service.CodeGenService;

@ExtendWith(MockitoExtension.class)
public class CodeGenControllerTests {

    @Mock
    private CodeGenService codeGeneratorService;

    @InjectMocks
    private CodeGenController codeGenController;

    private MockMvc mockMvc;
    private GeneratorInput generatorInput;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(codeGenController).build();
        generatorInput = new GeneratorInput();
        generatorInput.setClassName("com.codegen.model.TestClass");
        generatorInput.setFields(List.of(
            new GeneratorInput.Field("id", "Long", true),
            new GeneratorInput.Field("name", "String", false)
        ));
    }

    // 🔸 MockMvc Test - Simulates HTTP POST
    @Test
    void testGenerateApp_HTTP_Success() throws Exception {
        // Mocking the service to return a success message
        when(codeGeneratorService.generateFullSpringBootApp(any(GeneratorInput.class)))
                .thenReturn("Spring Boot application generated successfully");

        // Send the request with the updated input
        mockMvc.perform(post("/api/generator/generateApp")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"className\": \"com.codegen.model.TestClass\", \"fields\": [{\"name\":\"id\", \"type\":\"Long\", \"required\":true}] }"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Spring Boot application generated successfully"));
    }


    // 🔸 MockMvc Test - Simulates HTTP failure
//    @Test
//    void testGenerateApp_HTTP_ServiceException() throws Exception {
//        when(codeGeneratorService.generateFullSpringBootApp(any(GeneratorInput.class)))
//                .thenThrow(new ServiceException("Failed to generate full Spring Boot application"));
//
//        mockMvc.perform(post("/api/generator/generateApp")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content("{ \"className\": \"com.codegen.model.TestClass\", \"fields\": [{\"name\":\"id\", \"type\":\"Long\", \"required\":true}] }"))
//                .andExpect(status().isInternalServerError())
//                .andExpect(jsonPath("$.message").value("Failed to generate full Spring Boot application"));
//    }

    @Test
    void testGenerateApp_Unit_Success() {
        when(codeGeneratorService.generateFullSpringBootApp(generatorInput))
                .thenReturn("Spring Boot application generated successfully");

        ResponseEntity<Map<String, String>> response = codeGenController.generateFullApp(generatorInput);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Spring Boot application generated successfully", response.getBody().get("message"));
    }

    @Test
    void testGenerateApp_Unit_ClassNameNull() {
        generatorInput.setClassName(null);

        RapidControllerException ex = assertThrows(RapidControllerException.class, () -> {
            codeGenController.generateFullApp(generatorInput);
        });

        assertEquals("Class name must not be null or empty", ex.getMessage());
    }
//
//    // 🔹 Unit Test - Class name empty
    @Test
    void testGenerateApp_Unit_ClassNameEmpty() {
        generatorInput.setClassName("");

        RapidControllerException ex = assertThrows(RapidControllerException.class, () -> {
            codeGenController.generateFullApp(generatorInput);
        });

        assertEquals("Class name must not be null or empty", ex.getMessage());
    }
}
