import { Application } from "@nativescript/core";

import { SQL__select } from "../sql_helper";
import { UsersViewModel } from "./users-view-model";

var context = new UsersViewModel();

export function onNavigatingTo(args) {
  const page = args.object;

  _getUsers();

  page.bindingContext = context;
}

export function onDrawerButtonTap(args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

function _getUsers() {
  SQL__select("users").then((res) => {
    console.log("USERS : ", res);
    context.set("users", res);
  });
}
