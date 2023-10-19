/** @param {NS} ns */
export async function main(ns) {
  let ram = 64; // 64 = $3,520,000, 16 = $880000 1024 = 56,320,000, 8192 = 450560000, 1048576 = 57.6 billion(max ram)
  // note the cost is ram * 55000 (afaik)
  let purchasedServers = ns.getPurchasedServers();
  ns.print(`Current servers: ${purchasedServers}`)
  let maxServers = ns.getPurchasedServerLimit(); // ns.getPurchasedServerLimit()
  let serverCost = ns.getPurchasedServerCost(ram);
  
  if (purchasedServers.length < maxServers) {
    while ((purchasedServers.length < maxServers)) {
      if (ns.getServerMoneyAvailable("home") >= serverCost) {
        await ns.purchaseServer("purchasedServer",ram);
        purchasedServers = ns.getPurchasedServers();
        ns.print(`Purchased server ${ns.getPurchasedServers().length}`);
      }
      else {
        ns.print("Not enough money to buy a server")
      }
      await ns.sleep(2000);
    }
  }
}
