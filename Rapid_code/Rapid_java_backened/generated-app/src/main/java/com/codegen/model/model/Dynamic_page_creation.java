
package com.codegen.model;

import jakarta.persistence.*;
import java.io.Serializable;

    import com.codegen.model.Page_components;

@Entity
@Table(name = "dynamic_page_creation")
public class dynamic_page_creation implements Serializable {

private static final long serialVersionUID = 1L;

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "page_name")
    private String page_name;

        @ManyToOne
        @JoinColumn(name = "page_components_id")
        private Page_components page_components;

public dynamic_page_creation() {
}

public dynamic_page_creation(
        Long id, 
        String page_name, 
            Page_components page_components
) {
    this.id = id;
    this.page_name = page_name;
        this.page_components = page_components;
}

    public Long getId() {
    return id;
    }

    public void setId(Long id) {
    this.id = id;
    }
    public String getPage_name() {
    return page_name;
    }

    public void setPage_name(String page_name) {
    this.page_name = page_name;
    }

        public Page_components getPage_components() {
        return page_components;
        }

        public void setPage_components(Page_components page_components) {
        this.page_components = page_components;
        }
@Override
public String toString() {
StringBuilder sb = new StringBuilder("dynamic_page_creation[");
    sb.append("id=").append(id).append(", ");
    sb.append("page_name=").append(page_name).append(", ");
        sb.append("page_components=").append(page_components);
sb.append("]");
return sb.toString();



}
}
