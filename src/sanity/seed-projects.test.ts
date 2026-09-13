import {createHash} from "node:crypto";
import {existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {join, resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {pathToFileURL} from "node:url";
import seeds from "../../content/seed-projects.json";
import {serviceSlugs} from "@/content/types";

describe("Sanity project seed data", () => {
  it("contains deterministic, bilingual, source-backed project records", () => {
    const ids = new Set<string>();
    const hashes = new Set<string>();

    for (const seed of seeds) {
      expect(seed._id).toMatch(/^project-gallery-[a-z0-9-]+$/);
      expect(ids.has(seed._id)).toBe(false);
      ids.add(seed._id);

      expect(serviceSlugs).toContain(seed.serviceCategory);
      expect(seed.title.en.trim()).not.toBe("");
      expect(seed.title.id.trim()).not.toBe("");
      expect(seed.location.trim()).not.toBe("");
      expect(Number.isInteger(seed.displayOrder)).toBe(true);
      expect(seed.images.length).toBeGreaterThan(0);

      for (const image of seed.images) {
        expect(image.alt.en.trim()).not.toBe("");
        expect(image.alt.id.trim()).not.toBe("");
        expect(image.provenance).toMatch(/^PT SUGEE company profile PDF, page \d+/);

        const assetPath = resolve(process.cwd(), image.path);
        expect(existsSync(assetPath), `${image.path} must exist`).toBe(true);

        const hash = createHash("sha1").update(readFileSync(assetPath)).digest("hex");
        expect(hashes.has(hash), `${image.path} duplicates another seed image`).toBe(false);
        hashes.add(hash);
      }
    }
  });

  it("covers all six supported service categories", () => {
    expect(new Set(seeds.map(({serviceCategory}) => serviceCategory))).toEqual(new Set(serviceSlugs));
  });

  it("does not invent completion years", () => {
    expect(seeds.every((seed) => !("completionYear" in seed))).toBe(true);
  });

  it("defaults to a credential-free dry run", () => {
    const result = spawnSync(process.execPath, [resolve(process.cwd(), "scripts/seed-sanity-projects.mjs")], {
      cwd: process.cwd(),
      encoding: "utf8",
      env: {
        ...process.env,
        NEXT_PUBLIC_SANITY_PROJECT_ID: "",
        SANITY_WRITE_TOKEN: "",
      },
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("DRY RUN — no network requests or writes");
    expect(result.stdout).toContain("Documents: 8; unique assets: 8");
  });

  it("requires explicit credentials before write mode can initialize a client", () => {
    const result = spawnSync(
      process.execPath,
      [resolve(process.cwd(), "scripts/seed-sanity-projects.mjs"), "--write"],
      {
        cwd: process.cwd(),
        encoding: "utf8",
        env: {
          ...process.env,
          NEXT_PUBLIC_SANITY_PROJECT_ID: "",
          SANITY_WRITE_TOKEN: "",
        },
      },
    );

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("NEXT_PUBLIC_SANITY_PROJECT_ID is required with --write.");
  });

  it.each([
    {
      name: "loads values from .env.local",
      processValues: {},
      expected: {projectId: "from-env-file", token: "file-token"},
    },
    {
      name: "keeps shell-exported values ahead of .env.local",
      processValues: {
        NEXT_PUBLIC_SANITY_PROJECT_ID: "from-process",
        SANITY_WRITE_TOKEN: "process-token",
      },
      expected: {projectId: "from-process", token: "process-token"},
    },
  ])("$name", ({processValues, expected}) => {
    const envDirectory = mkdtempSync(join(tmpdir(), "pt-sugee-seed-env-"));
    const loaderUrl = pathToFileURL(resolve(process.cwd(), "scripts/load-next-env.mjs")).href;
    writeFileSync(
      join(envDirectory, ".env.local"),
      "NEXT_PUBLIC_SANITY_PROJECT_ID=from-env-file\nSANITY_WRITE_TOKEN=file-token\n",
    );

    try {
      const childEnv = {...process.env};
      delete childEnv.NEXT_PUBLIC_SANITY_PROJECT_ID;
      delete childEnv.SANITY_WRITE_TOKEN;
      childEnv.NODE_ENV = "production";
      Object.assign(childEnv, processValues);

      const result = spawnSync(
        process.execPath,
        [
          "--input-type=module",
          "--eval",
          `import {loadNextEnvironment} from ${JSON.stringify(loaderUrl)}; loadNextEnvironment(process.argv[1]); console.log(JSON.stringify({projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, token: process.env.SANITY_WRITE_TOKEN}));`,
          envDirectory,
        ],
        {encoding: "utf8", env: childEnv},
      );

      expect(result.status, result.stderr).toBe(0);
      expect(JSON.parse(result.stdout.trim())).toEqual(expected);
    } finally {
      rmSync(envDirectory, {recursive: true, force: true});
    }
  });
});
