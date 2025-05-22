package com.codegen.service;

import com.codegen.model.eve;
import java.util.Optional;
import java.util.List;
import org.springframework.stereotype.Service;
import com.codegen.repository.eveRepository;

@Service
public class eveService {

    private final eveRepository eveRepository;

    public eveService(eveRepository eveRepository) {
        this.eveRepository = eveRepository;
    }

    public List<eve> getAlleve() {
        return eveRepository.findAll();
    }

    public eve save(eve eve) {
        return eveRepository.save(eve);
    }

    public void deleteById(Long id) {
        eveRepository.deleteById(id);
    }

    public Optional<eve> findById(Long id) {
        return eveRepository.findById(id);
    }

    public void deleteAll() {
        eveRepository.deleteAll();
    }
}
