import Link from "next/link";
import { CtaBand, Section } from "@/components/site/inner";
import { px } from "@/lib/img";

const TYPES = [
  { title: "Experts", desc: "Ship faster, build credibility through certification, and deliver broader solutions to clients.", href: "/partners/experts" },
  { title: "Solution partners", desc: "Deliver transformation at scale. Help companies design, build, and ship with Lovable.", href: "/partners/solution" },
];

export default function PartnersPage() {
  return (
    <main className="bg-parchment">
      <section className="overflow-x-clip">
        <div className="partners-container py-20 md:py-40">
          <div className="relative mx-auto w-fit">
            <svg width="522" height="287" viewBox="0 0 522 287" fill="none" className="hidden md:block absolute top-[calc(100%-121px)] right-[calc(100%+35px)]">
              <path d="M511.009 48.6008C331.781 275.647 93.6514 86.1315 137.65 23.1315C181.65 -39.8685 359.1 145.461 10.3442 276.391" stroke="url(#_r_fg_-linear0)" strokeWidth="20" strokeLinecap="round" />
              <path d="M224.365 127.133C229.909 112.464 232.186 98.2573 231.843 84.8428L211.727 82.5889C212.323 93.1301 210.861 104.937 206.407 117.617L206.406 117.633L224.281 127.133H224.365ZM188.658 181.93C200.233 169.635 209.196 157.382 215.881 145.339L198 136.039H197.982C197.998 136.048 198.014 136.057 198.029 136.066C192.174 146.569 184.215 157.492 173.703 168.649L188.658 181.93Z" fill="url(#_r_fg_-linear1)" style={{ mixBlendMode: "overlay" as const }} />
              <g opacity="0.4" filter="url(#_r_fg_-blur)" style={{ mixBlendMode: "plus-lighter" as const }}><path d="M511.009 51.5996C331.78 278.646 93.6513 89.1303 137.65 26.1303" stroke="url(#_r_fg_-linear2)" strokeWidth="5" /></g>
              <defs><filter id="_r_fg_-blur" x="123.828" y="18.6992" width="395.141" height="150.01" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="3" result="effect1_foregroundBlur" /></filter><linearGradient id="_r_fg_-linear0" x1="397.657" y1="-49.0773" x2="71.6614" y2="329.229" gradientUnits="userSpaceOnUse"><stop stopColor="#4F88FF" /><stop offset="0.0833333" stopColor="#5185FF" /><stop offset="0.166667" stopColor="#5885FF" /><stop offset="0.25" stopColor="#6289FF" /><stop offset="0.333333" stopColor="#7491FF" /><stop offset="0.416667" stopColor="#91A0FF" /><stop offset="0.5" stopColor="#B0ACFE" /><stop offset="0.583333" stopColor="#CEAFFB" /><stop offset="0.666667" stopColor="#E2A5F2" /><stop offset="0.75" stopColor="#F388DE" /><stop offset="0.833333" stopColor="#FB65C2" /><stop offset="0.916667" stopColor="#FD49A8" /><stop offset="1" stopColor="#FD2980" /></linearGradient><linearGradient id="_r_fg_-linear1" x1="190.657" y1="177.632" x2="226.655" y2="82.588" gradientUnits="userSpaceOnUse"><stop offset="0.0613399" stopOpacity="0" /><stop offset="0.366514" /><stop offset="0.661509" /><stop offset="0.927268" stopOpacity="0" /></linearGradient><linearGradient id="_r_fg_-linear2" x1="120.291" y1="5.07471" x2="438.419" y2="-118.674" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity="0" /><stop offset="0.244001" stopColor="white" /><stop offset="0.619729" stopColor="white" stopOpacity="0.7" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient></defs>
            </svg>
            <svg width="1147" height="704" viewBox="0 0 1147 704" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-[calc(100%-276px)] left-[calc(100%-646px)] scale-70 rotate-20 md:bottom-[calc(100%-225px)] md:left-[calc(100%-543px)] md:scale-100 lg:rotate-0">
              <path d="M10.6172 11C73.7398 580.923 818.947 490.685 694.617 369C570.287 247.315 458.31 735.619 1136.24 691.016" stroke="url(#_r_fh_-linear0)" strokeWidth="20" strokeLinecap="round" />
              <g filter="url(#_r_fh_-blur)" style={{ mixBlendMode: "plus-lighter" as const }}><path d="M10.6172 8C73.7398 577.923 818.947 487.685 694.617 366" stroke="url(#_r_fh_-linear1)" strokeOpacity="0.5" strokeWidth="4" /></g>
              <path d="M611.07 426.801C610.79 432.106 610.811 437.626 611.166 443.323L591.327 446.237C591.126 443.455 590.994 440.7 590.93 437.975C597.241 434.506 604.909 429.785 611.07 426.801Z" fill="url(#_r_fh_-linear2)" style={{ mixBlendMode: "overlay" as const }} />
              <defs><filter id="_r_fh_-blur" x="1.63281" y="0.779297" width="715.945" height="464.955" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="3.5" result="effect1_foregroundBlur" /></filter><linearGradient id="_r_fh_-linear0" x1="1154.12" y1="648.351" x2="-45.6943" y2="145.31" gradientUnits="userSpaceOnUse"><stop stopColor="#4F88FF" /><stop offset="0.047619" stopColor="#5185FF" /><stop offset="0.0952381" stopColor="#5885FF" /><stop offset="0.142857" stopColor="#6289FF" /><stop offset="0.190476" stopColor="#7491FF" /><stop offset="0.238095" stopColor="#91A0FF" /><stop offset="0.285714" stopColor="#B0ACFE" /><stop offset="0.333333" stopColor="#CEAFFB" /><stop offset="0.380952" stopColor="#E2A5F2" /><stop offset="0.428571" stopColor="#F388DE" /><stop offset="0.47619" stopColor="#FB65C2" /><stop offset="0.52381" stopColor="#FD49A8" /><stop offset="0.571429" stopColor="#FD2980" /><stop offset="0.619048" stopColor="#FC1A58" /><stop offset="0.666667" stopColor="#FA1F41" /><stop offset="0.714286" stopColor="#FA2733" /><stop offset="0.761905" stopColor="#FB3D26" /><stop offset="0.809524" stopColor="#FC541F" /><stop offset="0.857143" stopColor="#FE6A1E" /><stop offset="0.904762" stopColor="#FE771D" /><stop offset="0.952381" stopColor="#FF861B" /><stop offset="1" stopColor="#FF8F1B" /></linearGradient><linearGradient id="_r_fh_-linear1" x1="378.617" y1="453" x2="717.617" y2="389" gradientUnits="userSpaceOnUse"><stop offset="0.724947" stopColor="white" /><stop offset="0.967652" stopColor="white" stopOpacity="0" /></linearGradient><linearGradient id="_r_fh_-linear2" x1="597.41" y1="432.001" x2="603.442" y2="445.138" gradientUnits="userSpaceOnUse"><stop stopColor="#666666" stopOpacity="0" /><stop offset="1" /></linearGradient></defs>
            </svg>
            <div className="relative w-fit md:flex md:flex-col md:items-center">
              <h1 className="text-charcoal font-bold whitespace-pre-wrap text-[40px]/11 -tracking-[1.6px] md:text-center md:text-[80px]/20 md:-tracking-[3.2px]">Become a<br />Lovable Partner</h1>
              <p className="mt-4 max-w-[540px] text-charcoal/80 font-medium text-base/6 -tracking-[0.32px] md:text-center md:text-lg/6.5 md:-tracking-[0.36px]">800,000 people and agencies of all sizes already build for clients with Lovable. Join the Lovable Partner program to get certified on your work, get discovered by clients, and earn on the business you bring.</p>
              <div className="mt-6 flex flex-col items-start gap-y-4 md:items-center">
                <div className="flex flex-wrap items-center gap-3">
                  <a className="group/partners-button inline-flex items-center gap-x-1.25 rounded-full bg-charcoal px-4 py-3 text-sm/5 font-medium text-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_0_rgba(0,0,0,0.06)] transition-colors hover:bg-charcoal/90" href="#partner-types">Become a partner</a>
                  <a href="/work-with-a-partner" className="group/partners-button inline-flex items-center gap-x-1.25 rounded-full bg-white px-4 py-3 text-sm/5 font-medium text-charcoal shadow-[0_0_0_1px_#ECEAE3] hover:bg-[#F4F3F1]">Work with a partner</a>
                </div>
                <a className="group/partners-button inline-flex items-center gap-x-1.25 rounded-full px-0 py-2 text-sm/5 font-medium text-charcoal" href="https://partner-tools.lovable.app/" target="_blank" rel="noopener noreferrer">Already a partner? Log in<div className="pt-px"><svg className="transition-[translate,opacity] group-hover/partners-button:translate-x-[2.5px] opacity-60 group-hover/partners-button:opacity-100" width="16" height="16" fill="none"><path d="M6.5 5L9.5 8L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path className="[stroke-dashoffset:1] group-hover/partners-button:[stroke-dashoffset:0] transition-[stroke-dashoffset]" d="M9.5 8L2.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1 1" /></svg></div></a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="overflow-hidden rounded-3xl border border-black/10 shadow-sm">
          <img src={px("https://lovable.dev/cdn-cgi/image/width=1284,f=auto,fit=scale-down/https://assets.lovable.dev/content/partners/types/partners-types-primary.jpg")} alt="Lovable partners" loading="eager" decoding="async" className="aspect-[16/8] w-full object-cover" />
        </div>
      </section>
      <Section eyebrow="Programs" title="Discover partnership opportunities" sub="Find the right partnership to grow your business.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TYPES.map((t) => (
            <div key={t.title} className="group rounded-2xl border border-black/10 bg-white p-6 transition-colors hover:border-stone">
              <h3 className="text-xl font-medium text-charcoal">{t.title}</h3>
              <p className="mt-1.5 text-[15px] text-steel">{t.desc}</p>
              <Link href={t.href} className="mt-4 inline-flex items-center gap-x-1.25 rounded-full bg-charcoal px-4 py-2.5 text-sm/5 font-medium text-white hover:bg-charcoal/90">Apply now</Link>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-steel">
          <a href="https://partner-program-rules.lovable.app/#compare" target="_blank" rel="noopener noreferrer" className="underline hover:text-charcoal">See the full head-to-head comparison</a>
        </p>
      </Section>
      <Section>
        <figure className="mx-auto max-w-2xl text-center">
          <blockquote className="text-xl font-medium text-charcoal md:text-2xl">
            &ldquo;We run an agency with 300+ clients and $600K ARR using Lovable. What used to take weeks of design and dev now takes hours or days, and clients get a real, full-stack website: forms, payments, integrations, all of it.&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-sm text-steel">Jonathan Tembo, Co-founder of J&amp;T Promotions</figcaption>
        </figure>
      </Section>
      <CtaBand title="Ready to build with us?" sub="Tell us about your practice and we'll match you with the right program." />
    </main>
  );
}
