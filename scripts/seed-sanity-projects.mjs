#!/usr/bin/env node

import {createHash} from "node:crypto";
import {createReadStream, readFileSync, statSync} from "node:fs";
import {extname, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {loadNextEnvironment} from "./load-next-env.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const seedFile = resolve(root, "content/seed-projects.json");
const args = new Set(process.argv.slice(2));
const allowedArgs = new Set(["--dry-run", "--write"]);

for (const arg of args) {
  if (!allowedArgs.has(arg)) {
    throw new Error(`Unknown option: ${arg}. Use --dry-run (default) or --write.`);
  }
}

if (args.has("--dry-run") && args.has("--write")) {
  throw new Error("Choose either --dry-run or --write, not both.");
}

const write = args.has("--write");
const seeds = JSON.parse(readFileSync(seedFile, "utf8"));
const seenHashes = new Set();

const prepared = seeds.map((seed) => ({
  seed,
  images: seed.images.map((image) => {
    const absolutePath = resolve(root, image.path);
    const bytes = readFileSync(absolutePath);
    const hash = createHash("sha1").update(bytes).digest("hex");

    if (seenHashes.has(hash)) {
      throw new Error(`Duplicate seed image content: ${image.path} (${hash})`);
    }
    seenHashes.add(hash);

    return {
      ...image,
      absolutePath,
      bytes: statSync(absolutePath).size,
      hash,
    };
  }),
}));

function describePlan() {
  const mode = write ? "WRITE" : "DRY RUN — no network requests or writes";
  console.log(`Sanity project-gallery seed: ${mode}`);
  console.log(`Documents: ${prepared.length}; unique assets: ${seenHashes.size}`);

  for (const {seed, images} of prepared) {
    console.log(`- ${seed._id} | ${seed.serviceCategory} | ${seed.location}`);
    for (const image of images) {
      console.log(`  asset ${image.hash} | ${image.bytes} bytes | ${image.path}`);
    }
  }
}

describePlan();

if (!write) {
  process.exit(0);
}

loadNextEnvironment(root);

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2026-09-13";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required with --write.");
}
if (!token) {
  throw new Error("SANITY_WRITE_TOKEN is required with --write.");
}

const {createClient} = await import("next-sanity");
const client = createClient({projectId, dataset, apiVersion, token, useCdn: false});

const contentTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

for (const {seed, images} of prepared) {
  const uploadedImages = [];

  for (const image of images) {
    const existingId = await client.fetch(
      '*[_type == "sanity.imageAsset" && sha1hash == $hash][0]._id',
      {hash: image.hash},
    );
    const asset = existingId
      ? {_id: existingId}
      : await client.assets.upload("image", createReadStream(image.absolutePath), {
          filename: image.path.split("/").at(-1),
          contentType: contentTypes[extname(image.absolutePath).toLowerCase()],
        });

    console.log(`${existingId ? "Reused" : "Uploaded"} ${asset._id} for ${image.path}`);
    uploadedImages.push({
      _key: `image-${image.hash.slice(0, 16)}`,
      _type: "image",
      asset: {_type: "reference", _ref: asset._id},
      alt: image.alt,
      ...(image.caption ? {caption: image.caption} : {}),
    });
  }

  const document = {
    _id: seed._id,
    _type: "projectGallery",
    title: seed.title,
    serviceCategory: seed.serviceCategory,
    location: seed.location,
    ...(seed.completionYear ? {completionYear: seed.completionYear} : {}),
    displayOrder: seed.displayOrder,
    featured: seed.featured,
    images: uploadedImages,
  };

  await client.createOrReplace(document);
  console.log(`Created or replaced ${seed._id}`);
}

console.log("Sanity project-gallery seed completed.");
