import type {Locale} from '@/content/location-copy';

export function SiteFooter({locale}: {locale: Locale}) {
  return (
    <footer className="site-footer">
      <div>
        <strong>PT SUGEE</strong>
        <p>{locale === 'en' ? 'Engineering & marine solutions' : 'Solusi engineering & maritim'}</p>
      </div>
      <p>© {new Date().getFullYear()} PT SUGEE</p>
    </footer>
  );
}
