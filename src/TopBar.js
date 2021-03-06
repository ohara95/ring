import React, { useState } from "react";
import ProfileModal from "./modal/ProfileModal";
import ChangeGroupModal from "./modal/ChangeGroupModal";

import { animateScroll as scroll } from "react-scroll";
import { Responsive, Button, Icon } from "semantic-ui-react";

const TopBar = ({
  modalChangeGroup,
  setModalChangeGroup,
  openChangeGroupModal,
  openHamburger,
  visible,
}) => {
  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  const [modalProfile, setModalProfile] = useState(false);

  const openProfileModal = () => setModalProfile(true);
  const closeProfileModal = () => setModalProfile(false);
  const closeChangeGroupModal = () => setModalChangeGroup(false);

  return (
    <>
      <Responsive {...Responsive.onlyTablet}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid gray",
          }}
        >
          <div
            onClick={scrollToTop}
            style={{
              fontSize: "30px",
              fontFamily: "Pacifico,cursive",
              height: 50,
              marginTop: 20,
              marginLeft: 10,
            }}
          >
            rin<span style={{ color: "red" }}>G</span>
          </div>
          <div style={{ marginRight: 10 }}>
            <div style={{ margin: 10 }}>
              <Button
                circular
                color="blue"
                size="mini"
                onClick={openProfileModal}
                inverted
              >
                <Icon name="user circle" /> プロフィール
              </Button>
              <ProfileModal
                modal={modalProfile}
                closeModal={closeProfileModal}
              />
              <div style={{ marginTop: 5 }}>
                <Button
                  circular
                  size="mini"
                  color="orange"
                  onClick={openChangeGroupModal}
                  inverted
                >
                  <Icon name="sync alternate" />
                  グループ設定
                </Button>
                <ChangeGroupModal
                  modal={modalChangeGroup}
                  closeModal={closeChangeGroupModal}
                />
              </div>
            </div>
          </div>
        </div>
      </Responsive>
      <Responsive {...Responsive.onlyMobile}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid gray",
          }}
        >
          <div
            onClick={scrollToTop}
            style={{
              fontSize: "30px",
              fontFamily: "Pacifico,cursive",
              height: 50,
              marginTop: 20,
              marginLeft: 10,
            }}
          >
            rin<span style={{ color: "red" }}>G</span>
          </div>
          <div style={{ margin: 10 }}>
            <button
              style={{ background: "none", border: "none" }}
              onClick={openHamburger}
            >
              <div>
                {visible ? (
                  <Icon name="cancel" style={{ fontSize: 30, marginTop: 10 }} />
                ) : (
                  <Icon
                    name="content"
                    style={{ fontSize: 30, marginTop: 10 }}
                  />
                )}
              </div>
            </button>
          </div>
        </div>
      </Responsive>
    </>
  );
};

export default TopBar;
