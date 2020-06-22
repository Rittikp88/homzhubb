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
  verification_document_type_id: number;
  document_id: number;
  document_link: string;
  name?: string;
  type?: string;
  id?: number | null;
  is_local_document?: boolean;
}

export enum VerificationDocumentTypes {
  ID_PROOF = 'ID_PROOF',
  SELFIE_ID_PROOF = 'SELFIE_ID_PROOF',
  OWNERSHIP_VERIFICATION_DOCUMENT = 'OWNERSHIP_VERIFICATION_DOCUMENT',
}

export interface IPropertySelectedImages {
  id: number | null;
  description: string;
  is_cover_image: boolean;
  asset: number;
  attachment: number;
  link: string | null;
  isLocalImage?: boolean;
}

export interface IPropertyImagesPostPayload {
  attachment: number;
  is_cover_image: boolean;
}

export interface IMarkCoverImageAttachment {
  cover_updated: boolean;
}

export interface IPostVerificationDocuments {
  verification_document_type_id: number;
  document_id: number;
}
