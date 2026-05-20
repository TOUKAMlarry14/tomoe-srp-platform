import React from 'react';
import { Page, PageHeader, PageTitle, PageBody } from '@blinkdotnew/ui';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../lib/i18n';

interface PlaceholderPageProps {
  titleKey: keyof typeof translations.en.common;
}

export function PlaceholderPage({ titleKey }: PlaceholderPageProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Page>
      <PageHeader>
        <PageTitle>{t.common[titleKey]}</PageTitle>
      </PageHeader>
      <PageBody>
        <div className="flex items-center justify-center h-[60vh] border-2 border-dashed rounded-lg border-muted">
          <p className="text-muted-foreground text-lg">
            {t.common[titleKey]} module is under development.
          </p>
        </div>
      </PageBody>
    </Page>
  );
}
