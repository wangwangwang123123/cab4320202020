import React, { useState } from 'react'
import { Input, Button, Layout, Typography, Modal,List} from 'antd';
import "./Home.css"

const { Header, Footer, Sider, Content, } = Layout;
const { Search } = Input;
const { Title } = Typography;



const Home = () => {
  let local = window.location.host
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tag, setTag] = useState();
  const [isGetTweets, setIsGetTweets] = useState(false)
  const [tweets, setTweets] = useState([])




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

  const getTweets = () => {
    fetch(`http://localhost:3000/twitter/getTweets/${tag}`)
      .then(res => res.json())
      .then(res => {
        console.log(res.map(res=>res.text))
        setTweets(res.map(res=>res.text))
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
            {isGetTweets === false ? <div></div> : <Button type="primary" onClick={getTweets} >Primary Button</Button>}
          </div>

        </Content>

        {/* tweets area */}
        <Content>
          <List
            size="large"
            header={<div>the {`${tag===undefined?}`} related tweets</div>}
            footer={<div>Footer</div>}
            bordered
            dataSource={tweets}
            renderItem={item => <List.Item>{item}</List.Item>}
          />

        </Content>



        {/* word cloud area */}
        <Content>Content</Content>
      </Layout>

    </div>
  )
}

export default Home