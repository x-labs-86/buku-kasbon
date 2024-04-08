import { Frame, Dialogs } from "@nativescript/core";
import {
  getCurrent__formattedDate,
  created__date,
  format__number,
  snackbar,
} from "~/global_helper";
import { GlobalModel } from "~/global_model";
import { SQL__select, SQL__update, SQL__delete } from "~/sql_helper";

var context = new GlobalModel([{ page: "Transactions" }]),
  navData;

export function onLoaded(args) {
  context.set("currentFormattedDate", getCurrent__formattedDate());
}

export function onNavigatingTo(args) {
  const page = args.object;

  navData = page.navigationContext;

  console.log("navData transactions >> ", navData);

  context.set("user_id", navData.dataForm && navData.dataForm.id);
  context.set("avatar", navData.dataForm && navData.dataForm.avatar);
  context.set("fullname", navData.dataForm && navData.dataForm.fullname);
  context.set("phone", navData.dataForm && navData.dataForm.phone);
  context.set("about", navData.dataForm && navData.dataForm.about);
  context.set("address", navData.dataForm && navData.dataForm.address);

  reload();

  page.bindingContext = context;
}

export function openKasbonForm() {
  Frame.topmost().navigate({
    moduleName: "forms/kasbon-form/kasbon-form",
    transition: {
      name: "slideTop",
    },
    context: {
      originModule: "transactions/transactions-page",
      dataForm: {
        user_id: navData.dataForm.id,
        user_fullname: navData.dataForm.fullname,
        // id: navData.dataForm.id,
        avatar: navData.dataForm.avatar,
        fullname: navData.dataForm.fullname,
        phone: navData.dataForm.phone,
        about: navData.dataForm.about,
        address: navData.dataForm.address,
      },
    },
  });
}

function reload() {
  _getBukukasbon("WHERE archive=0 AND user_id=" + context.get("user_id"));
}

function _getBukukasbon(queryCondition = null) {
  SQL__select("bukukasbon", "*", queryCondition).then((res) => {
    res = res.map((item, index) => {
      item.total_payment_formatted =
        "Rp. " + format__number(item.total_payment);

      return item;
    });
    console.log(res);
    context.set("kasbon", res);
    context.set("isKasbonEmpty", res.length == 0);
  });
}

export function backHome() {
  Frame.topmost().navigate({
    moduleName: "home/home-page",
    transition: {
      name: "slideBottom",
    },
    clearHistory: true,
  });
}

export function openMenuOnList(args) {
  // let itemIndex = args.index;
  let itemTap = args.view;
  let itemTapData = itemTap.bindingContext;

  const splitKasbonName =
    itemTapData.kasbon_name && itemTapData.kasbon_name.split(" ");
  const firstWord = splitKasbonName.length
    ? splitKasbonName[0]
    : itemTapData.kasbon_name;

  Dialogs.action({
    title: "MENU <" + firstWord + ">",
    message: "<" + itemTapData.fullname + ">",
    cancelButtonText: "BATAL",
    actions: ["Bayar Kasbon", "Ubah", "Arsipkan", "Hapus Permanen"],
    cancelable: false,
  }).then((result) => {
    console.log(result);
    switch (result) {
      case "Bayar Kasbon":
        console.log("Bayar Kasbon");
        break;

      case "Ubah":
        Frame.topmost().navigate({
          moduleName: "forms/kasbon-form/kasbon-form",
          transition: {
            name: "slideTop",
          },
          context: {
            originModule: "transactions/transactions-page",
            dataForm: {
              ...{
                user_id: navData.dataForm.id,
                user_fullname: navData.dataForm.fullname,
                avatar: navData.dataForm.avatar,
                fullname: navData.dataForm.fullname,
                phone: navData.dataForm.phone,
                about: navData.dataForm.about,
                address: navData.dataForm.address,
              },
              ...itemTapData,
            },
          },
        });
        break;

      case "Arsipkan":
        __onArchived(itemTapData.id);
        break;

      case "Hapus Permanen":
        __onDelete(itemTapData.id);
        break;
    }
  });
}

function __onArchived(id) {
  Dialogs.confirm({
    title: "Konfirmasi!",
    message: "Arsipkan data kasbon ini?",
    okButtonText: "Ya",
    cancelButtonText: "Tidak",
    neutralButtonText: "Batal",
  }).then((result) => {
    if (result) {
      if (id) {
        const data = [
          { field: "archive", value: 1 },
          { field: "updated_date", value: created__date() },
        ];
        SQL__update("bukukasbon", data, id);
        snackbar("Data kasbon berhasil diarsipkan.", "success");

        setTimeout(() => {
          reload();
        }, 1000);
      }
    }
  });
}

function __onDelete(id) {
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
        }, 1000);
      }
    }
  });
}
