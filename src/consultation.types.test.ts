import { describe, expectTypeOf, it } from 'vitest';
import type { RegistrationMode } from './billing';
import type {
  ConsultationBookingInput,
  ConsultationBookingResponse,
  ConsultationCancelInput,
  ConsultationCancelResponse,
  ConsultationProgram,
  ConsultationSlotsResponse,
} from './consultation';

describe('consultation contract types', () => {
  it('ConsultationProgram is the program union', () => {
    expectTypeOf<ConsultationProgram>().toEqualTypeOf<
      'nextgen' | 'pro' | 'homeschool' | 'unsure'
    >();
  });

  it('ConsultationSlotsResponse lists ISO UTC starts and the slot length', () => {
    expectTypeOf<ConsultationSlotsResponse>().toEqualTypeOf<{
      success: true;
      slots: string[];
      slotMinutes: number;
    }>();
  });

  it('ConsultationBookingInput carries the booking fields consumers send', () => {
    expectTypeOf<ConsultationBookingInput['slotStart']>().toEqualTypeOf<string>();
    expectTypeOf<ConsultationBookingInput['registrationMode']>().toEqualTypeOf<RegistrationMode>();
    expectTypeOf<ConsultationBookingInput['childAge']>().toEqualTypeOf<number | undefined>();
    expectTypeOf<ConsultationBookingInput['program']>().toEqualTypeOf<ConsultationProgram>();
    expectTypeOf<ConsultationBookingInput['message']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<ConsultationBookingInput['marketingOptIn']>().toEqualTypeOf<boolean>();
    expectTypeOf<ConsultationBookingInput['website']>().toEqualTypeOf<string | undefined>();

    // @ts-expect-error program is required
    const missingProgram: ConsultationBookingInput = {
      slotStart: '2026-04-01T17:00:00.000Z',
      firstName: 'Pat',
      lastName: 'Payer',
      email: 'pat@example.com',
      registrationMode: 'guardian',
      marketingOptIn: true,
      timeZone: 'America/New_York',
      locale: 'en-US',
    };
    void missingProgram;
  });

  it('booking and cancel responses report their statuses', () => {
    expectTypeOf<ConsultationBookingResponse>().toEqualTypeOf<{
      success: true;
      status: 'booked';
    }>();
    expectTypeOf<ConsultationCancelInput>().toEqualTypeOf<{ token: string }>();
    expectTypeOf<ConsultationCancelResponse['status']>().toEqualTypeOf<'cancelled' | 'invalid'>();
  });
});
