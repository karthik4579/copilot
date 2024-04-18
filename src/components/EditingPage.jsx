import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import supabase from "@/utils/GetSupabaseClient";
import Box from "@mui/material/Box";
import "@/styles/texteditorpage.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import client from "@/utils/GetAiClient";
import { useHotkeys } from "react-hotkeys-hook";
import "@/styles/texteditorpage.css";
import Snackbar from "@mui/material/Snackbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import ToggleButton from "@mui/material/ToggleButton";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import GenAIAccordian from "@/components/GenAccordian";

function TextEditor() {
  const [GrammerSug, SetGrammarSug] = useState([]);
  const [CreativeSug, SetCreativeSug] = useState([]);
  const [EditorContent, setEditorContent] = useState("");
  const [passedFileData, setPassedFileData] = useState("");
  const [NotificationStatus, setNotificationStatus] = useState(false);

  const location = useLocation();
  const editorRef = useRef(null);

  useEffect(() => {
    const fileData = location.state;
    setPassedFileData(fileData);
    async () => {
      const { data, error } = await supabase
        .from("file_data")
        .update({ last_opened: moment().format("YYYY-MM-DDTHH:mm:ss") })
        .eq("file_id", passedFileData.file_id);
    };
  }, []);

  async function SaveContent(receivedEvent, FromEditor) {
    if (FromEditor) {
      if (editorRef.current) {
        const documentContent = editorRef.current.getContent();
        setNotificationStatus(true);
        const { data, error } = await supabase
          .from("file_data")
          .update({ file_data: documentContent })
          .eq("file_id", passedFileData.file_id);
        setEditorContent(documentContent);
      }
    } else {
      receivedEvent.preventDefault();
      if (editorRef.current) {
        const documentContent = editorRef.current.getContent();
        setNotificationStatus(true);
        const { data, error } = await supabase
          .from("file_data")
          .update({ file_data: documentContent })
          .eq("file_id", passedFileData.file_id);
        setEditorContent(documentContent);
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
    const GrammarResponse = await fetch(
      "https://gist.githubusercontent.com/karthik4579/496a2a095355a952d18bc6b29e348d78/raw/90cb34f8024749073771c0d3dea3eddc81c990be/grammar_prompt.txt"
    );
    const GrammarTxtContents = await GrammarResponse.text();

    const CreativeResponse = await fetch(
      "https://gist.githubusercontent.com/karthik4579/3995b4d40e565ea3f552fe4737edd8f0/raw/7fa9d9af621e2d949290f3b93fe4ebf943b631df/creative_prompt.txt"
    );
    const CreativeTxtContents = await CreativeResponse.text();

    const InputText = editorRef.current.getContent();
    const parser = new DOMParser();
    const HtmlDoc = parser.parseFromString(InputText, "text/html");
    const ProcessedInput = HtmlDoc.documentElement.textContent;
    console.log(ProcessedInput);
    if (type == "grammar") {
      const response = await client.chat.completions.create({
        messages: [
          { role: "system", content: GrammarTxtContents },
          { role: "user", content: "INPUT TEXT:" + "\n" + "" + ProcessedInput },
        ],
        model: "mixtral-8x7b-32768",
        response_format: { type: "json_object" },
        temperature: 0.5,
        top_p: 0.55,
        stream: false,
        max_tokens: 3500,
      });
      return response.choices[0].message.content;
    } else {
      const parser = new DOMParser();
      const HtmlDoc = parser.parseFromString(InputText, "text/html");
      const ProcessedInput = HtmlDoc.documentElement.textContent;
      console.log(ProcessedInput);
      const response = await client.chat.completions.create({
        messages: [
          { role: "system", content: CreativeTxtContents },
          { role: "user", content: "INPUT TEXT:" + "\n" + "" + ProcessedInput },
        ],
        model: "mixtral-8x7b-32768",
        response_format: { type: "json_object" },
        temperature: 0.7,
        top_p: 0.9,
        stream: false,
        max_tokens: 3500,
      });
        return response.choices[0].message.content;
    }
  }

  if (passedFileData) {
    return (
      <div>
        <div className="right-side-shade"></div>
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
                style={{ postion: "relative", paddingLeft: "4vw" }}
              >
                Document saved
              </Typography>
            </div>
          }
        />
        <Button
          startIcon={<AutoAwesomeIcon />}
          className="creative-ai-button"
          variant="contained"
          style={{ background: "#424949" }}
          onClick={async() => {
            let results = await get_ai_response("creative");
            SetGrammarSug(results);
          }}
        >
          Creative suggestions
        </Button>
        <Button
          startIcon={<AutoAwesomeIcon />}
          className="grammar-ai-button"
          variant="contained"
          style={{ background: "#424949" }}
          onClick={async() => {
            let results = await get_ai_response("grammar");
            SetGrammarSug(results);
          }}
        >
          Grammar suggestions
        </Button>
        {console.log(GrammerSug)}

          <GenAIAccordian
              GeneratedResults={GrammerSug}
            />
        <div>
          <img
            className="app-logo"
            src="./src/assets/copilot_mascot.png"
            alt="logo"
          ></img>
          <div className="app-name">Copilot</div>
          <Box style={{ position: "relative", top: "5vh", left: "2.5vw" }}>
            <Typography
              sx={{
                border: "2px solid grey",
                borderRadius: "10px",
                width: "fit-content",
                height: "auto",
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
              initialValue={passedFileData.file_data}
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
                width: 650,
                menubar: true,
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
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
 // if()
}

export default TextEditor;
