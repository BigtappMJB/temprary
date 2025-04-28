package com.codegen.service;

import com.codegen.model.mjb;
import java.util.Optional;
import java.util.List;
import org.springframework.stereotype.Service;
import com.codegen.repository.mjbRepository;

@Service
public class mjbService {

    private final mjbRepository mjbRepository;

    public mjbService(mjbRepository mjbRepository) {
        this.mjbRepository = mjbRepository;
    }

    public List<mjb> getAllmjb() {
        return mjbRepository.findAll();
    }

    public mjb save(mjb mjb) {
        return mjbRepository.save(mjb);
    }

    public void deleteById(Long id) {
        mjbRepository.deleteById(id);
    }

    public Optional<mjb> findById(Long id) {
        return mjbRepository.findById(id);
    }

    public void deleteAll() {
        mjbRepository.deleteAll();
    }
}
