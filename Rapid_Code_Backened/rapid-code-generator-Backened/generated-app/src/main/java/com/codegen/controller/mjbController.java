
package com.codegen.controller;

import com.codegen.model.mjb;
import com.codegen.service.mjbService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/mjb")
public class mjbController {

    private final mjbService mjbService;

    public mjbController(mjbService mjbService) {
        this.mjbService = mjbService;
    }

    @GetMapping("/all")
    public List<mjb> getAll() {
        return mjbService.getAllmjb();
    }

    @PostMapping("/create")
    public mjb create(@RequestBody mjb mjb) {
        return mjbService.save(mjb);
    }

    @GetMapping("/find/{id}")
    public Optional<mjb> getById(@PathVariable Long id) {
        return mjbService.findById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteById(@PathVariable Long id) {
        mjbService.deleteById(id);
    }

    @DeleteMapping("/deleteAll")
    public void deleteAll() {
        mjbService.deleteAll();
    }
}
