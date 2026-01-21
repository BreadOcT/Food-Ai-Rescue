
/**
 * DATABASE SERVICE (AGGREGATOR)
 * Menggabungkan semua modul database menjadi satu entry point.
 * Ini memastikan komponen React yang lama tidak error.
 */

export * from './database/core';
export * from './database/utils';
export * from './database/auth';
export * from './database/inventory';
export * from './database/orders';
export * from './database/social';
