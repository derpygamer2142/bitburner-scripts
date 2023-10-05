/** @param {NS} ns */
export async function main(ns) {

  function all_nodes_from(server, ignore) {
    if (!(ignore.includes(server))) {

      let nodes = ns.scan(server);
      nodes = nodes.filter((s) => !(ignore.includes(s)));
      let to_add = [];


      nodes.forEach(s => {



        ignore.push(s);
        to_add.push(s);
        let e = all_nodes_from(s, ignore);

        if (!(e == undefined)) {

          to_add.push(e[0].flat(Infinity));
          ignore.push(e[1].flat(Infinity));
        }
          

      });


      // ns.print(`Node ${server} complete.`);
      return [nodes.concat(to_add).flat(Infinity), ignore];
    }
  }

  ns.print(all_nodes_from("home", []));
}
