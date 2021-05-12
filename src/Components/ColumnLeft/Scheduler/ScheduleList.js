/*
 *  Copyright (c) 2018-present, Evgeny Nadymov
 *
 * This source code is licensed under the GPL v.3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Schedule from '../../Tile/Schedule';
import DialogPlaceholder from '../../Tile/DialogPlaceholder';
import VirtualizedList from '../../Additional/VirtualizedList';
import { changeChatDetailsVisibility } from '../../../Actions/Chat';
import { loadChatsContent } from '../../../Utils/File';
import { isAuthorizationReady, orderCompare } from '../../../Utils/Common';
import { scrollTop } from '../../../Utils/DOM';
import { chatListEquals, getChatOrder, hasChatList, isChatPinned } from '../../../Utils/Chat';
import { CHAT_SLICE_LIMIT, SCROLL_CHATS_PRECISION } from '../../../Constants';
import CacheStore from '../../../Stores/CacheStore';
import ChatStore from '../../../Stores/ChatStore';
import FileStore from '../../../Stores/FileStore';
import SupergroupStore from '../../../Stores/SupergroupStore';
import TdLibController from '../../../Controllers/TdLibController';
import FilterStore from '../../../Stores/FilterStore';

class ScheduleListItem extends React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const { chatId, chatList, style } = this.props;
        if (nextProps.chatId !== chatId) {
            return true;
        }

        if (nextProps.chatList !== chatList) {
            return true;
        }

        if (nextProps.style.top !== style.top) {
            return true;
        }

        return false;
    }

    render() {
        const { chatId, chatList, style } = this.props;
        return (
            <div className='dialog-list-item' style={style}>
                <Schedule chatId={chatId} chatList={chatList} />
            </div>
        );
    }
}

class ScheduleList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: [],
            loading: true
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { groups, loading } = this.state;

        if (nextState.groups !== groups) {
            return true;
        }

        if (nextState.loading !== loading) {
            return true;
        }

        return false;
    }

    componentDidMount() {
        CacheStore.load().then((cache) => {
            const { chats } = cache;

            const groupChats = chats.filter((chat) => {
                if (chat.type["@type"] !== "chatTypeSupergroup" && chat.type["@type"] !== "chatTypeBasicGroup") {
                    return false;
                }

                if (!chat.permissions.can_send_messages) {
                    return false;
                }

                return true;
            });

            this.setState({
                groups: groupChats,
                loading: false
            });
        })
    }

    componentWillUnmount() {
    }

    renderItem = ({ index, style }, groups, stub = false) => {
        if (stub) {
            return <DialogPlaceholder key={index} index={index} />
        }

        const chatId = groups[index].id;
        return <ScheduleListItem key={chatId} chatId={chatId} style={style} />;
    };

    render() {
        const { groups, loading } = this.state;

        return (
            <VirtualizedList
                ref={this.listRef}
                className='dialogs-list'
                source={groups}
                rowHeight={76}
                overScanCount={20}
                renderItem={x => this.renderItem(x, groups, loading)}
            />
        );
    }
}

ScheduleList.propTypes = {};

export default ScheduleList;
