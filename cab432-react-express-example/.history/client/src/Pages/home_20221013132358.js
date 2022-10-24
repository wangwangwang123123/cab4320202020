import React from 'react'
import { Layout } from 'antd';


const { Header, Footer, Sider, Content } = Layout;
const Home = () => {
  return (
	<div>
   <Layout>
      <Header>Header</Header>
      <Content>Content</Content>
      <Footer>Footer</Footer>
    </Layout>

  </div>
  )
}

export default Home