/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL")

  function removeItemFromList(item,list) {
    // from https://www.freecodecamp.org/news/how-to-remove-an-element-from-a-javascript-array-removing-a-specific-item-in-js/
    return list.slice(0, item).concat(list.slice(item+1));
  }



  function all_nodes() {
    let seen = ["home","darkweb"];
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
    let ram = 64; // $3,520,000
    let purchasedServers = ns.getPurchasedServers();
    let maxServers = ns.getPurchasedServerLimit();
    let serverCost = ns.getPurchasedServerCost(ram);
    if (purchasedServers < maxServers) {
      while ((purchasedServers < maxServers)) {
        if (ns.getServerMoneyAvailable("home") >= serverCost) {
          ns.purchaseServer("purchasedServer",ram);
        }
      }
    }


    seen = removeItemFromList(0,seen); // remove "home" so no one accidentally hacks it
    seen = removeItemFromList(0,seen); // remove "darkweb" because useless
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


  let nodes = all_nodes();
  let serverList = nodes.servers;
  let serverData = nodes.serverData;
  let parentChildren = nodes.parentChildren
  const script = "hackServer.js";
  const test = true;

  for (let i = 0; i <= serverList.length; i++) {
    s = serverList[i];
    targetServer = serverData[s];
    /*
    let checkingParent = s;
    let path = [s];
    while (!(checkingParent in parentChildren)) {
      checkingParent = parentChildren[checkingParent];
      path.push(checkingParent);
    }
    path = path.reverse();
    path.forEach(s => {


    });

    // I don't think this is needed, but in case it is I'm keeping it
    */
    ns.killall(s);
    ns.scp(script,s);
    if (targetServer.rootAccess) {
      exec(script,s,Math.floor((targetServer.maxRam-targetServer.usedRam)/ns.getScriptRam(script)));
    }
    else {
      let numports = targetServer.numPorts
      if (numports > 0) {
        if (ns.fileExists("BruteSSH.exe")) {
          ns.brutessh(s);
        }
        else {
          continue;
        }
      }
      //brute ssh

      if (numports > 1) {
        if (ns.fileExists("FTPCrack.exe")) {
          ns.ftpcrack(s);
        }
        else {
          continue;
        }
      }
      // ftp crack
      
      if (numports > 2) {
        if (ns.fileExists("relaySMTP.exe")) {
          ns.relaysmtp(s);
        }
        else {
          continue;
        }
      }
      // relay smtp

      if (numports > 3) {
        if (ns.fileExists("HTTPWorm.exe")) {
          ns.httpworm(s);
        }
        else {
          continue;
        }
      }
      // http worm

      if (numports > 4) {
        if (ns.fileExists("SQLInject.exe")) {
          ns.sqlinject(s);
        }
        else {
          continue;
        }
      }
      // sql inject


      ns.exec("NUKE.exe",s);
      exec(script,s,Math.floor((targetServer.maxRam-targetServer.usedRam)/ns.getScriptRam(script)));
    }
  }



}
