export interface IPropertyState {
  propertyDetails: {
    propertyGroup: any;
    propertyGroupSpaceAvailable: any;
  };
  error: {
    property: string;
  };
  loaders: {
    property: boolean;
  };
}
