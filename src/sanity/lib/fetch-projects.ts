import type {Locale} from "@/i18n/routing";
import type {ServiceSlug} from "@/content/types";
import {isSanityConfigured, sanityClient} from "./client";
import {featuredProjectsQuery, projectsByServiceQuery} from "./queries";

export interface ProjectGalleryImage {
  key: string;
  alt: string;
  caption?: string;
  asset: {
    id: string;
    url: string;
    width: number;
    height: number;
    aspectRatio: number;
    lqip?: string;
  };
}

export interface ProjectGallery {
  id: string;
  title: string;
  serviceCategory: ServiceSlug;
  location: string;
  completionYear?: number;
  displayOrder: number;
  featured: boolean;
  images: ProjectGalleryImage[];
}

export type ProjectGalleryResult =
  | {status: "ready"; projects: ProjectGallery[]}
  | {status: "empty"; projects: []}
  | {status: "unavailable"; projects: []};

export interface SanityReadClient {
  fetch<T>(query: string, params: Record<string, unknown>, options: {next: {tags: string[]}}): Promise<T>;
}

async function readProjects(
  client: SanityReadClient,
  query: string,
  params: Record<string, unknown>,
): Promise<ProjectGalleryResult> {
  try {
    const projects = await client.fetch<ProjectGallery[]>(query, params, {
      next: {tags: ["projectGallery"]},
    });

    return projects.length ? {status: "ready", projects} : {status: "empty", projects: []};
  } catch {
    return {status: "unavailable", projects: []};
  }
}

export function createProjectGalleryReader(client: SanityReadClient) {
  return {
    getFeaturedProjects(locale: Locale) {
      return readProjects(client, featuredProjectsQuery, {locale});
    },
    getProjectsByService(service: ServiceSlug, locale: Locale) {
      return readProjects(client, projectsByServiceQuery, {locale, service});
    },
  };
}

const reader = createProjectGalleryReader(sanityClient);

export function getFeaturedProjects(locale: Locale): Promise<ProjectGalleryResult> {
  if (!isSanityConfigured) return Promise.resolve({status: "unavailable", projects: []});
  return reader.getFeaturedProjects(locale);
}

export function getProjectsByService(service: ServiceSlug, locale: Locale): Promise<ProjectGalleryResult> {
  if (!isSanityConfigured) return Promise.resolve({status: "unavailable", projects: []});
  return reader.getProjectsByService(service, locale);
}
