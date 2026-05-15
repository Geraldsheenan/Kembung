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
  navbar: "h-[56px] w-[96px] md:h-[64px] md:w-[116px]",
  footer: "h-[96px] w-[148px] md:h-[112px] md:w-[178px]",
};

const variantClasses = {
  full: "",
  mark: "scale-[1.45] object-top",
};

const BRAND_LOGO_SRC = "/logokembung.png";

export function BrandLogo({
  href = "/",
  size = "navbar",
  variant = "full",
  src = BRAND_LOGO_SRC,
  alt = "Kembung",
}: BrandLogoProps) {
  const content = (
    <span className={`block overflow-hidden ${sizeClasses[size]}`}>
      <Image
        src={src}
        alt={alt}
        width={100}
        height={93}
        className={`block h-full w-full object-contain ${variantClasses[variant]}`}
        priority={size === "navbar"}
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
