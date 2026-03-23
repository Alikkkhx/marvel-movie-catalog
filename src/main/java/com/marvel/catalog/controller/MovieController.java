package com.marvel.catalog.controller;

import com.marvel.catalog.model.Movie;
import com.marvel.catalog.model.WatchStatus;
import com.marvel.catalog.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    // --- Thymeleaf Page ---
    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("movies", movieService.getAllMovies());
        model.addAttribute("totalMovies", movieService.totalMovies());
        model.addAttribute("watchedCount", movieService.countByStatus(WatchStatus.WATCHED));
        model.addAttribute("willWatchCount", movieService.countByStatus(WatchStatus.WILL_WATCH));
        return "index";
    }

    // --- REST API ---
    @GetMapping("/api/movies")
    @ResponseBody
    public List<Movie> getMovies(
            @RequestParam(required = false) Integer phase,
            @RequestParam(required = false) WatchStatus status) {
        return movieService.getFilteredMovies(phase, status);
    }

    @GetMapping("/api/movies/{id}")
    @ResponseBody
    public ResponseEntity<Movie> getMovie(@PathVariable Long id) {
        return movieService.getMovieById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/api/movies/{id}/status")
    @ResponseBody
    public ResponseEntity<Movie> updateStatus(
            @PathVariable Long id,
            @RequestParam WatchStatus status) {
        try {
            Movie updated = movieService.updateWatchStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/api/stats")
    @ResponseBody
    public Map<String, Long> getStats() {
        return Map.of(
                "total", movieService.totalMovies(),
                "watched", movieService.countByStatus(WatchStatus.WATCHED),
                "willWatch", movieService.countByStatus(WatchStatus.WILL_WATCH),
                "notWatched", movieService.countByStatus(WatchStatus.NOT_WATCHED)
        );
    }
}
