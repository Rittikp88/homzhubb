import React from 'react';
import { slide as Menu, State } from 'react-burger-menu';
import '@homzhub/web/src/components/molecules/Drawer/BurgerMenu.scss';

interface IProps {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
}
export default class SideBar extends React.PureComponent<IProps> {
  public render(): React.ReactElement {
    const { children, open } = this.props;
    return (
      <Menu
        pageWrapId="page-wrap"
        outerContainerId="outer-container"
        customBurgerIcon={false}
        onStateChange={this.handleStateChange}
        width={280}
        isOpen={open}
        right
      >
        {children}
      </Menu>
    );
  }

  private handleStateChange = (state: State): void => {
    const { onClose } = this.props;
    if (!state.isOpen) {
      onClose();
    }
    if (state.isOpen) {
      document.body.classList.add('stop-scrolling');
    } else document.body.classList.remove('stop-scrolling');
  };
}
