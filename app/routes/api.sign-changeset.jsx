import { json } from "@remix-run/node";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { authenticate } from "../shopify.server";
import { getSelectedOffer } from "../offer.server";

// The loader responds to preflight requests from Shopify
export const loader = async ({ request }) => {
  await authenticate.public.checkout(request);
};

// The action responds to the POST request from the extension. Make sure to use the cors helper for the request to work.
export const action = async ({ request }) => {
  const { cors } = await authenticate.public.checkout(request);

  const body = await request.json();

  console.log("getSelectedOffer", body);

  const selectedOffer = getSelectedOffer(body.changes);

  console.log("selectedOffer", selectedOffer);  

  const payload = {
    iss: process.env.SHOPIFY_API_KEY,
    jti: uuidv4(),
    iat: Date.now(),
    sub: body.referenceId,
    changes: selectedOffer?.changes,
  };

  console.log("payload", payload);

  const token = jwt.sign(payload, process.env.SHOPIFY_API_SECRET);

  console.log("token", token);

  return cors(json({ token }));
};