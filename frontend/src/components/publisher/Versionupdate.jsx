import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import axios from "axios";
import { Box } from "@mui/system";
import { useNavigate } from "react-router";
import { Audio } from "react-loader-spinner";
import { TailSpin } from "react-loader-spinner";
import { useParams } from "react-router";
import Navbar from "../templates/Navbar";

import Button from "@mui/material/Button";
import { useAlert } from "react-alert";

const Versionupdate = () => {
  let navigate = useNavigate();
  const params = useParams();

  const defaultValues = {
    comment: "",
    reference: null,
    dataset: params.id,
  };

  // check the accessability for various users, here for admin
  React.useEffect(() => {
    console.log(params.id);
    if (localStorage.getItem("user")) {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user.group == "publisher") {
        //do nothing
      } else if (user.group == "admin") {
        navigate("/approve");
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);
  //handling the new version form and sending data to backend
  const alert = useAlert();
  const [formValues, setFormValues] = useState(defaultValues);
  const [load, setLoad] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const boolvalue = name === "reference";
    if (!boolvalue) {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const hiddenFileInput = React.useRef(null);

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    setFormValues({
      ...formValues,
      reference: fileUploaded,
    });
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  // new file handling and sending to backend
  const handleSubmit = (event) => {
    event.preventDefault();
    if (formValues.reference == null) {
      alert.show("Please select a file", { type: "error" });
      return;
    }

    var formData = new FormData();
    formData.append("comment", formValues.comment);
    formData.append("status", formValues.status);
    formData.append(
      "reference",
      formValues.reference,
      formValues.reference.name
    );
    formData.append("dataset", formValues.dataset);

    setLoad(true);
    axios
      .post(
        "api/versions/",
        formData,
        {
          headers: {
            Authorization:
              "Token " + JSON.parse(localStorage.getItem("user")).token,
          },
        },
        {}
      )
      .then((res) => {
        console.log(res);
        setLoad(false);
        alert.show("Version updated successfully", { type: "success" });
        setFormValues(defaultValues);
        navigate("/" + params.id);
      })
      //error handling if any problem is faced while adding dataset
      .catch((err) => {
        setLoad(false);
        console.log("err request", err.request);
        console.log("err response", err.response);
        if (err.response.data.reference) {
          alert.show(err.response.data.reference[0], { type: "error" });
        } else {
          alert.show(err.response.data.detail, { type: "error" });
        }
      });
  };

  //front end for form filling
  return (
    <div className="myDatasets">
      <Navbar />
      <Box
        component="img"
        sx={{
          height: 200,
          width: 200,
          maxHeight: { xs: 233, md: 167 },
          maxWidth: { xs: 350, md: 250 },
          alignSelf: "center",
          marginTop: "5vh",
        }}
        src="data:image/jpeg;base64,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"
      />
      <div className="myDatasets-heading">
        <h2>Add a new Version </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        sx={{ alignItems: "center", justifyContent: "center" }}
      >
        <Grid
          container
          alignItems="center"
          justify="center"
          display="flex"
          direction="column"
        >
          {/* // form for adding new version for a dataset */}

          <TextField
            id="filled-textarea"
            name="comment"
            label="Commit Message, describe the changes in a few sentences"
            type="text"
            variant="filled"
            value={formValues.comment}
            onChange={handleInputChange}
            sx={{ width: "50%", margin: "10px" }}
            required
          />
          {/* create a filed for collecting source url */}

          <div
            style={{
              margin: "20px",
              alignSelf: "flex-start",
              display: "flex",
              flexDirection: "row",
            }}
          >
            {/* create a styled button for collecting reference */}
            <Button variant="contained" color="primary" onClick={handleClick}>
              Upload a file
            </Button>
            <input
              type="file"
              style={{ display: "none" }}
              ref={hiddenFileInput}
              onChange={handleChange}
            />
            {formValues.reference && (
              <Typography
                mt={2}
                sx={{ fontSize: "10px", color: "green", margin: "10px" }}
              >
                {formValues.reference.name}
              </Typography>
            )}
          </div>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={load}
          >
            Submit
          </Button>

          {load && (
            <div
              style={{
                width: "100%",
                height: "100",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: "5%",
              }}
            >
              <TailSpin
                color="#00BFFF"
                height={160}
                width={160}
                ariaLabel="loading"
              />
            </div>
          )}
        </Grid>
      </form>
    </div>
  );
};

export default Versionupdate;
