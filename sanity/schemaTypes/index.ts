import { about } from "./about";
import { category } from "./category";
import { order } from "./order";
import { product } from "./product";
import { settings } from "./settings";

export const schemaTypes = [product, category, order, settings, about];

// Documents uniques : une seule fiche, jamais créée ni supprimée depuis l'admin.
export const singletons = ["settings", "about"];
