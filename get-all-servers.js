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
      seen.push(unseen[i]);
      unseen = removeItemFromList(i,unseen);
      i -= 1;
    }

    seen = removeItemFromList(0,seen);
    let servers = {};

    seen.forEach(s => {
      servers[s] = {};
      servers[s].rootAccess = ns.hasRootAccess(s);
      servers[s].availableMoney = ns.getServerMoneyAvailable(s);
      servers[s].maxMoney = ns.getServerMaxMoney(s);
      servers[s].securityLevel = ns.getServerSecurityLevel(s);
      servers[s].minSecurityLevel = ns.getServerMinSecurityLevel(s);
      servers[s].minHackLevel = ns.getServerRequiredHackingLevel(s);
      servers[s].numPorts = ns.getServerNumPortsRequired(s);
      servers[s].maxRam = ns.getServerMaxRam(s);
      servers[s].usedRam = ns.getServerUsedRam(s);
      servers[s].files = ns.ls(s);
      servers[s].processes = ns.ps(s);
    });


    let toReturn = {};
    toReturn.servers = seen;
    toReturn.serverData = servers;
    return toReturn
  }

  /* example usage
  ns.print(`Servers: ${all_nodes().servers.join(", ")}\nN00dle's data: ${all_nodes().serverData.n00dles.maxRam}`);
  */

}
