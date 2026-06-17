package com.anam.repository;

import com.anam.entity.Quota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface QuotaRepository extends JpaRepository<Quota, UUID> {

    /**
     * Buscar cotas de um membro
     */
    List<Quota> findByMembroId(UUID membroId);

    /**
     * Buscar cotas por status
     */
    List<Quota> findByMembroIdAndStatus(UUID membroId, String status);

    /**
     * Buscar cotas vencidas de um membro
     */
    @Query("SELECT q FROM Quota q WHERE q.membroId = :membroId AND q.status != 'Paga' AND q.dataVencimento < :hoje")
    List<Quota> findQuotasVencidas(@Param("membroId") UUID membroId, @Param("hoje") LocalDate hoje);

    /**
     * Buscar cotas que precisam de lembrete (5 dias antes do vencimento)
     */
    @Query("SELECT q FROM Quota q WHERE q.status = 'Pendente' AND q.lembreteEnviado = false AND q.dataVencimento BETWEEN :hoje AND :cincoDias")
    List<Quota> findQuotasParaLembrete(@Param("hoje") LocalDate hoje, @Param("cincoDias") LocalDate cincoDias);

    /**
     * Verificar se membro tem cotas em atraso
     */
    @Query("SELECT COUNT(q) > 0 FROM Quota q WHERE q.membroId = :membroId AND q.status != 'Paga' AND q.dataVencimento < :hoje")
    boolean hasQuotasVencidas(@Param("membroId") UUID membroId, @Param("hoje") LocalDate hoje);

    /**
     * Buscar última cota paga
     */
    @Query("SELECT q FROM Quota q WHERE q.membroId = :membroId AND q.status = 'Paga' ORDER BY q.dataPagamento DESC")
    List<Quota> findUltimaQuotaPaga(@Param("membroId") UUID membroId);
}
