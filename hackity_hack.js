/** @param {NS} ns */
export async function main(ns) {
    // note: this is a slightly modified version of the example script. it assumes the server has been hacked, and this file is referred to as first.js in this repo.
    const target = ns.args[0];
    ns.print(`Target: ${target}`)

    const moneyThresh = ns.getServerMaxMoney(target);


    const securityThresh = ns.getServerMinSecurityLevel(target);



    while(true) {
      let serverMoney = ns.getServerMoneyAvailable(target);
      let serverSecurity = ns.getServerSecurityLevel(target);
      
      ns.print(`Money: ${serverMoney}/${moneyThresh}\nSecurity: ${serverSecurity}/${securityThresh}`);
      
        if (serverSecurity > securityThresh) {
            // If the server's security level is above our threshold, weaken it
            await ns.weaken(target);
            ns.print("Weakening...");
        } else if (serverMoney < moneyThresh) {
            // If the server's money is less than our threshold, grow it
            await ns.grow(target,{stock:true});
            ns.print("Growing...");
        } else {
            // Otherwise, hack it
            await ns.hack(target);
            ns.print("Hacking...");
        }
        await ns.sleep(500);
    }
}
