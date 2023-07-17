const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,
  projectId: 'qs946u',

  redirectionLimit: 60,
  defaultCommandTimeout: 4000,

  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1500,
    viewportHeight: 1000,
    defaultCommandTimeout: 3000,
    watchForFileChanges: false,
    "baseUrl": "https://test4.comunidadfeliz.com/",
  },
});
