/** @param {NS} ns */

export async function main(ns) {
  
  function all_nodes_from(server, ignore) {
    let nodes = ns.scan(server);
    let to_add = [];
    nodes.forEach(s => {
      if (!(ignore.includes(s))) {
        ignore.push(s);
        to_add.push(s)
        to_add.push(all_nodes_from(s, ignore)[0].flat(Infinity));
      }
    });
    // ns.print(`Node ${server} complete.`);
    return [nodes.concat(to_add).flat(Infinity), ignore];

  }

  ns.print(all_nodes_from("home", []))
}
