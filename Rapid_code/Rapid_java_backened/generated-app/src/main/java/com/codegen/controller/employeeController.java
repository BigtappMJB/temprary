
package com.codegen.controller;

import com.codegen.model.employee;
import com.codegen.service.employeeService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employee")
public class employeeController {

    private final employeeService employeeService;

    public employeeController(employeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/all")
    public List<employee> getAll() {
        return employeeService.getAllemployee();
    }

    @PostMapping("/create")
    public employee create(@RequestBody employee employee) {
        return employeeService.save(employee);
    }

    @GetMapping("/find/{id}")
    public Optional<employee> getById(@PathVariable Long id) {
        return employeeService.findById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteById(@PathVariable Long id) {
        employeeService.deleteById(id);
    }

    @DeleteMapping("/deleteAll")
    public void deleteAll() {
        employeeService.deleteAll();
    }
}
