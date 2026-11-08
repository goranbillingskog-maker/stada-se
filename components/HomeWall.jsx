import Link from "next/link";
import { HOMEPAGE_TILES } from "../lib/tilesConfig.js";
import { getCity, getCompaniesByCity } from "../lib/data.js";

export default function HomeWall() {
  const tilesData = HOMEPAGE_TILES.map((tileConfig) => {
    const city = getCity(tileConfig.citySlug) || { name: tileConfig.citySlug, slug: tileConfig.citySlug };
    const companies = getCompaniesByCity(tileConfig.citySlug);
    const rutCount = companies.filter((c) => c.rutAvdrag === "Ja").length;
    const topRated = companies
      .filter((c) => c.rating && c.reviews && c.reviews >= 10)
      .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);

    return {
      ...tileConfig,
      name: city.name,
      slug: city.slug,
      count: companies.length,
      rutCount,
      topRated,
    };
  });

  return (
    <div className="wall-scroll">
      <div className="wall" role="group" aria-label="Städer med flest städfirmor">
        {tilesData.map((tile) => {
          const isLarge = tile.size === "l";
          const isMedium = tile.size === "m";
          const isSmall = tile.size === "s";

          return (
            <Link
              key={tile.slug}
              href={`/${tile.slug}/`}
              className={`wall-tile wall-tile--${tile.color} wall-tile--${tile.size}`}
              style={{ gridArea: tile.gridArea }}
            >
              <span className="wall-tile-top">
                <span className="wall-tile-name">{tile.name}</span>

                {isLarge && tile.topRated.length > 0 && (
                  <span className="wall-tile-best">
                    <span className="wall-tile-label">Högst betyg på Google</span>
                    {tile.topRated.slice(0, 3).map((c, i) => (
                      <span key={c.slug} className={`wall-tile-firm wall-tile-firm--${i}`}>
                        <span className="firm-name-text">{c.name}</span>, {c.rating ? c.rating.toFixed(1).replace(".", ",") : "5,0"} <span className="firm-reviews-wrap">({c.reviews}<span className="firm-reviews-word">{i === 0 ? " omdömen" : ""}</span>)</span>
                      </span>
                    ))}
                  </span>
                )}

                {isMedium && tile.topRated.length > 0 && (
                  <span className="wall-tile-best">
                    <span className="wall-tile-label">Högst betyg</span>
                    <span className="wall-tile-firm">
                      <span className="firm-name-text">{tile.topRated[0].name}</span>, {tile.topRated[0].rating ? tile.topRated[0].rating.toFixed(1).replace(".", ",") : "5,0"}
                    </span>
                  </span>
                )}
              </span>

              <span className="wall-tile-bot">
                <span className="wall-tile-num">{tile.count}</span>
                <span className="wall-tile-fine">
                  <span className="wall-tile-units">firmor</span>
                  <span className="wall-tile-rut">{tile.rutCount} med RUT</span>
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <style>{`
        .wall-scroll {
          overflow-x: auto;
          max-width: 760px;
          width: 100%;
        }
        .wall {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          grid-template-rows: repeat(7, minmax(0, 1fr));
          gap: 6px;
          padding: 6px;
          box-sizing: border-box;
          aspect-ratio: 6 / 7;
          background: var(--grout);
          border-radius: var(--r-box);
        }
        .wall-tile {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 6px;
          box-sizing: border-box;
          min-width: 0;
          min-height: 0;
          overflow: hidden;
          border-radius: var(--r-tile);
          padding: 8px 10px;
          color: var(--ink);
          container-type: inline-size;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.55), inset 0 -3px 0 rgba(14, 43, 59, 0.09);
          transition: background-color 0.15s, color 0.15s;
        }
        .wall-tile--sun { background: var(--sun); }
        .wall-tile--mint { background: var(--mint); }
        .wall-tile--water { background: var(--water); }
        .wall-tile--white { background: var(--white); }
        .wall-tile--pale { background: var(--pale); }

        .wall-tile:hover {
          background: var(--ink) !important;
          color: var(--white) !important;
        }

        .wall-tile-top { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .wall-tile-bot { display: flex; flex-direction: column; gap: 4px; min-width: 0; }

        .wall-tile-name, .wall-tile-num {
          font-family: var(--font-archivo), system-ui, sans-serif;
          font-stretch: 62%;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .wall-tile-name { line-height: 0.9; }
        .wall-tile-num { line-height: 0.85; }

        .wall-tile-best, .wall-tile-fine {
          font-family: var(--font-archivo), system-ui, sans-serif;
          font-stretch: 112%;
          font-weight: 450;
          line-height: 1.25;
        }

        .wall-tile-best { display: flex; flex-direction: column; gap: 3px; }
        .wall-tile-fine { display: flex; flex-direction: column; }
        .wall-tile-label { font-weight: 700; }
        .wall-tile-firm {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }

        /* Small tiles */
        .wall-tile--s .wall-tile-name { font-size: 16px; font-size: 21cqw; }
        .wall-tile--s .wall-tile-num { font-size: 28px; font-size: 36cqw; }
        .wall-tile--s .wall-tile-fine { font-size: 10.5px; font-size: max(10.5px, 13cqw); }

        /* Medium tiles */
        .wall-tile--m { padding: 12px 14px; }
        .wall-tile--m .wall-tile-name { font-size: 42px; font-size: 26cqw; }
        .wall-tile--m .wall-tile-num { font-size: 52px; font-size: 32cqw; }
        .wall-tile--m .wall-tile-best, .wall-tile--m .wall-tile-fine { font-size: 11.5px; font-size: max(11.5px, 6.4cqw); }
        .wall-tile--m .wall-tile-bot { flex-direction: row; align-items: flex-end; gap: 10px; }

        /* Large tile */
        .wall-tile--l { padding: 16px 18px; }
        .wall-tile--l .wall-tile-name { font-size: 70px; font-size: 27cqw; }
        .wall-tile--l .wall-tile-num { font-size: 60px; font-size: 22cqw; }
        .wall-tile--l .wall-tile-best, .wall-tile--l .wall-tile-fine { font-size: 12.5px; font-size: max(12.5px, 4.6cqw); }
        .wall-tile--l .wall-tile-bot { flex-direction: row; align-items: flex-end; gap: 12px; }

        @media (max-width: 640px) {
          .wall-scroll {
            overflow-x: visible;
          }
          .wall {
            width: 100%;
            min-width: 0;
            gap: 4px;
            padding: 4px;
            border-radius: 8px;
          }
          .wall-tile {
            padding: 4px 5px;
            border-radius: 4px;
            gap: 2px;
            overflow: visible;
          }

          /* Small tiles: visa bara stadens namn och antal firmor, dölj RUT och ev Högst betyg */
          .wall-tile--s {
            padding: 3px 3px;
          }
          .wall-tile--s .wall-tile-name {
            font-size: clamp(9.5px, 2.7vw, 13px);
            white-space: nowrap;
            overflow: visible;
          }
          .wall-tile--s .wall-tile-bot {
            flex-direction: row;
            align-items: baseline;
            gap: 2px;
          }
          .wall-tile--s .wall-tile-num {
            font-size: clamp(12px, 3.6vw, 18px);
          }
          .wall-tile--s .wall-tile-fine {
            font-size: clamp(8px, 2.2vw, 9.5px);
            line-height: 1;
          }
          .wall-tile--s .wall-tile-rut,
          .wall-tile--s .wall-tile-best {
            display: none !important;
          }

          /* Medium tiles: Uppsala m.fl. */
          .wall-tile--m {
            padding: 6px 7px;
          }
          .wall-tile--m .wall-tile-name {
            font-size: clamp(18px, 5.2vw, 28px);
          }
          .wall-tile--m .wall-tile-bot {
            flex-direction: row;
            align-items: baseline;
            gap: 4px;
          }
          .wall-tile--m .wall-tile-num {
            font-size: clamp(18px, 5.2vw, 28px);
          }
          .wall-tile--m .wall-tile-fine {
            font-size: clamp(8.5px, 2.4vw, 11px);
          }
          .wall-tile--m .wall-tile-rut {
            display: none !important;
          }
          .wall-tile--m .wall-tile-best {
            display: flex;
            flex-direction: column;
            gap: 1px;
            font-size: clamp(8.5px, 2.4vw, 10.5px);
            line-height: 1.15;
          }
          .wall-tile--m .wall-tile-best .wall-tile-label {
            font-size: clamp(8px, 2.1vw, 9.5px);
            opacity: 0.85;
          }
          .wall-tile--m .wall-tile-firm {
            white-space: normal;
            overflow: visible;
            text-overflow: clip;
            line-height: 1.15;
          }

          /* Large tile: Stockholm */
          .wall-tile--l {
            padding: 8px 10px;
          }
          .wall-tile--l .wall-tile-name {
            font-size: clamp(26px, 7.5vw, 44px);
          }
          .wall-tile--l .wall-tile-num {
            font-size: clamp(22px, 6.5vw, 36px);
          }
          .wall-tile--l .wall-tile-bot {
            flex-direction: row;
            align-items: baseline;
            gap: 6px;
          }
          .wall-tile--l .wall-tile-fine {
            font-size: clamp(9px, 2.6vw, 11.5px);
          }
          .wall-tile--l .wall-tile-best {
            display: flex;
            flex-direction: column;
            gap: 2px;
            font-size: clamp(9px, 2.5vw, 11px);
            line-height: 1.2;
          }
          .wall-tile--l .wall-tile-best .wall-tile-label {
            font-size: clamp(8.5px, 2.3vw, 10px);
            opacity: 0.85;
          }
          .wall-tile--l .wall-tile-firm {
            white-space: normal;
            overflow: visible;
            text-overflow: clip;
            line-height: 1.2;
          }
          .wall-tile--l .wall-tile-firm--2 {
            display: none !important;
          }
          .wall-tile--l .firm-reviews-word {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
