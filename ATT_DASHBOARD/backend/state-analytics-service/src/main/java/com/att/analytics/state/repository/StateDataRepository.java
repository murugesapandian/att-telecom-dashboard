package com.att.analytics.state.repository;

import com.att.analytics.state.model.StateData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StateDataRepository extends JpaRepository<StateData, String> {

    List<StateData> findByRegion(String region);

    List<StateData> findByMarketLeader(String leader);

    List<StateData> findByAttOpportunity(String opportunity);

    @Query("SELECT s FROM StateData s ORDER BY s.attShare DESC")
    List<StateData> findAllOrderByAttShareDesc();

    @Query("SELECT s FROM StateData s WHERE s.attShare < :threshold")
    List<StateData> findLowAttShareStates(Double threshold);

    @Query("SELECT AVG(s.attShare) FROM StateData s")
    Double findNationalAvgAttShare();

    @Query("SELECT s.region, AVG(s.attShare) FROM StateData s GROUP BY s.region")
    List<Object[]> findAvgAttShareByRegion();
}
