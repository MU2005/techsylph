import { client } from "@/sanity/lib/client";
import {
  FEATURED_PRODUCTS_QUERY,
  TESTIMONIALS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import type { Product, Testimonial, SiteSettings } from "@/types/sanity";
import HomeAnimationWrapper from "@/components/home/HomeAnimationWrapper";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import WhyUsMini from "@/components/home/WhyUsMini";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HowItWorksMini from "@/components/home/HowItWorksMini";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";

// Revalidate so Sanity changes (e.g. hero video) show up without redeploy
export const revalidate = 60;

export default async function HomePage() {
  const [featuredProducts, testimonials, siteSettings] = await Promise.all([
    client.fetch<Product[]>(FEATURED_PRODUCTS_QUERY).catch(() => []),
    client.fetch<Testimonial[]>(TESTIMONIALS_QUERY).catch(() => []),
    client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY).catch(() => null),
  ]);

  return (
    <HomeAnimationWrapper>
      <HeroSection settings={siteSettings} />
      <StatsBar settings={siteSettings} />
      <FeaturedCategories categories={siteSettings?.categories ?? []} />
      <WhyUsMini />
      <FeaturedProducts products={Array.isArray(featuredProducts) ? featuredProducts : []} />
      <HowItWorksMini />
      <Testimonials testimonials={Array.isArray(testimonials) ? testimonials : []} />
      <CTABanner />
    </HomeAnimationWrapper>
  );
}
