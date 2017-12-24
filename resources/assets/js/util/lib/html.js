/**
 * HTML エンティティを適切な文字に変換する
 * @param {string} message
 * @returns {*}
 */
export function htmlEntityDecode(message) {
    return message.replace(/[<>'"]/g, function(m) {
        return '&' + {
            '\'': 'apos',
            '"': 'quot',
            '&': 'amp',
            '<': 'lt',
            '>': 'gt',
        }[m] + ';';
    });
}

/**
 * 改行をHTMLの改行に変換する
 * @param {string} text
 * @returns {string}
 */
export function nl2br(text) {
    return text.replace(/\n\r?/g, '<br />');
}
