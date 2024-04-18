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
import supabase from "@/utils/GetSupabaseClient";
import { Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "@/styles/dashboard.css";
import EditIcon from "@mui/icons-material/Edit";

function DashboardPage() {
  const [new_filename, set_new_filename] = useState("test_file");
  const [show_input, set_show_input] = useState(false);
  const [AllFileData, set_AllFileData] = useState([]);
  const [username, set_username] = useState("user");
  const [UserID, set_UserID] = useState("");
  const redirect = useNavigate();

  function redirect_to_editor(file_id, file_name, file_data) {
    redirect("/edit", { state: { file_id, file_name, file_data } });
  }

  async function create_new_file(fileName) {
    await supabase
      .from("file_data")
      .insert([
        {
          user_id: UserID,
          file_name: fileName,
          last_opened: moment().format("YYYY-MM-DDTHH:mm:ss"),
        },
      ]);
    set_show_input(false);
    window.location.reload();
  }

  useEffect(() => {
    async function handle_user_data() {
      const username = await supabase
        .from("user_data")
        .select("user_name")
        .eq("user_id", Cookies.get("id"));
      set_username(username.data[0].user_name);
      const AllFileData = await supabase
        .from("file_data")
        .select("*")
        .eq("user_id", Cookies.get("id"));
      set_AllFileData(AllFileData.data);
      set_UserID(Cookies.get("id"));
    }
    handle_user_data();
  }, []);

  return (
    <div>
      <img
        className="app-logo"
        src="./src/assets/copilot_mascot.png"
        alt="logo"
      />
      <div className="app-name">Copilot</div>
      <div className="user-greeting">Hello, {username} 👋</div>
      <Button
        style={{ background: "#424949",borderRadius:"10px" }}
        startIcon={<AddBoxIcon />}
        variant="contained"
        className="add-file-button"
        onClick={() => set_show_input(true)}
      >
        New file
      </Button>
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
                create_new_file(new_filename);
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
                        <Typography variant="body1">

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
