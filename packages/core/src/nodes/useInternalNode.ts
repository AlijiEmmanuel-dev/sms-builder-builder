import { useContext, useMemo } from "react";
import { NodeContext, NodeProvider } from "./NodeContext";
import { Node, NodeRefEvent } from "../interfaces";
import { useManager } from "../connectors";


type internalActions = NodeProvider & {
  _inNodeContext: boolean,
  actions : {
    setProp: (cb: any) => void,
    setDOM: (dom: HTMLElement) => void,
    setNodeEvent: Function
  }
}

type useInternalNode<S = null> = S extends null ? internalActions : S & internalActions;
export function useInternalNode() : useInternalNode
export function useInternalNode<S = null>(collect?: (node: Node) => S): useInternalNode<S>
export function useInternalNode<S = null>(collect?: (node: Node) => S): useInternalNode<S> {
  const context = useContext(NodeContext);
  if (!context) {
    return {
      ...{} as any,
      id: null,
      related: false,
      _inNodeContext: false,
      actions: {}
    }
  }
  
  const { id, related } = context;
  
  const { actions: managerActions, query, ...collected } = collect ? useManager((state) => id && state.nodes[id] && collect(state.nodes[id])) : useManager();
  const actions = useMemo(() => {
    return {
      setProp: (cb: any) => managerActions.setProp(id, cb),
      setDOM: (dom: HTMLElement) => {
        return managerActions.setDOM(id, dom);
      },
        setNodeEvent: (action: keyof NodeRefEvent) => managerActions.setNodeEvent(action, id)
    }
  }, []);

  return {
    id,
    related,
    ...collected as any,
    _inNodeContext: true,
     actions 
  }
}

