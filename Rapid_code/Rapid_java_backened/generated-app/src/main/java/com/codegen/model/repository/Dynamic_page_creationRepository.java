

package com.codegen.model.repository;
import java.util.List;
import com.codegen.model.model.dynamic_page_creation;
    import com.codegen.model.model.Page_components;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface dynamic_page_creationRepository extends JpaRepository<dynamic_page_creation, Long> {
    List<dynamic_page_creation> findByPage_components(Page_components page_components);
}
