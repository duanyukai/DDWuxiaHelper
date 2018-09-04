import React, { Component } from 'react';
import {Button, ButtonGroup, Dropdown, MenuItem, Table} from "react-bootstrap";
import range from 'lodash/range';
import {
  setFiveDimAdditionProps
} from "../actions";
import {connect} from "react-redux";

import './css/addition_config.css';

import additionPercentageTable from '../assets/json/addition_percentage_table.json';
import chenghaoList from '../assets/json/addition_id_list.json';

class AdditionConfig extends Component {
  constructor(props) {
    super(props);
  }

  toPercentage(num) {
    return (num * 100).toFixed(2) + '%';
  }

  render() {
    return(
      <div styleName='school-btn-group'>
        <ButtonGroup>
          {
            [
              {id: 'YH', name: '移花', enabled: true},
              {id: 'TB', name: '太白', enabled: true},
              {id: 'ZW', name: '真武', enabled: true},
              {id: 'TX', name: '天香', enabled: true},
              {id: 'SW', name: '神威', enabled: true},
              {id: 'SD', name: '神刀', enabled: true},
              {id: 'WD', name: '五毒', enabled: true},
              {id: 'TM', name: '唐门', enabled: true},
              {id: 'GB', name: '丐帮', enabled: true},
            ].map(({id, name, enabled}) => {
              let schoolId;
              try {
                schoolId = this.props.additionConfig.schoolId || 'TB'
              } catch(e) {
                schoolId = 'TB';
              }
              return(
                <Button
                  key={id}
                  disabled={!enabled}
                  bsStyle={schoolId === id ? 'default' : 'primary'}
                  onClick={() => {
                    let newConfig = { ...this.props.additionConfig };
                    newConfig.schoolId = id;
                    this.props.setFiveDimAdditionProps(newConfig);
                  }}
                >
                  {name}
                </Button>
              );
            })
          }
        </ButtonGroup>
        <Table styleName='chenghao-table'>
          <thead>
            <tr>
              <th>加成</th>
              <th>力道</th>
              <th>根骨</th>
              <th>气劲</th>
              <th>洞察</th>
              <th>身法</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
              神兵等级
              </td>
              {
                ['ld', 'gg', 'qj', 'dc', 'sf'].map((dimId) => {
                  let shenbingLevel;
                  try {
                    shenbingLevel = this.props.additionConfig.shenbingLevels[dimId] || 0;
                  } catch(e) {
                    shenbingLevel = 0;
                  }
                  let shenbingLevelList = additionPercentageTable['shenbing'][dimId];
                  let currentLevelData = shenbingLevelList[shenbingLevel];
                  return(
                    <td key={dimId}>
                      <Dropdown id={`shenbing-selector-${dimId}`}>
                        <Dropdown.Toggle bsStyle='primary' bsSize='xsmall'>{currentLevelData['title']},<br /> +{this.toPercentage(currentLevelData[dimId])}</Dropdown.Toggle>
                        <Dropdown.Menu styleName='config-selector-menu'>
                          {
                            shenbingLevelList.map((shenbingData, i) => (
                              <MenuItem
                                eventKey={i}
                                key={i}
                                onSelect={() => {
                                  let newConfig = { ...this.props.additionConfig };
                                  if(!newConfig.hasOwnProperty('shenbingLevels'))
                                    newConfig['shenbingLevels'] = {};
                                  newConfig['shenbingLevels'][dimId] = i;
                                  this.props.setFiveDimAdditionProps(newConfig);
                                }}
                              >{shenbingData['title']}, {shenbingData['des']}</MenuItem>
                            ))
                          }
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  );
                })
              }
            </tr>
            {
              chenghaoList.map(({btnTitle, dataId, stateId}, i) => {
                let level;
                try {
                  level = this.props.additionConfig[stateId] || 0;
                } catch(e) {
                  level = 0;
                }
                return(
                  <tr key={i}>
                    <td>
                      <Dropdown id={`${stateId}-selector`}>
                        <Dropdown.Toggle bsStyle='primary' bsSize='small' style={{minWidth: '105px'}}>{btnTitle}<br />{additionPercentageTable[dataId][level]['title']}</Dropdown.Toggle>
                        <Dropdown.Menu styleName='config-selector-menu'>
                          {
                            additionPercentageTable[dataId].map((data, i) => (
                              <MenuItem
                                eventKey={i}
                                key={i}
                                onSelect={() => {
                                  let newConfig = { ...this.props.additionConfig };
                                  newConfig[stateId] = i;
                                  this.props.setFiveDimAdditionProps(newConfig);
                                }}
                              >{data['title']}, {data['des']}</MenuItem>
                            ))
                          }
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                    {
                      range(5).map((i) => (
                        <td key={i}>+{this.toPercentage(additionPercentageTable[dataId][level]['all'])}</td>
                      ))
                    }
                  </tr>
                );
              })
            }
            <tr>
              <td>属性加成总和</td>
              {
                ['ld', 'gg', 'qj', 'dc', 'sf'].map((dimId) => {
                  let level;
                  try {
                    level = this.props.additionConfig.shenbingLevels[dimId] || 0;
                  } catch(e) {
                    level = 0;
                  }
                  let sum = additionPercentageTable['shenbing'][dimId][level][dimId];
                  chenghaoList.forEach(({dataId, stateId}) => {
                    let curlevel;
                    try {
                      curlevel = this.props.additionConfig[stateId] || 0;
                    } catch(e) {
                      curlevel = 0;
                    }
                    sum += additionPercentageTable[dataId][curlevel]['all'];
                  });
                  return(
                    <td key={dimId}>
                      +{this.toPercentage(sum)}
                    </td>
                  );
                })
              }
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let additionConfig = state.brkthruData.additionConfig;
  return {
    brkthruData: state.brkthruData,
    additionConfig: additionConfig
  };
}

export default connect(mapStateToProps, {
  setFiveDimAdditionProps
})(AdditionConfig);