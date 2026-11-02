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

// Pre-fills Studio's "Site Images" with the photos that ship in /public, so admins see what is live.
const siteImageSeeds = {
  homeHero: "public/images/hero/home-offshore-rig.webp",
  aboutHero: "public/images/hero/about-offshore-team.webp",
  qualityTeam: "public/images/hero/quality-machine-team.webp",
  services: {
    machineryEquipmentInstallation: "public/images/services/machinery-equipment-installation.webp",
    machineryEquipmentOverhauling: "public/images/services/machinery-equipment-overhauling.webp",
    epocast: "public/images/services/epocast.webp",
    laserAlignmentService: "public/images/services/laser-alignment-service.webp",
    inSituMachining: "public/images/services/in-situ-machining.webp",
    flangeManagement: "public/images/services/flange-management.webp",
  },
  clientLogos: [
    ["ASL", "public/images/clients/asl.png"],
    ["Siemens", "public/images/clients/siemens.png"],
    ["ST Engineering", "public/images/clients/st-engineering.png"],
    ["Keppel FELS", "public/images/clients/keppel-fels.png"],
    ["Seadrill", "public/images/clients/seadrill.png"],
    ["PaxOcean", "public/images/clients/pax-ocean.png"],
    ["Shell", "public/images/clients/shell.png"],
    ["Sembcorp Marine", "public/images/clients/sembcorp-marine.png"],
  ],
};
const siteImagePaths = [
  siteImageSeeds.homeHero,
  siteImageSeeds.aboutHero,
  siteImageSeeds.qualityTeam,
  ...Object.values(siteImageSeeds.services),
  ...siteImageSeeds.clientLogos.map(([, path]) => path),
];
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
  console.log(`Site Images (only if missing): ${siteImagePaths.length} assets`);

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

async function uploadImage(path) {
  const absolutePath = resolve(root, path);
  const hash = createHash("sha1").update(readFileSync(absolutePath)).digest("hex");
  const existingId = await client.fetch('*[_type == "sanity.imageAsset" && sha1hash == $hash][0]._id', {hash});
  const asset = existingId
    ? {_id: existingId}
    : await client.assets.upload("image", createReadStream(absolutePath), {
        filename: path.split("/").at(-1),
        contentType: contentTypes[extname(absolutePath).toLowerCase()],
      });

  console.log(`${existingId ? "Reused" : "Uploaded"} ${asset._id} for ${path}`);
  return {_type: "image", asset: {_type: "reference", _ref: asset._id}};
}

for (const {seed, images} of prepared) {
  const uploadedImages = [];

  for (const image of images) {
    const {asset} = await uploadImage(image.path);
    uploadedImages.push({
      _key: `image-${image.hash.slice(0, 16)}`,
      _type: "image",
      asset,
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

  // Never overwrite a project an admin may have edited in Studio.
  await client.createIfNotExists(document);
  console.log(`Created ${seed._id} (skipped if it already existed)`);
}

if (await client.fetch('defined(*[_id == "siteImages"][0]._id)')) {
  console.log("Site Images already exists; left untouched.");
} else {
  const services = {};
  for (const [field, path] of Object.entries(siteImageSeeds.services)) {
    services[field] = {...(await uploadImage(path)), _type: "siteImage"};
  }
  const clientLogos = [];
  for (const [name, path] of siteImageSeeds.clientLogos) {
    clientLogos.push({_key: name.toLowerCase().replace(/\W+/g, "-"), _type: "clientLogo", name, logo: await uploadImage(path)});
  }

  await client.createIfNotExists({
    _id: "siteImages",
    _type: "siteImages",
    homeHero: {...(await uploadImage(siteImageSeeds.homeHero)), _type: "siteImage"},
    aboutHero: {...(await uploadImage(siteImageSeeds.aboutHero)), _type: "siteImage"},
    qualityTeam: {...(await uploadImage(siteImageSeeds.qualityTeam)), _type: "siteImage"},
    services,
    clientLogos,
  });
  console.log("Created Site Images");
}

console.log("Sanity project-gallery seed completed.");
