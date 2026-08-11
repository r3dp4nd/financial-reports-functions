/** @type {import('jest').Config} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: [
        "**/*.spec.ts"
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
        "\\.integration\\.spec\\.ts$"
    ],
    clearMocks: true,
    restoreMocks: true,
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.spec.json"
            }
        ]
    },
    collectCoverageFrom: [
        "**/*.ts",

        "!**/*.spec.ts",

        // Composition roots: wiring únicamente.
        "!**/index.ts",

        // Contratos y declaraciones sin comportamiento runtime.
        "!**/*.types.ts",
        "!**/*.command.ts",
        "!**/*.query.ts",
        "!**/*.result.ts",
        "!**/*.integration-event.ts",
        "!**/*.repository.ts",
        "!**/*.publisher.ts",
        "!**/*.generator.ts",
        "!**/*.storage.ts",

        "!node_modules/**",
        "!dist/**",
        "!coverage/**",
        "!test-results/**"
    ],
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    coverageReporters: [
        "text",
        "lcov"
    ],
    coverageThreshold: {
        "global": {
            "branches": 70,
            "functions": 80,
            "lines": 80,
            "statements": 80
        }
    },
    reporters: [
        "default",

        [
            "jest-junit",
            {
                "outputDirectory": "test-results",
                "outputName": "jest-junit.xml",
                "suiteName": "Financial Reports Functions Tests"
            }
        ]
    ]
};