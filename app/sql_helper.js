import { openOrCreate } from "@nativescript-community/sqlite";

/* 
  References:
    - https://github.com/nativescript-community/sqlite 
    - https://www.tutorialspoint.com/sqlite/index.htm
*/

const sqlite = openOrCreate("xlabs_bukukasbon.db");
const showError = true;

export async function SQL__select(
  table,
  fields = "*",
  conditionalQuery = null
) {
  try {
    let select;

    if (conditionalQuery) {
      select = "SELECT " + fields + " FROM " + table + " " + conditionalQuery;
    } else {
      select = "SELECT " + fields + " FROM " + table;
    }

    const data = await sqlite.select(select);
    return data;
  } catch (error) {
    if (showError) {
      console.log("SQL__select error >> ", error);
    }
  }
}

export async function SQL__insert(table, data = []) {
  try {
    if (data.length) {
      let fields = [],
        holder = [],
        value = [];
      for (let i in data) {
        fields.push(data[i].field);
        holder.push("?");
        value.push(data[i].value);
      }

      let fieldsString = fields.join(", "),
        holderString = holder.join(", ");

      const insert =
        "INSERT INTO " +
        table +
        " (" +
        fieldsString +
        ") VALUES (" +
        holderString +
        ")";

      await sqlite.execute(insert, value);
    } else {
      console.dir("Data : ", data);
      console.dir("Data length : ", data.length);
      console.log("No data to insert");
    }
  } catch (error) {
    if (showError) {
      console.log("SQL__insert error >> ", error);
    }
  }
}

export async function SQL__update(table, data = [], id, conditionalQuery) {
  try {
    if (data.length) {
      let dataSet = [];
      for (let i in data) {
        dataSet.push(data[i].field + " = " + data[i].value);
      }

      let dataSetString = dataSet.join(", ");

      if (id) {
        const update =
          "UPDATE " + table + " SET " + dataSetString + " WHERE id=" + id;
      } else {
        const update =
          "UPDATE " + table + " SET " + dataSetString + " " + conditionalQuery;
      }
      await sqlite.execute(update);
    } else {
      console.dir("Data : ", data);
      console.dir("Data length : ", data.length);
      console.log("No data to update");
    }
  } catch (error) {
    if (showError) {
      console.log("SQL__update error >> ", error);
    }
  }
}

export async function SQL__delete(table, conditionalQuery) {
  try {
    await sqlite.execute("DELETE FROM " + table + " " + conditionalQuery);
  } catch (error) {
    if (showError) {
      console.log("SQL__delete error >> ", error);
    }
  }
}

export async function SQL__truncate(table) {
  try {
    await sqlite.execute("DELETE FROM " + table);
    await sqlite.execute("VACUUM");
  } catch (error) {
    if (showError) {
      console.log("SQL__truncate error >> ", error);
    }
  }
}

export async function SQL__query(query) {
  try {
    const data = await sqlite.execute(query);
    return data;
  } catch (error) {
    if (showError) {
      console.log("SQL__query error >> ", error);
    }
  }
}
