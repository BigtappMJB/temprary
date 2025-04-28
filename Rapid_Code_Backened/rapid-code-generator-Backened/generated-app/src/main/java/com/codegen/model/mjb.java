
package com.codegen.model;


import jakarta.persistence.*;
import java.io.Serializable;


import java.time.LocalDateTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "mjb")
public class mjb implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "name")
    private String name;
    @Column(name = "price")
    private Double price;
    @Column(name = "description")
    private String description;
    @Column(name = "createdDate")
    private LocalDateTime createdDate;
    @Column(name = "egge")
    private LocalDateTime egge;
    @Column(name = "categoryId")
    private Long categoryId;
    @Column(name = "email")
    private String email;


    public mjb() {
    }

    public mjb(
        Long id, 
        String name, 
        Double price, 
        String description, 
        LocalDateTime createdDate, 
        LocalDateTime egge, 
        Long categoryId, 
        String email
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.createdDate = createdDate;
        this.egge = egge;
        this.categoryId = categoryId;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
    public LocalDateTime getEgge() {
        return egge;
    }

    public void setEgge(LocalDateTime egge) {
        this.egge = egge;
    }
    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "mjb{" +
        "id=" + id + ", "  +
        "name=" + name + ", "  +
        "price=" + price + ", "  +
        "description=" + description + ", "  +
        "createdDate=" + createdDate + ", "  +
        "egge=" + egge + ", "  +
        "categoryId=" + categoryId + ", "  +
        "email=" + email + ""  +
        '}';
    }
}
