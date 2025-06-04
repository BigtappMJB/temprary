package com.codegen.service;

import com.codegen.model.Menu;
import com.codegen.repository.MenuRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class MenuService {

    private final MenuRepository menuRepository;

    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    public Optional<Menu> findByName(String name) {
        return menuRepository.findByName(name);
    }

    @Transactional
    public Menu getOrCreateMenu(String menuName, String createdBy) {
        return menuRepository.findByName(menuName)
                .orElseGet(() -> {
                    Menu menu = new Menu();
                    menu.setName(menuName);
                    menu.setCreatedBy(createdBy);
                    menu.setCreatedDate(LocalDateTime.now());
                    menu.setIsActive(true);
                    return menuRepository.save(menu);
                });
    }
}
