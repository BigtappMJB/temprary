
package com.codegen.model;


import jakarta.persistence.*;
import java.io.Serializable;

        // No need for import, as String is already available
        // No need for import, as String is already available

@Entity
@Table(name = "eve")
public class eve implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wrvwdv")
    private String wrvwdv;
    @Column(name = "dv")
    private String dv;


    public eve() {
    }

    public eve(
        String wrvwdv, 
        String dv
    ) {
        this.wrvwdv = wrvwdv;
        this.dv = dv;
    }

    public String getWrvwdv() {
        return wrvwdv;
    }

    public void setWrvwdv(String wrvwdv) {
        this.wrvwdv = wrvwdv;
    }
    public String getDv() {
        return dv;
    }

    public void setDv(String dv) {
        this.dv = dv;
    }

    @Override
    public String toString() {
        return "eve{" +
        "wrvwdv=" + wrvwdv + ", "  +
        "dv=" + dv + ""  +
        '}';
    }
}
