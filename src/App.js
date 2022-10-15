import { Avatar, Button, Container, Grid, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { reorder } from "./utils/utils";
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
    document.getElementById("query-input").value = "";
    localStorage.setItem("query", JSON.stringify([...searchHistoryList,value]))
  }

  function importAll(r) {
    // let images = {};
    // console.log(r.keys());
    // r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return r.keys();
  }


  const images = importAll(require.context('../public', false, /\.(png|jpe?g|svg)$/));

  const handleClearSearchHistory = () => {
    setSearchHistoryList([]);
    localStorage.removeItem("query");
    document.getElementById("query-input").value = "";
  }

  const handleSelectImage = (i) => {
    if (!selectedImages.includes(i))
      setSelectedImages([...selectedImages, i])
    else
      setSelectedImages([...selectedImages.filter(image => image !== i)])
  }

  const onDragEnd = ({ destination, source }) => {
    // dropped outside the list
    if (!destination) return;
    const newItems = reorder(selectedImages, source.index, destination.index);
    setSelectedImages(newItems);
  };
  return (
    <Container maxWidth="xl">
      <Grid container direction={"row"}>
        {/* Column trái */}
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
          <Typography variant="h5" style={{ marginBottom: "1em"}}>Try with a custom caption</Typography>
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
          <br />
          <Typography
            variant="h6"
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
          <List  style={{ width: "100%", height: "400px", overflow: "auto" }}>
            {searchHistoryList?.map((i) => (
              <ListItem alignItems="flex-start" key={i}>{i}</ListItem>
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
            <Grid key={i} item xs={4}>
              <img
                alt={i}
                style={{
                  border: selectedImages.includes(i)
                    ? "3px solid red"
                    : "unset",
                }}
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
            padding: "1em",
          }}
          item
          container
          direction={"row"}
          xs={12}
          md={2}
          lg={2}
          alignContent={"flex-start"}
          alignItems="flex-start"
          justifyContent={"flex-start"}
        >
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            style={{
              marginBottom: "1em",
            }}
          >
            <Button variant="contained">Export</Button>
          </Grid>
          <Typography style={{width: "100%", textAlign:"center"}}>Đã chọn: {selectedImages?.length || 0}</Typography>
          <Grid
            item
            xs={12}
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable-list">
                {(provided) => (
                  <div
                    style={{ overflow: "auto", height: "600px" }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {selectedImages.map((i, index) => (
                      <Draggable key={i} draggableId={i} index={index}>
                        {(provided, snapshot) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ListItemAvatar>
                              <Avatar
                                src={i}
                                width={64}
                                height={64}
                                sx={{
                                  width: 64,
                                  height: 64,
                                  marginRight: "0.5em",
                                }}
                              />
                            </ListItemAvatar>
                            <ListItemText primary={i.replace("./", "")} />
                          </ListItem>
                        )}
                      </Draggable>
                    ))}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
