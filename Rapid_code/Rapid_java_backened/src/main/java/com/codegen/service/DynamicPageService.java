package com.codegen.service;

import com.codegen.model.*;
import com.codegen.repository.*;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DynamicPageService {

    private static final Logger logger = LoggerFactory.getLogger(DynamicPageService.class);

    private final MenuRepository menuRepository;
    private final SubMenuRepository subMenuRepository;
    private final PermissionLevelRepository permissionLevelRepository;
    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;

    public DynamicPageService(MenuRepository menuRepository,
                              SubMenuRepository subMenuRepository,
                              PermissionLevelRepository permissionLevelRepository,
                              RoleRepository roleRepository,
                              RolePermissionRepository rolePermissionRepository) {
        this.menuRepository = menuRepository;
        this.subMenuRepository = subMenuRepository;
        this.permissionLevelRepository = permissionLevelRepository;
        this.roleRepository = roleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
    }

    /**
     * Get existing menu by name or create new one.
     */
    @Transactional
    public Long getOrCreateMenu(String menuName, String createdBy) {
        logger.info("Fetching or creating Menu with name '{}'", menuName);
        Optional<Menu> existingMenu = menuRepository.findByName(menuName);

        if (existingMenu.isPresent()) {
            logger.info("Menu '{}' found with id {}", menuName, existingMenu.get().getId());
            return existingMenu.get().getId();
        }

        Menu menu = new Menu();
        menu.setName(menuName);
        menu.setCreatedBy(createdBy);
        menu.setCreatedDate(LocalDateTime.now());
        menu.setIsActive(true);
        Menu savedMenu = menuRepository.save(menu);
        logger.info("Created new Menu '{}' with id {}", menuName, savedMenu.getId());
        return savedMenu.getId();
    }

    /**
     * Get existing submenu by menuId and submenu name, or create/update it.
     */
    @Transactional
    public Long createOrUpdateSubMenu(Long menuId, String subMenuName, String description, String routePath, String createdBy) {
        logger.info("Creating or updating SubMenu '{}' under Menu id {}", subMenuName, menuId);

        Optional<SubMenu> existingSubMenu = subMenuRepository.findByMenuIdAndName(menuId, subMenuName);

        SubMenu subMenu;
        if (existingSubMenu.isPresent()) {
            subMenu = existingSubMenu.get();
            subMenu.setDescription(description);
            subMenu.setRoute(routePath);
            subMenu.setUpdatedBy(createdBy);
            subMenu.setUpdatedDate(LocalDateTime.now());
            logger.info("Updating existing SubMenu with id {}", subMenu.getId());
        } else {
            subMenu = new SubMenu();
            Menu menu = new Menu();
            menu.setId(menuId);
            subMenu.setMenu(menu);
            subMenu.setName(subMenuName);
            subMenu.setDescription(description);
            subMenu.setRoute(routePath);
            subMenu.setCreatedBy(createdBy);
            subMenu.setCreatedDate(LocalDateTime.now());
            subMenu.setIsActive(true);
            logger.info("Creating new SubMenu '{}'", subMenuName);
        }

        SubMenu savedSubMenu = subMenuRepository.save(subMenu);
        logger.info("SubMenu saved with id {}", savedSubMenu.getId());
        return savedSubMenu.getId();
    }

    /**
     * Fetch permission level IDs mapped by level name.
     */
    public Map<String, Long> getPermissionLevelIdsByNames(List<String> permissionLevelNames) {
        logger.info("Fetching PermissionLevel IDs for names {}", permissionLevelNames);
        List<PermissionLevel> levels = permissionLevelRepository.findByLevelIn(permissionLevelNames);
        return levels.stream()
                .collect(Collectors.toMap(PermissionLevel::getLevel, PermissionLevel::getId));
    }

    /**
     * Fetch all roles.
     */
    public List<Role> getAllRoles() {
        logger.info("Fetching all Roles");
        return roleRepository.findAll();
    }

    /**
     * Create or update RolePermission for given role, menu, submenu, and permission level.
     */
    @Transactional
    public void createOrUpdateRolePermission(Long roleId, Long menuId, Long subMenuId, Long permissionLevelId, String createdBy) {
        logger.info("Creating/updating RolePermission for roleId={}, menuId={}, subMenuId={}, permissionLevelId={}",
                roleId, menuId, subMenuId, permissionLevelId);

        Optional<RolePermission> existingRp = rolePermissionRepository.findByRoleIdAndMenuIdAndSubMenuIdAndPermissionLevelId(
                roleId, menuId, subMenuId, permissionLevelId);

        RolePermission rolePermission;
        if (existingRp.isPresent()) {
            rolePermission = existingRp.get();
            rolePermission.setUpdatedBy(createdBy);
            rolePermission.setUpdatedDate(LocalDateTime.now());
            rolePermission.setIsActive(true);
            logger.info("Updating existing RolePermission id {}", rolePermission.getId());
        } else {
            rolePermission = new RolePermission();
            Role role = new Role();
            role.setId(roleId);
            Menu menu = new Menu();
            menu.setId(menuId);
            SubMenu subMenu = new SubMenu();
            subMenu.setId(subMenuId);
            PermissionLevel permissionLevel = new PermissionLevel();
            permissionLevel.setId(permissionLevelId);

            rolePermission.setRole(role);
            rolePermission.setMenu(menu);
            rolePermission.setSubMenu(subMenu);
            rolePermission.setPermissionLevel(permissionLevel);
            rolePermission.setCreatedBy(createdBy);
            rolePermission.setCreatedDate(LocalDateTime.now());
            rolePermission.setIsActive(true);
            logger.info("Creating new RolePermission");
        }

        rolePermissionRepository.save(rolePermission);
    }
}
