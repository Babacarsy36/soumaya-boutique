import Image from 'next/image';
import { getSettings } from '@/lib/settings';

export default async function AboutPage() {
    const settings = await getSettings();
    const aboutPage = settings.about_page || {
        heroTitle: "Notre Histoire",
        heroSubtitle: "L'élégance et la tradition au service de votre style depuis plus de 10 ans.",
        title: "Une Histoire de Passion",
        description: "Chez Soumaya Boutique, nous célébrons la beauté et l'authenticité. Chaque pièce est choisie avec amour pour vous offrir le meilleur de la mode et de l'artisanat."
    };

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-slate-900 py-24 sm:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop"
                        alt="Atelier de couture"
                        fill
                        className="object-cover opacity-20"
                    />
                </div>
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-serif font-bold tracking-tight text-white sm:text-6xl">
                        {aboutPage.heroTitle}
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
                        {aboutPage.heroSubtitle}
                    </p>
                </div>
            </div>

            {/* Story Section - Dynamic Content */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 border-b border-slate-200">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">
                        {aboutPage.title}
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        {aboutPage.description}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">
                            L'Excellence Soumaya
                        </h2>
                        <div className="space-y-6 text-slate-600 leading-relaxed">
                            <p>
                                Fondée avec une passion pour les tissus d'exception et le savoir-faire artisanal,
                                Soumaya Boutique Prestige est devenue une référence à Dakar pour ceux qui recherchent
                                l'authenticité et le raffinement.
                            </p>
                            <p>
                                Nous sélectionnons rigoureusement nos matières premières : des bazins les plus éclatants
                                aux soies les plus délicates, en passant par des parfums envoûtants qui signent votre passage.
                            </p>
                            <p>
                                Notre mission est simple : sublimer votre allure avec des pièces uniques qui racontent une histoire,
                                la vôtre, mêlée à notre héritage culturel.
                            </p>
                        </div>
                    </div>
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                        <Image
                            src="/images/boutique-interior.jpg"
                            alt="Intérieur de la boutique Soumaya"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
