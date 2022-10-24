import React from 'react'
import { Layout } from 'antd';
import "./Home.css"

const { Header, Footer, Sider, Content } = Layout;
const Home = () => {
  return (
	<div>
   <Layout>
   <Content>Content</Content>
      <Content>Content</Content>
      <Footer>Footer</Footer>
    </Layout>

  </div>
  )
}

export default Home