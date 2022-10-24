import React, { useState } from 'react'
import { Input, Button, Layout, Typography, Modal, List,Divider } from 'antd';
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
  const [sentiment, setSentiment,] = useState(false)
  const[isSentiment, setIsSantiment] = useState(false)


  const [positiveTweets,setPositiveTweets] = useState([])
  const [negativeTweets,setNegativeTweets] = useState([])
  const [emotionlessTweets,setEmotionlessTweet] = useState([])



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
    fetch(`http://${local}/twitter/getTweets/${tag}`)
      .then(res => res.json())
      .then(res => {
        console.log(res.map(res => res.text))
        setTweets(res.map(res => res.text))
      })
    setIsGetTweets(false)
    setSentiment(true)


  }
  const sentimentAnalysis = () => {
    fetch(`http://${local}/sen/${tag}`).then(res => res.json())
      .then(res => {
          let positiveT = []
          let  negativeT = []
          let emotionlessT = []
          if()


      })
    setIsSantiment(true)
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
            {isGetTweets === false ? <div></div> : <Button type="primary" onClick={getTweets} >get tweets</Button>}
            {sentiment === false ? <div></div> : <Button type="primary" onClick={sentimentAnalysis} >sentiment Analysis</Button>}

          </div>

        </Content>

        {/* tweets area */}
        <Content>
          {isSentiment === false ? <List
            size="large"

            header={<div>the related tweets: {`${tag === undefined ? " " : tag}`} </div>}
            footer={<div>Footer</div>}
            bordered
            dataSource={tweets}
            renderItem={item => <List.Item>{item}</List.Item>}
          /> :
            <div>
              <Divider orientation="left">Positive</Divider>
              <List
                size="small"
                bordered
                dataSource={positiveTweets}
                renderItem={item => <List.Item>{item}</List.Item>}
              />
              <Divider orientation="left">Negative</Divider>
              <List
                size="small"
                bordered
                dataSource={negativeTweets}
                renderItem={item => <List.Item>{item}</List.Item>}
              />
              <Divider orientation="left">Emotionless</Divider>
              <List
                size="small"
                bordered
                dataSource={emotionlessTweets}
                renderItem={item => <List.Item>{item}</List.Item>}
              />


            </div>




          }


        </Content>



        {/* word cloud area */}
        <Content>Content</Content>
      </Layout>

    </div>
  )
}

export default Home