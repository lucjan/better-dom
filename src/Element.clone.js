var _ = require("./utils"),
    $Element = require("./element");

/**
 * Clone element
 * @param {Boolean} [deep=true] true if the children should also be cloned, or false to do shallow copy
 * @return {$Element} clone of current element
 */
$Element.prototype.clone = function(deep) {
    if (!arguments.length) deep = true;

    if (typeof deep !== "boolean") throw _.makeError("clone", this);

    var node = this._node;

    if (node) {
        if (document.addEventListener) {
            node = node.cloneNode(deep);
        } else {
            node = document.createElement("div");
            node.innerHTML = this._node.outerHTML;
            node = node.firstChild;

            if (!deep) node.innerHTML = "";
        }

        return new $Element(node);
    }
};
