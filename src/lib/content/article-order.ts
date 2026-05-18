const ARTICLE_ORDER_SECTION_KEY = "article_listing_order";

type ArticleOrderRow = {
  id: string;
  extra_json: Record<string, unknown> | null;
};

type ArticleOrderQuery = {
  select: (query: string) => {
    eq: (column: string, value: string) => {
      limit: (value: number) => {
        maybeSingle: () => PromiseLike<{ data: ArticleOrderRow | null; error: unknown }>;
      };
    };
  };
};

function parseDateValue(value?: string | null) {
  if (!value) {
    return 0;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function getArticleOrderSectionKey() {
  return ARTICLE_ORDER_SECTION_KEY;
}

export function normalizeArticleOrderSlugs(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean),
    ),
  );
}

export function applyArticleOrder<T extends { slug: string }>(
  articles: T[],
  orderedSlugs: string[],
  getDateValue?: (article: T) => string | null | undefined,
) {
  const orderIndexBySlug = new Map(
    normalizeArticleOrderSlugs(orderedSlugs).map((slug, index) => [slug, index]),
  );

  return [...articles].sort((left, right) => {
    const leftOrderIndex = orderIndexBySlug.get(left.slug);
    const rightOrderIndex = orderIndexBySlug.get(right.slug);

    if (leftOrderIndex !== undefined || rightOrderIndex !== undefined) {
      if (leftOrderIndex === undefined) {
        return 1;
      }

      if (rightOrderIndex === undefined) {
        return -1;
      }

      return leftOrderIndex - rightOrderIndex;
    }

    return parseDateValue(getDateValue?.(right)) - parseDateValue(getDateValue?.(left));
  });
}

export async function getArticleOrderConfig(supabase: {
  from: (table: string) => unknown;
}) {
  const articleOrderQuery = supabase.from("homepage_sections") as ArticleOrderQuery;
  const { data, error } = await articleOrderQuery
    .select("id, extra_json")
    .eq("section_key", ARTICLE_ORDER_SECTION_KEY)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return {
      rowId: null,
      orderedSlugs: [] as string[],
    };
  }

  return {
    rowId: data.id,
    orderedSlugs: normalizeArticleOrderSlugs(data.extra_json?.orderedSlugs),
  };
}
