import React from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Row, Col } from "antd";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";

const GenAIAccordian = (GeneratedResults) => {
  const data = GeneratedResults;

  return (
    <Box
      style={{
        width: "35vw",
        left: "60vw",
        top: "21vh",
        padding: "10px",
        position: "absolute",
        overflowX: "hidden",
        height: "73vh",
        msOverflowStyle: "none",
      }}
      sx={{
        boxShadow: "0 0 10px 10px #b400ff",
        borderRadius: "15px",
      }}
    >
      <Row
        gutter={[0, 16]}
        style={{
          maxHeight: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {Object.entries(data).map(([original, corrected], index) => (
          <Col span={15} key={index}>
            <Card
              style={{
                display: "flex",
                alignItems: "center",
                width: "160%",
                height: "100%",
                background: "#222222",
                color: "white",
                borderRadius: "10px",
              }}
            >
              <CardContent>
                <Typography variant="body1">{original}</Typography>
                <Typography variant="body1">{corrected}</Typography>
                <Button
                  style={{
                    background: "#424949",
                    position: "relative",
                    top: "2vh",
                    borderRadius: "10px",
                  }}
                  startIcon={<EditIcon />}
                  variant="contained"
                >
                  replace
                </Button>
              </CardContent>
            </Card>
          </Col>
        ))}
      </Row>
    </Box>
  );
};

export default GenAIAccordian;