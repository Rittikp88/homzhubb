import React from 'react';
import { SvgProps } from 'react-native-svg';

// SVG imports START
import India from '@homzhub/common/src/assets/flags/india-flag.svg';
import US from '@homzhub/common/src/assets/flags/united-states-of-america-flag.svg';
import Aus from '@homzhub/common/src/assets/flags/australia-flag.svg';
import Singapore from '@homzhub/common/src/assets/flags/singapore-flag.svg';
import UAE from '@homzhub/common/src/assets/flags/united-arab-emirates-flag.svg';
import SriLanka from '@homzhub/common/src/assets/flags/srilanka-flag.svg';
import Maldives from '@homzhub/common/src/assets/flags/maldives-flag.svg';
import Phillippines from '@homzhub/common/src/assets/flags/philippines-flag.svg';
import Malaysia from '@homzhub/common/src/assets/flags/malaysia-flag.svg';
import NorthKorea from '@homzhub/common/src/assets/flags/north-korea-flag.svg';
import SouthKorea from '@homzhub/common/src/assets/flags/south-korea-flag.svg';
import Japan from '@homzhub/common/src/assets/flags/japan-flag.svg';
import China from '@homzhub/common/src/assets/flags/china-flag.svg';
import Iran from '@homzhub/common/src/assets/flags/iran-flag.svg';
import Russia from '@homzhub/common/src/assets/flags/russia-flag.svg';
import Brazil from '@homzhub/common/src/assets/flags/brazil-flag.svg';
import Bangladesh from '@homzhub/common/src/assets/flags/bangladesh-flag.svg';
import Swiss from '@homzhub/common/src/assets/flags/switzerland-flag.svg';
// SVG Imports END

const FlagHOC = (Flag: React.FC<SvgProps>): React.ReactElement => <Flag width={24} height={24} />;

export const flags = {
  IN: FlagHOC(India),
  US: FlagHOC(US),
  AU: FlagHOC(Aus),
  SG: FlagHOC(Singapore),
  AE: FlagHOC(UAE),
  LK: FlagHOC(SriLanka),
  MV: FlagHOC(Maldives),
  PH: FlagHOC(Phillippines),
  MY: FlagHOC(Malaysia),
  KP: FlagHOC(NorthKorea),
  KR: FlagHOC(SouthKorea),
  JP: FlagHOC(Japan),
  CN: FlagHOC(China),
  IR: FlagHOC(Iran),
  RU: FlagHOC(Russia),
  BR: FlagHOC(Brazil),
  BD: FlagHOC(Bangladesh),
  CH: FlagHOC(Swiss),
};
