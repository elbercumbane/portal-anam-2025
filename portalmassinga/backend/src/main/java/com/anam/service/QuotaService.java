package com.anam.service;

import com.anam.entity.Membro;
import com.anam.entity.Quota;
import com.anam.repository.MembroRepository;
import com.anam.repository.QuotaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Serviço para gerenciamento de cotas
 */
@Service
public class QuotaService {

    private static final Logger logger = LoggerFactory.getLogger(QuotaService.class);

    @Autowired
    private QuotaRepository quotaRepository;

    @Autowired
    private MembroRepository membroRepository;

    @Autowired
    private SmsService smsService;

    @Value("${quota.valor.padrao:500.00}")
    private BigDecimal valorPadraoCota;

    /**
     * Verifica se um membro tem acesso (sem cotas vencidas)
     */
    public boolean membroTemAcesso(UUID membroId) {
        LocalDate hoje = LocalDate.now();
        return !quotaRepository.hasQuotasVencidas(membroId, hoje);
    }

    /**
     * Busca cotas vencidas de um membro
     */
    public List<Quota> getQuotasVencidas(UUID membroId) {
        LocalDate hoje = LocalDate.now();
        return quotaRepository.findQuotasVencidas(membroId, hoje);
    }

    /**
     * Cria uma nova cota para um membro
     */
    @Transactional
    public Quota criarQuota(UUID membroId, Integer mes, Integer ano, BigDecimal valor, LocalDate dataVencimento) {
        Quota quota = new Quota();
        quota.setMembroId(membroId);
        quota.setMesReferencia(mes);
        quota.setAnoReferencia(ano);
        quota.setValor(valor != null ? valor : valorPadraoCota);
        quota.setDataVencimento(dataVencimento);
        quota.setStatus("Pendente");
        quota.setLembreteEnviado(false);
        
        return quotaRepository.save(quota);
    }

    /**
     * Marca uma cota como paga
     */
    @Transactional
    public Quota marcarComoPaga(UUID quotaId, LocalDate dataPagamento, String metodoPagamento, String comprovante) {
        Optional<Quota> quotaOpt = quotaRepository.findById(quotaId);
        if (quotaOpt.isPresent()) {
            Quota quota = quotaOpt.get();
            quota.setStatus("Paga");
            quota.setDataPagamento(dataPagamento);
            quota.setMetodoPagamento(metodoPagamento);
            quota.setComprovante(comprovante);
            return quotaRepository.save(quota);
        }
        throw new RuntimeException("Quota não encontrada: " + quotaId);
    }

    /**
     * Envia lembretes de cotas que estão próximas do vencimento
     */
    @Transactional
    public void enviarLembretesQuotas() {
        LocalDate hoje = LocalDate.now();
        LocalDate cincoDias = hoje.plusDays(5);
        
        List<Quota> quotasParaLembrete = quotaRepository.findQuotasParaLembrete(hoje, cincoDias);
        
        logger.info("Encontradas {} cotas para enviar lembrete", quotasParaLembrete.size());
        
        for (Quota quota : quotasParaLembrete) {
            try {
                Optional<Membro> membroOpt = membroRepository.findById(quota.getMembroId());
                if (membroOpt.isPresent()) {
                    Membro membro = membroOpt.get();
                    
                    String dataVencimentoFormatada = quota.getDataVencimento().toString();
                    boolean enviado = smsService.sendQuotaReminderSms(
                        membro.getCelular(),
                        membro.getNomeCompleto(),
                        dataVencimentoFormatada,
                        quota.getValor().doubleValue()
                    );
                    
                    if (enviado) {
                        quota.setLembreteEnviado(true);
                        quota.setDataLembrete(LocalDateTime.now());
                        quotaRepository.save(quota);
                        logger.info("Lembrete enviado para membro: {}", membro.getNomeCompleto());
                    }
                }
            } catch (Exception e) {
                logger.error("Erro ao enviar lembrete para quota {}: {}", quota.getId(), e.getMessage());
            }
        }
    }
}
