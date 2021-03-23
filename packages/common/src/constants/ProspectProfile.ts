export const sampleData = {
  job_type: {
    id: 1,
    order: 1,
    label: 'Salaried Employee',
    name: 'Salaried Employee',
    code: 'SALARIED_EMPLOYEE',
  },
  company_name: 'Nineleaps Technology Solutions Pvt. Ltd.',
  work_email: 'abhijeet.shah@nineleaps.com',
  number_of_occupants: 5,
  tenant_type: {
    id: 2,
    order: 2,
    label: 'Bachelor',
    code: 'BACHELOR',
  },
  userName: 'Jaya Naveen sai',
  designation: 'naveen.sai@nineleaps.com',
  description: 'Nibh nunc massa mauris velit vitae cursus sagittis. Ornare ut porta velit lorem metus ut.',
};

export const tenantType = [
  { id: 1, label: 'Family', order: 1 },
  { id: 2, label: 'Student', order: 3 },
  { id: 3, label: 'Bachelor', order: 2 },
];

export const offerDropDown = [
  { value: 1, label: 'Salaried Employee' },
  { value: 2, label: 'Self- employed' },
  { value: 3, label: 'Freelancer' },
  { value: 4, label: 'Student' },
  { value: 5, label: 'Un-employed' },
  { value: 6, label: 'Others' },
];

export const acceptOffer = {
  name: 'jayanaveensai',
  designation: 'Prospect',
  propertyName: 'Kalyani',
  propertyAddress: 'Kalyani, Kalkere, Bengaluru, Karnataka 560016',
  date: '2021-03-15T12:54:09.397112Z',
  owner: [
    { Text: '1. Your property will no longer appear in search results' },
    { Text: '2. All the active offers will be automatically rejected.' },
    { Text: '3. Your last name, phone number, email will be visible to the prospect should you accept this offer.' },
    {
      Text:
        '4. Homzhub is not legally liable for the actions of its user. Please do your own due diligence before transferring any amount',
    },
  ],
  tenant: [
    {
      Text:
        '1. Your last name, phone number, and email will be visible to the property owner should you accept this offer.',
    },
    { Text: '2. The property owner will create a lease to connect you with the property' },
    { Text: '3. Once the lease is created, you can chat with the owner via the messages feature in the app. ' },
    {
      Text:
        '4. Homzhub is not legally liable for the actions of its user. Please do your own due diligence before transferring money.',
    },
  ],
};
