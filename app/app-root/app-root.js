import { Frame, Application } from "@nativescript/core";

import { AppRootViewModel } from "./app-root-view-model";
import { SQL__query } from "~/sql_helper";

export function onLoaded(args) {
  const drawerComponent = args.object;

  _initTables();

  drawerComponent.bindingContext = new AppRootViewModel();
}

export function onNavigationItemTap(args) {
  const component = args.object;
  const componentRoute = component.route;
  const componentTitle = component.title;
  const bindingContext = component.bindingContext;

  bindingContext.set("selectedPage", componentTitle);

  Frame.topmost().navigate({
    moduleName: componentRoute,
    transition: {
      name: "fade",
    },
  });

  const drawerComponent = Application.getRootView();
  drawerComponent.closeDrawer();
}

function _initTables() {
  SQL__query(`CREATE TABLE IF NOT EXISTS "users" (
    "id"	INTEGER NOT NULL UNIQUE,
    "photo"	TEXT DEFAULT NULL,
    "fullname"	TEXT NOT NULL,
    "about"	TEXT DEFAULT NULL,
    "address"	TEXT,
    "isActive"	INTEGER NOT NULL DEFAULT 1,
    "created_date"	TEXT NOT NULL,
    "phone"	TEXT,
    PRIMARY KEY("id" AUTOINCREMENT)
  )`);

  SQL__query(`CREATE TABLE IF NOT EXISTS "bukukasbon" (
    "id"	INTEGER NOT NULL UNIQUE,
    "user_id"	INTEGER NOT NULL,
    "total_payment"	REAL NOT NULL,
    "kasbon_name"	TEXT NOT NULL,
    "created_date"	TEXT NOT NULL,
    "updated_date"	TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
  )`);

  SQL__query(`CREATE TABLE IF NOT EXISTS "bukukasbon_trx" (
    "id"	INTEGER NOT NULL UNIQUE,
    "user_id"	INTEGER NOT NULL,
    "bukukasbon_id"	INTEGER NOT NULL,
    "paid"	REAL NOT NULL,
    "created_date"	TEXT NOT NULL,
    "correction"	INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY("id" AUTOINCREMENT)
  )`);
}
