package com.codegen.service;

import com.codegen.model.employee;
import java.util.Optional;
import java.util.List;
import org.springframework.stereotype.Service;
import com.codegen.repository.employeeRepository;

@Service
public class employeeService {

    private final employeeRepository employeeRepository;

    public employeeService(employeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<employee> getAllemployee() {
        return employeeRepository.findAll();
    }

    public employee save(employee employee) {
        return employeeRepository.save(employee);
    }

    public void deleteById(Long id) {
        employeeRepository.deleteById(id);
    }

    public Optional<employee> findById(Long id) {
        return employeeRepository.findById(id);
    }

    public void deleteAll() {
        employeeRepository.deleteAll();
    }
}
