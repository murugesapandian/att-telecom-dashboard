package com.att.analytics.state.service;

import com.att.analytics.state.kafka.StateDataEventPublisher;
import com.att.analytics.state.model.StateData;
import com.att.analytics.state.repository.StateDataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class StateAnalyticsService {

    private final StateDataRepository stateDataRepository;
    private final StateDataEventPublisher eventPublisher;

    public List<StateData> getAllStates() {
        return stateDataRepository.findAll();
    }

    public Optional<StateData> getStateById(String stateId) {
        return stateDataRepository.findById(stateId.toUpperCase());
    }

    public List<StateData> getStatesByRegion(String region) {
        return stateDataRepository.findByRegion(region);
    }

    public List<StateData> getStatesByLeader(String leader) {
        return stateDataRepository.findByMarketLeader(leader);
    }

    public List<StateData> getHighOpportunityStates() {
        return stateDataRepository.findByAttOpportunity("high");
    }

    public Map<String, Object> getNationalSummary() {
        List<StateData> all = stateDataRepository.findAll();
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalStates", all.size());
        summary.put("attLeadingStates", all.stream().filter(s -> "AT&T".equals(s.getMarketLeader())).count());
        summary.put("avgAttShare", stateDataRepository.findNationalAvgAttShare());
        summary.put("highOpportunityStates", stateDataRepository.findByAttOpportunity("high").size());
        summary.put("regionalBreakdown", stateDataRepository.findAvgAttShareByRegion());
        return summary;
    }

    @Transactional
    public StateData updateStateShare(String stateId, Map<String, Double> shareUpdates) {
        StateData state = stateDataRepository.findById(stateId)
            .orElseThrow(() -> new NoSuchElementException("State not found: " + stateId));

        shareUpdates.forEach((provider, share) -> {
            switch (provider.toLowerCase()) {
                case "att" -> state.setAttShare(share);
                case "verizon" -> state.setVerizonShare(share);
                case "tmobile" -> state.setTmobileShare(share);
                case "comcast" -> state.setComcastShare(share);
                case "spectrum" -> state.setSpectrumShare(share);
                case "cox" -> state.setCoxShare(share);
            }
        });

        StateData saved = stateDataRepository.save(state);
        eventPublisher.publishStateUpdate(saved);
        log.info("State {} market share updated. AT&T: {}%", stateId, saved.getAttShare());
        return saved;
    }

    public List<StateData> getTopAttStates(int limit) {
        return stateDataRepository.findAllOrderByAttShareDesc()
            .stream().limit(limit).toList();
    }
}
