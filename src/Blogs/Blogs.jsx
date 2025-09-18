import React from "react";
import "./Blogs.css";

const Blogs = () => {
  const blogItem = [
    {
      heading: "Get started",
      context:
        "Read our getting started guide to get the most out of your Capitalmind subscription.",
    },
    {
      heading: "Community",
      context:
        "Join the conversation on our exclusive community on Slack for Capitalmind Premium subscribers",
    },
    {
      heading: "Visit website",
      context: "Keep up with our latest content on our website.",
    },
  ];

  const posts = [
    {
      title: "CM Fixed Income: Exiting Banking & PSU to Add a New Gilt Fund",
      date: "Άρι 18, 2024",
      content:
        "We are increasing the duration of our Fixed Income portfolio to reflect the current macro conditions. We want to take advantage of the current higher rates to further Increase the duration of the Gilt funds we hold. Read more...",
    },
    {
      title: "Craftsman Automation: Poised for Growth Amid Temporary Headwinds",
      date: "Apr 05, 2024",
      content:
        "Unlock this post by trail. Craftsman Automation ancol in making precise parte for cars and machines. Amidst temporary headwinds, looks with on growth and innovation.....",
    },
    {
        title: "The Focused Way of Investing: Our Four-Quadrant Strategy and FY24 Review",
        date: "Apr 03, 2024",
        content:"FY24 brought us a 42% gain in our Capitalmind Focused portfolio, gently outperforming the Nifty's 29%. It's been a bit of a rollercoaster, especially these last few months, but that's part of the equity investing. It's like having a compass"
    },
    {
        title:'Poonawalla Fincorp: One right step at a time',
        date:'Mar 29, 2024',
        content:'Poonawalla Fincorp is a non-banking financial company (NBFC) that primarily focuses on providing vehicle loans, SME loans, and personal loans. The company has a strong presence in the southern and western regions of India, with a network of over 500 branches across 15 states. Unlock this post by trail.'
    },
    {
        title:'L&T Technology Services: Riding the Wave of Digital Transformation',
        date:'Mar 27, 2024',
        content:'L&T Technology Services (LTTS) is a leading global engineering services company that provides a wide range of services, including product development, digital transformation, and engineering consulting. The company has a strong presence in the automotive, aerospace, and industrial sectors. Unlock this post by trail.'
    },
    {
        title:'HDFC Bank: A Steady Performer in the Banking Sector',
        date:'Mar 25, 2024',
        content:'HDFC Bank is one of the largest private sector banks in India. The bank has a strong presence in both urban and rural areas, with a network of over 5,000 branches and 13,000 ATMs across the country. HDFC Bank is known for its strong customer service and innovative products. Unlock this post by trail.'
    },
    {
        title:'Bajaj Finance: A Leading Player in the NBFC Sector',
        date:'Mar 22, 2024',
        content:'Bajaj Finance is one of the largest non-banking financial companies (NBFCs) in India. The company has a strong presence in the consumer finance, SME finance, and commercial vehicle finance segments. Bajaj Finance is known for its strong brand and customer-centric approach. Unlock this post by trail.'
    }
  ];
  return (
    <div className="blogs">
      <h4 className="heading">Home</h4>
      <div className="blog-items">
        {blogItem.map((item, index) => (
          <div key={index} className="blog-item" style={{}}>
            <div className="item-heading-div">
              <h3 className="item-heading">{item.heading}</h3>
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </div>
            <p className="item-context">{item.context}</p>
          </div>
        ))}
      </div>
      <div className="posts">
        <h4 className="posts-heading">Latest Posts</h4>
        <div className="posts-list">
            {posts.map((post, index) => (<div key={index} className="post">
                <p className="post-date">{post.date}</p>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-content">{post.content}</p>
                <p className="readpost">Read full post</p>
            </div>))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
