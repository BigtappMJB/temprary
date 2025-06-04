
package com.codegen.model;


import jakarta.persistence.*;
import java.io.Serializable;

        // No need for import, as String is already available
        // No need for import, as String is already available

@Entity
@Table(name = "employee")
public class employee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "updated_at")
    private String updated_at;
    @Column(name = "employee_id")
    private String employee_id;


    public employee() {
    }

    public employee(
        String updated_at, 
        String employee_id
    ) {
        this.updated_at = updated_at;
        this.employee_id = employee_id;
    }

    public String getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(String updated_at) {
        this.updated_at = updated_at;
    }
    public String getEmployee_id() {
        return employee_id;
    }

    public void setEmployee_id(String employee_id) {
        this.employee_id = employee_id;
    }

    @Override
    public String toString() {
        return "employee{" +
        "updated_at=" + updated_at + ", "  +
        "employee_id=" + employee_id + ""  +
        '}';
    }
}
