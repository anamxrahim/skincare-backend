import "dotenv/config";
import mongoose from "mongoose";

import productModel from "./models/product-model.js";

const products = [
  {
    name: "Niacinamide 10% + Zinc 1%",
    slug: "niacinamide-10-zinc-1",
    category: "serum",
    concerns: ["acne", "large pores", "oiliness"],
    skinTypes: ["oily", "combination"],
    keyIngredients: ["Niacinamide 10%", "Zinc 1%"],
    description:
      "A lightweight serum that helps control excess oil and improve the appearance of pores.",
    howToUse: {
      time: "AM/PM",
      step: "Apply a few drops to clean skin before moisturizer."
    },
    size: "30ml",
    price: 2950,
    images: ["/images/niacinamide-serum.jpg"],
    stock: 20,
    isFeatured: true
  },

  {
    name: "Hyaluronic Acid 2% + B5",
    slug: "hyaluronic-acid-2-b5",
    category: "serum",
    concerns: ["dryness", "dehydration"],
    skinTypes: ["dry", "normal", "combination"],
    keyIngredients: ["Hyaluronic Acid", "Vitamin B5", "Ceramides"],
    description:
      "A hydrating serum that helps plump the skin and improve moisture retention.",
    howToUse: {
      time: "AM/PM",
      step: "Apply a few drops to clean skin and follow with moisturizer."
    },
    size: "30ml",
    price: 3450,
    images: ["/images/hyaluronic-acid-serum.jpg"],
    stock: 20,
    isFeatured: true
  },

  {
    name: "Natural Moisturizing Factors + HA",
    slug: "natural-moisturizing-factors-ha",
    category: "moisturizer",
    concerns: ["dryness", "dehydration", "skin barrier"],
    skinTypes: ["dry", "normal", "oily", "combination"],
    keyIngredients: ["Amino Acids", "Hyaluronic Acid", "Natural Moisturizing Factors"],
    description:
      "A daily moisturizer that helps hydrate skin and support its natural moisture barrier.",
    howToUse: {
      time: "AM/PM",
      step: "Apply to the face after serums as the final moisturizing step."
    },
    size: "30ml",
    price: 4250,
    images: ["/images/natural-moisturizing-factors.jpg"],
    stock: 20,
    isFeatured: true
  },

  {
    name: "Glycolic Acid 7% Exfoliating Toner",
    slug: "glycolic-acid-7-exfoliating-toner",
    category: "toner",
    concerns: ["uneven texture", "dullness", "uneven skin tone"],
    skinTypes: ["normal", "combination", "oily"],
    keyIngredients: ["Glycolic Acid 7%"],
    description:
      "An exfoliating toner that helps improve the look of skin texture and radiance.",
    howToUse: {
      time: "PM",
      step: "Apply to clean, dry skin in the evening and follow with moisturizer. Avoid the eye area."
    },
    size: "100ml",
    price: 5799,
    images: ["/images/glycolic-acid-toner.jpg"],
    stock: 15,
    isFeatured: true
  },

  {
    name: "Azelaic Acid Suspension 10%",
    slug: "azelaic-acid-suspension-10",
    category: "serum",
    concerns: ["uneven skin tone", "texture", "dullness"],
    skinTypes: ["normal", "oily", "combination"],
    keyIngredients: ["Azelaic Acid 10%"],
    description:
      "A lightweight cream-like treatment that helps brighten the look of skin and improve uneven texture.",
    howToUse: {
      time: "AM/PM",
      step: "Apply a small amount after water-based serums. Use sunscreen during the day."
    },
    size: "30ml",
    price: 5199,
    images: ["/images/azelaic-acid.jpg"],
    stock: 15,
    isFeatured: true
  },

  {
    name: "Squalane Cleanser",
    slug: "squalane-cleanser",
    category: "cleanser",
    concerns: ["dryness", "makeup removal", "impurities"],
    skinTypes: ["dry", "normal", "combination", "oily"],
    keyIngredients: ["Squalane", "Cleansing Esters"],
    description:
      "A gentle cleanser that removes makeup, dirt and impurities while helping keep skin soft.",
    howToUse: {
      time: "AM/PM",
      step: "Massage onto dry skin, add water to emulsify, then rinse thoroughly."
    },
    size: "50ml",
    price: 4499,
    images: ["/images/squalane-cleanser.jpg"],
    stock: 20,
    isFeatured: true
  },

  {
    name: "Salicylic Acid 2% Solution",
    slug: "salicylic-acid-2-solution",
    category: "serum",
    concerns: ["acne", "clogged pores", "blemishes"],
    skinTypes: ["oily", "combination"],
    keyIngredients: ["Salicylic Acid 2%"],
    description:
      "A targeted exfoliating serum that helps unclog pores and improve the appearance of blemishes.",
    howToUse: {
      time: "PM",
      step: "Apply a small amount to clean skin as tolerated, then follow with moisturizer."
    },
    size: "30ml",
    price: 3850,
    images: ["/images/salicylic-acid-serum.jpg"],
    stock: 15,
    isFeatured: true
  },

  {
    name: "Caffeine Solution 5% + EGCG",
    slug: "caffeine-solution-5-egcg",
    category: "serum",
    concerns: ["puffiness", "dark circles"],
    skinTypes: ["normal", "dry", "oily", "combination"],
    keyIngredients: ["Caffeine 5%", "EGCG"],
    description:
      "An eye serum that helps reduce the appearance of under-eye puffiness and dark circles.",
    howToUse: {
      time: "AM/PM",
      step: "Apply a small amount around the eye contour, avoiding direct contact with the eyes."
    },
    size: "30ml",
    price: 3350,
    images: ["/images/caffeine-solution.jpg"],
    stock: 15,
    isFeatured: true
  }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.dbUrl);

        console.log("Connected to MongoDB");

        const newProducts = [];

        for (const product of products) {
            const existingProduct = await productModel.findOne({
                slug: product.slug
            });

            if (!existingProduct) {
                newProducts.push(product);
            }
        }

        if (newProducts.length > 0) {
            const result = await productModel.insertMany(newProducts);

            console.log(
                `${result.length} new products added successfully`
            );
        } else {
            console.log("All products already exist");
        }

    } catch (err) {
        console.error("Seed failed:", err.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();

        console.log("MongoDB connection closed");
    }
};

seedDatabase();

export default products;