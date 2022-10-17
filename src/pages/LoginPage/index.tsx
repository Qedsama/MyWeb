import React, { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Captcha from "react-captcha-code";
import { Card, Input, Form, Button, message, Row, Col, Typography } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  //CheckCircleOutlined,
  WechatOutlined,
  QqOutlined,
  GithubOutlined,
} from "@ant-design/icons";

import styles from "./index.module.css";

const { Paragraph } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = useState("loginByPassword");

  // hooks for login by password
  const MAX_LOGIN_TIMES = 10;
  const MAX_LOGIN_WAIT_TIME = 15;
  const [passwdForm] = Form.useForm();
  const [loginTime, setLoginTime] = useState(0);
  const [loginBlock, setLoginBlock] = useState(false);
  const [loginWaitTime, setLoginWaitTime] = useState(MAX_LOGIN_WAIT_TIME);
  const [loginCaptcha, setLoginCaptcha] = useState("");
  const [loginCaptchaError, setLoginCaptchaError] = useState(false);
  const loginCaptchaRef = useRef<HTMLCanvasElement>();

  //hooks for sign up
  const MAX_SIGNUP_TIMES = 10;
  const MAX_SIGNUP_WAIT_TIME = 15;
  const [signUpForm] = Form.useForm();
  const [signUpTime, setSignUpTime] = useState(0);
  const [signUpBlock, setSignUpBlock] = useState(false);
  const [signUpWaitTime, setSignUpWaitTime] = useState(MAX_SIGNUP_WAIT_TIME);
  const [signUpCaptcha, setSignUpCaptcha] = useState("");
  const [signUpCaptchaError, setSignUpCaptchaError] = useState(false);
  const signUpCaptchaRef = useRef<HTMLCanvasElement>();

  //functions for login by password
  useEffect(() => {
    if (loginBlock && loginWaitTime > 0) {
      setTimeout(() => {
        setLoginWaitTime(loginWaitTime - 1);
      }, 1000);
    } else {
      setLoginBlock(false);
      setLoginTime(0);
      setLoginWaitTime(MAX_LOGIN_WAIT_TIME);
    }
  }, [loginBlock, loginWaitTime]);

  const handlePasswordLogin = async (value: any) => {
    if (loginBlock) return;
    setLoginTime(loginTime + 1);
    if (loginTime >= MAX_LOGIN_TIMES) {
      setLoginBlock(true);
      return;
    }

    if (loginCaptcha !== value.loginVerify) {
      setLoginCaptchaError(true);
      await (loginCaptchaRef as any).current.refresh();
      return;
    } else {
      setLoginCaptchaError(false);
    }

    try {
      const body = { username: value.username, password: value.password };
      const response = await axios.post("/user/login", body);
      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        message.success("login success");
        navigate("/home", { replace: true });
        window.location.reload();
      } else {
        passwdForm.resetFields();
        await (loginCaptchaRef as any).current.refresh();
        message.error("账号或密码错误");
      }
    } catch (err) {
      passwdForm.resetFields();
      await (loginCaptchaRef as any).current.refresh();
      message.error("登录失败");
    }
  };

  const handleCaptchaLoginChange = useCallback((captcha: any) => {
    setLoginCaptcha(captcha);
  }, []);

  //functions for sign up
  useEffect(() => {
    if (signUpBlock && signUpWaitTime > 0) {
      setTimeout(() => {
        setSignUpWaitTime(signUpWaitTime - 1);
      }, 1000);
    } else {
      setSignUpBlock(false);
      setSignUpTime(0);
      setSignUpWaitTime(MAX_SIGNUP_WAIT_TIME);
    }
  }, [signUpBlock, signUpWaitTime]);

  const handleSignUp = async (value: any) => {
    if (signUpBlock) return;
    setSignUpTime(signUpTime + 1);
    if (signUpTime >= MAX_SIGNUP_TIMES) {
      setSignUpBlock(true);
      return;
    }
    if (signUpCaptcha !== value.signUpVerify) {
      setSignUpCaptchaError(true);
      await (signUpCaptchaRef as any).current.refresh();
      return;
    } else {
      setSignUpCaptchaError(false);
    }
    try {
      const body = {
        username: value.username,
        password: value.password,
        name: value.name,
      };
      const response = await axios.post("/user/signup", body);
      if (response.status === 204) {
        message.success("sign up success");
        //navigate("/home", { replace: true });
        window.location.reload();
      } else {
        // TODO: 这里需要根据后端返回的响应码来判断是用户名已存在还是其他错误
        signUpForm.resetFields();
        await (signUpCaptchaRef as any).current.refresh();
        message.error("注册失败");
      }
    } catch (err) {
      console.log(err);
      signUpForm.resetFields();
      await (signUpCaptchaRef as any).current.refresh();
      message.error("注册失败");
    }
  };

  const handleCaptchaSignUpChange = useCallback((captcha: any) => {
    setSignUpCaptcha(captcha);
  }, []);

  const tabList = [
    {
      key: "signup",
      tab: "注册",
    },
    {
      key: "loginByPassword",
      tab: "密码登录",
    },
    {
      key: "loginByOther",
      tab: "其他方式登录",
    },
  ];

  const contentList: Record<string, React.ReactNode> = {
    loginByPassword: (
      <div>
        <Form
          name="loginByPassword"
          className="loginByPassword"
          initialValues={{ remember: true }}
          form={passwdForm}
          onFinish={handlePasswordLogin}
          style={{ padding: "25px" }}
          disabled={loginBlock}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="请输入用户名"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>

          <Row>
            <Col span={16}>
              <Form.Item name="loginVerify">
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="loginVerify"
                  placeholder="请输入验证码"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: "right", margin: "0 auto" }}>
                <Captcha
                  charNum={4}
                  onChange={handleCaptchaLoginChange}
                  ref={loginCaptchaRef as any}
                />
              </div>
            </Col>
          </Row>
          <div>
            <Paragraph
              style={{ paddingLeft: "10px", fontSize: "12px", color: "red" }}
            >
              {loginCaptchaError ? (
                <p>验证码错误</p>
              ) : loginBlock ? (
                <p>登录超过最大登录次数 ({loginWaitTime})s</p>
              ) : null}
            </Paragraph>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    ),
    signup: (
      <div>
        <Form
          name="signUp"
          className="signUpForm"
          initialValues={{ remember: true }}
          form={signUpForm}
          onFinish={handleSignUp}
          style={{ padding: "25px" }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              prefix={<MobileOutlined className="site-form-item-icon" />}
              placeholder="请输入用户名"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input
              prefix={<MobileOutlined className="site-form-item-icon" />}
              placeholder="请输入姓名"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            hasFeedback
            dependencies={["password"]}
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("确认密码与密码不一致，请重新输入")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="confirm"
              placeholder="请确认密码"
              size="large"
            />
          </Form.Item>

          <Row>
            <Col span={16}>
              <Form.Item name="signUpVerify">
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="signUpVerify"
                  placeholder="请输入验证码"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: "right", margin: "0 auto" }}>
                <Captcha
                  charNum={4}
                  onChange={handleCaptchaSignUpChange}
                  ref={signUpCaptchaRef as any}
                />
              </div>
            </Col>
          </Row>

          <div>
            <Paragraph
              style={{ paddingLeft: "10px", fontSize: "12px", color: "red" }}
            >
              {signUpCaptchaError ? (
                <p>验证码错误</p>
              ) : loginBlock ? (
                <p>登录超过最大登录次数 ({loginWaitTime})s</p>
              ) : null}
            </Paragraph>
          </div>

          <Paragraph
            style={{
              paddingLeft: "6px",
              fontSize: "12px",
              color: "red",
              display: "inline",
            }}
          >
            <p>密码为6-18位由数字和字母组成的字符串</p>
          </Paragraph>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              注册
            </Button>
          </Form.Item>
        </Form>
        <Paragraph
          style={{ paddingLeft: "10px", fontSize: "12px", color: "grey" }}
        >
          <p>注册即代表同意加入xfgg与brgg粉丝后援会</p>
        </Paragraph>
      </div>
    ),
    loginByOther: (
      <div style={{ marginTop: "50px", marginBottom: "50px" }}>
        <Row justify="center" align="top">
          <Col span={8}>
            <div style={{ textAlign: "center", margin: "0 auto" }}>
              <Button type="primary" shape="circle" name="wechat" size="large">
                <WechatOutlined />
              </Button>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: "center", margin: "0 auto" }}>
              <Button type="primary" shape="circle" name="qq" size="large">
                <QqOutlined />
              </Button>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: "center", margin: "0 auto" }}>
              <Button type="primary" shape="circle" name="github" size="large">
                <GithubOutlined />
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    ),
  };
  return (
    <div className={styles.loginPage}>
      <Card
        bordered={true}
        style={{ width: "500px" }}
        activeTabKey={activeTabKey}
        tabList={tabList}
        onTabChange={(key) => {
          setActiveTabKey(key);
        }}
      >
        {contentList[activeTabKey]}
      </Card>
    </div>
  );
};

export default LoginPage;
