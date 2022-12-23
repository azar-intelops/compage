import ReactDOM from "react-dom";
import {
    ConnectorPlacement,
    ConnectorPlacementType,
    ContextMenuRenderCallbacks,
    DiagramMaker,
    DiagramMakerAction,
    DiagramMakerActions,
    DiagramMakerData,
    DiagramMakerEdge,
    DiagramMakerNode,
    DiagramMakerPotentialNode,
    Event,
    Shape,
    ShapeType,
    WorkspaceActions
} from "diagram-maker";

import {CopyToClipboard} from 'react-copy-to-clipboard';
import "diagram-maker/dist/diagramMaker.css";
import "./scss/common.css"
import "./scss/CircularNode.css"
import "./scss/RectangularNode.css"
import "./scss/Logger.css"

import React, {useRef} from "react";
import {
    createCircularNode,
    createPluginPanel,
    createRectangularConnectorNode,
    createRectangularNode
} from "../../utils/utils";

import {useBeforeunload} from 'react-beforeunload';
import {Action, Dispatch} from "redux";
import {Grid} from "@mui/material";
import {
    getCurrentConfig,
    getCurrentState,
    setCurrentConfig,
    setCurrentState,
    setReset,
    shouldReset
} from "../../utils/service";
import {ToolPanel} from "../custom/tool-panel";
import {LibraryPanel} from "../custom/library-panel";
import {ContextNode} from "../custom/context-node";
import {ContextEdge} from "../custom/context-edge";
import {ContextPanel} from "../custom/context-panel";
import {ContextWorkspace} from "../custom/context-workspace";
import {EdgeBadge} from "../custom/edge-badge";
import {PotentialNode} from "../custom/potential-node";
import {getNodeTypeConfig} from "./helper/node-type-ui";
import {NewEdgeProperties} from "../new-properties/new-edge-properties";
import {NewNodeProperties} from "../new-properties/new-node-properties";
import {cleanse} from "./helper/helper";
import JSONPretty from "react-json-pretty";
import GenerateProject from "../generate-project";
import Button from "@mui/material/Button";

interface ArgTypes {
    resetState?: (...args: any) => void;
    initialData?: DiagramMakerData<{}, {}>;
    connectorPlacement?: ConnectorPlacementType;
    showArrowhead?: boolean;
    shape?: ShapeType;
    edgeBadge?: boolean;
    darkTheme?: boolean;
    actionInterceptor?: boolean;
    plugin?: boolean;
    onAction?: (...args: any) => void;
}

