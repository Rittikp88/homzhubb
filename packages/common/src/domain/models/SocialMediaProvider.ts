export interface ISocialMediaProvider {
  provider: string;
  description: string;
  clientID: string;
}

// @JsonObject('SocialMediaProvider')
// export class SocialMediaProvider {
//   @JsonProperty('provider', String)
//   private _provider = '';
//
//   @JsonProperty('description', String)
//   private _description = '';
//
//   @JsonProperty('clientID', String)
//   private _clientID = '';
//
//   get provider(): string {
//     return this._provider;
//   }
//
//   get description(): string {
//     return this._description;
//   }
//
//   get clientID(): string {
//     return this._clientID;
//   }
// }
