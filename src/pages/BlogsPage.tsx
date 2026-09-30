import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import BlogArticlesPage from "../components/BlogMain";
import PopularBlogGridPage from "../components/BlogSubMain";



import Seo from '../components/Seo.tsx';

export default function BlogsMainPage() {
  const [mode] = useState<string>("light");

  return (
    <div
      className={`${mode} w-full mx-auto h-[100vh] bg-[color:var(--color-bg)] font-poppins`}
    >
      <Seo title="Blog" description="Real estate news, market insights, and guides from the HouseBank team." path="/blogs" />
      <Header />
       <BlogArticlesPage  />
       <PopularBlogGridPage />
      <Footer />
    </div>
  );
}