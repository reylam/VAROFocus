#!/usr/bin/env bash
set -e

# SQLite file lives on the Railway volume (DB_DATABASE, e.g. /data/database.sqlite).
DB_PATH="${DB_DATABASE:-/data/database.sqlite}"
mkdir -p "$(dirname "$DB_PATH")"
touch "$DB_PATH"

# Apply migrations on every boot (only new ones actually run).
php artisan migrate --force

# Seed sample data exactly once. The seeder is NOT idempotent, so we guard it
# with a marker file on the persistent volume. Delete the marker to re-seed.
SEED_MARKER="$(dirname "$DB_PATH")/.seeded"
if [ ! -f "$SEED_MARKER" ]; then
  php artisan db:seed --force && touch "$SEED_MARKER"
fi

# Serve on the port Railway assigns.
php artisan config:clear
php artisan serve --host 0.0.0.0 --port "${PORT:-8000}"
