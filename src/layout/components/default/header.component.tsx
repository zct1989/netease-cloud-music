import React, { Component } from "react";
import { Icon, Input } from "antd";
import styled from "styled-components";
import { Consumer } from "reto";
import { RouterStore } from "../../../store/router.store";
import menuList from "../../../assets/json/menu.json";

const components = {
  Wrapper: styled.section`
    -webkit-app-region: drag;
  `,
  HistoryWrap: styled.div`
    flex-basis: 200px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    & > i {
      padding: 10px;
      cursor: pointer;
    }
  `,
  MenuWrap: styled.div`
    flex: 1;
    display: flex;
    flex-wrap: nowrap;
  `,
  ToolBarWrap: styled.div`
    flex-basis: 150px;
    display: flex;
    justify-content: flex-end;
    padding: 0 10px;
    & > i {
      padding: 0 8px;
    }
  `,
  HeaderMenuItem: styled.div`
    padding: 0 15px;
    color: #7f7f7f;
    cursor: pointer;
    &:hover {
      color: #000000;
    }
    &.actived {
      color: #000000;
      font-weight: bold;
    }
  `,
  SearchWrap: styled.div`
    flex-basis: 150px;
    input {
      border-radius: 20px;
      height: 27px;
      background: #f1f1f1;
    }
    .ant-input-group-addon {
      border-radius: 20px;
    }
  `
};

interface HeaderState {
  currentMenu: any;
}

export default class Header extends Component<{}, HeaderState> {
  constructor(props) {
    super(props);
    this.state = { currentMenu: null };
  }

  public render() {
    return (
      <components.Wrapper className="full-absolute flex-row align-items-center">
        {this.getHistoryContainer()}
        {this.getMenuContainer()}
        {this.getSearchContainer()}
        {this.getToolbarContainer()}
      </components.Wrapper>
    );
  }

  public getHistoryContainer() {
    return (
      <components.HistoryWrap className="full-height">
        <Icon type="left" />
        <Icon type="right" />
      </components.HistoryWrap>
    );
  }

  public getMenuContainer() {
    return (
      <components.MenuWrap>
        <Consumer of={RouterStore}>
          {routerStore =>
            this.getMenuChildren(routerStore.location).map(item => (
              <components.HeaderMenuItem
                key={item.title}
                className={
                  this.state.currentMenu &&
                  this.state.currentMenu.title === item.title
                    ? "actived"
                    : ""
                }
                onClick={() => this.onSelectMenuItem(item, routerStore)}
              >
                {item.title}
              </components.HeaderMenuItem>
            ))
          }
        </Consumer>
      </components.MenuWrap>
    );
  }

  public getSearchContainer() {
    return (
      <components.SearchWrap>
        <Input
          placeholder="搜索"
          prefix={<Icon type="search" />}
          allowClear
        ></Input>
      </components.SearchWrap>
    );
  }

  public getToolbarContainer() {
    return (
      <components.ToolBarWrap>
        <Icon type="setting" />
        <Icon type="mail" />
        <Icon type="skin" />
      </components.ToolBarWrap>
    );
  }

  public getMenuChildren(location) {
    const target = menuList.find(x => x.path === location.pathname);

    if (!target) return [];

    if (target.level === 1) {
      return menuList.filter(x => x.parent === target.id);
    }

    if (target.level === 2) {
      return menuList.filter(x => x.parent === target.parent);
    }

    return [];
  }

  /**
   * 设置默认菜单项
   * @param menu
   */
  private setDefaultMenuItem(menu) {
    let [defaultItem] = menu.children;
    if (
      !this.state.currentMenu ||
      !menu.children.includes(this.state.currentMenu)
    ) {
      setTimeout(() => {
        this.onSelectMenuItem(defaultItem, {});
      });
    }
  }

  /**
   * 选择菜单项目
   * @param item
   */
  public onSelectMenuItem(item, store) {
    this.setState({ currentMenu: item });
    if (!item.path) return;
    store.history.push(item.path);
  }
}