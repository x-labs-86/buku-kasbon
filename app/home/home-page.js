import {
  Frame,
  Application,
  ApplicationSettings,
  Dialogs,
} from "@nativescript/core";

import { GlobalModel } from "~/global_model";
import {
  get__date,
  format__number,
  getCurrent__formattedDate,
  fontAwesome__parser,
  loadMyAdMob,
} from "~/global_helper";
import {
  SQL__select,
  SQL__selectRaw,
  SQL__insert,
  SQL__truncate,
  SQL__query,
} from "~/sql_helper";

var context = new GlobalModel([{ page: "Home" }]);

export function onLoaded(args) {
  const splitTime =
    getCurrent__formattedDate() && getCurrent__formattedDate().split(",");
  context.set("currentFormattedDate__day", splitTime[0].trim());
  context.set("currentFormattedDate", splitTime[1].trim());

  loadMyAdMob();
}

export function onNavigatingTo(args) {
  const page = args.object;

  context.set("isSearchBar", false);
  _getUsers(`WHERE u.archive=0 AND u.active=1`);

  // console.log("shop_name", ApplicationSettings.getString("shop_name"));

  page.bindingContext = context;
}

export function onDrawerButtonTap(args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

export function openUserFormPage() {
  Frame.topmost().navigate({
    moduleName: "forms/user-form/user-form",
    transition: {
      name: "slideTop",
    },
    context: {
      originModule: "home/home-page",
      dataForm: null,
    },
  });
}

export function openMenuOnList(args) {
  // let itemIndex = args.index;
  let itemTap = args.view;
  let itemTapData = itemTap.bindingContext;

  const splitFullname = itemTapData.fullname && itemTapData.fullname.split(" ");
  const firstName = splitFullname.length
    ? splitFullname[0]
    : itemTapData.fullname;

  Dialogs.action({
    title: itemTapData.fullname,
    message: "<" + itemTapData.fullname + ">",
    cancelButtonText: "BATAL",
    actions: [
      "Ubah Data Pelanggan",
      "Lihat Rincian Kasbon",
      "Buat Kasbon Baru",
    ],
    cancelable: false,
  }).then((result) => {
    // console.log(result);
    switch (result) {
      case "Ubah Data Pelanggan":
        Frame.topmost().navigate({
          moduleName: "forms/user-form/user-form",
          transition: {
            name: "slideTop",
          },
          context: {
            originModule: "home/home-page",
            dataForm: itemTapData,
          },
        });
        break;

      case "Lihat Rincian Kasbon":
        Frame.topmost().navigate({
          moduleName: "transactions/transactions-page",
          transition: {
            name: "slideTop",
          },
          context: {
            originModule: "home/home-page",
            dataForm: itemTapData,
          },
        });
        break;

      case "Buat Kasbon Baru":
        Frame.topmost().navigate({
          moduleName: "forms/kasbon-form/kasbon-form",
          transition: {
            name: "slideTop",
          },
          context: {
            originModule: "home/home-page",
            dataForm: {
              user_id: itemTapData.id,
              user_fullname: itemTapData.fullname,
            },
          },
        });
        break;
    }
  });

  /*  */
}

export function openReportPage() {
  Frame.topmost().navigate({
    moduleName: "report/report-page",
    transition: {
      name: "slideTop",
    },
  });
}

export function searchBarToggle() {
  context.set("isSearchBar", !context.get("isSearchBar"));
}

export function onSubmit(args) {
  _getUsers(
    `WHERE u.fullname LIKE '%${args.object.text}%' AND u.archive=0 AND u.active=1`
  );

  const users = context.get("users");
  context.set("userSearchFound", users.length !== 0 ? true : false);
}

export function onClear(args) {
  _getUsers(`WHERE u.archive=0 AND u.active=1`);
}

function _getUsers(queryCondition = null) {
  // const query =
  //   "SELECT u.*, COUNT(b.id) AS total_bukukasbon, SUM(b.total_payment) AS total_payment_bukukasbon FROM users u LEFT JOIN bukukasbon b ON u.id = b.user_id " +
  //   queryCondition +
  //   " GROUP BY u.id, u.avatar, u.fullname";

  // const query =
  //   "SELECT u.*, COUNT(b.id) AS total_bukukasbon, SUM(b.total_payment) AS total_payment_bukukasbon, COALESCE(t.total_paid, 0) AS total_paid_kasbon FROM users u LEFT JOIN bukukasbon b ON u.id = b.user_id LEFT JOIN ( SELECT bt.user_id, SUM(bt.paid) AS total_paid FROM bukukasbon_trx bt JOIN bukukasbon bb ON bt.bukukasbon_id = bb.id  GROUP BY bt.user_id ) t ON u.id = t.user_id " +
  //   queryCondition +
  //   " GROUP BY u.id, u.avatar, u.fullname";

  const query =
    "SELECT u.*, COUNT(b.id) AS total_bukukasbon, SUM(CASE WHEN b.archive = 0 THEN b.total_payment ELSE 0 END) AS total_payment_bukukasbon, COALESCE(t.total_paid, 0) AS total_paid_kasbon FROM users u LEFT JOIN bukukasbon b ON u.id = b.user_id AND b.archive = 0 LEFT JOIN ( SELECT bt.user_id, SUM(bt.paid) AS total_paid FROM bukukasbon_trx bt JOIN bukukasbon bb ON bt.bukukasbon_id = bb.id WHERE bb.archive = 0 GROUP BY bt.user_id ) t ON u.id = t.user_id " +
    queryCondition +
    " GROUP BY u.id, u.avatar, u.fullname";

  SQL__selectRaw(query).then((res) => {
    let summary = {
      totalUsers: 0,
      totalQtyKasbon: 0,
      totalPaidKasbon: 0,
      totalKasbon: 0,
    };
    res = res.map((item, index) => {
      // item.avatar = String.fromCharCode(parseInt(item.avatar, 16));
      item.qtyKasbon = item.total_bukukasbon;
      item.totalKasbon = item.total_payment_bukukasbon
        ? format__number(item.total_payment_bukukasbon)
        : 0;
      item.totalPaidKasbon = item.total_paid_kasbon
        ? format__number(item.total_paid_kasbon)
        : 0;

      if (item.total_payment_bukukasbon) {
        item.statusKasbon =
          item.total_payment_bukukasbon === item.total_paid_kasbon
            ? "Lunas"
            : "Belum Lunas";
        item.statusColorKasbon =
          item.total_payment_bukukasbon === item.total_paid_kasbon
            ? "#4CAF50"
            : "#F44336";
      } else {
        item.statusKasbon = "-";
        item.statusColorKasbon = "#333333";
      }

      summary.totalKasbon += item.total_payment_bukukasbon;
      summary.totalPaidKasbon += item.total_paid_kasbon;
      summary.totalQtyKasbon += item.total_bukukasbon;

      return item;
    });

    // console.log("res users join ", res);
    summary.totalUsers = res.length;
    summary.totalPaidKasbon = format__number(summary.totalPaidKasbon);
    summary.totalKasbon = format__number(summary.totalKasbon);
    summary.totalQtyKasbon = summary.totalQtyKasbon;

    context.set("users", res);
    context.set("isUsersEmpty", res.length === 0);
    context.set("summary", summary);
  });
}

function _getBukuKasbonByUserId(user_id = null) {
  let response = { qtyKasbon: 0, totalKasbon: 0 };
  if (!user_id) return response;

  const queryCondition = `WHERE user_id=${user_id}`;

  SQL__select("bukukasbon", "*", queryCondition).then((res) => {
    res.foreach((item) => {
      response.qtyKasbon += item.total_payment;
    });
    response.totalKasbon += res.length;
  });

  return response;
}

export function insertButton() {
  const avatar = [
    "f007",
    "f21b",
    "f82f",
    "f508",
    "f4fb",
    "f501",
    "f2fe",
    "f7ca",
  ];
  const fullname = [
    "Daniel",
    "David",
    "John Duo",
    "Jessica",
    "Kang Cahya",
    "Robert",
    "Alan Walker",
    "Rachel",
  ];

  for (let index = 0; index < 50; index++) {
    const randomNumber = Math.floor(Math.random() * 7) + 1;
    const data = [
      { field: "avatar", value: fontAwesome__parser(avatar[randomNumber]) },
      { field: "fullname", value: fullname[randomNumber] },
      { field: "about", value: "NEWBIE " },
      { field: "address", value: "KUNINGAN" },
      { field: "phone", value: "081789654321" },
      { field: "updated_date", value: get__date() },
      { field: "created_date", value: get__date() },
    ];
    SQL__insert("users", data);
  }

  _getUsers(`WHERE u.archive=0 AND u.active=1`);
}

export function selectButton(args) {
  SQL__select("users").then((res) => {
    // console.log("DATA >>> ", res);
    // console.log("TOTAL >>> ", res.length);
  });
}

export function truncateButton(args) {
  SQL__truncate("users");
  // console.log("Truncated");

  _getUsers(`WHERE u.archive=0 AND u.active=1`);
}

export function openModalAddData() {
  // console.log("tap");
}
