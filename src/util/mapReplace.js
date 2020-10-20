/**
 * Takes a template and replaces `{{ templates }}` within that string.
 *
 * @param {string} input The input string.
 * @param {object} replacementMap A map of replacements with the key being the
 * replaced string and the value being the replacement.
 * @returns The string with replaced values
 */
module.exports = function mapReplace(input, replacementMap) {
    let returnValue = input;

    for (const [match, replacement] of Object.entries(replacementMap)) {
        returnValue = returnValue.replace(
            new RegExp(`\\{\\{ ${match} \\}\\}`, 'g'),
            replacement
        );
    }

    return returnValue;
};
