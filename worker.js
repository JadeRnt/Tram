// Cloudflare Worker : proxy CORS pour le flux GTFS-RT TAM (VehiclePosition)
// Déploiement : Cloudflare dashboard > Workers > tam-montpellier > Edit code > coller > Deploy
const UPSTREAMS = [
  'https://data.montpellier3m.fr/GTFS/Urbain/VehiclePosition.pb',
  'https://data.montpellier3m.fr/TAM_MMM_GTFSRT/VehiclePosition.pb',
];

export default {
  async fetch() {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=5',
    };
    for (const url of UPSTREAMS) {
      try {
        const r = await fetch(url, { cf: { cacheTtl: 5, cacheEverything: true } });
        if (r.ok) {
          return new Response(r.body, {
            headers: { ...cors, 'Content-Type': 'application/x-protobuf' },
          });
        }
      } catch (e) {}
    }
    return new Response('Upstream indisponible', { status: 502, headers: cors });
  },
};
