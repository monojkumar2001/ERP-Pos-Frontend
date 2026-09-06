"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DASHBOARD_NAV } from "../../data/dashboard/nav";

function Icon({ name, className = "text-[18px]" }) {
  return <span className={`material-icons ${className}`}>{name}</span>;
}

function NavNode({ node, depth = 0, openMap, toggle, pathname }) {
  const hasChildren = Boolean(node.children?.length);
  const isOpen = openMap[node.id];
  const isActive =
    node.href &&
    (pathname === node.href || (node.href !== "/en/dashboard" && pathname.startsWith(node.href)));
  const childActive =
    hasChildren &&
    node.children.some(
      (c) =>
        (c.href && pathname.startsWith(c.href)) ||
        c.children?.some((x) => x.href && pathname.startsWith(x.href))
    );

  useEffect(() => {
    if (childActive && !openMap[node.id]) {
      toggle(node.id, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const pad = 12 + depth * 14;

  if (hasChildren) {
    return (
      <li>
        <button
          type="button"
          onClick={() => toggle(node.id)}
          className={`flex w-full items-center gap-2 py-2.5 pr-3 text-left text-[13px] text-white/95 transition hover:bg-white/10 ${
            childActive || isOpen ? "bg-white/10" : ""
          }`}
          style={{ paddingLeft: pad }}
        >
          {node.icon ? <Icon name={node.icon} /> : <span className="w-[18px]" />}
          <span className="flex-1 truncate">{node.label}</span>
          <Icon
            name={isOpen ? "expand_more" : "chevron_right"}
            className="text-[16px] opacity-80"
          />
        </button>
        {isOpen && (
          <ul className="m-0 list-none p-0">
            {node.children.map((child) => (
              <NavNode
                key={child.id}
                node={child}
                depth={depth + 1}
                openMap={openMap}
                toggle={toggle}
                pathname={pathname}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={node.href || "#"}
        className={`relative flex items-center gap-2 py-2.5 pr-3 text-[13px] text-white/95 transition hover:bg-white/10 ${
          isActive ? "bg-white/20" : ""
        }`}
        style={{ paddingLeft: pad }}
      >
        {isActive && (
          <span className="absolute bottom-1 left-0 top-1 w-[3px] rounded-r bg-white" />
        )}
        {node.icon ? <Icon name={node.icon} /> : depth > 0 ? null : <span className="w-[18px]" />}
        <span className="flex-1 truncate">{node.label}</span>
        {node.badge != null && (
          <span className="rounded bg-white/20 px-1.5 text-[11px]">{node.badge}</span>
        )}
      </Link>
    </li>
  );
}

export default function Sidebar({ collapsed, onToggleCollapse }) {
  const pathname = usePathname();
  const [openMap, setOpenMap] = useState(() => {
    const initial = { dashboard: true };
    const mark = (nodes) => {
      for (const n of nodes) {
        if (n.children?.length) {
          const hit = n.children.some(
            (c) =>
              (c.href && pathname?.startsWith(c.href)) ||
              c.children?.some((x) => x.href && pathname?.startsWith(x.href))
          );
          if (hit || n.children.some((c) => c.children)) {
            // open ancestors when a deep child matches
            const deepHit = (node) =>
              (node.href && pathname?.startsWith(node.href)) ||
              node.children?.some(deepHit);
            if (deepHit(n)) initial[n.id] = true;
            mark(n.children);
          }
        }
      }
    };
    mark(DASHBOARD_NAV);
    return initial;
  });

  const toggle = (id, force) => {
    setOpenMap((prev) => ({
      ...prev,
      [id]: typeof force === "boolean" ? force : !prev[id],
    }));
  };

  const items = useMemo(() => DASHBOARD_NAV, []);

  return (
    <aside
      className={`fixed bottom-0 left-0 top-0 z-40 flex flex-col text-white transition-all duration-200 ${
        collapsed ? "w-[64px]" : "w-[256px]"
      }`}
      style={{ backgroundColor: "#2980b9" }}
    >
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-white/15 px-3">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="rounded p-1 hover:bg-white/10"
          aria-label="Toggle sidebar"
        >
          <Icon name="menu" />
        </button>
        {!collapsed && (
          <Link href="/en/dashboard" className="text-[18px] font-semibold tracking-wide text-white">
            Biznify
          </Link>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto pb-6 pt-1">
        <ul className="m-0 list-none p-0">
          {items.map((node) =>
            collapsed ? (
              <li key={node.id}>
                <Link
                  href={node.href || node.children?.[0]?.href || "/en/dashboard"}
                  className="flex justify-center py-3 hover:bg-white/10"
                  title={node.label}
                >
                  <Icon name={node.icon || "folder"} />
                </Link>
              </li>
            ) : (
              <NavNode
                key={node.id}
                node={node}
                openMap={openMap}
                toggle={toggle}
                pathname={pathname}
              />
            )
          )}
        </ul>
      </nav>
    </aside>
  );
}
