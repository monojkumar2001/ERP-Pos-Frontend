"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { ITEM_CATEGORIES } from "../../data/dashboard/itemCategories";

function countChildren(node) {
  return node.children?.length || 0;
}

function filterTree(nodes, q) {
  if (!q) return nodes;
  const lower = q.toLowerCase();
  const walk = (list) =>
    list
      .map((n) => {
        const kids = walk(n.children || []);
        const match = n.name.toLowerCase().includes(lower);
        if (match || kids.length) return { ...n, children: match ? n.children || [] : kids };
        return null;
      })
      .filter(Boolean);
  return walk(nodes);
}

function CategoryModal({ open, title, initial, parentOptions, onClose, onSave }) {
  const [parent, setParent] = useState(initial?.parent || "Root");
  const [name, setName] = useState(initial?.name || "");
  const [position, setPosition] = useState(initial?.position ?? parentOptions.length + 1);

  useEffect(() => {
    if (!open) return;
    setParent(initial?.parent || "Root");
    setName(initial?.name || "");
    setPosition(initial?.position ?? parentOptions.length + 1);
  }, [open, initial, parentOptions.length]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-[820px] overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 className="m-0 text-[18px] font-semibold text-[#1a557a]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <span className="material-icons text-[20px]">close</span>
          </button>
        </div>

        <div className="grid gap-5 px-5 py-5 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#1a557a]">
                Parent Category <span className="text-red-500">*</span>
              </label>
              <input
                value={parent}
                onChange={(e) => setParent(e.target.value)}
                list="category-parent-options"
                placeholder="Parent Category"
                className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#2980b9]"
              />
              <datalist id="category-parent-options">
                <option value="Root" />
                {parentOptions.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#1a557a]">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category Name"
                className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#2980b9]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#1a557a]">
                Category Position <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Reverse Factor"
                className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#2980b9]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#1a557a]">
              Category Image
            </label>
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#9ec4e0] bg-[#f3f9fc] px-4 py-6 text-center">
              <span className="material-icons mb-2 text-[36px] text-[#2980b9]">cloud_upload</span>
              <p className="m-0 text-[13px] text-slate-600">Drag and drop file here</p>
              <p className="my-2 text-[12px] text-slate-400">or</p>
              <button
                type="button"
                className="rounded bg-[#2980b9] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#2472a4]"
              >
                Upload Photo
              </button>
              <p className="mt-3 mb-0 text-[11px] leading-relaxed text-slate-500">
                Maximum file size 2MB
                <br />
                Supported Formates: JPG, JPEG, PNG &amp; ICO
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-full border border-[#2980b9] bg-white px-5 text-[13px] font-medium text-[#2980b9] hover:bg-[#f0f7fb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (!name.trim()) return;
              onSave({ parent, name: name.trim(), position: Number(position) || 1 });
            }}
            className="h-9 rounded-full bg-[#2980b9] px-5 text-[13px] font-medium text-white hover:bg-[#2472a4]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionMenu({ node, open, onClose, onAction, anchorRef }) {
  const menuRef = useRef(null);
  const hasChildren = countChildren(node) > 0;
  const hasDiscount = Boolean(node.discount);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (
        menuRef.current?.contains(e.target) ||
        anchorRef?.current?.contains(e.target)
      )
        return;
      onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const items = [
    { key: "add-under", label: `Add Category under ${node.name}` },
    { key: "edit", label: `Edit ${node.name}` },
    { key: "move", label: `Move ${node.name}` },
    { key: "inactive", label: "Make Inactive" },
    { key: "add-discount", label: "Add Discount" },
    { key: "remove-discount", label: "Remove Discount", disabled: !hasDiscount },
    { key: "delete", label: `Delete ${node.name}`, disabled: hasChildren },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute right-10 top-1/2 z-30 min-w-[220px] -translate-y-1/2 rounded-md border border-slate-200 bg-white py-1 shadow-lg"
    >
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          disabled={item.disabled}
          onClick={() => {
            if (item.disabled) return;
            onAction(item.key, node);
            onClose();
          }}
          className={`block w-full px-4 py-2 text-left text-[13px] ${
            item.disabled
              ? "cursor-not-allowed text-slate-300"
              : "text-[#1a557a] hover:bg-[#f0f7fb]"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function CategoryRow({ node, depth, index, openIds, toggle, menuId, setMenuId, onAction }) {
  const childCount = countChildren(node);
  const expanded = openIds[node.id];
  const btnRef = useRef(null);
  const zebra = index % 2 === 1;

  return (
    <>
      <div
        className={`relative flex items-center border-b border-[#e8eef3] ${
          zebra ? "bg-[#f7fbfe]" : "bg-white"
        }`}
        style={{ paddingLeft: 8 + depth * 20 }}
      >
        <div className="flex w-12 shrink-0 items-center justify-center self-stretch bg-[#eef3f7] text-[13px] font-medium text-slate-500">
          {index}
        </div>
        <button
          type="button"
          onClick={() => childCount > 0 && toggle(node.id)}
          className={`flex min-w-0 flex-1 items-center gap-2 px-3 py-3 text-left text-[14px] font-semibold text-[#1a557a] ${
            childCount ? "cursor-pointer" : "cursor-default"
          }`}
        >
          <span className="truncate">{node.name}</span>
        </button>
        <div className="flex items-center gap-1 pr-2">
          {childCount > 0 && (
            <button
              type="button"
              onClick={() => toggle(node.id)}
              className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[13px] text-[#1a557a] hover:bg-slate-100"
            >
              <span>({childCount})</span>
              <span className="material-icons text-[18px]">
                {expanded ? "expand_more" : "chevron_right"}
              </span>
            </button>
          )}
          <div className="relative">
            <button
              ref={btnRef}
              type="button"
              onClick={() => setMenuId(menuId === node.id ? null : node.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
              aria-label="Actions"
            >
              <span className="material-icons text-[18px]">more_vert</span>
            </button>
            <ActionMenu
              node={node}
              open={menuId === node.id}
              anchorRef={btnRef}
              onClose={() => setMenuId(null)}
              onAction={onAction}
            />
          </div>
        </div>
      </div>
      {expanded &&
        (node.children || []).map((child, i) => (
          <CategoryRow
            key={child.id}
            node={child}
            depth={depth + 1}
            index={i + 1}
            openIds={openIds}
            toggle={toggle}
            menuId={menuId}
            setMenuId={setMenuId}
            onAction={onAction}
          />
        ))}
    </>
  );
}

function flattenParentNames(nodes, acc = []) {
  nodes.forEach((n) => {
    acc.push(n.name);
    if (n.children?.length) flattenParentNames(n.children, acc);
  });
  return acc;
}

export default function ItemCategoriesPage() {
  const [categories, setCategories] = useState(ITEM_CATEGORIES);
  const [search, setSearch] = useState("");
  const [openIds, setOpenIds] = useState(() => {
    const init = {};
    ITEM_CATEGORIES.forEach((c) => {
      if (c.children?.length) init[c.id] = true;
    });
    return init;
  });
  const [menuId, setMenuId] = useState(null);
  const [modal, setModal] = useState(null); // { mode, node?, parentName? }

  const filtered = useMemo(() => filterTree(categories, search.trim()), [categories, search]);
  const parentOptions = useMemo(() => flattenParentNames(categories), [categories]);

  const toggle = (id) =>
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));

  const onAction = (key, node) => {
    if (key === "add-under") {
      setModal({ mode: "add", parentName: node.name, under: node });
    } else if (key === "edit") {
      setModal({
        mode: "edit",
        node,
        parentName: "Root",
        name: node.name,
      });
    } else if (key === "inactive") {
      setCategories((prev) => markInactive(prev, node.id));
    } else if (key === "delete") {
      setCategories((prev) => removeNode(prev, node.id));
    } else if (key === "add-discount") {
      setCategories((prev) => setDiscount(prev, node.id, true));
    } else if (key === "remove-discount") {
      setCategories((prev) => setDiscount(prev, node.id, false));
    } else if (key === "move") {
      setModal({ mode: "move", node });
    }
  };

  const onSave = (data) => {
    if (modal?.mode === "edit" && modal.node) {
      setCategories((prev) => renameNode(prev, modal.node.id, data.name));
    } else {
      const id = `${data.name.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/gi, "-")}-${Date.now()}`;
      const newNode = { id, name: data.name, children: [] };
      if (!data.parent || data.parent === "Root") {
        setCategories((prev) => [...prev, newNode]);
      } else {
        setCategories((prev) => addUnder(prev, data.parent, newNode));
      }
    }
    setModal(null);
  };

  return (
    <div className="text-[#1a557a]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 flex items-center gap-2 text-[22px] font-semibold text-[#1a557a]">
          All Categories
          <button type="button" className="text-[#2980b9]" aria-label="Help">
            <i className="far fa-question-circle text-[16px]" />
          </button>
        </h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="h-9 w-56 rounded-full border border-slate-200 py-1 pl-4 pr-9 text-[13px] outline-none focus:border-[#2980b9]"
            />
            <span className="material-icons absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
              search
            </span>
          </div>
          <button
            type="button"
            onClick={() => setModal({ mode: "add", parentName: "Root" })}
            className="inline-flex h-9 items-center rounded-full border border-[#2980b9] bg-white px-4 text-[13px] font-medium text-[#2980b9] hover:bg-[#2980b9] hover:text-white"
          >
            Add New
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded border border-[#e5e7eb] bg-white">
        {filtered.map((node, i) => (
          <CategoryRow
            key={node.id}
            node={node}
            depth={0}
            index={i + 1}
            openIds={openIds}
            toggle={toggle}
            menuId={menuId}
            setMenuId={setMenuId}
            onAction={onAction}
          />
        ))}
        {!filtered.length && (
          <div className="px-4 py-10 text-center text-slate-400">No categories found</div>
        )}
      </div>

      <CategoryModal
        open={Boolean(modal) && modal.mode !== "move"}
        title={modal?.mode === "edit" ? "Update Category" : "Add Category"}
        initial={
          modal
            ? {
                parent: modal.parentName || "Root",
                name: modal.name || "",
                position: categories.length + 1,
              }
            : null
        }
        parentOptions={parentOptions}
        onClose={() => setModal(null)}
        onSave={onSave}
      />

      {modal?.mode === "move" && (
        <CategoryModal
          open
          title={`Move ${modal.node.name}`}
          initial={{ parent: "Root", name: modal.node.name, position: 1 }}
          parentOptions={parentOptions.filter((p) => p !== modal.node.name)}
          onClose={() => setModal(null)}
          onSave={(data) => {
            setCategories((prev) => moveNode(prev, modal.node.id, data.parent));
            setModal(null);
          }}
        />
      )}
    </div>
  );
}

function renameNode(nodes, id, name) {
  return nodes.map((n) =>
    n.id === id
      ? { ...n, name }
      : { ...n, children: renameNode(n.children || [], id, name) }
  );
}

function removeNode(nodes, id) {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => ({ ...n, children: removeNode(n.children || [], id) }));
}

function addUnder(nodes, parentName, newNode) {
  return nodes.map((n) => {
    if (n.name === parentName) {
      return { ...n, children: [...(n.children || []), newNode] };
    }
    return { ...n, children: addUnder(n.children || [], parentName, newNode) };
  });
}

function setDiscount(nodes, id, value) {
  return nodes.map((n) =>
    n.id === id
      ? { ...n, discount: value }
      : { ...n, children: setDiscount(n.children || [], id, value) }
  );
}

function markInactive(nodes, id) {
  return nodes.map((n) =>
    n.id === id
      ? { ...n, inactive: true }
      : { ...n, children: markInactive(n.children || [], id) }
  );
}

function findAndTake(nodes, id) {
  let taken = null;
  const rest = nodes
    .map((n) => {
      if (n.id === id) {
        taken = n;
        return null;
      }
      const res = findAndTake(n.children || [], id);
      if (res.taken) taken = res.taken;
      return { ...n, children: res.rest };
    })
    .filter(Boolean);
  return { taken, rest };
}

function moveNode(nodes, id, parentName) {
  const { taken, rest } = findAndTake(nodes, id);
  if (!taken) return nodes;
  if (!parentName || parentName === "Root") return [...rest, taken];
  return addUnder(rest, parentName, taken);
}
