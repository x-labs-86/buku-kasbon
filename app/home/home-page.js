import { Application } from "@nativescript/core";

import { GlobalModel } from "~/global_model";
import { SQL__select, SQL__insert, SQL__truncate } from "~/sql_helper";
import { get__date } from "~/global_helper";

var context = new GlobalModel([{ page: "Home" }]);

export function onNavigatingTo(args) {
  const page = args.object;

  context.set("isSearchBar", false);
  _getUsers();

  page.bindingContext = context;
}

export function onDrawerButtonTap(args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

export function searchBarToggle() {
  context.set("isSearchBar", !context.get("isSearchBar"));
}

export function onSubmit(args) {
  // console.log(args);
  // console.log(args.object);
  // console.log(args.object.text);
  _getUsers(`WHERE fullname LIKE '%${args.object.text}%'`);
}

export function onClear(args) {
  _getUsers();
}

function _getUsers(queryCondition = null) {
  SQL__select("users", "*", queryCondition).then((res) => {
    res = res.map((item, index) => {
      item.ai = index + 1;
      item.photo = String.fromCharCode(parseInt(item.photo, 16));
      return item;
    });

    console.log("DATA >>> ", res);
    context.set("users", res);
    context.set("isUsersEmpty", res.length === 0);
  });
}

export function insertButton() {
  const photo = [
    "f007",
    "f21b",
    "f82f",
    "f508",
    "f4fb",
    "f501",
    "f2fe",
    "f7ca",
  ];
  const fullname = [
    "Daniel",
    "David",
    "John Duo",
    "Jessica",
    "Kang Cahya",
    "Robert",
    "Alan Walker",
    "Rachel",
  ];

  for (let index = 0; index < 50; index++) {
    const randomNumber = Math.floor(Math.random() * 7) + 1;
    const data = [
      { field: "photo", value: photo[randomNumber] },
      { field: "fullname", value: fullname[randomNumber] },
      { field: "about", value: "NEWBIE " },
      { field: "address", value: "KUNINGAN" },
      { field: "phone", value: "081789654321" },
      { field: "isActive", value: 1 },
      { field: "created_date", value: get__date() },
    ];
    SQL__insert("users", data);
  }

  _getUsers();
}

export function selectButton(args) {
  SQL__select("users").then((res) => {
    console.log("DATA >>> ", res);
    console.log("TOTAL >>> ", res.length);
  });
}

export function truncateButton(args) {
  SQL__truncate("users");
  console.log("Truncated");

  _getUsers();
}

export function openModalAddData() {
  console.log("tap");
}
