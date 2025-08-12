"use client";

function normalizeSrc(src) {
  if (!src) return src;
  return src.replace(/^public\//, "/");
}

function isAsset(node) {
  return node && node.type === "asset" && (typeof node.src === "string" || typeof node.src === "object");
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
  if (isAsset(node)) return node.name || "asset";
  return node.name || node.label || "option";
}

function resolveAssetSrc(src, selections) {
  if (!src) return "";
  if (typeof src === "string") return normalizeSrc(src);
  if (typeof src === "object") {
    const theme = (selections && selections.__theme__) || "light";
    const picked = src[theme] || src.light || src.dark;
    return normalizeSrc(picked || "");
  }
  return "";
}

export function buildControlGroups(devices, deviceName, selections = {}) {
  const device = getDevice(devices, deviceName);
  if (!device) return { orGroups: [], andGroups: [] };

  const orGroups = [];
  const andGroups = [];

  function walk(node, path) {
    if (!node) return;
    if (isAsset(node)) return;

    if (node.one) {
      const key = pathKey([...path, "one"]);
      const children = asArray(node.one);
      const options = children.map((child) => labelFor(child));

      if (children.length === 1) {
        const only = children[0];
        const selLabel = labelFor(only);
        walk(only, [...path, "one", `sel:${selLabel}`]);
        return;
      }

      if (options.length > 1) {
        // label not shown in UI, keep for completeness
        const optionsMeta = children.map((child) => {
          const label = labelFor(child);
          return {
            label,
            key: pathKey([...path, "one", `sel:${label}`]),
            localMode: isAsset(child) ? !!child["changableTheme"] : false,
          };
        });
        orGroups.push({ key, label: node.label || "option", options, optionsMeta });
      }
      const sel = selections[key];
      if (!sel) return; // gate deeper until selected
      const selectedChild = children.find((child) => labelFor(child) === sel);
      if (selectedChild) walk(selectedChild, [...path, "one", `sel:${sel}`]);
      return;
    }

    if (node.many) {
      const key = pathKey([...path, "many"]);
      const label = node.name || node.label || "group";
      const children = asArray(node.many);
      const items = children
        .map((child, idx) =>
          isAsset(child)
            ? { key: pathKey([...path, "many", String(idx)]), label: labelFor(child), localMode: !!child["changableTheme"] }
            : null
        )
        .filter(Boolean);
      if (items.length > 0) {
        andGroups.push({ key, label, items });
      }
      children.forEach((child, idx) => walk(child, [...path, "many", String(idx)]));
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
    if (isAsset(node)) {
      const key = pathKey(path);
      const toggleVal = toggles[key];
      if (toggleVal === false) return [];
      const useSel = node["changableTheme"] && (toggleVal === "light" || toggleVal === "dark") ? { ...(selections || {}), __theme__: toggleVal } : selections;
      return [{ ...node, src: resolveAssetSrc(node.src, useSel) }];
    }

    if (node.one) {
      const key = pathKey([...path, "one"]);
      const options = asArray(node.one);
      const sel = selections[key];

      if (sel) {
        const selectedChild = options.find((child) => labelFor(child) === sel);
        return selectedChild ? evalNode(selectedChild, [...path, "one", `sel:${sel}`]) : [];
      }

      if (options.length === 1) {
        const only = options[0];
        const selLabel = labelFor(only);
        return evalNode(only, [...path, "one", `sel:${selLabel}`]);
      }

      return [];
    }

    if (node.many) {
      return asArray(node.many).flatMap((child, idx) => {
        const childKey = pathKey([...path, "many", String(idx)]);
        const toggleVal = toggles[childKey];
        if (toggleVal === false) return [];

        // If direct child is an asset, handle possible changableTheme theme override
        if (isAsset(child)) {
          if (child["changableTheme"]) {
            // toggleVal may be "inherit" | "light" | "dark" | true | undefined
            const localTheme = toggleVal === "light" || toggleVal === "dark" ? toggleVal : undefined;
            const sel = localTheme ? { ...(selections || {}), __theme__: localTheme } : selections;
            return [{ ...child, src: resolveAssetSrc(child.src, sel) }];
          }
          // Non-changableTheme or no override
          return [{ ...child, src: resolveAssetSrc(child.src, selections) }];
        }

        return evalNode(child, [...path, "many", String(idx)]);
      });
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
  let selectedOrientation = null; // track selected orientation name

  function walk(node, path) {
    if (!node) return;
    if (node.dimensions && node.dimensions.width && node.dimensions.height) {
      dims = { w: node.dimensions.width, h: node.dimensions.height };
    }
    if (node.one) {
      const key = pathKey([...path, "one"]);
      const options = asArray(node.one);
      const sel = selections[key];

      if (sel) {
        const selectedChild = options.find((child) => labelFor(child) === sel);
        if (selectedChild) {
          if (selectedChild.type === "orientation") {
            selectedOrientation = (selectedChild.name || "").toLowerCase();
          }
          walk(selectedChild, [...path, "one", `sel:${sel}`]);
        }
        return;
      }

      if (options.length === 1) {
        const only = options[0];
        const selLabel = labelFor(only);
        if (only.type === "orientation") {
          selectedOrientation = (only.name || "").toLowerCase();
        }
        walk(only, [...path, "one", `sel:${selLabel}`]);
        return;
      }

      return;
    }
    if (node.many) asArray(node.many).forEach((child, idx) => walk(child, [...path, "many", String(idx)]));
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
        <AssetImg key={`ov-${idx}`} src={a.src} alt={a.name} pos={a.pos} />
      ))}
    </>
  );
}
