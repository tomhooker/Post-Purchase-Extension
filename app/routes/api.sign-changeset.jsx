import { json } from "@remix-run/node";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { authenticate } from "../shopify.server";
import { getSelectedOffer } from "../offer.server";

// The loader responds to preflight requests from Shopify
export const loader = async ({ request }) => {
  await authenticate.public.checkout(request); // Here
};

// The action responds to the POST request from the extension. Make sure to use the cors helper for the request to work.
export const action = async ({ request }) => {
  const { cors } = await authenticate.public.checkout(request); // Here

  const body = await request.json();
  console.log("body", body);
  
  // Adjusted to access the nested offers array
  const offersArray = body.storage.initialData.offers;
  console.log("offersArray", offersArray);
  
  const offerId = body.changes;
  
  let selectedOffer; // Declare outside to widen scope

  // Now offersArray should be the actual array of offers
  if (Array.isArray(offersArray)) {
    selectedOffer = getSelectedOffer(offersArray, offerId);
    console.log("Selected Offer", selectedOffer);
  } else {
    console.error("offersArray is not an array:", offersArray);
  }
  
  // Ensure selectedOffer is defined before accessing its properties
  const payload = {
    iss: process.env.SHOPIFY_API_KEY,
    jti: uuidv4(),
    iat: Date.now(),
    sub: body.referenceId,
    changes: selectedOffer ? selectedOffer.changes : undefined, // Use conditional access
  };

  console.log("payload", payload);

  const token = jwt.sign(payload, process.env.SHOPIFY_API_SECRET);

  console.log("token", token);
  return cors(json({ token }));
};