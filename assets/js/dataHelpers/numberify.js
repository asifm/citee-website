import * as _ from 'lodash';
/**
 * When csv is parsed by d3, the values are all strings.
 * This funcntion converts strings to numbers where appropriate
 *
 * @param {Object[]} data - data array parsed from csv; all data as strings
 * @param {object} varsMetaObj - meta data that identifies the type of each var
 * @return {Object[]} data array with numbers as numbers, not strings
 */
export function numberify(data, varsMetaArr) {
    let type;
    const vars = Object.keys(data[ 0 ]);
    const VarsMetaArrNames = varsMetaArr.map(elem => elem.name);

    // deep clone data so that original data remains untouched
    const clonedData = _.cloneDeep(data);
    // Loop through each element of the data array
    const numberifiedData = clonedData.map(elemData =>
    // Loop through each variable
        vars.reduce((resultObj, currentVar) => {
            if (VarsMetaArrNames.includes(currentVar)) {
                [ type ] = varsMetaArr.find(elem => elem.name === currentVar);
            } else {
                type = 'unknown';
            }

            resultObj[ currentVar ] =
        type === 'number' ? +elemData[ currentVar ] : elemData[ currentVar ];

            return resultObj;
        }, {}));
    return numberifiedData;
}
