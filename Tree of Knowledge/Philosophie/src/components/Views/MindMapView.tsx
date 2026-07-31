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
  fullName: string;
  era: string;
  color: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

export default function MindMapView({ philosophers }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const select = useTreeStore((s) => s.select);
  const search = useTreeStore((s) => s.search);

  const nodeSelRef = useRef<d3.Selection<any, Node, any, unknown> | null>(null);
  const linkSelRef = useRef<d3.Selection<any, Link, any, unknown> | null>(null);
  const relatedMapRef = useRef<Map<string, Set<string>>>(new Map());
  const hoveredIdRef = useRef<string | null>(null);

  // Wendet die aktuelle Such-Filterung als "Dauer-Hervorhebung" an, sofern nicht gerade gehovert wird
  const applySearchDim = () => {
    const node = nodeSelRef.current;
    const link = linkSelRef.current;
    if (!node || !link) return;
    const query = search.trim().toLowerCase();
    if (!query) {
      node.style("opacity", 1);
      link.style("opacity", 0.35).attr("stroke-width", 1.2);
      return;
    }
    node.style("opacity", (n) => (n.name.toLowerCase().includes(query) || n.id.toLowerCase().includes(query) ? 1 : 0.08));
    link.style("opacity", 0.08).attr("stroke-width", 1.2);
  };

  useEffect(() => {
    if (!ref.current) return;
    const width = 1000;
    const height = 600;

    const nodes: Node[] = philosophers.map((p) => ({
      id: p.id,
      name: p.shortName,
      fullName: p.name,
      era: p.era,
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
      .attr("aria-hidden", "true")
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
      .attr("role", "button")
      .attr("tabindex", 0)
      .attr("aria-label", (d) => `${d.fullName}, ${d.era}`)
      .on("click", (_evt, d) => select(d.id))
      .on("keydown", (evt, d) => {
        if (evt.key === "Enter" || evt.key === " ") {
          evt.preventDefault();
          select(d.id);
        }
      })
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
      .attr("font-family", "monospace")
      .attr("stroke", "#03050A")
      .attr("stroke-width", 3)
      .attr("paint-order", "stroke")
      .style("pointer-events", "none");

    // Verbundene Knoten pro ID vorab ermitteln (für Hover-Hervorhebung)
    const relatedMap = new Map<string, Set<string>>();
    nodes.forEach((n) => relatedMap.set(n.id, new Set([n.id])));
    links.forEach((l) => {
      const s = typeof l.source === "string" ? l.source : l.source.id;
      const t = typeof l.target === "string" ? l.target : l.target.id;
      relatedMap.get(s)?.add(t);
      relatedMap.get(t)?.add(s);
    });
    relatedMapRef.current = relatedMap;
    nodeSelRef.current = node;
    linkSelRef.current = link;

    node
      .style("transition", "opacity 0.2s ease")
      .on("mouseenter", (_evt, d) => {
        hoveredIdRef.current = d.id;
        const related = relatedMap.get(d.id)!;
        node.style("opacity", (n) => (related.has(n.id) ? 1 : 0.12));
        link
          .style("opacity", (l: any) => {
            const s = typeof l.source === "string" ? l.source : l.source.id;
            const t = typeof l.target === "string" ? l.target : l.target.id;
            return related.has(s) && related.has(t) ? 0.9 : 0.04;
          })
          .attr("stroke-width", (l: any) => {
            const s = typeof l.source === "string" ? l.source : l.source.id;
            const t = typeof l.target === "string" ? l.target : l.target.id;
            return related.has(s) && related.has(t) ? 2 : 1.2;
          });
      })
      .on("mouseleave", () => {
        hoveredIdRef.current = null;
        applySearchDim();
      });
    link.style("transition", "opacity 0.2s ease");
    applySearchDim();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [philosophers, select]);

  // Suchbegriff ändert sich: Hervorhebung aktualisieren, ohne die Simulation neu zu starten
  useEffect(() => {
    if (!hoveredIdRef.current) applySearchDim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const query = search.trim().toLowerCase();
  const hasMatches =
    !query || philosophers.some((p) => p.shortName.toLowerCase().includes(query) || p.name.toLowerCase().includes(query));

  return (
    <div className="relative w-full h-full">
      <svg ref={ref} viewBox="0 0 1000 600" className="w-full h-full" role="group" aria-label="Einfluss-Netzwerk der Philosophen, jeder Knoten ist auswählbar" />
      {!hasMatches && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
          <div className="text-center animate-fade-in">
            <p className="font-display italic text-h3 text-muted mb-1">Keine Treffer</p>
            <p className="text-meta text-muted/70">
              Niemand im Netzwerk trägt „{search.trim()}" im Namen.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
