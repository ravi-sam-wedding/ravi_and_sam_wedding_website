const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: 'tests/integrationTests/**/*.test.js',
    supportFile: false,
  },
});
