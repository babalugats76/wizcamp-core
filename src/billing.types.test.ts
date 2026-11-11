import { describe, expectTypeOf, it } from 'vitest';
import type {
  Enrollee,
  GuardianEnrollee,
  GuardianRegistrant,
  GuardianRegistration,
  PaymentRequest,
  PaymentToken,
  Registrant,
  Registration,
  RegistrationMode,
  SelfEnrollee,
  SelfRegistration,
} from './billing';

const registrant: Registrant = {
  firstName: 'Pat',
  lastName: 'Payer',
  email: 'pat@example.com',
  phone: '555-0100',
};

describe('billing registration contract types', () => {
  it('exports the registration mode union', () => {
    expectTypeOf<RegistrationMode>().toEqualTypeOf<'self' | 'guardian'>();
  });

  it('Enrollee is the shared base with no age or phone', () => {
    expectTypeOf<Enrollee>().toEqualTypeOf<{
      firstName: string;
      lastName: string;
      email: string;
      nickname?: string;
    }>();
  });

  it('SelfEnrollee requires phone and forbids age', () => {
    expectTypeOf<SelfEnrollee['phone']>().toEqualTypeOf<string>();
    expectTypeOf<SelfEnrollee['age']>().toEqualTypeOf<undefined>();

    // @ts-expect-error phone is required on SelfEnrollee
    const missingPhone: SelfEnrollee = { firstName: 'A', lastName: 'B', email: 'a@b.co' };
    const withAge: SelfEnrollee = {
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.co',
      phone: '1',
      // @ts-expect-error age is not allowed on SelfEnrollee
      age: 30,
    };
    void missingPhone;
    void withAge;
  });

  it('GuardianEnrollee requires age and has no phone', () => {
    expectTypeOf<GuardianEnrollee['age']>().toEqualTypeOf<number>();
    expectTypeOf<GuardianEnrollee>().not.toHaveProperty('phone');

    // @ts-expect-error age is required on GuardianEnrollee
    const missingAge: GuardianEnrollee = { firstName: 'A', lastName: 'B', email: 'a@b.co' };
    const withPhone: GuardianEnrollee = {
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.co',
      age: 12,
      // @ts-expect-error phone is not collected for minors
      phone: '1',
    };
    void missingAge;
    void withPhone;
  });

  it('SelfRegistration requires enrollee.phone, rejects enrollee.age and any relationship', () => {
    expectTypeOf<SelfRegistration['registrationMode']>().toEqualTypeOf<'self'>();

    const noPhone: SelfRegistration = {
      registrationMode: 'self',
      // @ts-expect-error enrollee.phone is required in the self flow
      enrollee: { firstName: 'A', lastName: 'B', email: 'a@b.co' },
      registrant,
    };
    const withAge: SelfRegistration = {
      registrationMode: 'self',
      // @ts-expect-error enrollee.age is not allowed in the self flow
      enrollee: { firstName: 'A', lastName: 'B', email: 'a@b.co', phone: '1', age: 30 },
      registrant,
    };
    const withRelationship: SelfRegistration = {
      registrationMode: 'self',
      enrollee: { firstName: 'A', lastName: 'B', email: 'a@b.co', phone: '1' },
      // @ts-expect-error relationship is not allowed on a self registrant
      registrant: { ...registrant, relationship: 'parent' },
    };
    void noPhone;
    void withAge;
    void withRelationship;
  });

  it('GuardianRegistration requires enrollee.age, rejects enrollee.phone and requires registrant.relationship', () => {
    expectTypeOf<GuardianRegistration['registrationMode']>().toEqualTypeOf<'guardian'>();
    expectTypeOf<GuardianRegistrant>().toEqualTypeOf<Registrant & { relationship: string }>();

    const noAge: GuardianRegistration = {
      registrationMode: 'guardian',
      // @ts-expect-error enrollee.age is required in the guardian flow
      enrollee: { firstName: 'A', lastName: 'B', email: 'a@b.co' },
      registrant: { ...registrant, relationship: 'parent' },
    };
    const withPhone: GuardianRegistration = {
      registrationMode: 'guardian',
      // @ts-expect-error enrollee.phone is not collected for minors
      enrollee: { firstName: 'A', lastName: 'B', email: 'a@b.co', age: 12, phone: '1' },
      registrant: { ...registrant, relationship: 'parent' },
    };
    const noRelationship: GuardianRegistration = {
      registrationMode: 'guardian',
      enrollee: { firstName: 'A', lastName: 'B', email: 'a@b.co', age: 12 },
      // @ts-expect-error registrant.relationship is required in the guardian flow
      registrant,
    };
    void noAge;
    void withPhone;
    void noRelationship;
  });

  it('Registration is the union of the two modes', () => {
    expectTypeOf<Registration>().toEqualTypeOf<SelfRegistration | GuardianRegistration>();
  });

  it('PaymentRequest narrows on registrationMode', () => {
    expectTypeOf<
      Extract<PaymentRequest, { registrationMode: 'guardian' }>['enrollee']
    >().toEqualTypeOf<GuardianEnrollee>();
    expectTypeOf<
      Extract<PaymentRequest, { registrationMode: 'self' }>['enrollee']
    >().toEqualTypeOf<SelfEnrollee>();

    const narrow = (request: PaymentRequest) => {
      if (request.registrationMode === 'self') {
        expectTypeOf(request.enrollee).toEqualTypeOf<SelfEnrollee>();
      } else {
        expectTypeOf(request.enrollee).toEqualTypeOf<GuardianEnrollee>();
      }
    };
    void narrow;
  });

  it('PaymentToken has no verificationToken', () => {
    expectTypeOf<PaymentToken>().not.toHaveProperty('verificationToken');
    expectTypeOf<PaymentToken>().toEqualTypeOf<{
      cardToken: string;
      idempotencyKey: string;
      locationId: string;
    }>();
  });
});
