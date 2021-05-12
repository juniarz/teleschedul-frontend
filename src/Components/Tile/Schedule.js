/*
 *  Copyright (c) 2018-present, Evgeny Nadymov
 *
 * This source code is licensed under the GPL v.3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ChatTile from './ChatTile';
import DialogTitle from './DialogTitle';
import ApplicationStore from '../../Stores/ApplicationStore';
import ChatStore from '../../Stores/ChatStore';
import ScheduleGroupSettings from './ScheduleGroupSettings';

class Schedule extends Component {
    static contextMenuId;

    constructor(props) {
        super(props);

        this.dialog = React.createRef();

        const chat = ChatStore.get(props.chatId);
        this.state = {
            chat
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { chatId, t, hidden, isLastPinned, style } = this.props;

        if (nextProps.chatId !== chatId) {
            // console.log('[vl] Dialog.shouldUpdate true chatId');
            return true;
        }

        if (nextProps.t !== t) {
            // console.log('[vl] Dialog.shouldUpdate true t');
            return true;
        }

        if (nextProps.hidden !== hidden) {
            // console.log('[vl] Dialog.shouldUpdate true hidden');
            return true;
        }

        if (nextProps.isLastPinned !== isLastPinned) {
            // console.log('[vl] Dialog.shouldUpdate true isLastPinned');
            return true;
        }

        if (nextProps.style && style && style.top !== nextProps.style.top) {
            // console.log('[vl] Dialog.shouldUpdate true style');
            return true;
        }

        // console.log('[vl] Dialog.shouldUpdate false');
        return false;
    }

    componentDidMount() {
        ApplicationStore.on('clientUpdateChatId', this.onClientUpdateChatId);
    }

    componentWillUnmount() {
        ApplicationStore.off('clientUpdateChatId', this.onClientUpdateChatId);
    }

    onClientUpdateChatId = update => {
        const { chatId } = this.props;

        if (chatId === update.previousChatId || chatId === update.nextChatId) {
            this.forceUpdate();
        }
    };

    handleSelect = event => {
        if (event.button === 0) {
            // openChat(this.props.chatId);
        }
    };

    render() {
        const { chatId, showSavedMessages, hidden, style } = this.props;

        return (
            <ListItem
                button
                className={classNames('dialog', { 'dialog-hidden': hidden })}
                onMouseDown={this.handleSelect}
                style={style}
            >
                <div className='dialog-wrapper'>
                    <ChatTile chatId={chatId} dialog showSavedMessages={showSavedMessages} showOnline showGroupCall />
                    <div className='dialog-inner-wrapper'>
                        <div className='tile-first-row'>
                            <DialogTitle chatId={chatId} />
                            <ScheduleGroupSettings chatId={chatId} />
                        </div>
                        <div className='tile-second-row'>
                        </div>
                    </div>
                </div>
            </ListItem>
        );
    }
}

Schedule.propTypes = {
    chatId: PropTypes.number.isRequired,
    hidden: PropTypes.bool,
    showSavedMessages: PropTypes.bool,
    isLastPinned: PropTypes.bool,
    style: PropTypes.object
};

Schedule.defaultProps = {
    hidden: false,
    showSavedMessages: true
};

export default withTranslation()(Schedule);
