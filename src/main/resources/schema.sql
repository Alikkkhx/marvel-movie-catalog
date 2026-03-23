CREATE TABLE IF NOT EXISTS movies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_year INT NOT NULL,
    phase INT NOT NULL,
    description VARCHAR(2000),
    poster_url VARCHAR(500),
    watch_status VARCHAR(20) NOT NULL DEFAULT 'NOT_WATCHED',
    rating DOUBLE,
    duration_minutes INT
);
