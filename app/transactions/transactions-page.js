import { Application } from "@nativescript/core";

import { TransactionsViewModel } from "./transactions-view-model";

export function onNavigatingTo(args) {
  const page = args.object;
  page.bindingContext = new TransactionsViewModel();
}

export function onDrawerButtonTap(args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}
