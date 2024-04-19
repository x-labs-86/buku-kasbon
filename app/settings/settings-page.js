import { Application, ApplicationSettings } from "@nativescript/core";

import { snackbar, loadMyAdMob } from "~/global_helper";
import { GlobalModel } from "~/global_model";

var context = new GlobalModel([{ page: "Settings" }]);
var __as = ApplicationSettings;

export function onLoaded() {
  loadMyAdMob();
}

export function onNavigatingTo(args) {
  const page = args.object;

  context.set("shop_name", __as.getString("shop_name"));

  page.bindingContext = context;
}

export function onDrawerButtonTap(args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

export function onSubmit() {
  const errorMessage = "Nama toko tidak boleh kosong!";
  if (!context.get("shop_name")) {
    snackbar(errorMessage, "error");
    return;
  }

  if (context.get("shop_name").trim() == "") {
    snackbar(errorMessage, "error");
    return;
  }

  if (context.get("shop_name") == undefined) {
    snackbar(errorMessage, "error");
    return;
  }

  __as.setString("shop_name", context.get("shop_name"));

  snackbar(
    "Perubahan berhasil disimpan. Harap jalankan ulang aplikasi untuk menerapkan pengaturan.",
    "success",
    5000
  );
}
