import { JsonObject, JsonProperty, ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Amenity, AmenityGroup, IAmenity } from '@homzhub/common/src/domain/models/Amenity';
import { Attachment, IAttachment } from '@homzhub/common/src/domain/models/Attachment';
import { AssetFeature, IAssetFeature } from '@homzhub/common/src/domain/models/AssetFeature';
import { AssetHighlight, IAssetHighlight } from '@homzhub/common/src/domain/models/AssetHighlight';
import { AssetListingVisits } from '@homzhub/common/src/domain/models/AssetListingVisits';
import { AssetStatusInfo } from '@homzhub/common/src/domain/models/AssetStatusInfo';
import { CarpetArea } from '@homzhub/common/src/domain/models/CarpetArea';
import { Country, ICountry } from '@homzhub/common/src/domain/models/Country';
import { ILastVisitedStep, LastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import { LeaseTerm } from '@homzhub/common/src/domain/models/LeaseTerm';
import { SaleTerm } from '@homzhub/common/src/domain/models/SaleTerm';
import { IUser, User } from '@homzhub/common/src/domain/models/User';
import { IVerifications, Verification } from '@homzhub/common/src/domain/models/Verification';
import { FurnishingTypes } from '@homzhub/common/src/constants/Terms';
import { AssetGroupTypes } from '@homzhub/common/src/constants/AssetGroup';
import { Coordinate } from '@homzhub/common/src/services/GooglePlaces/interfaces';

// ENUM START

export enum DataType {
  TENANCIES = 'TENANCIES',
  PROPERTIES = 'PROPERTIES',
}

export enum LeaseTypes {
  Entire = 'entire',
  Shared = 'shared',
}

export enum PropertyStatus {
  PENDING = 'PENDING',
}

// ENUM END

export interface ICarpetAreaUnit {
  id: number;
  label: string;
  name: string;
  title: string;
}

export interface IAssetSpaces {
  id: number;
  name: string;
  count: number;
  description?: string;
}

export interface IAsset {
  id: number;
  project_name: string;
  is_subleased: boolean;
  is_managed: boolean;
  unit_number: string;
  posted_on: string;
  description: string;
  block_number: string;
  postal_code: string;
  city_name: string;
  state_name: string;
  country_name: string;
  latitude: string;
  longitude: string;
  carpet_area: number;
  carpet_area_unit: ICarpetAreaUnit;
  floor_number: number;
  total_floors: number;
  asset_type: IData;
  asset_group: IData;
  spaces: IAssetSpaces[];
  amenities: IAmenity[];
  attachments: IAttachment[];
  highlights: IAssetHighlight[];
  features: IAssetFeature[];
  contacts?: IUser;
  verifications: IVerifications;
  country: ICountry;
  furnishing_description: string;
  construction_year: string;
  facing: string;
  floor_type: string;
  last_visited_step: ILastVisitedStep;
}

export interface IData {
  id: number;
  name: string;
  count?: number;
}

@JsonObject('Data')
export class Data {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('name', String)
  private _name = '';

  @JsonProperty('code', String, true)
  private _code = '';

  @JsonProperty('count', Number, true)
  private _count = 0;

  @JsonProperty('description', String, true)
  private _description = '';

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get code(): AssetGroupTypes {
    return this._code as AssetGroupTypes;
  }

  get count(): number {
    return this._count;
  }

  get description(): string {
    return this._description;
  }
}

@JsonObject('Count')
export class Count {
  @JsonProperty('count', Number)
  private _count = 0;

  get count(): number {
    return this._count;
  }
}

@JsonObject('AppPermission')
export class AppPermission {
  @JsonProperty('add_listingvisit', Boolean, true)
  private _addListingVisit = false;

  get addListingVisit(): boolean {
    return this._addListingVisit;
  }
}

@JsonObject('Wishlisted')
export class Wishlisted {
  @JsonProperty('lead_id', Number)
  private _leadId = 0;

  @JsonProperty('lead_type', String)
  private _leadType = '';

  @JsonProperty('status', Boolean)
  private _status = false;

  get leadId(): number {
    return this._leadId;
  }

  get leadType(): string {
    return this._leadType;
  }

  get status(): boolean {
    return this._status;
  }
}

@JsonObject('Asset')
export class Asset {
  @JsonProperty('id', Number)
  private _id = 0;

  @JsonProperty('project_name', String)
  private _projectName = '';

  @JsonProperty('unit_number', String)
  private _unitNumber = '';

  @JsonProperty('block_number', String)
  private _blockNumber = '';

  @JsonProperty('is_subleased', Boolean, true)
  private _isSubleased = false;

  @JsonProperty('is_managed', Boolean)
  private _isManaged = false;

  @JsonProperty('latitude', Number)
  private _latitude = 0;

  @JsonProperty('longitude', Number)
  private _longitude = 0;

  @JsonProperty('carpet_area_unit', CarpetArea, true)
  private _carpetAreaUnit: CarpetArea | null = null;

  @JsonProperty('carpet_area', Number, true)
  private _carpetArea: number | null = null;

  @JsonProperty('posted_on', String, true)
  private _postedOn = '';

  @JsonProperty('description', String, true)
  private _description = '';

  @JsonProperty('floor_number', Number)
  private _floorNumber = 0;

  @JsonProperty('total_floors', Number)
  private _totalFloors = 0;

  @JsonProperty('construction_year', Number, true)
  private _construction_Year = 0;

  @JsonProperty('floor_type', Number, true)
  private _floorType = 0;

  @JsonProperty('attachments', [Attachment], true)
  private _attachments: Attachment[] = [];

  @JsonProperty('highlights', [AssetHighlight], true)
  private _highlights: AssetHighlight[] = [];

  @JsonProperty('features', [AssetFeature], true)
  private _features: AssetFeature[] = [];

  @JsonProperty('spaces', [Data], true)
  private _spaces: Data[] = [];

  @JsonProperty('amenities', [Amenity], true)
  private _amenities: Amenity[] = [];

  @JsonProperty('asset_type', Data, true)
  private _assetType: Data = new Data();

  @JsonProperty('asset_group', Data, true)
  private _assetGroup: Data = new Data();

  @JsonProperty('lease_listing', LeaseTerm, true)
  private _leaseTerm: LeaseTerm | null = null;

  @JsonProperty('sale_listing', SaleTerm, true)
  private _saleTerm: SaleTerm | null = null;

  @JsonProperty('contacts', User, true)
  private _contacts: User = new User();

  @JsonProperty('verifications', Verification, true)
  private _verifications: Verification = new Verification();

  @JsonProperty('is_favorite', Boolean, true)
  private _isFavorite = false;

  @JsonProperty('maintenance_payment_schedule', String, true)
  private _maintenancePaymentSchedule = '';

  @JsonProperty('furnishing', String, true)
  private _furnishing = '';

  @JsonProperty('furnishing_description', String, true)
  private _furnishingDescription = '';

  @JsonProperty('facing', String, true)
  private _facing = '';

  @JsonProperty('notifications', Count, true)
  private _notifications: Count = new Count();

  @JsonProperty('service_tickets', Count, true)
  private _serviceTickets: Count = new Count();

  @JsonProperty('asset_status_info', AssetStatusInfo, true)
  private _assetStatusInfo: AssetStatusInfo | null = null;

  @JsonProperty('visit_date', String, true)
  private _visitDate = '';

  @JsonProperty('is_wishlisted', Wishlisted, true)
  private _isWishlisted: Wishlisted | null = null;

  @JsonProperty('address', String, true)
  private _address = '';

  @JsonProperty('last_visited_step', LastVisitedStep, true)
  private _lastVisitedStep = new LastVisitedStep();

  @JsonProperty('is_gated', Boolean, true)
  private _isGated = false;

  @JsonProperty('is_verification_document_uploaded', Boolean, true)
  private _isVerificationDocumentUploaded = false;

  @JsonProperty('power_backup', Boolean, true)
  private _powerBackup = false;

  @JsonProperty('corner_property', Boolean, true)
  private _cornerProperty = false;

  @JsonProperty('all_day_access', Boolean, true)
  private _allDayAccess = false;

  @JsonProperty('asset_highlights', [String], true)
  private _assetHighlights = [];

  @JsonProperty('amenity_group', AmenityGroup, true)
  private _amenityGroup: AmenityGroup | null = null;

  @JsonProperty('country', Country, true)
  private _country = new Country();

  @JsonProperty('postal_code', String)
  private _pinCode = '';

  @JsonProperty('state_name', String)
  private _state = '';

  @JsonProperty('city_name', String)
  private _city = '';

  @JsonProperty('country_name', String)
  private _countryName = '';

  @JsonProperty('sale_listing_ids', [Number], true)
  private _saleListingIds = [];

  @JsonProperty('lease_listing_ids', [Number], true)
  private _leaseListingIds = [];

  @JsonProperty('sale_listing_id', Number, true)
  private _saleListingId: number | null = null;

  @JsonProperty('lease_listing_id', Number, true)
  private _leaseListingId: number | null = null;

  @JsonProperty('app_permissions', AppPermission, true)
  private _appPermissions = null;

  @JsonProperty('lease_unit_id', Number, true)
  private _leaseUnitId: number | null = null;

  @JsonProperty('sale_unit_id', Number, true)
  private _saleUnitId: number | null = null;

  @JsonProperty('listing_visits', AssetListingVisits, true)
  private _listingVisits = new AssetListingVisits();

  get projectName(): string {
    return this._projectName;
  }

  get unitNumber(): string {
    return this._unitNumber;
  }

  get blockNumber(): string {
    return this._blockNumber;
  }

  get latitude(): number {
    return this._latitude;
  }

  get longitude(): number {
    return this._longitude;
  }

  get carpetAreaUnit(): CarpetArea | null {
    return this._carpetAreaUnit;
  }

  get carpetArea(): number | null {
    return this._carpetArea;
  }

  get floorNumber(): number {
    return this._floorNumber;
  }

  get totalFloors(): number {
    return this._totalFloors;
  }

  get id(): number {
    return this._id;
  }

  get attachments(): Attachment[] {
    return this._attachments;
  }

  get postedOn(): string {
    return this._postedOn;
  }

  get description(): string {
    return this._description;
  }

  get highlights(): AssetHighlight[] {
    const highlight = ObjectMapper.deserializeArray(AssetHighlight, this._highlights);
    if (this.assetHighlights.length > 0) {
      this.assetHighlights.forEach((item) => {
        highlight.push(ObjectMapper.deserialize(AssetHighlight, { covered: true, name: item }));
      });
    }

    return highlight;
  }

  get features(): AssetFeature[] {
    return this._features;
  }

  get spaces(): Data[] {
    return this._spaces;
  }

  get amenities(): Amenity[] {
    return this._amenities;
  }

  get assetType(): Data {
    return this._assetType;
  }

  get assetGroupTypeId(): number {
    return this._assetType.id;
  }

  get assetGroup(): Data {
    return this._assetGroup;
  }

  get assetGroupId(): number {
    return this.assetGroup.id;
  }

  get assetGroupCode(): AssetGroupTypes {
    return this.assetGroup.code;
  }

  get leaseTerm(): LeaseTerm | null {
    return this._leaseTerm;
  }

  get saleTerm(): SaleTerm | null {
    return this._saleTerm;
  }

  get contacts(): User {
    return this._contacts;
  }

  get verifications(): Verification {
    return this._verifications;
  }

  get isFavorite(): boolean {
    return this._isFavorite;
  }

  get assetLocation(): Coordinate {
    return {
      longitude: this.longitude,
      latitude: this.latitude,
    };
  }

  get maintenancePaymentSchedule(): string {
    return this._maintenancePaymentSchedule;
  }

  get furnishing(): FurnishingTypes {
    return this._furnishing as FurnishingTypes;
  }

  get notifications(): Count {
    return this._notifications;
  }

  get serviceTickets(): Count {
    return this._serviceTickets;
  }

  get assetStatusInfo(): AssetStatusInfo | null {
    return this._assetStatusInfo;
  }

  get visitDate(): string {
    return this._visitDate;
  }

  get isWishlisted(): Wishlisted | null {
    return this._isWishlisted;
  }

  get address(): string {
    return this._address;
  }

  get lastVisitedStep(): LastVisitedStep {
    return this._lastVisitedStep;
  }

  get lastVisitedStepSerialized(): ILastVisitedStep {
    return ObjectMapper.serialize(this._lastVisitedStep);
  }

  get isGated(): boolean {
    return this._isGated;
  }

  get powerBackup(): boolean {
    return this._powerBackup;
  }

  get cornerProperty(): boolean {
    return this._cornerProperty;
  }

  get allDayAccess(): boolean {
    return this._allDayAccess;
  }

  get assetHighlights(): string[] {
    return this._assetHighlights;
  }

  get amenityGroup(): AmenityGroup | null {
    return this._amenityGroup;
  }

  get country(): Country {
    return this._country;
  }

  get construction_Year(): number {
    return this._construction_Year;
  }

  get floorType(): number {
    return this._floorType;
  }

  get furnishingDescription(): string {
    return this._furnishingDescription;
  }

  get facing(): string {
    return this._facing;
  }

  get pinCode(): string {
    return this._pinCode;
  }

  get state(): string {
    return this._state;
  }

  get city(): string {
    return this._city;
  }

  get countryName(): string {
    return this._countryName;
  }

  get isSubleased(): boolean {
    return this._isSubleased;
  }

  get assetLeaseType(): LeaseTypes {
    return this.isSubleased ? LeaseTypes.Shared : LeaseTypes.Entire;
  }

  get countryIsoCode(): string {
    const { iso2Code } = this.country;
    return iso2Code;
  }

  get appPermissions(): AppPermission | null {
    return this._appPermissions;
  }

  get saleListingIds(): number[] {
    return this._saleListingIds;
  }

  get leaseListingIds(): number[] {
    return this._leaseListingIds;
  }

  get saleListingId(): number | null {
    return this._saleListingId;
  }

  get leaseListingId(): number | null {
    return this._leaseListingId;
  }

  get leaseUnitId(): number | null {
    return this._leaseUnitId;
  }

  get saleUnitId(): number | null {
    return this._saleUnitId;
  }

  get listingVisits(): AssetListingVisits {
    return this._listingVisits;
  }

  get listingInfo(): AssetStatusInfo {
    return new AssetStatusInfo(this.leaseListingId, this.saleListingId, this.leaseUnitId, this.saleUnitId);
  }

  get isManaged(): boolean {
    return this._isManaged;
  }

  get isVerificationDocumentUploaded(): boolean {
    return this._isVerificationDocumentUploaded;
  }
}
