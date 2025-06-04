package com.codegen.service;

import com.codegen.model.Role;
import com.codegen.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    // Optional - get list of role IDs only
    public List<Long> getAllRoleIds() {
        return roleRepository.findAll()
                .stream()
                .map(Role::getId)
                .toList();
    }

    // Optional - fetch by role name
    public Role findByName(String name) {
        return roleRepository.findByName(name).orElse(null);
    }
}
