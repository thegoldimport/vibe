import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { Footer } from "@/components/marketing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        
        {/* How it works placeholder */}
        <section id="how-it-works" className="py-24 bg-zinc-950">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-16">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { step: "01", title: "Pick a Niche", desc: "Choose from pre-configured high-demand niches or create your own." },
                { step: "02", title: "AI Generation", desc: "Our engine builds your brand, site, and provisions your AI employee team." },
                { step: "03", title: "Automated Growth", desc: "Run AI audits to win clients and let your CEO manage fulfillment." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-6xl font-black text-primary/20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to launch your agency?</h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
              Join hundreds of agency owners who are scaling without the headache of hiring and management.
            </p>
            <button className="bg-primary text-primary-foreground h-14 px-10 rounded-full text-lg font-bold shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 transition-transform">
              Get Started Now
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
