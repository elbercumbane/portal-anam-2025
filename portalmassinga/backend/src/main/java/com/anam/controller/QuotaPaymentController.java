package com.anam.controller;

import com.anam.dto.CreateQuotaPaymentDTO;
import com.anam.dto.MemberQuotaStatusDTO;
import com.anam.dto.QuotaPaymentDTO;
import com.anam.entity.MemberApplication;
import com.anam.entity.QuotaPayment;
import com.anam.repository.MemberApplicationRepository;
import com.anam.repository.QuotaPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;
import java.util.UUID;

@RestController
@RequestMapping("/quota-payments")
@CrossOrigin(origins = "*")
public class QuotaPaymentController {

    private static final BigDecimal VALOR_COTA_MENSAL = new BigDecimal("1200");

    @Autowired
    private MemberApplicationRepository memberRepository;

    @Autowired
    private QuotaPaymentRepository quotaPaymentRepository;

    /**
     * Lista membros com sua situação financeira (cotas).
     * Contagem começa a partir da data de aprovação (approved_at) na gestão de membros.
     * @param situacao opcional: COM_DIVIDAS | EM_DIA | ALL
     * @param search opcional: filtrar por nome, contacto (celular/email), ou NUIT
     */
    @GetMapping("/members-summary")
    public ResponseEntity<List<MemberQuotaStatusDTO>> getMembersSummary(
            @RequestParam(required = false) String situacao,
            @RequestParam(required = false) String search) {
        List<MemberApplication> members = memberRepository.findByStatus("Approved");
        List<MemberQuotaStatusDTO> result = new ArrayList<>();

        int currentYear = LocalDate.now().getYear();
        int currentMonth = LocalDate.now().getMonthValue();

        // Filtrar por pesquisa (nome, contacto, nuit)
        String searchLower = (search != null && !search.isBlank()) ? search.trim().toLowerCase() : null;

        for (MemberApplication m : members) {
            if (searchLower != null) {
                boolean match = (m.getFullName() != null && m.getFullName().toLowerCase().contains(searchLower))
                        || (m.getEmail() != null && m.getEmail().toLowerCase().contains(searchLower))
                        || (m.getMobilePhone() != null && m.getMobilePhone().contains(search))
                        || (m.getNuit() != null && m.getNuit().contains(search));
                if (!match) continue;
            }

            MemberQuotaStatusDTO dto = buildMemberQuotaStatus(m, currentYear, currentMonth);
            if (dto == null) continue;

            if (situacao != null && !situacao.isBlank()) {
                if ("COM_DIVIDAS".equalsIgnoreCase(situacao) && !"COM_DIVIDAS".equals(dto.getSituacaoFinanceira())) continue;
                if ("EM_DIA".equalsIgnoreCase(situacao) && !"EM_DIA".equals(dto.getSituacaoFinanceira())) continue;
            }
            result.add(dto);
        }

        // Ordenar: com dívidas primeiro, depois por nome
        result.sort((a, b) -> {
            int cmp = b.getSituacaoFinanceira().compareTo(a.getSituacaoFinanceira()); // COM_DIVIDAS antes
            if (cmp != 0) return cmp;
            return a.getNome().compareToIgnoreCase(b.getNome());
        });

        return ResponseEntity.ok(result);
    }

