export interface IPropertyState {
  currentPropertyId: number;
  termId: number;
  propertyDetails: {
    propertyGroup: null;
  };
  error: {
    property: string;
  };
  loaders: {
    property: boolean;
  };
}
