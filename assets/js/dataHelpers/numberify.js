import * as _ from 'lodash';
/**
 * When csv is parsed by d3, the values are all strings.
 * This funcntion converts strings to numbers where appropriate
 *
 * @param {Object[]} data - data array parsed from csv; all data as strings
 * @param {object} varsMetaObj - meta data that identifies the type of each var
 * @return {Object[]} data array with numbers as numbers, not strings
 */
export function numberify(data, varsMetaObj) {
  // array of var name
  const vars = Object.keys(varsMetaObj);
  // of those vars, the subset of number-type vars
  const numberVars = vars.filter(elem => varsMetaObj[elem].type === 'number');

  // deep clone data so that original data remains untouched
  const clonedData = _.cloneDeep(data);
  // Loop through each element of the data array
  const numberifiedData = clonedData.map((elemData) => {
    // Loop through each variable
    vars.map((elemVar) => {
      // Check if var is of number type
      elemData[elemVar] = numberVars.includes(elemVar)
        ? +elemData[elemVar]
        : elemData[elemVar];
      return elemData;
    });
    return elemData;
  });
  return numberifiedData;
}