    /**
     * Extrato de pagamentos de um membro.
     */
    @GetMapping("/member/{memberId}/statement")
    public ResponseEntity<?> getMemberStatement(@PathVariable UUID memberId) {
        if (!memberRepository.existsById(memberId)) {
            return ResponseEntity.notFound().build();
        }
        List<QuotaPayment> payments = quotaPaymentRepository.findByMemberApplicationIdOrderByYearDescMonthDesc(memberId);
        List<QuotaPaymentDTO> dtos = payments.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Situação de cotas por NUIT (público — página Pagar Cotas).
     */
    @GetMapping("/status/by-nuit/{nuit}")
    public ResponseEntity<?> getStatusByNuit(@PathVariable String nuit) {
        if (nuit == null || nuit.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "NUIT é obrigatório"));
        }
        return memberRepository.findByNuitIgnoreCase(nuit.trim())
                .map(this::buildStatusResponse)
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "Membro não encontrado")));
    }

    /**
     * Situação de cotas por ID do membro (utilizador autenticado).
     */
    @GetMapping("/status/member/{memberId}")
    public ResponseEntity<?> getStatusByMemberId(@PathVariable UUID memberId) {
        return memberRepository.findById(memberId)
                .map(this::buildStatusResponse)
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "Membro não encontrado")));
    }

    private ResponseEntity<?> buildStatusResponse(MemberApplication m) {
        if (m.getStatus() == null || !"Approved".equals(m.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Apenas membros aprovados podem pagar cotas",
                    "status", m.getStatus() != null ? m.getStatus() : "Unknown"
            ));
        }
        int currentYear = LocalDate.now().getYear();
        int currentMonth = LocalDate.now().getMonthValue();
        MemberQuotaStatusDTO dto = buildMemberQuotaStatus(m, currentYear, currentMonth);
        if (dto == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Não foi possível calcular a situação de cotas"));
        }
        return ResponseEntity.ok(dto);
    }

    /**
     * Registar um pagamento de cota (para integração com pay-quotas).
     */
    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody CreateQuotaPaymentDTO request) {
        if (request.getMemberApplicationId() == null || !memberRepository.existsById(request.getMemberApplicationId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Membro não encontrado"));
        }
        if (request.getMonths() == null || request.getMonths().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Meses obrigatórios"));
        }

        String reference = request.getReference() != null && !request.getReference().isBlank()
                ? request.getReference().trim()
                : "PAY-" + System.currentTimeMillis();

        int created = 0;
        int skipped = 0;
        List<Map<String, Object>> saved = new ArrayList<>();

        for (int month : request.getMonths()) {
            if (month < 1 || month > 12) continue;

            List<QuotaPayment> existing = quotaPaymentRepository.findByMemberAndYearMonth(
                    request.getMemberApplicationId(), request.getYear(), month);
            boolean alreadyPaid = existing.stream()
                    .anyMatch(p -> "Paid".equalsIgnoreCase(p.getStatus()));
            if (alreadyPaid) {
                skipped++;
                continue;
            }

            QuotaPayment p = new QuotaPayment();
            p.setMemberApplicationId(request.getMemberApplicationId());
            p.setYear(request.getYear());
            p.setMonth(month);
            p.setAmount(VALOR_COTA_MENSAL);
            p.setPaymentDate(request.getPaymentDate() != null ? request.getPaymentDate() : LocalDate.now());
            p.setPaymentMethod(request.getPaymentMethod());
            p.setReference(reference);
            p.setStatus("Paid");
            QuotaPayment savedPayment = quotaPaymentRepository.save(p);
            created++;
            saved.add(Map.of(
                    "id", savedPayment.getId().toString(),
                    "year", savedPayment.getYear(),
                    "month", savedPayment.getMonth(),
                    "amount", savedPayment.getAmount()
            ));
        }

        if (created == 0) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Nenhum mês novo foi registado (já pagos ou inválidos)",
                    "skipped", skipped
            ));
        }

        return ResponseEntity.status(201).body(Map.of(
                "reference", reference,
                "paymentsCreated", created,
                "skipped", skipped,
                "payments", saved
        ));
    }

    private MemberQuotaStatusDTO buildMemberQuotaStatus(MemberApplication m, int currentYear, int currentMonth) {
        if (m.getStatus() == null || !"Approved".equals(m.getStatus())) return null;
        if ("Inactive".equals(m.getStatus())) return null;

        LocalDateTime approvedAt = m.getApprovedAt();
        LocalDateTime refDate = approvedAt != null ? approvedAt : m.getCreatedAt();
        int startYear = currentYear;
        int startMonth = currentMonth;
        if (refDate != null) {
            startYear = refDate.getYear();
            startMonth = refDate.getMonthValue();
        }

        List<QuotaPayment> payments = quotaPaymentRepository.findByMemberApplicationIdOrderByYearDescMonthDesc(m.getId());
        Set<YearMonth> paidMonths = new HashSet<>();
        String ultimoMesPago = null;
        for (QuotaPayment p : payments) {
            if ("Paid".equalsIgnoreCase(p.getStatus())) {
                paidMonths.add(YearMonth.of(p.getYear(), p.getMonth()));
                if (ultimoMesPago == null) {
                    ultimoMesPago = String.format("%d-%02d", p.getYear(), p.getMonth());
                }
            }
        }

        int mesesEmDivida = 0;
        List<String> mesesEmFalta = new ArrayList<>();
        List<String> mesesPagos = new ArrayList<>();
        YearMonth current = YearMonth.of(currentYear, currentMonth);
        YearMonth start = YearMonth.of(startYear, startMonth);
        for (YearMonth ym = start; !ym.isAfter(current); ym = ym.plusMonths(1)) {
            String key = String.format("%d-%02d", ym.getYear(), ym.getMonthValue());
            if (!paidMonths.contains(ym)) {
                mesesEmDivida++;
                mesesEmFalta.add(key);
            } else {
                mesesPagos.add(key);
            }
        }

        BigDecimal valorEmDivida = VALOR_COTA_MENSAL.multiply(BigDecimal.valueOf(mesesEmDivida));
        String sit = mesesEmDivida > 0 ? "COM_DIVIDAS" : "EM_DIA";

        MemberQuotaStatusDTO dto = new MemberQuotaStatusDTO();
        dto.setMemberApplicationId(m.getId());
        dto.setNome(m.getFullName());
        dto.setEmail(m.getEmail());
        dto.setCelular(m.getMobilePhone());
        dto.setNuit(m.getNuit());
        dto.setSituacaoFinanceira(sit);
        dto.setMesesEmDivida(mesesEmDivida);
        dto.setValorEmDivida(valorEmDivida);
        dto.setUltimoMesPago(ultimoMesPago);
        dto.setMesesEmFalta(mesesEmFalta);
        dto.setMesesPagos(mesesPagos);
        return dto;
    }

    private QuotaPaymentDTO toDTO(QuotaPayment p) {
        QuotaPaymentDTO dto = new QuotaPaymentDTO();
        dto.setId(p.getId());
        dto.setMemberApplicationId(p.getMemberApplicationId());
        dto.setYear(p.getYear());
        dto.setMonth(p.getMonth());
        dto.setAmount(p.getAmount());
        dto.setPaymentDate(p.getPaymentDate());
        dto.setPaymentMethod(p.getPaymentMethod());
        dto.setReference(p.getReference());
        dto.setStatus(p.getStatus());
        return dto;
    }
}
