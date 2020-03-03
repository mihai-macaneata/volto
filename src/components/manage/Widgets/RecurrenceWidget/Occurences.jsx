/**
 * Occurences component.
 * @module components/manage/Widgets/RecurrenceWidget/Occurences
 */

import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import moment from 'moment';
import cx from 'classnames';
import { List, Button, Header, Label } from 'semantic-ui-react';
import { toISOString } from './Utils';

const messages = defineMessages({
  selected_dates: {
    id: 'Selected dates',
    defaultMessage: 'Selected dates',
  },
  start_of_recurrence: {
    id: 'Start of the recurrence',
    defaultMessage: 'Start of the recurrence',
  },
  additional_date: {
    id: 'Additional date',
    defaultMessage: 'Additional date',
  },
});

const formatDate = d => {
  const m = moment(d);
  return m.format('dddd') + ', ' + m.format('LL');
};

/**
 * Occurences component class.
 * @function Occurences
 * @returns {string} Markup of the component.
 */
const Occurences = ({ rruleSet, exclude, undoExclude, intl }) => {
  const isExcluded = date => {
    var dateISO = toISOString(date);
    var excluded = false;
    rruleSet.exdates().map(ex => {
      var exISO = toISOString(ex);
      if (exISO === dateISO) {
        excluded = true;
      }
    });
    return excluded;
  };

  const isAdditional = date => {
    var dateISO = toISOString(date);
    var additional = false;
    rruleSet.rdates().map(d => {
      var dd = toISOString(d);
      if (dd === dateISO) {
        additional = true;
      }
    });
    return additional;
  };
  let all = rruleSet.all();

  rruleSet.exdates().map(date => {
    if (all.indexOf(date) < 0) {
      all.push(date);
    }
  });
  all.sort((a, b) => {
    return a > b ? 1 : -1;
  });

  return (
    <div className="occurences">
      <Header as="h2">{intl.formatMessage(messages.selected_dates)}</Header>
      <List divided verticalAlign="middle">
        {all.map((date, index) => {
          const excluded = isExcluded(date);
          return (
            <List.Item key={date.toString()}>
              <List.Content floated="right">
                {index > 0 ? (
                  <>
                    {!excluded && (
                      <Button
                        icon="remove"
                        color="red"
                        compact
                        onClick={() => {
                          exclude(date);
                        }}
                      />
                    )}
                    {excluded && (
                      <Button
                        icon="plus"
                        primary
                        compact
                        onClick={() => {
                          undoExclude(date);
                        }}
                      />
                    )}
                  </>
                ) : (
                  intl.formatMessage(messages.start_of_recurrence)
                )}
              </List.Content>
              <List.Content className={cx({ excluded: excluded })}>
                {formatDate(date)}
                {isAdditional(date) && (
                  <Label pointing="left" size="small" color="green">
                    {intl.formatMessage(messages.additional_date)}
                  </Label>
                )}
              </List.Content>
            </List.Item>
          );
        })}
      </List>
    </div>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Occurences.propTypes = {
  rruleSet: PropTypes.any.isRequired,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
Occurences.defaultProps = {
  rruleSet: null,
};

export default injectIntl(Occurences);