export const mockReviews = [
  {
    id: 1,
    experience_area: 'Location and Neighbourhood',
    rating: 93,
  },
  {
    id: 2,
    experience_area: 'Fair Pricing for Rent',
    rating: 91,
  },
  {
    id: 3,
    experience_area: 'Property Up-keep and maintenance',
    rating: 49,
  },
];

export const mockAsset = {
  id: 1,
  project_name: '2972 Westheimer Rd. Santa Ana, NY',
  unit_number: '12',
  block_number: '32',
  carpet_area: '123',
  carpet_area_unit: 'Sq.ft',
  latitude: '13.77',
  longitude: '77.833',
  floor_number: 4,
  total_floors: 10,
  posted_on: '21 Aug 2020',
  available_from: 'Immediately',
  description:
    'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.\n' +
    '\n' +
    'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
  asset_group: {
    id: 1,
    name: 'Residential',
  },
  asset_type: {
    id: 1,
    name: 'Farm House',
  },
  spaces: [
    {
      id: 1,
      name: 'Bedroom',
      count: 5,
    },
    {
      id: 2,
      name: 'Bathroom',
      count: 10,
    },
  ],
  attachments: [
    {
      id: 1,
      name: 'image1.png',
      link: 'http://image.png',
      attachment_type: 'IMAGE',
      mime_type: 'Image/Jpeg',
      is_cover_image: true,
    },
    {
      id: 2,
      name: 'video1.mp4',
      link: 'http://video.mp4',
      attachment_type: 'VIDEO',
      mime_type: 'video/mp4',
      is_cover_image: false,
    },
  ],
  lease_term: {
    id: 1,
    expected_price: 18888,
    maintenance_paid_by: 'OWNER',
    utility_paid_by: 'OWNER',
    maintenance_amount: 5000,
    maintenance_schedule: 'MONTHLY',
  },
  sale_term: null,
  verification: {
    code: 3,
    description: '',
  },
  features: [
    {
      name: 'Booking Amount',
      locale_key: 'booking_amount',
      value: 10000,
    },
    {
      name: 'Booking Amount',
      locale_key: 'booking_amount',
      value: 10000,
    },
    {
      name: 'Booking Amount',
      locale_key: 'booking_amount',
      value: 10000,
    },
  ],
  amenities: [
    {
      id: 37,
      name: 'Gymnasium',
      category: {
        id: 13,
        name: 'General',
      },
      attachment: {
        id: 39,
        name: 'gym.svg',
        link: 'https://homzhub-bucket.s3.amazonaws.com/Group+2428gym.svg',
      },
    },
    {
      id: 38,
      name: 'Swimming Pool',
      category: {
        id: 13,
        name: 'General',
      },
      attachment: {
        id: 40,
        name: 'pool.svg',
        link: 'https://homzhub-bucket.s3.amazonaws.com/Group+2428gym.svg',
      },
    },
    {
      id: 39,
      name: 'CCTV Security',
      category: {
        id: 13,
        name: 'General',
      },
      attachment: {
        id: 41,
        name: 'cctv.svg',
        link: 'https://homzhub-bucket.s3.amazonaws.com/Group+2428gym.svg',
      },
    },
    {
      id: 40,
      name: 'Parking',
      category: {
        id: 13,
        name: 'General',
      },
      attachment: {
        id: 42,
        name: 'parking.svg',
        link: 'https://homzhub-bucket.s3.amazonaws.com/Group+2428gym.svg',
      },
    },
    {
      id: 41,
      name: 'Wifi',
      category: {
        id: 13,
        name: 'General',
      },
      attachment: {
        id: 43,
        name: 'wifi.svg',
        link: 'https://homzhub-bucket.s3.amazonaws.com/Group+2428gym.svg',
      },
    },
    {
      id: 42,
      name: 'Intercom',
      category: {
        id: 13,
        name: 'General',
      },
      attachment: {
        id: 44,
        name: 'intercom.svg',
        link: 'https://homzhub-bucket.s3.amazonaws.com/Group+2428gym.svg',
      },
    },
    {
      id: 43,
      name: 'Balcony',
      category: {
        id: 13,
        name: 'General',
      },
      attachment: {
        id: 45,
        name: 'balcony.svg',
        link: 'https://homzhub-bucket.s3.amazonaws.com/Group+2428gym.svg',
      },
    },
  ],
  highlights: [
    {
      name: 'Power packup',
      covered: true,
    },
    {
      name: 'Power packup',
      covered: true,
    },
    {
      name: 'Power packup',
      covered: true,
    },
    {
      name: 'Power packup',
      covered: true,
    },
    {
      name: 'Power packup',
      covered: true,
    },
    {
      name: 'Power packup',
      covered: true,
    },
  ],
  contacts: {
    id: 1,
    full_name: 'Anuvrat Somnath',
    email: 'anuvrat.somnath@nineleaps.com',
    country_code: '+91',
    phone_number: '7903470293',
  },
};
