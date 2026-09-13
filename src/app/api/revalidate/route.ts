import {revalidateTag} from "next/cache";
import type {NextRequest} from "next/server";
import {isValidSignature} from "@sanity/webhook";
import {parseBody} from "next-sanity/webhook";

interface ProjectGalleryWebhookBody {
  _type?: string;
}

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ok: false, error: "Webhook is not configured."}, {status: 500});
  }

  const verificationRequest = request.clone();
  let parsed: Awaited<ReturnType<typeof parseBody<ProjectGalleryWebhookBody>>>;

  try {
    parsed = await parseBody<ProjectGalleryWebhookBody>(request as NextRequest, secret);
  } catch {
    const signature = verificationRequest.headers.get("sanity-webhook-signature");

    if (!signature) {
      return Response.json({ok: false, error: "Invalid signature."}, {status: 401});
    }

    try {
      const body = await verificationRequest.text();
      const hasValidSignature = await isValidSignature(body, signature, secret);
      const status = hasValidSignature ? 400 : 401;
      const error = hasValidSignature ? "Malformed webhook body." : "Invalid signature.";
      return Response.json({ok: false, error}, {status});
    } catch {
      return Response.json({ok: false, error: "Invalid signature."}, {status: 401});
    }
  }

  const {body, isValidSignature: hasValidSignature} = parsed;

  if (!hasValidSignature) {
    return Response.json({ok: false, error: "Invalid signature."}, {status: 401});
  }

  if (body?._type !== "projectGallery") {
    return Response.json({ok: false, error: "Unsupported webhook body."}, {status: 400});
  }

  revalidateTag("projectGallery", "max");
  return Response.json({ok: true, revalidated: "projectGallery"});
}
