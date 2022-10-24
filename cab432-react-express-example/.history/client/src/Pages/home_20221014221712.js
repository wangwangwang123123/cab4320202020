import React, { useState } from 'react'
import { Input, Layout, Typography, Modal } from 'antd';
import "./Home.css"

const { Header, Footer, Sider, Content, } = Layout;
const { Search } = Input;
const { Title } = Typography;



const Home = () => {
  let local = window.location.host
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tag, setTag] = useState();
  const [isGetTweets,setIsGetTweets] = useState(false)




  const onSearch = (value) => {
    if (value) {
      setTag(value)
      fetch(`http://${local}/twitter/add/${value}`)
        .then(res => {
          console.log(res)
        })
      setIsModalOpen(true);


    } else {
      console.log("please input the keyword")
    }

  }


  const handleOk = () => {
    fetch(`http://${local}/twitter/delete`)
    console.log(1)
    setIsModalOpen(false)
    setIsGetTweets(true)
     
  };

  const getTweets =() =>{
    console.log(2)
    console.log(tag)
    fetch(`http://localhost:3000/twitter/getTweets/${tag}`)
    .then(res => {
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
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} >
              <p>please wait the twitter  stream get the tweets</p>
              <p>or click ok to finish the  stream </p>
            </Modal>
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