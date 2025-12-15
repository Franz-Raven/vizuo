package com.vizuo.backend.service;

import com.vizuo.backend.dto.CreatorDashboardResponse;
import com.vizuo.backend.entity.UserSubscription;
import com.vizuo.backend.repository.DownloadRepository;
import com.vizuo.backend.repository.UserSubscriptionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
public class DashboardService {

    private final UserSubscriptionRepository userSubscriptionRepository;
    private final DownloadRepository downloadRepository;

    public DashboardService(
            UserSubscriptionRepository userSubscriptionRepository,
            DownloadRepository downloadRepository
    ) {
        this.userSubscriptionRepository = userSubscriptionRepository;
        this.downloadRepository = downloadRepository;
    }

    public CreatorDashboardResponse getCreatorDashboard(Long creatorId) {

        LocalDate now = LocalDate.now();
        LocalDateTime monthStart = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime monthEnd = monthStart.plusMonths(1);

        List<UserSubscription> activeSubsThisMonth =
                userSubscriptionRepository
                        .findByStatusAndStartDateGreaterThanEqualAndStartDateLessThan(
                                "active",
                                monthStart,
                                monthEnd
                        );

        BigDecimal subscriptionRevenue = activeSubsThisMonth.stream()
                .map(s -> s.getPlan().getPriceMonthly())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal creatorPool = subscriptionRevenue
                .multiply(new BigDecimal("0.70"))
                .setScale(2, RoundingMode.HALF_UP);

        long totalPremiumDownloads =
                downloadRepository.countPremiumDownloadsInRange(monthStart, monthEnd);

        long yourPremiumDownloads =
                downloadRepository.countPremiumDownloadsForCreatorInRange(
                        creatorId,
                        monthStart,
                        monthEnd
                );

        BigDecimal yourShare = BigDecimal.ZERO;
        BigDecimal yourPayout = BigDecimal.ZERO;

        if (totalPremiumDownloads > 0 && yourPremiumDownloads > 0) {
            yourShare = BigDecimal.valueOf(yourPremiumDownloads)
                    .divide(
                            BigDecimal.valueOf(totalPremiumDownloads),
                            4,
                            RoundingMode.HALF_UP
                    );

            yourPayout = creatorPool
                    .multiply(yourShare)
                    .setScale(2, RoundingMode.HALF_UP);
        }

        CreatorDashboardResponse response = new CreatorDashboardResponse();
        response.setMonthLabel(
                now.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH)
                        + " " + now.getYear()
        );
        response.setSubscriptionRevenue(subscriptionRevenue.setScale(2, RoundingMode.HALF_UP));
        response.setCreatorPool(creatorPool);
        response.setTotalPremiumDownloads(totalPremiumDownloads);
        response.setYourPremiumDownloads(yourPremiumDownloads);
        response.setYourShare(yourShare);
        response.setYourPayout(yourPayout);

        return response;
    }
}
