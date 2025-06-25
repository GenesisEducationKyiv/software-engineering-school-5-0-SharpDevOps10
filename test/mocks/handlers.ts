import { http } from 'msw';
import { visualCrossingParisResponse, weatherApiParisResponse } from './responses/weather.mock.responses';

export const handlers = [
  http.get('http://api.weatherapi.com/v1/current.json', ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get('q');

    if (city !== 'Paris') {
      return Response.json(
        { error: { code: 1006, message: 'No matching location found.' } },
        { status: 404 },
      );
    }

    return Response.json(weatherApiParisResponse, { status: 200 });
  }),

  http.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/:city', ({ params }) => {
    const city = params.city;

    if (city !== 'Paris') {
      return new Response('invalid location', { status: 400 });
    }

    return Response.json(visualCrossingParisResponse, { status: 200 });
  }),
];
