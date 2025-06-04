package com.codegen.repository;

import com.codegen.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    List<Role> findByIsActive(String isActive); // Because isActive stored as varchar, e.g. "Y"/"N" or "true"/"false"

    List<Role> findAll(); // default method but we can explicitly define if needed

    Optional<Role> findByName(String name);
}
