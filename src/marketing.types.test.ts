import { describe, expectTypeOf, it } from 'vitest';
import type { RegistrationMode } from './billing';
import type {
  CancelRegistrationInput,
  CancelRegistrationResponse,
  ConfirmInput,
  ConfirmResponse,
  EventRegistrationInput,
  EventRegistrationResponse,
  MarketingSegment,
  MarketingTopic,
  NewsletterSignupInput,
  SignupResponse,
  WaitlistSignupInput,
} from './marketing';

describe('marketing contract types', () => {
  it('MarketingTopic is the topic union', () => {
    expectTypeOf<MarketingTopic>().toEqualTypeOf<
      'newsletter' | 'camps' | 'events' | 'nextgen' | 'pro' | 'homeschool' | 'educator'
    >();
  });

  it('MarketingSegment is the segment union', () => {
    expectTypeOf<MarketingSegment>().toEqualTypeOf<'subscribers' | 'customers' | 'waitlist'>();
  });

  it('NewsletterSignupInput requires email and carries a honeypot', () => {
    expectTypeOf<NewsletterSignupInput['email']>().toEqualTypeOf<string>();
    expectTypeOf<NewsletterSignupInput['firstName']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<NewsletterSignupInput['website']>().toEqualTypeOf<string | undefined>();

    // @ts-expect-error email is required
    const missingEmail: NewsletterSignupInput = { firstName: 'Pat' };
    void missingEmail;
  });

  it('WaitlistSignupInput extends the newsletter shape with a required campSlug', () => {
    expectTypeOf<WaitlistSignupInput>().toMatchTypeOf<NewsletterSignupInput>();
    expectTypeOf<WaitlistSignupInput['campSlug']>().toEqualTypeOf<string>();
    expectTypeOf<WaitlistSignupInput['campName']>().toEqualTypeOf<string | undefined>();
  });

  it('SignupResponse reports pending confirmation', () => {
    expectTypeOf<SignupResponse>().toEqualTypeOf<{
      success: true;
      status: 'pending_confirmation';
    }>();
  });

  it('ConfirmInput and ConfirmResponse model the double opt-in token flow', () => {
    expectTypeOf<ConfirmInput>().toEqualTypeOf<{ token: string }>();
    expectTypeOf<ConfirmResponse['status']>().toEqualTypeOf<'confirmed' | 'invalid'>();
  });

  it('EventRegistrationInput carries RegistrationMode and marketingOptIn', () => {
    expectTypeOf<EventRegistrationInput['registrationMode']>().toEqualTypeOf<RegistrationMode>();
    expectTypeOf<EventRegistrationInput['marketingOptIn']>().toEqualTypeOf<boolean>();
    expectTypeOf<EventRegistrationInput['timeZone']>().toEqualTypeOf<string>();
    expectTypeOf<EventRegistrationInput['locale']>().toEqualTypeOf<string>();
    expectTypeOf<EventRegistrationInput['website']>().toEqualTypeOf<string | undefined>();

    // @ts-expect-error marketingOptIn is required, not optional
    const missingOptIn: EventRegistrationInput = {
      eventSlug: 'open-house',
      firstName: 'Pat',
      lastName: 'Payer',
      email: 'pat@example.com',
      registrationMode: 'self',
      timeZone: 'America/New_York',
      locale: 'en-US',
    };
    void missingOptIn;
  });

  it('EventRegistrationResponse reports registered', () => {
    expectTypeOf<EventRegistrationResponse>().toEqualTypeOf<{
      success: true;
      status: 'registered';
    }>();
  });

  it('cancel registration models the token flow', () => {
    expectTypeOf<CancelRegistrationInput>().toEqualTypeOf<{ token: string }>();
    expectTypeOf<CancelRegistrationResponse['status']>().toEqualTypeOf<'cancelled' | 'invalid'>();
  });
});
