import { json } from "@remix-run/node";

import { authenticate } from "../shopify.server";
import { getOffers } from "../offer.server";

// The loader responds to preflight requests from Shopify
export const loader = async ({ request }) => {
  await authenticate.public.checkout(request);
};

// The action responds to the POST request from the extension. Make sure to use the cors helper for the request to work.
export const action = async ({ request }) => {
  const { cors } = await authenticate.public.checkout(request);

  const offers = getOffers();
  return cors(json({ offers }));
};