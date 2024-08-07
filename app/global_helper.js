import { SQL__query } from "~/sql_helper";
import {
  Frame,
  Application,
  AndroidApplication,
  knownFolders,
  Folder,
  path,
} from "@nativescript/core";
import { SnackBar } from "@nativescript-community/ui-material-snackbar";
import { InterstitialAd } from "@nativescript/firebase-admob";

export function init__tables() {
  SQL__query(`CREATE TABLE IF NOT EXISTS "users" (
    "id"	INTEGER NOT NULL UNIQUE,
    "avatar"	TEXT DEFAULT NULL,
    "fullname"	TEXT NOT NULL,
    "phone"	TEXT DEFAULT NULL,
    "about"	TEXT DEFAULT NULL,
    "address"	TEXT DEFAULT NULL,
    "label"	TEXT DEFAULT NULL,
    "label_color"	TEXT DEFAULT NULL,
    "color"	TEXT DEFAULT NULL,
    "bg" TEXT DEFAULT NULL,
    "archive"	INTEGER NOT NULL DEFAULT 0,
    "active"	INTEGER NOT NULL DEFAULT 1,
    "updated_date"	TEXT NOT NULL,
    "created_date"	TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
  )`);

  SQL__query(`CREATE TABLE IF NOT EXISTS "bukukasbon" (
    "id"	INTEGER NOT NULL UNIQUE,
    "user_id"	INTEGER NOT NULL,
    "total_payment"	REAL NOT NULL,
    "kasbon_name"	TEXT NOT NULL,
    "archive"	INTEGER NOT NULL DEFAULT 0,
    "created_date"	TEXT NOT NULL,
    "updated_date"	TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
  )`);

  SQL__query(`CREATE TABLE IF NOT EXISTS "bukukasbon_trx" (
    "id"	INTEGER NOT NULL UNIQUE,
    "user_id"	INTEGER NOT NULL,
    "bukukasbon_id"	INTEGER NOT NULL,
    "paid"	REAL NOT NULL,
    "created_date"	TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
  )`);

  SQL__query(`CREATE TABLE IF NOT EXISTS "bukukasbon_trx_correction" (
    "id"	INTEGER NOT NULL UNIQUE,
    "bukukasbon_trx_id"	INTEGER NOT NULL,
    "old_value"	REAL NOT NULL,
    "new_value"	REAL NOT NULL,
    "created_date"	TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
  )`);
}

export function get__date(dateValue = null, type = "ID") {
  const date = dateValue ? new Date(dateValue) : new Date();
  const mt = date.getMonth() + 1;

  let day = date.getDate();
  let month = mt > 9 ? mt : "0" + mt;
  let year = date.getFullYear();

  // This arrangement can be altered based on how we want the date's format to appear.
  if (type.toUpperCase() === "US") {
    return `${year}-${month}-${day}`;
  } else {
    return `${day}-${month}-${year}`;
  }
}

export function getCurrent__formattedDate() {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const currentDate = new Date();

  const day = days[currentDate.getDay()];
  const date = currentDate.getDate();
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
}

export function format__number(number, options = {}) {
  const {
    useGrouping = true,
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    groupingSeparator = ".",
    decimalSeparator = ",",
    currencySymbol = "",
  } = options;

  const roundedNumber = number.toFixed(maximumFractionDigits);
  const [integerPart, fractionalPart] = roundedNumber.split(".");

  let formattedNumber = useGrouping
    ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, groupingSeparator)
    : integerPart;

  if (maximumFractionDigits > 0) {
    formattedNumber += decimalSeparator + fractionalPart;
  }

  if (currencySymbol) {
    formattedNumber = currencySymbol + formattedNumber;
  }

  return formattedNumber;
}

export function fontAwesome__parser(avatar) {
  return String.fromCharCode(parseInt(avatar, 16));
}

export function created__date() {
  const now = new Date();

  // Get the date components
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero based
  const year = now.getFullYear();

  // Get the time components
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  // Assemble the date and time in the desired format
  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;

  return formattedDateTime;
}

export function snackbar(msg, type, delay = 2000) {
  const snackbar = new SnackBar();
  const typeUpper = type && type.toUpperCase();

  let typeOptions;

  switch (typeUpper) {
    case "ERROR":
      typeOptions = {
        textColor: "#FFFFFF",
        actionText: "X",
        actionColor: "#FFFFFF",
        backgroundColor: "#E74C3C",
      };
      break;

    case "WARNING":
      typeOptions = {
        textColor: "#000000",
        actionText: "X",
        actionColor: "#000000",
        backgroundColor: "#F1C40F",
      };
      break;

    case "INFO":
      typeOptions = {
        textColor: "#000000",
        actionText: "OK",
        actionColor: "#000000",
        backgroundColor: "#3498DB",
      };
      break;

    case "SUCCESS":
      typeOptions = {
        textColor: "#FFFFFF",
        actionText: "OK",
        actionColor: "#FFFFFF",
        backgroundColor: "#2ECC71",
      };
      break;

    default:
      // success
      typeOptions = {
        textColor: "#000000",
        actionText: "X",
        actionColor: "#000000",
        backgroundColor: "#ECF0F1",
      };
      break;
  }

  snackbar.action({
    message: msg,
    actionText: typeOptions.actionText,
    textColor: typeOptions.textColor,
    actionTextColor: typeOptions.actionColor,
    backgroundColor: typeOptions.backgroundColor,
    hideDelay: delay,
  });
}

export function handle__BackButton(defaultBack = true, backOptions) {
  if (Application.android) {
    if (defaultBack) {
      Application.android.on(
        AndroidApplication.activityBackPressedEvent,
        (args) => {
          args.cancel = true;
          Frame.topmost().goBack();
        }
      );
    } else {
      Application.android.on(
        AndroidApplication.activityBackPressedEvent,
        (args) => {
          args.cancel = true;

          const {
            originModule,
            transition = "slideBottom",
            clearHistory = false,
          } = backOptions;

          Frame.topmost().navigate({
            moduleName: originModule,
            transition: {
              name: transition,
            },
            clearHistory: clearHistory,
          });
        }
      );
    }
  }
}

export function loadMyAdMob() {
  const ad = InterstitialAd.createForAdRequest(
    "ca-app-pub-1640120316722376/1451991853"
  );

  ad.onAdEvent((event, error, data) => {
    /* 
      event : adLoaded, adClosed
     */
    ad.show({
      immersiveModeEnabled: true,
    });
  });

  ad.load();
}

export function __createDirectories() {
  const cacheFolderPath = path.join(
    knownFolders.temp().path,
    "WebView/Crashpad"
  );

  const cacheFolder = Folder.fromPath(cacheFolderPath);
  // console.log("Checking if Crashpad directory exists...");
  cacheFolder
    .getEntities()
    .then((entities) => {
      // console.log(
      //   "Crashpad directory exists, entities found: " + entities.length
      // );
    })
    .catch((error) => {
      // console.log("Crashpad directory does not exist, creating directory...");
      // Folder.fromPath(cacheFolderPath);
      // console.log("Crashpad directory created successfully");
    });
}
