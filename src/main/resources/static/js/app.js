// ===== Marvel Movie Catalog — Frontend Logic =====

document.addEventListener('DOMContentLoaded', () => {
    const movieGrid = document.getElementById('movieGrid');
    const emptyState = document.getElementById('emptyState');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const phaseFilter = document.getElementById('phaseFilter');
    const statusFilter = document.getElementById('statusFilter');
    const progressFill = document.getElementById('progressFill');

    let movies = window.INITIAL_MOVIES || [];
    let currentPhase = 'all';
    let currentStatus = 'all';
    let currentMovieId = null;

    // ===== INIT =====
    renderMovies(movies);
    updateProgress();

    // ===== FILTER HANDLERS =====
    phaseFilter.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        phaseFilter.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPhase = btn.dataset.phase;
        fetchAndRender();
    });

    statusFilter.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        statusFilter.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentStatus = btn.dataset.status;
        fetchAndRender();
    });

    // ===== MODAL HANDLERS =====
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ===== FUNCTIONS =====

    async function fetchAndRender() {
        let url = '/api/movies?';
        if (currentPhase !== 'all') url += `phase=${currentPhase}&`;
        if (currentStatus !== 'all') url += `status=${currentStatus}&`;

        try {
            const res = await fetch(url);
            movies = await res.json();
            renderMovies(movies);
        } catch (err) {
            console.error('Failed to fetch movies:', err);
        }
    }

    function renderMovies(movieList) {
        if (!movieList || movieList.length === 0) {
            movieGrid.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        movieGrid.innerHTML = movieList.map((movie, index) => `
            <div class="movie-card" data-id="${movie.id}" style="animation-delay: ${index * 0.05}s" onclick="window.openMovieModal(${movie.id})">
                <div class="card-poster">
                    <img src="${movie.posterUrl}" alt="${movie.title}" loading="lazy"
                         onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 300%22><rect fill=%22%231a1a28%22 width=%22200%22 height=%22300%22/><text fill=%22%236b6b80%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-size=%2216%22>🎬</text></svg>'">
                    <div class="card-poster-overlay"></div>
                    <span class="card-phase-badge">Фаза ${movie.phase}</span>
                    <span class="card-status-badge ${getStatusClass(movie.watchStatus)}">${getStatusIcon(movie.watchStatus)}</span>
                </div>
                <div class="card-info">
                    <div class="card-title">${movie.title}</div>
                    <div class="card-meta">
                        <span>${movie.releaseYear}</span>
                        <span class="card-rating">★ ${movie.rating.toFixed(1)}</span>
                        <span>${movie.durationMinutes} мин</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function getStatusClass(status) {
        switch (status) {
            case 'WATCHED': return 'watched';
            case 'WILL_WATCH': return 'will-watch';
            default: return 'not-watched';
        }
    }

    function getStatusIcon(status) {
        switch (status) {
            case 'WATCHED': return '✓';
            case 'WILL_WATCH': return '★';
            default: return '○';
        }
    }

    function getStatusText(status) {
        switch (status) {
            case 'WATCHED': return 'Просмотрено';
            case 'WILL_WATCH': return 'Буду смотреть';
            default: return 'Не смотрел';
        }
    }

    // ===== MODAL =====

    window.openMovieModal = async function(id) {
        currentMovieId = id;
        try {
            const res = await fetch(`/api/movies/${id}`);
            const movie = await res.json();
            showModal(movie);
        } catch (err) {
            console.error('Failed to load movie:', err);
        }
    };

    function showModal(movie) {
        document.getElementById('modalPoster').src = movie.posterUrl;
        document.getElementById('modalPoster').alt = movie.title;
        document.getElementById('modalTitle').textContent = movie.title;
        document.getElementById('modalPhase').textContent = `Фаза ${movie.phase}`;
        document.getElementById('modalYear').textContent = movie.releaseYear;
        document.getElementById('modalDuration').textContent = `${movie.durationMinutes} мин`;
        document.getElementById('modalRating').textContent = `★ ${movie.rating.toFixed(1)}`;
        document.getElementById('modalDescription').textContent = movie.description;

        const actions = document.getElementById('modalActions');
        actions.innerHTML = `
            <button class="action-btn watched-btn ${movie.watchStatus === 'WATCHED' ? 'active' : ''}"
                    onclick="window.setStatus(${movie.id}, 'WATCHED')">
                ✓ Просмотрено
            </button>
            <button class="action-btn will-watch-btn ${movie.watchStatus === 'WILL_WATCH' ? 'active' : ''}"
                    onclick="window.setStatus(${movie.id}, 'WILL_WATCH')">
                ★ Буду смотреть
            </button>
            <button class="action-btn not-watched-btn ${movie.watchStatus === 'NOT_WATCHED' ? 'active' : ''}"
                    onclick="window.setStatus(${movie.id}, 'NOT_WATCHED')">
                ○ Не смотрел
            </button>
        `;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        currentMovieId = null;
    }

    // ===== STATUS UPDATE =====

    window.setStatus = async function(id, status) {
        try {
            const res = await fetch(`/api/movies/${id}/status?status=${status}`, {
                method: 'PUT'
            });
            const updated = await res.json();

            // Update local data
            const idx = movies.findIndex(m => m.id === id);
            if (idx !== -1) {
                movies[idx].watchStatus = updated.watchStatus;
            }

            // Re-render
            renderMovies(movies);
            showModal(updated);
            updateStats();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    async function updateStats() {
        try {
            const res = await fetch('/api/stats');
            const stats = await res.json();
            document.getElementById('totalCount').textContent = stats.total;
            document.getElementById('watchedCount').textContent = stats.watched;
            document.getElementById('willWatchCount').textContent = stats.willWatch;
            updateProgressBar(stats.watched, stats.total);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    }

    function updateProgress() {
        const total = parseInt(document.getElementById('totalCount').textContent) || 0;
        const watched = parseInt(document.getElementById('watchedCount').textContent) || 0;
        updateProgressBar(watched, total);
    }

    function updateProgressBar(watched, total) {
        const pct = total > 0 ? Math.round((watched / total) * 100) : 0;
        progressFill.style.width = pct + '%';
    }
});
