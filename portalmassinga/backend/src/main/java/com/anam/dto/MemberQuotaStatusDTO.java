package com.anam.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
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
    /** Meses em falta no formato YYYY-MM */
    private List<String> mesesEmFalta = new ArrayList<>();
    /** Meses já pagos no formato YYYY-MM */
    private List<String> mesesPagos = new ArrayList<>();
}
