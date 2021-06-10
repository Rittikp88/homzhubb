import { IMenu } from '@homzhub/mobile/src/components/molecules/Menu';

// enums related to Documents
export enum DocumentOperations {
  RENAME = 'RENAME',
  SHARE = 'SHARE',
  DOWNLOAD = 'DOWNLOAD',
  DELETE = 'DELETE',
}

export const DocumentOptions: IMenu[] = [
  {
    label: 'common:rename',
    value: DocumentOperations.RENAME,
  },
  {
    label: 'common:share',
    value: DocumentOperations.SHARE,
  },
  {
    label: 'common:download',
    value: DocumentOperations.DOWNLOAD,
  },
  {
    label: 'common:delete',
    value: DocumentOperations.DELETE,
    isExtraData: true,
  },
];
