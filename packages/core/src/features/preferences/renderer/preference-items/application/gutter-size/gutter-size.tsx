/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import React from "react";
import { SubTitle } from "../../../../../../renderer/components/layout/sub-title";
import { Select } from "../../../../../../renderer/components/select";
import { withInjectables } from "@ogre-tools/injectable-react";
import {
  globalGutterSizeOptions
} from "../../../../../../common/user-store/preferences-helpers";
import type { UserStore } from "../../../../../../common/user-store";
import { runInAction } from "mobx";
import userStoreInjectable from "../../../../../../common/user-store/user-store.injectable";
import { observer } from "mobx-react";
import { defaultGutterSize } from "../../../../../../common/vars";

interface Dependencies {
  userStore: UserStore;
}

const gutterSizeOptions = [
  {
    value: "standard",
    label: "Default",
  },
  {
    value: "small",
    label: "Small",
  },
  {
    value: "large",
    label: "Large",
  },
  {
    value: "xlarge",
    label: "Extra Large",
  },
] as const;

const NonInjectedGutterSize = observer(({ userStore }: Dependencies) => {
  return (
    <section id="gutterSize">
      <SubTitle title="Gutter Size" />
      <Select
        id="gutter-size-input"
        options={gutterSizeOptions}
        value={userStore.gutterSize.name}
        onChange={(value) =>
          runInAction(() => {
            const gutterSizeValue = globalGutterSizeOptions[value?.value ?? defaultGutterSize] ?? globalGutterSizeOptions[defaultGutterSize];
            userStore.gutterSize.name = gutterSizeValue.name;
            userStore.gutterSize.iconSize = gutterSizeValue.iconSize;
            console.log(value?.value ?? defaultGutterSize);
            console.log(gutterSizeValue);
            console.log(userStore.gutterSize);
          })
        }
        themeName="lens"
      />
    </section>
  );
});

export const GutterSize = withInjectables<Dependencies>(
  NonInjectedGutterSize,

  {
    getProps: (di) => ({
      userStore: di.inject(userStoreInjectable),
    }),
  },
);
