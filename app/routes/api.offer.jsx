import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getOffers } from "../offer.server";
import db from "../db.server";

// The loader responds to preflight requests from Shopify
export const loader = async ({ request }) => {
  await authenticate.public.checkout(request); // Here
};

// The action responds to the POST request from the extension. Make sure to use the cors helper for the request to work.
export const action = async ({ request }) => {
  const { cors, sessionToken } = await authenticate.public.checkout(request);
  console.log("productID", sessionToken.input_data.initialPurchase.lineItems[0].product.id);

  const shop = sessionToken.input_data.shop.domain;
  console.log("shop", shop);

  
  const firstProductID = sessionToken.input_data.initialPurchase.lineItems[0].product.id;
  console.log("sessionToken.input_data", sessionToken.input_data.initialPurchase);
  console.log("firstProductID", firstProductID);  

  const session = await db.session.findUnique({
    where: { shop: shop },
    select: { accessToken: true }
   });
   const accessToken = session.accessToken
   console.log("accessToken", accessToken);

  const offers = await getOffers(accessToken, firstProductID);

  console.log("offers", offers);
  return cors(json({ offers }));
};