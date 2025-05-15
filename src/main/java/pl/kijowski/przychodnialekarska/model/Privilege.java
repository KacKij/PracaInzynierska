package pl.kijowski.przychodnialekarska.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.Collection;

@Entity
@Data
@Table(name = "privileges")
public class Privilege {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String name;

    @ManyToMany(mappedBy = "privileges")
    @JsonIgnore
    @ToString.Exclude
    private Collection<Role> roles;

    public Privilege(String privilegeName) {
        this.name = privilegeName;
    }

    public Privilege() {}
}
