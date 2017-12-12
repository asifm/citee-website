export function separatePosNeg(dataArr, currentVars) {
  const vars = Object.values(currentVars);

  const positive = dataArr.filter(elemData =>
    // elemdata is positive for each variable
    vars.reduce(
      (sum, elemVarCurrent) => sum + (elemData[elemVarCurrent] > 0),
      0,
    ) === vars.length);

  const negativeZero = dataArr.filter(elemData =>
    // one or more negative or zero value
    vars.reduce(
      (sum, elemVarCurrent) => sum + (elemData[elemVarCurrent] <= 0),
      0,
    ) > 0);
  return [positive, negativeZero];
}
