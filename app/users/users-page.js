import { Application, Frame } from "@nativescript/core";

import { SQL__select } from "../sql_helper";
import { GlobalModel } from "~/global_model";

var context = new GlobalModel([{ page: "Users" }]);

export function onNavigatingTo(args) {
  const page = args.object;

  context.set("isSearchButton", false);
  context.set("isSearchBar", false);
  context.set("totalUsers", 0);
  _getUsers(`WHERE archive=0 AND active=1`);

  // console.log("isSearchButton", context.isSearchButton);

  page.bindingContext = context;
}

export function onDrawerButtonTap(args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

export function openUserForm() {
  Frame.topmost().navigate({
    moduleName: "forms/user-form/user-form",
    transition: {
      name: "slideTop",
    },
    context: {
      originModule: "users/users-page",
      dataForm: null,
    },
  });
}

export function openUserFormEdit(args) {
  // let itemIndex = args.index;
  let itemTap = args.view;
  let itemTapData = itemTap.bindingContext;

  Frame.topmost().navigate({
    moduleName: "forms/user-form/user-form",
    transition: {
      name: "slideTop",
    },
    context: {
      originModule: "users/users-page",
      dataForm: itemTapData,
    },
  });
}

export function searchBarToggle() {
  context.set("isSearchBar", !context.get("isSearchBar"));
}

export function onSubmit(args) {
  _getUsers(
    `WHERE fullname LIKE '%${args.object.text}%' AND archive=0 AND active=1`
  );
}

export function onClear(args) {
  _getUsers(`WHERE archive=0 AND active=1`);
}

function _getUsers(queryCondition = null) {
  SQL__select("users", "*", queryCondition).then((res) => {
    context.set("users", res);
    context.set("totalUsers", res.length);
    context.set("isUsersEmpty", res.length === 0);
    context.set("isSearchButton", res.length !== 0);
  });
}
