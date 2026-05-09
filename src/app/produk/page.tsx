import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineChatBubbleOvalLeft,
  HiOutlineCheckBadge,
  HiOutlineTruck,
} from "react-icons/hi2";
import { createMetadata } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata = createMetadata({
  title: "Produk",
  description:
    "Katalog produk Kembung: tumbler pastel, tumbler stainless steel, tumbler custom name, travel, daily use, dan gift set.",
  path: "/produk",
});

const desktopFilters = ["Semua", "Best Seller", "Pastel Series", "Earth Series"];
const mobileFilters = [
  "All Products",
  "The Classic",
  "Eco-Luxe",
  "Mini Bloat",
];

const showcaseProducts = [
  {
    name: "Minty Fresh",
    subtitle: "Kapasitas 500ml • Pastel Series",
    price: "Rp 189.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDgLyXKUPrElvlja8nT0vUgxCIDfpeEJRbo_sm-W74vwJ_30xcPnoqYnpKqnw3R34c0K91DX6-nShVj0ZF8UG6Nc7ZlQcutk8HRaKvqjzlOZIVka6TJAaQlmIirEwNb1EhdO-eS8B1i82gIGkp6J_Q-RjyXgJlwCkOQk9xKLzfAYouTWxAqoh333qk66Zh6ya4VBK5U3h_JKke3dNnFv2FAahH_YFIJ18qmqouP3admL92uZI03owKuEU3-XogXY-zGBSyam5WZhh3C",
    card: "bg-[var(--primary-fixed)]/20",
    badge: "Best Seller",
    targetSlug: "kembung-pastel-bottle",
  },
  {
    name: "Peach Perfect",
    subtitle: "Kapasitas 500ml • Pastel Series",
    price: "Rp 189.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDr1OXypzyC0l_0DDxn_1w42IDP66kIuYIlZmhMFprSqvevlebhM3T9rP_z4UpDSZTi86EVc_PzuV_3pnRiZtr7YSGjr5aPYQlyo0r4S_xkAqdvEIf6W0J1UahWP_r1PzH-sLsTBJ-o09ySco11cc70GKfmU5viOpaVOZf6YiYWTwp5aEomYuyENU-7-77qYJ01F37_cejwK8Jtr_0XS2aV-UduSgjCXkS14saQdd4xg0NQDZAfVIyDSPQmDWzBxOaxbSIP7J8592lc",
    card: "bg-[var(--secondary-container)]/40",
    targetSlug: "tumbler-custom-name",
  },
  {
    name: "Sky Blue Chill",
    subtitle: "Kapasitas 750ml • Pastel Series",
    price: "Rp 219.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjxCb1_NEICNVIBI-W-dV5qe4ThtIxMSKFee59VoIXOGHUYvIYnWIQbubfR_MNgxAQqDVPIqKCreZm17EHzUdWyiH8l2CnIvlyJCSSjlmX21EHEnYCPHsKt9DYqKvPocGofbA_xe-Mk76dqEzemgZljRlJG7UysoRz1z_OGDe--szwXHmYOixBiyN8O7n1LoyTwMutEnA2gQVUyvVJ7ko-CwbE1cILWPRcBJiosccaBb2zz9j-OAVW9ko5Em6KBk0Rgp9Vj5nvGtn7",
    card: "bg-[var(--surface-container-high)]",
    targetSlug: "tumbler-travel-flask",
  },
  {
    name: "Terracotta Earth",
    subtitle: "Kapasitas 500ml • Earth Series",
    price: "Rp 195.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVHwtinLYdpr6U6zM8jzukxKgLi_H0Os7RxwD5fCkfzWQ-3uJ0CPLuRWdIAwBXwuEUenDllpMkC6HXmSCsTBLatsChyyeamhYHkhZl0rp6B85A25UM3duCkf5bViLA6RroxzcOxQWjerPwc9YNIXzzZrj9ebJTlgapjNGH_rqgHnEExqQ-ZJlg_McKbczhPe6mux8rWYpTF9WcP0oj3aeIU_crKxN7q44spW0f3PzRpofYoFVbMRvq5c4DEYxEaSBxyVT3vyiXqBmL",
    card: "bg-[var(--secondary-fixed)]/30",
    badge: "Limited",
    badgePosition: "left",
    targetSlug: "tumbler-custom-name",
  },
  {
    name: "Olive Grove",
    subtitle: "Kapasitas 500ml • Earth Series",
    price: "Rp 189.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDG8duObIFNuapOJBOKtzmwPljTfOb8GPhMNAW1WT_ouPEXolj2B0OlvJIUbcG72CqqtipnOI1dLtdGvu6A3TXc2RV1dKWFrRiTmKqeci8a0_N_xeCN9sm71VpXq55kI8bJQcE6tt1A_t2x92kATWZC3FDEEssf1taaUoD-nBZHqttE8tAmHoab99eNE6Dv2mmd6-ViQLNcb20GcYrpJfPzrP8-4g8CNp2ZnQIjyI9yS3N5WPCN9jWSW0SeRcgGIOA6-OzLqblR9oQS",
    card: "bg-[var(--primary-container)]/20",
    targetSlug: "tumbler-travel-flask",
  },
  {
    name: "Creamy Oat",
    subtitle: "Kapasitas 500ml • Pastel Series",
    price: "Rp 189.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBxvjIkCSApR7tV7egYApfKhdi7w9p5cHQX14Z5azt1oQjxPm6wwNo1v_z5oRKLB-K_pvHV_5YZnXsa8e24HT3z6yVYkJsYmVkEgC3JrBzrGoOogG5KuOenvqLZVZijk9tEhDP2daHQLQO8HPF5UEhjnYt3WLGF7SkDUl9bpkxxcuIgf_mT8S1R83zBQ9dZLWmIomR0HVGwF39cIH1jKLngrf-eVEHRnx-YCf7O9v6x8a1ZlGYOQaEfqPynFX1nhQwNlkyfYvuQpTah",
    card: "bg-[var(--secondary-fixed-dim)]/20",
    targetSlug: "kembung-pastel-bottle",
  },
  {
    name: "Sunset Glow",
    subtitle: "Kapasitas 750ml • Pastel Series",
    price: "Rp 219.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgxFT2LgWy0jijc0mm0i5xTa9ZKX-gCrPCcOcCX3hcJplnnZEQYCiws9jKwrcpu6dlihCxrpOdzUszXGNVyHnBOPK9W1Cfee-2lAnUBK7VRqj5oMwJJr5lSRPbwaOZwQqEooFhfPEPo7pq3Sz1sTLO715wrDLEh1iuf5Fv9FiTzFj-gO7dJGhZIpuYV-PDyijBjbzNtukjxcSn5L_1OoDmqVXzqSH2hlaAQDARG6WSz4HrE_hoyJ_RJ2UqgYo8gThHZI9cNVbo7z6F",
    card: "bg-[var(--tertiary-fixed)]/30",
    badge: "Hot",
    targetSlug: "tumbler-travel-flask",
  },
  {
    name: "Charcoal Night",
    subtitle: "Kapasitas 750ml • Earth Series",
    price: "Rp 219.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAfs6HWgIHLCh_tBtg5letWY71JZiB3F9cZkmzp587ONbiOggFTf1Y_IgVBA5yQK69nZi6e2A9ZTkYeaKEoyq18UmyNrlIloFSKsYUwYH50Tq5zBMNaYbwYQ7p56ac40dsj0L3gMl6eU_vZGBRdA5wf9fJyozQqNUx5-8pYoevDAgSIRX95TezRanEV7jKK1HwzFE-jQBYBeE-5y-KoNRx-4yR1qMbpro2vWfR1JjNUqMOdqJ6xw7vXBwkQCFch2rFHKCbDOl_tAfB2",
    card: "bg-[var(--inverse-surface)]/8",
    targetSlug: "tumbler-custom-name",
  },
];

