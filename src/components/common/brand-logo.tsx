import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  size?: "navbar" | "footer";
  variant?: "full" | "mark";
};

const sizeClasses = {
  navbar: "h-11 w-11 md:h-12 md:w-12",
  footer: "h-[72px] w-[120px] md:h-[84px] md:w-[140px]",
};

const variantClasses = {
  full: "",
  mark: "scale-[1.45] object-top",
};

export function BrandLogo({
  href = "/",
  size = "navbar",
  variant = "full",
}: BrandLogoProps) {
  const content = (
    <span className={`block overflow-hidden ${sizeClasses[size]}`}>
      <Image
        src="/logokembunk.png"
        alt="Kembunk"
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
    <Link href={href} aria-label="Kembunk">
      {content}
    </Link>
  );
}
