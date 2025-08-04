"use client";;
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  closestCorners,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { useComposedRefs } from "@/lib/compose-refs";
import { cn } from "@/lib/utils";
import * as ReactDOM from "react-dom";

const orientationConfig = {
  vertical: {
    modifiers: [restrictToVerticalAxis, restrictToParentElement],
    strategy: verticalListSortingStrategy,
    collisionDetection: closestCenter,
  },
  horizontal: {
    modifiers: [restrictToHorizontalAxis, restrictToParentElement],
    strategy: horizontalListSortingStrategy,
    collisionDetection: closestCenter,
  },
  mixed: {
    modifiers: [restrictToParentElement],
    strategy: undefined,
    collisionDetection: closestCorners,
  },
};

const ROOT_NAME = "Sortable";
const CONTENT_NAME = "SortableContent";
const ITEM_NAME = "SortableItem";
const ITEM_HANDLE_NAME = "SortableItemHandle";
const OVERLAY_NAME = "SortableOverlay";

const SortableRootContext =
  React.createContext(null);
SortableRootContext.displayName = ROOT_NAME;

function useSortableContext(consumerName) {
  const context = React.useContext(SortableRootContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``);
  }
  return context;
}

function SortableRoot(props) {
  const {
    value,
    onValueChange,
    collisionDetection,
    modifiers,
    strategy,
    onMove,
    orientation = "vertical",
    flatCursor = false,
    getItemValue: getItemValueProp,
    accessibility,
    ...sortableProps
  } = props;

  const id = React.useId();
  const [activeId, setActiveId] = React.useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const config = React.useMemo(() => orientationConfig[orientation], [orientation]);

  const getItemValue = React.useCallback(item => {
    if (typeof item === "object" && !getItemValueProp) {
      throw new Error("getItemValue is required when using array of objects");
    }
    return getItemValueProp
      ? getItemValueProp(item)
      : (item);
  }, [getItemValueProp]);

  const items = React.useMemo(() => {
    return value.map((item) => getItemValue(item));
  }, [value, getItemValue]);

  const onDragStart = React.useCallback((event) => {
    sortableProps.onDragStart?.(event);

    if (event.activatorEvent.defaultPrevented) return;

    setActiveId(event.active.id);
  }, [sortableProps.onDragStart]);

  const onDragEnd = React.useCallback((event) => {
    sortableProps.onDragEnd?.(event);

    if (event.activatorEvent.defaultPrevented) return;

    const { active, over } = event;
    if (over && active.id !== over?.id) {
      const activeIndex = value.findIndex((item) => getItemValue(item) === active.id);
      const overIndex = value.findIndex((item) => getItemValue(item) === over.id);

      if (onMove) {
        onMove({ ...event, activeIndex, overIndex });
      } else {
        onValueChange?.(arrayMove(value, activeIndex, overIndex));
      }
    }
    setActiveId(null);
  }, [value, onValueChange, onMove, getItemValue, sortableProps.onDragEnd]);

  const onDragCancel = React.useCallback((event) => {
    sortableProps.onDragCancel?.(event);

    if (event.activatorEvent.defaultPrevented) return;

    setActiveId(null);
  }, [sortableProps.onDragCancel]);

  const announcements = React.useMemo(() => ({
    onDragStart({ active }) {
      const activeValue = active.id.toString();
      return `Grabbed sortable item "${activeValue}". Current position is ${active.data.current?.sortable.index + 1} of ${value.length}. Use arrow keys to move, space to drop.`;
    },
    onDragOver({ active, over }) {
      if (over) {
        const overIndex = over.data.current?.sortable.index ?? 0;
        const activeIndex = active.data.current?.sortable.index ?? 0;
        const moveDirection = overIndex > activeIndex ? "down" : "up";
        const activeValue = active.id.toString();
        return `Sortable item "${activeValue}" moved ${moveDirection} to position ${overIndex + 1} of ${value.length}.`;
      }
      return "Sortable item is no longer over a droppable area. Press escape to cancel.";
    },
    onDragEnd({ active, over }) {
      const activeValue = active.id.toString();
      if (over) {
        const overIndex = over.data.current?.sortable.index ?? 0;
        return `Sortable item "${activeValue}" dropped at position ${overIndex + 1} of ${value.length}.`;
      }
      return `Sortable item "${activeValue}" dropped. No changes were made.`;
    },
    onDragCancel({ active }) {
      const activeIndex = active.data.current?.sortable.index ?? 0;
      const activeValue = active.id.toString();
      return `Sorting cancelled. Sortable item "${activeValue}" returned to position ${activeIndex + 1} of ${value.length}.`;
    },
    onDragMove({ active, over }) {
      if (over) {
        const overIndex = over.data.current?.sortable.index ?? 0;
        const activeIndex = active.data.current?.sortable.index ?? 0;
        const moveDirection = overIndex > activeIndex ? "down" : "up";
        const activeValue = active.id.toString();
        return `Sortable item "${activeValue}" is moving ${moveDirection} to position ${overIndex + 1} of ${value.length}.`;
      }
      return "Sortable item is no longer over a droppable area. Press escape to cancel.";
    },
  }), [value]);

  const screenReaderInstructions = React.useMemo(() => ({
    draggable: `
      To pick up a sortable item, press space or enter.
      While dragging, use the ${orientation === "vertical" ? "up and down" : orientation === "horizontal" ? "left and right" : "arrow"} keys to move the item.
      Press space or enter again to drop the item in its new position, or press escape to cancel.
    `,
  }), [orientation]);

  const contextValue = React.useMemo(() => ({
    id,
    items,
    modifiers: modifiers ?? config.modifiers,
    strategy: strategy ?? config.strategy,
    activeId,
    setActiveId,
    getItemValue,
    flatCursor,
  }), [
    id,
    items,
    modifiers,
    strategy,
    config.modifiers,
    config.strategy,
    activeId,
    getItemValue,
    flatCursor,
  ]);

  return (
    <SortableRootContext.Provider value={contextValue}>
      <DndContext
        collisionDetection={collisionDetection ?? config.collisionDetection}
        modifiers={modifiers ?? config.modifiers}
        sensors={sensors}
        {...sortableProps}
        id={id}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
        accessibility={{
          announcements,
          screenReaderInstructions,
          ...accessibility,
        }} />
    </SortableRootContext.Provider>
  );
}

