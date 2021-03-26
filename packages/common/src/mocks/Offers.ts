import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { PaidByTypes } from '@homzhub/common/src/constants/Terms';

export enum OfferFormKeys {
  expectedRent = 'expectedPrice',
  securityDeposit = 'securityDeposit',
  minimumLeasePeriod = 'minimumLeasePeriod',
  maximumLeasePeriod = 'maximumLeasePeriod',
  annualRentIncrementPercentage = 'annualRentIncrementPercentage',
  availableFromDate = 'availableFromDate',
  tenantPreferences = 'tenantPreferences',
  message = 'message',
  // Sale Flow
  expectedSellPrice = 'expectedPrice',
  expectedBookingAmount = 'expectedBookingAmount',
}

export const initialRentFormValues = {
  expectedPrice: '',
  securityDeposit: '',
  minimumLeasePeriod: 0,
  maximumLeasePeriod: 0,
  annualRentIncrementPercentage: '',
  availableFromDate: DateUtils.getCurrentDate(),
  maintenancePaidBy: PaidByTypes.OWNER,
  utilityPaidBy: PaidByTypes.TENANT,
  tenantPreferences: [],
};

// Todo (Praharsh) : Remove after API addition.
export const unCheckedRentFormValues = {
  expectedPrice: '20000',
  securityDeposit: '40000',
  minimumLeasePeriod: 11,
  maximumLeasePeriod: 3 * 13,
  annualRentIncrementPercentage: '11',
  availableFromDate: '2020-07-03',
  maintenancePaidBy: PaidByTypes.OWNER,
  utilityPaidBy: PaidByTypes.OWNER,
  tenantPreferences: [1, 2],
};

export const initialSaleFormValues = {
  expectedPrice: '',
  expectedBookingAmount: '',
};

