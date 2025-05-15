# Dokumentacja Testów Aplikacji Przychodnia Lekarska

**Autor:** Kacper Kijowski

## Wprowadzenie

Dokumentacja przedstawia opis testów jednostkowych oraz integracyjnych zaimplementowanych w projekcie **Przychodnia Lekarska**. Testy zostały podzielone na testy backendu i testy frontendu.

---

## 1. Testy Backendu (Spring Boot)

Struktura plików testowych w katalogu `src/test`:

```
C:.
├───java
│   └───pl
│       └───kijowski
│           └───przychodnialekarska
│               BaseTest.java
│               PrzychodniaLekarskaApplicationTests.java
│           ├───dto
│           │   PatientInfoDtoTest.java
│           ├───patient
│           │   PatientRepositoryTest.java
│           └───util
│               PeselUtilTest.java
└───resources
    application.properties
```

### 1.1 PatientInfoDtoTest.java

Celem testów jest weryfikacja poprawnego maskowania numeru PESEL zależnie od uprawnień użytkownika.

#### TC001

| **ID**                  | TC001                                                           |
| ----------------------- | --------------------------------------------------------------- |
| **Tytuł**               | Non-admins see masked PESEL                                     |
| **Warunki początkowe**  | Obiekt `Patient` z numerem PESEL `12345678901`, `isAdmin=false` |
| **Kroki testowe**       | Utworzenie `PatientInfoDto`, wywołanie `getPesel()`             |
| **Oczekiwany rezultat** | Zwróceny PESEL `123456*8***`                                         |

#### TC002

| **ID**                  | TC002                                                          |
| ----------------------- | -------------------------------------------------------------- |
| **Tytuł**               | Admins see full unmasked PESEL                                 |
| **Warunki początkowe**  | Obiekt `Patient` z numerem PESEL `12345678901`, `isAdmin=true` |
| **Kroki testowe**       | Utworzenie `PatientInfoDto`, wywołanie `getPesel()`            |
| **Oczekiwany rezultat** | Zwróceny PESEL `12345678901`                                        |

#### TC003

| **ID**                  | TC003                                                     |
| ----------------------- | --------------------------------------------------------- |
| **Tytuł**               | Invalid-length PESEL returns all asterisks for non-admin  |
| **Warunki początkowe**  | Obiekt `Patient` z numerem PESEL `98765`, `isAdmin=false` |
| **Kroki testowe**       | Utworzenie `PatientInfoDto`, wywołanie `getPesel()`       |
| **Oczekiwany rezultat** | Zwróceny PESEL `***********`                                   |

#### TC004

| **ID**                  | TC004                                                    |
| ----------------------- | -------------------------------------------------------- |
| **Tytuł**               | Null PESEL returns all asterisks for non-admin           |
| **Warunki początkowe**  | Obiekt `Patient` z numerem PESEL `null`, `isAdmin=false` |
| **Kroki testowe**       | Utworzenie `PatientInfoDto`, wywołanie `getPesel()`      |
| **Oczekiwany rezultat** | Zwróceny PESEL `***********`                                  |

#### TC005

| **ID**                  | TC005                                                   |
| ----------------------- | ------------------------------------------------------- |
| **Tytuł**               | Null PESEL allowed for admin (remains null)             |
| **Warunki początkowe**  | Obiekt `Patient` z numerem PESEL `null`, `isAdmin=true` |
| **Kroki testowe**       | Utworzenie `PatientInfoDto`, wywołanie `getPesel()`     |
| **Oczekiwany rezultat** | Zwróceny PESEL `null`                                        |

### 1.2 PatientRepositoryTest.java

Testy integracyjne przy użyciu wbudowanej bazy H2, z `spring.jpa.hibernate.ddl-auto=create-drop`.

#### TC006

| **ID**                  | TC006                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Tytuł**               | Saving a patient with a new PESEL works                                                                               |
| **Warunki początkowe**  | Nowy obiekt `Patient` z unikalnym PESEL `90010112345`                                                                 |
| **Kroki testowe**       | 1. Zapis `save(patient)`  2. Sprawdzenie `existsByPesel`  3. Sprawdzenie `getPatientByPesel`                          |
| **Oczekiwany rezultat** | Pacjent ma nie-null ID, PESEL `90010112345`, `existsByPesel` zwraca true, `getPatientByPesel` zawiera poprawny obiekt |

#### TC007

