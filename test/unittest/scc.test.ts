import { describe, expect, test } from "bun:test";
import { SCCGraph } from "@/scc";

describe("SCCTest", () => {
	test("Empty", () => {
		const graph0 = new SCCGraph();
		expect(graph0.scc()).toEqual([]);
		const graph1 = new SCCGraph(0);
		expect(graph1.scc()).toEqual([]);
	});

	test("Assign", () => {
		let graph = new SCCGraph();
		graph = new SCCGraph(10);
	});

	test("Simple", () => {
		const graph = new SCCGraph(2);
		graph.add_edge(0, 1);
		graph.add_edge(1, 0);
		const scc = graph.scc();
		expect(scc.length).toEqual(1);
	});

	test("SelfLoop", () => {
		const graph = new SCCGraph(2);
		graph.add_edge(0, 0);
		graph.add_edge(0, 0);
		graph.add_edge(1, 1);
		const scc = graph.scc();
		expect(scc.length).toEqual(2);
	});

	test("Invalid", () => {
		const graph = new SCCGraph(10);
		expect(() => graph.add_edge(0, 10)).toThrowError();
	});
});
