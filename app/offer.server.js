export async function getOffers(accessToken, firstProductID) {
  const productId = `gid://shopify/Product/${firstProductID}`;
  
  // Step 1: Fetch metafields
  const metafieldsQuery = `
    query {
      product(id: "${productId}") {
        metafields(first: 2, keys: ["custom.upsell", "custom.downsell"]) {
          edges {
            node {
              key
              value
            }
          }
        }
      }
    }
  `;
  
  // Assume fetchGraphQL is a function that sends the GraphQL query to Shopify's API.
  const metafieldsResponse = await fetchGraphQL(accessToken, metafieldsQuery);
  console.log("metafieldsResponse", metafieldsResponse.data.product.metafields.edges);

  const metafields = metafieldsResponse.data.product.metafields.edges.map(edge => edge.node);
  console.log("metafields", metafields);
  
  const offers = await Promise.all(metafields.map(async (metafield) => {
    // Step 2: Fetch variant details based on metafield value
    const variantQuery = `
      query {
        productVariant(id: "${metafield.value}") {
          product {
            description
            title
            featuredMedia {
              preview {
                image {
                  url
                }
              }
            }
          }
          title
          price
          id
        }
      }
    `;
    
    const variantResponse = await fetchGraphQL(accessToken, variantQuery);
    console.log("variantResponse", variantResponse.data.productVariant.product.featuredMedia);
    
    const variant = variantResponse.data.productVariant;
    const variantID = variant.id.split("/")[4];
    
    // Step 3: Format the data into OFFERS structure
    return {
      id: metafield.key === "custom.upsell" ? 1 : 2, // Assuming the ID is based on the metafield key
      title: metafield.key === "custom.upsell" ? "One time offer" : "SECOND!! time offer",
      productTitle: variant.product.title,
      productImageURL: variant.product.featuredMedia.preview.image.url,
      productDescription: [variant.product.description],
      originalPrice: variant.price,
      discountedPrice: variant.price, // Modify this based on your discount logic
      changes: [
        {
          type: "add_variant",
          variantID: variantID,
          quantity: 1,
          discount: {
            value: metafield.key === "custom.upsell" ? 15 : 90, // Example discount values
            valueType: "percentage",
            title: `${metafield.key === "custom.upsell" ? 15 : 90}% off`,
          },
        },
      ],
    };
  }));
  
  console.log("offers sever js", offers);
  return offers;
}

// Helper function to send GraphQL queries to Shopify
async function fetchGraphQL(accessToken, query) {
  const response = await fetch('https://otrcheckout.myshopify.com/admin/api/2024-01/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({ query }),
  });
  return response.json();
}

export function getSelectedOffer(offers, offerId) {
  return offers.find((offer) => offer.id === offerId);
} 