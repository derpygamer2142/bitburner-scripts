/** @param {NS} ns */
export async function main(ns) {
  function removeItemFromList(item,list) {
    // from https://www.freecodecamp.org/news/how-to-remove-an-element-from-a-javascript-array-removing-a-specific-item-in-js/
    return list.slice(0, item).concat(list.slice(item+1));
  }



  function all_nodes() {
    let seen = ["home"];
    let unseen = ns.scan("home");
    for (let i = 0; i < unseen.length; i++) {
      unseen = unseen.concat(ns.scan(unseen[i])).filter((s) => !(seen.includes(s))).flat(Infinity);
      seen.push(unseen[i])
      unseen = removeItemFromList(i,unseen);
      i -= 1;
    }
    return seen;
  }

}
