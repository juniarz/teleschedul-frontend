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

class Scheduler extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    handleCloseSettings = () => {
        TdLibController.clientUpdate({
            '@type': 'clientUpdateScheduler',
            open: false
        });
    };

    render() {
        const {
            popup,
            t
        } = this.props;

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
