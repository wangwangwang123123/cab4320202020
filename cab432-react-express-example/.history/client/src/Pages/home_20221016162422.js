import React, { useState } from 'react'
import { Input, Button, Layout, Typography, Modal, List, Divider } from 'antd';
import "./Home.css"
import WordCountCloud from "./WordCountCloud"

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
  const [isSentiment, setIsSantiment] = useState(false)
  const [isPoWordCloud, setIsPoWordCloud] = useState(false)
  const [isNaWordCloud, setIsNeWordCloud] = useState(false)
  const [loading, setLoading] = useState(false);

  const [positiveTweets, setPositiveTweets] = useState([])
  const [negativeTweets, setNegativeTweets] = useState([])
  const [emotionlessTweets, setEmotionlessTweet] = useState([])

  const [positiveWcData, setPositiveWcData] = useState(null)
  const [negativeWcData, setNegativeWcData] = useState(null)

  const onSearch = (value) => {
    if (value) {
      setTag(value)
      fetch(`http://${local}/twitter/add/${value}`)
        .then(res => {
          console.log(res)
        })
      setIsModalOpen(true);

      setIsGetTweets(false)
      setIsSantiment(false)


    } else {
      console.log("please input the keyword")
    }

  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOk = () => {
    fetch(`http://${local}/twitter/delete`)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsModalOpen(false);
    }, 3000);
    setIsGetTweets(true)
    setIsPoWordCloud(false)
    setIsNeWordCloud(false)

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


    setIsPoWordCloud(false)
    setIsNeWordCloud(false)


  }
  const sentimentAnalysis = () => {
    fetch(`http://${local}/sen/${tag}`).then(res => res.json())
      .then(res => {
        let positiveT = []
        let negativeT = []
        let emotionlessT = []
        res.map(res => {
          if (res.sentiment === "positive") {
            positiveT.push(res.text)
          } else if (res.sentiment === "negative") {
            negativeT.push(res.text)
          } else {
            emotionlessT.push(res.text)
          }
        })
        setSentiment(false)
        setPositiveTweets(positiveT)
        setNegativeTweets(negativeT)
        setEmotionlessTweet(emotionlessT)


      })
    setIsSantiment(true)
  }
  const getPositiveWC = () => {
    fetch(`http://${local}/Count/positive/${tag}`)
      .then(res => res.json())
      .then(res => {
        console.log(res)
        setPositiveWcData(res)
        setIsPoWordCloud(true)
      })
  }
  const getNegativeWC = () => {
    fetch(`http://${local}/Count/negative/${tag}`)
      .then(res => res.json())
      .then(res => {
        console.log(res)
        setNegativeWcData(res)
        setIsNeWordCloud(true)

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
            <Modal title="Please wait 10s to get the tweets"
              open={isModalOpen}
              onOk={handleCancel}
              onCancel={handleCancel}
              loading={loading}

            >
              <Button

                type="primary"
                loading={loading}
                onClick={handleOk}
              >
                please wait 10
              </Button>


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
              <Button type="primary" onClick={getPositiveWC} >get Positive Word Count Cloud</Button>
              {isPoWordCloud === false ? <List
                size="small"
                bordered
                dataSource={positiveTweets}
                renderItem={item => <List.Item>{item}</List.Item>}
              /> : <WordCountCloud data={positiveWcData} />
              }



              <Divider orientation="left">Negative</Divider>
              <Button type="primary" onClick={getNegativeWC} >get Negative Word Count Cloud</Button>
              {isNaWordCloud === false ? <List
                size="small"
                bordered
                dataSource={negativeTweets}
                renderItem={item => <List.Item>{item}</List.Item>}
              /> :
                <WordCountCloud data={negativeWcData} />
              }
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