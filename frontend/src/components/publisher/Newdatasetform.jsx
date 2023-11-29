import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import axios from "axios";
import { Box } from "@mui/system";
import backendConstants from "../templates/backendConstants";
import { useNavigate } from "react-router";
import { Audio } from "react-loader-spinner";
import { TailSpin } from "react-loader-spinner";
import Navbar from "../templates/Navbar";
import "./index.css";
import Button from "@mui/material/Button";
import { useAlert } from "react-alert";

// form for publisher to enter new data set
const defaultValues = {
  name: "",
  description: "",
  source: "",
  status: "R",
  reference: null,
  //publisher: JSON.parse(localStorage.getItem('user')).id,
};
const Newdatasetform = () => {
  let navigate = useNavigate();
  //check if user is publsiher only then give access else redirect to login page
  React.useEffect(() => {
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

  const alert = useAlert();
  const [formValues, setFormValues] = useState(defaultValues);
  const [load, setLoad] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const boolvalue = name === "reference";
    if (!boolvalue) {
      setFormValues({
        ...formValues,
        [name]: value,
      });
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

  const handleSubmit = (event) => {
    event.preventDefault();
    //through an alert if reference is not selected
    if (formValues.reference == null) {
      alert.show("Please select a file", { type: "error" });
      return;
    }

    //post these dataset to the url 10.1.38.115:8000/api/tempdatasets/
    var formData = new FormData();
    formData.append("name", formValues.name);
    formData.append("description", formValues.description);
    formData.append("source", formValues.source);
    formData.append("status", formValues.status);
    formData.append(
      "reference",
      formValues.reference,
      formValues.reference.name
    );
    //console.log(formValues);

    let url = backendConstants.url + "tempdatasets/";
    setLoad(true);
    //sending data to backend for storage
    axios
      .post(
        "api/tempdatasets/",
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
        setLoad(false);
        console.log("res", res);
        alert.show("Dataset created successfully", { type: "success" });
        setFormValues(defaultValues);
        navigate("/mypendingdatasets");
      })
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
          marginTop: "7vh",
        }}
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQ4AAAC6CAMAAABoQ1NAAAAAYFBMVEX///8AsPAArO8Aqe8ArvDb8fyx3vjg9P0ptvEAqO+o2/jw+f614PnW7vw4uPGQ0vbD5vp2yfSCzfXq9v33/P684/lMvPJvxvRZwPPO6vur3PhZv/Oh2PeX1PfQ6/tkw/MvI+hEAAAExUlEQVR4nO2dcXOyMAzGR1onOK2gzDl1+v2/5Qs43XSg2KZp8X1+f+x2tztMH9PQNGn38gIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADBc3maf08lksnnfj8rQtoRltCkMKUWkK6j6LdnO8/9Uk7xIlNbJFUSZ+RqHtk2a8aJyiWspTmhlNqENlGS/Up1anJxk8RbaSiFmRt3W4iiIWoQ2VILy0EeMo4e8hjbWO5t70+RCELMMba9XyjX1F6NGPbODjP6+WO/q8RHaaG+8940av9HmSddlOxs1Kj2Sp3zlzu3UqAV5woBq6RtHPZ7OP6YOalSENp+ZmZsaehV6AKyUD79gr6BmxV4uZ7P9bLYc+rtm5SpHQvPCaFXvjVD1U5tiNws9KGs2D65FW/W4VFRrUuvNIEPsm1vg6ETrbPseenCPc3CeKt2QnoQe3oPsPTnHQAUxXtWoBUkHFFY//TpHQzacnbOtx8hxRqcDyWuWmYAaFSoPPdJezBnWHL3IBlGMEBKjQn2FHut9RgKB9KzHLvRo7/IlNVcaPaahh3uPlaAalR6xL0AknaNCx537S4aORo5t6BHfZCrsHZGHD9FI2kAxT5cP+xX64xW7oxwxpy9razloYVW0q6ZLxNmLdXJfx0S79b2O2D1SWzmaysrBSo+Io4etGHTcFDY2c43i3R2z9I7T6tKuPmPCjvkGdrFDnffHxzbhVMVZb1i+76y8g+Y/z8ht9EiNWR0WuzweWcrpB6nu1tFb6MPvB9lW/jVpypIiij2yfG0pRT2Oq6lfuCxsNVEROst9Ta21qLl+TzoWeLUyIV0kT5zyFPW3Id1JjeaZZhRAiJpy7ZbSZ59/n7l0zwOzQl6KitxpmlTfY+sSiqGsSUkAB7Fvh/s2uuNLfGXYRZLv2LXLMX7o7nniqNaoedfT/bB1trn72Y92b7fqIZrruvrGKW9rJ2Uo9Ur6x8JVjdtVAeduu+YjxOKH5d7VL1PvbPpaZXN/PkTo/eLc/0V3HTln6QWQEMO9VfIyb2vHpY/7/Dki4dR1qlznbe04ZXPftCQB/Lga2bOY6N6uK1Kne3X82noXA5zVEClr22+YN1BvC0t3OfpEKTecUyyTnmh9246S05+No/A13rdSC7bmwPajs7x9AN7bcvlaJSXkSDwfjmG0VkSOzK8ck4F5B7XsuDHCFzpk5PAcPBjb4WTk8LtQZ7RURo61VzkYG55E5PBc02Y09gnkKCHHBZDjAsbzO88QShkPu8nI4bdCObhlmN+DHruByUF+Gxwcr1+4sFQkhfPcacm3DhORw3dnoUPn+RUi2z++z4jlbO4hIYf/pnU2UyXk8H9TDNu7RUAO5Xfzp4FrtgjIIdGizXF/S41/OdReQA7XwtMJ2o1b4AvViZa5w5Cl+yKpb21tgXN/SeiwC0e3gX8k4ugRvrWYP0jw1gKro0mikOjlp7HrQX63fQamh6xv1HxEHE+lm45ron2/aM97Ph2MU/FT931Qq1Dn4iacqyYeSAe8mrCcU1SCUBL6nPEkjcVFtFrFcKPH+MsosrxzgkmI+h/grHbR3NdQfk4Wa5NQEBKzXmxCHxkFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM/GP/O/SW3fCj5HAAAAAElFTkSuQmCC"
      />

      <div className="myDatasets-heading">
        <h2>NEW DATASET UPLOAD</h2>
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
          {/* //form forentering new dataset details */}

          <TextField
            id="name-input"
            name="name"
            label="Name of the Dataset"
            type="text"
            variant="filled"
            value={formValues.name}
            onChange={handleInputChange}
            sx={{ width: "50%", margin: "10px" }}
            required
          />

          <TextField
            id="filled-textarea"
            name="description"
            label="Description"
            type="text"
            variant="filled"
            value={formValues.description}
            onChange={handleInputChange}
            sx={{ width: "50%", margin: "10px" }}
            required
          />

          {/* create a filed for collecting source url */}
          <TextField
            id="source"
            name="source"
            label="Source"
            type="url"
            variant="filled"
            value={formValues.source}
            onChange={handleInputChange}
            sx={{ width: "50%", margin: "10px" }}
            required
          />
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
export default Newdatasetform;