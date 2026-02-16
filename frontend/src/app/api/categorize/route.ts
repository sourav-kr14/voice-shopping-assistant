import { NextResponse } from "next/server";
import OpenAI from "openai";

const allowedCategories = [
  "Dairy",
  "Produce",
  "Snacks",
  "Bakery",
  "Grains",
  "Beverages",
  "Household",
  "Others",
];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json({ category: "Others" });
    }

    const { item } = await req.json();

    if (!item) {
      return NextResponse.json({ category: "Others" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You categorize grocery items into ONLY one of these categories: Dairy, Produce, Snacks, Bakery, Grains, Beverages, Household, Others. Respond with ONLY the category name. No punctuation. No explanation.",
        },
        {
          role: "user",
          content: item,
        },
      ],
      temperature: 0,
    });

    let category =
      response.choices[0]?.message?.content?.trim() || "Others";

    // 🔥 Clean possible punctuation
    category = category.replace(".", "").trim();

    // 🔥 Ensure it's one of allowed categories
    if (!allowedCategories.includes(category)) {
      category = "Others";
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Categorization error:", error);
    return NextResponse.json({ category: "Others" });
  }
}
