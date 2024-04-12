import React, { useState } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";

import {
  Block,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  Row,
  Col,
  PreviewCard,
  PreviewAltCard,
  BlockBetween,
} from "../components/Component";

const Homepage = () => {
  const [sm, updateSm] = useState(false);
  return (
    <>
      <Head title="Homepage"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page tag="h3">
              Dashboard
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>Welcome to  Dashboard </p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              {/* <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="more-v" />
                </Button>
              
              </div> */}
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
       
      </Content>
    </>
  );
};
export default Homepage;