const mobileProducts = [
  {
    name: "Mint Mist 750ml",
    price: "Rp 249.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSGcbZGI_CxGDdz7pHkxNmAb3DTefba7KHOXHaHgkfSeKkTJD_Merbg6687lGhXeEhbRMu-pLyvFNoTjzfP7J9jfTp073OHSAnrSfUQ-y6CeZNpZvGkCKzZhOruECNeZ5cOMsWJvM-i28DrZrMjato_bdMnTGbllGssJ6FcM047nEE-Wj2EG7yrRq1zayRfBWWOwDC2-hNwAemHghIIXM5KJSea_VbfJHyteOxEy7oc2EI2uJPz6j2P41zX93Z0R1I8Y3ZMoCTQz20",
    card: "bg-[var(--secondary-container)]",
    badge: "BEST SELLER",
    targetSlug: "kembung-pastel-bottle",
  },
  {
    name: "Coral Bloom 500ml",
    price: "Rp 199.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDY4YVbzEFEZctSLagBWI5KR6ATYb36pCpzJEx0CiD6D1ciUQH2AJkzvOvblVYgHUTFEF3vD8AKk1__mZnpe2VxA7fe7H-T1RCjGLjfOq_uJArfymtl3J9Jc_Ikwfn81GZBWvxAaWTza7wVNjO4nMXb6uhLsvnn7_-_XZMwUeyQuJuUQ86OLbEzVAEGJ6a5S_7MJ2yPoLFu9XR754G428IvJ0FlpuHZAhVtIR5UvjTSoF-NB581u-60QxJdNnBLYwl_v_90ENZ5jqQt",
    card: "bg-[var(--tertiary-container)]",
    targetSlug: "tumbler-custom-name",
  },
  {
    name: "Slate Urban 1L",
    price: "Rp 329.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-7vd9CPb_SOj0r_YKvTmqYFETRLU8fS2bsxMsCw65I6ZWw0nokLPEHl3MuNLVuB0WHAbCrUNbvqL6NDtTNUwUyXVKFhoRc2uLmx7AfzyscrD_h4gLO3VfHhtnwHJjO7Tbq0204Xzh6flcLCkJQYjlGhuFLvUTo_DnoS--9UPaW3_2vp0OchOr8FT2SBuueGWDTi-e_VhSn80q8EjC9mr1Iibo02xAyOsY8nBmjeA-YzOMDw3Ln4-05FvkU5y4G8MXOYilRh5g9a5x",
    card: "bg-[var(--primary-container)]",
    targetSlug: "tumbler-travel-flask",
  },
  {
    name: "Azure Chill 600ml",
    price: "Rp 279.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkRIfl4k-iTHfbFOXQToiepwbdBAXHteAflHbNY6DaL5YhiA4baQ9P4dg1GFh5fycotFSoRx_wbyu9XSJVidiMM8YqdeuDoXT2KzCrrP6AQu9Ju9z0DvIlar345mh74J8pe3jCvtKNRYjWSzlx9BiJdpl1WUeUNwoRo6ZXBvd5Q3cafpEamYLHTy9nGnohebEAvKE5PdeTbu63gQaaBFbu7ScLtEqs-_9q-G9_Yda9qKL8jzzsorac2M-fppNdb4ERW9JTJFpE_V9l",
    card: "bg-[var(--secondary-container)]",
    badge: "NEW",
    badgePosition: "left",
    targetSlug: "tumbler-travel-flask",
  },
  {
    name: "Obsidian Matte 500ml",
    price: "Rp 219.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDnYASc74YdAD1EDrZkFa_32rzrTHmpnZOUsXBy37CqP8mtQjnzG466FviNEgCGJoab2MlrrIgRAL1kM7aLnKz2dHB2uDt1Y6qyoG0J4eh3nBK8nA634jYPRpQjSfucbDKwnIsBcY0sDa-KswhlYLSUqUmAbYUAHC2vR172kX1Y-O2JisxfJG-63KPikR5NC1WeAGiDNEh6ty26VM6Ouwztm3WIKvn_btgt5qnrdmUeMIA_NAkpAq_S8xw8JEF6oWwqE51Oxo-w7OOv",
    card: "bg-[var(--surface-container-highest)]",
    targetSlug: "tumbler-custom-name",
  },
  {
    name: "Sunny Glow 750ml",
    price: "Rp 249.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXDSjqybe7CITK-N9Ql-OpqjjQFlLCujscMnq1QLeW576WiveZHmxwM9g4z49ACirLsVt3uB4VOYLS6AiLEBBjmQjWSCynnQDbINSWZv6toYLmgGFunP0WbHVbN0pp_447RVPfe0ttIkLD6S0EOXZoKSf_82I5w6c7sfVypP4FqSlOLQAWA1u-aDVdVq19CyjOCYxZIMpbR5V_N_OXE5aDFskchnYt3QEZ0dLowtvsFVLnlJsdHbZNyUmPyE7zjtvwZK10qHqDfjOs",
    card: "bg-[var(--tertiary-container)]",
    targetSlug: "tumbler-travel-flask",
  },
];

