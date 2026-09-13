import {visionTool} from "@sanity/vision";
import {defineConfig} from "sanity";
import {structureTool} from "sanity/structure";
import {schemaTypes} from "./src/sanity/schemaTypes";
import {structure} from "./src/sanity/structure";

export default defineConfig({
  name: "default",
  title: "PT SUGEE Project Galleries",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "missing",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [structureTool({structure}), visionTool()],
  schema: {types: schemaTypes},
});
