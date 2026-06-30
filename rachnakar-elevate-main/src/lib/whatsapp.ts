export const WHATSAPP_NUMBER = "919284400646";
export const SITE_DOMAIN = "https://rachnakar.studio";

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function productBuyUrl(opts: {
  productName: string;
  categoryName: string;
  productId: string;
  url: string;
  isCustom?: boolean;
}) {
  if (opts.isCustom) {
    return whatsappUrl(
      "Hello, I would like to create a custom CNC design. I am attaching my design reference.",
    );
  }
  const lines = [
    "Hello Rachnakar Design Studio, I would like to purchase this CNC design.",
    ``,
    `Product: ${opts.productName}`,
    `Category: ${opts.categoryName}`,
    `Product ID: ${opts.productId}`,
    `Link: ${opts.url}`,
  ];
  return whatsappUrl(lines.join("\n"));
}

export function siteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") return `${window.location.origin}${normalizedPath}`;
  return `${SITE_DOMAIN}${normalizedPath}`;
}
