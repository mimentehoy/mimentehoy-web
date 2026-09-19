export const shopifyStoreUrl =
  process.env.NEXT_PUBLIC_SHOPIFY_URL || "https://mimentehoy.myshopify.com";

export const getShopifyProductUrl = (productSlug?: string) => {
  if (!productSlug) return shopifyStoreUrl;
  return `${shopifyStoreUrl}/products/${productSlug}`;
};
