import nextConfig from "./next.config";

describe("Next.js PostHog Rewrite Configuration", () => {
  let rewrites: any[];

  beforeAll(async () => {
    if (typeof nextConfig.rewrites === "function") {
      rewrites = await nextConfig.rewrites();
    }
  });

  describe("PostHog /ingest/:path* rewrite rule", () => {
    it("should have a rewrite rule for /ingest/:path*", () => {
      const ingestRule = rewrites.find(
        (rule) => rule.source === "/ingest/:path*"
      );

      expect(ingestRule).toBeDefined();
    });

    it("should rewrite /ingest/:path* to the correct PostHog destination", () => {
      const ingestRule = rewrites.find(
        (rule) => rule.source === "/ingest/:path*"
      );

      expect(ingestRule?.destination).toBe("https://us.i.posthog.com/:path*");
    });

    it("should correctly configure the /ingest/:path* rewrite rule", () => {
      const ingestRule = rewrites.find(
        (rule) => rule.source === "/ingest/:path*"
      );

      expect(ingestRule).toEqual({
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      });
    });
  });

  describe("PostHog /ingest/static/:path* rewrite rule", () => {
    it("should have a rewrite rule for /ingest/static/:path*", () => {
      const staticRule = rewrites.find(
        (rule) => rule.source === "/ingest/static/:path*"
      );

      expect(staticRule).toBeDefined();
    });

    it("should rewrite /ingest/static/:path* to the correct PostHog assets destination", () => {
      const staticRule = rewrites.find(
        (rule) => rule.source === "/ingest/static/:path*"
      );

      expect(staticRule?.destination).toBe(
        "https://us-assets.i.posthog.com/static/:path*"
      );
    });

    it("should correctly configure the /ingest/static/:path* rewrite rule", () => {
      const staticRule = rewrites.find(
        (rule) => rule.source === "/ingest/static/:path*"
      );

      expect(staticRule).toEqual({
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      });
    });
  });

  describe("PostHog rewrite rules order", () => {
    it("should place /ingest/static/:path* before /ingest/:path* to avoid conflicts", () => {
      const staticRuleIndex = rewrites.findIndex(
        (rule) => rule.source === "/ingest/static/:path*"
      );
      const ingestRuleIndex = rewrites.findIndex(
        (rule) => rule.source === "/ingest/:path*"
      );

      expect(staticRuleIndex).toBeLessThan(ingestRuleIndex);
    });
  });

  describe("Complete rewrite configuration", () => {
    it("should have exactly 2 PostHog-related rewrite rules", () => {
      const posthogRules = rewrites.filter((rule) =>
        rule.source.startsWith("/ingest")
      );

      expect(posthogRules).toHaveLength(2);
    });

    it("should include all required rewrite rules", () => {
      const sources = rewrites.map((rule) => rule.source);

      expect(sources).toContain("/ingest/static/:path*");
      expect(sources).toContain("/ingest/:path*");
    });
  });

  describe("Next.js configuration for PostHog", () => {
    it("should have skipTrailingSlashRedirect enabled for PostHog", () => {
      expect(nextConfig.skipTrailingSlashRedirect).toBe(true);
    });
  });
});
