import React from 'react'
import { Layout } from 'antd';
import "./Home.css"

const { Header, Footer, Sider, Content } = Layout;
const Home = () => {
  return (
	<div>
   <Layout>
     <Content>
     <Search
      placeholder="input search text"
      allowClear
      enterButton="Search"
      size="large"
      onSearch={onSearch}
    />
     </Content>
      <Content>Content</Content>
      <Content>Content</Content>
    </Layout>

  </div>
  )
}

export default Home