/**
 * Backwards-compatible seed command.
 *
 * The original project used SQLite for seeding. The production build now uses
 * Neon PostgreSQL, so the existing SQLite database is copied into Neon by the
 * migration command instead of creating a second, disconnected database.
 */
import "./migrate-neon";
