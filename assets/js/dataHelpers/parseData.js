import { csv } from 'd3-request';

/**
 * Parses CSV into json (array of objects)
 *
 * @param {string} filepath - Path to the csv file
 * @return {Object} data parsed;
 * each element represents one row of the csv file
 */
export function parseData(filepath) {
  return csv(filepath, data => data);
}
