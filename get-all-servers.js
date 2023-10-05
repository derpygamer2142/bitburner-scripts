/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL")

  function removeItemFromList(item,list) {
    // from https://www.freecodecamp.org/news/how-to-remove-an-element-from-a-javascript-array-removing-a-specific-item-in-js/
    return list.slice(0, item).concat(list.slice(item+1));
  }



  function all_nodes() {
    let seen = ["home"];
    let unseen = ns.scan("home");
    let parentChild = {};
    let newServers = []; // not sure if i can define this in the for loop, not taking chances

    for (let i = 0; i < unseen.length; i++) {
      newServers = ns.scan(unseen[i]) // get the servers to check
      unseen = unseen.concat(newServers).filter((s) => !(seen.includes(s))).flat(Infinity); // filter out the servers that have been seen, add it to the unseen list, flatten it
      newServers = newServers.filter((s) => seen.includes(s)) // servers that are children of i
      
      // this code shouldn't work, yet it does. When I do it correctly it doesn't work.
      newServers.forEach(serv => {
        parentChild[unseen[i]] = {}; // set up the server's json
        parentChild[unseen[i]].parent = serv // identify the parents and children
      });
      

      seen.push(unseen[i]); // add the current item to the list of seen servers
      unseen = removeItemFromList(i,unseen); // remove it from the list
      i -= 1; // adjust accordingly
    }

    seen = removeItemFromList(0,seen); // remove "home" so no one accidentally hacks it
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
      servers[s].parent = parentChild[s].parent;
    }); // thicc


    let toReturn = {};
    toReturn.servers = seen;
    toReturn.serverData = servers;
    toReturn.parentChildren = parentChild;
    return toReturn;
  }



  // example usage
  ns.print(`Servers: ${all_nodes().servers.join(", ")}`);
  // output is way too long to put here, but it should output a long list of servers that only has each server once.
  ns.print(`n00dles' ram is ${all_nodes().serverData.n00dles.maxRam}`)
  // output: "n00dles' ram is 4.0"
  ns.print(`zer0's parent server is ${all_nodes().parentChildren.zer0.parent}`); // there's two ways to access this; this way, and the below way
  ns.print(`zer0's parent server is ${all_nodes().serverData.zer0.parent}`)
  // both of the above output: "zer0's parent server is sigma-cosmetics"



}
