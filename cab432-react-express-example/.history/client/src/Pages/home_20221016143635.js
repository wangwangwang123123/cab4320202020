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
  const [isWordCloud,setIsWordCloud] = useState(false)


  const [positiveTweets,setPositiveTweets] = useState([])
  const [nagetiveTweets,setnagetiveTweets] = useState([])
  const [emotionlessTweets,setEmotionlessTweet] = useState([])

  const [positiveWcData,setPositiveWcData] = useState()
  const [nagetiveWcData,setnagetiveWcData] = useState()

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


  const handleOk = () => {
    fetch(`http://${local}/twitter/delete`)
    console.log(1)
    setIsModalOpen(false)
    setIsGetTweets(true)
    setIsWordCloud(false)

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
    setIsWordCloud(false)


  }
  const sentimentAnalysis = () => {
    fetch(`http://${local}/sen/${tag}`).then(res => res.json())
      .then(res => {
          let positiveT = []
          let nagetiveT = []
          let emotionlessT = []
          res.map(res=>{
            if(res.sentiment==="positive"){
              positiveT.push(res.text)
            }else if(res.sentiment==="nagetive"){
              nagetiveT.push(res.text)
            }else{
              emotionlessT.push(res.text)
            }
          })
          setPositiveTweets(positiveT)
          setnagetiveTweets(nagetiveT)
          setEmotionlessTweet(emotionlessT)


      })
    setIsSantiment(true)
    setIsWordCloud(true)
  }
  const getPositiveWC =()=>{
    fetch(`http://${local}/Count/positive/${tag}`)
    .then(res=>res.json)
    .then(res=>{
      console.log(res)
      setPositiveWcData(res)
      setIsWordCloud(true)
    })
  }
  const getNagetiveWC=()=>{
    fetch(`http://${local}/Count/negative/${tag}`)
    .then(res=>res.json)
    .then(res=>{
      console.log(res)
      setnagetiveWcData(res)
      setIsWordCloud(true)
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
              {isWordCloud===false? <List
                size="small"
                bordered
                dataSource={positiveTweets}
                renderItem={item => <List.Item>{item}</List.Item>}
              />:}
             
              <Divider orientation="left">Nagetive</Divider>
              <Button type="primary" onClick={getNagetiveWC} >get Nagetive Word Count Cloud</Button>
              <List
                size="small"
                bordered
                dataSource={nagetiveTweets}
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