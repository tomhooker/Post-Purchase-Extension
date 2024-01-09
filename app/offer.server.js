const OFFERS = [
    {
      id: 1,
      title: "One time offer",
      productTitle: "The S-Series Snowboard",
      productImageURL:
        "https://cdn.shopify.com/s/files/1/0647/4658/6291/products/snowboard_wax.png?v=1704557943", // Replace this with the product image's URL.
      productDescription: ["This PREMIUM snowboard is so SUPER DUPER awesome!"],
      originalPrice: "699.95",
      discountedPrice: "699.95",
      changes: [
        {
          type: "add_variant",
          variantID: 42939514028211, // Replace with the variant ID.
          quantity: 1,
          discount: {
            value: 15,
            valueType: "percentage",
            title: "15% off",
          },
        },
      ],
    },
    {
      id: 2,
      title: "SECOND!! time offer",
      productTitle: "SECOND!! S-Series Snowboard",
      productImageURL:
        "https://cdn.shopify.com/s/files/1/0647/4658/6291/products/snowboard_wax.png?v=1704557943", // Replace this with the product image's URL.
      productDescription: ["This SECOND PRODUCT"],
      originalPrice: "699.95",
      discountedPrice: "699.95",
      changes: [
        {
          type: "add_variant",
          variantID: 42939514028211, // Replace with the variant ID.
          quantity: 1,
          discount: {
            value: 90,
            valueType: "percentage",
            title: "90% off",
          },
        },
      ],
    }
  ];
  
  /*
   * For testing purposes, product information is hardcoded.
   * In a production application, replace this function with logic to determine
   * what product to offer to the customer.
   */
  export function getOffers() {
    return OFFERS;
  }
  
  /*
   * Retrieve discount information for the specific order on the backend instead of relying
   * on the discount information that is sent from the frontend.
   * This is to ensure that the discount information is not tampered with.
   */
  export function getSelectedOffer(offerId) {
    return OFFERS.find((offer) => offer.id === offerId);
  }  