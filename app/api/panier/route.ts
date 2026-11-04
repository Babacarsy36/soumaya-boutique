import { NextResponse } from "next/server";
import { getProduct } from "@/lib/catalogue";

// Renvoie les prix, noms et photos actuels des articles d'une liste de commande gardée dans le navigateur.
export async function POST(request: Request) {
  let lines: { slug?: unknown; option?: unknown }[];
  try {
    lines = (await request.json()).lines;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!Array.isArray(lines) || lines.length > 30) return NextResponse.json({ ok: false }, { status: 400 });

  const current = await Promise.all(
    lines.map(async (line) => {
      const product = typeof line?.slug === "string" ? await getProduct(line.slug) : undefined;
      if (!product || !product.inStock) return null;
      const choice = product.option?.choices.find((c) => c.label === line.option);
      if (product.option && !choice) return null;
      return { name: product.name, price: choice?.price ?? product.price, image: product.images[0] };
    }),
  );
  return NextResponse.json({ ok: true, lines: current });
}
