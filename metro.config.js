// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for Firebase's CommonJS (.cjs) files
config.resolver.sourceExts.push('cjs');

// Disable package exports to prevent Metro from resolving incompatible ESM builds on Hermes
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
