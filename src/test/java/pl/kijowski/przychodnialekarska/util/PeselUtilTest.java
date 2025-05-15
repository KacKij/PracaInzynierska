package pl.kijowski.przychodnialekarska.util;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import java.util.stream.Stream;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

class PeselUtilTest {

    static Stream<Arguments> providePeselData() {
        return Stream.of(
                // 1944-05-14, Male
                Arguments.of("44051401458", LocalDate.of(1944, 5, 14), "Male"),
                // 1902-11-13, Female
                Arguments.of("02111303628", LocalDate.of(1902, 11, 13), "Female"),
                // 2000-01-01, Female
                Arguments.of("00210112346", LocalDate.of(2000, 1, 1), "Female"),
                // 2100-02-02, Male
                Arguments.of("00420212357", LocalDate.of(2100, 2, 2), "Male"),
                // 2012-08-01, Female
                Arguments.of("12280123466", LocalDate.of(2012, 8, 1), "Female")
        );
    }

    @ParameterizedTest
    @MethodSource("providePeselData")
    void testExtractDateAndGender(String pesel, LocalDate expectedDate, String expectedGender) {
        // Date extraction
        LocalDate actualDate = PeselUtil.extractDateOfBirth(pesel);
        assertEquals(expectedDate, actualDate,
                () -> "extractDateOfBirth(" + pesel + ")");

        // Gender extraction
        String actualGender = PeselUtil.extractGender(pesel);
        assertEquals(expectedGender, actualGender,
                () -> "extractGender(" + pesel + ")");
    }
}