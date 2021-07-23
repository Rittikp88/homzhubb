// Todo (Praharsh) : Remove mock file after API integration
export const reminder = {
  id: 1,
  title: 'Hello world.',
  description: 'Foobar',
  emails: ['foobar@nineleaps.com'],
  reminder_category: {
    id: 1,
    code: 'RENT',
    name: 'Rent',
  },
  reminder_frequency: {
    id: 1,
    code: 'MONTHLY',
    name: 'Monthly',
  },
  asset: {
    id: 1236,
    project_name: 'Green House',
    unit_number: '1',
    block_number: '12',
    address: '15, Kalpalayam, Lakshmipuram, Chennai, Tamil Nadu 600099, India',
    postal_code: '600099',
    latitude: 13.1367271,
    longitude: 80.207439,
    carpet_area: 1250.0,
    carpet_area_unit: {
      id: 1,
      name: 'SQ_FT',
      label: 'Square Feet',
      title: 'Sq.ft',
    },
    floor_number: 1,
    total_floors: 2,
    construction_year: 2006,
    is_gated: true,
    power_backup: true,
    corner_property: true,
    all_day_access: false,
    description: '',
    furnishing: 'FULL',
    furnishing_description: 'Fully furnished.',
    facing: 'NORTH_EAST',
    asset_highlights: ['Green Project'],
    last_visited_step: {
      listing: {
        type: 'RENT',
        is_payment_done: false,
        is_services_done: false,
        is_listing_created: true,
        is_verification_done: true,
      },
      asset_creation: {
        is_created: true,
        percentage: 0,
        total_step: 4,
        is_details_done: true,
        is_gallery_done: true,
        is_highlights_done: true,
      },
    },
    city_name: 'Chennai',
    state_name: 'Tamil Nadu',
    country_name: 'India',
    floor_type: 18,
    asset_type: {
      id: 1,
      name: 'Residential House',
    },
    amenity_group: {
      id: 615,
      name: 'Green House Amenities',
      amenities: [
        {
          id: 1,
          name: 'Gymnasium',
          category: {
            id: 1,
            name: 'General',
          },
          attachment: {
            id: 1,
            file_name: 'gym.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/2ed2841cb3bd4b34b265a91f6b4620f3.svg',
          },
        },
        {
          id: 2,
          name: 'Swimming Pool',
          category: {
            id: 1,
            name: 'General',
          },
          attachment: {
            id: 2,
            file_name: 'pool.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/e74aeb36de2545e5928c577341fd27e2.svg',
          },
        },
        {
          id: 3,
          name: 'CCTV Security',
          category: {
            id: 1,
            name: 'General',
          },
          attachment: {
            id: 3,
            file_name: 'cctv.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/14bd97bbb2a64153a3f47526c296882d.svg',
          },
        },
        {
          id: 4,
          name: 'Parking',
          category: {
            id: 1,
            name: 'General',
          },
          attachment: {
            id: 4,
            file_name: 'parking.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/3d09ef4079694af4a73da9013abdba02.svg',
          },
        },
        {
          id: 5,
          name: 'Wifi',
          category: {
            id: 1,
            name: 'General',
          },
          attachment: {
            id: 5,
            file_name: 'wifi.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/4282a50d4236472589b5c8186ba2af41.svg',
          },
        },
        {
          id: 10,
          name: 'Cafe',
          category: {
            id: 1,
            name: 'General',
          },
          attachment: {
            id: 10,
            file_name: 'cafe.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/90914cf75259479a89473429ff28cd28.svg',
          },
        },
        {
          id: 12,
          name: 'Grocery Store',
          category: {
            id: 1,
            name: 'General',
          },
          attachment: {
            id: 12,
            file_name: 'grocery_store.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/940182359f214805a526bcad8e04c4e1.svg',
          },
        },
        {
          id: 13,
          name: 'Pets Allowed',
          category: {
            id: 1,
            name: 'General',
          },
          attachment: {
            id: 13,
            file_name: 'pets.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/11b96a9dd5ad42669ecc087ff6ede643.svg',
          },
        },
        {
          id: 15,
          name: 'Spa',
          category: {
            id: 1,
            name: 'General',
          },
          attachment: {
            id: 15,
            file_name: 'spa.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/9e7bf08d08314b2d8aa05a2cb664ea92.svg',
          },
        },
        {
          id: 20,
          name: 'Kids Playground',
          category: {
            id: 2,
            name: 'Sports',
          },
          attachment: {
            id: 20,
            file_name: 'playground.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/d132a065a44b4cf9bda5a3558b15354a.svg',
          },
        },
        {
          id: 21,
          name: 'Tennis',
          category: {
            id: 2,
            name: 'Sports',
          },
          attachment: {
            id: 21,
            file_name: 'tennis.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/0708d5b08e624a62b540250e52b5a90c.svg',
          },
        },
        {
          id: 22,
          name: 'Table Tennis',
          category: {
            id: 2,
            name: 'Sports',
          },
          attachment: {
            id: 22,
            file_name: 'table_tennis.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/627781417dd14558b061255316d42a35.svg',
          },
        },
        {
          id: 23,
          name: 'Basket Ball',
          category: {
            id: 2,
            name: 'Sports',
          },
          attachment: {
            id: 23,
            file_name: 'basket_ball.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/c363134df8194ef1b42d56d0bc76694a.svg',
          },
        },
        {
          id: 25,
          name: 'Badminton',
          category: {
            id: 2,
            name: 'Sports',
          },
          attachment: {
            id: 25,
            file_name: 'badminton.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/9d747edc3f784bf5b88aa1ffe9c3cebe.svg',
          },
        },
        {
          id: 26,
          name: 'Cricket',
          category: {
            id: 2,
            name: 'Sports',
          },
          attachment: {
            id: 26,
            file_name: 'cricket.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/c7b2f1f75c174bdd87511e3c795cbec2.svg',
          },
        },
        {
          id: 28,
          name: 'Green Building',
          category: {
            id: 3,
            name: 'Eco-friendly',
          },
          attachment: {
            id: 28,
            file_name: 'green_building.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/a3c618e6d30e44429e311df5df699cda.svg',
          },
        },
        {
          id: 29,
          name: 'Energy Efficient',
          category: {
            id: 3,
            name: 'Eco-friendly',
          },
          attachment: {
            id: 29,
            file_name: 'energy_efficient.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/33dd578299604f0187dd16f6f5702f88.svg',
          },
        },
        {
          id: 30,
          name: 'Water Efficient',
          category: {
            id: 3,
            name: 'Eco-friendly',
          },
          attachment: {
            id: 30,
            file_name: 'water_efficient.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/6ce9eb3e519e464b84c67d3b50e77a01.svg',
          },
        },
        {
          id: 31,
          name: 'Solar Powered',
          category: {
            id: 3,
            name: 'Eco-friendly',
          },
          attachment: {
            id: 31,
            file_name: 'solar_powered.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/d0d469bf4a6343debe91361c8157322d.svg',
          },
        },
        {
          id: 32,
          name: 'Fire Safety',
          category: {
            id: 3,
            name: 'Eco-friendly',
          },
          attachment: {
            id: 32,
            file_name: 'fire_safety.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/2c5fea31d8fc41c3aaaef3cb33c9a3d2.svg',
          },
        },
        {
          id: 33,
          name: 'Waste Management',
          category: {
            id: 3,
            name: 'Eco-friendly',
          },
          attachment: {
            id: 33,
            file_name: 'waste_management.svg',
            link: 'https://hmzhbdev.s3.ap-south-1.amazonaws.com/9b037d2a049f4ea7b2c2d1c71ba16c6a.svg',
          },
        },
      ],
    },
    spaces: [
      {
        id: 1,
        name: 'Bedroom',
        count: 2,
        field_type: 'COUNTER',
        is_miscellaneous_type: false,
      },
      {
        id: 3,
        name: 'Bathroom',
        count: 2,
        field_type: 'COUNTER',
        is_miscellaneous_type: false,
      },
      {
        id: 4,
        name: 'Balcony',
        count: 2,
        field_type: 'COUNTER',
        is_miscellaneous_type: false,
      },
      {
        id: 7,
        name: 'Kitchen',
        count: 2,
        field_type: 'COUNTER',
        is_miscellaneous_type: false,
      },
      {
        id: 8,
        name: 'Covered Parking',
        count: 2,
        field_type: 'COUNTER',
        is_miscellaneous_type: false,
      },
      {
        id: 9,
        name: 'Open Parking',
        count: 2,
        field_type: 'COUNTER',
        is_miscellaneous_type: false,
      },
      {
        id: 10,
        name: 'Study Room',
        count: 1,
        field_type: 'CHECKBOX',
        is_miscellaneous_type: true,
      },
      {
        id: 11,
        name: 'Loft',
        count: 1,
        field_type: 'CHECKBOX',
        is_miscellaneous_type: true,
      },
      {
        id: 12,
        name: 'Maid Room',
        count: 1,
        field_type: 'CHECKBOX',
        is_miscellaneous_type: true,
      },
      {
        id: 13,
        name: 'Basement',
        count: 1,
        field_type: 'CHECKBOX',
        is_miscellaneous_type: true,
      },
      {
        id: 14,
        name: 'Patio/Terrace',
        count: 1,
        field_type: 'CHECKBOX',
        is_miscellaneous_type: true,
      },
      {
        id: 18,
        name: 'Store Room',
        count: 1,
        field_type: 'CHECKBOX',
        is_miscellaneous_type: true,
      },
      {
        id: 19,
        name: 'Others',
        count: 1,
        description: 'Game Room',
        field_type: 'TEXTBOX',
        is_miscellaneous_type: true,
      },
    ],
    country: {
      id: 1,
      name: 'India',
      iso2_code: 'IN',
      iso3_code: 'IND',
      phone_codes: [
        {
          phone_code: '+91',
          phone_number_min_length: 10,
          phone_number_max_length: 10,
        },
      ],
      currencies: [
        {
          currency_name: 'Indian Rupee',
          currency_code: 'INR',
          currency_symbol: '₹',
        },
      ],
    },
    is_subleased: false,
    is_managed: false,
    digital_id: '761fb7b1-9ecc-4f20-b418-0f04a4ea6591',
    asset_group: {
      id: 1,
      name: 'Residential',
      code: 'RES',
      color_code: '#47C2B1',
    },
    attachments: [
      {
        id: 2472,
        file_name: '569769e0-08d4-401c-be7d-efd661d78574.jpg',
        is_cover_image: true,
        link:
          'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/05f24764-e462-11eb-b146-0242ac110003569769e0-08d4-401c-be7d-efd661d78574.jpg',
        mime_type: 'image/jpeg',
        media_type: 'IMAGE',
        media_attributes: {},
      },
      {
        id: 2473,
        file_name: '7e4274f3-2b30-421f-930a-40039ae4185c.jpg',
        is_cover_image: false,
        link:
          'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/84771c9a-e462-11eb-a31a-0242ac1100037e4274f3-2b30-421f-930a-40039ae4185c.jpg',
        mime_type: 'image/jpeg',
        media_type: 'IMAGE',
        media_attributes: {},
      },
      {
        id: 2474,
        file_name: 'download.jpeg',
        is_cover_image: false,
        link:
          'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/848c42dc-e462-11eb-a31a-0242ac110003download.jpeg',
        mime_type: 'image/jpeg',
        media_type: 'IMAGE',
        media_attributes: {},
      },
      {
        id: 2475,
        file_name: '31962868-f491-4a07-8d00-e1f5b5f0cf4c.jpg',
        is_cover_image: false,
        link:
          'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/84aca8d8-e462-11eb-a31a-0242ac11000331962868-f491-4a07-8d00-e1f5b5f0cf4c.jpg',
        mime_type: 'image/jpeg',
        media_type: 'IMAGE',
        media_attributes: {},
      },
      {
        id: 2476,
        file_name: '465f69c5-6ea0-4a84-9526-a8c9a37b12ee.jpg',
        is_cover_image: false,
        link:
          'https://hmzhbdev.s3.ap-south-1.amazonaws.com/asset_images/84d82af8-e462-11eb-a31a-0242ac110003465f69c5-6ea0-4a84-9526-a8c9a37b12ee.jpg',
        mime_type: 'image/jpeg',
        media_type: 'IMAGE',
        media_attributes: {},
      },
    ],
    highlights: [
      {
        name: 'Power Backup',
        covered: true,
      },
      {
        name: 'Gated Society',
        covered: true,
      },
      {
        name: 'Corner Property',
        covered: true,
      },
    ],
    features: [
      {
        name: 'Furnishing',
        locale_key: 'furnishing',
        value: 'Full',
      },
      {
        name: 'Building Age',
        locale_key: 'building_age',
        value: '15 Years',
      },
      {
        name: 'Facing',
        locale_key: 'facing',
        value: 'North_East',
      },
      {
        name: 'Floor No.',
        locale_key: 'floor_no',
        value: '1/2',
      },
      {
        name: 'Building Type',
        locale_key: 'building_type',
        value: 'Residential House',
      },
      {
        name: 'Parking',
        locale_key: 'parking',
        value: 'N/A',
      },
    ],
    is_verification_document_uploaded: true,
  },
  lease_transaction: { id: 123 },
  start_date: '2021-07-22T19:37:43Z',
};