| **ID**                  | TC007                                                                           |
| ----------------------- | ------------------------------------------------------------------------------- |
| **Tytuł**               | Saving a second patient with the same PESEL should fail                         |
| **Warunki początkowe**  | Pierwszy pacjent z PESEL `90010112345` zapisany, nowy pacjent z tym samym PESEL |
| **Kroki testowe**       | Próba `saveAndFlush(duplicatePatient)`                                          |
| **Oczekiwany rezultat** | ERROR `DataIntegrityViolationException`                                       |

### 1.3 PeselUtilTest.java

Testy parametryzowane dla metod `extractDateOfBirth` i `extractGender`.

#### TC008

| **ID**                  | TC008                                                               |
| ----------------------- | ------------------------------------------------------------------- |
| **Tytuł**               | Extract 1944-05-14, Male from PESEL                                 |
| **Warunki początkowe**  | PESEL `44051401458`                                                 |
| **Kroki testowe**       | Wywołanie `PeselUtil.extractDateOfBirth`, `PeselUtil.extractGender` |
| **Oczekiwany rezultat** | Data `1944-05-14`, płeć `Male`                                      |

#### TC009

| **ID**                  | TC009                                           |
| ----------------------- | ----------------------------------------------- |
| **Tytuł**               | Extract 1902-11-13, Female from PESEL           |
| **Warunki początkowe**  | PESEL `02111303628`                             |
| **Kroki testowe**       | Wywołanie `extractDateOfBirth`, `extractGender` |
| **Oczekiwany rezultat** | Data `1902-11-13`, płeć `Female`                |

#### TC010

| **ID**                  | TC010                                           |
| ----------------------- | ----------------------------------------------- |
| **Tytuł**               | Extract 2000-01-01, Female from PESEL           |
| **Warunki początkowe**  | PESEL `00210112346`                             |
| **Kroki testowe**       | Wywołanie `extractDateOfBirth`, `extractGender` |
| **Oczekiwany rezultat** | Data `2000-01-01`, płeć `Female`                |

#### TC011

| **ID**                  | TC011                                           |
| ----------------------- | ----------------------------------------------- |
| **Tytuł**               | Extract 2100-02-02, Male from PESEL             |
| **Warunki początkowe**  | PESEL `00420212357`                             |
| **Kroki testowe**       | Wywołanie `extractDateOfBirth`, `extractGender` |
| **Oczekiwany rezultat** | Data `2100-02-02`, płeć `Male`                  |

#### TC012

| **ID**                  | TC012                                           |
| ----------------------- | ----------------------------------------------- |
| **Tytuł**               | Extract 2012-08-01, Female from PESEL           |
| **Warunki początkowe**  | PESEL `12280123466`                             |
| **Kroki testowe**       | Wywołanie `extractDateOfBirth`, `extractGender` |
| **Oczekiwany rezultat** | Data `2012-08-01`, płeć `Female`                |

---

## 2. Testy Frontendu (React / TypeScript)

Testy napisane przy użyciu React Testing Library i Jest. Komponenty i hooki są mockowane.

### 2.1 DoctorTable.test.tsx

#### TC013

| **ID**                  | TC013                                                                        |
| ----------------------- | ---------------------------------------------------------------------------- |
| **Tytuł**               | renders doctor rows and opens detail modal with correct data                 |
| **Warunki początkowe**  | Mock `useDoctors` z `mockDoctors`                                            |
| **Kroki testowe**       | Render komponentu, kliknięcie na wiersz lekarza (`Alice Smith`)              |
| **Oczekiwany rezultat** | Widoczne nazwiska `Alice Smith`, `Bob Jones`; wywołanie `fetchDoctorInfo(1)` |

#### TC014

| **ID**                  | TC014                                                                     |
| ----------------------- | ------------------------------------------------------------------------- |
| **Tytuł**               | validate Register Doctor form: shows alert if password is missing         |
| **Warunki początkowe**  | Render `DoctorTable`, `window.alert` mokowane                             |
| **Kroki testowe**       | Kliknij `Register New Doctor`, potem `Save Doctor` bez wypełniania pól    |
| **Oczekiwany rezultat** | ERROR `window.alert('Please fill in all required fields correctly.')` |

### 2.2 PatientTable.test.tsx

#### TC015

| **ID**                  | TC015                                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tytuł**               | renders patient rows and opens detail modal with correct data                                                                                         |
| **Warunki początkowe**  | Mock `usePatients` z `mockPatients`                                                                                                                   |
| **Kroki testowe**       | Render komponentu, kliknięcie na wiersz (`Alice Smith`)                                                                                               |
| **Oczekiwany rezultat** | Widoczne `Alice Smith`, `Bob Jones`; wywołanie `fetchPatientInfo(1)`; modal z email `alice@example.com`, adres `Main St 10 / 5A`, miasto `Townsville` |

