package com.anam.scheduler;

import com.anam.service.QuotaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Job agendado para enviar lembretes de cotas
 * Executa diariamente às 9:00 AM
 */
@Component
public class QuotaReminderScheduler {

    private static final Logger logger = LoggerFactory.getLogger(QuotaReminderScheduler.class);

    @Autowired
    private QuotaService quotaService;

    /**
     * Executa diariamente às 9:00 AM
     * Cron: segundo minuto hora dia mês dia-semana
     */
    @Scheduled(cron = "0 0 9 * * *") // Todos os dias às 9:00 AM
    public void enviarLembretesQuotas() {
        logger.info("Iniciando job de lembretes de cotas...");
        try {
            quotaService.enviarLembretesQuotas();
            logger.info("Job de lembretes de cotas concluído com sucesso");
        } catch (Exception e) {
            logger.error("Erro ao executar job de lembretes de cotas: {}", e.getMessage(), e);
        }
    }
}
