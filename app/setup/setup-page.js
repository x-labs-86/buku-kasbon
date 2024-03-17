import { Frame, ApplicationSettings } from "@nativescript/core";

import { GlobalModel } from "~/global_model";
import { init__tables } from "~/global_helper";

var context = new GlobalModel([{ page: "Setup" }]);
var __as = ApplicationSettings;

export function onNavigatingTo(args) {
  const page = args.object;

  context.set("shop_name", __as.getString("shop_name"));
  context.set("isLoading", false);

  page.bindingContext = context;
}

export function startNow() {
  if (context.get("shop_name") == "") {
    alert("Nama toko tidak boleh kosong!");
    return;
  } else {
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
      });
      context.set("isLoading", false);
    }, 1500);
  }
}
