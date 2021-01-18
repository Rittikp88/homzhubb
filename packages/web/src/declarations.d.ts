declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}

declare interface IScriptProps {
  attributes?: object;
  onCreate?: () => void;
  onError?: () => void;
  onLoad: () => void;
  url: string;
}
declare class Script {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility,react/static-property-placement
  props: IScriptProps;
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility,react/static-property-placement
  context: any;
  public state: any;
  public refs: any;
  public forceUpdate(callback: any): void;
  public render(): any;
  public setState(partialState: any, callback: any): void;
}

declare module 'react-load-script' {
  export = Script;
}
