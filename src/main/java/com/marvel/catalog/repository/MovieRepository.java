package com.marvel.catalog.repository;

import com.marvel.catalog.model.Movie;
import com.marvel.catalog.model.WatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByPhase(int phase);
    List<Movie> findByWatchStatus(WatchStatus watchStatus);
    List<Movie> findByPhaseAndWatchStatus(int phase, WatchStatus watchStatus);
    List<Movie> findAllByOrderByReleaseYearAscIdAsc();
    boolean existsByTitle(String title);
}
