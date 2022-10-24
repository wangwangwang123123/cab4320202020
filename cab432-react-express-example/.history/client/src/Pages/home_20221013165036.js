import React, { useEffect } from 'react'
import { Input, Layout, Typography } from 'antd';
import "./Home.css"


const { Header, Footer, Sider, Content,Modal } = Layout;
const { Search } = Input;

const { Title } = Typography;

const Home = () => {
  let local = window.location.host
  const [isModalOpen, setIsModalOpen] = useState(false);




  const onSearch = (value) => {

    if (value) {
      setIsModalOpen(true);
      fetch(`http://${local}/twitter/add/${value}`)
        .then(res => {
          console.log(res)
      })
       


    } else {
      console.log("please input the keyword")
    }

  }

  const handleOk = () => {
    fetch(`http://${local}/twitter/dele/${value}`)
    .then(res => {
      console.log(res)
  })
    setIsModalOpen(false);
  };



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
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
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