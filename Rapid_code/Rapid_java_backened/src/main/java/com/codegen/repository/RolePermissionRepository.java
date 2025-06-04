package com.codegen.repository;

import com.codegen.model.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {

    Optional<RolePermission> findByRoleIdAndMenuIdAndSubMenuIdAndPermissionLevelId(
        Long roleId, Long menuId, Long subMenuId, Long permissionLevelId
    );
}
