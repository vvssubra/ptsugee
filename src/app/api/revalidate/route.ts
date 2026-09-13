import {revalidateTag} from "next/cache";
import type {NextRequest} from "next/server";
import {parseBody} from "next-sanity/webhook";

interface ProjectGalleryWebhookBody {
  _type?: string;
}

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ok: false, error: "Webhook is not configured."}, {status: 500});
  }

  const {body, isValidSignature} = await parseBody<ProjectGalleryWebhookBody>(request as NextRequest, secret);

  if (!isValidSignature) {
    return Response.json({ok: false, error: "Invalid signature."}, {status: 401});
  }

  if (body?._type !== "projectGallery") {
    return Response.json({ok: false, error: "Unsupported webhook body."}, {status: 400});
  }

  revalidateTag("projectGallery", "max");
  return Response.json({ok: true, revalidated: "projectGallery"});
}
