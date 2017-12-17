// Gets rid of the "metro area" part at the
// end of the metro names

export function shortenMetroName(metroName) {
  return metroName.substr(0, metroName.length - 11);
}
