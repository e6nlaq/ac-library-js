import { describe, expect, test } from "bun:test";
import { SccGraph } from "@/scc";

describe("SccTest", () => {
	test("Empty", () => {
		const graph0 = new SccGraph();
		expect(graph0.scc()).toEqual([]);
		const graph1 = new SccGraph(0);
		expect(graph1.scc()).toEqual([]);
	});

	test("Assign", () => {
		let graph = new SccGraph();
		graph = new SccGraph(10);
	});

	test("Simple", () => {
		const graph = new SccGraph(2);
		graph.add_edge(0, 1);
		graph.add_edge(1, 0);
		const scc = graph.scc();
		expect(scc.length).toEqual(1);
	});

	test("SelfLoop", () => {
		const graph = new SccGraph(2);
		graph.add_edge(0, 0);
		graph.add_edge(0, 0);
		graph.add_edge(1, 1);
		const scc = graph.scc();
		expect(scc.length).toEqual(2);
	});

	test("Invalid", () => {
		const graph = new SccGraph(10);
		expect(() => graph.add_edge(0, 10)).toThrowError();
	});
});
