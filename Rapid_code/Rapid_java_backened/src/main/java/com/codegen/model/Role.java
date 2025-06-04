package com.codegen.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_date")
    private String createdDate; // Stored as varchar(255) in DB

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "updated_date")
    private String updatedDate; // Stored as varchar(255) in DB

    @Column(name = "is_active")
    private String isActive; // Stored as varchar(255) in DB

    @Column(name = "deleted_by")
    private String deletedBy;

    @Column(name = "deleted_date")
    private String deletedDate; // Stored as varchar(255) in DB
}
