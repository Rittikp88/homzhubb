import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import '@homzhub/web/src/components/molecules/Drawer/BurgerMenu.scss';

interface IProps {
  open: boolean;
  children: JSX.Element;
}

interface IState {
  menuOpen: boolean;
}

export default class SideBar extends React.PureComponent<IProps, IState> {
  public state = {
    menuOpen: false,
  };

  public componentWillUnmount(): void {
    window.removeEventListener('scroll', this.noScroll);
  }

  public render(): React.ReactElement {
    const { children } = this.props;
    return (
      <Menu
        pageWrapId="page-wrap"
        outerContainerId="outer-container"
        onStateChange={this.handleStateChange}
        width={280}
        right
      >
        {children}
      </Menu>
    );
  }

  private noScroll = (): void => {
    window.scrollTo(0, 0);
  };

  private handleStateChange = (): void => {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
    if (menuOpen) {
      window.addEventListener('scroll', this.noScroll);
    } else window.removeEventListener('scroll', this.noScroll);
  };
}
