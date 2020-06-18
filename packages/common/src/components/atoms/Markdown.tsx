import React from 'react';
// @ts-ignore
import Markdown from 'react-native-simple-markdown';

interface IProps {
  children: React.ReactElement | React.ReactNode;
}

const RNMarkdown = (props: IProps): React.ReactElement => {
  const { children } = props;
  return <Markdown>{children}</Markdown>;
};

export { RNMarkdown };
