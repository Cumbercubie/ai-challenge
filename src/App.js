import { Button, Container, Grid, List, ListItem, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
function App() {
  const [searchHistoryList, setSearchHistoryList] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  useEffect(() => {
    const query = JSON.parse(localStorage.getItem("query"));
    if (Array.isArray(query)) {
      setSearchHistoryList(query)
    }
  },[])
  const onSearch = () => {
    const value = document.getElementById("query-input")?.value;
    setSearchHistoryList([...searchHistoryList,value]);
    localStorage.setItem("query", JSON.stringify([...searchHistoryList,value]))
  }

  function importAll(r) {
    // let images = {};
    // console.log(r.keys());
    // r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return r.keys();
  }

  const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

  const handleClearSearchHistory = () => {
    setSearchHistoryList([]);
    localStorage.removeItem("query");
    document.getElementById("query-input").value = "";
  }

  const handleSelectImage = (i) => {
    console.log(!selectedImages.includes(i));
    if (!selectedImages.includes(i))
      setSelectedImages([...selectedImages, i])
    else
      setSelectedImages([...selectedImages.filter(image => image !== i)])
  }
  return (
    <Container maxWidth="xl">
      <Grid container direction={"row"}>
        {/* Column trai1 */}
        <Grid
          style={{
            margin: "1em",
            border: "2px solid grey",
            borderRadius: "10px",
            height: "700px",
            padding: "1em",
          }}
          item
          container
          direction="column"
          xs={12}
          md={6}
          lg={3}
          alignItems="center"
          justifyContent={"flex-start"}
        >
          <Typography variant="h5">Try with a custom caption</Typography>
          <TextField
            autoFocus
            id="query-input"
            onKeyPress={(e) => {
              console.log(e.key, e.value);
              if (e.key === "Enter") {
                onSearch();
              }
            }}
            fullWidth
            style={{ marginBottom: "1em" }}
          />
          <Grid
            item
            container
            spacing={2}
            direction="row"
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Grid item>
              <Button variant="contained">Submit</Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => handleClearSearchHistory()}
                color="inherit"
              >
                Clear history
              </Button>
            </Grid>
          </Grid>
          <Typography
            variant="h5"
            style={{
              display: "block",
              textAlign: "left",
              width: "100%",
              color: "gray",
              fontStyle: "italic",
            }}
          >
            History
          </Typography>
          <List style={{ width: "100%" }}>
            {searchHistoryList?.map((i) => (
              <ListItem>{i}</ListItem>
            ))}
          </List>
        </Grid>
        {/* Column phải */}
        <Grid
          style={{
            margin: "1em",
            border: "2px solid grey",
            borderRadius: "10px",
            maxHeight: "700px",
            overflow: "scroll",
            padding: "1em",
          }}
          item
          container
          direction={"row"}
          xs={12}
          md={6}
          lg={6}
          alignItems="center"
        >
          {images.map((i) => (
            <Grid item xs={3}>
              <img
                style={{border: selectedImages.includes(i) ? "5px solid red" : "unset"}}
                onClick={() => handleSelectImage(i)}
                src={i}
                width={150}
                height={150}
              />
            </Grid>
          ))}
        </Grid>
        <Grid
          style={{
            margin: "1em",
            border: "2px solid grey",
            borderRadius: "10px",
            maxHeight: "700px",
            overflow: "scroll",
            padding: "1em",
          }}
          item
          container
          direction={"row"}
          xs={12}
          md={2}
          lg={2}
          alignItems="flex-start"
        >
          <List>
            {selectedImages.map((i) => (
              <ListItem>
                <img
                  src={i}
                  width={150}
                  height={150}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
