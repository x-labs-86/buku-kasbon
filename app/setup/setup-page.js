import { Frame, ApplicationSettings } from "@nativescript/core";

import { GlobalModel } from "~/global_model";
import { init__tables, snackbar } from "~/global_helper";

var context = new GlobalModel([{ page: "Setup" }]);
var __as = ApplicationSettings;

export function onNavigatingTo(args) {
  const page = args.object;

  /* 
    FITUR :
      - Semua dalam genggaman Anda
      - Minim penggunaan kertas
      - Offline, Tidak perlu jaringan internet
      - Mudah digunakan dan Efisien
  */

  context.set("current_slide", "LOGO");
  context.set("logo_slide", true);
  context.set("f1_slide", false);
  context.set("f2_slide", false);
  context.set("f3_slide", false);
  context.set("form_slide", false);

  console.log("logo_slide", context.get("logo_slide"));
  console.log("f1_slide", context.get("f1_slide"));
  console.log("f2_slide", context.get("f2_slide"));
  console.log("f3_slide", context.get("f3_slide"));
  console.log("form_slide", context.get("form_slide"));

  context.set("shop_name", __as.getString("shop_name"));
  context.set("isLoading", false);

  page.bindingContext = context;
}

export function toggleSlide(args) {
  let tapParam = args.object.tapParam && args.object.tapParam.toUpperCase();
  context.set("current_slide", tapParam);

  switch (tapParam) {
    case "LOGO":
      context.set("logo_slide", true);
      context.set("f1_slide", false);
      context.set("f2_slide", false);
      context.set("f3_slide", false);
      context.set("form_slide", false);
      break;

    case "F1":
      context.set("logo_slide", false);
      context.set("f1_slide", true);
      context.set("f2_slide", false);
      context.set("f3_slide", false);
      context.set("form_slide", false);
      break;

    case "F2":
      context.set("logo_slide", false);
      context.set("f1_slide", false);
      context.set("f2_slide", true);
      context.set("f3_slide", false);
      context.set("form_slide", false);
      break;

    case "F3":
      context.set("logo_slide", false);
      context.set("f1_slide", false);
      context.set("f2_slide", false);
      context.set("f3_slide", true);
      context.set("form_slide", false);
      break;

    case "FORM":
      context.set("logo_slide", false);
      context.set("f1_slide", false);
      context.set("f2_slide", false);
      context.set("f3_slide", false);
      context.set("form_slide", true);
      break;

    default:
      context.set("logo_slide", true);
      context.set("f1_slide", false);
      context.set("f2_slide", false);
      context.set("f3_slide", false);
      context.set("form_slide", false);
      break;
  }
}

export function startNow() {
  console.log("shop_name", context.get("shop_name"));
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

  context.set("isLoading", true);
  setTimeout(() => {
    if (__as.getBoolean("setup")) {
      __as.setString("shop_name", context.get("shop_name"));
      init__tables();
      __as.setBoolean("setup", false);
    }
    Frame.topmost().navigate({
      moduleName: "home/home-page",
      transition: {
        name: "fade",
      },
      clearHistory: true,
    });
    context.set("isLoading", false);
  }, 1500);
}
