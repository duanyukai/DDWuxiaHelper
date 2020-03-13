import React from 'react';

import materialList from '../assets/material.json';
import Tag from 'antd/es/tag';
import Popover from 'antd/es/popover';
import {IMG_BASE_DOMAIN} from './data_utils';


export function getRecipeTableColumns () {
  return [
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      align: 'center',
      render: (text) => {
        return <div>
          <img
            src={`${IMG_BASE_DOMAIN}/imagesets/ICONS/UI/CHUSHI128/${text.toUpperCase()}.png`}
            alt={text}
            style={{width: 48}}
          />
        </div>;
      }
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: 1
    },
    {
      title: '等级',
      dataIndex: 'unlockLevel',
      align: 'center',
      render: (level) => {
        return `${['初', '中', '高'][level/3.1|0]}级 (${level}级)`;
      }
    },
    {
      title: '配方',
      dataIndex: 'materials',
      key: 'materials',
      render: (text, record) => {
        return record.materials.map((materialId, i) => {
          // 查找食材
          let material = materialList.find(m => m.materialId === materialId);
          let mType = record.materialTypes[i];
          // 弹框内容
          let content;
          switch (mType) {
          case 0:
            content = <div>
              {material.source} <br />
                专属食材为必备，不可替换
            </div>;
            break;
          case 1:

            content = <div>
              {material.source} <br />
              可替换食材可以使用同类食材替换，如下：

            </div>;
            break;
          case 2:
            content = <div>
              {material.source} <br />
              推荐食材可以任意进行替换，满足约束条件即可。<br />
              约束为：<br/>
              蔬菜1种<br/>
              其余为0。典籍左侧加号展开查看详细替换方式。
            </div>;
            break;
          }
          return <span key={materialId}>
            <Popover content={content} title={`${material.name} (${['专属', '可替换', '推荐'][mType]})`}>
              <Tag color={
                ['#bd513c', '#d3a83c', '#547396'][mType]
              }>
                {material.name}
              </Tag>
            </Popover>
          </span>;
        });
      }
    },
    {
      title: '暴击产物',
      dataIndex: 'criticalName',
      key: 'criticalName',
    },
  ];
}