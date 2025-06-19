import { http } from 'msw';
import { CreateSubscriptionDto } from '@subscription/dto/create-subscription.dto';

export const handlers = [
  http.get('http://api.weatherapi.com/v1/current.json', ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get('q');

    if (city === 'InvalidCity') {
      return Response.json(
        {
          error: { code: 1006, message: 'No matching location found.' },
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        location: { name: city },
        current: { temp_c: 15 },
      },
      { status: 200 }
    );
  }),
  http.post('/subscribe', async ({ request }) => {
    const body = await request.json() as CreateSubscriptionDto;

    if (body.email === 'not-an-email') {
      return Response.json(
        {
          message: ['email must be an email'],
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        message: 'Subscription successful. Confirmation email sent.',
      },
      { status: 201 }
    );
  }),

  http.get('/confirm/:token', () => {
    return Response.json(
      {
        message: 'Subscription confirmed successfully',
      },
      { status: 200 }
    );
  }),

  http.get('/unsubscribe/:token', () => {
    return Response.json(
      {
        message: 'Unsubscribed successfully',
      },
      { status: 200 }
    );
  }),
];
