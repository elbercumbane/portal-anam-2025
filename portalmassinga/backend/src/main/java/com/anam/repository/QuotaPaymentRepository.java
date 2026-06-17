package com.anam.repository;

import com.anam.entity.QuotaPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuotaPaymentRepository extends JpaRepository<QuotaPayment, UUID> {

    List<QuotaPayment> findByMemberApplicationIdOrderByYearDescMonthDesc(UUID memberApplicationId);

    @Query("SELECT q FROM QuotaPayment q WHERE q.memberApplicationId = :memberId AND q.year = :year AND q.month = :month")
    List<QuotaPayment> findByMemberAndYearMonth(@Param("memberId") UUID memberId, @Param("year") int year, @Param("month") int month);
}
