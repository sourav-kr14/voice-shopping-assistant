import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { item } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You categorize grocery items into one of these categories: Dairy, Produce, Snacks, Bakery, Grains, Beverages, Household, Others. Return only the category name.",
        },
        {
          role: "user",
          content: `Item: ${item}`,
        },
      ],
      temperature: 0,
    });

    const category = response.choices[0].message.content?.trim();

    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json(
      { category: "Others" },
      { status: 200 }
    );
  }
}
