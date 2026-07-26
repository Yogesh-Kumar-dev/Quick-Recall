// Every article, plus lookup maps and the resolver notes/flashcards/quiz questions use to turn
// their `articleRefs` ids into deep-link chips. Mirrors note-sources.ts's shape.
import type { Article } from '@/types/content';
import { coreWebVitalsArticle } from './articles/core-web-vitals';
import { dynamodb101Article } from './articles/dynamodb-101';
import { iaasPaasSaasArticle } from './articles/iaas-paas-saas';
import { nextjsBuildArticle } from './articles/nextjs-build';
import { pwaIntroductionArticle } from './articles/pwa-introduction';
import { pwaWithNextjsArticle } from './articles/pwa-with-nextjs';
import { pwaWithReactArticle } from './articles/pwa-with-react';
import { reactQueryOverviewArticle } from './articles/react-query-overview';
import { redis101Article } from './articles/redis-101';
import { staticHostingS3CloudfrontArticle } from './articles/static-hosting-s3-cloudfront';
import { viteReactBuildArticle } from './articles/vite-react-build';
import { vitestGettingStartedArticle } from './articles/vitest-getting-started';
import { webAccessibilityDeepDiveArticle } from './articles/web-accessibility-deep-dive';
import { webSecurityDeepDiveArticle } from './articles/web-security-deep-dive';
import { zustandOverviewArticle } from './articles/zustand-overview';

export const ARTICLES: Article[] = [
  pwaIntroductionArticle,
  viteReactBuildArticle,
  nextjsBuildArticle,
  staticHostingS3CloudfrontArticle,
  vitestGettingStartedArticle,
  redis101Article,
  dynamodb101Article,
  pwaWithReactArticle,
  pwaWithNextjsArticle,
  reactQueryOverviewArticle,
  zustandOverviewArticle,
  webSecurityDeepDiveArticle,
  webAccessibilityDeepDiveArticle,
  coreWebVitalsArticle,
  iaasPaasSaasArticle
];

// Keyed by slug — the route param and the bookmark/resolve-content refId.
export const articleBySlug = new Map<string, Article>();
// Keyed by id — what `articleRefs` arrays store (mirrors Note.prerequisites storing note ids).
export const articleById = new Map<string, Article>();

for (const article of ARTICLES) {
  if (process.env.NODE_ENV !== 'production' && articleBySlug.has(article.slug)) {
    console.warn(`articles-index: duplicate article slug "${article.slug}"`);
  }
  if (!articleBySlug.has(article.slug)) articleBySlug.set(article.slug, article);
  if (!articleById.has(article.id)) articleById.set(article.id, article);
}

// A resolved article-ref chip: enough to render a deep link without shipping the article itself.
export interface ArticleLink {
  id: string;
  title: string;
  url: string;
}

// Resolves a content item's `articleRefs` ids to link chips, silently dropping ids that don't
// resolve (a typo in content data shouldn't crash the page) — same convention as resolvePrerequisites.
export function resolveArticleRefs(ids?: string[]): ArticleLink[] {
  if (!ids?.length) return [];
  return ids
    .map((id) => articleById.get(id))
    .filter((a): a is Article => a !== undefined)
    .map((a) => ({ id: a.id, title: a.title, url: `/articles/${a.slug}` }));
}
