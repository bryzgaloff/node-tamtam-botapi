const EventEmitter = require('eventemitter3');
const request = require('request-promise');

const _methods = {
    GET_MY_INFO: 'getMyInfo',
    SEND_MESSAGE: 'sendMessage',
    EDIT_MESSAGE: 'editMessage',
    GET_ALL_CHATS: 'getAllMessage',
    GET_CHAT: 'getChats',
    GET_MESSAGES: 'getMessages',
    SUBSCRIBE: 'subscribe'
};

const _updateType = [
    'message_callback',
    'message_created',
    'message_removed',
    'message_edited',
    'bot_added',
    'bot_removed',
    'user_added',
    'user_removed',
    'bot_started',
    'chat_title_changed'
];

class TamTamBot extends EventEmitter {

    constructor(token, options = {}) {
        super();
        this.token = token;
        this.version = '0.1.6';
        this.options = options;
        this.options.baseApiUrl = 'https://botapi.tamtam.chat';
    }

    /**
     *
     * @param event
     * @param listener
     */
    on(event, listener) {
        super.on(event, listener);
    }

    /**
     *
     * @param methodName
     * @param _chatId
     * @private
     */
    _methodBuilder(methodName, _chatId) {
        const builder = {};
        switch (methodName) {
            case _methods.GET_MY_INFO:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/me`;
                break;
            case _methods.SEND_MESSAGE:
                builder.verbs = 'POST';
                builder.url = `${this.options.baseApiUrl}/messages`;
                break;
            case _methods.EDIT_MESSAGE:
                builder.verbs = 'PUT';
                builder.url = `${this.options.baseApiUrl}/messages`;
                break;
            case _methods.GET_ALL_CHATS:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/chats`;
                break;
            case _methods.GET_CHAT:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/chats/${_chatId}`;
                break;
            case _methods.GET_MESSAGES:
                builder.verbs = 'GET';
                builder.url = `${this.options.baseApiUrl}/messages`;
                break;
            case _methods.SUBSCRIBE:
                builder.verbs = 'POST';
                builder.url = `${this.options.baseApiUrl}/subscriptions`;
                break;
        }
        return builder;
    }

    /**
     *
     * @param form
     * @private
     */
    _buildQuery(form = {}) {
        const qs = {};
        qs.chat_id = form.chat_id;
        qs.user_id = form.user_id;
        qs.message_ids = form.message_ids;
        qs.from = form.from;
        qs.to = form.to;
        qs.count = form.count;
        qs.marker = form.marker;
        qs.access_token = this.token;
        qs.message_id = form.message_id;
        qs.v = this.version;
        return qs;
    }

    /**
     *
     * @param parameters
     * @returns {request.Request}
     * @private
     */
    _request(parameters = {}) {
        const options = {};
        options.method = parameters.form.method.verbs;
        options.url = parameters.form.method.url;
        options.qs = parameters.form.query;
        options.body = JSON.stringify(parameters.form.body);
        return request(null, options, function (error, response, body) {
            if (!error && response.statusCode === 200) {
            } else {
                console.log('Response ERROR:', error);
                console.log('Response statusCode:', response.statusCode);
                console.log('Response body:', body);
            }
        })
    }

    /**
     *
     * @param update
     */
    updateHandler(update) {
        const updateType = update.update_type;
        switch (updateType) {
            case 'bot_started':
                this.emit('bot_started', update);
                break;
        }
    }

    /**
     * Get current bot info
     */
    getMyInfo(form = {}) {
        form.method = this._methodBuilder(_methods.GET_MY_INFO);
        form.query = this._buildQuery(form);
        return this._request({form});
    }

    /**
     *
     * @param count
     * @param marker
     * @param form
     * @returns {request.Request}
     */
    getAllChats(count, marker, form = {}) {
        form.count = count;
        form.marker = marker;
        form.method = this._methodBuilder(_methods.GET_ALL_CHATS);
        form.query = this._buildQuery(form);
        return this._request({form})
    }

    /**
     *
     * @param chatId
     * @param messageIds
     * @param from
     * @param to
     * @param count
     * @param form
     * @returns {request.Request}
     */
    getMessages(chatId, messageIds, from, to, count, form = {}) {
        form.chat_id = chatId;
        form.message_ids = messageIds;
        form.from = from;
        form.to = to;
        form.count = count;
        form.method = this._methodBuilder(_methods.GET_MESSAGES);
        form.query = this._buildQuery(form);
        return this._request({form})
    }

    /**
     * Send message
     *
     * @param userId
     * @param chatId
     * @param body
     * @param form
     * @returns {request.Request}
     */
    sendMessage(userId, chatId, body, form = {}) {
        form.user_id = userId;
        form.chat_id = chatId;
        form.body = body;
        form.method = this._methodBuilder(_methods.SEND_MESSAGE, chatId);
        form.query = this._buildQuery(form);
        return this._request({form});
    }

    /**
     *
     * @param messageId
     * @param body
     * @param form
     * @returns {request.Request}
     */
    editMessage(messageId, body, form = {}) {
        form.message_id = messageId;
        form.body = body;
        form.method = this._methodBuilder(_methods.EDIT_MESSAGE);
        form.query = this._buildQuery(form);
        return this._request({form})
    }

    /**
     *
     * @param url
     * @param updateTypes
     * @param version
     * @param form
     * @returns {request.Request}
     */
    subscribe(url, updateTypes, version, form = {}) {
        const body = {};
        body.url = url;
        body.update_types = updateTypes;
        body.version = this.version;
        form.body = body;
        form.query = this._buildQuery();
        form.method = this._methodBuilder(_methods.SUBSCRIBE);
        return this._request({form})
    }

}

module.exports = TamTamBot;
