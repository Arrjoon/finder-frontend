import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/header";
import HeroSection from "@/components/home/HeroSection";
import StickySearchBar from "@/components/home/StickySearchBar";
import RecentActivity from "@/components/home/RecentActivity";
import CategoriesGrid from "@/components/home/CategoriesGrid";

export default function HomePage() {
  return (
    <>
      <Header />
      
      <main className="relative">
        <div className="relative">
          <HeroSection>
            <StickySearchBar />
          </HeroSection>
        </div>
        <RecentActivity />
        <CategoriesGrid />
      </main>

      <Footer />
    </>
  );
}
