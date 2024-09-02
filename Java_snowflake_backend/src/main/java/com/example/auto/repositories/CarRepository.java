package com.example.auto.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.auto.entity.Car;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    public List<Car> getOneByNumberPlate(String numberPlate);
}
