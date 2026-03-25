import { createImageUrlBuilder } from "@sanity/image-url";
import { PortableText as BasePortableText } from "@portabletext/react";
import { config } from "./config";
import { portableTextComponents } from "./portableTextComponents";

export const urlFor = (source) => createImageUrlBuilder(config).image(source);

// Wrapper that provides default components and accepts legacy `blocks` prop
export function PortableText({ blocks, value, ...props }) {
  return (
    <BasePortableText
      value={value || blocks}
      components={portableTextComponents}
      {...props}
    />
  );
}
