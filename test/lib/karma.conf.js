module.exports = function(config) {
    "use strict";

    config.set({
        basePath: "../..",
        frameworks: ["jasmine"],
        browsers: ["PhantomJS"],
        logLevel: config.LOG_DISABLE,
        files: [
            "./test/lib/jasmine-dom/*.js",
            "./build/*.js",
            "./test/spec/*.spec.js"
        ]
    });
};
