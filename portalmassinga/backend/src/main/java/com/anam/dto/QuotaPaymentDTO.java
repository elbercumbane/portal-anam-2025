package com.anam.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuotaPaymentDTO {
    private UUID id;
    private UUID memberApplicationId;
    private int year;
    private int month;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private String paymentMethod;
    private String reference;
    private String status;
}
