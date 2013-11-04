var _ = require("./utils"),
    $Element = require("./element"),
    SelectorMatcher = require("./selectormatcher"),
    hooks = {};

hooks[":focus"] = function(node) {
    return node === document.activeElement;
};

hooks[":hidden"] = function(node) {
    return node.getAttribute("aria-hidden") === "true" ||
        _.getComputedStyle(node).display === "none" ||
            !document.documentElement.contains(node);
};

/**
 * Check if the element matches selector
 * @param  {String} selector css selector
 * @return {$Element}
 * @function
 */
$Element.prototype.matches = function(selector, deep) {
    if (!selector || typeof selector !== "string" || deep !== undefined && typeof deep !== "boolean") {
        throw _.makeError("matches", this);
    }

    var node = this._node,
        checker = hooks[selector] || SelectorMatcher(selector);

    while (node && node !== document) {
        if (checker(node)) return true;

        node = deep ? node.parentNode : null;
    }

    return false;
};
