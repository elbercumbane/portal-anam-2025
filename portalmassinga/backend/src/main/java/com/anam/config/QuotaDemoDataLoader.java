package com.anam.config;

import com.anam.entity.MemberApplication;
import com.anam.entity.QuotaPayment;
import com.anam.repository.MemberApplicationRepository;
import com.anam.repository.QuotaPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.UUID;

/**
 * Cria membros demo para apresentação (NUIT 400111222 em dia, 400333444 com dívidas).
 */
@Component
@Order(2)
public class QuotaDemoDataLoader implements ApplicationRunner {

    private static final UUID ID_ANA = UUID.fromString("a1111111-1111-1111-1111-111111111111");
    private static final UUID ID_CARLOS = UUID.fromString("a2222222-2222-2222-2222-222222222222");

    @Autowired
    private MemberApplicationRepository memberRepository;

    @Autowired
    private QuotaPaymentRepository quotaPaymentRepository;

    @Override
    public void run(ApplicationArguments args) {
        seedMember(ID_ANA, "400111222", "Ana Machel Demo", "ana.demo@anam.co.mz", "841234567");
        seedMember(ID_CARLOS, "400333444", "Carlos Cumbane Demo", "carlos.demo@anam.co.mz", "871234567");
        seedPaymentsAna();
        seedPaymentsCarlos();
    }

    private void seedMember(UUID id, String nuit, String name, String email, String phone) {
        if (memberRepository.existsById(id)) return;
        if (memberRepository.findByNuitIgnoreCase(nuit).isPresent()) return;

        MemberApplication m = new MemberApplication();
        m.setId(id);
        m.setFullName(name);
        m.setFatherName("Demo Pai");
        m.setMotherName("Demo Mãe");
        m.setBirthDate(LocalDate.of(1990, 5, 15));
        m.setMaritalStatus("Solteiro");
        m.setProfession("Profissional");
        m.setMobilePhone(phone);
        m.setEmail(email);
        m.setStreet("Rua Demo");
        m.setNeighborhood("Centro");
        m.setCity("Massinga");
        m.setAcceptsTerms(true);
        m.setStatus("Approved");
        m.setApprovedAt(LocalDateTime.of(2025, 1, 1, 8, 0));
        m.setNuit(nuit);
        m.setCreatedAt(LocalDateTime.of(2024, 12, 1, 10, 0));
        memberRepository.save(m);
        System.out.println("[QuotaDemoDataLoader] Membro demo criado: " + nuit + " — " + name);
    }

    private void seedPaymentsAna() {
        if (!memberRepository.existsById(ID_ANA)) return;
        YearMonth start = YearMonth.of(2025, 1);
        YearMonth end = YearMonth.from(LocalDate.now());
        for (YearMonth ym = start; !ym.isAfter(end); ym = ym.plusMonths(1)) {
            if (hasPayment(ID_ANA, ym.getYear(), ym.getMonthValue())) continue;
            savePayment(ID_ANA, ym.getYear(), ym.getMonthValue(), "PAY-DEMO-ANA-" + ym);
        }
    }

    private void seedPaymentsCarlos() {
        if (!memberRepository.existsById(ID_CARLOS)) return;
        // Pago Jan–Fev; resto em falta para demo
        if (!hasPayment(ID_CARLOS, 2025, 1)) savePayment(ID_CARLOS, 2025, 1, "PAY-DEMO-CAR-1");
        if (!hasPayment(ID_CARLOS, 2025, 2)) savePayment(ID_CARLOS, 2025, 2, "PAY-DEMO-CAR-2");
    }

    private boolean hasPayment(UUID memberId, int year, int month) {
        return !quotaPaymentRepository.findByMemberAndYearMonth(memberId, year, month).isEmpty();
    }

    private void savePayment(UUID memberId, int year, int month, String reference) {
        QuotaPayment p = new QuotaPayment();
        p.setMemberApplicationId(memberId);
        p.setYear(year);
        p.setMonth(month);
        p.setAmount(new BigDecimal("1200"));
        p.setPaymentDate(LocalDate.of(year, month, 10));
        p.setPaymentMethod("M-Pesa");
        p.setReference(reference);
        p.setStatus("Paid");
        quotaPaymentRepository.save(p);
    }
}
