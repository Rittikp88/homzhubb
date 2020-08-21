import { JsonObject, JsonProperty } from '@homzhub/common/src/utils/ObjectMapper';
import { TypeOfSale } from '@homzhub/common/src/domain/models/Property';

export enum ServiceStepTypes {
  LEASE_DETAILS = 'LEASE_DETAILS',
  PROPERTY_IMAGES = 'PROPERTY_IMAGES',
  PROPERTY_VERIFICATIONS = 'PROPERTY_VERIFICATIONS',
  PAYMENT_TOKEN_AMOUNT = 'PAYMENT_TOKEN_AMOUNT',
}

export interface IServiceCategory {
  id: number;
  typeOfSale: TypeOfSale;
}

export interface IServiceDetail {
  id: number;
  name: string;
  title: string;
  label: boolean;
  description: string;
  number: number;
  info: string;
  service_cost: string;
  service_bundle_items: IServiceItems[];
}

export interface IServiceItems {
  id: number;
  name: string;
  title: string;
  category: string;
  description: string;
  position: number;
  item_label: string;
}

export interface IServiceListSteps {
  id: number;
  name: ServiceStepTypes;
  title: string;
  label: string;
}

export interface IServiceListStepsDetail {
  steps: IServiceListSteps[];
  PROPERTY_VERIFICATIONS: boolean;
  PAYMENT_TOKEN_AMOUNT: boolean;
}

export interface IServiceListStepsPayload {
  serviceCategoryId: number;
  serviceId: number;
}

export interface IVerificationTypes {
  id: number;
  name: string;
  title: string;
  category: string;
  description: string;
  label: string;
  help_text: string;
  icon: string;
}

export interface IDocument {
  id: number;
  name: string;
  attachment_type: string;
  mime_type: string;
  link: string;
}

export interface IVerificationDocumentList {
  id: number | null;
  verification_document_type: IVerificationTypes;
  document: IDocument;
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

@JsonObject('ServiceBundleItems')
export class ServiceBundleItems {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('title', String)
  private _title = '';

  @JsonProperty('category', String)
  private _category = '';

  @JsonProperty('description', String)
  private _description = '';

  @JsonProperty('position', Number)
  private _position = 0;

  @JsonProperty('item_label', String)
  private _itemLabel = '';

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get title(): string {
    return this._title;
  }

  get category(): string {
    return this._category;
  }

  get description(): string {
    return this._description;
  }

  get position(): number {
    return this._position;
  }

  get itemLabel(): string {
    return this._itemLabel;
  }
}