#### TC016

| **ID**                  | TC016                                                |
| ----------------------- | ---------------------------------------------------- |
| **Tytuł**               | Opens patient detail modal with correct info         |
| **Warunki początkowe**  | Mock `fetchPatientInfo` zwracające `mockPatientInfo` |
| **Kroki testowe**       | Kliknięcie na wiersz pacjenta                        |
| **Oczekiwany rezultat** | Modal wyświetla szczegóły pacjenta Alice             |

### 2.3 useAvailability.test.ts

#### TC017

| **ID**                  | TC017                                                                |
| ----------------------- | -------------------------------------------------------------------- |
| **Tytuł**               | has correct initial state                                            |
| **Warunki początkowe**  | Hook `useAvailability` z mockiem `fetchAvailableSlots`               |
| **Kroki testowe**       | Inicjalizacja hooka                                                  |
| **Oczekiwany rezultat** | `slots: []`, `loading: false`, `error: null`, `loadSlots` to funkcja, hook zainicjowany |

#### TC018

| **ID**                  | TC018                                                        |
| ----------------------- | ------------------------------------------------------------ |
| **Tytuł**               | loads slots successfully                                     |
| **Warunki początkowe**  | Mock `fetchAvailableSlots` zwracające `fakeSlots`            |
| **Kroki testowe**       | Wywołanie `loadSlots()`                                      |
| **Oczekiwany rezultat** | `loading: false`, `slots` zawiera `fakeSlots`                |

#### TC019

| **ID**                  | TC019                                                                 |
| ----------------------- | --------------------------------------------------------------------- |
| **Tytuł**               | handles API errors                                                    |
| **Warunki początkowe**  | Mock `fetchAvailableSlots` odrzuca Promise z błędem `No availability` |
| **Kroki testowe**       | Wywołanie `loadSlots()`                                               |
| **Oczekiwany rezultat** | `loading: false`, `slots: []`, `error: 'No availability'`             |

### 2.4 usePatients.test.ts

#### TC020

| **ID**                  | TC020                                                              |
| ----------------------- | ------------------------------------------------------------------ |
| **Tytuł**               | loads patients successfully                                        |
| **Warunki początkowe**  | Mock `fetchPatients` zwracające `fakePatients`                     |
| **Kroki testowe**       | Render hooka                                                       |
| **Oczekiwany rezultat** | `loading: false`, `patients` zawiera `fakePatients`, `error: null` |

#### TC021

| **ID**                  | TC021                                                        |
| ----------------------- | ------------------------------------------------------------ |
| **Tytuł**               | handles error from API                                       |
| **Warunki początkowe**  | Mock `fetchPatients` odrzuca Promise z błędem `Network fail` |
| **Kroki testowe**       | Render hooka                                                 |
| **Oczekiwany rezultat** | `loading: false`, `patients: []`, `error: 'Network fail'`    |

### 2.5 ProtectedRoute.test.tsx

#### TC022

| **ID**                  | TC022                                                      |
| ----------------------- | ---------------------------------------------------------- |
| **Tytuł**               | renders nothing while loading                              |
| **Warunki początkowe**  | Mock `useAuth` z `loading: true`, `isAuthenticated: false` |
| **Kroki testowe**       | Render `ProtectedRoute` z dzieckiem `Secret`               |
| **Oczekiwany rezultat** | Brak renderowanych elementów                               |

#### TC023

| **ID**                  | TC023                                                       |
| ----------------------- | ----------------------------------------------------------- |
| **Tytuł**               | redirects to /signin when not authenticated                 |
| **Warunki początkowe**  | Mock `useAuth` z `loading: false`, `isAuthenticated: false` |
| **Kroki testowe**       | Render w `MemoryRouter` na `/protected`                     |
| **Oczekiwany rezultat** | Przekierowanie na `/signin`, widoczny tekst `SignIn Page`   |

#### TC024

| **ID**                  | TC024                                                      |
| ----------------------- | ---------------------------------------------------------- |
| **Tytuł**               | renders children when authenticated                        |
| **Warunki początkowe**  | Mock `useAuth` z `loading: false`, `isAuthenticated: true` |
| **Kroki testowe**       | Render `ProtectedRoute` z dzieckiem `Secret`               |
| **Oczekiwany rezultat** | Widoczny tekst `Secret`                                    |

---

## Podsumowanie

Przedstawione testy pokrywają kluczowe aspekty funkcjonalności aplikacji, zarówno po stronie backendu, jak i frontendu. Każdy przypadek testowy został szczegółowo opisany w osobnej tabeli, zgodnie z wytycznymi.
