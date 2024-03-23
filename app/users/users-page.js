import { Application, Frame } from "@nativescript/core";

import { SQL__select } from "../sql_helper";
import { GlobalModel } from "~/global_model";

var context = new GlobalModel([{ page: "User" }]);

export function onNavigatingTo(args) {
  const page = args.object;

  context.set("isSearchButton", false);
  context.set("isSearchBar", false);
  context.set("totalUsers", 0);
  _getUsers();

  console.log("isSearchButton", context.isSearchButton);

  page.bindingContext = context;
}

export function onDrawerButtonTap(args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

export function openUserForm() {
  Frame.topmost().navigate({
    moduleName: "forms/user/user",
    transition: {
      name: "slideTop",
    },
  });
}

export function searchBarToggle() {
  context.set("isSearchBar", !context.get("isSearchBar"));
}

export function onSubmit(args) {
  _getUsers(`WHERE fullname LIKE '%${args.object.text}%'`);
}

export function onClear(args) {
  _getUsers();
}

function _getUsers(queryCondition = null) {
  SQL__select("users", "*", queryCondition).then((res) => {
    context.set("users", res);
    context.set("totalUsers", res.length);
    context.set("isUsersEmpty", res.length === 0);
    context.set("isSearchButton", res.length !== 0);
  });
}
