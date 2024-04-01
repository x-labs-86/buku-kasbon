import { Frame, Dialogs } from "@nativescript/core";
import {
  getCurrent__formattedDate,
  created__date,
  fontAwesome__parser,
  snackbar,
} from "~/global_helper";
import { GlobalModel } from "~/global_model";
import { SQL__insert, SQL__update, SQL__delete } from "~/sql_helper";

var context = new GlobalModel([{ page: "Form-user" }]),
  navData;

export function onLoaded(args) {
  context.set("currentFormattedDate", getCurrent__formattedDate());
}

export function onNavigatingTo(args) {
  const page = args.object;

  navData = page.navigationContext;

  console.log("navData", navData);

  context.set("fullname", navData.dataForm && navData.dataForm.fullname);
  context.set("phone", navData.dataForm && navData.dataForm.phone);
  context.set("about", navData.dataForm && navData.dataForm.about);
  context.set("address", navData.dataForm && navData.dataForm.address);
  context.set("created_date", created__date());

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
  if (context.get("fullname") == "" && context.get("phone") == "") {
    snackbar("Nama dan Ho. HP tidak boleh kosong!", "error");
    return;
  }
  const data = [
    { field: "avatar", value: fontAwesome__parser("f007") },
    { field: "fullname", value: context.get("fullname") },
    { field: "phone", value: context.get("phone") },
    { field: "about", value: context.get("about") },
    { field: "address", value: context.get("address") },
    { field: "updated_date", value: created__date() },
    { field: "created_date", value: created__date() },
  ];
  SQL__insert("users", data);
  snackbar("Data pelanggan berhasil disimpan.", "success");
  cancelData();
}

function __updateData(id) {
  if (context.get("fullname") == "" && context.get("phone") == "") {
    snackbar("Nama dan Ho. HP tidak boleh kosong!", "error");
    return;
  }
  const data = [
    { field: "fullname", value: context.get("fullname") },
    { field: "phone", value: context.get("phone") },
    { field: "about", value: context.get("about") },
    { field: "address", value: context.get("address") },
    { field: "updated_date", value: created__date() },
  ];
  SQL__update("users", data, id);
  snackbar("Data pelanggan berhasil diperbaharui.", "success");
  cancelData();
}

export function cancelData() {
  if (navData && navData.originModule) {
    Frame.topmost().navigate({
      moduleName: navData.originModule,
      transition: {
        name: "slideBottom",
      },
      clearHistory: true,
    });
  } else {
    // Frame.topmost().goBack();
    alert("Origin Module tidak ditemukan!");
  }
}

export function onArchived() {
  Dialogs.confirm({
    title: "Konfirmasi!",
    message: "Arsipkan data pelanggan ini?",
    okButtonText: "Ya",
    cancelButtonText: "Tidak",
    neutralButtonText: "Batal",
  }).then((result) => {
    if (result) {
      if (navData.dataForm && navData.dataForm.id) {
        const data = [
          { field: "archive", value: 1 },
          { field: "active", value: 0 },
          { field: "updated_date", value: created__date() },
        ];
        SQL__update("users", data, navData.dataForm.id);
        snackbar("Data pelanggan berhasil diarsipkan.", "success");

        setTimeout(() => {
          cancelData();
        }, 1000);
      }
    }
    console.log(result);
  });
}

export function onDelete() {
  Dialogs.confirm({
    title: "Konfirmasi!",
    message:
      "Apakah kamu ingin menghapus pelanggan ini, kamu akan kehilangan data ini secara permanen?",
    okButtonText: "Ya",
    cancelButtonText: "Tidak",
    neutralButtonText: "Batal",
  }).then((result) => {
    if (result) {
      if (navData.dataForm && navData.dataForm.id) {
        SQL__delete("users", navData.dataForm.id);
        snackbar("Data pelanggan berhasil dihapus secara permanen.", "success");

        setTimeout(() => {
          cancelData();
        }, 1000);
      }
    }
    console.log(result);
  });
}
