import { Frame } from "@nativescript/core";
import {
  getCurrent__formattedDate,
  created__date,
  fontAwesome__parser,
} from "~/global_helper";
import { GlobalModel } from "~/global_model";
import { SQL__select, SQL__insert } from "~/sql_helper";

var context = new GlobalModel([{ page: "Form-user" }]);

export function onLoaded(args) {
  context.set("currentFormattedDate", getCurrent__formattedDate());
}

export function onNavigatingTo(args) {
  const page = args.object;

  context.set("fullname", "");
  context.set("phone", "");
  context.set("about", "");
  context.set("address", "");
  context.set("created_date", created__date());

  page.bindingContext = context;
}

export function saveData() {
  if (context.get("fullname") == "" && context.get("phone") == "") {
    alert("Nama dan Ho. HP tidak boleh kosong!");
    return;
  }
  const data = [
    { field: "avatar", value: fontAwesome__parser("f007") },
    { field: "fullname", value: context.get("fullname") },
    { field: "phone", value: context.get("phone") },
    { field: "about", value: context.get("about") },
    { field: "address", value: context.get("address") },
    { field: "created_date", value: context.get("created_date") },
  ];
  SQL__insert("users", data);
  cancelData();
}

export function cancelData() {
  Frame.topmost().navigate({
    moduleName: "home/home-page",
    transition: {
      name: "slideBottom",
    },
  });
}
