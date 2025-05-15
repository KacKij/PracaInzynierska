package pl.kijowski.przychodnialekarska;


import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(locations="classpath:application.properties")
public abstract class BaseTest {

}
