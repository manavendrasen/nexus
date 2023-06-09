import React from "react";
import Link from "next/link";

// icons
import { ArrowRight } from "lucide-react";

// ui
import { Button } from "@/components/Button/Button";

// features
import { JoinSurvey } from "@/components/HomeComponents/JoinSurvey";

function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gradient-to-t from-muted to-background">
      {/*  Site header */}
      <header className="fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="flex items-center justify-between h-24 md:h-28">
            {/* Site branding */}
            <div className="flex-shrink-0 mr-4">
              <Link href="/" className="block">
                <div className="flex items-center">
                  {/* <img
                    src="https://user-images.githubusercontent.com/44477212/162623423-5472eef0-2741-4f70-9465-d9e206c314c2.png"
                    alt=""
                    width="50px"
                  /> */}
                  <p className="ml-3 text-lg font-bold">Nexus</p>
                </div>
              </Link>
            </div>

            {/* Site navigation */}
            <nav className="flex flex-grow">
              <ul className="flex flex-grow justify-end flex-wrap items-center">
                <li>
                  <Link href="/login">
                    <Button>
                      <p className="mr-2">Create Survey</p>{" "}
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/*  Page content */}
      <main className="flex-grow">
        <section className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Hero content */}
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Section header */}
              <div className="text-center pb-12 md:pb-16 mt-16">
                <h1
                  className="text-5xl md:text-6xl font-semibold tracking-tight mb-8"
                  data-aos="zoom-y-out"
                >
                  Build your network
                </h1>
                <div className="max-w-lg mx-auto">
                  <p
                    className="text-base text-muted-foreground mb-8"
                    data-aos="zoom-y-out"
                    data-aos-delay="150"
                  >
                    With Nexus, you can connect with people who share your
                    interests and build your network.
                  </p>

                  <div
                    className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center"
                    data-aos="zoom-y-out"
                    data-aos-delay="300"
                  >
                    <JoinSurvey />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Bottom area */}
          <div className="md:flex md:items-center md:justify-between py-4 md:py-8 border-t border-slate-200">
            <div className="text-sm text-muted-foreground mr-4">
              Made by{" "}
              <a
                className="text-primary hover:underline font-bold"
                href="https://manavendrasen.com"
              >
                @manavendrasen
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
