package pl.kijowski.przychodnialekarska.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class SlotDto {
    private LocalDateTime start;
    private LocalDateTime end;
}
