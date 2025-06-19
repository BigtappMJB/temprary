
package com.codegen.model.controller;

import com.codegen.model.dynamic_page_creation;
import com.codegen.model.service.dynamic_page_creationService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/dynamic_page_creation")
public class dynamic_page_creationController {

    private final dynamic_page_creationService dynamic_page_creationService;

    public dynamic_page_creationController(dynamic_page_creationService dynamic_page_creationService) {
        this.dynamic_page_creationService = dynamic_page_creationService;
    }

@GetMapping("/hello")
public ResponseEntity<String> sayHello() {
    return ResponseEntity.ok("Hello, User!");
    }

    @GetMapping("/all")
    public List<dynamic_page_creation> getAll() {
        return dynamic_page_creationService.getAlldynamic_page_creation();
    }

    @PostMapping("/create")
    public dynamic_page_creation create(@RequestBody dynamic_page_creation dynamic_page_creation) {
        return dynamic_page_creationService.save(dynamic_page_creation);
    }

    @GetMapping("/find/{id}")
    public Optional<dynamic_page_creation> getById(@PathVariable Long id) {
        return dynamic_page_creationService.findById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteById(@PathVariable Long id) {
        dynamic_page_creationService.deleteById(id);
    }

    @DeleteMapping("/deleteAll")
    public void deleteAll() {
        dynamic_page_creationService.deleteAll();
    }
}
