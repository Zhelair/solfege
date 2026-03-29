import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "solfege",
    short_name: "solfege",
    description: "Reference-driven AI music studio for remixing, generating, and learning.",
    start_url: "/",
    display: "standalone",
    background_color: "#090712",
    theme_color: "#090712",
    lang: "en",
    icons: [
      {
        src: "/icon?size=192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon?size=512",
        sizes: "512x512",
        type: "image/png",
      }
    ]
  };
}