/*
 *  Copyright (c) 2018-present, Evgeny Nadymov
 *
 * This source code is licensed under the GPL v.3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { compose, withRestoreRef, withSaveRef } from '../../../Utils/HOC';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '../../../Assets/Icons/Back';
import CloseIcon from '../../../Assets/Icons/Close';
import TdLibController from '../../../Controllers/TdLibController';
import ScheduleList from './ScheduleList';
import FileStore from '../../../Stores/FileStore';
import CacheStore from '../../../Stores/CacheStore';
import FilterStore from '../../../Stores/FilterStore';
import { loadChatsContent } from '../../../Utils/File';

class Scheduler extends React.Component {
    constructor(props) {
        super(props);

        this.dialogListRef = React.createRef();

        this.state = {
            cache: null,
        };

    }

    shouldComponentUpdate(nextProps, nextState) {
        const {
            cache
        } = this.state;

        if (nextState.cache !== cache) {
            return true;
        }

        return false;
    }

    componentDidMount() {
        this.loadCache();
    }

    componentWillUnmount() {
    }

    handleCloseSettings = () => {
        TdLibController.clientUpdate({
            '@type': 'clientUpdateScheduler',
            open: false
        });
    };

    async loadCache() {
        const cache = (await CacheStore.load()) || {};

        const { chats } = cache;

        FilterStore.filters = FilterStore.filters || CacheStore.filters;
        this.setState({
            cache
        });

        this.loadChatContents((chats || []).map(x => x.id));

        TdLibController.clientUpdate({
            '@type': 'clientUpdateCacheLoaded'
        });
    }

    loadChatContents(chatIds) {
        const store = FileStore.getStore();
        loadChatsContent(store, chatIds);
    }

    render() {
        const {
            cache,
            popup,
            t
        } = this.props;

        const mainCacheItems = cache && cache.chats ? cache.chats : null;

        return (
            <>
                <div className='header-master'>
                    <IconButton className='header-left-button' onClick={this.handleCloseSettings}>
                        {popup ? <CloseIcon /> : <ArrowBackIcon />}
                    </IconButton>
                    <div className='header-status grow cursor-pointer'>
                        <span className='header-status-content'>{t('Schedule')}</span>
                    </div>
                </div>
                <div className='sidebar-page-content settings-main-content'>
                    <ScheduleList
                        type='chatListMain'
                        ref={this.dialogListRef}
                        cacheItems={mainCacheItems}
                    />
                </div>
            </>
        );
    }
}

Scheduler.propTypes = {
    popup: PropTypes.bool,
};

const enhance = compose(
    withSaveRef(),
    withTranslation(),
    withRestoreRef()
);

export default enhance(Scheduler);
