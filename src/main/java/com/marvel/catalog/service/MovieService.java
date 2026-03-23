package com.marvel.catalog.service;

import com.marvel.catalog.model.Movie;
import com.marvel.catalog.model.WatchStatus;
import com.marvel.catalog.repository.MovieRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAllByOrderByReleaseYearAscIdAsc();
    }

    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }

    public List<Movie> getMoviesByPhase(int phase) {
        return movieRepository.findByPhase(phase);
    }

    public List<Movie> getMoviesByStatus(WatchStatus status) {
        return movieRepository.findByWatchStatus(status);
    }

    public List<Movie> getMoviesByPhaseAndStatus(int phase, WatchStatus status) {
        return movieRepository.findByPhaseAndWatchStatus(phase, status);
    }

    public List<Movie> getFilteredMovies(Integer phase, WatchStatus status) {
        if (phase != null && status != null) {
            return getMoviesByPhaseAndStatus(phase, status);
        } else if (phase != null) {
            return getMoviesByPhase(phase);
        } else if (status != null) {
            return getMoviesByStatus(status);
        }
        return getAllMovies();
    }

    @Transactional
    public Movie updateWatchStatus(Long id, WatchStatus status) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
        movie.setWatchStatus(status);
        return movieRepository.save(movie);
    }

    public long countByStatus(WatchStatus status) {
        return movieRepository.findByWatchStatus(status).size();
    }

    public long totalMovies() {
        return movieRepository.count();
    }
}
