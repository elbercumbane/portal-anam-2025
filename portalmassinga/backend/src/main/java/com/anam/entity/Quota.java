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
 * Entidade para gerenciar cotas/quotas dos membros
 */
@Entity
@Table(name = "quotas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quota {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "membro_id", nullable = false)
    private UUID membroId;

    @Column(name = "mes_referencia", nullable = false)
    private Integer mesReferencia; // 1-12 (Janeiro a Dezembro)

    @Column(name = "ano_referencia", nullable = false)
    private Integer anoReferencia;

    @Column(name = "valor", nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(name = "data_vencimento", nullable = false)
    private LocalDate dataVencimento;

    @Column(name = "data_pagamento")
    private LocalDate dataPagamento;

    @Column(name = "status", length = 50, nullable = false)
    private String status; // Pendente, Paga, Vencida

    @Column(name = "metodo_pagamento", length = 50)
    private String metodoPagamento; // M-Pesa, Emola, Visa, etc.

    @Column(name = "comprovante", columnDefinition = "TEXT")
    private String comprovante; // URL ou base64 do comprovante

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "lembrete_enviado", nullable = false)
    private Boolean lembreteEnviado = false;

    @Column(name = "data_lembrete")
    private LocalDateTime dataLembrete;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = "Pendente";
        }
        if (lembreteEnviado == null) {
            lembreteEnviado = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Verifica se a cota está vencida
     */
    public boolean isVencida() {
        return LocalDate.now().isAfter(dataVencimento) && !status.equals("Paga");
    }

    /**
     * Verifica se está próximo do vencimento (5 dias antes)
     */
    public boolean isProximoVencimento() {
        LocalDate hoje = LocalDate.now();
        LocalDate cincoDiasAntes = dataVencimento.minusDays(5);
        return hoje.isEqual(cincoDiasAntes) || 
               (hoje.isAfter(cincoDiasAntes) && hoje.isBefore(dataVencimento));
    }
}
