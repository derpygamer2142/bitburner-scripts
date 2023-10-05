/** @param {NS} ns */
export async function main(ns) {

  function all_nodes() {
    let ignore = ["home"];
    let to_check = [];
    let servers = [];
    let s = ""
    let i = 0
    to_check = ns.scan("home");


    while (i <= to_check.length) {
      s = to_check[i];
      if (!(ignore.includes(s))) {
        servers.push(s);
        ignore.push(s);
        to_check = to_check.concat(ns.scan(s));
        to_check = to_check.filter(e => !(ignore.includes(e)));
        ns.print(ignore)
      }
      else {
        ns.print(`${s} is ignored`)
      }
      i++
    }

    return servers;
  }

  ns.print(all_nodes());



}
