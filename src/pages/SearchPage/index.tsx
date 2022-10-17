import React, { useState } from "react";
import styles from "./index.module.css";
import { Row, Col, Input, List } from "antd";
import {DribbbleOutlined} from "@ant-design/icons"

const { Search } = Input;
const handleSearch = () => {
  console.log("search");
};

const SearchPage: React.FC = () => {
  const [searchLoading, onSearchLoading] = useState(false);
  return (
    <div className={styles.searchPage}>
      <Row>
        <Col span={12} offset={8}>
          <img
            src="https://www.baidu.com/img/pc_d421b05ca87d7884081659a6e6bdfaaa.png"
            alt="img"
            width="60%"
          ></img>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={12}>
          <Search
            placeholder="输入并搜索"
            enterButton="搜索一下"
            onSearch={handleSearch}
            loading={searchLoading}
            size="large"
            prefix={<DribbbleOutlined />}
          />
        </Col>
      </Row>
      <div className={styles.searchCard}>
        <Row justify="center">
          <Col span={8} >
            热搜
          </Col>
          <Col span={8}>换一换</Col>
        </Row>
        <Row justify="center">
          <Col span={12} >
            <List>
              <List.Item>1. news1</List.Item>
            </List>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SearchPage;
