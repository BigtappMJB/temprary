package com.codegen.repository;

import com.codegen.model.SubMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SubMenuRepository extends JpaRepository<SubMenu, Long> {
    Optional<SubMenu> findByMenuIdAndName(Long menuId, String name);
}
