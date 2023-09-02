
const XLSX = require("xlsx");

const downloadAndConvertToExcel = async (data) => {
  try {
    if (data) {

      var myWorkSheet = await XLSX.utils.json_to_sheet(data);
      var myWorkBook = XLSX.utils.book_new();
      await XLSX.utils.book_append_sheet(myWorkBook, myWorkSheet, "myWorkSheet");
      await XLSX.write(myWorkBook, { bookType: 'xlsx', type: "buffer" });
      await XLSX.write(myWorkBook, { bookType: 'xlsx', type: "binary" });
      await XLSX.writeFile(myWorkBook, "data.xlsx");
      return true

    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = downloadAndConvertToExcel;