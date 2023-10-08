/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog("ALL")
  await ns.sleep(5000)
  /*
  let ram = 16; // 64 = $3,520,000, 16 = $880000
  let purchasedServers = ns.getPurchasedServers();
  let maxServers = ns.getPurchasedServerLimit();
  let serverCost = ns.getPurchasedServerCost(ram);
  
  if (purchasedServers < maxServers) {
    while ((purchasedServers < maxServers)) {
      if (ns.getServerMoneyAvailable("home") >= serverCost) {
        await ns.purchaseServer("purchasedServer",ram);
        ns.print(`Purchased server ${ns.getPurchasedServers().length}`)
      }
      else {
        ns.print("Not enough money to buy a server")
      }
      await ns.sleep(2000);
    }
  }
  */

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


    seen = removeItemFromList(0,seen); // remove "home" so no one accidentally hacks it
    seen = removeItemFromList(0,seen); // remove "darkweb" because useless
    let servers = {};

    seen.forEach(s => {
      ns.killall(s);
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
      servers[s].name = s;
    }); // thicc


    let toReturn = {};
    toReturn.servers = seen;
    toReturn.serverData = servers;
    toReturn.parentChildren = parentChild;
    return toReturn;
  }
  function getKeyByValue(object, value) {
  // from https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
  return Object.keys(object).find(key => object[key] === value);
  }

  










  //await ns.sleep(4500);
  ns.print("init");
  let nodes = await all_nodes();
  let serverList = nodes.servers;
  let serverData = nodes.serverData;
  let serverDataCopy = serverData;
  let hackFiles = ["NUKE.exe","BruteSSH.exe","FTPCrack.exe","relaySMTP.exe","HTTPWorm.exe","SQLInject.exe"]
  //ns.print(JSON.stringify(serverDataCopy))
  let target = Object.values(serverDataCopy).filter((obj)=> obj.minHackLevel <= Math.ceil(ns.getHackingLevel()/2)).filter((s) => (ns.fileExists(hackFiles[s.numPorts]))).reduce((high,curr) => high.maxMoney > curr.maxMoney? high : curr).name
  ns.print(`Target: ${target}`)







  let parentChildren = nodes.parentChildren
  const script = "first.js";
  let maxServersRunning = Infinity;
  
  ns.print(`Got all nodes. Servers to run: ${serverList.length}`);
  await ns.sleep(5000);

  let ram = 16; // 64 = $3,520,000, 16 = $880000
  let purchasedServers = ns.getPurchasedServers();
  let maxServers = ns.getPurchasedServerLimit();
  let serverCost = ns.getPurchasedServerCost(ram);
  
  if (purchasedServers < maxServers) {
    while ((purchasedServers < maxServers)) {
      if (ns.getServerMoneyAvailable("home") >= serverCost) {
        await ns.purchaseServer("purchasedServer",ram);
        ns.print(`Purchased server ${ns.getPurchasedServers().length}`)
        purchasedServers = ns.getPurchasedServers()
      }
      else {
        ns.print("Not enough money to buy a server")
      }
      await ns.sleep(2000);
    }
  }

  purchasedServers.forEach((s) => {
    ns.killall(s);
    ns.scp(script,s);
    let threads = Math.floor((ns.getServerMaxRam(s)-ns.getServerUsedRam(s))/ns.getScriptRam(script));
    ns.exec(script,s,threads,target);
  });

  for (let i = 0; i < serverList.length; i++) {
    if (maxServersRunning)
    if (i > maxServersRunning) {
      ns.print(`Reached max server limit at ${i}`);
      break;
    }
    let s = serverList[i];
    let targetServer = serverData[s];
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



    await ns.killall(s);
    await ns.scp(script,s);
    let threads = Math.floor((targetServer.maxRam-targetServer.usedRam)/ns.getScriptRam(script));
    if (!targetServer.rootAccess) {
      let numports = targetServer.numPorts

      if (numports > 0) {
        if (ns.fileExists("BruteSSH.exe")) {
          await ns.brutessh(s);
        }
        else {
          ns.print("Skipping BruteSSH");
          maxServersRunning += 1;
          continue;
          
        }
      }
      //brute ssh

      if (numports > 1) {
        if (ns.fileExists("FTPCrack.exe")) {
          await ns.ftpcrack(s);
        }
        else {
          ns.print("Skipping FTPCrack");
          maxServersRunning += 1;
          continue;
        }
      }
      // ftp crack
      
      if (numports > 2) {
        if (ns.fileExists("relaySMTP.exe")) {
          await ns.relaysmtp(s);
        }
        else {
          ns.print("Skipping relaySMTP");
          maxServersRunning += 1;
          continue;
        }
      }
      // relay smtp

      if (numports > 3) {
        if (ns.fileExists("HTTPWorm.exe")) {
          await ns.httpworm(s);
        }
        else {
          ns.print("Skipping HTTPWorm");
          maxServersRunning += 1;
          continue;
        }
      }
      // http worm

      if (numports > 4) {
        if (ns.fileExists("SQLInject.exe")) {
          await ns.sqlinject(s);
        }
        else {
          ns.print("Skipping SQLInject");
          maxServersRunning += 1;
          continue;
        }
      }
      // sql inject


      await ns.nuke(s);
    }
    if (targetServer.maxRam > 2 && ns.hasRootAccess(s)) {
      if (threads > 0 && targetServer.maxRam > 2) {
        try {
        ns.print(`Threads: ${threads} on server ${s} #${i}`)
        ns.exec(script,s,threads,target);
        }
        catch (error){
          ns.print(`Threw an error on server ${s}: ${error}`);
          maxServersRunning += 1;
        }
      }
    }
    else {
      maxServersRunning += 1;
    }
    ns.print(`Cracked server ${s}, server #${i}`);
    await ns.sleep(1000);
  }



}
