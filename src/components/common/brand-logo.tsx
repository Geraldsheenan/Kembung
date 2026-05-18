import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  size?: "navbar" | "footer";
  variant?: "full" | "mark";
  src?: string;
  alt?: string;
};

const sizeClasses = {
  navbar: "h-[68px] w-[56px] md:h-[76px] md:w-[62px]",
  footer: "h-[126px] w-[104px] md:h-[144px] md:w-[118px]",
};

const variantClasses = {
  full: "",
  mark: "scale-[1.52] object-top",
};

const BRAND_LOGO_SRC = "/logokembunk-v2.png";

export function BrandLogo({
  href = "/",
  size = "navbar",
  variant = "full",
  src = BRAND_LOGO_SRC,
  alt = "Kembunk",
}: BrandLogoProps) {
  const content = (
    <span className={`inline-flex shrink-0 items-center justify-center overflow-hidden ${sizeClasses[size]}`}>
      <Image
        src={src}
        alt={alt}
        width={128}
        height={156}
        className={`block h-full w-full object-contain ${variantClasses[variant]}`}
        priority={size === "navbar"}
        sizes={size === "navbar" ? "(max-width: 768px) 56px, 62px" : "(max-width: 768px) 104px, 118px"}
      />
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} aria-label={alt}>
      {content}
    </Link>
  );
}
