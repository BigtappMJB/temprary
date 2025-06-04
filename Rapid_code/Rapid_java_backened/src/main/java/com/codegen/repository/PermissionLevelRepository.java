package com.codegen.repository;

import com.codegen.model.PermissionLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PermissionLevelRepository extends JpaRepository<PermissionLevel, Long> {

    Optional<PermissionLevel> findByLevel(String level);

    List<PermissionLevel> findByLevelIn(List<String> levels);
}
