import { Application } from "@nativescript/core";

import { GlobalModel } from "~/global_model";

var context = new GlobalModel([{ page: "Settings" }]);

export function onNavigatingTo(args) {
  const page = args.object;

  page.bindingContext = context;
}

export function onDrawerButtonTap(args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}
