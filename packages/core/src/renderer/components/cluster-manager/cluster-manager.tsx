/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./cluster-manager.scss";

import React from "react";
import { Redirect } from "react-router";
import { disposeOnUnmount, observer } from "mobx-react";
import { StatusBar } from "../status-bar/status-bar";
import { HotbarMenu } from "../hotbar/hotbar-menu";
import { DeleteClusterDialog } from "../delete-cluster-dialog";
import { withInjectables } from "@ogre-tools/injectable-react";
import { TopBar } from "../layout/top-bar/top-bar";
import catalogPreviousActiveTabStorageInjectable from "../+catalog/catalog-previous-active-tab-storage/catalog-previous-active-tab-storage.injectable";
import type { IComputedValue } from "mobx";
import currentRouteComponentInjectable from "../../routes/current-route-component.injectable";
import welcomeRouteInjectable from "../../../common/front-end-routing/routes/welcome/welcome-route.injectable";
import { buildURL } from "../../../common/utils/buildUrl";
import type { StorageLayer } from "../../utils";
import type { WatchForGeneralEntityNavigation } from "../../api/helpers/watch-for-general-entity-navigation.injectable";
import watchForGeneralEntityNavigationInjectable from "../../api/helpers/watch-for-general-entity-navigation.injectable";
import currentPathInjectable from "../../routes/current-path.injectable";
import type { UserStore } from "../../../common/user-store";
import userStoreInjectable from "../../../common/user-store/user-store.injectable";

interface Dependencies {
  catalogPreviousActiveTabStorage: StorageLayer<string | null>;
  currentRouteComponent: IComputedValue<React.ElementType | undefined>;
  welcomeUrl: string;
  watchForGeneralEntityNavigation: WatchForGeneralEntityNavigation;
  currentPath: IComputedValue<string>;
  userStore: UserStore;
}

@observer
class NonInjectedClusterManager extends React.Component<Dependencies> {
  componentDidMount() {
    disposeOnUnmount(this, [
      this.props.watchForGeneralEntityNavigation(),
    ]);
  }

  renderMainComponent() {
    const Component = this.props.currentRouteComponent.get();

    if (Component) {
      return <Component />;
    }

    const currentPath = this.props.currentPath.get();

    if (currentPath !== this.props.welcomeUrl) {
      return <Redirect exact to={this.props.welcomeUrl} />;
    }

    return (
      <div className="error">
        <h2>ERROR!!</h2>
        <p>
          No matching route for the current path:
          {" "}
          <code>{currentPath}</code>
          {" "}
          which is the welcomeUrl. This is a bug.
        </p>
      </div>
    );
  }

  render() {
    return (
      <div className={`ClusterManager ClusterManager-${this.props.userStore.gutterSize.name}`}>
        <TopBar />
        <main>
          <div id="lens-views" />
          {this.renderMainComponent()}
        </main>
        <HotbarMenu />
        <StatusBar />
        <DeleteClusterDialog />
      </div>
    );
  }
}

export const ClusterManager = withInjectables<Dependencies>(NonInjectedClusterManager, {
  getProps: (di) => ({
    catalogPreviousActiveTabStorage: di.inject(catalogPreviousActiveTabStorageInjectable),
    currentRouteComponent: di.inject(currentRouteComponentInjectable),
    welcomeUrl: buildURL(di.inject(welcomeRouteInjectable).path),
    watchForGeneralEntityNavigation: di.inject(watchForGeneralEntityNavigationInjectable),
    currentPath: di.inject(currentPathInjectable),
    userStore: di.inject(userStoreInjectable),
  }),
});
