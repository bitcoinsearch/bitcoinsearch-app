import Link from "next/link";

import Footer from "@/components/footer/Footer";
import NavBar from "@/components/navBar/NavBar";

export default function Custom404() {
  return (
    <div className={`bg-custom-background text-custom-primary-text`}>
      <main
        id="main"
        className="min-h-[calc(100dvh-122px)] flex w-full items-center pt-[60px] pb-[60px]"
      >
        <NavBar />
        <div className={`App btc-search w-full`}>
          <div className="flex flex-col items-center justify-center gap-y-2 w-full h-full">
            <h1 className="md:text-4xl font-bold text-center">
              404 - Page Not Found
            </h1>
            <p className="text-sm md:text-lg text-center max-w-xs md:max-w-lg">
              The page you are looking for might have been removed, had its name
              changed or is temporarily unavailable.
            </p>
            <Link
              href="/"
              className="text-custom-brightOrange-200 underline underline-offset-2"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </main>
      <section>
        <Footer />
      </section>
    </div>
  );
}
