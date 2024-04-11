import { Application, Frame, Dialogs } from "@nativescript/core";

import { SQL__select, SQL__update, SQL__delete } from "~/sql_helper";
import { GlobalModel } from "~/global_model";
import { format__number, snackbar, created__date } from "~/global_helper";

var context = new GlobalModel([{ page: "Archive" }]);

export function onNavigatingTo(args) {
  const page = args.object;

  context.set("isSearchButton", false);
  context.set("isSearchBar", false);
  context.set("totalArchiveUsers", 0);
  context.set("totalArchiveKasbon", 0);

  // console.log("isSearchButton", context.isSearchButton);

  reload();

  page.bindingContext = context;
}

function reload() {
  _getUsers(`WHERE archive=1 AND active=0`);
  _getKasbon(`WHERE archive=1`);
}

export function onDrawerButtonTap(args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

export function searchBarToggle() {
  context.set("isSearchBar", !context.get("isSearchBar"));
}

export function onSubmit(args) {
  _getUsers(
    `WHERE fullname LIKE '%${args.object.text}%' AND archive=1 AND active=0`
  );
  _getKasbon(`WHERE kasbon_name LIKE '%${args.object.text}%' AND archive=1`);
}

export function onClear(args) {
  reload();
}

function _getUsers(queryCondition = null) {
  SQL__select("users", "*", queryCondition).then((res) => {
    context.set("users", res);
    context.set("totalArchiveUsers", res.length);
    context.set("isUsersEmpty", res.length === 0);
    context.set("isSearchButton", res.length !== 0);
  });
}

function _getKasbon(queryCondition = null) {
  SQL__select("bukukasbon", "*", queryCondition).then((res) => {
    res = res.map((item) => {
      item.total_payment_formatted = "Rp." + format__number(item.total_payment);

      return item;
    });

    context.set("kasbon", res);
    context.set("totalArchiveKasbon", res.length);
    context.set("isKasbonEmpty", res.length === 0);
    context.set("isSearchButton", res.length !== 0);
  });
}

export function openMenuOnListOfUser(args) {
  // let itemIndex = args.index;
  let itemTap = args.view;
  let itemTapData = itemTap.bindingContext;

  console.log("user ", itemTapData);

  Dialogs.action({
    title: itemTapData.fullname,
    message: "<" + itemTapData.fullname + ">",
    cancelButtonText: "BATAL",
    actions: ["Pulihkan", "Hapus Permanen"],
    cancelable: false,
  }).then((result) => {
    // console.log(result);
    switch (result) {
      case "Pulihkan":
        __onRestoreUser(itemTapData.id);
        break;

      case "Hapus Permanen":
        __onDeleteUser(itemTapData.id);
        break;
    }
  });
}

function __onRestoreUser(id) {
  Dialogs.confirm({
    title: "Konfirmasi!",
    message: "Pulihkan data pelanggan ini?",
    okButtonText: "Ya",
    cancelButtonText: "Tidak",
    neutralButtonText: "Batal",
  }).then((result) => {
    if (result) {
      if (id) {
        const dataUpdate = [
          { field: "archive", value: 0 },
          { field: "active", value: 1 },
          { field: "updated_date", value: created__date() },
        ];
        SQL__update("users", dataUpdate, id);
        snackbar("Data pelanggan berhasil diarsipkan.", "success");
        console.log("submit restore user", dataUpdate);
        setTimeout(() => {
          reload();
        }, 400);
      }
    }
    // console.log(result);
  });
}

function __onDeleteUser(id) {
  Dialogs.confirm({
    title: "Konfirmasi!",
    message:
      "Apakah kamu ingin menghapus pelanggan ini, kamu akan kehilangan data ini secara permanen?",
    okButtonText: "Ya",
    cancelButtonText: "Tidak",
    neutralButtonText: "Batal",
  }).then((result) => {
    if (result) {
      if (id) {
        SQL__delete("users", id);
        snackbar("Data pelanggan berhasil dihapus secara permanen.", "success");

        setTimeout(() => {
          reload();
        }, 400);
      }
    }
    // console.log(result);
  });
}

export function openMenuOnListOfKasbon(args) {
  // let itemIndex = args.index;
  let itemTap = args.view;
  let itemTapData = itemTap.bindingContext;

  console.log("kasbon ", itemTapData);

  Dialogs.action({
    title: itemTapData.kasbon_name,
    message: "<" + itemTapData.kasbon_name + ">",
    cancelButtonText: "BATAL",
    actions: ["Pulihkan", "Hapus Permanen"],
    cancelable: false,
  }).then((result) => {
    // console.log(result);
    switch (result) {
      case "Pulihkan":
        __onRestoreKasbon(itemTapData.id);
        break;

      case "Hapus Permanen":
        __onDeleteKasbon(itemTapData.id);
        break;
    }
  });
}

function __onRestoreKasbon(id) {
  Dialogs.confirm({
    title: "Konfirmasi!",
    message: "Pulihkan data kasbon ini?",
    okButtonText: "Ya",
    cancelButtonText: "Tidak",
    neutralButtonText: "Batal",
  }).then((result) => {
    if (result) {
      if (id) {
        const data = [
          { field: "archive", value: 0 },
          { field: "updated_date", value: created__date() },
        ];
        SQL__update("bukukasbon", data, id);
        snackbar("Data kasbon berhasil diarsipkan.", "success");

        setTimeout(() => {
          reload();
        }, 400);
      }
    }
  });
}

function __onDeleteKasbon(id) {
  Dialogs.confirm({
    title: "Konfirmasi!",
    message:
      "Apakah kamu ingin menghapus kasbon ini, kamu akan kehilangan data ini secara permanen?",
    okButtonText: "Ya",
    cancelButtonText: "Tidak",
    neutralButtonText: "Batal",
  }).then((result) => {
    if (result) {
      if (id) {
        SQL__delete("bukukasbon", id);
        snackbar("Data kasbon berhasil dihapus secara permanen.", "success");

        setTimeout(() => {
          reload();
        }, 400);
      }
    }
  });
}
