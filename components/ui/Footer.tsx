import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="font-serif text-xl font-bold text-white mb-4">
                            Soumaya <span className="text-amber-500">Prestige</span>
                        </h3>
                        <p className="text-sm">
                            Votre destination pour les tissus africains authentiques, parfums de luxe et chaussures élégantes.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Liens Rapides</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/products" className="hover:text-amber-500 transition">
                                    Produits
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-amber-500 transition">
                                    À Propos
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-amber-500 transition">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Catégories</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/products?category=tissus" className="hover:text-amber-500 transition">
                                    Tissus Africains
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=parfums" className="hover:text-amber-500 transition">
                                    Parfums
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=chaussures" className="hover:text-amber-500 transition">
                                    Chaussures
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li>📞 +221 XX XXX XX XX</li>
                            <li>📧 contact@soumaya.sn</li>
                            <li>📍 Dakar, Sénégal</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Soumaya Boutique Prestige. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
