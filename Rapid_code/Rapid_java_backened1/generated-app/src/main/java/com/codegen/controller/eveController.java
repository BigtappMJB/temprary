
package com.codegen.controller;

import com.codegen.model.eve;
import com.codegen.service.eveService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/eve")
public class eveController {

    private final eveService eveService;

    public eveController(eveService eveService) {
        this.eveService = eveService;
    }

    @GetMapping("/all")
    public List<eve> getAll() {
        return eveService.getAlleve();
    }

    @PostMapping("/create")
    public eve create(@RequestBody eve eve) {
        return eveService.save(eve);
    }

    @GetMapping("/find/{id}")
    public Optional<eve> getById(@PathVariable Long id) {
        return eveService.findById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteById(@PathVariable Long id) {
        eveService.deleteById(id);
    }

    @DeleteMapping("/deleteAll")
    public void deleteAll() {
        eveService.deleteAll();
    }
}
