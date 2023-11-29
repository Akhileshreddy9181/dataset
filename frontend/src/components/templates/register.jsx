import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";
import axios from "axios";
import backendConstants from "./backendConstants";
import { useAlert } from "react-alert";

import "./index.css";
import Navbar from "./Navbar";
//register form for publisher, we need name, username, email, password, confirm password

const defaultValues = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  groups: "2",
};

const Registerform = () => {
  const alert = useAlert();
  const [formValues, setFormValues] = useState(defaultValues);
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    //send the form values to the server
    event.preventDefault();
    //console.log(formValues);
    //check if the password and confirm password are the same
    if (formValues.password !== formValues.confirmPassword) {
      alert.show("password-mismatch", { type: "error" });
      return;
    }
    //send the form values to the server
    // http POST ":8000/users/register/"
    let url = backendConstants.url + "users/register/";
    console.log(url);
    axios
      .post("users/register/", formValues)
      .then((res) => {
        let user = res.data;
        localStorage.setItem("user", JSON.stringify(user));
        console.log("user", user);
        navigate("/mydatasets");
      })
      .catch((err) => {
        console.log("err", err);

        console.log("err request", err.request);
        console.log("err response", err.response);
        if (err.response.data) {
          //extract every entry from the response.data object and display the error
          for (let key in err.response.data) {
            alert.show(err.response.data[key], { type: "error" });
          }
        } else {
          alert.show(err.response.message, { type: "error" });
        }
      });
  };

  return (
    <>
      <Navbar />
      <div className="FormContainer">
        <Box
          component="img"
          sx={{
            height: "auto",
            width: "auto",
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
            alignSelf: "center",
            marginBottom: "10px"
          }}
          src="data:image/png;base64,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"
        />

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
            <div style={{ display: "flex", flexDirection: "row" }}>
              {/* setting up the registration form for publisher and admin  */}
              <TextField
                required
                id="first_name-input"
                name="first_name"
                label="First Name"
                type="text"
                variant="filled"
                value={formValues.first_name}
                onChange={handleInputChange}
                sx={{ width: "50%", margin: "10px" }}
                size="small"
              />

              <TextField
                required
                id="last_name-input"
                name="last_name"
                label="Last Name"
                type="text"
                variant="filled"
                value={formValues.last_name}
                onChange={handleInputChange}
                sx={{ width: "50%", margin: "10px" }}
                size="small"
              />
            </div>

            <TextField
              required
              id="username-input"
              name="username"
              label="Username"
              type="text"
              variant="filled"
              value={formValues.username}
              onChange={handleInputChange}
              sx={{ width: "40%", margin: "10px" }}
              size="small"
            />

            <TextField
              required
              id="email-input"
              name="email"
              label="Email"
              type="email"
              variant="filled"
              value={formValues.email}
              onChange={handleInputChange}
              sx={{ width: "40%", margin: "10px" }}
              size="small"
            />

            <TextField
              required
              id="password-input"
              name="password"
              label="Password"
              type="password"
              variant="filled"
              value={formValues.password}
              onChange={handleInputChange}
              sx={{ width: "40%", margin: "10px" }}
              size="small"
            />

            <TextField
              required
              id="confirm-password-input"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              variant="filled"
              value={formValues.confirmPassword}
              onChange={handleInputChange}
              sx={{ width: "40%", margin: "10px" }}
              size="small"
            />

            <div
              style={{
                flexDirection: "row",
                display: "flex",
                marginTop: "5vh",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ marginRight: "20px", width: "8vw" }}
              >
                Register
              </Button>
              {/* //Navigationa and data sending to the back end */}
              <Button
                variant="contained"
                color="primary"
                sx={{ marginLeft: "20px", width: "7vw" }}
                onClick={() => {
                  navigate("/login", {});
                }}
              >
                Login
              </Button>
            </div>
          </Grid>
        </form>
      </div>
    </>
  );
};

export default Registerform;