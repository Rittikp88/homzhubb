/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IOwnerState {
  data: any;
  error: {
    owner: string | null;
  };
  loaders: {
    owner: boolean;
  };
}
