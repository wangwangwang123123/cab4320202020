import React from 'react'
import { Input,Layout,Typography } from 'antd';
import "./Home.css"


const { Header, Footer, Sider, Content } = Layout;
const { Search } = Input;

const { Title } = Typography;
const Home = () => {


  const onSearch  = (value) =>{
    fetch(`http://${local}/add?{}`)
    .then(res=>res.json())
    .then(res=>{
      console.log(res)
    })
  }

  
  return (
	<div>
   <Layout>
    <Header>
        Header!!!!
    </Header>

   {/* search area */}
     <Content>
      <div className='searchArea'>
        <Title>Please input the filtered keyword to search tweets</Title>
          <Search
            placeholder="input search text"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
          />
      </div>
     
     </Content>

        {/* tweets area */}
      <Content>Content</Content>



          {/* word cloud area */}
      <Content>Content</Content>
    </Layout>

  </div>
  )
}

export default Home