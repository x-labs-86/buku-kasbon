import { Application, Frame } from "@nativescript/core";
// import { ViewBase } from "@nativescript/core/ui/core/view-base";

import { GlobalModel } from "~/global_model";
import { SQL__select, SQL__insert, SQL__truncate } from "~/sql_helper";

var context = new GlobalModel([{ page: "Report" }]);

export function onNavigatingTo(args) {
  const page = args.object;

  /* const items = Array.from({ length: 100 }).map((_, i) => ({
    title: `Item ${i}`,
  })); */

  const biggestDebtor = [
    {
      name: "Topan",
      persentase: "75%",
      color: "#FFFFFF",
      bg: "#D81B60",
      total: "Rp 75.000",
    },
    {
      name: "Dandi",
      persentase: "10%",
      color: "#FFFFFF",
      bg: "#3949AB",
      total: "Rp 10.000",
    },
    {
      name: "Riki",
      persentase: "5%",
      color: "#FFFFFF",
      bg: "#00897B",
      total: "Rp 5.000",
    },
  ];

  const oldestDebtor = [
    {
      name: "Lulu",
      persentase: "60",
      color: "#FFFFFF",
      bg: "#00ACC1",
      time: "60 hari",
      total: "Rp 35.000",
    },
    {
      name: "Diki",
      persentase: "23",
      color: "#FFFFFF",
      bg: "#FBC02D",
      time: "23 hari",
      total: "Rp 22.000",
    },
    {
      name: "Kudo",
      persentase: "17",
      color: "#FFFFFF",
      bg: "#546E7A",
      time: "17 hari",
      total: "Rp 51.000",
    },
  ];

  context.set("biggestDebtor", biggestDebtor);
  context.set("oldestDebtor", oldestDebtor);

  page.bindingContext = context;
}

export function onDrawerButtonTap(args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

export function openHomePage() {
  Frame.topmost().navigate({
    moduleName: "home/home-page",
    transition: {
      name: "slideBottom",
    },
  });
}

export function insertButton(args) {
  const data = [
    { field: "fullname", value: "DIAS" },
    { field: "about", value: "NEWBIE" },
    { field: "address", value: "KUNINGAN" },
    { field: "isActive", value: 1 },
    { field: "created_date", value: "2024-02-25" },
  ];
  SQL__insert("users", data).then((res) => {
    console.log("INSERT : ", res);
  });
}

export function selectButton(args) {
  SQL__select("users").then((res) => {
    // console.log("DATA >>> ", res);
    // console.log("TOTAL >>> ", res.length);
  });
}

export function truncateButton(args) {
  SQL__truncate("users");
  // console.log("Truncated");
}

export function openModalAddData() {
  // console.log("tap");
}
