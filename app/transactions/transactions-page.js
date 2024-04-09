import { Frame, Dialogs } from "@nativescript/core";
import {
  getCurrent__formattedDate,
  created__date,
  format__number,
  snackbar,
  handle__BackButton,
} from "~/global_helper";
import { GlobalModel } from "~/global_model";
import {
  SQL__selectRaw,
  SQL__insert,
  SQL__update,
  SQL__delete,
} from "~/sql_helper";

var context = new GlobalModel([{ page: "Transactions" }]),
  navData;

export function onLoaded(args) {
  context.set("currentFormattedDate", getCurrent__formattedDate());
  handle__BackButton(true, {
    originModule: "home/home-page",
    transition: "fade",
  });
}

export function onNavigatingTo(args) {
  const page = args.object;

  navData = page.navigationContext;

  // console.log("navData transactions >> ", navData);

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
  _getBukukasbon("WHERE bk.archive=0 AND bk.user_id=" + context.get("user_id"));
}

function _getBukukasbon(queryCondition = null) {
  const query =
    "SELECT bk.id AS bukukasbon_id, bk.user_id, bk.total_payment, bk.kasbon_name, COALESCE((SELECT SUM(bkt.paid) FROM bukukasbon_trx bkt WHERE bkt.bukukasbon_id = bk.id), 0) AS total_paid FROM bukukasbon bk " +
    queryCondition;

  SQL__selectRaw(query).then((res) => {
    res = res.map((item, index) => {
      item.payment_in_full =
        ((item.total_paid / item.total_payment) * 100).toFixed(2) + "%";
      item.total_paid_formatted = "Rp. " + format__number(item.total_paid);
      item.total_payment_formatted =
        "Rp. " + format__number(item.total_payment);

      return item;
    });
    // console.log(res);

    const all_kasbon = res.length;
    const all_paid = res.filter(
      (item) => item.total_paid == item.total_payment
    ).length;
    const all_kasbon_percent = (all_paid / all_kasbon) * 100 + "%";

    context.set("all_kasbon", all_kasbon);
    context.set("all_paid", all_paid);
    context.set("all_kasbon_percent", all_kasbon_percent);

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
    // console.log(result);
    switch (result) {
      case "Bayar Kasbon":
        __paidKasbon(itemTapData, firstWord);
        break;

      case "Ubah":
        __changeData();
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

function __paidKasbon(data, kasbonName) {
  Dialogs.prompt({
    title: "Bayar Kasbon <" + kasbonName + ">",
    message:
      "Kasbon yang belum dibayar Rp." +
      format__number(data.total_payment - data.total_paid),
    defaultText: "",
    okButtonText: "Bayar",
    neutralButtonText: "Batal",
    cancelable: false,
    // cancelButtonText: 'Cancel',
    // capitalizationType: 'none',
    inputType: "number",
  }).then((res) => {
    if (res && res.result) {
      const inputPaid = parseInt(res.text);
      const remaining = parseInt(data.total_payment - data.total_paid);

      if (inputPaid > remaining) {
        snackbar(
          "Jumlah bayar terlalu lebih! maksimal bayar Rp." +
            format__number(remaining),
          "error"
        );
        return;
      }

      const insertData = [
        { field: "user_id", value: navData.dataForm.id },
        { field: "bukukasbon_id", value: data.bukukasbon_id },
        { field: "paid", value: res.text },
        { field: "created_date", value: created__date() },
      ];
      // console.log(insertData);
      SQL__insert("bukukasbon_trx", insertData);
      snackbar("Data pembayaran berhasil disimpan", "success");

      setTimeout(() => {
        reload();
      }, 400);
    }
    // console.log(res);
  });
}

function __changeData() {
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
        }, 400);
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
        }, 400);
      }
    }
  });
}
