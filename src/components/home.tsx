import type {Locale} from '@/content/location-copy';
import {LocationSection} from './location-section';
import {SiteFooter} from './site-footer';

export function Home({locale}: {locale: Locale}) {
  const isEnglish = locale === 'en';

  return (
    <>
      <header className="site-header">
        <a className="brand" href={isEnglish ? '/' : '/id'}>PT SUGEE</a>
        <a className="locale-link" href={isEnglish ? '/id' : '/'}>
          {isEnglish ? 'Bahasa Indonesia' : 'English'}
        </a>
      </header>
      <main>
        <section className="contact-section" id="contact" aria-labelledby="contact-heading">
          <p className="eyebrow">{isEnglish ? 'Start a conversation' : 'Mulai percakapan'}</p>
          <h1 id="contact-heading">
            {isEnglish ? 'Discuss your next project with PT SUGEE' : 'Diskusikan proyek Anda berikutnya dengan PT SUGEE'}
          </h1>
          <p>
            {isEnglish
              ? 'Responsive technical support for marine and industrial operations.'
              : 'Dukungan teknis responsif untuk operasi maritim dan industri.'}
          </p>
          <a className="primary-link" href="mailto:sathish@ptsugee.com">
            {isEnglish ? 'Contact our team' : 'Hubungi tim kami'}
          </a>
        </section>
        <LocationSection locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
