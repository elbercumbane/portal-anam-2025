package com.anam.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Resumo da situação financeira de um membro (cotas).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberQuotaStatusDTO {
    private UUID memberApplicationId;
    private String nome;
    private String email;
    private String celular;
    private String nuit;
    /** Situação: EM_DIA, COM_DIVIDAS */
    private String situacaoFinanceira;
    /** Número de meses em dívida */
    private int mesesEmDivida;
    /** Valor total em dívida (MZN) */
    private BigDecimal valorEmDivida;
    /** Último mês pago (ex: "2025-01") ou null */
    private String ultimoMesPago;
}
