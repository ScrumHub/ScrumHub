import { Tree } from 'antd';
import { EventDataNode } from 'antd/lib/tree';
import { Key } from 'rc-tree/lib/interface';
import { NodeDragEventParams } from 'rc-tree/lib/contextTypes';
import React, { useState } from 'react';

const x = 3;
const y = 2;
const z = 1;
const gData: any[] = [];
//gData.push({title:"First", index:"0",children:[]});
//gData.push({title:"2nd", index:"1",children:[]});
//[{title:"First", index:"0",children:[{title:"Third", index:"3"}]}, {title:"Second", index:"1",children:[]}]

const generateData = (_level: number, _preKey?: string | undefined, _tns?: any[] | undefined) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);
console.log(gData);

export class TreeList extends React.Component {
  state = {
    gData,
    expandedKeys: ['0-0', '0-0-0', '0-0-0-0'],
  };

  onDragEnter = (info: any) => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };
  //(info: NodeDragEventParams<HTMLDivElement> & { dragNode: EventDataNode; dragNodesKeys: Key[]; dropPosition: number; dropToGap: boolean; })
  onDrop = (info: any) => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data:any, key:any, callback:any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...this.state.gData];

    // Find dragObject
    let dragObj: any;
    loop(data, dragKey, (item: any, index: any, arr: any[]) => {
      console.log(arr);
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item: { children: any[]; }) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item: { children: any[]; }) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      //const [ar, setAr] = useState([] as any[]);
      let ar:any[]=[];
      let i;
      loop(data, dropKey, ({item, index, arr}:{item:any, index:any, arr:any[]}) => {
        ar = arr;
        i = index;
      });
      if(ar&& i){
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    }

    this.setState({
      gData: data,
    });
  };

  render() {
    return (
      <Tree
        className="draggable-tree"
        defaultExpandedKeys={this.state.expandedKeys}
        draggable
        blockNode
        onDragEnter={this.onDragEnter}
        onDrop={this.onDrop}
        treeData={this.state.gData}
      />
    );
  }
}