"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { Philosopher } from "@/types";
import { useTreeStore } from "@/stores/treeStore";

interface Props {
  philosophers: (Philosopher & { influences: string[] })[];
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  color: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

export default function MindMapView({ philosophers }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const select = useTreeStore((s) => s.select);

  useEffect(() => {
    if (!ref.current) return;
    const width = 1000;
    const height = 600;

    const nodes: Node[] = philosophers.map((p) => ({
      id: p.id,
      name: p.shortName,
      color: p.color,
    }));

    const links: Link[] = philosophers.flatMap((p) =>
      p.influences.map((toId) => ({ source: p.id, target: toId }))
    );

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(links)
          .id((d) => d.id)
          .distance(70)
      )
      .force("charge", d3.forceManyBody().strength(-140))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(24));

    const link = svg
      .append("g")
      .attr("stroke", "#C8E1FF")
      .attr("stroke-opacity", 0.35)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.2)
      .attr("marker-end", "url(#arrow)");

    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#C8E1FF");

    const node = svg
      .append("g")
      .selectAll<SVGGElement, Node>("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .on("click", (_evt, d) => select(d.id))
      .call(
        d3
          .drag<SVGGElement, Node>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    node
      .append("circle")
      .attr("r", 9)
      .attr("fill", (d) => d.color)
      .style("filter", (d) => `drop-shadow(0 0 8px ${d.color})`);

    node
      .append("text")
      .text((d) => d.name)
      .attr("x", 12)
      .attr("y", 4)
      .attr("fill", "#9FC3E8")
      .attr("font-size", 10)
      .attr("font-family", "monospace");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as Node).x!)
        .attr("y1", (d) => (d.source as Node).y!)
        .attr("x2", (d) => (d.target as Node).x!)
        .attr("y2", (d) => (d.target as Node).y!);

      node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [philosophers, select]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 1000 600"
      className="w-full h-full"
    />
  );
}
