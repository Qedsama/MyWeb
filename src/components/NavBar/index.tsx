import React from "react";
import styles from "./index.module.css";
import { Row, Col, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import jntm from "../../Assets/images/jntm.jpeg";

const NavBar: React.FC = () => {
  return (
    <div className={styles.navbar}>
      <Row justify="end">
        <Col xs={0} sm={4} md={10} lg={12} xl={12}>
          <span>
            <Avatar src={jntm} />
            放图标
          </span>
        </Col>
        <Col xs={0} sm={14} md={8} lg={6} xl={6} />
        <Col xs={4} sm={4} md={4} lg={4} xl={4}>
          <Link to="/login">
            <UserOutlined />
            登录
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default NavBar;
