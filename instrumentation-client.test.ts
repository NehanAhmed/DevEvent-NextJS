import posthog from "posthog-js";

// Mock posthog-js
jest.mock("posthog-js", () => ({
  init: jest.fn(),
}));

describe("PostHog Client Initialization", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset modules to ensure fresh import
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("PostHog initialization with correct hosts", () => {
    it("should initialize PostHog with the correct API host", () => {
      process.env.NEXT_PUBLIC_POSTHOG_KEY = "test-key";
      process.env.NODE_ENV = "production";

      require("./instrumentation-client");

      expect(posthog.init).toHaveBeenCalledWith(
        "test-key",
        expect.objectContaining({
          api_host: "/ingest",
        })
      );
    });

    it("should initialize PostHog with the correct UI host", () => {
      process.env.NEXT_PUBLIC_POSTHOG_KEY = "test-key";
      process.env.NODE_ENV = "production";

      require("./instrumentation-client");

      expect(posthog.init).toHaveBeenCalledWith(
        "test-key",
        expect.objectContaining({
          ui_host: "https://us.posthog.com",
        })
      );
    });

    it("should initialize PostHog with both correct API host and UI host", () => {
      process.env.NEXT_PUBLIC_POSTHOG_KEY = "test-key";
      process.env.NODE_ENV = "production";

      require("./instrumentation-client");

      expect(posthog.init).toHaveBeenCalledWith(
        "test-key",
        expect.objectContaining({
          api_host: "/ingest",
          ui_host: "https://us.posthog.com",
        })
      );
    });
  });

  describe("PostHog exception capturing", () => {
    it("should configure PostHog to capture exceptions", () => {
      process.env.NEXT_PUBLIC_POSTHOG_KEY = "test-key";
      process.env.NODE_ENV = "production";

      require("./instrumentation-client");

      expect(posthog.init).toHaveBeenCalledWith(
        "test-key",
        expect.objectContaining({
          capture_exceptions: true,
        })
      );
    });
  });

  describe("PostHog debug mode based on environment", () => {
    it("should enable debug mode in development environment", () => {
      process.env.NEXT_PUBLIC_POSTHOG_KEY = "test-key";
      process.env.NODE_ENV = "development";

      require("./instrumentation-client");

      expect(posthog.init).toHaveBeenCalledWith(
        "test-key",
        expect.objectContaining({
          debug: true,
        })
      );
    });

    it("should disable debug mode in production environment", () => {
      process.env.NEXT_PUBLIC_POSTHOG_KEY = "test-key";
      process.env.NODE_ENV = "production";

      require("./instrumentation-client");

      expect(posthog.init).toHaveBeenCalledWith(
        "test-key",
        expect.objectContaining({
          debug: false,
        })
      );
    });

    it("should disable debug mode in test environment", () => {
      process.env.NEXT_PUBLIC_POSTHOG_KEY = "test-key";
      process.env.NODE_ENV = "test";

      require("./instrumentation-client");

      expect(posthog.init).toHaveBeenCalledWith(
        "test-key",
        expect.objectContaining({
          debug: false,
        })
      );
    });
  });

  describe("Complete PostHog configuration", () => {
    it("should initialize PostHog with all correct configuration options", () => {
      process.env.NEXT_PUBLIC_POSTHOG_KEY = "test-key";
      process.env.NODE_ENV = "development";

      require("./instrumentation-client");

      expect(posthog.init).toHaveBeenCalledTimes(1);
      expect(posthog.init).toHaveBeenCalledWith("test-key", {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
        defaults: "2025-05-24",
        capture_exceptions: true,
        debug: true,
      });
    });
  });
});
