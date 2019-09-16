const TamTamBotApi = require('..');
const assert = require('assert');
const is = require('is');


exports = module.exports = {
    /**
     * Random integer from min to max
     */
    randomInteger,

    /**
     *
     */
    isUserChatMember,

    /**
     * 
     */
    isSubscribeOnUrl
};

/**
 *
 * @param min
 * @param max
 * @returns {number}
 */
function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

/**
 *
 * @param token
 * @param {Number} chatId
 * @param {Number} userIds
 */
function isUserChatMember(token, chatId, userIds) {
    let bot = new TamTamBotApi(token);
    bot.getMembers(chatId, userIds).then(resp => {
        resp = JSON.parse(resp);
        return resp.members;
    });
}

/**
 * 
 * @param {Object} arr 
 * @param {String} item 
 */
function isSubscribeOnUrl(arr, item) {

    function isContains(subscription) {
        return subscription.url == item;
    }

    return arr.subscriptions.some(isContains);
}