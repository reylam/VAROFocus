# Backend (Laravel 12) image for Railway.
# Uses a plain PHP image so the SQLite PDO extension is guaranteed present.
FROM php:8.2-cli

# System libs + PHP extensions Laravel needs (pdo_sqlite for the SQLite DB).
RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip libzip-dev libonig-dev libsqlite3-dev \
    && docker-php-ext-install pdo_sqlite mbstring bcmath zip \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . /app

RUN composer install --no-dev --optimize-autoloader --no-interaction \
    && chmod +x /app/railway-start.sh

# railway-start.sh runs migrations, seeds once, then serves on $PORT.
CMD ["/app/railway-start.sh"]
