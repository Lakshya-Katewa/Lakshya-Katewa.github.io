import { caseStudy, site, slip } from "@/data/site";
import { asset } from "@/lib/paths";
import { availableScreenshots } from "@/lib/screenshots";
import { ArrowRight, Download } from "./Icons";
import { SocialLinks } from "./SocialLinks";
import { PhoneFrame } from "./PhoneFrame";
import { flowSteps } from "./CaseStudyParts";

/*
 * Loads the three.js scene only after the browser has reported the page's
 * Largest Contentful Paint (or, where that API is missing, after load and a
 * painted frame) and the main thread is idle, so it never competes with the
 * text the visitor came to read. Skipped on Save-Data connections; if
 * anything fails, the CSS phone fallback simply stays.
 */
const sceneLoader = `(function(){var el=document.querySelector('[data-scene]');if(!el)return;
var c=navigator.connection;if(c&&c.saveData)return;
function go(){import(el.getAttribute('data-scene')).then(function(m){m.mount(el)}).catch(function(){})}
function idle(){'requestIdleCallback'in window?requestIdleCallback(go,{timeout:2500}):setTimeout(go,300)}
var started=false;function once(){if(!started){started=true;idle()}}
function afterLoad(){try{new PerformanceObserver(function(l,o){o.disconnect();setTimeout(once,0)}).observe({type:'largest-contentful-paint',buffered:true});setTimeout(once,3000)}catch(e){requestAnimationFrame(function(){requestAnimationFrame(once)})}}
document.readyState==='complete'?afterLoad():addEventListener('load',afterLoad,{once:true})})();`;

export function Hero() {
  const shot = availableScreenshots(caseStudy.screenshots)[0];

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* faint receipt grid behind the hero */}
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-16 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_26rem] lg:gap-12">
          <div>
            <p className="label">{site.role} · IIT Kanpur</p>
            <h1 id="hero-title" className="mt-5 text-[2.75rem] leading-[1.02] sm:text-7xl lg:text-[5.25rem]">
              {site.name}
            </h1>
            <p className="mt-6 max-w-2xl font-display text-2xl leading-snug text-ink sm:text-3xl">{site.tagline}</p>
            <p className="mt-5 max-w-xl text-ink-2 sm:text-lg">{site.intro}</p>
            <div className="enter mt-8 flex flex-wrap gap-3" style={{ "--i": 1 } as React.CSSProperties}>
              <a href="#work" className="btn btn-primary">
                View work <ArrowRight />
              </a>
              <a href={asset(site.resume)} className="btn btn-ghost" download>
                <Download /> Download resume
              </a>
            </div>
            <SocialLinks className="enter mt-8" style={{ "--i": 2 } as React.CSSProperties} />
          </div>

          {/* 3D stage: fixed aspect ratio, so the scene loading in never shifts layout */}
          <div
            className="stage relative mx-auto aspect-[4/5] w-full max-w-[26rem]"
            data-scene={asset("/three/hero-scene.js")}
            data-screenshot={shot ? asset(`/screenshots/${shot.file}`) : undefined}
            role="img"
            aria-label="3D model of a phone next to a milk bottle. Drag to rotate."
          >
            <div className="stage-fallback absolute inset-0 grid place-items-center">
              <div className="w-[46%]">
                <PhoneFrame screenshot={shot} steps={flowSteps} />
              </div>
            </div>
            <p aria-hidden="true" className="stage-hint label absolute inset-x-0 bottom-1 text-center">
              Drag to rotate
            </p>
          </div>
        </div>
      </div>

      {/* At-a-glance strip, styled as a tear-off order slip */}
      <div className="relative mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <aside aria-label="At a glance" className="enter" style={{ "--i": 3 } as React.CSSProperties}>
          <div className="rounded-t-lg border border-b-0 border-rule bg-surface px-5 pb-5 pt-4">
            <div className="flex items-center justify-between">
              <span className="label text-ink">At a glance</span>
              <span className="label" aria-hidden="true">
                No. 001
              </span>
            </div>
            <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {slip.map((row) => (
                <div key={row.label} className="leader slip-row lg:block">
                  <dt className="label shrink-0">{row.label}</dt>
                  <dd className="min-w-0 text-ink lg:mt-1 lg:text-left">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div aria-hidden="true" className="perforated h-2 border-x border-rule bg-surface" />
        </aside>
      </div>

      <script dangerouslySetInnerHTML={{ __html: sceneLoader }} />
    </section>
  );
}