const SortableContentContext = React.createContext(false);
SortableContentContext.displayName = CONTENT_NAME;

const SortableContent = React.forwardRef((props, forwardedRef) => {
  const {
    strategy: strategyProp,
    asChild,
    withoutSlot,
    children,
    ...contentProps
  } = props;

  const context = useSortableContext(CONTENT_NAME);

  const ContentPrimitive = asChild ? Slot : "div";

  return (
    <SortableContentContext.Provider value={true}>
      <SortableContext items={context.items} strategy={strategyProp ?? context.strategy}>
        {withoutSlot ? (
          children
        ) : (
          <ContentPrimitive data-slot="sortable-content" {...contentProps} ref={forwardedRef}>
            {children}
          </ContentPrimitive>
        )}
      </SortableContext>
    </SortableContentContext.Provider>
  );
});
SortableContent.displayName = CONTENT_NAME;

const SortableItemContext =
  React.createContext(null);
SortableItemContext.displayName = ITEM_NAME;

function useSortableItemContext(consumerName) {
  const context = React.useContext(SortableItemContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ITEM_NAME}\``);
  }
  return context;
}

const SortableItem = React.forwardRef((props, forwardedRef) => {
  const {
    value,
    style,
    asHandle,
    asChild,
    disabled,
    className,
    ...itemProps
  } = props;

  const inSortableContent = React.useContext(SortableContentContext);
  const inSortableOverlay = React.useContext(SortableOverlayContext);

  if (!inSortableContent && !inSortableOverlay) {
    throw new Error(
      `\`${ITEM_NAME}\` must be used within \`${CONTENT_NAME}\` or \`${OVERLAY_NAME}\``
    );
  }

  if (value === "") {
    throw new Error(`\`${ITEM_NAME}\` value cannot be an empty string`);
  }

  const context = useSortableContext(ITEM_NAME);
  const id = React.useId();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: value, disabled });

  const composedRef = useComposedRefs(forwardedRef, (node) => {
    if (disabled) return;
    setNodeRef(node);
    if (asHandle) setActivatorNodeRef(node);
  });

  const composedStyle = React.useMemo(() => {
    return {
      transform: CSS.Translate.toString(transform),
      transition,
      ...style,
    };
  }, [transform, transition, style]);

  const itemContext = React.useMemo(() => ({
    id,
    attributes,
    listeners,
    setActivatorNodeRef,
    isDragging,
    disabled,
  }), [id, attributes, listeners, setActivatorNodeRef, isDragging, disabled]);

  const ItemPrimitive = asChild ? Slot : "div";

  return (
    <SortableItemContext.Provider value={itemContext}>
      <ItemPrimitive
        id={id}
        data-disabled={disabled}
        data-dragging={isDragging ? "" : undefined}
        data-slot="sortable-item"
        {...itemProps}
        {...(asHandle && !disabled ? attributes : {})}
        {...(asHandle && !disabled ? listeners : {})}
        ref={composedRef}
        style={composedStyle}
        className={cn(
          "focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
          {
            "touch-none select-none": asHandle,
            "cursor-default": context.flatCursor,
            "data-dragging:cursor-grabbing": !context.flatCursor,
            "cursor-grab": !isDragging && asHandle && !context.flatCursor,
            "opacity-50": isDragging,
            "pointer-events-none opacity-50": disabled,
          },
          className
        )} />
    </SortableItemContext.Provider>
  );
});
SortableItem.displayName = ITEM_NAME;

