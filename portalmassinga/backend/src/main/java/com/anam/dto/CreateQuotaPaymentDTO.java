package com.anam.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class CreateQuotaPaymentDTO {
    private UUID memberApplicationId;
    private int year;
    private List<Integer> months;
    private LocalDate paymentDate;
    private String paymentMethod;
    private String reference;
}
