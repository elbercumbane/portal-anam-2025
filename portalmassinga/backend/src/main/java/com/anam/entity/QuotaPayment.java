package com.anam.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Registo de pagamento de cota mensal de um membro.
 * Cada registo representa o pagamento de um ou mais meses.
 */
@Entity
@Table(name = "quota_payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuotaPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "member_application_id", nullable = false)
    private UUID memberApplicationId;

    /** Ano da cota (ex: 2025) */
    @Column(name = "year", nullable = false)
    private Integer year;

    /** Mês da cota (1-12). Se pagamento anual, pode ter vários registos ou um com valor total. */
    @Column(name = "month", nullable = false)
    private Integer month;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount = BigDecimal.ZERO;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod; // M-Pesa, Emola, Transferência, Dinheiro, Visa

    @Column(name = "reference", length = 100)
    private String reference;

    @Column(name = "status", length = 20)
    private String status = "Paid"; // Paid, Pending

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
