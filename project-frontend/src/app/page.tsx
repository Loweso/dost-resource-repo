import ArticlesPreview from "@/components/articlesPreview";
import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-screen overflow-hidden">
      <main className="md:mt-10 flex flex-col w-full">
        <Image
          src="/images/dost-cover.png"
          alt="DOST banner"
          width={2659}
          height={984}
          className="w-full"
        />
      </main>
      <section>
        <ArticlesPreview />
      </section>
      <section className="flex flex-col items-center w-full h-screen ocean-bg mt-0 md:mt-16 p-8 md:p-32 gap-4">
        <Image
          src="/images/logo.png"
          alt="DOST SA UP Cebu logo"
          width={2659}
          height={984}
          className="w-32 md:w-40 -mt-4 md:-mt-12"
        />
        <h1 className="font-vogue text-6xl sm:text-7xl md:text-[180px] text-white leading-none text-center">
          DOST SA UP CEBU
        </h1>
        <p className="text-white font-creato text-lg md:text-4xl text-center">
          Empowering DOST scholars at UP Cebu through science, leadership, and
          community—join us as we innovate, inspire, and thrive together!
        </p>
      </section>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
