/*
 *  Copyright (c) 2018-present, Evgeny Nadymov
 *
 * This source code is licensed under the GPL v.3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { withTranslation } from 'react-i18next';
import ChatStore from '../../Stores/ChatStore';
import './DialogMeta.css';
import { MenuItem, Select, Switch } from '@material-ui/core';

import GroupSetting from '../../Parse/Models/GroupSetting';

class ScheduleGroupSettings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            setting: undefined,
            enabled: false,
            frequency: 5
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { chatId, t } = this.props;
        const { setting, enabled, frequency } = this.state;

        if (nextProps.chatId !== chatId) {
            return true;
        }

        if (nextProps.t !== t) {
            return true;
        }

        if (nextState.setting !== setting) {
            return true;
        }

        if (nextState.enabled !== enabled) {
            return true;
        }

        if (nextState.frequency !== frequency) {
            return true;
        }

        return false;
    }

    componentDidMount() {
        ChatStore.on('clientUpdateFastUpdatingComplete', this.onFastUpdatingComplete);
        ChatStore.on('clientUpdateClearHistory', this.onClientUpdateClearHistory);
        ChatStore.on('updateChatDraftMessage', this.onUpdate);
        ChatStore.on('updateChatLastMessage', this.onUpdate);
        ChatStore.on('updateChatReadInbox', this.onUpdate);
        ChatStore.on('updateChatUnreadMentionCount', this.onUpdate);
        ChatStore.on('updateMessageMentionRead', this.onUpdate);

        const { chatId } = this.props;

        GroupSetting.get(chatId).then((setting) => {
            const { enabled, frequency } = setting.attributes;

            this.setState({
                setting,
                enabled,
                frequency
            });
        });
    }

    componentWillUnmount() {
        ChatStore.off('clientUpdateFastUpdatingComplete', this.onFastUpdatingComplete);
        ChatStore.off('clientUpdateClearHistory', this.onClientUpdateClearHistory);
        ChatStore.off('updateChatDraftMessage', this.onUpdate);
        ChatStore.off('updateChatLastMessage', this.onUpdate);
        ChatStore.off('updateChatReadInbox', this.onUpdate);
        ChatStore.off('updateChatUnreadMentionCount', this.onUpdate);
        ChatStore.off('updateMessageMentionRead', this.onUpdate);
    }

    onClientUpdateClearHistory = update => {
        const { chatId } = this.props;

        if (chatId === update.chatId) {
            this.clearHistory = update.inProgress;
            this.forceUpdate();
        }
    };

    onFastUpdatingComplete = update => {
        this.forceUpdate();
    };

    onUpdate = update => {
        const { chatId } = this.props;

        if (chatId !== update.chat_id) return;

        this.forceUpdate();
    };

    onEnableChange = (e) => {
        const checked = e.target.checked;

        const { setting } = this.state;

        setting.set("enabled", checked);

        setting.save();

        this.setState({
            enabled: checked
        });
    }

    onFrequencyChange = (e) => {
        const newFrequency = e.target.value;

        const { setting } = this.state;

        setting.set("frequency", newFrequency);

        setting.save();

        this.setState({
            frequency: newFrequency
        });
    }

    render() {
        if (this.clearHistory) return null;

        const { setting, enabled, frequency } = this.state;

        if (!setting) {
            return null;
        }

        return (
            <div className='dialog-meta'>
                <Switch onChange={this.onEnableChange} checked={enabled} />
                {enabled && <Select onChange={this.onFrequencyChange} value={frequency}>
                    <MenuItem value={5}>5 min</MenuItem>
                    <MenuItem value={10}>10 min</MenuItem>
                    <MenuItem value={15}>15 min</MenuItem>
                    <MenuItem value={20}>20 min</MenuItem>
                    <MenuItem value={25}>25 min</MenuItem>
                </Select>}
            </div>
        );
    }
}

export default withTranslation()(ScheduleGroupSettings);
