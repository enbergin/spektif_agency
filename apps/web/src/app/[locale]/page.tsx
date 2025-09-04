import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight, Calendar, MessageSquare, Users, BarChart3 } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function HomePage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-border header-background">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-brand-primary rounded-md flex items-center justify-center">
            <span className="text-black font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold">spektif</span>
          <span className="text-sm text-muted-foreground">Digital Strategies</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#" className="text-sm hover:text-brand-primary transition-colors">
            {t('nav.home')}
          </Link>
          <Link href="#" className="text-sm hover:text-brand-primary transition-colors">
            {t('nav.about')}
          </Link>
          <Link href="#" className="text-sm hover:text-brand-primary transition-colors">
            {t('nav.projects')}
          </Link>
          <Link href="#" className="text-sm hover:text-brand-primary transition-colors">
            {t('nav.services')}
          </Link>
          <Link href="#" className="text-sm hover:text-brand-primary transition-colors">
            {t('nav.references')}
          </Link>
          <Link href="#" className="text-sm hover:text-brand-primary transition-colors">
            {t('nav.contact')}
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Link
            href="/tr/auth/login"
            className="px-4 py-2 text-sm border border-border rounded-md hover:bg-secondary transition-colors"
          >
            {t('auth.login')}
          </Link>
          <Link
            href="/tr/auth/register"
            className="px-4 py-2 text-sm bg-brand-primary text-black rounded-md hover:bg-brand-accent transition-colors"
          >
            {t('auth.register')}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="spektif-gradient py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-black mb-6">
                  {t('hero.title')}
                </h1>
                <p className="text-xl text-black/80 mb-8">
                  {t('hero.subtitle')}
                </p>
                <Link
                  href="/tr/auth/register"
                  className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-black/90 transition-colors"
                >
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>

              <div className="relative">
                <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <Users className="w-8 h-8 text-black mb-2" />
                      <h3 className="font-semibold text-black">{t('hero.features.workspace.title')}</h3>
                      <p className="text-sm text-black/70">{t('hero.features.workspace.description')}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <Calendar className="w-8 h-8 text-black mb-2" />
                      <h3 className="font-semibold text-black">{t('hero.features.calendar.title')}</h3>
                      <p className="text-sm text-black/70">{t('hero.features.calendar.description')}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <MessageSquare className="w-8 h-8 text-black mb-2" />
                      <h3 className="font-semibold text-black">{t('hero.features.chat.title')}</h3>
                      <p className="text-sm text-black/70">{t('hero.features.chat.description')}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                      <BarChart3 className="w-8 h-8 text-black mb-2" />
                      <h3 className="font-semibold text-black">{t('hero.features.accounting.title')}</h3>
                      <p className="text-sm text-black/70">{t('hero.features.accounting.description')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-card">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Spektif Agency ile</h2>
              <p className="text-xl text-muted-foreground">
                Sosyal medya ajansınızı dijital dünyanın zirvesine taşıyın
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ekip İşbirliği</h3>
                <p className="text-muted-foreground">
                  Ekibinizle gerçek zamanlı işbirliği yapın, görevleri takip edin
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Proje Takviminiz</h3>
                <p className="text-muted-foreground">
                  Tüm proje deadlinelarınızı tek yerden takip edin
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Türk Muhasebe</h3>
                <p className="text-muted-foreground">
                  İyzico entegrasyonu ile Türk faturalama sistemi
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 spektif-gradient">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-black mb-4">
              Spektif Agency'yi denemeye hazır mısınız?
            </h2>
            <p className="text-xl text-black/80 mb-8">
              14 gün ücretsiz deneme ile başlayın
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 bg-black text-white rounded-md hover:bg-black/90 transition-colors text-lg"
            >
              Ücretsiz Deneyin
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-brand-primary rounded-md flex items-center justify-center">
              <span className="text-black font-bold text-sm">S</span>
            </div>
            <span className="font-semibold">spektif</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  )
}
