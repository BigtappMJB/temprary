package com.codegen.service;

import com.codegen.model.PermissionLevel;
import com.codegen.repository.PermissionLevelRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PermissionLevelService {

    private final PermissionLevelRepository permissionLevelRepository;

    public PermissionLevelService(PermissionLevelRepository permissionLevelRepository) {
        this.permissionLevelRepository = permissionLevelRepository;
    }

    public Map<String, Long> getPermissionLevelIdsByNames(List<String> levelNames) {
        List<PermissionLevel> levels = permissionLevelRepository.findByLevelIn(levelNames);
        // Map level name to ID
        return levels.stream()
                .collect(Collectors.toMap(PermissionLevel::getLevel, PermissionLevel::getId));
    }

    // Optional: create missing permission levels if you want
    public PermissionLevel createPermissionLevel(String level, String createdBy) {
        PermissionLevel permissionLevel = new PermissionLevel();
        permissionLevel.setLevel(level);
        permissionLevel.setCreatedBy(createdBy);
        permissionLevel.setCreatedDate(LocalDateTime.now());
        permissionLevel.setIsActive(true);
        return permissionLevelRepository.save(permissionLevel);
    }
}