const benefits = [
  { title: "Free Shipping", subtitle: "Min. order Rp 500k" },
  { title: "Lifetime Warranty", subtitle: "For all insulation" },
];

export default function ProductsPage() {
  return (
    <>
      <section className="container-shell hidden py-20 md:block">
        <header className="mb-16 text-center md:text-left">
          <h1 className="mb-4 text-[3.5rem] font-extrabold leading-none tracking-[-0.04em] text-[var(--primary)]">
            Katalog Kembung
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--on-surface-variant)]">
            Temukan tumbler favoritmu untuk menjaga hidrasi tetap ceria. Dari warna
            pastel yang lembut hingga tone bumi yang menenangkan.
          </p>
        </header>

        <section className="mb-14 flex flex-wrap items-center justify-center gap-4 md:justify-start">
          {desktopFilters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={`min-h-12 min-w-[170px] rounded-full px-8 py-3 text-base font-semibold transition-all duration-200 ${
                index === 0
                  ? "bg-[var(--primary)] text-[var(--on-primary)]"
                  : "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"
              }`}
            >
              {filter}
            </button>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {showcaseProducts.map((item) => (
            <article
              key={item.name}
              className={`group relative flex flex-col rounded-[2.25rem] p-6 pt-5 transition-all duration-300 hover:shadow-2xl ${item.card}`}
            >
              <div className="relative mb-6 aspect-square overflow-hidden rounded-[1.6rem] shadow-[0_18px_38px_-22px_rgba(61,103,81,0.24)] transition-transform duration-300 group-hover:-translate-y-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                />
                {item.badge ? (
                  <div
                    className={`absolute top-3 ${item.badgePosition === "left" ? "left-3" : "right-3"} rounded-full ${
                      item.badge === "Limited"
                        ? "bg-[var(--primary)] text-[var(--on-primary)]"
                        : "bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)]"
                    } px-4 py-1.5 text-[0.95rem] font-semibold`}
                  >
                    {item.badge}
                  </div>
                ) : null}
              </div>

              <h3 className="mb-1 text-2xl font-bold text-[var(--primary)]">{item.name}</h3>
              <p className="mb-5 text-sm text-[var(--on-surface-variant)]">{item.subtitle}</p>

              <div className="mt-auto flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[var(--primary)]">{item.price}</span>
                  <Link
                    href={`/produk/${item.targetSlug}`}
                    className="text-sm font-semibold text-[var(--primary)] hover:underline"
                  >
                    Detail
                  </Link>
                </div>
                <Link
                  href={buildWhatsAppUrl(`Halo Kembung, saya tertarik dengan ${item.name}.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--primary)] py-3 text-sm font-semibold text-[var(--on-primary)] transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  <HiOutlineChatBubbleOvalLeft className="text-[18px]" aria-hidden="true" />
                  Beli via WA
                </Link>
              </div>
            </article>
          ))}
        </section>
      </section>

      <section className="md:hidden">
        <div className="fixed inset-x-0 top-[2.825rem] z-30">
          <div className="mx-auto max-w-md px-3 pb-3 pt-2">
            <div className="grid grid-cols-4 gap-2">
              {mobileFilters.map((filter, index) => (
                <button
                  key={filter}
                  type="button"
                  className={`min-h-11 rounded-full px-3 py-2 text-center text-[12px] font-semibold leading-tight ${
                    index === 0
                      ? "bg-[var(--primary)] text-[var(--on-primary)]"
                      : "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 pt-[7.5rem]">
          <div className="grid grid-cols-2 gap-5">
            {mobileProducts.map((item) => (
              <article key={item.name} className="group flex flex-col gap-3">
                <Link href={`/produk/${item.targetSlug}`} className="block">
                  <div
                    className={`relative flex aspect-[4/5] items-center justify-center overflow-visible rounded-[1.75rem] p-4 ${item.card}`}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={700}
                      height={700}
                      className="h-full w-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
                    />
                    {item.badge ? (
                      <div
                        className={`absolute top-2 ${item.badgePosition === "left" ? "left-2" : "right-2"} rounded-full ${
                          item.badge === "NEW"
                            ? "bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)]"
                            : "bg-[var(--primary-container)] text-[var(--on-primary-container)]"
                        } px-2 py-1 text-[10px] font-bold`}
                      >
                        {item.badge}
                      </div>
                    ) : null}
                  </div>

                  <div className="px-1 pt-3">
                    <h3 className="text-sm font-semibold text-[var(--on-surface)]">{item.name}</h3>
                    <p className="text-sm text-[var(--on-surface-variant)]">{item.price}</p>
                  </div>
                </Link>

                <div className="px-1">
                  <Link
                    href={buildWhatsAppUrl(`Halo Kembung, saya tertarik dengan ${item.name}.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--primary)] py-3 text-sm font-semibold text-[var(--on-primary)] transition-transform duration-200 hover:scale-105 active:scale-95"
                  >
                    <HiOutlineChatBubbleOvalLeft className="text-[18px]" aria-hidden="true" />
                    Beli via WA
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <section className="mx-4 mt-16 rounded-[1.75rem] bg-[var(--surface-container-low)] px-5 py-6">
          <div className="flex flex-col gap-5">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-center gap-4">
                <div className="rounded-full bg-[var(--primary-container)] p-2 text-[var(--on-primary-container)]">
                  {benefit.title === "Free Shipping" ? (
                    <HiOutlineTruck className="text-lg" aria-hidden="true" />
                  ) : (
                    <HiOutlineCheckBadge className="text-lg" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-[var(--on-surface)]">{benefit.title}</p>
                  <p className="text-sm text-[var(--on-surface-variant)]">{benefit.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}
