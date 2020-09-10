import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthService";
import firebase, { storage } from "../config/firebase";
import { AlertModal } from "../atoms/AlertModal";

import {
  Button,
  Modal,
  Icon,
  Image,
  Form,
  Input,
  Grid,
} from "semantic-ui-react";

const ProfileModal = ({ modal, closeModal }) => {
  const [avatarImage, setAvatarImage] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birth, setBirth] = useState("");
  const [reset, setReset] = useState("");
  const [passwordModal, setPasswordModal] = useState(false);
  const [upload, setUpload] = useState(false);
  const [avatarCheck, setAvatarCheck] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);

  const AlertOpen = () => setAlertOpen(true);
  const AlertClose = () => setAlertOpen(false);

  const { users, user } = useContext(AuthContext);
  const db = firebase.firestore();

  const openPasswordModal = () => setPasswordModal(true);
  const closePasswordModal = () => setPasswordModal(false);

  // firebaseへ情報を追加
  // const userDetails = async () => {
  // docにuser.uidを指定するパターン
  // db.collection("users")
  //   .doc(user.uid)
  //   .set({
  //     user: {
  //       id: user.uid,
  //       name,
  //       avatar: avatarUrl,
  //       birth: birth,
  //     },
  //   });

  // whereで指定するパターン
  // const dbUser = await db
  //   .collection("users")
  //   .where("id", "==", user.uid)
  //   .get();
  // dbUser.docs[0].ref.set({
  //   user: {
  //     id: user.uid,
  //     name,
  //     avatar: avatarUrl,
  //     birth: birth,
  //   },
  // });
  // };

  const handlePreview = (e) => {
    const file = e.target.files[0];
    setAvatarImage(file);
  };

  const onBtnClick = () => {
    // プロフィール
    // 何も変更なければ閉じる
    if (!name && !avatarCheck) {
      alert("何も変更されてません");
      return;
    }
    // firestoreの更新
    if (name) {
      db.collection("users")
        // .where("id", "==", user.uid)
        // .get()
        .doc(user.uid)
        .update({
          name,
        })
        .then(() => {
          // conf.docs[0].ref.update({
          //   name,
          // });
          console.log("store,name,update");
          closeModal();
        })
        .catch((err) => console.log(err));

      // authの更新
      //   information
      //     .updateProfile({
      //       // 名前変更
      //       displayName: name,
      //     })
      //     .then(() => {
      //       console.log("auth,name,update");
      //       setName("");
      //       closeModal();
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
    }

    if (avatarImage) {
      // firestoreの更新
      db.collection("users")
        // .where("id", "==", user.uid)
        // .get()
        .doc(user.uid)
        .update({
          avatar: avatarUrl,
        })
        .then(() => {
          // conf.docs[0].ref.update({
          //   avatar: avatarUrl,
          // });
          console.log("store,avatar,update");
          closeModal();
          setAvatarCheck(false);
        })
        .catch((err) => console.log(err));

      // authの更新
      // information
      //   .updateProfile({
      //     // 画像変更
      //     photoURL: avatarUrl,
      //   })
      //   .then(() => {
      //     console.log("auth,avatar更新成功");
      //     closeModal();
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    }

    // 誕生日
    if (birth) {
      db.collection("users").doc(user.uid).update({
        birth,
      });
    }
  };

  // パスワードリセット
  const onPasswordClick = (value) => {
    if (!value) {
      alert("パスワード変更の方 : メールアドレスが入力されていません");
    }
    const auth = firebase.auth();
    const emailAddress = value;

    auth
      .sendPasswordResetEmail(emailAddress)
      .then(() => {
        console.log("パスワードリセット");
        closePasswordModal();
        setReset("");
      })
      .catch((err) => console.log(err));
    closePasswordModal();
  };

  // アドレス変更
  const ChangeAddress = (email, password) => {
    const information = firebase.auth().currentUser;

    if (!email) {
      alert("メールアドレスを入力してください");
    } else if (!password) {
      alert("パスワードを入力してください");
      console.log(password, "pass");
    } else {
      const credential = firebase
        .auth()
        // 既存のユーザーをログインさせる
        .signInWithEmailAndPassword(email, password);

      information
        .updateEmail(email)
        .then(() => {
          console.log("アドレス変更完了");
          setEmail("");
          setPassword("");
          closeModal();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // 画像アップロード
  const prevAvatar = () => {
    if (avatarImage === "") {
      alert("ファイルを選択されていません");
      return;
    }
    setUpload(true);
    setAvatarCheck(true);
    // アバターアップロード
    const uploadTask = storage
      .ref(`/icons/${avatarImage.name}`)
      .put(avatarImage);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      next,
      error,
      complete
    );
  };

  const next = (snapshot) => {
    // 進行中のsnapshotを得る
    // アップロードの進行度を表示
    const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log(percent + "% done");
  };

  // エラーハンドリング
  const error = (err) => console.log(err);

  // useEffect?
  const complete = () => {
    // 完了後の処理
    // 画像表示のため、アップロードした画像のURLを取得
    storage
      .ref("icons")
      .child(avatarImage.name)
      .getDownloadURL()
      .then((fireBaseUrl) => {
        setAvatarUrl(fireBaseUrl);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const pullName = () => {
    if (user && users) {
      const conf = users.find((usersName) => user.uid === usersName.id);
      return conf.name;
    }
  };

  const image = () => {
    if (!avatarUrl) {
      return (
        <Image
          src={user ? user.photoURL : null}
          height={120}
          width={120}
          size="small"
          circular
          style={{ margin: "0 auto" }}
        />
      );
    } else if (avatarUrl && upload && users && user && user.uid === users.id) {
      return (
        <Image
          src={users.avatar}
          height={120}
          width={120}
          size="small"
          circular
          style={{ margin: "0 auto" }}
        />
      );
    }
  };

  const imageAvatar = () => {
    if (users) {
      const conf = users.find((pullImage) => pullImage.id === user.uid);
      return conf.avatar;
    }
  };

  const checkPrev = () => {
    if (upload) {
      return (
        <Image
          src={avatarUrl}
          height={120}
          width={120}
          size="small"
          circular
          style={{ margin: "0 auto" }}
        />
      );
    } else {
      return (
        <>
          {imageAvatar() ? (
            <Image
              src={users && imageAvatar()}
              height={120}
              width={120}
              size="small"
              circular
              style={{ margin: "0 auto" }}
            />
          ) : (
            <Image
              src={user ? user.photoURL : null}
              height={120}
              width={120}
              size="small"
              circular
              style={{ margin: "0 auto" }}
            />
          )}
        </>
      );
    }
  };

  return (
    <>
      <Modal open={modal} onClose={closeModal}>
        <Modal.Header>プロフィール</Modal.Header>
        <Modal.Content style={{ width: "100%" }}>
          <Grid.Column style={{ margin: "0 auto", width: "25%" }}>
            <Grid.Row centered>
              {checkPrev()}
              <Button onClick={prevAvatar} basic>
                　アバタープレビュー
              </Button>
            </Grid.Row>
          </Grid.Column>
          <Form>
            <Form.Field>
              <label>アバターの変更</label>
              <Input type="file" onChange={handlePreview} />
            </Form.Field>
            <Form.Field>
              <label>名前の変更</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder={user ? pullName() : ""}
              />
            </Form.Field>
            {/* <Form.Field>
              <label>誕生日の設定</label>
              <Input
                type="date"
                placeholder="生年月日"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
              />
            </Form.Field> */}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={openPasswordModal} basic color="blue">
            <Icon name="key" />
            パスワード変更
          </Button>
          <Button onClick={closeModal} basic color="red">
            <Icon name="remove" />
            キャンセル
          </Button>
          <Button basic color="green" onClick={onBtnClick}>
            <Icon name="checkmark" />
            保存
          </Button>
        </Modal.Actions>
      </Modal>

      <Modal open={passwordModal} onClose={closePasswordModal}>
        <Modal.Header style={{ width: "100%", display: "flex" }}>
          <span>メールアドレスorパスワード再設定</span>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>メールアドレスの変更</label>
              <Input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="mail"
                placeholder={user ? user.email : ""}
              />
            </Form.Field>
            <Form.Field>
              <label>
                ※メールアドレスを変更する場合はパスワードを入力してください
              </label>
              <Input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
              />
            </Form.Field>
            <Button
              basic
              color="green"
              onClick={() => {
                ChangeAddress(email, password);
              }}
            >
              送信
            </Button>
          </Form>
        </Modal.Content>
        <Modal.Content>
          <Form
            onSubmit={() => {
              onPasswordClick(reset);
            }}
          >
            <Form.Field>
              <label>パスワード変更の方はアドレスを入力してください</label>
              <Input
                type="email"
                value={reset}
                onChange={(e) => {
                  setReset(e.target.value);
                }}
              />
            </Form.Field>
            <Button
              basic
              color="green"
              onClick={() => {
                onPasswordClick(reset);
              }}
            >
              送信
            </Button>
            <Button
              basic
              color="red"
              style={{ float: "right" }}
              onClick={closePasswordModal}
            >
              戻る
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
      <AlertModal
        open={alertOpen}
        close={AlertClose}
        title="確認"
        text="何も変更されてませんがよろしいですか？"
      />
    </>
  );
};

export default ProfileModal;
