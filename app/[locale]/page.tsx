import { client } from "@/sanity/lib/client";
import { FEATURED_PRODUCTS_QUERY } from "@/sanity/lib/queries";
import type { Product } from "@/types/sanity";
import HomeAnimationWrapper from "@/components/home/HomeAnimationWrapper";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import WhyUsMini from "@/components/home/WhyUsMini";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HowItWorksMini from "@/components/home/HowItWorksMini";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";

export default async function HomePage() {
  const featuredProducts = await client
    .fetch<Product[]>(FEATURED_PRODUCTS_QUERY)
    .catch(() => []);

  return (
    <HomeAnimationWrapper>
      <HeroSection />
      <StatsBar />
      <FeaturedCategories />
      <WhyUsMini />
      <FeaturedProducts products={Array.isArray(featuredProducts) ? featuredProducts : []} />
      <HowItWorksMini />
      <Testimonials />
      <CTABanner />
    </HomeAnimationWrapper>
  );
}
