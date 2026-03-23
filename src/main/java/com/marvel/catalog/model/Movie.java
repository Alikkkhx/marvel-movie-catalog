package com.marvel.catalog.model;

import jakarta.persistence.*;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private int releaseYear;

    @Column(nullable = false)
    private int phase;

    @Column(length = 2000)
    private String description;

    private String posterUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WatchStatus watchStatus = WatchStatus.NOT_WATCHED;

    private double rating;

    private int durationMinutes;

    public Movie() {}

    public Movie(String title, int releaseYear, int phase, String description, String posterUrl, double rating, int durationMinutes) {
        this.title = title;
        this.releaseYear = releaseYear;
        this.phase = phase;
        this.description = description;
        this.posterUrl = posterUrl;
        this.rating = rating;
        this.durationMinutes = durationMinutes;
        this.watchStatus = WatchStatus.NOT_WATCHED;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public int getReleaseYear() { return releaseYear; }
    public void setReleaseYear(int releaseYear) { this.releaseYear = releaseYear; }

    public int getPhase() { return phase; }
    public void setPhase(int phase) { this.phase = phase; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public WatchStatus getWatchStatus() { return watchStatus; }
    public void setWatchStatus(WatchStatus watchStatus) { this.watchStatus = watchStatus; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
}
