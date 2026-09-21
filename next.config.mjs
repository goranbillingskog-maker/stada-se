/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      { source: "/stockholm/vasaglansen-ab/", destination: "/vasastan/vasaglansen-ab/", permanent: true },
      { source: "/stockholm/hembry-ab/", destination: "/vasastan/hembry-ab/", permanent: true },
      { source: "/stockholm/stadfen-ab/", destination: "/vasastan/stadfen-ab/", permanent: true },
      { source: "/stockholm/stadfabriken-ab/", destination: "/vasastan/stadfabriken-ab/", permanent: true },
      { source: "/stockholm/stadade-hem/", destination: "/nacka/stadade-hem/", permanent: true },
      { source: "/stockholm/renyx-ab/", destination: "/nacka/renyx-ab/", permanent: true },
      { source: "/stockholm/cleanflat-sverige-ab/", destination: "/solna/cleanflat-sverige-ab/", permanent: true },
      { source: "/stockholm/carolas-hem-foretagsservice-ab/", destination: "/solna/carolas-hem-foretagsservice-ab/", permanent: true },
      { source: "/stockholm/rut-putsarna-och-stadarna-i-sverige-ab/", destination: "/ostermalm/rut-putsarna-och-stadarna-i-sverige-ab/", permanent: true },
      { source: "/stockholm/hello-clean-hemstadning/", destination: "/sodermalm/hello-clean-hemstadning/", permanent: true },
      { source: "/stockholm/excellent-cleaning/", destination: "/sodermalm/excellent-cleaning/", permanent: true },
      { source: "/stockholm/stadbolag-ett-i-taby-ab/", destination: "/taby/stadbolag-ett-i-taby-ab/", permanent: true },
      { source: "/stockholm/scandinavian-cleaning/", destination: "/taby/scandinavian-cleaning/", permanent: true },
      { source: "/stockholm/skinande-hem-i-stockholm-ab/", destination: "/taby/skinande-hem-i-stockholm-ab/", permanent: true },
      { source: "/stockholm/clean-choice/", destination: "/taby/clean-choice/", permanent: true },
      { source: "/stockholm/nytta-ab/", destination: "/taby/nytta-ab/", permanent: true },
    ];
  },
};

export default nextConfig;
