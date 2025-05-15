package pl.kijowski.przychodnialekarska.util;

import java.time.LocalDate;

public class PeselUtil {

    public static LocalDate extractDateOfBirth(String pesel) {
        if (pesel == null || pesel.length() < 11) return null;

        int year = Integer.parseInt(pesel.substring(0, 2));
        int month = Integer.parseInt(pesel.substring(2, 4));
        int day = Integer.parseInt(pesel.substring(4, 6));

        int century = 1900;
        if (month >= 20 && month < 40) {
            century = 2000;
            month -= 20;
        } else if (month >= 40 && month < 60) {
            century = 2100;
            month -= 40;
        }

        return LocalDate.of(century + year, month, day);
    }

    public static String extractGender(String pesel) {
        if (pesel == null || pesel.length() < 11) return "Unknown";

        int genderDigit = Character.getNumericValue(pesel.charAt(9));
        return genderDigit % 2 == 0 ? "Female" : "Male";
    }
}