const SortableItemHandle = React.forwardRef((props, forwardedRef) => {
  const { asChild, disabled, className, ...itemHandleProps } = props;

  const context = useSortableContext(ITEM_HANDLE_NAME);
  const itemContext = useSortableItemContext(ITEM_HANDLE_NAME);

  const isDisabled = disabled ?? itemContext.disabled;

  const composedRef = useComposedRefs(forwardedRef, (node) => {
    if (!isDisabled) return;
    itemContext.setActivatorNodeRef(node);
  });

  const HandlePrimitive = asChild ? Slot : "button";

  return (
    <HandlePrimitive
      type="button"
      aria-controls={itemContext.id}
      data-disabled={isDisabled}
      data-dragging={itemContext.isDragging ? "" : undefined}
      data-slot="sortable-item-handle"
      {...itemHandleProps}
      {...(isDisabled ? {} : itemContext.attributes)}
      {...(isDisabled ? {} : itemContext.listeners)}
      ref={composedRef}
      className={cn(
        "select-none disabled:pointer-events-none disabled:opacity-50",
        context.flatCursor
          ? "cursor-default"
          : "cursor-grab data-dragging:cursor-grabbing",
        className
      )}
      disabled={isDisabled} />
  );
});
SortableItemHandle.displayName = ITEM_HANDLE_NAME;

const SortableOverlayContext = React.createContext(false);
SortableOverlayContext.displayName = OVERLAY_NAME;

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

function SortableOverlay(props) {
  const { container: containerProp, children, ...overlayProps } = props;

  const context = useSortableContext(OVERLAY_NAME);

  const [mounted, setMounted] = React.useState(false);
  React.useLayoutEffect(() => setMounted(true), []);

  const container =
    containerProp ?? (mounted ? globalThis.document?.body : null);

  if (!container) return null;

  return ReactDOM.createPortal(<DragOverlay
    dropAnimation={dropAnimation}
    modifiers={context.modifiers}
    className={cn(!context.flatCursor && "cursor-grabbing")}
    {...overlayProps}>
    <SortableOverlayContext.Provider value={true}>
      {context.activeId
        ? typeof children === "function"
          ? children({ value: context.activeId })
          : children
        : null}
    </SortableOverlayContext.Provider>
  </DragOverlay>, container);
}

export {
  SortableRoot as Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
  //
  SortableRoot as Root,
  SortableContent as Content,
  SortableItem as Item,
  SortableItemHandle as ItemHandle,
  SortableOverlay as Overlay,
};
