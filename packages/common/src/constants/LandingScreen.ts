export interface IFeatureDataProps {
  title: string;
  description: string;
  image: string;
}

export const TestimonialData = [
  {
    name: 'Milind',
    designation: 'Kuwait',
    review: 'Excellent Application',
    description:
      'I very much appreciate the excellent real estate services offered by Homzhub. You have talented professionals in your team. We are happy that in Nagpur we have a professionally managed company which takes care of all the activities related to property matters and manages everything under one roof.',
    image: require('@homzhub/web/src/screens/landing/components/Testimonials/images/Milind.jpg'),
  },
  {
    name: 'Mandar',
    designation: 'Mumbai',
    review: 'Excellent Application',
    description:
      'I am extremely happy and satisfied with the quality of service and professional conduct along with Personal Touch shown by the Homzhub representatives and Team. The fact that they take complete responsibility for all and any issue that arises in the property, makes my task of trusting them easier.',
    image: require('@homzhub/web/src/screens/landing/components/Testimonials/images/Mandar.jpg'),
  },
  {
    name: 'Nirav',
    designation: 'Nagpur',
    review: 'Excellent Application',
    description:
      'Anyone who has searched for a house for rent knows how nerve-racking the process can be. It really helps to have a professional team to assist you in this. I highly recommend Homzhub.',
    image: require('@homzhub/web/src/screens/landing/components/Testimonials/images/Nirav.jpeg'),
  },
  {
    name: 'Gunjan',
    designation: 'Patna',
    review: 'Excellent Application',
    description:
      'I had a great experience with Homzhub. What I really liked about them is the promptness with which they solved the maintenance issues with the property',
    image: require('@homzhub/web/src/screens/landing/components/Testimonials/images/Smita.jpg'),
  },
  {
    name: 'Rajat',
    designation: 'Gondia',
    review: 'Excellent Application',
    description:
      'I moved to Nagpur recently and I was searching for a property to rent asap. I did not expect to find something to my liking on such short notice. However, Homzhub put in a lot of effort to help me find a home for myself. 10/10 service by the team!',
    image: require('@homzhub/web/src/screens/landing/components/Testimonials/images/Jayantm.jpeg'),
  },
];

export const HeroSectionData: IFeatureDataProps[] = [
  {
    title: 'Be in total control!',
    description: 'Arrange site visits, negotiations and tenant verifications with ease',
    image: require('@homzhub/common/src/assets/images/landingBackground1.jpg'),
  },
  {
    title: 'Your House. Your Rules!',
    description: 'Get the desired rent and tenant on our app',
    image: require('@homzhub/common/src/assets/images/landingBackground2.jpg'),
  },
  {
    title: 'Prime Locations for you Primary Needs',
    description: 'Rent directly from Owners at the best locations',
    image: require('@homzhub/common/src/assets/images/landingBackground3.jpg'),
  },
];

export const OwnerFeatureData: IFeatureDataProps[] = [
  {
    title: 'Your property is in your hands',
    description: 'Manage your properties remotely from anywhere, anytime',
    image: 'Picture1',
  },
  {
    title: 'It’s all here',
    description: 'Arrange site visits, tenant verification and legal formalities',
    image: 'Picture2',
  },
  {
    title: 'With You All the Way',
    description: 'From on-boarding your tenant to helping you re-rent your property',
    image: 'Picture3',
  },
  {
    title: 'Get Started for Free',
    description: 'Get ready to rent or sell in a few clicks. Signup and get started',
    image: 'Picture4',
  },
];

export const TenantFeatureData: IFeatureDataProps[] = [
  {
    title: 'Your Key to Your home',
    description: 'Locate, rent and manage your home and everything that comes with it',
    image: 'Tenant Picture1',
  },
  {
    title: 'Stay in Control',
    description: 'Save rent receipts, raise concerns and track your rental journey in one app',
    image: 'Tenant Picture2',
  },
  {
    title: 'Finely Curated Listings for You',
    description: 'Rent verified properties directly from owners',
    image: 'Tenant Picture3',
  },
  {
    title: 'Create History',
    description: 'Back up your rental journey - from your old property to new',
    image: 'Tenant Picture4',
  },
];
