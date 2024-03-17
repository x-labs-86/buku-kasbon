import { SQL__query } from "~/sql_helper";

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
    "created_date"	TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
  )`);

  SQL__query(`CREATE TABLE IF NOT EXISTS "bukukasbon" (
    "id"	INTEGER NOT NULL UNIQUE,
    "user_id"	INTEGER NOT NULL,
    "total_payment"	REAL NOT NULL,
    "kasbon_name"	TEXT NOT NULL,
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
    "correction"	INTEGER NOT NULL DEFAULT 0,
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
