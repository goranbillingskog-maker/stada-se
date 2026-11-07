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
                      <span key={c.slug} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {c.name}, {c.rating ? c.rating.toFixed(1).replace(".", ",") : "5,0"} ({c.reviews}{i === 0 ? " omdömen" : ""})
                      </span>
                    ))}
                  </span>
                )}

                {isMedium && tile.topRated.length > 0 && (
                  <span className="wall-tile-best">
                    <span className="wall-tile-label">Högst betyg</span>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {tile.topRated[0].name}, {tile.topRated[0].rating ? tile.topRated[0].rating.toFixed(1).replace(".", ",") : "5,0"}
                    </span>
                  </span>
                )}
              </span>

              <span className="wall-tile-bot">
                <span className="wall-tile-num">{tile.count}</span>
                <span className="wall-tile-fine">
                  <span>firmor</span>
                  <span>{tile.rutCount} med RUT</span>
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
          .wall { min-width: 560px; }
        }
      `}</style>
    </div>
  );
}
