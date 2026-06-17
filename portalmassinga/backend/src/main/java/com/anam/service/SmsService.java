package com.anam.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Serviço para envio de SMS através da API MozeSMS
 * Documentação: https://mozesms.com/
 */
@Service
public class SmsService {

    private static final Logger logger = LoggerFactory.getLogger(SmsService.class);
    
    @Value("${sms.mozesms.api.url:https://api.mozesms.com/v1/send}")
    private String apiUrl;
    
    @Value("${sms.mozesms.api.key:}")
    private String apiKey;
    
    @Value("${sms.mozesms.api.sender:ANAM}")
    private String sender;
    
    @Value("${sms.enabled:true}")
    private boolean smsEnabled;
    
    private final RestTemplate restTemplate;

    public SmsService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Envia SMS através da API MozeSMS
     * 
     * @param phoneNumber Número de telefone (formato: 258XXXXXXXXX ou 84XXXXXXXXX)
     * @param message Mensagem a ser enviada
     * @return true se enviado com sucesso, false caso contrário
     */
    public boolean sendSms(String phoneNumber, String message) {
        if (!smsEnabled) {
            logger.warn("SMS está desabilitado. Mensagem não enviada para: {}", phoneNumber);
            return false;
        }

        if (apiKey == null || apiKey.isEmpty()) {
            logger.error("API Key do MozeSMS não configurada!");
            return false;
        }

        try {
            // Normalizar número de telefone (remover espaços, garantir formato correto)
            String normalizedPhone = normalizePhoneNumber(phoneNumber);
            
            // Preparar requisição
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("X-API-Key", apiKey); // Algumas APIs usam este header

            // Corpo da requisição (ajustar conforme documentação da API MozeSMS)
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("to", normalizedPhone);
            requestBody.put("message", message);
            requestBody.put("sender", sender);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            logger.info("Enviando SMS para: {} | Mensagem: {}", normalizedPhone, message);

            // Fazer requisição
            ResponseEntity<Map> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                request,
                Map.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("SMS enviado com sucesso para: {}", normalizedPhone);
                return true;
            } else {
                logger.error("Erro ao enviar SMS. Status: {}", response.getStatusCode());
                return false;
            }

        } catch (Exception e) {
            logger.error("Erro ao enviar SMS para {}: {}", phoneNumber, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Normaliza número de telefone para formato Moçambique
     * Aceita formatos: 258XXXXXXXXX, 84XXXXXXXXX, +258XXXXXXXXX
     */
    private String normalizePhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return phoneNumber;
        }

        // Remover espaços, hífens e outros caracteres
        String normalized = phoneNumber.replaceAll("[\\s\\-\\(\\)]", "");
        
        // Remover + se existir
        if (normalized.startsWith("+")) {
            normalized = normalized.substring(1);
        }
        
        // Se começa com 258 (código do país), manter
        if (normalized.startsWith("258")) {
            return normalized;
        }
        
        // Se começa com 84, adicionar código do país
        if (normalized.startsWith("84") && normalized.length() == 11) {
            return "258" + normalized.substring(2);
        }
        
        // Se começa com 8 e tem 9 dígitos, adicionar código do país
        if (normalized.startsWith("8") && normalized.length() == 9) {
            return "258" + normalized;
        }
        
        // Retornar como está se não conseguir normalizar
        return normalized;
    }

    /**
     * Envia SMS de notificação de cadastro pendente
     */
    public boolean sendRegistrationPendingSms(String phoneNumber, String nome) {
        String message = String.format(
            "Olá %s! Seu pedido de criação de usuário para acesso à área de membros da ANAM está aguardando aprovação. Você receberá uma notificação quando for aprovado.",
            nome
        );
        return sendSms(phoneNumber, message);
    }

    /**
     * Envia SMS com credenciais de acesso após aprovação
     */
    public boolean sendApprovalCredentialsSms(String phoneNumber, String nome, String email, String senha) {
        String message = String.format(
            "Olá %s! Sua candidatura foi APROVADA! Acesse sua área de membros com:\nEmail: %s\nSenha: %s\n\nBem-vindo à ANAM!",
            nome, email, senha
        );
        return sendSms(phoneNumber, message);
    }

    /**
     * Envia SMS de lembrete de pagamento de cota
     */
    public boolean sendQuotaReminderSms(String phoneNumber, String nome, String dataVencimento, double valor) {
        String message = String.format(
            "Olá %s! Lembrete: O prazo de pagamento da sua cota é no dia %s. Valor: %.2f MT. Por favor, efetue o pagamento para manter seu acesso à área de membros.",
            nome, dataVencimento, valor
        );
        return sendSms(phoneNumber, message);
    }

    /**
     * Envia SMS de bloqueio por falta de pagamento
     */
    public boolean sendQuotaBlockedSms(String phoneNumber, String nome) {
        String message = String.format(
            "Olá %s! Seu acesso à área de membros foi bloqueado devido ao não pagamento da cota. Por favor, efetue o pagamento para reativar seu acesso.",
            nome
        );
        return sendSms(phoneNumber, message);
    }
}
