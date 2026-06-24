package com.att.analytics.state.logging;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<LogEntry, Long> {

    List<LogEntry> findByLevelOrderByTimestampDesc(String level, Pageable pageable);

    List<LogEntry> findByCategoryOrderByTimestampDesc(String category, Pageable pageable);

    List<LogEntry> findBySourceOrderByTimestampDesc(String source, Pageable pageable);

    List<LogEntry> findByTimestampAfterOrderByTimestampDesc(Instant since, Pageable pageable);

    @Query("SELECT l FROM LogEntry l ORDER BY l.timestamp DESC")
    List<LogEntry> findRecentLogs(Pageable pageable);

    @Query("SELECT l.level, COUNT(l) FROM LogEntry l GROUP BY l.level")
    List<Object[]> countByLevel();

    @Query("SELECT l.category, COUNT(l) FROM LogEntry l GROUP BY l.category ORDER BY COUNT(l) DESC")
    List<Object[]> countByCategory();
}
