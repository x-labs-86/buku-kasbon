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
