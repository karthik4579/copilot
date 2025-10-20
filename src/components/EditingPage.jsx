import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import supabase from "@/utils/GetSupabaseClient";
import Box from "@mui/material/Box";
import "@/styles/texteditorpage.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useHotkeys } from "react-hotkeys-hook";
import "@/styles/texteditorpage.css";
import Snackbar from "@mui/material/Snackbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "@mui/material/Card";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import moment from "moment";
import { ToggleButton } from "primereact/togglebutton";
import axios from "axios";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CircularProgress from "@mui/material/CircularProgress";
import "@/styles/texteditorpage.css";
import StaticMascotLogo from "../assets/copilot_mascot.png";

function TextEditor() {
  const [CurrentSuggestion, SetCurrentSuggestion] = useState("");
  const [EditorContent, setEditorContent] = useState("");
  const [passedFileData, setPassedFileData] = useState("");
  const [SpinnerState, setSpinnerState] = useState(false);
  const [NotificationStatus, setNotificationStatus] = useState(false);
  const [checked, setChecked] = useState(false);
  const [UsrToken, setUsrToken] = useState("");

  const location = useLocation();
  const editorRef = useRef(null);

  function SetSuggestion(suggestion) {
    SetCurrentSuggestion(suggestion);
  }

  function ConditionalAiCardContents() {
    const finaldata = CurrentSuggestion;
    if (SpinnerState) {
      return (
        <CircularProgress
          size={120}
          style={{ color: "white", position: "relative", top: "30% " }}
        />
      );
    } else if (CurrentSuggestion) {
      return (
        <div>
          {Object.entries(finaldata).map(([key, value], index) => (
            <Accordion
              key={index}
              style={{ background: "#949799", padding: "1%" }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body1">{key}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" style={{ padding: "1%" }}>
                  {<AutoAwesomeIcon />} Copilot's version:{" "}
                </Typography>
                <Typography style={{ paddingBottom: "4vh" }} variant="body1">
                  {value}
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    top: "1.5vh",
                    border: "2px solid white",
                    borderRadius: "10px",
                    width: "12vw",
                    height: "6vh",
                    padding: "1%",
                    background: "#424949",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ToggleButton
                    style={{ color: "white" }}
                    onLabel="Highlight ON"
                    offLabel="Highlight OFF"
                    onIcon={<VisibilityIcon />}
                    offIcon={<VisibilityOffIcon />}
                    checked={checked}
                    onChange={(e) => {
                      setChecked(e.value);
                      HighlightText(key, e.value);
                    }}
                    className="highlight-toggle"
                  />
                </Box>
                <Button
                  startIcon={<AutoFixHighIcon />}
                  variant="contained"
                  style={{
                    background: "#424949",
                    border: "2px solid white",
                    borderRadius: "10px",
                    bottom: "6.8vh",
                    left: "19.5vw",
                    width: "12vw",
                    height: "8vh",
                  }}
                  onClick={async () => {
                    const RawHtml = editorRef.current
                      .getContent()
                      .replace("&nbsp;", "");
                    const NewRawHtml = RawHtml.replace(`${key}`, `${value}`);
                    setEditorContent(NewRawHtml);
                    editorRef.current.setContent(NewRawHtml);
                    const filedata = { file_data: NewRawHtml };
                    await supabase
                      .from("file_data")
                      .update(filedata)
                      .eq("file_id", passedFileData.file_id);
                  }}
                >
                  Replace
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      );
    } else {
      return (
        <Typography
          variant="h5"
          style={{
            position: "relative",
            color: "white",
            top: "42%",
            opacity: "50%",
          }}
        >
          No suggestions yet 😊
        </Typography>
      );
    }
  }

  useEffect(() => {
    const fileData = location.state;
    setPassedFileData(fileData);
    async function updateLastOpenedStatus() {
      const OpenedTimeAndDate = moment().format("YYYY-MM-DDTHH:mm:ss");
      const FileID = fileData.file_id;
      const updateData = await supabase
        .from("file_data")
        .update({ last_opened: OpenedTimeAndDate })
        .eq("file_id", FileID);
    }
    updateLastOpenedStatus();
  }, []);

  useEffect(() => {
    async function get_file_data() {
      const FileData = await supabase
        .from("file_data")
        .select("file_data")
        .eq("file_id", passedFileData.file_id);
      setEditorContent(FileData["data"][0]["file_data"]);
      const CurrentUsrSession = await supabase.auth.getSession();
      setUsrToken(CurrentUsrSession["data"]["session"]["access_token"]);
    }
    get_file_data();
  }, [passedFileData]);

  async function SaveContent(receivedEvent, FromEditor) {
    if (FromEditor) {
      const documentContent = editorRef.current.getContent();
      if (editorRef.current) {
        setNotificationStatus(true);
        const filedata = { file_data: documentContent };
        await supabase
          .from("file_data")
          .update(filedata)
          .eq("file_id", passedFileData.file_id);
        setEditorContent(documentContent);
      }
    } else {
      receivedEvent.preventDefault();
      const documentContent2 = editorRef.current.getContent();
      if (editorRef.current) {
        setNotificationStatus(true);
        const filedata = { file_data: documentContent2 };
        await supabase
          .from("file_data")
          .update(filedata)
          .eq("file_id", passedFileData.file_id);
        setEditorContent(documentContent2);
      }
    }
  }

  useHotkeys("ctrl+s", (event) => SaveContent(event));

  function HighlightText(input_sentence, HighlightState) {
    if (HighlightState == true) {
      const RawHtml_ON = editorRef.current.getContent().replace("&nbsp;", "");
      const NewRawHtml_ON = RawHtml_ON.replace(
        input_sentence,
        `<mark>${input_sentence}</mark>`
      );
      setEditorContent(NewRawHtml_ON);
      editorRef.current.setContent(NewRawHtml_ON);
    } else {
      const RawHtml_OFF = editorRef.current.getContent().replace("&nbsp;", "");
      const NewRawHtml_OFF = RawHtml_OFF.replace(
        `<mark>${input_sentence}</mark>`,
        input_sentence
      );
      setEditorContent(NewRawHtml_OFF);
      editorRef.current.setContent(NewRawHtml_OFF);
    }
  }

  async function get_ai_response(type) {
    const InputText = editorRef.current.getContent();
    const parser = new DOMParser();
    const HtmlDoc = parser.parseFromString(InputText, "text/html");
    const ProcessedInput = HtmlDoc.documentElement.textContent;
    const BackendUrl = new URL(
      "/generate-suggestions",
      import.meta.env.VITE_BACKEND_URL
    ).href;
    if (type == "grammar") {
      const response = await axios.post(
        BackendUrl,
        {
          type: "grammar",
          input_text: ProcessedInput,
        },
        {
          headers: {
            Authorization: `Bearer ${UsrToken}`,
          },
        }
      );
      return JSON.parse(response.choices[0].message.content);
    } else {
      const response = await axios.post(
        BackendUrl,
        {
          type: "creative",
          input_text: ProcessedInput,
        },
        {
          headers: {
            Authorization: `Bearer ${UsrToken}`,
          },
        }
      );
      return JSON.parse(response.choices[0].message.content);
    }
  }

  if (passedFileData) {
    return (
      <div>
        <Snackbar
          open={NotificationStatus}
          autoHideDuration={4000}
          onClose={(CloseEvent, reason) => {
            if (reason === "clickaway") {
              setNotificationStatus(false);
              return;
            }
          }}
          action={
            <Button
              color="inherit"
              startIcon={<CloseIcon />}
              size="small"
              onClick={() => {
                setNotificationStatus(false);
              }}
            ></Button>
          }
          message={
            <div style={{ display: "flex", alignItems: "center" }}>
              <CheckCircleIcon style={{ color: "green" }} />
              <Typography
                variant="body"
                style={{ postion: "inherit", paddingLeft: "4vw" }}
              >
                Document saved
              </Typography>
            </div>
          }
        />
        <div className="right-side-shade"></div>
        <Button
          startIcon={<AutoAwesomeIcon />}
          className="creative-ai-button"
          variant="contained"
          style={{ background: "#424949" }}
          onClick={async () => {
            setSpinnerState(true);
            let results = await get_ai_response("creative");
            SetSuggestion(results);
            setSpinnerState(false);
          }}
        >
          Creative suggestions
        </Button>
        <Button
          startIcon={<AutoAwesomeIcon />}
          className="grammar-ai-button"
          variant="contained"
          style={{ background: "#424949" }}
          onClick={async () => {
            setSpinnerState(true);
            let results = await get_ai_response("grammar");
            SetSuggestion(results);
            setSpinnerState(false);
          }}
        >
          Grammar suggestions
        </Button>
        <Button
          variant="contained"
          style={{ background: "#424949" }}
          className="clear-all-button"
          startIcon={<DeleteForeverIcon />}
          onClick={() => {
            SetSuggestion("");
            setSpinnerState(false);
          }}
        >
          clear all suggestions
        </Button>
        <Card
          style={{
            position: "absolute",
            width: "35vw",
            left: "59vw",
            top: "21vh",
            padding: "10px",
            overflowX: "hidden",
            overflowY: "scroll",
            height: "70vh",
            boxShadow: "0 0 10px 10px #b400ff",
            borderRadius: "15px",
            backgroundColor: "#161616",
            scrollbarWidth: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {ConditionalAiCardContents()}
        </Card>

        <div>
          <img className="app-logo" src={StaticMascotLogo} alt="logo"></img>
          <div className="app-name">Copilot</div>
          <Avatar
            style={{ position: "absolute", left: "96%", bottom: "90%" }}
            sx={{ bgcolor: "#b400ff" }}
          >
            <AccountCircleIcon />
          </Avatar>
          <Box style={{ position: "absolute", bottom: "5vh", left: "2.5vw" }}>
            <Typography
              sx={{
                border: "2px solid grey",
                borderRadius: "8px",
                width: "20vw",
                height: "5vh",
                padding: "1px",
              }}
              variant="h6"
              style={{
                position: "relative",
                left: "0",
                bottom: "1vh",
                color: "white",
              }}
            >
              current file : {passedFileData.file_name}
            </Typography>
            <Editor
              style={{ borderRadius: "10px" }}
              apiKey={import.meta.env.VITE_TINYMCE_LICENSE_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={EditorContent}
              init={{
                init_instance_callback: function (editor) {
                  editor.addShortcut("ctrl+s", "Custom Ctrl+S", (InitEvent) => {
                    SaveContent(InitEvent, true);
                  });
                },
                selector: "textarea",
                skin: "oxide-dark",
                content_css: "dark",
                height: 420,
                width: 660,
                menubar: true,
                plugins:
                  "anchor export autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                tinycomments_mode: "embedded",
                branding: false,
                tinycomments_author: "Author name",
              }}
            />
          </Box>
        </div>
      </div>
    );
  }
}

export default TextEditor;
