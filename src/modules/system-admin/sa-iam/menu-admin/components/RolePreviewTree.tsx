import { Empty, Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import * as React from "react";

export interface RolePreviewTreeProps {
  treeData: DataNode[];
  loading?: boolean;
}

export const RolePreviewTree: React.FC<RolePreviewTreeProps> = ({ treeData }) => {
  if (!treeData.length) {
    return <Empty description="Chưa có dữ liệu preview" />;
  }

  return <Tree showLine blockNode treeData={treeData} />;
};
