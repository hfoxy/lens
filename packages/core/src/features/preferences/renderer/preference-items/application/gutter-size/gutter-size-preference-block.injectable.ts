/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { preferenceItemInjectionToken } from "../../preference-item-injection-token";
import { GutterSize } from "./gutter-size";

const extensionInstallRegistryPreferenceBlockInjectable = getInjectable({
  id: "gutter-size-preference-item",

  instantiate: () => ({
    kind: "block" as const,
    id: "gutter-size",
    parentId: "application-page",
    orderNumber: 20,
    Component: GutterSize,
  }),

  injectionToken: preferenceItemInjectionToken,
});

export default extensionInstallRegistryPreferenceBlockInjectable;
