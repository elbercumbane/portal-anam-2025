package com.anam.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupporterRegistrationPatchDTO {
    private Boolean fundsConfirmed;
    private Boolean accountCreated;
}
