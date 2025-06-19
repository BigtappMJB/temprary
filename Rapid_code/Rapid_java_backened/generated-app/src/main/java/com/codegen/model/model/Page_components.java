
package com.codegen.model.model;

import jakarta.persistence.*;
import java.io.Serializable;


@Entity
@Table(name = "page_components")
public class Page_components implements Serializable {

private static final long serialVersionUID = 1L;

    @Column(name = "COMPONENT_CODE")
    private String COMPONENT_CODE;
    @Column(name = "file_path")
    private String file_path;
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long ID;
    @Column(name = "MODULE_NAME")
    private String MODULE_NAME;
    @Column(name = "PAGE_NAME")
    private String PAGE_NAME;
    @Column(name = "SUB_MENU_ID")
    private Long SUB_MENU_ID;


public Page_components() {
}

public Page_components(
        String COMPONENT_CODE, 
        String file_path, 
        Long ID, 
        String MODULE_NAME, 
        String PAGE_NAME, 
        Long SUB_MENU_ID
) {
    this.COMPONENT_CODE = COMPONENT_CODE;
    this.file_path = file_path;
    this.ID = ID;
    this.MODULE_NAME = MODULE_NAME;
    this.PAGE_NAME = PAGE_NAME;
    this.SUB_MENU_ID = SUB_MENU_ID;
}

    public String getCOMPONENT_CODE() {
    return COMPONENT_CODE;
    }

    public void setCOMPONENT_CODE(String COMPONENT_CODE) {
    this.COMPONENT_CODE = COMPONENT_CODE;
    }
    public String getFile_path() {
    return file_path;
    }

    public void setFile_path(String file_path) {
    this.file_path = file_path;
    }
    public Long getID() {
    return ID;
    }

    public void setID(Long ID) {
    this.ID = ID;
    }
    public String getMODULE_NAME() {
    return MODULE_NAME;
    }

    public void setMODULE_NAME(String MODULE_NAME) {
    this.MODULE_NAME = MODULE_NAME;
    }
    public String getPAGE_NAME() {
    return PAGE_NAME;
    }

    public void setPAGE_NAME(String PAGE_NAME) {
    this.PAGE_NAME = PAGE_NAME;
    }
    public Long getSUB_MENU_ID() {
    return SUB_MENU_ID;
    }

    public void setSUB_MENU_ID(Long SUB_MENU_ID) {
    this.SUB_MENU_ID = SUB_MENU_ID;
    }

@Override
public String toString() {
StringBuilder sb = new StringBuilder("Page_components[");
    sb.append("COMPONENT_CODE=").append(COMPONENT_CODE).append(", ");
    sb.append("file_path=").append(file_path).append(", ");
    sb.append("ID=").append(ID).append(", ");
    sb.append("MODULE_NAME=").append(MODULE_NAME).append(", ");
    sb.append("PAGE_NAME=").append(PAGE_NAME).append(", ");
    sb.append("SUB_MENU_ID=").append(SUB_MENU_ID).append(", ");
    if (sb.length() > 16) {
    sb.setLength(sb.length() - 2);
    }
sb.append("]");
return sb.toString();



}
}
