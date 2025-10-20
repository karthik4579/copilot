import React, { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "@/styles/dashboard.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Imported AccountCircleIcon
import axios from "axios";
import supabase from "@/utils/GetSupabaseClient";
import StaticMascotLogo from "../assets/copilot_mascot.png";

function DashboardPage() {
  const [new_filename, set_new_filename] = useState("test_file");
  const [show_input, set_show_input] = useState(false);
  const [AllFileData, set_AllFileData] = useState([]);
  const [userInfo, setUserInfo] = useState({ username: "user", userid: "" });
  const redirect = useNavigate();

  function redirect_to_editor(file_id, file_name, file_data) {
    redirect("/edit", { state: { file_id, file_name, file_data } });
  }

  async function CreateNewFile(fileName) {
    const data = {
      user_id: userInfo["userid"],
      file_name: fileName,
      last_opened: moment().format("YYYY-MM-DDTHH:mm:ss"),
    };
    try {
      const insertfile = await supabase.from("file_data").insert(data);
      if (insertfile.status === 201) {
        set_show_input(false);
        const updatedfilelist = await supabase
          .from("file_data")
          .select("*")
          .eq("user_id", userInfo["userid"]);
        set_AllFileData(updatedfilelist.data);
      }
    } catch (error) {
      console.error("Error creating a new file:", error);
    }
  }

  async function HandleFileDelete(file_id) {
    try {
      const response = await supabase
        .from("file_data")
        .delete()
        .eq("file_id", file_id);

      if (response.status === 201 || response.status === 204) {
        const updatedfilelist = await supabase
          .from("file_data")
          .select("*")
          .eq("user_id", userInfo["userid"]);
        set_AllFileData(updatedfilelist.data);
      } else {
        console.error("Failed to delete the file:", response);
      }
    } catch (error) {
      console.error("Error deleting the file:", error);
    }
  }

  useEffect(() => {
    async function getUserInfo() {
      try {
        const userData = await supabase.auth.getUser();
        const userName = await supabase
          .from("user_data")
          .select("user_name")
          .eq("user_id", userData["data"]["user"]["id"]);
        setUserInfo((prev)=>{
          return{
          ...prev,
          username: userName["data"][0]["user_name"],
          userid: userData["data"]["user"]["id"],
        }
        });
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    }
    async function getFileData() {
      try {
        const userData = await supabase.auth.getUser();
        const allfiledata = await supabase
          .from("file_data")
          .select("*")
          .eq("user_id", userData["data"]["user"]["id"]);
        set_AllFileData(allfiledata.data);
      } catch (error) {
        console.error("Error fetching file data", error);
      }
    }
    getUserInfo();
    getFileData();
  }, []);

  return (
    <div>
      <img
        className="app-logo"
        src={StaticMascotLogo}
        alt="logo"
      />
      <div className="app-name">Copilot</div>
      <div className="user-greeting">Hello, {userInfo["username"]} 👋</div>
      <Button
        style={{ background: "#424949", borderRadius: "10px" }}
        startIcon={<AddBoxIcon />}
        variant="contained"
        className="add-file-button"
        onClick={() => set_show_input(true)}
      >
        New file
      </Button>
      <div
        style={{
          position: "absolute",
          top: "7%",
          right: "4%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          style={{ width: "50px", height: "50px" }}
          sx={{ bgcolor: "#b400ff" }}
        >
          <AccountCircleIcon />
        </Avatar>
        <Typography
          variant="caption"
          style={{ color: "white", marginTop: "5px" }}
        >
          My Profile
        </Typography>
      </div>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={show_input}
        onClick={() => set_show_input(false)}
      >
        <Card
          style={{
            minWidth: 300,
            minHeight: 200,
            background: "#222222",
            color: "white",
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <CardContent
            sx={{
              padding: "12%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              gap: "1.5em",
            }}
          >
            <Typography variant="body1">Enter file name</Typography>
            <TextField
              variant="filled"
              defaultValue="File name"
              onChange={(event) => set_new_filename(event.target.value)}
              sx={{ input: { color: "white" } }}
            />
            <Button
              variant="contained"
              style={{
                display: "flex",
                alignItems: "center",
                background: "#424949",
              }}
              onClick={() => {
                CreateNewFile(new_filename);
              }}
            >
              create
            </Button>
          </CardContent>
        </Card>
      </Backdrop>
      <Box
        style={{
          position: "relative",
          paddingLeft: "3%",
          left: "5vw",
          top: "13vh",
          width: "70%",
          overflowY: "auto",
          overflowX: "hidden",
          height: "61vh",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          boxShadow: "0 0 10px 10px #b400ff",
          borderRadius: "15px",
        }}
      >
        <div className="all-files">All files</div>
        <Row gutter={[0, 50]}>
          {AllFileData &&
            AllFileData.map(
              ({ user_id, file_id, file_name, file_data, last_opened }) => {
                return (
                  <Col span={8} key={file_id}>
                    <Card
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "85%",
                        height: "130%",
                        background: "#222222",
                        color: "white",
                        borderRadius: "10px",
                      }}
                    >
                      <CardContent>
                        <Typography variant="body1">
                          file name: {file_name}
                        </Typography>
                        <Typography variant="body1">
                          last opened:
                          {moment(last_opened).format("YYYY-MM-DD")}
                        </Typography>
                        <Button
                          style={{
                            background: "#424949",
                            position: "relative",
                            top: "3vh",
                            borderRadius: "10px",
                          }}
                          startIcon={<EditIcon />}
                          variant="contained"
                          onClick={() => {
                            redirect_to_editor(file_id, file_name, file_data);
                          }}
                        >
                          edit
                        </Button>
                        <Button
                          style={{
                            background: "#de2b51",
                            position: "relative",
                            top: "3vh",
                            borderRadius: "10px",
                            marginLeft: "10px",
                          }}
                          startIcon={<DeleteIcon />}
                          variant="contained"
                          onClick={() => {
                            HandleFileDelete(file_id);
                          }}
                        >
                          delete
                        </Button>
                      </CardContent>
                    </Card>
                  </Col>
                );
              }
            )}
        </Row>
      </Box>
    </div>
  );
}

export default DashboardPage;
