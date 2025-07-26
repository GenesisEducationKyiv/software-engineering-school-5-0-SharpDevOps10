import { http } from 'msw';
import { visualCrossingSuccessfulResponse, weatherApiParisResponse } from './responses/weather.mock.responses';

export const handlers = [
  http.get('http://api.weatherapi.com/v1/current.json', ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get('q');

    if (city === 'Paris') {
      return Response.json(weatherApiParisResponse, { status: 200 });
    }

    if (city === 'FailsEverywhere') {
      return new Response('internal server error', { status: 500 });
    }

    return Response.json(
      { error: { code: 1006, message: 'No matching location found.' } },
      { status: 404 },
    );
  }),

  http.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Paris', () => {
    return Response.json(visualCrossingSuccessfulResponse, { status: 200 });
  }),

  http.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/InvalidCity', () => {
    return new Response('invalid location', { status: 400 });
  }),

  http.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Warsaw', () => {
    return Response.json(visualCrossingSuccessfulResponse, { status: 200 });
  }),

  http.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/FailsEverywhere', () => {
    return new Response('internal server error', { status: 500 });
  }),
];
