package com.codegen.service;

import com.codegen.model.dynamic_page_creation;
import java.util.Optional;
import java.util.List;
import org.springframework.stereotype.Service;
import com.codegen.repository.dynamic_page_creationRepository;

@Service
public class dynamic_page_creationService {

    private final dynamic_page_creationRepository dynamic_page_creationRepository;

    public dynamic_page_creationService(dynamic_page_creationRepository dynamic_page_creationRepository) {
        this.dynamic_page_creationRepository = dynamic_page_creationRepository;
    }

    public List<dynamic_page_creation> getAlldynamic_page_creation() {
        return dynamic_page_creationRepository.findAll();
    }

    public dynamic_page_creation save(dynamic_page_creation dynamic_page_creation) {
        return dynamic_page_creationRepository.save(dynamic_page_creation);
    }

    public void deleteById(Long id) {
        dynamic_page_creationRepository.deleteById(id);
    }

    public Optional<dynamic_page_creation> findById(Long id) {
        return dynamic_page_creationRepository.findById(id);
    }

    public void deleteAll() {
        dynamic_page_creationRepository.deleteAll();
    }
}
