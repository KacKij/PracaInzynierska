package pl.kijowski.przychodnialekarska;


import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pl.kijowski.przychodnialekarska.model.Privilege;
import pl.kijowski.przychodnialekarska.model.Role;
import pl.kijowski.przychodnialekarska.model.User;
import pl.kijowski.przychodnialekarska.privilege.PrivilegeRepository;
import pl.kijowski.przychodnialekarska.role.RoleRepository;
import pl.kijowski.przychodnialekarska.user.UserRepository;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

@Component
public class SetupDataLoader implements
        ApplicationListener<ContextRefreshedEvent> {

    boolean alreadySetup = false;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PrivilegeRepository privilegeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (alreadySetup)
            return;
        Privilege readPrivilege = createPrivilegeNotFound("READ_PRIVILEGE");
        Privilege writePrivilege = createPrivilegeNotFound("WRITE_PRIVILEGE");

        List<Privilege> adminPrivileges = Arrays.asList(readPrivilege, writePrivilege);
        createRoleIfNotFound("ROLE_ADMIN", adminPrivileges);
        createRoleIfNotFound("ROLE_USER", Arrays.asList(readPrivilege));
        createRoleIfNotFound("ROLE_DOCTOR", Arrays.asList(readPrivilege));
        createRoleIfNotFound("ROLE_SCHEDULER", adminPrivileges);

        Role adminRole = roleRepository.findByName("ROLE_ADMIN");
        User user = new User();
        user.setUsername("Test");
        user.setLastname("Test");
        user.setPassword(passwordEncoder.encode("testtest"));
        user.setEmail("test@test.com");
        user.setUsername("test");
        user.setEnabled(true);
        user.setRoles(Arrays.asList(adminRole));

        alreadySetup = true;
    }

    @Transactional
    Privilege createPrivilegeNotFound(String privilegeName) {

        Privilege privilege = privilegeRepository.findByName(privilegeName);
        if (privilege == null) {
            privilege = new Privilege(privilegeName);
            privilegeRepository.save(privilege);
        }
        return privilege;
    }

    @Transactional
    Role createRoleIfNotFound(String name, Collection<Privilege> privileges){

        Role role = roleRepository.findByName(name);

        if (role == null) {
            role = new Role(name);
            role.setPrivileges(privileges);
            roleRepository.save(role);
        }
        return role;
    }
}
