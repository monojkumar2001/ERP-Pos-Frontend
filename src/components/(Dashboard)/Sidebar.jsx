"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DASHBOARD_NAV } from "../../data/dashboard/nav";

function Icon({ name, className = "text-[18px]" }) {
  return <span className={`material-icons ${className}`}>{name}</span>;
}

function pathMatches(href, pathname) {
  if (!href || !pathname) return false;
  if (pathname === href) return true;
  if (href === "/en/dashboard") return false;
  return pathname.startsWith(href);
}

function nodeContainsPath(node, pathname) {
  if (pathMatches(node.href, pathname)) return true;
  return Boolean(node.children?.some((child) => nodeContainsPath(child, pathname)));
}

/** Open only the ancestry chain for the active route (accordion-friendly). */
function openChainForPath(nodes, pathname, acc = {}) {
  for (const node of nodes) {
    if (!node.children?.length) continue;
    if (nodeContainsPath(node, pathname)) {
      acc[node.id] = true;
      openChainForPath(node.children, pathname, acc);
    }
  }
  return acc;
}

function NavNode({
  node,
  depth = 0,
  openMap,
  onToggle,
  siblingIds,
  pathname,
}) {
  const hasChildren = Boolean(node.children?.length);
  const isOpen = Boolean(openMap[node.id]);
  const isActive = pathMatches(node.href, pathname);
  const childActive = hasChildren && nodeContainsPath(node, pathname);
  const pad = 12 + depth * 28;
  const childIds = useMemo(
    () => (hasChildren ? node.children.filter((c) => c.children?.length).map((c) => c.id) : []),
    [hasChildren, node.children]
  );

  if (hasChildren) {
    return (
      <li>
        <button
          type="button"
          onClick={() => onToggle(node.id, siblingIds)}
          className={`flex w-full items-center gap-2 py-2.5 pr-3 text-left text-[16px] text-white/95 transition-colors hover:bg-white/10 ${
            childActive || isOpen ? "bg-white/10" : ""
          }`}
          style={{ paddingLeft: pad }}
          aria-expanded={isOpen}
        >
          {node.icon ? <Icon name={node.icon} /> : <span className="w-[18px]" />}
          <span className="flex-1 truncate">{node.label}</span>
          <Icon
            name="expand_more"
            className={`text-[16px] opacity-80 transition-transform duration-300 ease-out ${
              isOpen ? "rotate-0" : "-rotate-90"
            }`}
          />
        </button>

        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="m-0 list-none p-0">
              {node.children.map((child) => (
                <NavNode
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  openMap={openMap}
                  onToggle={onToggle}
                  siblingIds={childIds}
                  pathname={pathname}
                />
              ))}
            </ul>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={node.href || "#"}
        className={`relative flex items-center gap-2 py-2.5 pr-3 text-[16px] text-white/95 transition-colors hover:bg-white/10 ${
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
  const items = useMemo(() => DASHBOARD_NAV, []);
  const rootSiblingIds = useMemo(
    () => items.filter((n) => n.children?.length).map((n) => n.id),
    [items]
  );

  const [openMap, setOpenMap] = useState(() => openChainForPath(DASHBOARD_NAV, pathname));

  // Keep only the active route's parent chain open when navigating
  useEffect(() => {
    setOpenMap(openChainForPath(DASHBOARD_NAV, pathname));
  }, [pathname]);

  const onToggle = (id, siblingIds = []) => {
    setOpenMap((prev) => {
      const willOpen = !prev[id];
      const next = { ...prev };

      // Accordion: close siblings at the same level
      for (const sib of siblingIds) {
        if (sib !== id) next[sib] = false;
      }

      next[id] = willOpen;
      return next;
    });
  };

  return (
    <aside
      className={`fixed bottom-0 left-0 top-0 z-40 flex flex-col text-white transition-all duration-200 ${
        collapsed ? "w-[64px]" : "w-[256px]"
      }`}
      style={{ backgroundColor: "#00a78b" }}
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
                onToggle={onToggle}
                siblingIds={rootSiblingIds}
                pathname={pathname}
              />
            )
          )}
        </ul>
      </nav>
    </aside>
  );
}
