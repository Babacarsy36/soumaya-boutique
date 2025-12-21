import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl space-y-16 divide-y divide-slate-100 lg:mx-0 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
                        <div>
                            <h2 className="text-3xl font-serif font-bold tracking-tight text-slate-900">
                                Contactez-nous
                            </h2>
                            <p className="mt-4 leading-7 text-slate-600">
                                Une question sur un produit ? Besoin d'un conseil personnalisé ? 
                                Notre équipe est à votre écoute pour vous accompagner.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
                            <div className="rounded-2xl bg-slate-50 p-10">
                                <h3 className="text-base font-semibold leading-7 text-slate-900 flex items-center gap-2">
                                    <PhoneIcon className="h-5 w-5 text-amber-600" />
                                    Téléphone / WhatsApp
                                </h3>
                                <dl className="mt-3 space-y-1 text-sm leading-6 text-slate-600">
                                    <div>
                                        <dt className="sr-only">Numéro</dt>
                                        <dd>
                                            <a href="tel:+221770000000" className="font-semibold text-amber-600 hover:text-amber-500">
                                                +221 77 000 00 00
                                            </a>
                                        </dd>
                                    </div>
                                    <div className="mt-1">Dispo 7j/7 de 9h à 20h</div>
                                </dl>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-10">
                                <h3 className="text-base font-semibold leading-7 text-slate-900 flex items-center gap-2">
                                    <EnvelopeIcon className="h-5 w-5 text-amber-600" />
                                    Email
                                </h3>
                                <dl className="mt-3 space-y-1 text-sm leading-6 text-slate-600">
                                    <div>
                                        <dt className="sr-only">Email</dt>
                                        <dd>
                                            <a href="mailto:contact@soumaya.sn" className="font-semibold text-amber-600 hover:text-amber-500">
                                                contact@soumaya.sn
                                            </a>
                                        </dd>
                                    </div>
                                    <div className="mt-1">Réponse sous 24h</div>
                                </dl>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-10">
                                <h3 className="text-base font-semibold leading-7 text-slate-900 flex items-center gap-2">
                                    <MapPinIcon className="h-5 w-5 text-amber-600" />
                                    Boutique
                                </h3>
                                <dl className="mt-3 space-y-1 text-sm leading-6 text-slate-600">
                                    <div>
                                        <dt className="sr-only">Adresse</dt>
                                        <dd>
                                            Dakar, Sénégal<br />
                                            (Adresse complète à préciser)
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