export const DiagramMakerContainer = ({
                                          initialData,
                                          connectorPlacement,
                                          showArrowhead,
                                          shape,
                                          edgeBadge,
                                          darkTheme,
                                          actionInterceptor,
                                          plugin,
                                          onAction,
                                          resetState,
                                      }: ArgTypes) => {
    const containerRef = useRef() as any;
    const diagramMakerRef = useRef() as any;
    const [diagramMaker, setDiagramMaker] = React.useState({
        state: "{}",
        copied: false,
        config: "{}"
    });

    const [dialogState, setDialogState] = React.useState({
        isOpen: false,
        id: "",
        type: "",
    });

    const handleDialogClose = () => {
        setDialogState({isOpen: false, id: "", type: ""})
        setData(diagramMaker.state, false)
    };

    const showDialog = () => {
        if (dialogState.isOpen) {
            if (dialogState.type === 'node') {
                return <NewNodeProperties isOpen={dialogState.isOpen}
                                          nodeId={dialogState.id}
                                          onClose={handleDialogClose}/>
            } else if (dialogState.type === 'edge') {
                return <NewEdgeProperties isOpen={dialogState.isOpen}
                                          edgeId={dialogState.id}
                                          onClose={handleDialogClose}/>
            }
        }
        return "";
    }

    if (darkTheme) {
        document.body.classList.add('dm-dark-theme');
    } else {
        document.body.classList.remove('dm-dark-theme');
    }

    useBeforeunload((event) => {
        if (shouldReset()) {
            if ((diagramMaker.state !== "{}" && diagramMaker.state !== getCurrentState()) || (diagramMaker.config !== "{}" && diagramMaker.config !== getCurrentConfig())) {
                setCurrentState(diagramMaker.state)
                setCurrentConfig(diagramMaker.config)
                event.preventDefault();
            }
        } else {
            setReset(false)
        }
    });

    const setData = (state: string, updateConfig = true) => {
        const backupState: string = state.slice();
        if (state) {
            const stateJson = cleanse(state);
            if (updateConfig) {
                setDiagramMaker({
                    copied: false,
                    config: backupState,
                    state: JSON.stringify(stateJson)
                })
            } else {
                setDiagramMaker({
                    ...diagramMaker,
                    copied: false,
                    state: JSON.stringify(stateJson)
                })
            }
        }
    }

    React.useEffect(() => {
        // let shape, connectorPlacement, showArrowhead, plugin, edgeBadge
        let plugin, connectorPlacement
        // let initialData = BoundaryRectangularData
        // let connectorPlacement = ConnectorPlacementType.BOUNDARY
        let showArrowhead = true
        let shape = Shape.CIRCLE
        let edgeBadge = true
        let actionInterceptor = true
        // let onAction: {
        //     action: 'action',
        // }

        diagramMakerRef.current = new DiagramMaker(containerRef.current, {
            options: {
                connectorPlacement: connectorPlacement || ConnectorPlacement.LEFT_RIGHT,
                showArrowhead: showArrowhead || false,
            },
            renderCallbacks: {
                destroy: (container) => {
                    ReactDOM.unmountComponentAtNode(container);
                },
                node: (node: DiagramMakerNode<{}>, container: HTMLElement) => {
                    // not required as its now handled in css files.
                    // container.setAttribute("style", "border: 1px solid black");
                    if (node.typeId === 'node-type-circle') {
                        // return ReactDOM.render(<CircularNode
                        //     node={node}
                        // />, container);
                        return createCircularNode(node, container, () => {
                            setDialogState({isOpen: true, id: node.id, type: "node"})
                        });
                    }
                    // if (node.typeId === 'node-type-input') {
                    //     return createNodeWithInput(node, container);
                    // }
                    // if (node.typeId === 'node-type-dropdown') {
                    //     return createNodeWithDropdown(node, container);
                    // }
                    if (connectorPlacement === ConnectorPlacement.BOUNDARY) {
                        if (shape === Shape.CIRCLE) {
                            return createCircularNode(node, container, () => {
                                    setDialogState({isOpen: true, id: node.id, type: "node"})
                                }
                            );
                        }
                        return createRectangularConnectorNode(node, container, () => {
                            setDialogState({isOpen: true, id: node.id, type: "node"})
                        });
                    }
                    return createRectangularNode(node, container, () => {
                        setDialogState({isOpen: true, id: node.id, type: "node"})
                    });
                },
                edge: edgeBadge ? (edge: DiagramMakerEdge<{}>, container: HTMLElement) => {
                    return ReactDOM.render(<EdgeBadge id={edge.id} handleDblClick={() => {
                        setDialogState({isOpen: true, id: edge.id, type: "edge"})
                    }}/>, container);
                } : undefined,
                potentialNode: (node: DiagramMakerPotentialNode, container: HTMLElement) => {
                    return ReactDOM.render(<PotentialNode typeId={node?.typeId}/>, container);
                },
                panels: {
                    library: (panel: any, state: any, container: HTMLElement) => {
                        return ReactDOM.render(<LibraryPanel/>, container);
                    },
                    ...(plugin && {
                        plugin: (
                            panel: any,
                            state: any,
                            container: HTMLElement,
                        ) => createPluginPanel(container, state),
                    }),
                    ...(!plugin && {
                        tools: (
                            panel: any,
                            state: any,
                            container: HTMLElement,
                        ) => {
                            return ReactDOM.render(<ToolPanel
                                diagramMakerRef={() => diagramMakerRef.current}/>, container);
                        },
                    }),
                },
                //This is the place to identify which element has been clicked
                contextMenu: {
                    node: (id: string | undefined, container: HTMLElement) => {
                        return ReactDOM.render(<ContextNode id={id}/>, container);
                    },
                    edge: (id: string | undefined, container: HTMLElement) => {
                        return ReactDOM.render(<ContextEdge id={id}/>, container);
                    },
                    panel: (id: string | undefined, container: HTMLElement) => {
                        return ReactDOM.render(<ContextPanel id={id}/>, container);
                    },
                    workspace: (container: HTMLElement) => {
                        return ReactDOM.render(<ContextWorkspace/>, container);
                    },
                } as ContextMenuRenderCallbacks,
            },
            actionInterceptor: (action: Action, next: Dispatch<Action>, getState: () => DiagramMakerData<{}, {}>) => {
                // onAction(action);
                if (actionInterceptor) {
                    const diagramMakerAction = action as DiagramMakerAction<{ odd: boolean }, {}>;
                    // if ("payload" in diagramMakerAction) {
                    //     console.log("++++++++++++++++++++++++++")
                    //     console.log("action : ", diagramMakerAction?.payload)
                    //     console.log("++++++++++++++++++++++++++")
                    // }

                    // We aren't showing the action details in logger anymore. Keeping for future reference
                    // updateActionInLogger(action);
                    if (diagramMakerAction.type === DiagramMakerActions.DELETE_ITEMS
                        && "payload" in diagramMakerAction
                        && "nodeIds" in diagramMakerAction.payload) {
                        // stops from deleting nodes
                        // return;
                        let message;
                        let result;
                        if (diagramMakerAction.payload.nodeIds.length > 0 && diagramMakerAction.payload.edgeIds.length > 0) {
                            message = "Are you sure you want to delete the node(s) : [" + diagramMakerAction.payload.nodeIds + "] and edge(s) : [" + diagramMakerAction.payload.edgeIds + "]";
                            result = "Deleting node(s) : [" + diagramMakerAction.payload.nodeIds + "] and edge(s) : [" + diagramMakerAction.payload.edgeIds + "]"
                        } else if (diagramMakerAction.payload.nodeIds.length > 0) {
                            message = "Are you sure you want to delete the node(s) : [" + diagramMakerAction.payload.nodeIds + "]";
                            result = "Deleting node(s) : [" + diagramMakerAction.payload.nodeIds + "]"
                        } else if (diagramMakerAction.payload.edgeIds.length > 0) {
                            message = "Are you sure you want to delete the edge(s) : [" + diagramMakerAction.payload.edgeIds + "]";
                            result = "Deleting edge(s) : [" + diagramMakerAction.payload.edgeIds + "]"
                        }
                        if (diagramMakerAction.payload.nodeIds.length > 0 || diagramMakerAction.payload.edgeIds.length > 0) {
                            if (!window.confirm(message)) {
                                return;
                            }
                        }
                        console.log(result)
                    }
                    if (diagramMakerAction.type === DiagramMakerActions.NODE_SELECT && "payload" in diagramMakerAction) {
                        // console.log("Select node action : ", diagramMakerAction.payload)
                        // if return, state won't be updated
                        // return;
                    }

                    if (diagramMakerAction.type === DiagramMakerActions.NODE_CREATE
                        && "payload" in diagramMakerAction) {
                        if (diagramMakerAction.payload["typeId"] === "node-type-rectangle") {
                            diagramMakerAction.payload["consumerData"] = {
                                "nodeType": "rectangle",
                            };
                        }
                        if (diagramMakerAction.payload["typeId"] === "node-type-circle") {
                            diagramMakerAction.payload["consumerData"] = {
                                "nodeType": "circle",
                            };
                        }
                        diagramMakerAction.payload["id"] = diagramMakerAction.payload["id"].substring(3, 10)
                        next(diagramMakerAction);
                        return;
                    }

                    if (diagramMakerAction.type === DiagramMakerActions.EDGE_CREATE
                        && "payload" in diagramMakerAction) {
                        diagramMakerAction.payload["id"] = diagramMakerAction.payload["id"].substring(3, 10)
                        next(diagramMakerAction);
                        // the below creates reverse edge
                        // let id, dest, src
                        // if ("id" in diagramMakerAction.payload) {
                        //     id = diagramMakerAction.payload.id
                        // }
                        // if ("dest" in diagramMakerAction.payload) {
                        //     dest = diagramMakerAction.payload.dest
                        // }
                        // if ("src" in diagramMakerAction.payload) {
                        //     src = diagramMakerAction.payload.src
                        // }
                        // const newAction: CreateEdgeAction<{}> = {
                        //     type: DiagramMakerActions.EDGE_CREATE,
                        //     payload: {
                        //         id: `${id}-2`,
                        //         src: dest,
                        //         dest: src,
                        //     },
                        // };
                        // setTimeout(() => next(newAction), 1000);
                    }
                    next(action);
                } else {
                    // We aren't showing the action details in logger anymore. Keeping for future reference
                    // updateActionInLogger(action);
                    next(action);
                }
            },
            nodeTypeConfig: getNodeTypeConfig(connectorPlacement, shape),
        }, {
            consumerEnhancer: addDevTools(),
            eventListener: plugin ? (event) => {
                handleTestPluginEvent(event, diagramMakerRef.current);
            } : undefined,
            initialData
        });

        // // to populate the current state in json pretty
        // diagramMakerRef.current.api.dispatch({
        //     type: EdgeActions.EDGE_MOUSE_OVER,
        // });
        let currentConfig = getCurrentConfig();
        if (currentConfig) {
            setData(currentConfig)
        }

        diagramMakerRef.current.store.subscribe(() => {
            const state = diagramMakerRef.current.store.getState();
            setData(JSON.stringify(state))
        });

    }, [plugin, initialData]);

    return <Grid container spacing={1} sx={{height: '100%'}}>
        <Grid item xs={10} md={10} style={{
            width: "100%",
            // TODO added 100% to take the whole webpage
            // height: window.innerHeight - 150
            height: "100%"
        }}>
            {showDialog()}
            <div style={{
                overflow: "auto",
                paddingTop: "75px"
            }} id="diagramMakerContainer" ref={containerRef}></div>
        </Grid>
        <Grid item xs={2} md={2} style={{
            width: "100%",
            overflow: "hidden"
        }}>
            <JSONPretty id="jsonPretty"
                        style={{
                            width: "100%",
                            overflowY: "scroll",
                            height: "600px",
                            paddingTop: "75px"
                        }}
                        onJSONPrettyError={e => console.error(e)}
                        data={diagramMaker.state}/>
            <br/>
            <Grid item style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column"
            }}>
                <CopyToClipboard text={diagramMaker.state}
                                 onCopy={() => setDiagramMaker({
                                     ...diagramMaker,
                                     copied: true
                                 })}>
                    <Button style={{
                        width: "200px"
                    }} variant="outlined">
                        Copy to clipboard
                    </Button>
                </CopyToClipboard>
                {diagramMaker.copied ? <span style={{color: 'green'}}> Copied.</span> : null}
            </Grid>
            <hr/>
            <Grid item style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column"
            }}>
                <GenerateProject></GenerateProject>
            </Grid>
            <hr/>
            <Grid item style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column"
            }}>
                <Button style={{
                    width: "200px"
                }} variant="contained" color="error" onClick={resetState}>Reset state</Button>
            </Grid>
        </Grid>
    </Grid>
}

export function addDevTools() {
    if (process.env.NODE_ENV === 'development') {
        const windowAsAny = window as any;
        // eslint-disable-next-line no-underscore-dangle
        return windowAsAny.__REDUX_DEVTOOLS_EXTENSION__ && windowAsAny.__REDUX_DEVTOOLS_EXTENSION__();
    }
    return undefined;
}


export function handleTestPluginEvent(event: any, diagramMaker: any) {
    console.log("%%%%%%%%%%%%%%%%%%%%%%", event)
    if (event.type === Event.LEFT_CLICK && event.target.type === 'testPlugin') {
        const state = diagramMaker.store.getState();
        if (!state.plugins) return;
        const position = state.plugins.testPlugin.data.workspacePos;

        diagramMaker.api.dispatch({
            payload: {position},
            type: WorkspaceActions.WORKSPACE_DRAG,
        });
    }
}