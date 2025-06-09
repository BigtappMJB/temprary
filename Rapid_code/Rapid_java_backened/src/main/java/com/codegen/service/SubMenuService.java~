package com.codegen.service;

import com.codegen.model.Menu;
import com.codegen.model.SubMenu;
import com.codegen.repository.SubMenuRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SubMenuService {

    private final SubMenuRepository subMenuRepository;

    public SubMenuService(SubMenuRepository subMenuRepository) {
        this.subMenuRepository = subMenuRepository;
    }

    // Fetch a SubMenu by menuId and name
    public Optional<SubMenu> findByMenuIdAndName(Long menuId, String name) {
        return subMenuRepository.findByMenuIdAndName(menuId, name);
    }

    // Create or update the SubMenu
    @Transactional
    public SubMenu createOrUpdateSubMenu(Long menuId, String name, String route, String createdBy) {
        Optional<SubMenu> existingSubMenu = findByMenuIdAndName(menuId, name);

        return existingSubMenu.orElseGet(() -> {
            SubMenu subMenu = new SubMenu();
            subMenu.setId(menuId);
            subMenu.setName(name);
            subMenu.setRoute(route);
            subMenu.setCreatedBy(createdBy);
            subMenu.setCreatedDate(LocalDateTime.now());
            subMenu.setIsActive(true);
            return subMenuRepository.save(subMenu);
        });
    }
}
