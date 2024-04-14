import { Application, ApplicationSettings, Utils } from "@nativescript/core";

import { snackbar } from "~/global_helper";
import { GlobalModel } from "~/global_model";

var context = new GlobalModel([{ page: "Settings" }]);
var __as = ApplicationSettings;

export function onLoaded() {}

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

export function openUrl(args) {
  if (args.object && args.object.url) {
    Utils.openUrl(args.object.url);
  }
}

export function openEmail(args) {
  if (args.object && args.object.email) {
    if (args.object.subject) {
      Utils.openUrl(
        "mailto:" + args.object.email + "?subject=" + args.object.subject
      );
    } else {
      Utils.openUrl("mailto:" + args.object.email);
    }
  }
}
