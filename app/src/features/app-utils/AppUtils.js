function numberConversion(labelValue) {
  if (labelValue === undefined) {
    const labelValue = " "
    return labelValue;
  }
  // Nine Zeroes for Billions
  return Number(labelValue) >= 1.0e9
    ? (Number(labelValue) / 1.0e9).toFixed(1) + "B"
    : // Six Zeroes for Millions
    Number(labelValue) >= 1.0e6
      ? Math.round((Number(labelValue) / 1.0e6)) + "M"
      : // Three Zeroes for Thousands
      Number(labelValue) >= 1.0e3
        ? Math.round(Number(labelValue) / 1.0e3) + "K"
        : Math.round(Number(labelValue));
}

function downloadDataFormatConversion(initialFormat, title) {
  const formatConversion = () => {
    let finalFormat = [];
    for (let index in initialFormat[Object.keys(initialFormat)[0]]) {
      let finalObj = {};
      for (const [key, value] of Object.entries(initialFormat)) {
        finalObj[key] = value[index];
      }
      finalFormat.push(finalObj);
    }
    return finalFormat;
  }

  const boxplotFormatConversion = () => {
    const workingData = [...initialFormat];
    const labels = workingData.shift();

    const x = workingData.map(dataArray => {
      return dataArray.reduce((acc, value, ci) => {
        return { ...acc, [labels[ci]]: value }
      }, {})
    })
    return x;
  }

  switch (title) {
    case 'Mix':
    case 'Wt. Average Leadtime Distribution by Priority Subcategory':
    case 'Wt. Average Leadtime Distribution by Sales Region':
    case 'Wt. Average Leadtime Distribution by Brand':
      return initialFormat;
    default: return formatConversion();
  }
}
export { numberConversion, downloadDataFormatConversion }