import React, { useState, useContext } from "react";
import TodoApp from "./todo_components/TodoApp";
import ChatApp from "./chat_components/ChatApp";
import SideBar from "./SideBar";
import { AuthContext } from "./AuthService";
import firebase from "./config/firebase";
import Spinner from "./Spinner";
import TopBar from "./TopBar";

import { Grid, Image, Button, Popup, Responsive } from "semantic-ui-react";

const TopPage = () => {
  const { groups, user, users, currentGroup, loading, setLoading } = useContext(
    AuthContext
  );

  const [modalChangeGroup, setModalChangeGroup] = useState(false);
  const openChangeGroupModal = () => setModalChangeGroup(true);

  const pullImage = () => {
    if (user && users) {
      const conf = users.find((pull) => pull.id === user.uid);
      return conf.avatar;
    }
  };

  // データが入る順番でカレントユーザーがなくてエラーになってるかも？
  const pullName = () => {
    if (groups) {
      const conf = groups.find((group) => group.id === currentGroup);
      return conf.groupName;
    }
    // Cannot read property 'groupName' of undefined
  };

  if (!user || !users) {
    setLoading(true);
  } else {
    setLoading(false);
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="fixed_item" style={{ zIndex: 10 }}>
            <Responsive maxWidth={1030}>
              <TopBar
                modalChangeGroup={modalChangeGroup}
                setModalChangeGroup={setModalChangeGroup}
                openChangeGroupModal={openChangeGroupModal}
              />
            </Responsive>
          </div>
          <div style={{ padding: "1em" }}>
            <Grid>
              <Grid.Row>
                <div className="fixed_item">
                  <Grid.Column width={4}>
                    <Responsive minWidth={1031}>
                      <SideBar
                        modalChangeGroup={modalChangeGroup}
                        setModalChangeGroup={setModalChangeGroup}
                        openChangeGroupModal={openChangeGroupModal}
                      />
                    </Responsive>
                  </Grid.Column>
                </div>
                <Grid.Column width={9}>
                  {groups ? <div>{pullName()}</div> : null}
                  {users ? <Image src={pullImage()} size="mini" avatar /> : ""}
                  <ChatApp />
                </Grid.Column>
                <Grid.Column width={3} className="fixed_item">
                  <div className="fixed_item">
                    <TodoApp />
                    <Popup
                      trigger={
                        <Button
                          size="huge"
                          icon="sign-out"
                          circular
                          color="red"
                          inverted
                          className="fixed_btn"
                          onClick={() => {
                            firebase
                              .auth()
                              .signOut()
                              .then((obj) => {
                                // setLoading(false);
                                console.log(obj, "signOutObj");
                                setLoading(false);
                              })
                              .catch((err) => {
                                console.log(err, "signOutErr");
                              });
                          }}
                        />
                      }
                      content="ログアウト"
                      basic
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </>
      )}
    </>
  );
};

export default TopPage;

// <Grid.Column>{/* <CalendarApp /> */}</Grid.Column>;
// columns = "equal";
