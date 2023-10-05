export async function main(ns) {
  
  function all_nodes_from(server,ignore) {
    let nodes = ns.scan(server);
    let to_add = [];
    nodes.forEach(s => {
      if (!(ignore.includes(s))) {
        ignore.push(s);
        to_add.push(s)
        let e = all_nodes_from(s,ignore)
        to_add.push(e[0].flat(Infinity));
        ignore.push(e[1].flat(Infinity))
      }
    });
    // ns.print(`Node ${server} complete.`);
    return [nodes.concat(to_add).flat(Infinity),ignore];

  }

  ns.print(all_nodes_from("home",[]))
}
