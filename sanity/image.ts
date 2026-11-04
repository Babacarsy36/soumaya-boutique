import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId: projectId || "missing", dataset });

export function imageUrl(source: SanityImageSource | null | undefined, width = 1600) {
  return source ? builder.image(source).width(width).fit("max").auto("format").url() : undefined;
}
