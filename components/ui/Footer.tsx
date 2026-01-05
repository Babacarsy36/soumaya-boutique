'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSettings } from '@/lib/settings';

export default function Footer() {
    const [siteInfo, setSiteInfo] = useState({
        name: '',
        whatsapp: { ligne1: '', ligne2: '' },
        email: '',
        address: ''
    });

    useEffect(() => {
        async function loadSettings() {
            const settings = await getSettings();
            setSiteInfo(settings.site_info || {
                name: '',
                whatsapp: { ligne1: '', ligne2: '' },
                email: '',
                address: ''
            });
        }
        loadSettings();
    }, []);

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="font-serif text-xl font-bold text-white mb-4">
                            {siteInfo.name ? (
                                <>
                                    {siteInfo.name.split(' ')[0]} <span className="text-amber-500">{siteInfo.name.split(' ').slice(1).join(' ')}</span>
                                </>
                            ) : (
                                <>Soumaya <span className="text-amber-500">Prestige</span></>
                            )}
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
                            {siteInfo.whatsapp?.ligne1 && (
                                <li>
                                    <a href={`tel:+${siteInfo.whatsapp.ligne1}`} className="hover:text-amber-500 transition">
                                        📞 +{siteInfo.whatsapp.ligne1}
                                    </a>
                                </li>
                            )}
                            {siteInfo.email && (
                                <li>
                                    <a href={`mailto:${siteInfo.email}`} className="hover:text-amber-500 transition">
                                        📧 {siteInfo.email}
                                    </a>
                                </li>
                            )}
                            {siteInfo.address && (
                                <li>📍 {siteInfo.address}</li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} {siteInfo.name || 'Soumaya Boutique Prestige'}. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
