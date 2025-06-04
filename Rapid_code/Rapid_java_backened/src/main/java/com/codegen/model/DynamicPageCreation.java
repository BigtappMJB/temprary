package com.codegen.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "dynamic_page_creation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DynamicPageCreation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dynamic_page_id")
    private Integer dynamicPageId;

    @Column(name = "tableName", nullable = false, unique = true)
    private String tableName;

    @Column(name = "pageName", nullable = false)
    private String pageName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "routePath", nullable = false, unique = true)
    private String routePath;
}
