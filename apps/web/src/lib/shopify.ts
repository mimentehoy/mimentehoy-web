// Shopify Storefront API integration.
//
// MIMENTEHOY does not rebuild Shopify's commerce engine — this file only
// reads product data (title, price, image, description) via the Storefront
// API for display, and links out to Shopify's own hosted product page for
// checkout. No cart, no payment data, no order handling lives here.
//
// Until SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN are set,
// every function below returns null so callers can fall back to the local
// placeholder product list (see src/data/site.ts) — same fallback pattern
// used for the DB and the newsletter/MailerLite integration.

export const shopifyStoreUrl =
  process.env.NEXT_PUBLIC_SHOPIFY_URL || "https://mimentehoy.myshopify.com";

export const getShopifyProductUrl = (productSlug?: string) => {
  if (!productSlug) return shopifyStoreUrl;
  return `${shopifyStoreUrl}/products/${productSlug}`;
};

export type ShopifyProduct = {
  handle: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  image: string | null;
  productUrl: string;
  tag: string;
};

const isStorefrontConfigured = () =>
  Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);

const storefrontFetch = async (query: string, variables?: Record<string, unknown>) => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.SHOPIFY_API_VERSION || "2024-10";

  if (!domain || !token) return null;

  try {
    const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      // Product data changes rarely enough that a short revalidate window
      // keeps the storefront fast without going fully static.
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (json.errors) {
      console.error("Shopify Storefront API error:", json.errors);
      return null;
    }
    return json.data;
  } catch (error) {
    console.error("Shopify Storefront API request failed:", error);
    return null;
  }
};

const PRODUCT_FIELDS = `
  handle
  title
  description
  tags
  onlineStoreUrl
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  images(first: 1) {
    edges {
      node {
        url
      }
    }
  }
`;

type RawShopifyProduct = {
  handle: string;
  title: string;
  description: string;
  tags: string[];
  onlineStoreUrl: string | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: { node: { url: string } }[] };
};

const mapProduct = (raw: RawShopifyProduct): ShopifyProduct => ({
  handle: raw.handle,
  title: raw.title,
  description: raw.description,
  price: raw.priceRange.minVariantPrice.amount,
  currency: raw.priceRange.minVariantPrice.currencyCode,
  image: raw.images.edges[0]?.node.url ?? null,
  productUrl: raw.onlineStoreUrl || getShopifyProductUrl(raw.handle),
  tag: raw.tags[0] || "Producto",
});

/** Returns null (not an empty array) when Shopify isn't configured or the request fails, so callers can tell "no products" apart from "not connected yet". */
export const getShopifyProducts = async (): Promise<ShopifyProduct[] | null> => {
  if (!isStorefrontConfigured()) return null;

  const data = await storefrontFetch(`
    query Products {
      products(first: 20, sortKey: TITLE) {
        edges {
          node { ${PRODUCT_FIELDS} }
        }
      }
    }
  `);

  if (!data?.products) return null;
  return data.products.edges.map((edge: { node: RawShopifyProduct }) => mapProduct(edge.node));
};

export const getShopifyProductByHandle = async (handle: string): Promise<ShopifyProduct | null> => {
  if (!isStorefrontConfigured()) return null;

  const data = await storefrontFetch(
    `
    query Product($handle: String!) {
      productByHandle(handle: $handle) { ${PRODUCT_FIELDS} }
    }
  `,
    { handle },
  );

  if (!data?.productByHandle) return null;
  return mapProduct(data.productByHandle);
};
