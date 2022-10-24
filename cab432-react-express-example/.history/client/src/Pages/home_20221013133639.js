import React from 'react'
import { Layout,Search,Typography } from 'antd';
import "./Home.css"
import { Typography } from 'antd';

const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const { Title } = Typography;
const Home = () => {
  return (
	<div>
   <Layout>
     <Content>
       <Title>Please input the filtered keyword to search tweets</Title>
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