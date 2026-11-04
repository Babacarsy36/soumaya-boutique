import { NextResponse } from "next/server";
import { getProduct } from "@/lib/catalogue";
import { isOrderRef, type OrderRequest } from "@/lib/format";
import { writeClient } from "@/sanity/writeClient";

const MAX_LINES = 30;
const MAX_QUANTITY = 99;

// Limite simple par adresse IP, pour freiner les envois automatiques.
const recent = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 10;
}

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(request: Request) {
  if (!writeClient) return NextResponse.json({ ok: false, error: "non configuré" }, { status: 503 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (tooMany(ip)) return NextResponse.json({ ok: false, error: "trop de commandes" }, { status: 429 });

  let body: Partial<OrderRequest>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return NextResponse.json({ ok: false, error: "format" }, { status: 400 });
  }

  // Champ invisible pour les humains : rempli, c'est un robot.
  if (body.website) return NextResponse.json({ ok: true });
  if (!isOrderRef(body.ref) || !Array.isArray(body.lines) || body.lines.length === 0 || body.lines.length > MAX_LINES) {
    return NextResponse.json({ ok: false, error: "commande invalide" }, { status: 400 });
  }

  // Les prix viennent du catalogue, jamais du navigateur.
  const lines = [];
  for (const [i, line] of body.lines.entries()) {
    const quantity = Number(line?.quantity);
    const product = typeof line?.slug === "string" ? await getProduct(line.slug) : undefined;
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) continue;
    const choice = product.option?.choices.find((c) => c.label === line.option);
    if (product.option && !choice) continue;
    lines.push({
      _key: `l${i}`,
      _type: "line",
      name: product.name,
      slug: product.slug,
      option: choice?.label,
      quantity,
      price: choice?.price ?? product.price,
    });
  }
  if (lines.length === 0) return NextResponse.json({ ok: false, error: "aucun article valide" }, { status: 400 });

  // L'identifiant « commandes.XXX » rend le document privé : illisible sans connexion, même dans un dataset public.
  await writeClient.createIfNotExists({
    _id: `commandes.${body.ref}`,
    _type: "order",
    reference: body.ref,
    status: "nouvelle",
    customerName: text(body.customer?.name, 80),
    city: text(body.customer?.city, 120),
    note: text(body.customer?.note, 500),
    lines,
    total: lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
  });

  return NextResponse.json({ ok: true, ref: body.ref });
}
