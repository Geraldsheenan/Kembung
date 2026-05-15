import type { ElementType } from "react";
import { renderLimitedRichText } from "@/lib/rich-text";

type LimitedRichTextProps = {
  value: string;
  as?: ElementType;
  className?: string;
};

export function LimitedRichText({
  value,
  as: Component = "div",
  className,
}: LimitedRichTextProps) {
  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: renderLimitedRichText(value) }}
    />
  );
}
