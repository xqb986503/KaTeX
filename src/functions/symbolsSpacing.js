// @flow
import {defineFunctionBuilders} from "../defineFunction";
import buildCommon from "../buildCommon";
import mathMLTree from "../mathMLTree";

// ParseNode<"spacing"> created in Parser.js from the "spacing" symbol Groups in
// src/symbols.js.
defineFunctionBuilders({
    type: "spacing",
    htmlBuilder(group, options) {
        if (buildCommon.regularSpace.hasOwnProperty(group.value)) {
            const className = buildCommon.regularSpace[group.value].className || "";
            // Spaces are generated by adding an actual space. Each of these
            // things has an entry in the symbols table, so these will be turned
            // into appropriate outputs.
            if (group.mode === "text") {
                const ord = buildCommon.makeOrd(group, options, "textord");
                ord.classes.push(className);
                return ord;
            } else {
                return buildCommon.makeSpan(["mspace", className],
                    [buildCommon.mathsym(group.value, group.mode, options)],
                    options);
            }
        } else {
            // Other kinds of spaces are of arbitrary width. We use CSS to
            // generate these.
            return buildCommon.makeSpan(
                ["mspace", buildCommon.spacingFunctions[group.value].className],
                [], options);
        }
    },
    mathmlBuilder(group, options) {
        let node;

        if (buildCommon.regularSpace.hasOwnProperty(group.value)) {
            node = new mathMLTree.MathNode(
                "mtext", [new mathMLTree.TextNode("\u00a0")]);
        } else {
            node = new mathMLTree.MathNode("mspace");

            node.setAttribute(
                "width", buildCommon.spacingFunctions[group.value].size);
        }

        return node;
    },
});
