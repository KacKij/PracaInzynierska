package pl.kijowski.przychodnialekarska.model;


import jakarta.persistence.*;
import lombok.Data;

import java.util.Collection;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private boolean enabled;
    private boolean tokenExpired;
    private String occupation;

    @ManyToOne
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;

    @Column(name="phone_number")
    private String phoneNumber;

    @Column(name="phone_number_ext")
    private String phoneNumberExt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(
                    name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(
                    name = "role_id", referencedColumnName = "id"))
    private Collection<Role> roles;

    public User() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getPhoneNumber() {return phoneNumberExt + phoneNumber;}

    public void setPhoneNumber(String phoneNumber, String phoneNumberExt) {
        this.phoneNumber = phoneNumber;
        if (phoneNumberExt != null) {
            this.phoneNumberExt = "+48";
        } else {this.phoneNumberExt = phoneNumberExt;}
    }

}
