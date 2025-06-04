package com.codegen.service;

import com.codegen.model.*;
import com.codegen.repository.RolePermissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class RolePermissionService {

    private final RolePermissionRepository rolePermissionRepository;

    public RolePermissionService(RolePermissionRepository rolePermissionRepository) {
        this.rolePermissionRepository = rolePermissionRepository;
    }

    @Transactional
    public RolePermission createOrUpdateRolePermission(Role role, Menu menu, SubMenu subMenu, PermissionLevel permissionLevel, String user) {
        Optional<RolePermission> existing = rolePermissionRepository.findByRoleIdAndMenuIdAndSubMenuIdAndPermissionLevelId(
                role.getId(), menu.getId(), subMenu.getId(), permissionLevel.getId());

        if (existing.isPresent()) {
            RolePermission rolePerm = existing.get();
            rolePerm.setUpdatedBy(user);
            rolePerm.setUpdatedDate(LocalDateTime.now());
            rolePerm.setIsActive(true);
            return rolePermissionRepository.save(rolePerm);
        } else {
            RolePermission rolePerm = new RolePermission();
            rolePerm.setRole(role);
            rolePerm.setMenu(menu);
            rolePerm.setSubMenu(subMenu);
            rolePerm.setPermissionLevel(permissionLevel);
            rolePerm.setCreatedBy(user);
            rolePerm.setCreatedDate(LocalDateTime.now());
            rolePerm.setIsActive(true);
            return rolePermissionRepository.save(rolePerm);
        }
    }
}