export const offers = [
  {
    prospect: {
      id: 2,
      number_of_occupants: 5,
      tenant_type: {
        id: 85,
        order: 1,
        label: 'Family',
        code: 'FAMILY',
      },
      user: {
        id: 1,
        full_name: 'Abhijeet Anand ****',
        first_name: 'Abhijeet Anand',
        last_name: 'Shah',
        email: 'abhijeet.shah@nineleaps.com',
        profile_picture: 'https://homzhub-bucket.s3.amazonaws.com/assest_documents/selfie_id.jpeg',
        rating: 3,
        work_info: {
          id: 4,
          job_type: {
            id: 79,
            order: 1,
            label: 'Salaried Employee',
            code: 'SALARIED_EMPLOYEE',
          },
          company_name: 'Nineleaps Technology Solutions Pvt. Ltd.',
          work_email: 'abhijeet.shah@nineleaps.com',
          work_employee_id: 'NL-408',
          company: null,
          email_verified: false,
        },
      },
    },
    id: 1,
    created_at: '21/03/2021',
    proposed_rent: 1000,
    proposed_security_deposit: 122,
    proposed_annual_rent_increment_percentage: 5,
    proposed_move_in_date: '12/03/2021',
    proposed_lease_period: 1,
    proposed_min_lock_in_period: 1,
    actions: ['ACCEPT', 'REJECT'],
    status: 'PENDING',
    tenant_preferences: [
      {
        id: 1,
        name: 'Family',
      },
      {
        id: 2,
        name: 'Pets',
      },
    ],
  },
  {
    prospect: {
      id: 2,
      number_of_occupants: 5,
      tenant_type: {
        id: 85,
        order: 1,
        label: 'Family',
        code: 'FAMILY',
      },
      user: {
        id: 1,
        full_name: 'Abhijeet Anand ****',
        first_name: 'Abhijeet Anand',
        last_name: 'Shah',
        email: 'abhijeet.shah@nineleaps.com',
        profile_picture: 'https://homzhub-bucket.s3.amazonaws.com/assest_documents/selfie_id.jpeg',
        rating: 3,
        work_info: {
          id: 4,
          job_type: {
            id: 79,
            order: 1,
            label: 'Salaried Employee',
            code: 'SALARIED_EMPLOYEE',
          },
          company_name: 'Nineleaps Technology Solutions Pvt. Ltd.',
          work_email: 'abhijeet.shah@nineleaps.com',
          work_employee_id: 'NL-408',
          company: null,
          email_verified: false,
        },
      },
    },
    id: 2,
    created_at: '21/03/2021',
    proposed_rent: 1000,
    proposed_security_deposit: 122,
    proposed_annual_rent_increment_percentage: 5,
    proposed_move_in_date: '12/03/2021',
    proposed_lease_period: 1,
    proposed_min_lock_in_period: 1,
    actions: ['CANCEL'],
    status: 'PENDING',
    tenant_preferences: [
      {
        id: 1,
        name: 'Family',
      },
      {
        id: 2,
        name: 'Pets',
      },
    ],
  },
  {
    prospect: {
      id: 2,
      number_of_occupants: 5,
      tenant_type: {
        id: 85,
        order: 1,
        label: 'Family',
        code: 'FAMILY',
      },
      user: {
        id: 1,
        full_name: 'Abhijeet Anand ****',
        first_name: 'Abhijeet Anand',
        last_name: 'Shah',
        email: 'abhijeet.shah@nineleaps.com',
        profile_picture: 'https://homzhub-bucket.s3.amazonaws.com/assest_documents/selfie_id.jpeg',
        rating: 3,
        work_info: {
          id: 4,
          job_type: {
            id: 79,
            order: 1,
            label: 'Salaried Employee',
            code: 'SALARIED_EMPLOYEE',
          },
          company_name: 'Nineleaps Technology Solutions Pvt. Ltd.',
          work_email: 'abhijeet.shah@nineleaps.com',
          work_employee_id: 'NL-408',
          company: null,
          email_verified: false,
        },
      },
    },
    id: 1,
    created_at: '21/03/2021',
    proposed_rent: 1000,
    proposed_security_deposit: 122,
    proposed_annual_rent_increment_percentage: 5,
    proposed_move_in_date: '12/03/2021',
    proposed_lease_period: 1,
    proposed_min_lock_in_period: 1,
    actions: [],
    status: 'ACCEPTED',
    tenant_preferences: [
      {
        id: 1,
        name: 'Family',
      },
      {
        id: 2,
        name: 'Pets',
      },
    ],
  },
  {
    prospect: {
      id: 1,
      number_of_occupants: 5,
      tenant_type: {
        id: 85,
        order: 1,
        label: 'Family',
        code: 'FAMILY',
      },
      user: {
        id: 1,
        full_name: 'Abhijeet Anand ****',
        first_name: 'Abhijeet Anand',
        last_name: 'Shah',
        email: 'abhijeet.shah@nineleaps.com',
        profile_picture: 'https://homzhub-bucket.s3.amazonaws.com/assest_documents/selfie_id.jpeg',
        rating: 3,
        work_info: {
          id: 4,
          job_type: {
            id: 79,
            order: 1,
            label: 'Salaried Employee',
            code: 'SALARIED_EMPLOYEE',
          },
          company_name: 'Nineleaps Technology Solutions Pvt. Ltd.',
          work_email: 'abhijeet.shah@nineleaps.com',
          work_employee_id: 'NL-408',
          company: null,
          email_verified: false,
        },
      },
    },
    id: 1,
    created_at: '21/03/2021',
    proposed_rent: 1000,
    proposed_security_deposit: 122,
    proposed_annual_rent_increment_percentage: 5,
    proposed_move_in_date: '12/03/2021',
    proposed_lease_period: 1,
    proposed_min_lock_in_period: 1,
    actions: [],
    status: 'REJECTED',
    tenant_preferences: [
      {
        id: 1,
        name: 'Family',
      },
      {
        id: 2,
        name: 'Pets',
      },
    ],
  },
  {
    prospect: {
      id: 2,
      number_of_occupants: 5,
      tenant_type: {
        id: 85,
        order: 1,
        label: 'Family',
        code: 'FAMILY',
      },
      user: {
        id: 1,
        full_name: 'Abhijeet Anand ****',
        first_name: 'Abhijeet Anand',
        last_name: 'Shah',
        email: 'abhijeet.shah@nineleaps.com',
        profile_picture: 'https://homzhub-bucket.s3.amazonaws.com/assest_documents/selfie_id.jpeg',
        rating: 3,
        work_info: {
          id: 4,
          job_type: {
            id: 79,
            order: 1,
            label: 'Salaried Employee',
            code: 'SALARIED_EMPLOYEE',
          },
          company_name: 'Nineleaps Technology Solutions Pvt. Ltd.',
          work_email: 'abhijeet.shah@nineleaps.com',
          work_employee_id: 'NL-408',
          company: null,
          email_verified: false,
        },
      },
    },
    id: 2,
    created_at: '21/03/2021',
    proposed_price: 1000.0,
    proposed_booking_amount: 122.0,
    actions: ['CANCEL'],
    status: 'PENDING',
    tenant_preferences: [
      {
        id: 1,
        name: 'Family',
      },
      {
        id: 2,
        name: 'Pets',
      },
    ],
  },
];
