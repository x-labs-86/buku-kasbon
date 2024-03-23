import { Frame, Application, ApplicationSettings } from "@nativescript/core";

import { GlobalModel } from "~/global_model";
import {
  get__date,
  format__number,
  getCurrent__formattedDate,
  fontAwesome__parser,
} from "~/global_helper";
import { SQL__select, SQL__insert, SQL__truncate } from "~/sql_helper";

var context = new GlobalModel([{ page: "Home" }]);

export function onLoaded(args) {
  context.set("currentFormattedDate", getCurrent__formattedDate());
}

export function onNavigatingTo(args) {
  const page = args.object;

  context.set("isSearchButton", false);
  context.set("isSearchBar", false);
  _getUsers();

  console.log("shop_name", ApplicationSettings.getString("shop_name"));

  page.bindingContext = context;
}

export function onDrawerButtonTap(args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

export function openUserFormPage() {
  Frame.topmost().navigate({
    moduleName: "forms/user/user",
    transition: {
      name: "slideTop",
    },
  });
}

export function openReportPage() {
  Frame.topmost().navigate({
    moduleName: "report/report-page",
    transition: {
      name: "fade",
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
    let summary = { totalUsers: 0, totalKasbon: 0 };
    res = res.map((item, index) => {
      const randomQtyKasbon = Math.floor(Math.random() * 50) + 1;
      const randomTotalKasbon = Math.floor(Math.random() * 1000000) + 1;

      // item.avatar = String.fromCharCode(parseInt(item.avatar, 16));
      item.qtyKasbon = randomQtyKasbon;
      item.totalKasbon = format__number(randomTotalKasbon);

      summary.totalKasbon += randomTotalKasbon;

      return item;
    });

    context.set("isSearchButton", res.length !== 0 ? true : false);

    summary.totalUsers = res.length;
    summary.totalKasbon = format__number(summary.totalKasbon);

    context.set("users", res);
    context.set("isUsersEmpty", res.length === 0);
    context.set("summary", summary);
  });
}

export function insertButton() {
  const avatar = [
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
      { field: "avatar", value: fontAwesome__parser(avatar[randomNumber]) },
      { field: "fullname", value: fullname[randomNumber] },
      { field: "about", value: "NEWBIE " },
      { field: "address", value: "KUNINGAN" },
      { field: "phone", value: "081789654321" },
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
