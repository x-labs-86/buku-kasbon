import { Frame, Dialogs } from "@nativescript/core";
import {
  getCurrent__formattedDate,
  created__date,
  fontAwesome__parser,
  snackbar,
} from "~/global_helper";
import { GlobalModel } from "~/global_model";
import { SQL__insert, SQL__update, SQL__delete } from "~/sql_helper";

var context = new GlobalModel([{ page: "Kasbon-user" }]),
  navData;

export function onLoaded(args) {
  context.set("currentFormattedDate", getCurrent__formattedDate());
}

export function onNavigatingTo(args) {
  const page = args.object;

  navData = page.navigationContext;

  context.set("user_id", navData.dataForm && navData.dataForm.user_id);
  context.set(
    "user_fullname",
    navData.dataForm && navData.dataForm.user_fullname
  );
  context.set(
    "total_payment",
    navData.dataForm && navData.dataForm.total_payment
  );
  context.set("kasbon_name", navData.dataForm && navData.dataForm.kasbon_name);

  context.set("isEdit", navData.dataForm && navData.dataForm.id ? true : false);

  page.bindingContext = context;
}

export function onSubmit() {
  if (navData.dataForm && navData.dataForm.id) {
    __updateData(navData.dataForm.id);
  } else {
    __insertData();
  }
}

function __insertData() {
  if (
    context.get("kasbon_name") == undefined ||
    context.get("total_payment") == undefined
  ) {
    snackbar("Nama dan Total tidak boleh kosong!", "error");
    return;
  }
  const data = [
    { field: "user_id", value: context.get("user_id") },
    { field: "total_payment", value: context.get("total_payment") },
    { field: "kasbon_name", value: context.get("kasbon_name") },
    { field: "updated_date", value: created__date() },
    { field: "created_date", value: created__date() },
  ];
  SQL__insert("bukukasbon", data);
  snackbar("Data kasbon berhasil disimpan.", "success");
  cancelData();
}

function __updateData(id) {
  if (
    context.get("kasbon_name") == undefined ||
    context.get("total_payment") == undefined
  ) {
    snackbar("Nama dan Total tidak boleh kosong!", "error");
    return;
  }
  const data = [
    { field: "total_payment", value: context.get("total_payment") },
    { field: "kasbon_name", value: context.get("kasbon_name") },
    { field: "updated_date", value: created__date() },
  ];
  SQL__update("bukukasbon", data, id);
  snackbar("Data kasbon berhasil diperbaharui.", "success");
  cancelData();
}

export function cancelData() {
  if (navData && navData.originModule) {
    Frame.topmost().navigate({
      moduleName: navData.originModule,
      transition: {
        name: "slideBottom",
      },
      context: {
        dataForm: {
          id: navData.dataForm.user_id,
          avatar: navData.dataForm.avatar,
          fullname: navData.dataForm.fullname,
          phone: navData.dataForm.phone,
          about: navData.dataForm.about,
          address: navData.dataForm.address,
        },
      },
      clearHistory: true,
    });
  } else {
    // Frame.topmost().goBack();
    alert("Origin Module tidak ditemukan!");
  }
}
