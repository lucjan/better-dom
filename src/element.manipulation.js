var _ = require("./utils"),
    $Element = require("./element"),
    features = require("./features");

function makeManipulationMethod(methodName, fasterMethodName, standalone, strategy) {
    var manipulateContent = function(value) {
            return _.legacy(this, function(node, el) {
                var valueType = typeof value,
                    relatedNode = node.parentNode;

                if (!(standalone || relatedNode && relatedNode.nodeType === 1)) return;

                if (valueType === "function") {
                    value = value.call(el);
                    valueType = typeof value;
                }

                if (valueType === "string") {
                    value = _.trim(DOM.template(value));
                    // always use _parseFragment because of HTML5 and NoScope bugs in IE
                    relatedNode = features.CSS3_ANIMATIONS && fasterMethodName ? null : _.parseFragment(value);
                } else if (value instanceof $Element) {
                    return value.legacy(function(relatedNode) { strategy(node, relatedNode); });
                } else if (value !== undefined) {
                    throw _.makeError(methodName, el);
                }

                if (!fasterMethodName || relatedNode) {
                    strategy(node, relatedNode);
                } else {
                    node.insertAdjacentHTML(fasterMethodName, value);
                }
            });
        };

    return !fasterMethodName ? manipulateContent : function() {
        _.forEach(arguments, manipulateContent, this);

        return this;
    };
}

/**
 * Insert html string or $Element after the current
 * @param {...Mixed} contents HTMLString, EmmetString, $Element or functor that returns content
 * @return {$Element}
 * @function
 */
$Element.prototype.after = makeManipulationMethod("after", "afterend", false, function(node, relatedNode) {
    node.parentNode.insertBefore(relatedNode, node.nextSibling);
});

/**
 * Insert html string or $Element before the current
 * @param {...Mixed} contents HTMLString, EmmetString, $Element or functor that returns content
 * @return {$Element}
 * @function
 */
$Element.prototype.before = makeManipulationMethod("before", "beforebegin", false, function(node, relatedNode) {
    node.parentNode.insertBefore(relatedNode, node);
});

/**
 * Prepend html string or $Element to the current
 * @param {...Mixed} contents HTMLString, EmmetString, $Element or functor that returns content
 * @return {$Element}
 * @function
 */
$Element.prototype.prepend = makeManipulationMethod("prepend", "afterbegin", true, function(node, relatedNode) {
    node.insertBefore(relatedNode, node.firstChild);
});

/**
 * Append html string or $Element to the current
 * @param {...Mixed} contents HTMLString, EmmetString, $Element or functor that returns content
 * @return {$Element}
 * @function
 */
$Element.prototype.append = makeManipulationMethod("append", "beforeend", true, function(node, relatedNode) {
    node.appendChild(relatedNode);
});

/**
 * Replace current element with html string or $Element
 * @param {Mixed} content HTMLString, EmmetString, $Element or functor that returns content
 * @return {$Element}
 * @function
 */
$Element.prototype.replace = makeManipulationMethod("replace", "", false, function(node, relatedNode) {
    node.parentNode.replaceChild(relatedNode, node);
});

/**
 * Remove current element from DOM
 * @return {$Element}
 * @function
 */
$Element.prototype.remove = makeManipulationMethod("remove", "", false, function(node) {
    node.parentNode.removeChild(node);
});
