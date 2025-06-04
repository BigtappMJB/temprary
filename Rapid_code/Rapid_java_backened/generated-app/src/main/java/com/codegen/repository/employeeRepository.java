

package com.codegen.repository;

import com.codegen.model.employee;

import org.springframework.data.jpa.repository.JpaRepository;

public interface employeeRepository extends JpaRepository <employee, Long>{

};
