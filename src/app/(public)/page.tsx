
import Footer from "@/components/layout/Footer";
import SearchBar from "@/components/directory/SearchBar";
import CategoryList from "@/components/directory/CategoryList";
import BusinessGrid from "@/components/directory/BusinessGrid";
import Header from "@/components/layout/header";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <SearchBar />
        <CategoryList />
        <BusinessGrid />
      </main>

      <Footer />
    </>
  );
}
