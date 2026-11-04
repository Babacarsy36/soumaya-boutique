import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="eyebrow">Page introuvable</p>
      <h1 className="mt-3 font-display text-5xl">Cette page n’existe pas</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">L’article a peut-être été retiré de la boutique.</p>
      <Link href="/boutique" className="btn-dark mt-8">
        Retour à la boutique
      </Link>
    </div>
  );
}
