"use client";

function normalizeSrc(src) {
  if (!src) return src;
  return src.replace(/^public\//, "/");
}

function isAsset(node) {
  return node && node.type === "asset" && typeof node.src === "string";
}

function asArray(v) {
  return Array.isArray(v) ? v : v ? [v] : [];
}

function AssetImg({ src, alt, pos }) {
  const cls =
    pos === "bottom"
      ? "absolute bottom-0 left-0 w-full h-auto"
      : pos === "fill"
      ? "absolute inset-0 w-full h-full object-cover"
      : "absolute top-0 left-0 w-full h-auto";
  return <img src={normalizeSrc(src)} alt={alt} className={`pointer-events-none select-none ${cls}`} />;
}

function getDevice(devices, name) {
  return (devices || []).find((d) => d.type === "device" && d.name === name);
}

function pathKey(path) {
  return "/" + path.join("/");
}

function labelFor(node) {
  if (!node) return "";
  if (isAsset(node)) return node.alt || node.name || "asset";
  return node.name || node.label || "option";
}

export function buildControlGroups(devices, deviceName, selections = {}) {
  const device = getDevice(devices, deviceName);
  if (!device) return { orGroups: [], andGroups: [] };

  const orGroups = [];
  const andGroups = [];

  function walk(node, path) {
    if (!node) return;
    if (isAsset(node)) return;

    if (node.or) {
      const key = pathKey([...path, "or"]);
      const children = asArray(node.or);
      const options = children.map((child) => labelFor(child));

      if (children.length === 1) {
        // Auto-select the only option and do not expose a control
        const only = children[0];
        const selLabel = labelFor(only);
        walk(only, [...path, "or", `sel:${selLabel}`]);
        return;
      }

      // 2+ options → show control and gate deeper until selected
      if (options.length > 1) {
        // Prefer using a common child type as label; not used in UI currently
        const childTypes = children.map((c) => c && c.type).filter(Boolean);
        const groupLabel = node.label || (childTypes.length && childTypes.every((t) => t === childTypes[0]) ? childTypes[0] : null) || "Option";
        orGroups.push({ key, label: groupLabel, options });
      }
      const sel = selections[key];
      if (!sel) return;
      const selectedChild = children.find((child) => labelFor(child) === sel);
      if (selectedChild) walk(selectedChild, [...path, "or", `sel:${sel}`]);
      return;
    }

    if (node.and) {
      const key = pathKey([...path, "and"]);
      const label = node.name || node.label || "Group";
      const items = asArray(node.and).map((child, idx) => ({ key: pathKey([...path, "and", String(idx)]), label: labelFor(child) }));
      andGroups.push({ key, label, items });
      asArray(node.and).forEach((child, idx) => walk(child, [...path, "and", String(idx)]));
    }

    if (node.multiply) {
      asArray(node.multiply).forEach((child, idx) => walk(child, [...path, "multiply", String(idx)]));
    }
  }

  walk({ ...device, name: device.name }, [device.name]);
  return { orGroups, andGroups };
}

export function collectAssets(devices, deviceName, selections = {}, toggles = {}) {
  const device = getDevice(devices, deviceName);
  if (!device) return { flowTop: [], flowBottom: [], overlays: [] };

  function evalNode(node, path) {
    if (!node) return [];
    if (isAsset(node)) return [{ ...node, src: normalizeSrc(node.src) }];

    if (node.or) {
      const key = pathKey([...path, "or"]);
      const options = asArray(node.or);
      const sel = selections[key];

      if (sel) {
        const selectedChild = options.find((child) => labelFor(child) === sel);
        return selectedChild ? evalNode(selectedChild, [...path, "or", `sel:${sel}`]) : [];
      }

      // Auto-select when only one option exists
      if (options.length === 1) {
        const only = options[0];
        const selLabel = labelFor(only);
        return evalNode(only, [...path, "or", `sel:${selLabel}`]);
      }

      return [];
    }

    if (node.and) {
      return asArray(node.and).flatMap((child, idx) => {
        const childKey = pathKey([...path, "and", String(idx)]);
        if (toggles[childKey] === false) return [];
        return evalNode(child, [...path, "and", String(idx)]);
      });
    }

    if (node.multiply) {
      return asArray(node.multiply).flatMap((child, idx) => evalNode(child, [...path, "multiply", String(idx)]));
    }

    return [];
  }

  const assets = evalNode({ ...device, name: device.name }, [device.name]);
  const flowTop = assets.filter((a) => a.absolute !== true && (a.pos === "top" || !a.pos));
  const flowBottom = assets.filter((a) => a.absolute !== true && a.pos === "bottom");
  const overlays = assets.filter((a) => a.absolute === true);
  return { flowTop, flowBottom, overlays };
}

export function computeDeviceDimensions(devices, deviceName, selections = {}) {
  const device = getDevice(devices, deviceName);
  if (!device) return { w: 1024, h: 768 };
  let dims = device.dimensions ? { w: device.dimensions.width, h: device.dimensions.height } : { w: 1024, h: 768 };
  let selectedOrientation = null;

  function walk(node, path) {
    if (!node) return;
    if (node.dimensions && node.dimensions.width && node.dimensions.height) {
      dims = { w: node.dimensions.width, h: node.dimensions.height };
    }
    if (node.or) {
      const key = pathKey([...path, "or"]);
      const options = asArray(node.or);
      const sel = selections[key];

      if (sel) {
        const selectedChild = options.find((child) => labelFor(child) === sel);
        if (selectedChild) {
          if (selectedChild.type === "orientation") {
            selectedOrientation = (selectedChild.name || "").toLowerCase();
          }
          walk(selectedChild, [...path, "or", `sel:${sel}`]);
        }
        return;
      }

      // Auto-select when single option
      if (options.length === 1) {
        const only = options[0];
        const selLabel = labelFor(only);
        if (only.type === "orientation") {
          selectedOrientation = (only.name || "").toLowerCase();
        }
        walk(only, [...path, "or", `sel:${selLabel}`]);
        return;
      }

      return;
    }
    if (node.and) asArray(node.and).forEach((child, idx) => walk(child, [...path, "and", String(idx)]));
    if (node.multiply) asArray(node.multiply).forEach((child, idx) => walk(child, [...path, "multiply", String(idx)]));
  }

  walk({ ...device, name: device.name }, [device.name]);

  if (selectedOrientation === "landscape") {
    dims = { w: dims.h, h: dims.w };
  }

  return dims;
}

export function DeviceOverlays({ devices, device, selections, toggles }) {
  const dev = getDevice(devices, device);
  if (!dev) return null;
  const { overlays } = collectAssets(devices, device, selections, toggles);
  return (
    <>
      {overlays.map((a, idx) => (
        <AssetImg key={`ov-${idx}`} src={a.src} alt={a.alt} pos={a.pos} />
      ))}
    </>
  );
}
