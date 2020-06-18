export interface IServiceDetail {
  id: number;
  name: string;
  title: string;
  description: string;
  service_cost: string;
  service_info: string;
  label: string;
  service_items: IServiceItems[];
}

export interface IServiceItems {
  id: number;
  name: string;
  description: string;
  label: string;
  is_covered: boolean;
}

export interface IServiceListStepsDetail {
  id: number;
  name: string;
  title: string;
}

export interface IVerificationTypes {
  id: number;
  name: string;
  title: string;
  description: string;
  label: string;
  help_text: string;
  icon: string;
}

export interface IVerificationDocumentList {
  document_type_id: number;
  document_id: number;
  document_url: string;
  name?: string;
  type?: string;
}

export enum VerificationDocumentTypes {
  ID_PROOF = 'ID_PROOF',
  SELFIE_ID_PROOF = 'SELFIE_ID_PROOF',
}
